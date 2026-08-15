import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/admin-session-guard";
import { isSheetsConfigured, listTrash } from "@/lib/google-sheets";

const NOT_CONFIGURED_MESSAGE =
  "Google Sheets bağlantısı henüz yapılandırılmamış. Kurulum için docs/admin-panel-kurulum.md dosyasına bakın.";

export async function GET() {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Oturum gerekli." }, { status: 401 });

  if (!isSheetsConfigured()) {
    return NextResponse.json({ error: NOT_CONFIGURED_MESSAGE, configured: false }, { status: 200 });
  }

  try {
    const entries = await listTrash();
    return NextResponse.json({ entries, configured: true });
  } catch (error) {
    console.error("[api/admin/trash] listTrash hata:", error);
    return NextResponse.json({ error: "Çöp kutusu alınırken bir hata oluştu." }, { status: 500 });
  }
}
