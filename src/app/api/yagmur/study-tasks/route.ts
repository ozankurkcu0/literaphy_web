import { NextResponse } from "next/server";
import { z } from "zod";
import { requireYagmurSession } from "@/lib/yagmur-session-guard";
import { WEEKDAYS } from "@/lib/calisma-program-constants";
import { STUDY_CATEGORIES } from "@/lib/yagmur-study-plan";
import { createYagmurCustomTask, isSheetsConfigured, listYagmurCustomTasks } from "@/lib/google-sheets";

const NOT_CONFIGURED_MESSAGE = "Google Sheets bağlantısı henüz yapılandırılmamış.";

const inputSchema = z.object({
  weekday: z.enum(WEEKDAYS),
  category: z.enum(STUDY_CATEGORIES as [string, ...string[]]),
  label: z.string().min(1, "Görev başlığı gerekli."),
});

export async function GET() {
  const authorized = await requireYagmurSession();
  if (!authorized) return NextResponse.json({ error: "Oturum gerekli." }, { status: 401 });

  if (!isSheetsConfigured()) {
    return NextResponse.json({ error: NOT_CONFIGURED_MESSAGE, configured: false }, { status: 200 });
  }

  try {
    const tasks = await listYagmurCustomTasks();
    return NextResponse.json({ tasks, configured: true });
  } catch (error) {
    console.error("[api/yagmur/study-tasks] listYagmurCustomTasks hata:", error);
    return NextResponse.json({ error: "Görevler alınırken bir hata oluştu." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const authorized = await requireYagmurSession();
  if (!authorized) return NextResponse.json({ error: "Oturum gerekli." }, { status: 401 });
  if (!isSheetsConfigured()) return NextResponse.json({ error: NOT_CONFIGURED_MESSAGE }, { status: 400 });

  const json = await request.json().catch(() => null);
  const parsed = inputSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Geçersiz form verisi." }, { status: 400 });
  }

  try {
    const task = await createYagmurCustomTask(parsed.data);
    return NextResponse.json({ task }, { status: 201 });
  } catch (error) {
    console.error("[api/yagmur/study-tasks] createYagmurCustomTask hata:", error);
    const message = error instanceof Error ? error.message : "Görev oluşturulamadı.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
