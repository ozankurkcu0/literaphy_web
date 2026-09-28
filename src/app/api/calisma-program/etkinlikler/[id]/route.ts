import { NextResponse } from "next/server";
import { z } from "zod";
import { requireCalismaProgramSession } from "@/lib/calisma-program-session-guard";
import { SCHEDULE_EVENT_TYPES, deleteScheduleEvent, isSheetsConfigured, updateScheduleEvent } from "@/lib/google-sheets";

const patchSchema = z.object({
  date: z.string().optional(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  type: z.enum(SCHEDULE_EVENT_TYPES).optional(),
  title: z.string().optional(),
  note: z.string().optional(),
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
    const event = await updateScheduleEvent(id, parsed.data);
    return NextResponse.json({ event });
  } catch (error) {
    console.error("[api/calisma-program/etkinlikler/:id] updateScheduleEvent hata:", error);
    const message = error instanceof Error ? error.message : "Etkinlik güncellenemedi.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  const authorized = await requireCalismaProgramSession();
  if (!authorized) return NextResponse.json({ error: "Oturum gerekli." }, { status: 401 });
  if (!isSheetsConfigured()) return NextResponse.json({ error: NOT_CONFIGURED_MESSAGE }, { status: 400 });

  const { id } = await params;

  try {
    await deleteScheduleEvent(id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[api/calisma-program/etkinlikler/:id] deleteScheduleEvent hata:", error);
    const message = error instanceof Error ? error.message : "Etkinlik silinemedi.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
