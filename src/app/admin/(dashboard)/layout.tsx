import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/admin-auth";
import { AdminShell } from "@/components/admin/AdminShell";

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const store = await cookies();
  const session = await verifySessionToken(store.get(SESSION_COOKIE_NAME)?.value);

  // Middleware zaten korumasız erişimi /admin/login'e yönlendiriyor; bu ikinci
  // kontrol savunma amaçlı (ör. middleware devre dışı bırakılırsa).
  if (!session) redirect("/admin/login");

  return <AdminShell adminLabel={session.name || session.phone}>{children}</AdminShell>;
}
