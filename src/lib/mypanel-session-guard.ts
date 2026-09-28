import "server-only";
import { cookies } from "next/headers";
import { MYPANEL_SESSION_COOKIE_NAME, verifyMypanelSessionToken } from "@/lib/mypanel-auth";

/** /mypanel/(panel)/layout.tsx içinde savunma amaçlı ikinci kontrol için —
 * middleware zaten /mypanel altındaki sayfaları korur (bkz. middleware.ts). */
export async function requireMypanelSession(): Promise<boolean> {
  const store = await cookies();
  const token = store.get(MYPANEL_SESSION_COOKIE_NAME)?.value;
  return verifyMypanelSessionToken(token);
}
