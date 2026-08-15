import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminSession } from "@/lib/admin-session-guard";
import { CURRENCIES, isSheetsConfigured, listMonthlyGoals, logActivity, setMonthlyGoal } from "@/lib/google-sheets";

const NOT_CONFIGURED_MESSAGE =
  "Google Sheets bağlantısı henüz yapılandırılmamış. Kurulum için docs/admin-panel-kurulum.md dosyasına bakın.";

const goalSchema = z.object({
  month: z.string().regex(/^\d{4}-\d{2}$/, "Ay formatı geçersiz."),
  currency: z.enum(CURRENCIES),
  amount: z.string().min(1, "Hedef tutar gerekli."),
});

export async function GET() {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Oturum gerekli." }, { status: 401 });

  if (!isSheetsConfigured()) {
    return NextResponse.json({ error: NOT_CONFIGURED_MESSAGE, configured: false }, { status: 200 });
  }

  try {
    const goals = await listMonthlyGoals();
    return NextResponse.json({ goals, configured: true });
  } catch (error) {
    console.error("[api/admin/goals] listMonthlyGoals hata:", error);
    return NextResponse.json({ error: "Hedefler alınırken bir hata oluştu." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Oturum gerekli." }, { status: 401 });
  if (!isSheetsConfigured()) return NextResponse.json({ error: NOT_CONFIGURED_MESSAGE }, { status: 400 });

  const json = await request.json().catch(() => null);
  const parsed = goalSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Geçersiz form verisi." }, { status: 400 });
  }

  try {
    const goal = await setMonthlyGoal(parsed.data.month, parsed.data.currency, parsed.data.amount);
    logActivity(
      session.name || session.phone,
      "Aylık hedef güncellendi",
      `${parsed.data.month} · ${parsed.data.currency} ${parsed.data.amount}`,
    );
    return NextResponse.json({ goal });
  } catch (error) {
    console.error("[api/admin/goals] setMonthlyGoal hata:", error);
    return NextResponse.json({ error: "Hedef kaydedilemedi." }, { status: 500 });
  }
}
