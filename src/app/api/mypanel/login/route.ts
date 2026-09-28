import { NextResponse } from "next/server";
import { z } from "zod";
import {
  checkMypanelPassword,
  createMypanelSessionToken,
  MYPANEL_SESSION_COOKIE_NAME,
  MYPANEL_SESSION_MAX_AGE_SECONDS,
} from "@/lib/mypanel-auth";
import { checkLoginRateLimit, recordFailedLoginAttempt, resetLoginRateLimit } from "@/lib/login-rate-limit";

const bodySchema = z.object({ password: z.string().min(1, "Şifre gerekli.") });

// Tek kullanıcı/tek şifre olduğu için rate-limit anahtarı sabit.
const RATE_LIMIT_KEY = "mypanel";

export async function POST(request: Request) {
  const json = await request.json().catch(() => null);
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Şifre gerekli." }, { status: 400 });
  }

  const rateLimit = checkLoginRateLimit(RATE_LIMIT_KEY);
  if (!rateLimit.allowed) {
    const minutes = Math.max(1, Math.ceil((rateLimit.retryAfterSeconds ?? 0) / 60));
    return NextResponse.json(
      { error: `Çok fazla hatalı deneme yapıldı. Lütfen ${minutes} dakika sonra tekrar deneyin.` },
      { status: 429 },
    );
  }

  let correct: boolean;
  try {
    correct = checkMypanelPassword(parsed.data.password);
  } catch (error) {
    console.error("[api/mypanel/login] yapılandırma hatası:", error);
    return NextResponse.json({ error: "Sayfa henüz yapılandırılmamış." }, { status: 500 });
  }

  if (!correct) {
    recordFailedLoginAttempt(RATE_LIMIT_KEY);
    return NextResponse.json({ error: "Şifre hatalı." }, { status: 401 });
  }

  resetLoginRateLimit(RATE_LIMIT_KEY);
  const token = await createMypanelSessionToken();

  const response = NextResponse.json({ ok: true });
  response.cookies.set(MYPANEL_SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MYPANEL_SESSION_MAX_AGE_SECONDS,
  });
  return response;
}
