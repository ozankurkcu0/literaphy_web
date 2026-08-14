import { z } from "zod";

/** Paylaşılan demo talep formu şeması — QR Menü ve N8N Otomasyonları demo
 * sayfalarındaki server action'lar bunu kullanır (bkz. DemoRequestForm). */
export const demoRequestSchema = z.object({
  business: z.string().trim().min(2, "İşletme adını giriniz."),
  phone: z.string().trim().min(10, "Geçerli bir telefon numarası giriniz."),
  email: z.string().trim().email("Geçerli bir e-posta adresi giriniz."),
});

export interface DemoFormState {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: Partial<Record<"business" | "phone" | "email", string>>;
}

/** Ham FormData'yı doğrular; hata varsa DemoFormState'in errors alanına
 * eşler. Başarılı ayrıştırmada { data } döner. */
export function parseDemoRequest(formData: FormData): { data: z.infer<typeof demoRequestSchema> } | { errors: DemoFormState["errors"] } {
  const raw = {
    business: formData.get("business"),
    phone: formData.get("phone"),
    email: formData.get("email"),
  };

  const parsed = demoRequestSchema.safeParse(raw);
  if (!parsed.success) {
    const errors: DemoFormState["errors"] = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0];
      if (typeof field === "string") {
        errors[field as keyof NonNullable<DemoFormState["errors"]>] = issue.message;
      }
    }
    return { errors };
  }

  return { data: parsed.data };
}
