"use client";

import { useActionState } from "react";
import { motion } from "motion/react";
import { CheckCircle2 } from "lucide-react";
import { submitDemoRequest, type DemoFormState } from "@/app/qr-menu-sistemleri/demo/actions";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

const initialState: DemoFormState = { status: "idle" };

export function DemoRequestForm() {
  const [state, formAction, isPending] = useActionState(submitDemoRequest, initialState);

  if (state.status === "success") {
    return (
      <motion.div
        role="status"
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-3 rounded-xl border border-success/20 bg-success/5 px-8 py-10 text-center"
      >
        <CheckCircle2 className="size-9 text-success" aria-hidden />
        <p className="font-semibold text-foreground">{state.message}</p>
      </motion.div>
    );
  }

  return (
    <form
      action={formAction}
      className="flex flex-col gap-5 rounded-xl border border-hairline bg-surface p-8 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"
    >
      <h3 className="text-lg font-semibold text-foreground">Kendi menünüz için demo isteyin</h3>
      <Input
        label="İşletme Adı"
        name="business"
        autoComplete="organization"
        placeholder="Kahve Durağı"
        error={state.errors?.business}
        required
      />
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Input
          label="Telefon"
          name="phone"
          type="tel"
          autoComplete="tel"
          placeholder="0555 000 00 00"
          error={state.errors?.phone}
          required
        />
        <Input
          label="E-posta"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="isletme@ornek.com"
          error={state.errors?.email}
          required
        />
      </div>
      <Button type="submit" tone="product" size="lg" disabled={isPending} className="w-full">
        {isPending ? "Gönderiliyor..." : "Kendi Menünüzü Oluşturun"}
      </Button>
    </form>
  );
}
