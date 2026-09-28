import { NextResponse } from "next/server";
import { z } from "zod";
import { requireCalismaProgramSession } from "@/lib/calisma-program-session-guard";
import {
  TIMELINE_KINDS,
  WEEKDAYS,
  createClassScheduleEntry,
  isSheetsConfigured,
  listClassScheduleEntries,
} from "@/lib/google-sheets";

const NOT_CONFIGURED_MESSAGE = "Google Sheets bağlantısı henüz yapılandırılmamış.";

const inputSchema = z.object({
  weekday: z.enum(WEEKDAYS),
  startTime: z.string().min(1, "Başlangıç saati gerekli."),
  endTime: z.string().min(1, "Bitiş saati gerekli."),
  courseName: z.string().min(1, "Başlık gerekli."),
  location: z.string().optional().default(""),
  note: z.string().optional().default(""),
  kind: z.enum(TIMELINE_KINDS).optional().default("Ders"),
});

export async function GET() {
  const authorized = await requireCalismaProgramSession();
  if (!authorized) return NextResponse.json({ error: "Oturum gerekli." }, { status: 401 });

  if (!isSheetsConfigured()) {
    return NextResponse.json({ error: NOT_CONFIGURED_MESSAGE, configured: false }, { status: 200 });
  }

  try {
    const entries = await listClassScheduleEntries();
    return NextResponse.json({ entries, configured: true });
  } catch (error) {
    console.error("[api/calisma-program/ders-programi] listClassScheduleEntries hata:", error);
    return NextResponse.json({ error: "Ders programı alınırken bir hata oluştu." }, { status: 500 });
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
    const entry = await createClassScheduleEntry(parsed.data);
    return NextResponse.json({ entry }, { status: 201 });
  } catch (error) {
    console.error("[api/calisma-program/ders-programi] createClassScheduleEntry hata:", error);
    const message = error instanceof Error ? error.message : "Ders kaydı oluşturulamadı.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
