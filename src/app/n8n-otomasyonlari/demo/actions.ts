"use server";

import { parseDemoRequest, type DemoFormState } from "@/lib/demo-request";
import { sendNotificationEmail } from "@/lib/email";

export type { DemoFormState };

export async function submitN8nDemoRequest(
  _prevState: DemoFormState,
  formData: FormData,
): Promise<DemoFormState> {
  const result = parseDemoRequest(formData);

  if ("errors" in result) {
    return { status: "error", errors: result.errors, message: "Lütfen formu kontrol edin." };
  }

  console.info("[n8n-demo] yeni talep:", result.data);

  await sendNotificationEmail({
    subject: `Yeni N8N otomasyon demo talebi — ${result.data.business}`,
    sourceLabel: "N8N Otomasyonları Demo Talebi",
    rows: [
      { label: "İşletme", value: result.data.business },
      { label: "Telefon", value: result.data.phone },
      { label: "E-posta", value: result.data.email },
    ],
  });

  return {
    status: "success",
    message: "Talebiniz alındı, otomasyon ihtiyacınızı konuşmak için sizi arayacağız.",
  };
}
