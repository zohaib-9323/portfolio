"use client";

import { useRef } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";

const SPRING = { stiffness: 220, damping: 22, mass: 0.6 };

/**
 * Tilts its child toward the pointer in 3D, with a soft light that follows the cursor.
 * Only reacts to a mouse/pen; touch devices and reduced-motion users get a static block.
 */
export function Tilt({
  children,
  className = "",
  max = 8,
  lift = 0,
  glare = true,
  radius = "18px",
}: {
  children: React.ReactNode;
  className?: string;
  /** Max rotation in degrees */
  max?: number;
  /** translateZ in px while hovered */
  lift?: number;
  glare?: boolean;
  radius?: string;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const hover = useMotionValue(0);

  const rotateX = useSpring(useTransform(py, [0, 1], [max, -max]), SPRING);
  const rotateY = useSpring(useTransform(px, [0, 1], [-max, max]), SPRING);
  const z = useSpring(useTransform(hover, [0, 1], [0, lift]), SPRING);
  const glareOpacity = useSpring(hover, SPRING);
  const gx = useTransform(px, (v) => `${v * 100}%`);
  const gy = useTransform(py, (v) => `${v * 100}%`);
  const light = useMotionTemplate`radial-gradient(420px circle at ${gx} ${gy}, rgb(255 255 255 / 0.16), transparent 55%)`;

  if (reduce) return <div className={className}>{children}</div>;

  const onMove = (e: React.PointerEvent) => {
    if (e.pointerType === "touch" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width);
    py.set((e.clientY - r.top) / r.height);
    hover.set(1);
  };
  const onLeave = () => {
    px.set(0.5);
    py.set(0.5);
    hover.set(0);
  };

  return (
    <div className={`[perspective:1100px] ${className}`}>
      <motion.div
        ref={ref}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        style={{ rotateX, rotateY, z, borderRadius: radius }}
        className="preserve-3d relative h-full will-change-transform"
      >
        {children}
        {glare && (
          <motion.div
            aria-hidden
            style={{ background: light, opacity: glareOpacity, borderRadius: radius }}
            className="pointer-events-none absolute inset-0 mix-blend-soft-light"
          />
        )}
      </motion.div>
    </div>
  );
}
