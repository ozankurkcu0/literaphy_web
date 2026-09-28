import { NextResponse } from "next/server";
import { z } from "zod";
import { requireCalismaProgramSession } from "@/lib/calisma-program-session-guard";
import {
  TIMELINE_KINDS,
  WEEKDAYS,
  deleteClassScheduleEntry,
  isSheetsConfigured,
  updateClassScheduleEntry,
} from "@/lib/google-sheets";

const patchSchema = z.object({
  weekday: z.enum(WEEKDAYS).optional(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  courseName: z.string().optional(),
  location: z.string().optional(),
  note: z.string().optional(),
  kind: z.enum(TIMELINE_KINDS).optional(),
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
    const entry = await updateClassScheduleEntry(id, parsed.data);
    return NextResponse.json({ entry });
  } catch (error) {
    console.error("[api/calisma-program/ders-programi/:id] updateClassScheduleEntry hata:", error);
    const message = error instanceof Error ? error.message : "Ders kaydı güncellenemedi.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  const authorized = await requireCalismaProgramSession();
  if (!authorized) return NextResponse.json({ error: "Oturum gerekli." }, { status: 401 });
  if (!isSheetsConfigured()) return NextResponse.json({ error: NOT_CONFIGURED_MESSAGE }, { status: 400 });

  const { id } = await params;

  try {
    await deleteClassScheduleEntry(id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[api/calisma-program/ders-programi/:id] deleteClassScheduleEntry hata:", error);
    const message = error instanceof Error ? error.message : "Ders kaydı silinemedi.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
