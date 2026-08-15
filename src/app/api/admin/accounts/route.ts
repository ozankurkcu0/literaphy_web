import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminSession } from "@/lib/admin-session-guard";
import { getAdminAccountsSource, listAdminAccountsSummary, upsertAdminAccount } from "@/lib/admin-accounts";
import { logActivity } from "@/lib/google-sheets";

const upsertSchema = z.object({
  phone: z.string().min(1, "Telefon numarası gerekli."),
  password: z.string().min(6, "Şifre en az 6 karakter olmalı."),
  name: z.string().optional().default(""),
});

export async function GET() {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Oturum gerekli." }, { status: 401 });

  return NextResponse.json({
    accounts: listAdminAccountsSummary(),
    source: getAdminAccountsSource(),
  });
}

export async function POST(request: Request) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Oturum gerekli." }, { status: 401 });

  const json = await request.json().catch(() => null);
  const parsed = upsertSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Geçersiz form verisi." }, { status: 400 });
  }

  try {
    const result = await upsertAdminAccount(parsed.data);
    logActivity(
      session.name || session.phone,
      "Admin eklendi/güncellendi",
      `${parsed.data.name || parsed.data.phone}`,
    );
    return NextResponse.json(result);
  } catch (error) {
    console.error("[api/admin/accounts] upsertAdminAccount hata:", error);
    return NextResponse.json({ error: "Hesap kaydedilemedi." }, { status: 500 });
  }
}
