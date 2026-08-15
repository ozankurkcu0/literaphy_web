import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/admin-session-guard";
import { isGmailInboxConfigured, listLeads } from "@/lib/gmail-inbox";

const NOT_CONFIGURED_MESSAGE =
  "Gmail gelen kutusu bağlantısı henüz yapılandırılmamış. Kurulum için docs/admin-panel-kurulum.md dosyasına bakın.";

export async function GET() {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Oturum gerekli." }, { status: 401 });

  if (!isGmailInboxConfigured()) {
    return NextResponse.json({ error: NOT_CONFIGURED_MESSAGE, configured: false }, { status: 200 });
  }

  try {
    const leads = await listLeads(30);
    return NextResponse.json({ leads, configured: true });
  } catch (error) {
    console.error("[api/admin/inbox] listLeads hata:", error);
    const message = error instanceof Error ? error.message : "Gelen kutusu alınamadı.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
