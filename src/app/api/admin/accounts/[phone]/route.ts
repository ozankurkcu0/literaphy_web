import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/admin-session-guard";
import { listAdminAccountsSummary, normalizePhone, removeAdminAccount } from "@/lib/admin-accounts";

interface RouteParams {
  params: Promise<{ phone: string }>;
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Oturum gerekli." }, { status: 401 });

  const { phone: rawPhone } = await params;
  const phone = normalizePhone(decodeURIComponent(rawPhone));

  if (phone === normalizePhone(session.phone)) {
    return NextResponse.json({ error: "Kendi hesabınızı silemezsiniz." }, { status: 400 });
  }

  const existing = listAdminAccountsSummary();
  if (existing.length <= 1) {
    return NextResponse.json({ error: "Son admin hesabı silinemez." }, { status: 400 });
  }

  try {
    const result = removeAdminAccount(phone);
    return NextResponse.json(result);
  } catch (error) {
    console.error("[api/admin/accounts/:phone] removeAdminAccount hata:", error);
    return NextResponse.json({ error: "Hesap silinemedi." }, { status: 500 });
  }
}
