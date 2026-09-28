import "server-only";
import { cookies } from "next/headers";
import { CALISMA_PROGRAM_SESSION_COOKIE_NAME, verifyCalismaProgramSessionToken } from "@/lib/calisma-program-auth";

/** API route handler'larında oturum kontrolü için — middleware /calismaprogram
 * sayfalarını korur ama /api/calisma-program/* route'ları kendi başına kontrol eder. */
export async function requireCalismaProgramSession(): Promise<boolean> {
  const store = await cookies();
  const token = store.get(CALISMA_PROGRAM_SESSION_COOKIE_NAME)?.value;
  return verifyCalismaProgramSessionToken(token);
}
