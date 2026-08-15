import { NextResponse } from "next/server";
import { z } from "zod";
import { verifyAdminCredentials } from "@/lib/admin-accounts";
import { createSessionToken, SESSION_COOKIE_NAME, SESSION_MAX_AGE_SECONDS } from "@/lib/admin-auth";

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

  const account = await verifyAdminCredentials(parsed.data.phone, parsed.data.password);
  if (!account) {
    return NextResponse.json({ error: "Telefon numarası veya şifre hatalı." }, { status: 401 });
  }

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
