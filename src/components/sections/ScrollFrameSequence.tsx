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
  const [firstFrameReady, setFirstFrameReady] = useState(false);

  // Kareleri önceden yükle. İlk kare gelir gelmez hemen çiziyoruz ki boş
  // canvas görünmesin; geri kalanı arka planda yüklenmeye devam ediyor.
  useEffect(() => {
    let cancelled = false;
    const images: HTMLImageElement[] = new Array(frameCount);
    imagesRef.current = images;

    for (let i = 0; i < frameCount; i += 1) {
      const img = new window.Image();
      img.src = frameSrc(basePath, i);
      if (i === 0) {
        img.onload = () => {
          if (!cancelled) setFirstFrameReady(true);
        };
      }
      images[i] = img;
    }

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
    const cssWidth = canvas.clientWidth;
    const cssHeight = canvas.clientHeight;
    if (canvas.width !== cssWidth * dpr || canvas.height !== cssHeight * dpr) {
      canvas.width = cssWidth * dpr;
      canvas.height = cssHeight * dpr;
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

  // İlk kare yüklendiğinde ve pencere yeniden boyutlandığında da çiz.
  useEffect(() => {
    if (!firstFrameReady) return;
    drawFrame(Math.round(Math.min(Math.max(progress.get(), 0), 1) * (frameCount - 1)));
    const onResize = () => drawFrame(Math.round(Math.min(Math.max(progress.get(), 0), 1) * (frameCount - 1)));
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firstFrameReady]);

  return <canvas ref={canvasRef} className={className} aria-hidden />;
}
