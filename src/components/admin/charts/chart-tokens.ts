/** Analiz sayfası grafiklerinin renk/ölçü sabitleri — dataviz skill'inin
 * doğrulanmış referans paletinden (light mode, bu site zaten light-only).
 * Slot 1/2 bitişik çift olarak doğrulanmış (CVD ΔE 9.1, normal görüş 19.6),
 * yeniden hesaplamaya gerek yok. */
export const CHART_COLORS = {
  income: "#2a78d6", // kategorik slot 1 (mavi) — Gelir
  expense: "#eb6834", // kategorik slot 2 (turuncu) — Gider
  sequential: "#2a78d6", // tek seri sıralı grafikler için aynı mavi
  surface: "#fcfcfb",
  gridline: "#e1e0d9",
  axis: "#c3c2b7",
  textPrimary: "#0b0b0b",
  textSecondary: "#52514e",
  textMuted: "#898781",
} as const;

export const BAR_MAX_THICKNESS = 24;
export const BAR_GAP = 2;
