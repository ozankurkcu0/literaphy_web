"use client";

import { useEffect, useRef, useState } from "react";
import { type MotionValue, useMotionValueEvent } from "motion/react";

interface ScrollFrameSequenceProps {
  /** frame-001.jpg, frame-002.jpg ... şeklindeki dosyaların bulunduğu, /public
   * altındaki klasör (baştaki / ile, örn. "/scroll-frames/laptop"). */
  basePath: string;
  frameCount: number;
  /** 0'dan frameCount-1'e kadar hangi karenin gösterileceğini belirleyen,
   * 0-1 aralığında normalize edilmiş segment ilerlemesi. */
  progress: MotionValue<number>;
  className?: string;
}

function frameSrc(basePath: string, index: number) {
  return `${basePath}/frame-${String(index + 1).padStart(3, "0")}.jpg`;
}

// Tüm kareleri mount anında aynı anda istemek yerine (bir segment 180 kare =
// 180 eş zamanlı istek, sayfa başına 3 segment = 540) küçük gruplar halinde,
// tarayıcı boştayken yüklüyoruz — kritik kaynaklarla (font, hydration JS)
// yarışmasınlar diye. SEO performans denetiminde tespit edildi.
const BATCH_SIZE = 24;

function scheduleIdle(cb: () => void) {
  if (typeof window.requestIdleCallback === "function") {
    window.requestIdleCallback(cb, { timeout: 500 });
  } else {
    setTimeout(cb, 0);
  }
}

/**
 * Apple ürün sayfalarındaki "scroll-scrub" tekniği: önceden video olarak
 * üretilip kare kare dışa aktarılmış bir dizi görseli, scroll pozisyonuna
 * göre bir <canvas>'a çizer. Video/GIF oynatmak yerine kareler önceden
 * yüklenip (preload) doğrudan çizildiği için scroll ile birebir, takılmadan
 * senkron kalır.
 */
export function ScrollFrameSequence({ basePath, frameCount, progress, className }: ScrollFrameSequenceProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const cssSizeRef = useRef({ width: 0, height: 0 });
  const [firstFrameReady, setFirstFrameReady] = useState(false);

  // Kareleri gruplar halinde, boşta kaldıkça yükle. İlk kare gelir gelmez
  // hemen çiziyoruz ki boş canvas görünmesin; geri kalanı arka planda,
  // ana thread'i/ağı bloklamadan yüklenmeye devam ediyor.
  useEffect(() => {
    let cancelled = false;
    const images: HTMLImageElement[] = new Array(frameCount);
    imagesRef.current = images;

    function loadFrame(i: number) {
      const img = new window.Image();
      img.src = frameSrc(basePath, i);
      if (i === 0) {
        img.onload = () => {
          if (!cancelled) setFirstFrameReady(true);
        };
      }
      images[i] = img;
    }

    // İlk grup (kullanıcı sayfayı açar açmaz görebileceği kareler) hemen,
    // gerisi requestIdleCallback ile küçük gruplar halinde.
    for (let i = 0; i < Math.min(BATCH_SIZE, frameCount); i += 1) {
      loadFrame(i);
    }

    let next = BATCH_SIZE;
    function loadNextBatch() {
      if (cancelled) return;
      const end = Math.min(next + BATCH_SIZE, frameCount);
      for (let i = next; i < end; i += 1) loadFrame(i);
      next = end;
      if (next < frameCount) scheduleIdle(loadNextBatch);
    }
    if (next < frameCount) scheduleIdle(loadNextBatch);

    return () => {
      cancelled = true;
    };
  }, [basePath, frameCount]);

  const drawFrame = (index: number) => {
    const canvas = canvasRef.current;
    const img = imagesRef.current[index];
    if (!canvas || !img || !img.complete || img.naturalWidth === 0) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const { width: cssWidth, height: cssHeight } = cssSizeRef.current;
    if (cssWidth === 0 || cssHeight === 0) return;
    const targetWidth = cssWidth * dpr;
    const targetHeight = cssHeight * dpr;
    if (canvas.width !== targetWidth || canvas.height !== targetHeight) {
      canvas.width = targetWidth;
      canvas.height = targetHeight;
    }

    // object-fit: cover mantığını elle uyguluyoruz — canvas'ın kendi CSS
    // boyutuna göre kaynağı ortadan kırpıp dolduruyoruz.
    const canvasRatio = cssWidth / cssHeight;
    const imgRatio = img.naturalWidth / img.naturalHeight;
    let sx = 0;
    let sy = 0;
    let sWidth = img.naturalWidth;
    let sHeight = img.naturalHeight;
    if (imgRatio > canvasRatio) {
      sWidth = img.naturalHeight * canvasRatio;
      sx = (img.naturalWidth - sWidth) / 2;
    } else {
      sHeight = img.naturalWidth / canvasRatio;
      sy = (img.naturalHeight - sHeight) / 2;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, canvas.width, canvas.height);
  };

  useMotionValueEvent(progress, "change", (value) => {
    const clamped = Math.min(Math.max(value, 0), 1);
    const index = Math.min(frameCount - 1, Math.round(clamped * (frameCount - 1)));
    drawFrame(index);
  });

  // Canvas'ın CSS boyutunu sadece gerçek boyut değişikliklerinde (ResizeObserver)
  // ölçüp cache'liyoruz — her scroll/drawFrame çağrısında clientWidth/clientHeight
  // okumak (layout'u zorlayabilir) yerine buradan okunuyor.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const measure = () => {
      cssSizeRef.current = { width: canvas.clientWidth, height: canvas.clientHeight };
    };
    measure();

    const observer = new ResizeObserver(() => {
      measure();
      if (firstFrameReady) {
        drawFrame(Math.round(Math.min(Math.max(progress.get(), 0), 1) * (frameCount - 1)));
      }
    });
    observer.observe(canvas);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // İlk kare yüklendiğinde çiz.
  useEffect(() => {
    if (!firstFrameReady) return;
    drawFrame(Math.round(Math.min(Math.max(progress.get(), 0), 1) * (frameCount - 1)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firstFrameReady]);

  return <canvas ref={canvasRef} className={className} aria-hidden />;
}
