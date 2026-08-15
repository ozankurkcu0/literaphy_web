import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminSession } from "@/lib/admin-session-guard";
import {
  CURRENCIES,
  EXPENSE_RECURRENCES,
  createExpense,
  isSheetsConfigured,
  listExpensesForOrder,
  logActivity,
} from "@/lib/google-sheets";

const expenseInputSchema = z.object({
  name: z.string().min(1, "Gider adı gerekli."),
  amount: z.string().optional().default(""),
  currency: z.enum(CURRENCIES).optional().default("TRY"),
  recurrence: z.enum(EXPENSE_RECURRENCES).optional().default("Tek seferlik"),
  dueDate: z.string().optional().default(""),
  note: z.string().optional().default(""),
});

const NOT_CONFIGURED_MESSAGE =
  "Google Sheets bağlantısı henüz yapılandırılmamış. Kurulum için docs/admin-panel-kurulum.md dosyasına bakın.";

interface RouteParams {
  params: Promise<{ orderNumber: string }>;
}

export async function GET(_request: Request, { params }: RouteParams) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Oturum gerekli." }, { status: 401 });
  if (!isSheetsConfigured()) return NextResponse.json({ error: NOT_CONFIGURED_MESSAGE }, { status: 400 });

  const { orderNumber } = await params;

  try {
    const expenses = await listExpensesForOrder(orderNumber);
    return NextResponse.json({ expenses });
  } catch (error) {
    console.error("[api/admin/orders/:orderNumber/expenses] listExpensesForOrder hata:", error);
    return NextResponse.json({ error: "Giderler alınırken bir hata oluştu." }, { status: 500 });
  }
}

export async function POST(request: Request, { params }: RouteParams) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Oturum gerekli." }, { status: 401 });
  if (!isSheetsConfigured()) return NextResponse.json({ error: NOT_CONFIGURED_MESSAGE }, { status: 400 });

  const { orderNumber } = await params;
  const json = await request.json().catch(() => null);
  const parsed = expenseInputSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Geçersiz form verisi." }, { status: 400 });
  }

  try {
    const expense = await createExpense(orderNumber, parsed.data);
    logActivity(session.name || session.phone, "Gider eklendi", `${expense.name} · sipariş #${orderNumber}`);
    return NextResponse.json({ expense }, { status: 201 });
  } catch (error) {
    console.error("[api/admin/orders/:orderNumber/expenses] createExpense hata:", error);
    const message = error instanceof Error ? error.message : "Gider oluşturulamadı.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
