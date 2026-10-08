export interface ClientReference {
  /** Firma / marka adı — logo yoksa kutuda bu yazılır. */
  name: string;
  /** Ne sattık / ne yaptık — kısa, örn. "Kurumsal web sitesi". */
  service: string;
  /** İsteğe bağlı logo (public/references altına koy, örn. "/references/vento.png").
   * Şeffaf PNG/SVG, yatay logo en iyisi. Yoksa firma adı yazı olarak basılır. */
  logo?: string;
  /** İsteğe bağlı: firmanın sitesi — verilirse kutu yeni sekmede bu adrese gider. */
  url?: string;
}

/**
 * Referans eklemek için listeye yeni bir satır ekle, başka bir şey gerekmiyor.
 * Sadece izin aldığın / paylaşmaktan çekinmediğin müşterileri yaz.
 */
export const clientReferences: ClientReference[] = [
  { name: "Vento Yapı", service: "Kurumsal web sitesi" },
  { name: "Özsu Bakım", service: "E-ticaret sitesi" },
  { name: "RAFF Coffee", service: "QR menü sistemi" },
];
