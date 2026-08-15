import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminSession } from "@/lib/admin-session-guard";
import { CURRENCIES, STATUSES, createOrder, isSheetsConfigured, listOrders } from "@/lib/google-sheets";

const orderInputSchema = z.object({
  firstName: z.string().min(1, "İsim gerekli."),
  lastName: z.string().min(1, "Soyisim gerekli."),
  serviceType: z.string().min(1, "Hizmet türü gerekli."),
  startDate: z.string().min(1, "Hizmete başlama tarihi gerekli."),
  billingDate: z.string().optional().default(""),
  phone: z.string().optional().default(""),
  email: z.string().optional().default(""),
  fee: z.string().optional().default(""),
  currency: z.enum(CURRENCIES).optional().default("TRY"),
  totalInstallments: z.string().optional().default(""),
  paidInstallments: z.string().optional().default(""),
  status: z.enum(STATUSES).optional().default("Aktif"),
  note: z.string().optional().default(""),
});

const NOT_CONFIGURED_MESSAGE =
  "Google Sheets bağlantısı henüz yapılandırılmamış. Kurulum için docs/admin-panel-kurulum.md dosyasına bakın.";

export async function GET() {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Oturum gerekli." }, { status: 401 });

  if (!isSheetsConfigured()) {
    return NextResponse.json({ error: NOT_CONFIGURED_MESSAGE, configured: false }, { status: 200 });
  }

  try {
    const orders = await listOrders();
    return NextResponse.json({ orders, configured: true });
  } catch (error) {
    console.error("[api/admin/orders] listOrders hata:", error);
    return NextResponse.json({ error: "Siparişler alınırken bir hata oluştu." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Oturum gerekli." }, { status: 401 });

  if (!isSheetsConfigured()) {
    return NextResponse.json({ error: NOT_CONFIGURED_MESSAGE }, { status: 400 });
  }

  const json = await request.json().catch(() => null);
  const parsed = orderInputSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Geçersiz form verisi." }, { status: 400 });
  }

  try {
    const order = await createOrder(parsed.data);
    return NextResponse.json({ order }, { status: 201 });
  } catch (error) {
    console.error("[api/admin/orders] createOrder hata:", error);
    const message = error instanceof Error ? error.message : "Sipariş oluşturulamadı.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
