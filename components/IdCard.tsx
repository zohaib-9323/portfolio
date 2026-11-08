"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useAnimationFrame,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";

const THICKNESS = 8; // px, front face to back face
const SLICES = 7; // layers that make up the visible edge
const REST = { x: 7, y: -16 }; // resting angle so the card reads as an object, not a flat box

function useLocalTime() {
  const [time, setTime] = useState<string | null>(null);
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Karachi" });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);
  return time ?? "--:--";
}

/** Bars derived from the name, so the "barcode" is his and stays the same on every render. */
function Barcode({ seed }: { seed: string }) {
  const bars = Array.from(seed.replace(/\s/g, "").toUpperCase()).flatMap((c) => {
    const n = c.charCodeAt(0);
    return [1 + (n % 3), 1 + ((n >> 2) % 2), 1 + ((n >> 1) % 3)];
  });
  let x = 0;
  return (
    <svg viewBox={`0 0 ${bars.reduce((a, b) => a + b + 1, 0)} 20`} className="h-9 w-full" preserveAspectRatio="none" aria-hidden>
      {bars.map((w, i) => {
        const rect = i % 2 === 0 ? <rect key={i} x={x} y={0} width={w} height={20} fill="currentColor" /> : null;
        x += w + 1;
        return rect;
      })}
    </svg>
  );
}

function Field({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div>
      <dt className="label !text-[0.62rem]">{k}</dt>
      <dd className="mt-1 text-[0.86rem] font-medium leading-tight text-ink">{v}</dd>
    </div>
  );
}

export interface IdCardProps {
  name: string;
  role: string;
  location: string;
  since: string;
  availability: string;
  email: string;
  focus: string[];
  photo: string;
}

/**
 * A physical-feeling ID card: real thickness (stacked edge slices), tilts toward the
 * pointer, gently sways on touch screens, and flips on click / tap / Enter.
 * The card uses `.band`, so it's ink on the cream page and cream on the ink page.
 */
