/**
 * /mypanel için tamamen ayrı, hafif bir oturum çerezi — calisma-program-auth.ts
 * ve yagmur-auth.ts ile aynı imzalama yöntemi (HMAC-SHA256, aynı
 * ADMIN_SESSION_SECRET reuse edilir) ama kendi cookie adı ve imzalanan
 * gövdedeki sabit "scope" alanıyla diğer oturumlardan tamamen izole.
 *
 * Bu, /mypanel altındaki tüm gizli/kişisel sayfalar (calismaprogram,
 * yagmurumprofugececek) için ortak DIŞ giriş kapısı — her aracın kendi iç
 * şifresi (calisma-program-auth.ts, yagmur-auth.ts) ayrıca ve bağımsız
 * olarak geçerliliğini korur (çift katmanlı koruma).
 */

export const MYPANEL_SESSION_COOKIE_NAME = "mypanel_session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 30; // 30 gün — kişisel/tek kullanıcı, sık giriş istemiyoruz
export const MYPANEL_SESSION_MAX_AGE_SECONDS = SESSION_TTL_MS / 1000;

const SCOPE = "mypanel";

interface SignedSessionBody {
  scope: typeof SCOPE;
  exp: number;
}

const encoder = new TextEncoder();
const decoder = new TextDecoder();

function getSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error(
      "ADMIN_SESSION_SECRET env değişkeni tanımlı değil veya çok kısa (en az 16 karakter).",
    );
  }
  return secret;
}

async function getKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, [
    "sign",
    "verify",
  ]);
}

function base64urlEncode(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64urlDecode(value: string): Uint8Array<ArrayBuffer> {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/").padEnd(value.length + ((4 - (value.length % 4)) % 4), "=");
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

export async function createMypanelSessionToken(): Promise<string> {
  const key = await getKey(getSecret());
  const body: SignedSessionBody = { scope: SCOPE, exp: Date.now() + SESSION_TTL_MS };
  const bodyB64 = base64urlEncode(encoder.encode(JSON.stringify(body)));
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(bodyB64));
  const sigB64 = base64urlEncode(new Uint8Array(signature));
  return `${bodyB64}.${sigB64}`;
}

export async function verifyMypanelSessionToken(token: string | undefined | null): Promise<boolean> {
  if (!token) return false;
  const [bodyB64, sigB64] = token.split(".");
  if (!bodyB64 || !sigB64) return false;

  try {
    const key = await getKey(getSecret());
    const valid = await crypto.subtle.verify("HMAC", key, base64urlDecode(sigB64), encoder.encode(bodyB64));
    if (!valid) return false;

    const body = JSON.parse(decoder.decode(base64urlDecode(bodyB64))) as SignedSessionBody;
    if (body.scope !== SCOPE) return false;
    if (typeof body.exp !== "number" || body.exp < Date.now()) return false;

    return true;
  } catch {
    return false;
  }
}

/** Girilen şifreyi MYPANEL_PASSWORD env değişkeniyle karşılaştırır. */
export function checkMypanelPassword(password: string): boolean {
  const expected = process.env.MYPANEL_PASSWORD;
  if (!expected) {
    throw new Error("MYPANEL_PASSWORD env değişkeni tanımlı değil.");
  }
  return password === expected;
}
