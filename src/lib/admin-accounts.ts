import "server-only";
import fs from "node:fs";
import path from "node:path";
import bcrypt from "bcryptjs";

/**
 * Admin hesap listesi. Şifreler HER ZAMAN bcrypt hash olarak saklanır,
 * düz metin şifre bu dosyanın hiçbir yerinde tutulmaz/loglanmaz.
 *
 * Kaynak önceliği:
 *  1. ADMIN_ACCOUNTS_JSON env değişkeni (production/Vercel için önerilen —
 *     repo public olduğundan gerçek kullanımda bunu tercih edin).
 *  2. data/admins.local.json dosyası (yerelde denerken kullanılır, .gitignore
 *     ile commit'lenmesi engellenmiştir).
 *
 * Kurulum ve yeni admin ekleme için: docs/admin-panel-kurulum.md
 */
export interface AdminAccount {
  phone: string;
  passwordHash: string;
  name?: string;
}

export function normalizePhone(raw: string): string {
  return raw.replace(/\D/g, "");
}

let cachedAccounts: AdminAccount[] | null = null;

function loadAccounts(): AdminAccount[] {
  if (cachedAccounts) return cachedAccounts;

  const fromEnv = process.env.ADMIN_ACCOUNTS_JSON;
  if (fromEnv && fromEnv.trim()) {
    try {
      const parsed = JSON.parse(fromEnv) as AdminAccount[];
      cachedAccounts = parsed.map((account) => ({ ...account, phone: normalizePhone(account.phone) }));
      return cachedAccounts;
    } catch (error) {
      console.error("[admin-accounts] ADMIN_ACCOUNTS_JSON parse edilemedi:", error);
      cachedAccounts = [];
      return cachedAccounts;
    }
  }

  const filePath = path.join(process.cwd(), "data", "admins.local.json");
  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    const parsed = JSON.parse(raw) as AdminAccount[];
    cachedAccounts = parsed.map((account) => ({ ...account, phone: normalizePhone(account.phone) }));
    return cachedAccounts;
  } catch {
    cachedAccounts = [];
    return cachedAccounts;
  }
}

export function hasAnyAdminAccountConfigured(): boolean {
  return loadAccounts().length > 0;
}

export async function verifyAdminCredentials(
  phoneRaw: string,
  password: string,
): Promise<Pick<AdminAccount, "phone" | "name"> | null> {
  const phone = normalizePhone(phoneRaw);
  const accounts = loadAccounts();
  const account = accounts.find((item) => item.phone === phone);

  // Hesap bulunamasa bile bcrypt.compare çalıştırıp zamanlama farkını azaltıyoruz.
  const hash = account?.passwordHash ?? "$2a$10$invalidsaltinvalidsaltinvalidsaltinvalidsaltinvalidsa";
  const ok = await bcrypt.compare(password, hash);
  if (!ok || !account) return null;

  return { phone: account.phone, name: account.name };
}

// ---- Panel içinden hesap yönetimi ---------------------------------------
// Aşağıdakiler admin panelindeki "Hesaplar" sayfası için — CLI script'in
// (scripts/create-admin.mjs) yaptığının aynısını API üzerinden yapıyor.

export type AdminAccountsSource = "file" | "env";

/** ADMIN_ACCOUNTS_JSON set edilmişse (production/Vercel) kaynak "env" —
 * bu durumda dosyaya yazamayız (Vercel'in dosya sistemi salt okunur ve her
 * deploy'da sıfırlanır), sadece bellek içi listeyi güncelleyip kalıcı
 * olması için gereken JSON'u kullanıcıya gösterebiliriz. */
export function getAdminAccountsSource(): AdminAccountsSource {
  return process.env.ADMIN_ACCOUNTS_JSON && process.env.ADMIN_ACCOUNTS_JSON.trim() ? "env" : "file";
}

export interface AdminAccountSummary {
  phone: string;
  name?: string;
}

export function listAdminAccountsSummary(): AdminAccountSummary[] {
  return loadAccounts().map(({ phone, name }) => ({ phone, name }));
}

export interface PersistAdminAccountsResult {
  accounts: AdminAccountSummary[];
  accountsJson: string;
  persisted: boolean;
}

function persistAccounts(next: AdminAccount[]): PersistAdminAccountsResult {
  const source = getAdminAccountsSource();

  if (source === "file") {
    const filePath = path.join(process.cwd(), "data", "admins.local.json");
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, JSON.stringify(next, null, 2) + "\n", "utf-8");
  }

  cachedAccounts = next;

  return {
    accounts: next.map(({ phone, name }) => ({ phone, name })),
    accountsJson: JSON.stringify(next),
    persisted: source === "file",
  };
}

export async function upsertAdminAccount(input: {
  phone: string;
  password: string;
  name?: string;
}): Promise<PersistAdminAccountsResult> {
  const phone = normalizePhone(input.phone);
  const passwordHash = await bcrypt.hash(input.password, 10);
  const current = loadAccounts();
  const next = [
    ...current.filter((account) => account.phone !== phone),
    { phone, passwordHash, ...(input.name ? { name: input.name } : {}) },
  ];
  return persistAccounts(next);
}

export function removeAdminAccount(phoneRaw: string): PersistAdminAccountsResult {
  const phone = normalizePhone(phoneRaw);
  const current = loadAccounts();
  const next = current.filter((account) => account.phone !== phone);
  return persistAccounts(next);
}
