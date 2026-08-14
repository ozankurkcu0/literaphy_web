import "server-only";
import { Resend } from "resend";

/**
 * Form bildirim e-postaları — Resend üzerinden gönderilir.
 *
 * `RESEND_API_KEY` tanımlı değilken sessizce no-op olur (sadece konsola
 * uyarı yazar); form akışları bu yüzden hiç kırılmaz — .env.example'a
 * bakın. ID eklendikten sonra ek kod değişikliği gerekmez.
 */
const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

// Resend hesabı doğrulanmış bir alan adı bağlanana kadar kendi paylaşımlı
// test alan adlarını (onboarding@resend.dev) kullanır — bu, herhangi bir
// alıcıya gönderim yapabilir, sadece "From" görünen adı jenerik kalır.
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "Literaphy Site <onboarding@resend.dev>";
const NOTIFY_EMAIL = process.env.CONTACT_NOTIFY_EMAIL || "literaphy@gmail.com";

interface SendNotificationInput {
  subject: string;
  rows: { label: string; value: string }[];
  sourceLabel: string;
}

/** Basit, okunabilir bir bildirim e-postası gönderir (etiket/değer satırları
 * halinde). Gönderim başarısız olsa bile hata fırlatmaz — çağıran form akışı
 * kullanıcıya yine de başarı mesajı gösterebilsin diye; hata sadece
 * konsola loglanır. */
export async function sendNotificationEmail({ subject, rows, sourceLabel }: SendNotificationInput) {
  if (!resend) {
    console.warn(`[email] RESEND_API_KEY tanımlı değil, "${subject}" bildirimi gönderilmedi (sadece loglandı).`);
    return { sent: false as const };
  }

  const html = `
    <div style="font-family: -apple-system, sans-serif; max-width: 560px; margin: 0 auto;">
      <p style="font-size: 13px; letter-spacing: 0.04em; text-transform: uppercase; color: #71717a; margin: 0 0 16px;">${sourceLabel}</p>
      <table style="width: 100%; border-collapse: collapse;">
        ${rows
          .map(
            (row) => `
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #e4e4e7; color: #71717a; font-size: 13px; width: 140px; vertical-align: top;">${row.label}</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #e4e4e7; color: #18181b; font-size: 14px; white-space: pre-wrap;">${row.value}</td>
          </tr>`,
          )
          .join("")}
      </table>
    </div>
  `;

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: NOTIFY_EMAIL,
      subject,
      html,
    });
    return { sent: true as const };
  } catch (error) {
    console.error(`[email] "${subject}" gönderilirken hata:`, error);
    return { sent: false as const };
  }
}
