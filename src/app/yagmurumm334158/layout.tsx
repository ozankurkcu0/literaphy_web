import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "yağmurumm",
  robots: { index: false, follow: false },
};

// Bu sayfaya özel pixel/cottagecore fontları — açılış ekranıyla (public/yagmurumm334158/intro)
// aynı tema. Sadece bu route'ta yüklenir, sitenin geri kalanını etkilemez.
export default function Yagmurumm334158Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link
        href="https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Pixelify+Sans:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />
      {children}
    </>
  );
}
