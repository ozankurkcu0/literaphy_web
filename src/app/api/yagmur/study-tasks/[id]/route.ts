import { NextResponse } from "next/server";
import { requireYagmurSession } from "@/lib/yagmur-session-guard";
import { deleteYagmurCustomTask, isSheetsConfigured } from "@/lib/google-sheets";

const NOT_CONFIGURED_MESSAGE = "Google Sheets bağlantısı henüz yapılandırılmamış.";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  const authorized = await requireYagmurSession();
  if (!authorized) return NextResponse.json({ error: "Oturum gerekli." }, { status: 401 });
  if (!isSheetsConfigured()) return NextResponse.json({ error: NOT_CONFIGURED_MESSAGE }, { status: 400 });

  const { id } = await params;

  try {
    await deleteYagmurCustomTask(id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[api/yagmur/study-tasks/:id] deleteYagmurCustomTask hata:", error);
    const message = error instanceof Error ? error.message : "Görev silinemedi.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
