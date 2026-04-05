/**
 * Fondo fijo estilo registros 21st.dev: grid técnico + aurora corporativa + spotlight
 * que sigue al cursor (profundidad sin perder seriedad corporativa).
 */
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import { useEffect } from "react";

const blobs = [
  {
    className:
      "left-[-10%] top-[5%] h-[min(90vw,520px)] w-[min(90vw,520px)] bg-sky-400/35",
    duration: 22,
  },
  {
    className:
      "right-[-15%] top-[20%] h-[min(85vw,480px)] w-[min(85vw,480px)] bg-cyan-300/30",
    duration: 28,
  },
  {
    className:
      "left-[20%] bottom-[-20%] h-[min(100vw,600px)] w-[min(100vw,600px)] bg-indigo-400/20",
    duration: 32,
  },
  {
    className:
      "right-[10%] bottom-[10%] h-[min(70vw,400px)] w-[min(70vw,400px)] bg-sky-500/25",
    duration: 26,
  },
];

export function GlobalImmersiveBackground() {
  const reduce = useReducedMotion();
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const smx = useSpring(mx, { stiffness: 28, damping: 32, mass: 0.8 });
  const smy = useSpring(my, { stiffness: 28, damping: 32, mass: 0.8 });

  const spotX = useTransform(smx, (v) => `${v * 100}%`);
  const spotY = useTransform(smy, (v) => `${v * 100}%`);
  const spotlight = useMotionTemplate`radial-gradient(900px circle at ${spotX} ${spotY}, rgba(56, 189, 248, 0.22), rgba(14, 165, 233, 0.06) 35%, transparent 55%)`;

  useEffect(() => {
    if (reduce) return;
    const onMove = (e: MouseEvent) => {
      mx.set(e.clientX / window.innerWidth);
      my.set(e.clientY / window.innerHeight);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [mx, my, reduce]);

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      aria-hidden
    >
      <div className="absolute inset-0 bg-gradient-to-b from-slate-50 via-white to-slate-100/95" />

      <div className="immersive-grid-fade absolute inset-0">
        <div className="immersive-grid-layer absolute inset-[-50%] h-[200%] w-[200%] opacity-[0.65]" />
      </div>

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_120%_80%_at_50%_-30%,rgba(14,165,233,0.14),transparent_50%)]" />

      {!reduce &&
        blobs.map((b, i) => (
          <motion.div
            key={i}
            className={`absolute rounded-full blur-[100px] mix-blend-multiply ${b.className}`}
            animate={{
              x: [0, i % 2 ? 36 : -28, 0],
              y: [0, i % 2 ? -24 : 32, 0],
              scale: [1, 1.08, 0.96, 1],
            }}
            transition={{
              duration: b.duration,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}

      {!reduce && (
        <motion.div
          className="absolute inset-0"
          style={{ backgroundImage: spotlight }}
        />
      )}

      <div
        className="absolute inset-0 opacity-[0.4]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-slate-100/90 to-transparent" />
    </div>
  );
}
