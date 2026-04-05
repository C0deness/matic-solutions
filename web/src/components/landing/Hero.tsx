import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { useRef } from "react";
import { BorderBeam } from "../effects/BorderBeam";
import { Magnetic } from "../motion/Magnetic";
import { SplitWords } from "../motion/SplitWords";

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08, delayChildren: 0.12 },
  },
};

const easeOutExpo = [0.22, 1, 0.36, 1] as const;

const item = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: easeOutExpo },
  },
};

function FloatingPanel({
  className,
  children,
  delay = 0,
}: {
  className?: string;
  children: React.ReactNode;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 30, scale: 0.94 }}
      animate={reduce ? undefined : { opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.75, delay, ease: easeOutExpo }}
      whileHover={
        reduce
          ? undefined
          : { y: -6, scale: 1.02, transition: { duration: 0.35 } }
      }
    >
      {children}
    </motion.div>
  );
}

export function Hero() {
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const decorY = useTransform(scrollYProgress, [0, 1], [0, 180]);
  const decorY2 = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const decorOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[100svh] overflow-hidden pt-28 pb-24 md:pt-36 md:pb-32"
    >
      <div
        className="pointer-events-none absolute inset-0 [perspective:1200px]"
        aria-hidden
      >
        <motion.div
          className="absolute right-[4%] top-[22%] hidden md:block md:w-[340px]"
          style={{ y: decorY, opacity: decorOpacity }}
        >
          <FloatingPanel
            delay={0.5}
            className="rounded-2xl border border-slate-200/90 bg-white/75 p-5 shadow-xl shadow-sky-900/10 backdrop-blur-xl"
          >
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
              <span>Mapa de proceso</span>
              <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-emerald-700">
                En revisión
              </span>
            </div>
            <div className="mt-4 space-y-2">
              <div className="h-2 w-full rounded-full bg-slate-200/80" />
              <div className="h-2 w-4/5 rounded-full bg-slate-200/80" />
              <div className="h-2 w-3/5 rounded-full bg-sky-200/90" />
            </div>
            <p className="mt-4 text-[11px] leading-relaxed text-slate-500">
              Cuellos de botella detectados · priorización por impacto · plan de
              acción acordado
            </p>
          </FloatingPanel>
        </motion.div>

        <motion.div
          className="absolute left-[2%] bottom-[18%] hidden lg:block lg:w-[280px]"
          style={{ y: decorY2, opacity: decorOpacity }}
        >
          <FloatingPanel
            delay={0.65}
            className="rounded-2xl border border-slate-200/90 bg-slate-900/90 p-5 text-slate-100 shadow-2xl backdrop-blur-xl"
          >
            <p className="text-[10px] font-semibold uppercase tracking-widest text-sky-300">
              Indicador clave
            </p>
            <p className="mt-2 text-2xl font-bold tracking-tight text-white">
              −31%
            </p>
            <p className="text-xs text-slate-400">
              Menos tiempo en una tarea repetitiva tras rediseño + IA
            </p>
            <div className="mt-4 h-16 rounded-lg bg-gradient-to-t from-sky-500/20 to-transparent" />
          </FloatingPanel>
        </motion.div>

        {!reduce && (
          <>
            <motion.div
              className="absolute left-[12%] top-[38%] h-3 w-3 rounded-full bg-sky-400/80 shadow-[0_0_24px_rgba(56,189,248,0.65)]"
              animate={{ scale: [1, 1.35, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute right-[18%] top-[48%] h-2 w-2 rounded-full bg-cyan-300/90 shadow-[0_0_18px_rgba(103,232,249,0.7)]"
              animate={{ scale: [1, 1.5, 1], opacity: [0.4, 0.95, 0.4] }}
              transition={{
                duration: 2.6,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.4,
              }}
            />
          </>
        )}
      </div>

      <div className="relative z-[1] mx-auto max-w-6xl px-4 md:px-6">
        <motion.div
          className="mx-auto max-w-3xl text-center"
          variants={reduce ? undefined : container}
          initial={reduce ? false : "hidden"}
          animate={reduce ? undefined : "show"}
        >
          <motion.div
            variants={reduce ? undefined : item}
            className="mb-8 inline-flex items-center gap-2 rounded-full border border-sky-200/90 bg-white/85 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-sky-900 shadow-md shadow-sky-900/5 backdrop-blur-md"
          >
            <motion.span
              animate={reduce ? undefined : { rotate: [0, 14, -8, 0] }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <Sparkles className="h-3.5 w-3.5 text-sky-600" aria-hidden />
            </motion.span>
            Consultoría en IA para empresas
          </motion.div>

          <h1 className="text-balance text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl md:text-6xl lg:text-[3.45rem] lg:leading-[1.06]">
            <span className="block [perspective:1000px]">
              <SplitWords
                text="Resolvemos problemas operativos y"
                className="text-slate-900"
                delayStart={0.05}
                wordDelay={0.035}
              />
            </span>
            <motion.span
              className="mt-1 block text-shimmer-grad"
              initial={reduce ? false : { opacity: 0, scale: 0.92 }}
              animate={reduce ? undefined : { opacity: 1, scale: 1 }}
              transition={{ delay: 0.55, duration: 0.6, ease: easeOutExpo }}
            >
              optimizamos procesos
            </motion.span>
            <motion.span
              className="mt-1 block text-slate-900"
              initial={reduce ? false : { opacity: 0, y: 20 }}
              animate={reduce ? undefined : { opacity: 1, y: 0 }}
              transition={{ delay: 0.85, duration: 0.55, ease: easeOutExpo }}
            >
              con inteligencia artificial, sin humo
            </motion.span>
          </h1>

          <motion.p
            variants={reduce ? undefined : item}
            className="mx-auto mt-8 max-w-2xl text-pretty text-lg text-slate-600 md:text-xl"
          >
            Trabajamos como consultores: escuchamos el problema real, medimos el
            impacto y diseñamos cambios sostenibles en cómo trabaja tu
            organización. La IA es el medio cuando aporta; el fin es que tu
            operación funcione mejor.
          </motion.p>

          <motion.div
            variants={reduce ? undefined : item}
            className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Magnetic strength={0.25}>
              <a
                href="#contacto"
                className="group relative inline-flex cursor-pointer items-center justify-center overflow-hidden rounded-2xl shadow-xl shadow-sky-900/20"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-sky-500 via-cyan-400 to-sky-500 bg-[length:200%_100%] transition-all duration-500 group-hover:bg-[position:100%_0]" />
                <span className="relative m-[2px] flex items-center gap-2 rounded-[14px] bg-slate-950 px-8 py-3.5 text-base font-semibold text-white transition-colors duration-200 group-hover:bg-slate-900">
                  Pedir primera sesión
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </a>
            </Magnetic>
            <motion.a
              href="#servicios"
              className="cursor-pointer rounded-2xl border border-slate-200/90 bg-white/80 px-8 py-3.5 text-base font-semibold text-slate-800 shadow-md backdrop-blur-md transition-all duration-300 hover:border-sky-200 hover:bg-white hover:shadow-lg"
              whileHover={reduce ? undefined : { scale: 1.03 }}
              whileTap={reduce ? undefined : { scale: 0.98 }}
            >
              Ver cómo trabajamos
            </motion.a>
          </motion.div>
        </motion.div>

        <motion.div
          className="mx-auto mt-20 grid max-w-4xl gap-5 md:grid-cols-3"
          initial={reduce ? false : { opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.65,
            delay: 0.15,
            ease: easeOutExpo,
          }}
        >
          {[
            {
              k: "1. Diagnóstico",
              v: "entendemos el problema antes de la herramienta",
              s: "entrevistas, datos y mapa de procesos",
            },
            {
              k: "2. Diseño",
              v: "proceso rediseñado + IA donde encaja",
              s: "criterios claros de riesgo y privacidad",
            },
            {
              k: "3. Adopción",
              v: "acompañamos hasta que el equipo lo usa",
              s: "formación y ajustes con feedback real",
            },
          ].map((card, i) =>
            i === 0 ? (
              <motion.div
                key={card.k}
                className="relative overflow-hidden rounded-2xl p-[1px] shadow-lg shadow-slate-900/10"
                whileHover={
                  reduce ? undefined : { y: -4, transition: { duration: 0.25 } }
                }
              >
                <BorderBeam />
                <div className="relative rounded-[15px] bg-white/95 p-6 ring-1 ring-slate-200/90 backdrop-blur-md">
                  <p className="text-2xl font-bold tracking-tight text-slate-900">
                    {card.k}
                  </p>
                  <p className="mt-2 text-sm font-medium text-slate-700">
                    {card.v}
                  </p>
                  <p className="mt-3 text-xs text-slate-500">{card.s}</p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key={card.k}
                className="relative rounded-2xl border border-slate-200/90 bg-white/85 p-6 shadow-md backdrop-blur-md transition-shadow duration-300 hover:shadow-lg"
                whileHover={
                  reduce ? undefined : { y: -4, transition: { duration: 0.25 } }
                }
              >
                <p className="text-2xl font-bold tracking-tight text-slate-900">
                  {card.k}
                </p>
                <p className="mt-2 text-sm font-medium text-slate-700">
                  {card.v}
                </p>
                <p className="mt-3 text-xs text-slate-500">{card.s}</p>
              </motion.div>
            ),
          )}
        </motion.div>
      </div>
    </section>
  );
}
