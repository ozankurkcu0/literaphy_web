"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { LiquidMetal } from "@paper-design/shaders-react";

function supportsWebGL2(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2"));
  } catch {
    return false;
  }
}

/**
 * CSS/motion "liquid metal" fallback — used whenever the real WebGL2 shader
 * can't run (Brave/Firefox strict privacy shields, older GPUs, WebGL
 * disabled, etc). The shader library throws inside an async effect when
 * `getContext('webgl2')` returns null, which React can't catch, so we detect
 * support ourselves *before* ever mounting `<LiquidMetal>`.
 */
function LiquidMetalFallback() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse 80% 55% at 50% 0%, var(--color-accent-soft), transparent 60%)",
        }}
      />
      {/* On the light palette these stay as a barely-there haze — a single sparing
          tint (the spec's "incecik elektrik mavisi"), not a colored glow. */}
      <motion.div
        className="absolute rounded-full blur-[110px]"
        style={{
          width: 620,
          height: 620,
          top: "-14%",
          left: "-10%",
          background: "radial-gradient(circle, var(--color-icon-tint) 0%, transparent 70%)",
          opacity: 0.08,
        }}
        animate={{ x: [0, 60, -20, 0], y: [0, 40, 80, 0], scale: [1, 1.15, 0.95, 1] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute rounded-full blur-[120px]"
        style={{
          width: 520,
          height: 520,
          top: "8%",
          right: "-12%",
          background: "radial-gradient(circle, var(--color-foreground) 0%, transparent 70%)",
          opacity: 0.05,
        }}
        animate={{ x: [0, -50, 30, 0], y: [0, 60, -30, 0], scale: [1, 0.9, 1.1, 1] }}
        transition={{ duration: 26, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />
      <motion.div
        className="absolute rounded-full blur-[130px]"
        style={{
          width: 460,
          height: 460,
          bottom: "-18%",
          left: "28%",
          background: "radial-gradient(circle, var(--color-icon-tint) 0%, transparent 70%)",
          opacity: 0.06,
        }}
        animate={{ x: [0, 40, -40, 0], y: [0, -30, 20, 0] }}
        transition={{ duration: 30, repeat: Infinity, ease: "easeInOut", delay: 4 }}
      />
    </div>
  );
}

type WebglSupport = "checking" | "supported" | "unsupported";

/**
 * Renders behind the rest of the Hero's content purely through DOM order
 * (it's the first child painted in its stacking context), the same way the
 * grid-texture overlay layer works — deliberately NOT using a negative
 * z-index, since the parent `<section>` has `position: relative` without
 * its own z-index and therefore never establishes a stacking context; a
 * negative z-index there escapes to the document root and paints behind
 * the page background, which is why the shader was invisible.
 */
export function LiquidMetalBackground() {
  const [webgl, setWebgl] = useState<WebglSupport>("checking");
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    setWebgl(supportsWebGL2() ? "supported" : "unsupported");

    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(query.matches);
    const listener = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    query.addEventListener("change", listener);
    return () => query.removeEventListener("change", listener);
  }, []);

  if (webgl === "checking") {
    return null;
  }

  if (webgl === "unsupported") {
    return <LiquidMetalFallback />;
  }

  return (
    <LiquidMetal
      colorBack="#ffffff"
      colorTint="#eef4ff"
      shape="none"
      scale={1}
      speed={reducedMotion ? 0 : 0.45}
      softness={0.25}
      repetition={2.5}
      distortion={0.18}
      contour={0.3}
      shiftRed={0.05}
      shiftBlue={-0.05}
      angle={45}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        opacity: 0.5,
        pointerEvents: "none",
      }}
      aria-hidden
    />
  );
}
