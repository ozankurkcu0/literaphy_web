import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/admin-session-guard";
import { isSheetsConfigured, listTrash, logActivity, permanentlyDeleteTrashEntry, restoreFromTrash } from "@/lib/google-sheets";

const NOT_CONFIGURED_MESSAGE =
  "Google Sheets bağlantısı henüz yapılandırılmamış. Kurulum için docs/admin-panel-kurulum.md dosyasına bakın.";

interface RouteParams {
  params: Promise<{ trashId: string }>;
}

export async function POST(_request: Request, { params }: RouteParams) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Oturum gerekli." }, { status: 401 });
  if (!isSheetsConfigured()) return NextResponse.json({ error: NOT_CONFIGURED_MESSAGE }, { status: 400 });

  const { trashId } = await params;

  try {
    const entries = await listTrash();
    const entry = entries.find((item) => item.trashId === trashId);
    await restoreFromTrash(trashId);
    logActivity(
      session.name || session.phone,
      entry?.type === "Gider" ? "Gider geri getirildi" : "Sipariş geri getirildi",
      entry?.summary ?? trashId,
    );
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[api/admin/trash/:trashId] restoreFromTrash hata:", error);
    const message = error instanceof Error ? error.message : "Kayıt geri getirilemedi.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Oturum gerekli." }, { status: 401 });
  if (!isSheetsConfigured()) return NextResponse.json({ error: NOT_CONFIGURED_MESSAGE }, { status: 400 });

  const { trashId } = await params;

  try {
    const entries = await listTrash();
    const entry = entries.find((item) => item.trashId === trashId);
    await permanentlyDeleteTrashEntry(trashId);
    logActivity(session.name || session.phone, "Çöp kutusundan kalıcı silindi", entry?.summary ?? trashId);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[api/admin/trash/:trashId] permanentlyDeleteTrashEntry hata:", error);
    const message = error instanceof Error ? error.message : "Kayıt kalıcı silinemedi.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
