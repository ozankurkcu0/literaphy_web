import { redirect } from "next/navigation";
import { requireMypanelSession } from "@/lib/mypanel-session-guard";

export default async function MypanelLayout({ children }: { children: React.ReactNode }) {
  const authorized = await requireMypanelSession();

  // Middleware zaten korumasız erişimi /mypanel/giris'e yönlendiriyor; bu
  // ikinci kontrol savunma amaçlı (ör. middleware devre dışı bırakılırsa).
  // Bu layout, /mypanel altındaki tüm sayfaları (hub + calismaprogram +
  // yagmurumprofugececek) sarar — her aracın kendi iç şifresi ayrıca
  // kendi (panel) layout'unda kontrol edilir.
  if (!authorized) redirect("/mypanel/giris");

  return <>{children}</>;
}
