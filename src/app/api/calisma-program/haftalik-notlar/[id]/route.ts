import { NextResponse } from "next/server";
import { z } from "zod";
import { requireCalismaProgramSession } from "@/lib/calisma-program-session-guard";
import { deleteWeeklyNote, isSheetsConfigured, updateWeeklyNote } from "@/lib/google-sheets";

const patchSchema = z.object({
  weekStart: z.string().optional(),
  text: z.string().optional(),
  done: z.boolean().optional(),
});

const NOT_CONFIGURED_MESSAGE = "Google Sheets bağlantısı henüz yapılandırılmamış.";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: Request, { params }: RouteParams) {
  const authorized = await requireCalismaProgramSession();
  if (!authorized) return NextResponse.json({ error: "Oturum gerekli." }, { status: 401 });
  if (!isSheetsConfigured()) return NextResponse.json({ error: NOT_CONFIGURED_MESSAGE }, { status: 400 });

  const { id } = await params;
  const json = await request.json().catch(() => null);
  const parsed = patchSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Geçersiz form verisi." }, { status: 400 });
  }

  try {
    const note = await updateWeeklyNote(id, parsed.data);
    return NextResponse.json({ note });
  } catch (error) {
    console.error("[api/calisma-program/haftalik-notlar/:id] updateWeeklyNote hata:", error);
    const message = error instanceof Error ? error.message : "Not güncellenemedi.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  const authorized = await requireCalismaProgramSession();
  if (!authorized) return NextResponse.json({ error: "Oturum gerekli." }, { status: 401 });
  if (!isSheetsConfigured()) return NextResponse.json({ error: NOT_CONFIGURED_MESSAGE }, { status: 400 });

  const { id } = await params;

  try {
    await deleteWeeklyNote(id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[api/calisma-program/haftalik-notlar/:id] deleteWeeklyNote hata:", error);
    const message = error instanceof Error ? error.message : "Not silinemedi.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