export default function IdCard({ name, role, location, since, availability, email, focus, photo }: IdCardProps) {
  const reduce = useReducedMotion();
  const zone = useRef<HTMLDivElement>(null);
  const [flipped, setFlipped] = useState(false);
  const time = useLocalTime();

  // -1..1 pointer offset from the card centre
  const nx = useMotionValue(0);
  const ny = useMotionValue(0);
  const lastMove = useRef(0);
  const finePointer = useRef(false);

  const spring = { stiffness: 140, damping: 18, mass: 0.7 };
  const rotateX = useSpring(useTransform(ny, (v) => REST.x - v * 14), spring);
  const rotateY = useSpring(useTransform(nx, (v) => REST.y + v * 22), spring);
  const flip = useSpring(0, { stiffness: 90, damping: 16 });

  useEffect(() => {
    flip.set(flipped ? 180 : 0);
  }, [flipped, flip]);

  // Light that slides across the face, and a floor shadow that slides the other way
  const gx = useTransform(nx, [-1, 1], ["15%", "85%"]);
  const gy = useTransform(ny, [-1, 1], ["10%", "90%"]);
  const glare = useMotionTemplate`radial-gradient(520px circle at ${gx} ${gy}, rgb(255 255 255 / 0.13), transparent 50%)`;
  const shadowX = useTransform(rotateY, (v) => `${-v * 1.2}px`);
  const photoX = useTransform(nx, [-1, 1], [12, -12]);
  const photoY = useTransform(ny, [-1, 1], [8, -8]);

  useEffect(() => {
    if (reduce) return;
    finePointer.current = matchMedia("(pointer: fine)").matches;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch" || !zone.current) return;
      const r = zone.current.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      nx.set(Math.max(-1, Math.min(1, (e.clientX - cx) / 520)));
      ny.set(Math.max(-1, Math.min(1, (e.clientY - cy) / 420)));
      lastMove.current = performance.now();
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduce, nx, ny]);

  // Idle sway: on touch screens always, on desktop after the mouse has been still for a while
  useAnimationFrame((t) => {
    if (reduce) return;
    if (finePointer.current && performance.now() - lastMove.current < 2500) return;
    nx.set(Math.sin(t / 1900) * 0.45);
    ny.set(Math.sin(t / 2600) * 0.3);
  });

  const face = "backface-hidden absolute inset-0 overflow-hidden rounded-[22px]";

  return (
    <div ref={zone} className="mx-auto w-[min(76vw,330px)]">
      <div className="relative [perspective:1400px]">
      {/* floor shadow, slides opposite to the tilt */}
      <motion.div
        aria-hidden
        style={{ x: shadowX }}
        className="pointer-events-none absolute -bottom-7 left-[10%] h-9 w-[80%] rounded-[50%] bg-black/35 blur-2xl"
      />
      <motion.button
        type="button"
        onClick={() => setFlipped((f) => !f)}
        aria-pressed={flipped}
        aria-label={flipped ? "Flip card to the front" : "Flip card to see the stack"}
        style={reduce ? { rotateX: REST.x, rotateY: REST.y } : { rotateX, rotateY }}
        className="preserve-3d relative block aspect-[5/7.7] w-full cursor-pointer rounded-[22px] text-left focus-visible:outline-offset-8"
      >
        <motion.div style={{ rotateY: flip }} className="preserve-3d absolute inset-0">
          {/* Edge: thin slices stacked through the thickness of the card */}
          {Array.from({ length: SLICES }).map((_, i) => (
            <div
              key={i}
              aria-hidden
              className="band absolute inset-0 rounded-[22px] !bg-line-strong"
              style={{ transform: `translateZ(${-THICKNESS / 2 + (THICKNESS / (SLICES - 1)) * i}px)` }}
            />
          ))}

          {/* Front */}
          <div className={`band ${face} flex flex-col p-2.5 pt-7`} style={{ transform: `translateZ(${THICKNESS / 2 + 0.5}px)` }}>
            {/* lanyard slot, punched through to the page colour */}
            <span aria-hidden className="absolute left-1/2 top-2.5 h-2.5 w-14 -translate-x-1/2 rounded-full bg-ink shadow-[inset_0_2px_3px_rgb(0_0_0/0.5)]" />
            {/* Photo window: recessed into the card, the photo drifts against the tilt so it reads as depth */}
            <div className="relative aspect-[9/7.6] overflow-hidden rounded-[15px] bg-[#0b0b0b]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <motion.img
                src={photo}
                alt={`Portrait of ${name}`}
                draggable={false}
                style={reduce ? { scale: 1.12 } : { x: photoX, y: photoY, scale: 1.12 }}
                className="absolute inset-0 h-full w-full object-cover object-[50%_18%]"
              />
              <span aria-hidden className="pointer-events-none absolute inset-0 rounded-[15px] shadow-[inset_0_8px_18px_rgb(0_0_0/0.65),inset_0_0_0_1px_rgb(255_255_255/0.06)]" />
              <span className="display absolute left-3 top-3 grid h-9 w-9 place-items-center rounded-[9px] border-[1.5px] border-[#F3EEE3]/80 text-[0.8rem] !text-[#F3EEE3]">
                ZA
              </span>
              <span className="absolute right-3 top-3 text-right font-mono text-[0.6rem] uppercase leading-relaxed tracking-[0.06em] text-[#F3EEE3]/75">
                Engineer
                <br />
                ID · {since}
              </span>
            </div>

            <div className="flex flex-1 flex-col px-3 pb-2 pt-4">
              <p className="display whitespace-nowrap text-[clamp(1.5rem,6.6vw,1.85rem)] leading-none">{name}</p>
              <p className="mt-1.5 text-[0.88rem] text-ink-soft">{role}</p>

            <dl className="mt-auto grid grid-cols-2 gap-x-4 gap-y-3 border-t border-line pt-3.5">
              <Field k="Based in" v={location} />
              <Field k="Local time" v={<span className="tabular-nums">{time} PKT</span>} />
              <Field k="Focus" v="LLMs · RAG" />
              <Field
                k="Status"
                v={
                  <span className="inline-flex items-center gap-1.5">
                    <span className="tick !h-1.5 !w-1.5" aria-hidden />
                    Available
                  </span>
                }
              />
            </dl>
            </div>

            <motion.div aria-hidden style={{ background: glare }} className="pointer-events-none absolute inset-0" />
          </div>

          {/* Back */}
          <div
            className={`band ${face} flex flex-col p-6`}
            style={{ transform: `rotateY(180deg) translateZ(${THICKNESS / 2 + 0.5}px)` }}
          >
            <span aria-hidden className="mx-auto block h-2.5 w-14 rounded-full bg-ink shadow-[inset_0_2px_3px_rgb(0_0_0/0.45)]" />
            <p className="label mt-6">What I work on</p>
            <ul className="mt-3 space-y-[0.4rem]">
              {focus.map((f) => (
                <li key={f} className="flex items-baseline gap-2.5 border-b border-line pb-[0.4rem] text-[0.95rem] text-ink">
                  <span className="font-mono text-[0.65rem] text-muted">↳</span>
                  {f}
                </li>
              ))}
            </ul>
            <div className="mt-auto">
              <p className="label !text-[0.62rem]">{availability}</p>
              <p className="mt-1 break-all text-[0.85rem] text-ink">{email}</p>
              <div className="mt-4 text-ink">
                <Barcode seed={name + email} />
              </div>
            </div>
          </div>
        </motion.div>
      </motion.button>
      </div>
      <p className="label mt-12 text-center" aria-hidden>
        {flipped ? "↺ flip back" : "↻ tap the card to flip"}
      </p>
    </div>
  );
}
