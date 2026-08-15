import type { Currency, Status } from "@/lib/google-sheets";

/** OrderFormDialog (giriş) ve admin sipariş sayfasındaki filtre dropdown'ı
 * arasında paylaşılan sabit seçenek listeleri. */
export const SERVICE_TYPE_OPTIONS = [
  { label: "Web Geliştirme", value: "Web Geliştirme" },
  { label: "N8N / AI Otomasyonu", value: "N8N / AI Otomasyonu" },
  { label: "QR Menü Sistemi", value: "QR Menü Sistemi" },
  { label: "WhatsApp Otomasyonu", value: "WhatsApp Otomasyonu" },
  { label: "Diğer", value: "Diğer" },
];

export const CURRENCY_OPTIONS: { label: string; value: Currency }[] = [
  { label: "₺ TL", value: "TRY" },
  { label: "$ USD", value: "USD" },
  { label: "€ EUR", value: "EUR" },
];

export const STATUS_OPTIONS: { label: string; value: Status }[] = [
  { label: "Aktif", value: "Aktif" },
  { label: "Tamamlandı", value: "Tamamlandı" },
  { label: "İptal", value: "İptal" },
];
