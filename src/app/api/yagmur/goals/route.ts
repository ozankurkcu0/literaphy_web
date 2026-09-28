import { NextResponse } from "next/server";
import { requireYagmurSession } from "@/lib/yagmur-session-guard";
import { isSheetsConfigured, listYagmurGoals } from "@/lib/google-sheets";

const NOT_CONFIGURED_MESSAGE = "Google Sheets bağlantısı henüz yapılandırılmamış.";

export async function GET() {
  const authorized = await requireYagmurSession();
  if (!authorized) return NextResponse.json({ error: "Oturum gerekli." }, { status: 401 });

  if (!isSheetsConfigured()) {
    return NextResponse.json({ error: NOT_CONFIGURED_MESSAGE, configured: false }, { status: 200 });
  }

  try {
    const goals = await listYagmurGoals();
    return NextResponse.json({ goals, configured: true });
  } catch (error) {
    console.error("[api/yagmur/goals] listYagmurGoals hata:", error);
    return NextResponse.json({ error: "Hedefler alınırken bir hata oluştu." }, { status: 500 });
  }
}
