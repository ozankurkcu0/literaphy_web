import { NextResponse } from "next/server";
import { z } from "zod";
import { normalizePhone, verifyAdminCredentials } from "@/lib/admin-accounts";
import { createSessionToken, SESSION_COOKIE_NAME, SESSION_MAX_AGE_SECONDS } from "@/lib/admin-auth";
import { checkLoginRateLimit, recordFailedLoginAttempt, resetLoginRateLimit } from "@/lib/login-rate-limit";

const bodySchema = z.object({
  phone: z.string().min(1, "Telefon numarası gerekli."),
  password: z.string().min(1, "Şifre gerekli."),
});

export async function POST(request: Request) {
  const json = await request.json().catch(() => null);
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Telefon numarası ve şifre gerekli." }, { status: 400 });
  }

  const rateLimitKey = normalizePhone(parsed.data.phone);
  const rateLimit = checkLoginRateLimit(rateLimitKey);
  if (!rateLimit.allowed) {
    const minutes = Math.max(1, Math.ceil((rateLimit.retryAfterSeconds ?? 0) / 60));
    return NextResponse.json(
      { error: `Çok fazla hatalı deneme yapıldı. Lütfen ${minutes} dakika sonra tekrar deneyin.` },
      { status: 429 },
    );
  }

  const account = await verifyAdminCredentials(parsed.data.phone, parsed.data.password);
  if (!account) {
    recordFailedLoginAttempt(rateLimitKey);
    return NextResponse.json({ error: "Telefon numarası veya şifre hatalı." }, { status: 401 });
  }

  resetLoginRateLimit(rateLimitKey);

  const token = await createSessionToken({ phone: account.phone, name: account.name });

  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
  return response;
}
