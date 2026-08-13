"use client";

import { useActionState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { CheckCircle2 } from "lucide-react";
import { submitContactForm, type ContactFormState } from "@/app/iletisim/actions";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { LiquidButton } from "@/components/ui/liquid-glass-button";
import { services } from "@/content/services";

const initialState: ContactFormState = { status: "idle" };

const serviceOptions = [
  // QR Menü Sistemleri artık services.ts'in kendisinde (href ile kendi
  // sayfasına yönlenen bir kayıt olarak) — burada ayrıca elle eklemeye
  // gerek yok; eklenirse aynı "qr-menu-sistemleri" değeri iki kez
  // üretilip React'ın duplicate key hatasına yol açar.
  ...services.map((service) => ({ label: service.name, value: service.slug })),
  { label: "Diğer / Emin değilim", value: "diger" },
];

export function ContactForm() {
  const [state, formAction, isPending] = useActionState(submitContactForm, initialState);

  if (state.status === "success") {
    return (
      <motion.div
        role="status"
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col items-center gap-4 rounded-xl border border-success/20 bg-success/5 px-8 py-14 text-center"
      >
        <CheckCircle2 className="size-10 text-success" aria-hidden />
        <p className="text-lg font-semibold text-foreground">{state.message}</p>
        <p className="text-sm text-foreground-muted">Genellikle 24 saat içinde dönüş yapıyoruz.</p>
      </motion.div>
    );
  }

  return (
    <form
      action={formAction}
      className="flex flex-col gap-6 rounded-xl border border-hairline bg-surface p-8 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] lg:p-10"
    >
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Input
          label="Ad Soyad"
          name="name"
          autoComplete="name"
          placeholder="Adınız Soyadınız"
          error={state.errors?.name}
          required
        />
        <Input
          label="E-posta"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="ornek@sirket.com"
          error={state.errors?.email}
          required
        />
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Input
          label="Telefon"
          name="phone"
          type="tel"
          autoComplete="tel"
          placeholder="0555 000 00 00"
          error={state.errors?.phone}
          required
        />
        <Select
          label="Hizmet İlgisi"
          name="service"
          options={serviceOptions}
          placeholder="Bir hizmet seçin"
          error={state.errors?.service}
          required
        />
      </div>
      <Textarea
        label="Mesajınız"
        name="message"
        placeholder="Projenizden veya ihtiyacınızdan kısaca bahsedin..."
        error={state.errors?.message}
        required
      />

      <AnimatePresence>
        {state.status === "error" && state.message && !Object.keys(state.errors ?? {}).length && (
          <motion.p
            role="alert"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-sm font-medium text-danger"
          >
            {state.message}
          </motion.p>
        )}
      </AnimatePresence>

      <LiquidButton
        type="submit"
        size="lg"
        disabled={isPending}
        className="w-full text-foreground sm:w-auto"
      >
        {isPending ? "Gönderiliyor..." : "Talebi Gönder"}
      </LiquidButton>
    </form>
  );
}
