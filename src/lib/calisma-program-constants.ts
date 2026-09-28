/**
 * /calismaprogram sabitleri — hem sunucu (google-sheets.ts CRUD
 * fonksiyonları) hem de client component'ler (form select'leri) tarafından
 * kullanılıyor. google-sheets.ts "server-only" import ettiği için bu
 * sabitler oradan değil, buradan (server-only'siz) export edilir — aksi
 * halde client bundle'a googleapis gibi sunucu-only kod sızar.
 */

export const WEEKDAYS = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"] as const;
export type Weekday = (typeof WEEKDAYS)[number];

export const SCHEDULE_EVENT_TYPES = ["Sınav", "Quiz", "Spor", "Toplantı", "Diğer"] as const;
export type ScheduleEventType = (typeof SCHEDULE_EVENT_TYPES)[number];

// Haftalık program (Ders Programı) satırları için tip seçenekleri — sabit
// derslerin yanında spor, kulüp gibi her hafta tekrar eden kişisel
// aktiviteleri de aynı tabloya, tipine göre renklendirilmiş olarak eklemeye
// izin verir (bkz. WeeklyTimetable.tsx).
export const TIMELINE_KINDS = ["Ders", ...SCHEDULE_EVENT_TYPES] as const;
export type TimelineKind = (typeof TIMELINE_KINDS)[number];
