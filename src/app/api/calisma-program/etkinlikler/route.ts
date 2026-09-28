import { NextResponse } from "next/server";
import { z } from "zod";
import { requireCalismaProgramSession } from "@/lib/calisma-program-session-guard";
import { SCHEDULE_EVENT_TYPES, createScheduleEvent, isSheetsConfigured, listScheduleEvents } from "@/lib/google-sheets";

const NOT_CONFIGURED_MESSAGE = "Google Sheets bağlantısı henüz yapılandırılmamış.";

const inputSchema = z.object({
  date: z.string().min(1, "Tarih gerekli."),
  startTime: z.string().optional().default(""),
  endTime: z.string().optional().default(""),
  type: z.enum(SCHEDULE_EVENT_TYPES),
  title: z.string().min(1, "Başlık gerekli."),
  note: z.string().optional().default(""),
  done: z.boolean().optional().default(false),
});

export async function GET() {
  const authorized = await requireCalismaProgramSession();
  if (!authorized) return NextResponse.json({ error: "Oturum gerekli." }, { status: 401 });

  if (!isSheetsConfigured()) {
    return NextResponse.json({ error: NOT_CONFIGURED_MESSAGE, configured: false }, { status: 200 });
  }

  try {
    const events = await listScheduleEvents();
    return NextResponse.json({ events, configured: true });
  } catch (error) {
    console.error("[api/calisma-program/etkinlikler] listScheduleEvents hata:", error);
    return NextResponse.json({ error: "Etkinlikler alınırken bir hata oluştu." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const authorized = await requireCalismaProgramSession();
  if (!authorized) return NextResponse.json({ error: "Oturum gerekli." }, { status: 401 });
  if (!isSheetsConfigured()) return NextResponse.json({ error: NOT_CONFIGURED_MESSAGE }, { status: 400 });

  const json = await request.json().catch(() => null);
  const parsed = inputSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Geçersiz form verisi." }, { status: 400 });
  }

  try {
    const event = await createScheduleEvent(parsed.data);
    return NextResponse.json({ event }, { status: 201 });
  } catch (error) {
    console.error("[api/calisma-program/etkinlikler] createScheduleEvent hata:", error);
    const message = error instanceof Error ? error.message : "Etkinlik oluşturulamadı.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
