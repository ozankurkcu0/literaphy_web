import { NextResponse } from "next/server";
import { z } from "zod";
import { requireCalismaProgramSession } from "@/lib/calisma-program-session-guard";
import { createWeeklyNote, isSheetsConfigured, listWeeklyNotes } from "@/lib/google-sheets";

const NOT_CONFIGURED_MESSAGE = "Google Sheets bağlantısı henüz yapılandırılmamış.";

const inputSchema = z.object({
  weekStart: z.string().min(1, "Hafta gerekli."),
  text: z.string().min(1, "Not metni gerekli."),
  done: z.boolean().optional().default(false),
});

export async function GET() {
  const authorized = await requireCalismaProgramSession();
  if (!authorized) return NextResponse.json({ error: "Oturum gerekli." }, { status: 401 });

  if (!isSheetsConfigured()) {
    return NextResponse.json({ error: NOT_CONFIGURED_MESSAGE, configured: false }, { status: 200 });
  }

  try {
    const notes = await listWeeklyNotes();
    return NextResponse.json({ notes, configured: true });
  } catch (error) {
    console.error("[api/calisma-program/haftalik-notlar] listWeeklyNotes hata:", error);
    return NextResponse.json({ error: "Notlar alınırken bir hata oluştu." }, { status: 500 });
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
    const note = await createWeeklyNote(parsed.data);
    return NextResponse.json({ note }, { status: 201 });
  } catch (error) {
    console.error("[api/calisma-program/haftalik-notlar] createWeeklyNote hata:", error);
    const message = error instanceof Error ? error.message : "Not oluşturulamadı.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
