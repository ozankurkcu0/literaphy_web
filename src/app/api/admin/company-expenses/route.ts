import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminSession } from "@/lib/admin-session-guard";
import {
  COMPANY_EXPENSE_CATEGORIES,
  CURRENCIES,
  EXPENSE_RECURRENCES,
  createCompanyExpense,
  isSheetsConfigured,
  listCompanyExpenses,
  logActivity,
} from "@/lib/google-sheets";

const companyExpenseInputSchema = z.object({
  category: z.enum(COMPANY_EXPENSE_CATEGORIES),
  amount: z.string().optional().default(""),
  currency: z.enum(CURRENCIES).optional().default("TRY"),
  recurrence: z.enum(EXPENSE_RECURRENCES).optional().default("Tek seferlik"),
  dueDate: z.string().optional().default(""),
  note: z.string().optional().default(""),
});

const NOT_CONFIGURED_MESSAGE =
  "Google Sheets bağlantısı henüz yapılandırılmamış. Kurulum için docs/admin-panel-kurulum.md dosyasına bakın.";

/** Siparişe bağlı olmayan genel şirket giderleri (domain/hosting, reklam,
 * abonelikler vb.) — "Giderler" API'sinden bilinçli olarak ayrı, çünkü o
 * her zaman bir sipariş numarasına bağlı. */
export async function GET() {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Oturum gerekli." }, { status: 401 });

  if (!isSheetsConfigured()) {
    return NextResponse.json({ error: NOT_CONFIGURED_MESSAGE, configured: false }, { status: 200 });
  }

  try {
    const expenses = await listCompanyExpenses();
    return NextResponse.json({ expenses, configured: true });
  } catch (error) {
    console.error("[api/admin/company-expenses] listCompanyExpenses hata:", error);
    return NextResponse.json({ error: "Giderler alınırken bir hata oluştu." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Oturum gerekli." }, { status: 401 });
  if (!isSheetsConfigured()) return NextResponse.json({ error: NOT_CONFIGURED_MESSAGE }, { status: 400 });

  const json = await request.json().catch(() => null);
  const parsed = companyExpenseInputSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Geçersiz form verisi." }, { status: 400 });
  }

  try {
    const expense = await createCompanyExpense(parsed.data);
    logActivity(session.name || session.phone, "Şirket gideri eklendi", expense.category);
    return NextResponse.json({ expense }, { status: 201 });
  } catch (error) {
    console.error("[api/admin/company-expenses] createCompanyExpense hata:", error);
    const message = error instanceof Error ? error.message : "Gider oluşturulamadı.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
