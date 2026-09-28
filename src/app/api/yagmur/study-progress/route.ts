import { NextResponse } from "next/server";
import { z } from "zod";
import { requireYagmurSession } from "@/lib/yagmur-session-guard";
import { isSheetsConfigured, listYagmurStudyChecks, setYagmurStudyCheck } from "@/lib/google-sheets";
import { getCurrentWeekKey } from "@/lib/yagmur-study-plan";

const NOT_CONFIGURED_MESSAGE = "Google Sheets bağlantısı henüz yapılandırılmamış.";

const patchSchema = z.object({
  taskId: z.string().min(1),
  checked: z.boolean(),
});

export async function GET() {
  const authorized = await requireYagmurSession();
  if (!authorized) return NextResponse.json({ error: "Oturum gerekli." }, { status: 401 });

  if (!isSheetsConfigured()) {
    return NextResponse.json({ error: NOT_CONFIGURED_MESSAGE, configured: false }, { status: 200 });
  }

  const weekKey = getCurrentWeekKey();
  try {
    const checked = await listYagmurStudyChecks(weekKey);
    return NextResponse.json({ checked, weekKey, configured: true });
  } catch (error) {
    console.error("[api/yagmur/study-progress] listYagmurStudyChecks hata:", error);
    return NextResponse.json({ error: "Çalışma programı alınırken bir hata oluştu." }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const authorized = await requireYagmurSession();
  if (!authorized) return NextResponse.json({ error: "Oturum gerekli." }, { status: 401 });
  if (!isSheetsConfigured()) return NextResponse.json({ error: NOT_CONFIGURED_MESSAGE }, { status: 400 });

  const json = await request.json().catch(() => null);
  const parsed = patchSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Geçersiz form verisi." }, { status: 400 });
  }

  const weekKey = getCurrentWeekKey();
  try {
    await setYagmurStudyCheck(weekKey, parsed.data.taskId, parsed.data.checked);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[api/yagmur/study-progress] setYagmurStudyCheck hata:", error);
    const message = error instanceof Error ? error.message : "Kaydedilemedi.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
