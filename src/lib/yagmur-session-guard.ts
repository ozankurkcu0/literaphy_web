import "server-only";
import { cookies } from "next/headers";
import { YAGMUR_SESSION_COOKIE_NAME, verifyYagmurSessionToken } from "@/lib/yagmur-auth";

/** API route handler'larında oturum kontrolü için — middleware
 * /yagmurumprofugececek sayfalarını korur ama /api/yagmur/* route'ları kendi
 * başına kontrol eder. */
export async function requireYagmurSession(): Promise<boolean> {
  const store = await cookies();
  const token = store.get(YAGMUR_SESSION_COOKIE_NAME)?.value;
  return verifyYagmurSessionToken(token);
}
