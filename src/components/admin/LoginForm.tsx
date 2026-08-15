"use client";

import { useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, Phone } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { inputBaseClass, cn } from "@/lib/utils";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, password }),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? "Giriş başarısız oldu.");
        setLoading(false);
        return;
      }

      const next = searchParams.get("next") || "/admin";
      router.replace(next);
      router.refresh();
    } catch {
      setError("Sunucuya ulaşılamadı, lütfen tekrar deneyin.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <label htmlFor="phone" className="text-sm font-medium text-foreground-secondary">
          Telefon numarası
        </label>
        <div className="relative">
          <Phone className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-foreground-muted" aria-hidden />
          <input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            required
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            placeholder="05xx xxx xx xx"
            className={cn(inputBaseClass, "h-12 pl-11")}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="password" className="text-sm font-medium text-foreground-secondary">
          Şifre
        </label>
        <div className="relative">
          <Lock className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-foreground-muted" aria-hidden />
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="••••••••"
            className={cn(inputBaseClass, "h-12 pl-11")}
          />
        </div>
      </div>

      {error && (
        <p role="alert" className="text-[13px] font-medium text-danger">
          {error}
        </p>
      )}

      <Button type="submit" variant="primary" size="md" className="w-full justify-center" disabled={loading}>
        {loading ? "Giriş yapılıyor…" : "Giriş yap"}
      </Button>
    </form>
  );
}
