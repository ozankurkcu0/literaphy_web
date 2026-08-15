/**
 * Admin panel oturum (session) token'ı — imzalı ama şifrelenmemiş bir
 * "cookie token"ı. Web Crypto API (`crypto.subtle`) kullanıyor çünkü hem
 * middleware'in çalıştığı Edge runtime'da hem de normal Node route
 * handler'larında ekstra ayar gerektirmeden çalışıyor.
 *
 * Token biçimi: base64url(payloadJson) + "." + base64url(HMAC-SHA256 imza)
 */

export const SESSION_COOKIE_NAME = "literaphy_admin_session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 12; // 12 saat
export const SESSION_MAX_AGE_SECONDS = SESSION_TTL_MS / 1000;

export interface AdminSessionPayload {
  phone: string;
  name?: string;
}

interface SignedSessionBody extends AdminSessionPayload {
  exp: number;
}

const encoder = new TextEncoder();
const decoder = new TextDecoder();

function getSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error(
      "ADMIN_SESSION_SECRET env değişkeni tanımlı değil veya çok kısa (en az 16 karakter). " +
        "bkz. docs/admin-panel-kurulum.md",
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

export async function createSessionToken(payload: AdminSessionPayload): Promise<string> {
  const key = await getKey(getSecret());
  const body: SignedSessionBody = { ...payload, exp: Date.now() + SESSION_TTL_MS };
  const bodyB64 = base64urlEncode(encoder.encode(JSON.stringify(body)));
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(bodyB64));
  const sigB64 = base64urlEncode(new Uint8Array(signature));
  return `${bodyB64}.${sigB64}`;
}

export async function verifySessionToken(token: string | undefined | null): Promise<AdminSessionPayload | null> {
  if (!token) return null;
  const [bodyB64, sigB64] = token.split(".");
  if (!bodyB64 || !sigB64) return null;

  try {
    const key = await getKey(getSecret());
    const valid = await crypto.subtle.verify("HMAC", key, base64urlDecode(sigB64), encoder.encode(bodyB64));
    if (!valid) return null;

    const body = JSON.parse(decoder.decode(base64urlDecode(bodyB64))) as SignedSessionBody;
    if (typeof body.exp !== "number" || body.exp < Date.now()) return null;

    return { phone: body.phone, name: body.name };
  } catch {
    return null;
  }
}
