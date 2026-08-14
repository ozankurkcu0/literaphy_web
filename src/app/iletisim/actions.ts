"use server";

import { z } from "zod";
import { sendNotificationEmail } from "@/lib/email";

const contactSchema = z.object({
  name: z.string().trim().min(2, "Adınızı ve soyadınızı giriniz."),
  email: z.string().trim().email("Geçerli bir e-posta adresi giriniz."),
  phone: z.string().trim().min(10, "Geçerli bir telefon numarası giriniz."),
  service: z.string().trim().min(1, "Bir hizmet seçiniz."),
  message: z.string().trim().min(10, "Mesajınız en az 10 karakter olmalı."),
});

export interface ContactFormState {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: Partial<Record<"name" | "email" | "phone" | "service" | "message", string>>;
}

export async function submitContactForm(
  _prevState: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const raw = {
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    service: formData.get("service"),
    message: formData.get("message"),
  };

  const parsed = contactSchema.safeParse(raw);

  if (!parsed.success) {
    const errors: ContactFormState["errors"] = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0];
      if (typeof field === "string") {
        errors[field as keyof NonNullable<ContactFormState["errors"]>] = issue.message;
      }
    }
    return { status: "error", errors, message: "Lütfen formu kontrol edin." };
  }

  console.info("[iletisim] yeni talep:", parsed.data);

  await sendNotificationEmail({
    subject: `Yeni iletişim talebi — ${parsed.data.name}`,
    sourceLabel: "İletişim Formu",
    rows: [
      { label: "Ad Soyad", value: parsed.data.name },
      { label: "E-posta", value: parsed.data.email },
      { label: "Telefon", value: parsed.data.phone },
      { label: "Hizmet", value: parsed.data.service },
      { label: "Mesaj", value: parsed.data.message },
    ],
  });

  return {
    status: "success",
    message: "Mesajınız alındı. En kısa sürede size dönüş yapacağız.",
  };
}
