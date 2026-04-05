import { motion, useReducedMotion } from "framer-motion";
import { Reveal } from "../motion/Reveal";

const brands = [
  "Vertex Logistics",
  "Nordic Finance",
  "Helix Health",
  "Atlas Manufacturing",
  "Pulse Retail",
  "Cobalt Legal",
];

function MarqueeRow({
  duration,
  items,
}: {
  duration: number;
  items: string[];
}) {
  const reduce = useReducedMotion();
  const doubled = [...items, ...items];

  return (
    <div className="relative overflow-hidden py-2 mask-linear-fade">
      <motion.div
        className="flex w-max gap-20 md:gap-28"
        animate={reduce ? undefined : { x: ["0%", "-50%"] }}
        transition={
          reduce ? undefined : { duration, repeat: Infinity, ease: "linear" }
        }
      >
        {doubled.map((name, i) => (
          <motion.span
            key={`${name}-${i}`}
            className="shrink-0 cursor-default text-base font-semibold text-slate-400 transition-colors duration-300 md:text-lg"
            whileHover={
              reduce
                ? undefined
                : {
                    scale: 1.06,
                    color: "rgb(3 105 161)",
                    transition: { duration: 0.2 },
                  }
            }
          >
            {name}
          </motion.span>
        ))}
      </motion.div>
    </div>
  );
}

export function LogoStrip() {
  return (
    <section className="relative border-y border-slate-200/70 bg-white/50 py-14 backdrop-blur-md">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-sky-50/0 via-sky-50/40 to-sky-50/0" />
      <div className="relative mx-auto max-w-6xl px-4 md:px-6">
        <Reveal className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Organizaciones con las que trabajamos en procesos e IA
          </p>
        </Reveal>
        <div className="mt-10 flex flex-col gap-2">
          <MarqueeRow duration={36} items={brands} />
          <MarqueeRow duration={44} items={[...brands].reverse()} />
        </div>
      </div>
      <style>{`
        .mask-linear-fade {
          mask-image: linear-gradient(90deg, transparent, black 10%, black 90%, transparent);
          -webkit-mask-image: linear-gradient(90deg, transparent, black 10%, black 90%, transparent);
        }
      `}</style>
    </section>
  );
}
