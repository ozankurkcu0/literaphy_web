import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminSession } from "@/lib/admin-session-guard";
import { CURRENCIES, EXPENSE_RECURRENCES, deleteExpense, isSheetsConfigured, updateExpense } from "@/lib/google-sheets";

const expensePatchSchema = z.object({
  name: z.string().min(1).optional(),
  amount: z.string().optional(),
  currency: z.enum(CURRENCIES).optional(),
  recurrence: z.enum(EXPENSE_RECURRENCES).optional(),
  dueDate: z.string().optional(),
  note: z.string().optional(),
});

const NOT_CONFIGURED_MESSAGE =
  "Google Sheets bağlantısı henüz yapılandırılmamış. Kurulum için docs/admin-panel-kurulum.md dosyasına bakın.";

interface RouteParams {
  params: Promise<{ orderNumber: string; expenseId: string }>;
}

export async function PATCH(request: Request, { params }: RouteParams) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Oturum gerekli." }, { status: 401 });
  if (!isSheetsConfigured()) return NextResponse.json({ error: NOT_CONFIGURED_MESSAGE }, { status: 400 });

  const { expenseId } = await params;
  const json = await request.json().catch(() => null);
  const parsed = expensePatchSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Geçersiz form verisi." }, { status: 400 });
  }

  try {
    const expense = await updateExpense(expenseId, parsed.data);
    return NextResponse.json({ expense });
  } catch (error) {
    console.error("[api/admin/orders/:orderNumber/expenses/:expenseId] updateExpense hata:", error);
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
    await deleteExpense(expenseId);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[api/admin/orders/:orderNumber/expenses/:expenseId] deleteExpense hata:", error);
    const message = error instanceof Error ? error.message : "Gider silinemedi.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
