import {
  Bot,
  Gauge,
  Lock,
  Network,
  Workflow,
  LineChart,
} from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { Reveal } from "../motion/Reveal";
import { TiltCard } from "../motion/TiltCard";
import { cn } from "../../lib/cn";

const features = [
  {
    icon: Bot,
    title: "Diagnóstico del problema real",
    desc: "Vamos al origen: qué frena a tu equipo, qué cuesta tiempo y dónde falla la información. Sin saltar a la herramienta de moda.",
    span: "md:col-span-2 md:row-span-1",
  },
  {
    icon: Workflow,
    title: "Procesos rediseñados",
    desc: "Simplificamos pasos, roles y handoffs. La IA entra donde reduce fricción; si el proceso está roto, primero lo arreglamos.",
    span: "md:col-span-1",
  },
  {
    icon: Lock,
    title: "Uso responsable de datos",
    desc: "Criterios claros con legal y TI: qué datos, quién accede, trazabilidad y límites. Consultoría, no experimentos a ciegas.",
    span: "md:col-span-1",
  },
  {
    icon: Network,
    title: "Encaje con lo que ya tenéis",
    desc: "ERP, CRM, correo, carpetas compartidas: integramos IA en el trabajo diario sin obligaros a cambiar todo el stack.",
    span: "md:col-span-1",
  },
  {
    icon: Gauge,
    title: "Indicadores de proceso",
    desc: "Definimos cómo sabréis que mejoró: tiempos, errores, carga por persona. Méritos que se pueden explicar en una reunión.",
    span: "md:col-span-1",
  },
  {
    icon: LineChart,
    title: "Adopción y seguimiento",
    desc: "Formación práctica, ajustes con feedback del equipo y revisiones periódicas hasta que el nuevo flujo sea el habitual.",
    span: "md:col-span-2",
  },
];

export function BentoFeatures() {
  const reduce = useReducedMotion();

  return (
    <section id="servicios" className="relative py-24 md:py-36">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sky-300/60 to-transparent" />
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <motion.h2
            className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl lg:text-[2.5rem]"
            initial={reduce ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Consultoría en IA con los pies en{" "}
            <span className="bg-gradient-to-r from-sky-800 to-cyan-600 bg-clip-text text-transparent">
              el proceso
            </span>
          </motion.h2>
          <p className="mt-4 text-lg text-slate-600">
            Mismo interlocutor desde el diagnóstico hasta la adopción: problema,
            diseño de solución, implementación ligera y acompañamiento al equipo.
          </p>
        </Reveal>

        <div className="mt-16 grid gap-4 md:grid-cols-3 md:grid-rows-3 md:gap-5">
          {features.map((f, i) => (
            <Reveal
              key={f.title}
              delay={i * 0.06}
              className={cn("h-full", f.span)}
            >
              <TiltCard className="h-full">
                <article
                  className={cn(
                    "group relative flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200/90 bg-white/80 p-6 shadow-md backdrop-blur-md transition-shadow duration-500 hover:shadow-xl hover:shadow-sky-900/10 md:p-8",
                  )}
                >
                  <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-gradient-to-br from-sky-400/25 to-cyan-300/10 blur-2xl transition-all duration-500 group-hover:scale-125 group-hover:opacity-90" />
                  <motion.div
                    className="pointer-events-none absolute -right-6 -top-6 h-28 w-28 rounded-full bg-sky-200/40 blur-xl"
                    animate={
                      reduce
                        ? undefined
                        : { scale: [1, 1.12, 1], opacity: [0.35, 0.6, 0.35] }
                    }
                    transition={
                      reduce
                        ? undefined
                        : {
                            duration: 5 + i * 0.4,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }
                    }
                  />
                  <div className="relative flex h-full flex-col">
                    <motion.span
                      className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-sky-400 shadow-lg shadow-slate-900/25"
                      whileHover={
                        reduce
                          ? undefined
                          : { scale: 1.08, rotate: -4, transition: { type: "spring", stiffness: 400, damping: 18 } }
                      }
                    >
                      <f.icon
                        className="h-5 w-5"
                        strokeWidth={1.75}
                        aria-hidden
                      />
                    </motion.span>
                    <h3 className="mt-5 text-lg font-semibold text-slate-900">
                      {f.title}
                    </h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">
                      {f.desc}
                    </p>
                  </div>
                </article>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
