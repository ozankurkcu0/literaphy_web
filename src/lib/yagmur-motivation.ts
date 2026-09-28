/** /yagmurumprofugececek — sabit sınav bilgisi ve ara sıra dönen motivasyon
 * sözleri. İkisi de statik: sınav tarihi/adı değişmedikçe backend'e taşımaya
 * gerek yok. */

export const YAGMUR_EXAM = {
  name: "Proficiency Sınavı",
  date: "2027-01-15",
} as const;

export const YAGMUR_MOTIVATION_QUOTES: string[] = [
  "Sen her şeyi yapabilirsin 🌸",
  "Bu sınav senden daha önemli değil.",
  "Bugün küçük bir adım, sınav gününde büyük bir fark.",
  "Yorulman normal, vazgeçmen değil.",
  "Az kaldı, sen bunu hallediyorsun.",
  "Kendine güven, hazırlığın seninle.",
  "Bir kelime daha, bir adım daha ileri.",
  "Zor günler de senin hikayenin bir parçası, pes etme.",
  "Bugün öğrendiğin her şey seninle kalacak.",
  "Nefes al, devam et, başaracaksın.",
];
