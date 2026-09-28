import { NextResponse } from "next/server";
import { z } from "zod";
import { requireYagmurSession } from "@/lib/yagmur-session-guard";
import { isSheetsConfigured, updateYagmurGoalLearned } from "@/lib/google-sheets";

const NOT_CONFIGURED_MESSAGE = "Google Sheets bağlantısı henüz yapılandırılmamış.";

const patchSchema = z.object({
  learned: z.number().int().min(0),
});

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: Request, { params }: RouteParams) {
  const authorized = await requireYagmurSession();
  if (!authorized) return NextResponse.json({ error: "Oturum gerekli." }, { status: 401 });
  if (!isSheetsConfigured()) return NextResponse.json({ error: NOT_CONFIGURED_MESSAGE }, { status: 400 });

  const { id } = await params;
  const json = await request.json().catch(() => null);
  const parsed = patchSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Geçersiz form verisi." }, { status: 400 });
  }

  try {
    const goal = await updateYagmurGoalLearned(id, parsed.data.learned);
    return NextResponse.json({ goal });
  } catch (error) {
    console.error("[api/yagmur/goals/:id] updateYagmurGoalLearned hata:", error);
    const message = error instanceof Error ? error.message : "Hedef güncellenemedi.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
