import { Inbox } from "lucide-react";
import { cardSurfaceClass } from "@/lib/utils";

export default function AdminInboxPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-[22px] font-semibold text-foreground">Gelen Kutusu</h1>
        <p className="mt-1 text-[14px] text-foreground-muted">
          Gmail&apos;e düşen mailler ileride burada sipariş talebi gibi listelenecek.
        </p>
      </div>

      <div className={`${cardSurfaceClass} flex flex-col items-center gap-3 px-6 py-20 text-center`}>
        <div className="flex size-12 items-center justify-center rounded-full bg-surface">
          <Inbox className="size-5 text-foreground-muted" aria-hidden />
        </div>
        <p className="text-[15px] font-medium text-foreground">Gmail entegrasyonu henüz bağlanmadı</p>
        <p className="max-w-sm text-[13px] text-foreground-muted">
          Bağlantı kurulduğunda literaphy@gmail.com adresine gelen mailler burada, sipariş kayıtlarıyla aynı
          görünümde listelenecek. Kurulum adımları için bkz. docs/admin-panel-kurulum.md
        </p>
      </div>
    </div>
  );
}
