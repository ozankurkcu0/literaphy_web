import "server-only";
import { cookies } from "next/headers";
import { SESSION_COOKIE_NAME, verifySessionToken, type AdminSessionPayload } from "@/lib/admin-auth";

/** API route handler'larında oturum kontrolü için — middleware /admin
 * sayfalarını korur ama /api/admin/* route'ları kendi başına kontrol eder. */
export async function requireAdminSession(): Promise<AdminSessionPayload | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE_NAME)?.value;
  return verifySessionToken(token);
}
