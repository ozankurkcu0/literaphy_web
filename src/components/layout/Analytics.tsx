import Script from "next/script";

/**
 * GA4 (gtag.js) entegrasyonu. `NEXT_PUBLIC_GA_MEASUREMENT_ID` tanımlı
 * değilken hiçbir şey render etmez — ölçüm ID'si eklenene kadar sessizce
 * devre dışı kalır (bkz. .env.example). ID eklendikten sonra ek kod
 * değişikliği gerekmez, sadece env değişkenini set edip deploy etmek yeterli.
 */
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export function Analytics() {
  if (!GA_MEASUREMENT_ID) return null;

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`} strategy="afterInteractive" />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}');
        `}
      </Script>
    </>
  );
}
