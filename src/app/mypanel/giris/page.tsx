import { Suspense } from "react";
import type { Metadata } from "next";
import { Lock } from "lucide-react";
import { MypanelLoginForm } from "@/components/mypanel/LoginForm";
import { cardSurfaceClass } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Giriş",
  robots: { index: false, follow: false },
};

export default function MypanelLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-base px-4 py-16">
      <div className={`${cardSurfaceClass} w-full max-w-sm p-8`}>
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <span className="flex size-12 items-center justify-center rounded-full bg-elevated">
            <Lock className="size-5 text-foreground-muted" aria-hidden />
          </span>
          <div>
            <h1 className="text-[20px] font-semibold text-foreground">Giriş</h1>
            <p className="mt-1 text-[13px] text-foreground-muted">Devam etmek için şifreni gir.</p>
          </div>
        </div>
        <Suspense fallback={null}>
          <MypanelLoginForm />
        </Suspense>
      </div>
    </div>
  );
}
