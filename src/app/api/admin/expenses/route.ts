import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/admin-session-guard";
import { isSheetsConfigured, listExpenses } from "@/lib/google-sheets";

const NOT_CONFIGURED_MESSAGE =
  "Google Sheets bağlantısı henüz yapılandırılmamış. Kurulum için docs/admin-panel-kurulum.md dosyasına bakın.";

/** Tüm siparişlerdeki giderleri tek seferde döner — özellikle Siparişler
 * sayfasındaki "yaklaşan gider" hatırlatma bölümü için. */
export async function GET() {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Oturum gerekli." }, { status: 401 });

  if (!isSheetsConfigured()) {
    return NextResponse.json({ error: NOT_CONFIGURED_MESSAGE, configured: false }, { status: 200 });
  }

  try {
    const expenses = await listExpenses();
    return NextResponse.json({ expenses, configured: true });
  } catch (error) {
    console.error("[api/admin/expenses] listExpenses hata:", error);
    return NextResponse.json({ error: "Giderler alınırken bir hata oluştu." }, { status: 500 });
  }
}
