"use server";

import { parseDemoRequest, type DemoFormState } from "@/lib/demo-request";
import { sendNotificationEmail } from "@/lib/email";

export type { DemoFormState };

export async function submitDemoRequest(
  _prevState: DemoFormState,
  formData: FormData,
): Promise<DemoFormState> {
  const result = parseDemoRequest(formData);

  if ("errors" in result) {
    return { status: "error", errors: result.errors, message: "Lütfen formu kontrol edin." };
  }

  console.info("[qr-menu-demo] yeni talep:", result.data);

  await sendNotificationEmail({
    subject: `Yeni QR Menü demo talebi — ${result.data.business}`,
    sourceLabel: "QR Menü Demo Talebi",
    rows: [
      { label: "İşletme", value: result.data.business },
      { label: "Telefon", value: result.data.phone },
      { label: "E-posta", value: result.data.email },
    ],
  });

  return {
    status: "success",
    message: "Talebiniz alındı, QR menünüzü kurmak için sizi arayacağız.",
  };
}
