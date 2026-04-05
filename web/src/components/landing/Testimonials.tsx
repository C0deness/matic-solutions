import { Quote } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { Reveal } from "../motion/Reveal";

const quotes = [
  {
    body: "Nos hicieron ver que el problema no era ‘falta de IA’ sino un proceso con tres aprobaciones innecesarias. En ocho semanas el flujo era otro.",
    name: "Elena Vázquez",
    role: "COO, logística y distribución",
  },
  {
    body: "Consultoría de verdad: mismas reuniones con dirección, legal y TI, mismo lenguaje. Al final teníamos un plan que todos podían defender.",
    name: "Marcus Lindström",
    role: "Director de tecnología, servicios financieros",
  },
  {
    body: "Bajamos un tercio el tiempo en una tarea administrativa sin cambiar de ERP: rediseño del proceso y apoyo puntual con IA donde encajaba.",
    name: "Priya Natarajan",
    role: "Directora de operaciones, compañía de software",
  },
];

export function Testimonials() {
  const reduce = useReducedMotion();

  return (
    <section
      id="casos"
      className="relative py-24 md:py-36"
    >
      <div className="pointer-events-none absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
      <div className="relative mx-auto max-w-6xl px-4 md:px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
            Lo que valoran equipos y dirección
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Referencias anonimizadas; el detalle de cada caso lo compartimos bajo
            confidencialidad cuando encaja avanzar.
          </p>
        </Reveal>

        <div className="mt-16 grid gap-6 lg:grid-cols-3">
          {quotes.map((q, i) => (
            <Reveal key={q.name} delay={i * 0.1}>
              <motion.figure
                className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200/90 bg-white/75 p-8 shadow-md backdrop-blur-md"
                whileHover={
                  reduce
                    ? undefined
                    : {
                        y: -10,
                        scale: 1.02,
                        boxShadow:
                          "0 25px 50px -12px rgb(15 23 42 / 0.18), 0 0 0 1px rgb(125 211 252 / 0.35)",
                        transition: {
                          type: "spring",
                          stiffness: 320,
                          damping: 22,
                        },
                      }
                }
              >
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-sky-50/0 via-transparent to-cyan-50/50 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <motion.div
                  animate={
                    reduce
                      ? undefined
                      : { rotate: [0, 4, -3, 0] }
                  }
                  transition={
                    reduce
                      ? undefined
                      : {
                          duration: 6,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: i * 0.7,
                        }
                  }
                >
                  <Quote
                    className="relative h-9 w-9 text-sky-300"
                    strokeWidth={1.25}
                    aria-hidden
                  />
                </motion.div>
                <blockquote className="relative mt-6 flex-1 text-base leading-relaxed text-slate-700">
                  “{q.body}”
                </blockquote>
                <figcaption className="relative mt-8 border-t border-slate-200/90 pt-6">
                  <p className="font-semibold text-slate-900">{q.name}</p>
                  <p className="text-sm text-slate-500">{q.role}</p>
                </figcaption>
              </motion.figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
