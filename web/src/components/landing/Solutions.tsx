import { Building2, Cpu, ShieldCheck, Users } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { Reveal } from "../motion/Reveal";

const industries = [
  {
    icon: Building2,
    title: "Operaciones, logística e industria",
    points: [
      "Retrasos, errores manuales o falta de visibilidad entre almacén, compras y ventas",
      "Documentación dispersa: cómo unificar criterios y reducir retrabajo",
    ],
  },
  {
    icon: ShieldCheck,
    title: "Finanzas, legal y cumplimiento",
    points: [
      "Mucho volumen documental y revisión lenta: priorizar qué automatizar con criterio",
      "Claridad para auditoría: quién hace qué y con qué datos puede trabajar la IA",
    ],
  },
  {
    icon: Cpu,
    title: "TI, soporte y equipos internos",
    points: [
      "Colas saturadas y conocimiento en cabezas: liberar tiempo con flujos claros",
      "Herramientas que nadie usa: rediseño del proceso antes que otro software",
    ],
  },
];

const roles = [
  {
    icon: Users,
    label: "Dirección y finanzas",
    text: "Priorización por impacto, coste de oportunidad y mensaje claro para el equipo.",
  },
  {
    icon: ShieldCheck,
    label: "Legal y protección de datos",
    text: "Marco de uso de datos y modelos alineado con vuestras políticas y regulación.",
  },
  {
    icon: Cpu,
    label: "Tecnología",
    text: "Viabilidad técnica realista, integraciones y mantenimiento sin sorpresas.",
  },
];

export function Solutions() {
  const reduce = useReducedMotion();

  return (
    <section
      id="industrias"
      className="relative border-y border-slate-200/70 bg-slate-100/40 py-24 backdrop-blur-sm md:py-36"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,rgba(14,165,233,0.06),transparent)]" />
      <div className="relative mx-auto max-w-6xl px-4 md:px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
            Ejemplos de frentes donde ayudamos
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Cada empresa es distinta; estos son patrones habituales de problemas de
            proceso que abordamos con enfoque consultivo y, cuando toca, con IA.
          </p>
        </Reveal>

        <div className="mt-16 grid gap-6 lg:grid-cols-3">
          {industries.map((b, i) => (
            <Reveal key={b.title} delay={i * 0.08}>
              <motion.article
                className="flex h-full flex-col rounded-3xl border border-slate-200/90 bg-white/85 p-8 shadow-md backdrop-blur-md"
                whileHover={
                  reduce
                    ? undefined
                    : {
                        y: -8,
                        transition: {
                          type: "spring",
                          stiffness: 380,
                          damping: 24,
                        },
                      }
                }
              >
                <motion.span
                  className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-cyan-500 text-white shadow-lg shadow-sky-500/30"
                  whileHover={
                    reduce
                      ? undefined
                      : { scale: 1.08, rotate: 6, transition: { duration: 0.25 } }
                  }
                >
                  <b.icon className="h-6 w-6" strokeWidth={1.5} aria-hidden />
                </motion.span>
                <h3 className="mt-6 text-xl font-semibold text-slate-900">
                  {b.title}
                </h3>
                <ul className="mt-4 space-y-3 text-sm text-slate-600">
                  {b.points.map((p) => (
                    <li key={p} className="flex gap-2">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-sky-600" />
                      {p}
                    </li>
                  ))}
                </ul>
              </motion.article>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-20">
          <motion.div
            className="relative overflow-hidden rounded-3xl border border-slate-700/80 bg-slate-900 px-6 py-10 text-white shadow-2xl shadow-slate-900/30 md:px-12 md:py-14"
            initial={reduce ? false : { opacity: 0.92 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <motion.div
              className="pointer-events-none absolute -left-20 top-0 h-64 w-64 rounded-full bg-sky-500/25 blur-3xl"
              animate={
                reduce
                  ? undefined
                  : { x: [0, 30, 0], y: [0, 20, 0] }
              }
              transition={
                reduce
                  ? undefined
                  : { duration: 14, repeat: Infinity, ease: "easeInOut" }
              }
            />
            <motion.div
              className="pointer-events-none absolute -right-16 bottom-0 h-56 w-56 rounded-full bg-cyan-400/15 blur-3xl"
              animate={
                reduce
                  ? undefined
                  : { x: [0, -24, 0], y: [0, -16, 0] }
              }
              transition={
                reduce
                  ? undefined
                  : { duration: 18, repeat: Infinity, ease: "easeInOut" }
              }
            />
            <p className="relative text-center text-xs font-semibold uppercase tracking-widest text-sky-300">
              Interlocutores
            </p>
            <h3 className="relative mt-3 text-center text-2xl font-bold tracking-tight md:text-3xl">
              Coordinamos con quien toma decisiones en tu empresa
            </h3>
            <div className="relative mt-10 grid gap-6 md:grid-cols-3">
              {roles.map((r, j) => (
                <motion.div
                  key={r.label}
                  className="rounded-2xl border border-slate-700/80 bg-slate-800/60 p-6 backdrop-blur-sm"
                  initial={reduce ? false : { opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: j * 0.12, duration: 0.45 }}
                  whileHover={
                    reduce
                      ? undefined
                      : {
                          backgroundColor: "rgb(30 41 59 / 0.85)",
                          borderColor: "rgb(56 189 248 / 0.35)",
                          transition: { duration: 0.2 },
                        }
                  }
                >
                  <r.icon
                    className="h-8 w-8 text-sky-400"
                    strokeWidth={1.5}
                  />
                  <p className="mt-4 font-semibold text-white">{r.label}</p>
                  <p className="mt-2 text-sm text-slate-300">{r.text}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </Reveal>
      </div>
    </section>
  );
}
