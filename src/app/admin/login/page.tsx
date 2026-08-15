import { Suspense } from "react";
import type { Metadata } from "next";
import { Logo } from "@/components/layout/Logo";
import { LoginForm } from "@/components/admin/LoginForm";
import { cardSurfaceClass } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Giriş yap",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-16">
      <div className={`${cardSurfaceClass} w-full max-w-sm p-8`}>
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <Logo />
          <div>
            <h1 className="text-[20px] font-semibold text-foreground">Yönetim Paneli</h1>
            <p className="mt-1 text-[13px] text-foreground-muted">Devam etmek için giriş yapın.</p>
          </div>
        </div>
        <Suspense fallback={null}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
