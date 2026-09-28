import type { Weekday } from "@/lib/calisma-program-constants";

/** /yagmurumprofugececek — Proficiency sınavına hazırlık için örnek haftalık
 * çalışma programı. Sabit bir şablon: her günün görevleri her Pazartesi
 * "temiz" başlasın diye tamamlanma durumu haftaya göre (bkz.
 * getCurrentWeekKey) ayrı tutuluyor, görevlerin kendisi değişmiyor. */

export type StudyCategory = "Vocab" | "Listening" | "Reading" | "Writing" | "Grammar" | "Speaking" | "Deneme" | "Diğer";

export const STUDY_CATEGORIES: StudyCategory[] = [
  "Vocab",
  "Listening",
  "Reading",
  "Writing",
  "Grammar",
  "Speaking",
  "Deneme",
  "Diğer",
];

export interface StudyTask {
  id: string;
  category: StudyCategory;
  label: string;
}

export const YAGMUR_STUDY_PLAN: Record<Weekday, StudyTask[]> = {
  Pazartesi: [
    { id: "pzt-1", category: "Vocab", label: "Oxford 5000: 20 yeni kelime + örnek cümle" },
    { id: "pzt-2", category: "Grammar", label: "Conditionals (0-3 + mixed) tekrar" },
    { id: "pzt-3", category: "Listening", label: "BBC 6 Minute English: 1 bölüm + not alma" },
  ],
  Salı: [
    { id: "sal-1", category: "Vocab", label: "Dünün 20 kelimesini tekrar et" },
    { id: "sal-2", category: "Reading", label: "The Guardian/The Economist'ten 1 makale" },
    { id: "sal-3", category: "Writing", label: "Okuduğun makale hakkında 1 paragraf özet" },
  ],
  Çarşamba: [
    { id: "car-1", category: "Vocab", label: "Oxford 5000: 20 yeni kelime + örnek cümle" },
    { id: "car-2", category: "Listening", label: "TED Talk: altyazısız izle, sonra altyazılı tekrar izle" },
    { id: "car-3", category: "Speaking", label: "10 dk shadowing (izlediğin TED Talk'tan)" },
  ],
  Perşembe: [
    { id: "per-1", category: "Vocab", label: "Haftanın kelimelerini karışık tekrar" },
    { id: "per-2", category: "Grammar", label: "Cambridge Proficiency (CPE) Use of English pratik bölümü" },
    { id: "per-3", category: "Reading", label: "1 makale + bilmediğin kelimeleri not al" },
  ],
  Cuma: [
    { id: "cum-1", category: "Vocab", label: "Oxford 5000: 20 yeni kelime + örnek cümle" },
    { id: "cum-2", category: "Writing", label: "1 deneme/essay yaz (40-50 dk, sınav formatında)" },
    { id: "cum-3", category: "Listening", label: "Podcast: 1 bölüm (ör. 6 Minute English / The English We Speak)" },
  ],
  Cumartesi: [
    { id: "cmt-1", category: "Deneme", label: "Mini Proficiency denemesi: Reading & Use of English" },
    { id: "cmt-2", category: "Vocab", label: "Haftanın 100 kelimesini genel tekrar (flashcard)" },
    { id: "cmt-3", category: "Speaking", label: "15 dk serbest konuşma pratiği (kendini kaydet, dinle)" },
  ],
  Pazar: [
    { id: "paz-1", category: "Vocab", label: "Haftanın kelimelerini son bir kez tekrar et" },
    { id: "paz-2", category: "Deneme", label: "Yaptığın deneme/yazıları gözden geçir, hatalarını not al" },
    { id: "paz-3", category: "Listening", label: "Hafif bir dinleme: film/dizi sahnesi, İngilizce altyazı" },
  ],
};

export const STUDY_CATEGORY_META: Record<StudyCategory, { dot: string; badge: string }> = {
  Vocab: { dot: "bg-pink-400", badge: "bg-pink-50 text-pink-700 border-pink-200" },
  Listening: { dot: "bg-purple-400", badge: "bg-purple-50 text-purple-700 border-purple-200" },
  Reading: { dot: "bg-orange-400", badge: "bg-orange-50 text-orange-700 border-orange-200" },
  Writing: { dot: "bg-violet-400", badge: "bg-violet-50 text-violet-700 border-violet-200" },
  Grammar: { dot: "bg-rose-500", badge: "bg-rose-50 text-rose-700 border-rose-200" },
  Speaking: { dot: "bg-fuchsia-400", badge: "bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200" },
  Deneme: { dot: "bg-red-500", badge: "bg-red-50 text-red-700 border-red-200" },
  Diğer: { dot: "bg-slate-400", badge: "bg-slate-50 text-slate-700 border-slate-200" },
};

/** ISO haftanın Pazartesi'sini "YYYY-MM-DD" olarak döndürür — checklist
 * durumu bu anahtara göre tutulduğu için her Pazartesi otomatik "temiz"
 * (işaretsiz) başlar, herhangi bir sıfırlama işlemi gerekmez. */
export function getCurrentWeekKey(): string {
  const now = new Date();
  const day = now.getDay(); // 0 = Pazar
  const diffToMonday = day === 0 ? -6 : 1 - day;
  const monday = new Date(now.getFullYear(), now.getMonth(), now.getDate() + diffToMonday);
  const yyyy = monday.getFullYear();
  const mm = String(monday.getMonth() + 1).padStart(2, "0");
  const dd = String(monday.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}
