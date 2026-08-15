import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminSession } from "@/lib/admin-session-guard";
import { CURRENCIES, deleteOrder, isSheetsConfigured, updateOrder } from "@/lib/google-sheets";

const orderPatchSchema = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  serviceType: z.string().min(1).optional(),
  startDate: z.string().optional(),
  billingDate: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().optional(),
  fee: z.string().optional(),
  currency: z.enum(CURRENCIES).optional(),
  totalInstallments: z.string().optional(),
  paidInstallments: z.string().optional(),
});

const NOT_CONFIGURED_MESSAGE =
  "Google Sheets bağlantısı henüz yapılandırılmamış. Kurulum için docs/admin-panel-kurulum.md dosyasına bakın.";

interface RouteParams {
  params: Promise<{ orderNumber: string }>;
}

export async function PATCH(request: Request, { params }: RouteParams) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Oturum gerekli." }, { status: 401 });
  if (!isSheetsConfigured()) return NextResponse.json({ error: NOT_CONFIGURED_MESSAGE }, { status: 400 });

  const { orderNumber } = await params;
  const json = await request.json().catch(() => null);
  const parsed = orderPatchSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Geçersiz form verisi." }, { status: 400 });
  }

  try {
    const order = await updateOrder(orderNumber, parsed.data);
    return NextResponse.json({ order });
  } catch (error) {
    console.error("[api/admin/orders/:orderNumber] updateOrder hata:", error);
    const message = error instanceof Error ? error.message : "Sipariş güncellenemedi.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Oturum gerekli." }, { status: 401 });
  if (!isSheetsConfigured()) return NextResponse.json({ error: NOT_CONFIGURED_MESSAGE }, { status: 400 });

  const { orderNumber } = await params;

  try {
    await deleteOrder(orderNumber);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[api/admin/orders/:orderNumber] deleteOrder hata:", error);
    const message = error instanceof Error ? error.message : "Sipariş silinemedi.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
