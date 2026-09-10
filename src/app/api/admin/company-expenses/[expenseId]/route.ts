import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminSession } from "@/lib/admin-session-guard";
import {
  COMPANY_EXPENSE_CATEGORIES,
  CURRENCIES,
  EXPENSE_RECURRENCES,
  deleteCompanyExpense,
  isSheetsConfigured,
  logActivity,
  updateCompanyExpense,
} from "@/lib/google-sheets";

const companyExpensePatchSchema = z.object({
  category: z.enum(COMPANY_EXPENSE_CATEGORIES).optional(),
  amount: z.string().optional(),
  currency: z.enum(CURRENCIES).optional(),
  recurrence: z.enum(EXPENSE_RECURRENCES).optional(),
  dueDate: z.string().optional(),
  note: z.string().optional(),
});

const NOT_CONFIGURED_MESSAGE =
  "Google Sheets bağlantısı henüz yapılandırılmamış. Kurulum için docs/admin-panel-kurulum.md dosyasına bakın.";

interface RouteParams {
  params: Promise<{ expenseId: string }>;
}

export async function PATCH(request: Request, { params }: RouteParams) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Oturum gerekli." }, { status: 401 });
  if (!isSheetsConfigured()) return NextResponse.json({ error: NOT_CONFIGURED_MESSAGE }, { status: 400 });

  const { expenseId } = await params;
  const json = await request.json().catch(() => null);
  const parsed = companyExpensePatchSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Geçersiz form verisi." }, { status: 400 });
  }

  try {
    const expense = await updateCompanyExpense(expenseId, parsed.data);
    logActivity(session.name || session.phone, "Şirket gideri güncellendi", expense.category);
    return NextResponse.json({ expense });
  } catch (error) {
    console.error("[api/admin/company-expenses/:expenseId] updateCompanyExpense hata:", error);
    const message = error instanceof Error ? error.message : "Gider güncellenemedi.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Oturum gerekli." }, { status: 401 });
  if (!isSheetsConfigured()) return NextResponse.json({ error: NOT_CONFIGURED_MESSAGE }, { status: 400 });

  const { expenseId } = await params;

  try {
    await deleteCompanyExpense(expenseId, session.name || session.phone);
    logActivity(session.name || session.phone, "Şirket gideri silindi", expenseId);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[api/admin/company-expenses/:expenseId] deleteCompanyExpense hata:", error);
    const message = error instanceof Error ? error.message : "Gider silinemedi.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
