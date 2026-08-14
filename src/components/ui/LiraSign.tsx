import { cn } from "@/lib/utils";

/**
 * ₺ (Türk Lirası işareti) hiçbir yerde kendi başına, çevresindeki rakamlarla
 * aynı satırda çıplak kullanılmamalı — bu bileşen üzerinden render edilmeli.
 *
 * Neden: sitenin font-mono'su (JetBrains Mono) `next/font/google` üzerinden
 * sadece "latin" subset'iyle yükleniyor, bu subset ₺ (U+20BA) glyph'ini
 * içermiyor. Tarayıcı bu tek karakter için sessizce sistem yedek fontuna
 * düşüyor — hangi yedek fontun seçildiği işletim sistemine/tarayıcıya göre
 * değişiyor, bazılarında bu yedek glyph rakamlara göre orantısız derecede
 * büyük/kalın çıkıyor. Boyutu çevredeki metinden bağımsız, göreli ve küçük
 * bir `em` değerine sabitleyip `align-baseline` ile hizalamak, hangi font
 * devreye girerse girsin görünümü tutarlı tutuyor.
 */
export function LiraSign({ className }: { className?: string }) {
  return <span className={cn("text-[0.62em] align-baseline", className)}>₺</span>;
}
