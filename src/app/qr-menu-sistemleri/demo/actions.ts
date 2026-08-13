"use server";

import { z } from "zod";

const demoSchema = z.object({
  business: z.string().trim().min(2, "İşletme adını giriniz."),
  phone: z.string().trim().min(10, "Geçerli bir telefon numarası giriniz."),
  email: z.string().trim().email("Geçerli bir e-posta adresi giriniz."),
});

export interface DemoFormState {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: Partial<Record<"business" | "phone" | "email", string>>;
}

export async function submitDemoRequest(
  _prevState: DemoFormState,
  formData: FormData,
): Promise<DemoFormState> {
  const raw = {
    business: formData.get("business"),
    phone: formData.get("phone"),
    email: formData.get("email"),
  };

  const parsed = demoSchema.safeParse(raw);

  if (!parsed.success) {
    const errors: DemoFormState["errors"] = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0];
      if (typeof field === "string") {
        errors[field as keyof NonNullable<DemoFormState["errors"]>] = issue.message;
      }
    }
    return { status: "error", errors, message: "Lütfen formu kontrol edin." };
  }

  console.info("[qr-menu-demo] yeni talep:", parsed.data);

  return {
    status: "success",
    message: "Talebiniz alındı, QR menünüzü kurmak için sizi arayacağız.",
  };
}
