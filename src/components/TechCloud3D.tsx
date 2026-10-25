"use client";

import { useEffect, useRef, useState } from "react";

export type CloudItem = { label: string; w: 1 | 2 | 3 | 4 };

const staticCls = { 4: "text-2xl font-bold text-ink", 3: "text-xl font-semibold text-ink", 2: "text-base text-ink", 1: "text-sm text-muted" } as const;
const fontRem = { 4: 1.45, 3: 1.2, 2: 1.02, 1: 0.88 } as const;
const HEIGHT = 380; // px, the same for the static and the 3D state so nothing jumps when the sphere starts

/**
 * Interactive 3D tag cloud. Server HTML is the plain tag cloud (works without JavaScript and for reduced motion).
 * With JavaScript and no reduced-motion preference the words move onto a rotating sphere: the pointer steers the
 * rotation, and screen readers get the plain list. Positions are written straight
 * to the DOM each frame (no React re-render per frame), and the loop stops while the cloud is off screen.
 */
export function TechCloud3D({ items, label }: { items: CloudItem[]; label: string }) {
  const [animated, setAnimated] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);
  const tagRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) setAnimated(true);
  }, []);

  useEffect(() => {
    const box = boxRef.current;
    if (!animated || !box) return;
    const n = items.length;
    const R = Math.min(box.clientWidth * 0.3, HEIGHT * 0.4);
    const stretch = Math.min(1.6, (box.clientWidth * 0.38) / R);   // wider than tall when the column allows it, fewer overlaps
    // Fibonacci sphere: evenly spread points
    const base = items.map((_, i) => {
      const phi = Math.acos(-1 + (2 * i + 1) / n);
      const theta = Math.sqrt(n * Math.PI) * phi;
      return { x: R * Math.sin(phi) * Math.cos(theta), y: R * Math.sin(phi) * Math.sin(theta), z: R * Math.cos(phi) };
    });

    const AUTO = { x: 0.0007, y: 0.0014 };
    let ax = 0, ay = 0;                 // current angles
    let vx = AUTO.x, vy = AUTO.y;       // current speed (rad per frame)
    let tx = AUTO.x, ty = AUTO.y;       // target speed, set by the pointer
    let raf = 0, visible = true;

    const draw = () => {
      const cx = Math.cos(ax), sx = Math.sin(ax), cy = Math.cos(ay), sy = Math.sin(ay);
      for (let i = 0; i < n; i++) {
        const el = tagRefs.current[i];
        if (!el) continue;
        const { x, y, z } = base[i];
        const y1 = y * cx - z * sx, z1 = z * cx + y * sx;
        const x2 = x * cy + z1 * sy, z2 = z1 * cy - x * sy;
        const depth = (z2 + R) / (2 * R);          // 0 = back, 1 = front
        el.style.transform = `translate3d(calc(-50% + ${(x2 * stretch).toFixed(1)}px), calc(-50% + ${y1.toFixed(1)}px), ${z2.toFixed(1)}px)`;
        el.style.opacity = String(0.25 + 0.75 * depth);
        el.style.zIndex = String(Math.round(depth * 100));
      }
    };

    const tick = () => {
      vx += (tx - vx) * 0.03; vy += (ty - vy) * 0.03;
      ax += vx; ay += vy;
      draw();
      raf = requestAnimationFrame(tick);
    };

    const onMove = (e: PointerEvent) => {
      const r = box.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);   // -1 .. 1
      const dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
      tx = -dy * 0.008; ty = dx * 0.008;     // pointer height turns the sphere around the horizontal axis, pointer width around the vertical one
    };
    const onLeave = () => { tx = AUTO.x; ty = AUTO.y; };

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      cancelAnimationFrame(raf);
      if (visible) raf = requestAnimationFrame(tick);
    });
    io.observe(box);
    box.addEventListener("pointermove", onMove);
    box.addEventListener("pointerleave", onLeave);
    draw();
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      box.removeEventListener("pointermove", onMove);
      box.removeEventListener("pointerleave", onLeave);
    };
  }, [animated, items]);

  if (!animated)
    return (
      <ul className="flex flex-wrap content-center items-baseline gap-x-4 gap-y-1 leading-tight" style={{ minHeight: HEIGHT }} aria-label={label}>
        {items.map((t) => <li key={t.label} className={staticCls[t.w]}>{t.label}</li>)}
      </ul>
    );

  return (
    <div>
      <ul className="sr-only" aria-label={label}>{items.map((t) => <li key={t.label}>{t.label}</li>)}</ul>
      <div ref={boxRef} aria-hidden="true" className="relative cursor-grab select-none overflow-hidden"
        style={{ height: HEIGHT, perspective: "800px", touchAction: "pan-y" }}>
        {items.map((t, i) => (
          <span key={t.label} ref={(el) => { tagRefs.current[i] = el; }}
            className={`absolute left-1/2 top-1/2 whitespace-nowrap transition-colors hover:text-accent ${t.w === 1 ? "text-muted" : "text-ink"} ${t.w >= 3 ? "font-bold" : ""}`}
            style={{ fontSize: `${fontRem[t.w]}rem` }}>{t.label}</span>
        ))}
      </div>
    </div>
  );
}
