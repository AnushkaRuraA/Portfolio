"use client";

import { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  life: number; // 1 → 0
  decay: number;
  hue: number;
  spin: number;
  rot: number;
}

/**
 * Bright little stars that trail the cursor and fade out when it stops moving.
 * Pure canvas 2D + requestAnimationFrame — no WebGL, cheap enough to run site-wide.
 * Disabled for touch devices and when prefers-reduced-motion is set.
 */
export function CursorTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const isTouch =
      window.matchMedia("(hover: none)").matches ||
      !window.matchMedia("(pointer: fine)").matches;
    if (reduce || isTouch) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const cv = canvas;
    const context = ctx;

    let width = 0;
    let height = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      cv.width = Math.floor(width * dpr);
      cv.height = Math.floor(height * dpr);
      cv.style.width = width + "px";
      cv.style.height = height + "px";
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener("resize", resize);

    const stars: Star[] = [];
    let lastX = 0;
    let lastY = 0;
    let hasPointer = false;

    // Accent-leaning palette (indigo → violet → white).
    const hues = [245, 255, 268, 280];

    function spawn(x: number, y: number, speed: number) {
      // More stars the faster you move; capped so it stays subtle.
      const count = Math.min(3, 1 + Math.floor(speed / 14));
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const spread = Math.random() * 0.6;
        stars.push({
          x: x + (Math.random() - 0.5) * 6,
          y: y + (Math.random() - 0.5) * 6,
          vx: Math.cos(angle) * spread,
          vy: Math.sin(angle) * spread - 0.15, // slight upward drift
          size: 2.6 + Math.random() * 3.2,
          life: 1,
          decay: 0.012 + Math.random() * 0.02,
          hue: hues[(Math.random() * hues.length) | 0],
          spin: (Math.random() - 0.5) * 0.2,
          rot: Math.random() * Math.PI,
        });
      }
    }

    function onMove(e: MouseEvent) {
      const x = e.clientX;
      const y = e.clientY;
      if (!hasPointer) {
        lastX = x;
        lastY = y;
        hasPointer = true;
      }
      const dx = x - lastX;
      const dy = y - lastY;
      const speed = Math.hypot(dx, dy);
      if (speed > 1.2 && stars.length < 240) spawn(x, y, speed);
      lastX = x;
      lastY = y;
    }
    window.addEventListener("mousemove", onMove, { passive: true });

    function drawStar(s: Star) {
      const r = s.size * s.life;
      context.save();
      context.translate(s.x, s.y);
      context.rotate(s.rot);
      context.globalCompositeOperation = "lighter";

      // Soft glow halo.
      const glow = context.createRadialGradient(0, 0, 0, 0, 0, r * 4);
      glow.addColorStop(0, `hsla(${s.hue}, 100%, 75%, ${0.5 * s.life})`);
      glow.addColorStop(1, `hsla(${s.hue}, 100%, 70%, 0)`);
      context.fillStyle = glow;
      context.beginPath();
      context.arc(0, 0, r * 4, 0, Math.PI * 2);
      context.fill();

      // 4-point sparkle.
      context.fillStyle = `hsla(${s.hue}, 100%, 92%, ${s.life})`;
      context.beginPath();
      const long = r * 3;
      const short = r * 0.7;
      context.moveTo(0, -long);
      context.lineTo(short, 0);
      context.lineTo(0, long);
      context.lineTo(-short, 0);
      context.closePath();
      context.moveTo(-long, 0);
      context.lineTo(0, short);
      context.lineTo(long, 0);
      context.lineTo(0, -short);
      context.closePath();
      context.fill();
      context.restore();
    }

    let raf = 0;
    function frame() {
      context.clearRect(0, 0, width, height);
      for (let i = stars.length - 1; i >= 0; i--) {
        const s = stars[i];
        s.x += s.vx;
        s.y += s.vy;
        s.vx *= 0.96;
        s.vy *= 0.96;
        s.rot += s.spin;
        s.life -= s.decay;
        if (s.life <= 0) {
          stars.splice(i, 1);
          continue;
        }
        drawStar(s);
      }
      raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[60]"
    />
  );
}
