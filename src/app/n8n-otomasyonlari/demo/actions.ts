"use server";

import { parseDemoRequest, type DemoFormState } from "@/lib/demo-request";

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

  return {
    status: "success",
    message: "Talebiniz alındı, otomasyon ihtiyacınızı konuşmak için sizi arayacağız.",
  };
}
