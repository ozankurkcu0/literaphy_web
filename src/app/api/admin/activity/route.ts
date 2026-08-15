import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/admin-session-guard";
import { isSheetsConfigured, listActivity } from "@/lib/google-sheets";

const NOT_CONFIGURED_MESSAGE =
  "Google Sheets bağlantısı henüz yapılandırılmamış. Kurulum için docs/admin-panel-kurulum.md dosyasına bakın.";

export async function GET() {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Oturum gerekli." }, { status: 401 });

  if (!isSheetsConfigured()) {
    return NextResponse.json({ error: NOT_CONFIGURED_MESSAGE, configured: false }, { status: 200 });
  }

  try {
    const entries = await listActivity(150);
    return NextResponse.json({ entries, configured: true });
  } catch (error) {
    console.error("[api/admin/activity] listActivity hata:", error);
    return NextResponse.json({ error: "Aktivite kayıtları alınırken bir hata oluştu." }, { status: 500 });
  }
}
