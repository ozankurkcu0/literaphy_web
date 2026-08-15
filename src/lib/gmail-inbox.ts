import "server-only";
import { ImapFlow, type FetchMessageObject } from "imapflow";

/**
 * Gelen Kutusu sekmesi için Gmail'e IMAP + Uygulama Şifresi ile bağlanır
 * (OAuth/Google Cloud projesi gerekmez). Site formlarından (İletişim,
 * N8N/QR Menü demo) Resend ile giden bildirim maillerini tanıyıp içeriğini
 * ayrıştırır (bkz. src/lib/email.ts'teki ortak HTML şablonu, parseLeadHtml
 * aynı şablonu okuyor) — "Bekleyen Müşteriler" listesi bunlardan oluşur.
 *
 * Mail göndermez/silmez; tek yazma işlemi, standart IMAP "\Answered"
 * bayrağını açıp kapatmak (bkz. setLeadAnswered) — panelden "Cevap
 * verildi" işaretlemesi için. Bu bayrak Gmail'in kendisinde de görünür.
 */
export interface InboxLead {
  uid: number;
  subject: string;
  source: string; // "İletişim Formu", "N8N Otomasyonları Demo Talebi" vb.
  date: string; // ISO
  seen: boolean;
  answered: boolean;
  fields: { label: string; value: string }[];
}

const LEAD_SUBJECT_PREFIXES = [
  "Yeni iletişim talebi —",
  "Yeni N8N otomasyon demo talebi —",
  "Yeni QR Menü demo talebi —",
];

function isLeadSubject(subject: string): boolean {
  return LEAD_SUBJECT_PREFIXES.some((prefix) => subject.startsWith(prefix));
}

export function isGmailInboxConfigured(): boolean {
  return Boolean(process.env.GMAIL_IMAP_USER && process.env.GMAIL_IMAP_APP_PASSWORD);
}

function getConfig() {
  const user = process.env.GMAIL_IMAP_USER;
  const password = process.env.GMAIL_IMAP_APP_PASSWORD;

  if (!user || !password) {
    throw new Error(
      "Gmail gelen kutusu bağlantısı yapılandırılmamış (GMAIL_IMAP_USER / GMAIL_IMAP_APP_PASSWORD env " +
        "değişkenleri eksik). Kurulum için bkz. docs/admin-panel-kurulum.md",
    );
  }

  return { user, password };
}

async function withClient<T>(fn: (client: ImapFlow) => Promise<T>): Promise<T> {
  const { user, password } = getConfig();
  const client = new ImapFlow({
    host: "imap.gmail.com",
    port: 993,
    secure: true,
    auth: { user, pass: password },
    logger: false,
  });

  await client.connect();
  try {
    return await fn(client);
  } finally {
    await client.logout().catch(() => client.close());
  }
}

interface BodyStructureNode {
  type?: string;
  part?: string;
  childNodes?: BodyStructureNode[];
}

function findBodyPart(node: BodyStructureNode | undefined, wantedType: string): string | undefined {
  if (!node) return undefined;
  if (node.type?.toLowerCase() === wantedType) return node.part ?? "1";
  if (node.childNodes) {
    for (const child of node.childNodes) {
      const found = findBodyPart(child, wantedType);
      if (found) return found;
    }
  }
  return undefined;
}

async function streamToString(stream: NodeJS.ReadableStream): Promise<string> {
  const chunks: Buffer[] = [];
  for await (const chunk of stream) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  return Buffer.concat(chunks).toString("utf-8");
}

/** src/lib/email.ts'teki sabit HTML şablonunu (üst köşede kaynak etiketi +
 * altında label/value tablo satırları) geri çözer. Kendi ürettiğimiz sabit
 * bir şablon olduğu için basit regex ile ayrıştırmak güvenli. */
function parseLeadHtml(html: string): { source: string; fields: { label: string; value: string }[] } {
  const sourceMatch = /margin:\s*0\s*0\s*16px;">([^<]*)<\/p>/.exec(html);
  const source = sourceMatch?.[1]?.trim() ?? "";

  const fields: { label: string; value: string }[] = [];
  const rowRegex = /<td[^>]*>([^<]*)<\/td>\s*<td[^>]*>([\s\S]*?)<\/td>/g;
  let match: RegExpExecArray | null;
  while ((match = rowRegex.exec(html))) {
    const label = (match[1] ?? "").trim();
    const value = (match[2] ?? "")
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<[^>]+>/g, "")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .trim();
    if (label && value) fields.push({ label, value });
  }

  return { source, fields };
}

export async function listLeads(limit = 30): Promise<InboxLead[]> {
  return withClient(async (client) => {
    const lock = await client.getMailboxLock("INBOX");
    try {
      const total = client.mailbox && typeof client.mailbox === "object" ? client.mailbox.exists : 0;
      if (!total) return [];

      const start = Math.max(1, total - limit + 1);
      const leadCandidates: FetchMessageObject[] = [];

      for await (const message of client.fetch(`${start}:*`, { envelope: true, flags: true, uid: true })) {
        const subject = message.envelope?.subject || "";
        if (isLeadSubject(subject)) leadCandidates.push(message);
      }

      const leads: InboxLead[] = [];
      for (const candidate of leadCandidates) {
        try {
          const fetched = await client.fetchOne(candidate.uid, { bodyStructure: true }, { uid: true });
          if (!fetched) continue;
          const part = findBodyPart(fetched.bodyStructure as BodyStructureNode, "text/html");
          if (!part) continue;

          const { content } = await client.download(candidate.uid, part, { uid: true });
          const html = await streamToString(content);
          const { source, fields } = parseLeadHtml(html);
          if (fields.length === 0) continue;

          leads.push({
            uid: candidate.uid,
            subject: candidate.envelope?.subject || "",
            source,
            date: (candidate.envelope?.date ?? new Date()).toISOString(),
            seen: candidate.flags?.has("\\Seen") ?? false,
            answered: candidate.flags?.has("\\Answered") ?? false,
            fields,
          });
        } catch (error) {
          console.error(`[gmail-inbox] uid ${candidate.uid} gövdesi ayrıştırılamadı:`, error);
        }
      }

      return leads.reverse(); // en yeni en üstte
    } finally {
      lock.release();
    }
  });
}

export async function setLeadAnswered(uid: number, answered: boolean): Promise<void> {
  await withClient(async (client) => {
    const lock = await client.getMailboxLock("INBOX");
    try {
      if (answered) {
        await client.messageFlagsAdd(String(uid), ["\\Answered"], { uid: true });
      } else {
        await client.messageFlagsRemove(String(uid), ["\\Answered"], { uid: true });
      }
    } finally {
      lock.release();
    }
  });
}
