import { NextResponse } from "next/server";
import { requireYagmurSession } from "@/lib/yagmur-session-guard";
import { z } from "zod";
import { STUDY_CATEGORIES } from "@/lib/yagmur-study-plan";
import { deleteYagmurCustomTask, isSheetsConfigured, updateYagmurTask } from "@/lib/google-sheets";

const NOT_CONFIGURED_MESSAGE = "Google Sheets bağlantısı henüz yapılandırılmamış.";

const patchSchema = z.object({
  category: z.enum(STUDY_CATEGORIES as [string, ...string[]]),
  label: z.string().trim().min(1, "Görev başlığı gerekli."),
});

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

export async function PATCH(request: Request, { params }: RouteParams) {
  const authorized = await requireYagmurSession();
  if (!authorized) return NextResponse.json({ error: "Oturum gerekli." }, { status: 401 });
  if (!isSheetsConfigured()) return NextResponse.json({ error: NOT_CONFIGURED_MESSAGE }, { status: 400 });

  const json = await request.json().catch(() => null);
  const parsed = patchSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Geçersiz form verisi." }, { status: 400 });
  }

  const { id } = await params;

  try {
    const task = await updateYagmurTask(id, parsed.data);
    return NextResponse.json({ task });
  } catch (error) {
    console.error("[api/yagmur/study-tasks/:id] updateYagmurTask hata:", error);
    const message = error instanceof Error ? error.message : "Görev güncellenemedi.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
