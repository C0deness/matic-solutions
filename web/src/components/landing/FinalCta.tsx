import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Calendar } from "lucide-react";
import { Reveal } from "../motion/Reveal";
import { BorderBeam } from "../effects/BorderBeam";
import { Magnetic } from "../motion/Magnetic";

export function FinalCta() {
  const reduce = useReducedMotion();

  return (
    <section id="contacto" className="relative pb-28 md:pb-36">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2rem] p-[1px] shadow-2xl shadow-sky-900/15">
            <BorderBeam />
            <div className="relative overflow-hidden rounded-[31px] bg-slate-950 px-6 py-16 md:px-16 md:py-24">
              {!reduce && (
                <>
                  <motion.span
                    className="pointer-events-none absolute left-1/2 top-1/2 h-[min(100vw,520px)] w-[min(100vw,520px)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-sky-400/25"
                    initial={false}
                    animate={{ scale: [0.88, 1.05], opacity: [0.35, 0] }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeOut",
                    }}
                  />
                  <motion.span
                    className="pointer-events-none absolute left-1/2 top-1/2 h-[min(110vw,580px)] w-[min(110vw,580px)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-400/20"
                    initial={false}
                    animate={{ scale: [0.88, 1.08], opacity: [0.28, 0] }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeOut",
                      delay: 1.5,
                    }}
                  />
                </>
              )}
              <motion.div
                className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-sky-500/30 blur-3xl"
                animate={
                  reduce
                    ? undefined
                    : { scale: [1, 1.2, 1], opacity: [0.35, 0.55, 0.35] }
                }
                transition={
                  reduce
                    ? undefined
                    : { duration: 7, repeat: Infinity, ease: "easeInOut" }
                }
              />
              <motion.div
                className="pointer-events-none absolute -bottom-20 -left-16 h-56 w-56 rounded-full bg-cyan-400/20 blur-3xl"
                animate={
                  reduce
                    ? undefined
                    : { scale: [1, 1.15, 1], opacity: [0.25, 0.45, 0.25] }
                }
                transition={
                  reduce
                    ? undefined
                    : { duration: 9, repeat: Infinity, ease: "easeInOut" }
                }
              />

              <div className="relative mx-auto max-w-2xl text-center">
                <motion.h2
                  className="text-3xl font-bold tracking-tight text-white md:text-4xl"
                  initial={reduce ? false : { opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.55 }}
                >
                  Cuéntanos el problema; vemos si podemos ayudar
                </motion.h2>
                <p className="mt-4 text-lg text-slate-300">
                  Primera conversación orientativa: entendemos tu contexto,
                  planteamos enfoque consultivo y próximos pasos posibles — sin
                  compromiso.
                </p>
                <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
                  <Magnetic strength={0.2}>
                    <a
                      href="mailto:hola@maticaigency.com"
                      className="inline-flex cursor-pointer items-center gap-2 rounded-2xl bg-gradient-to-r from-sky-400 to-cyan-300 px-8 py-4 text-base font-semibold text-slate-950 shadow-lg shadow-sky-500/35 transition-shadow duration-300 hover:shadow-xl hover:shadow-sky-400/40"
                    >
                      <Calendar className="h-5 w-5" aria-hidden />
                      Agendar llamada
                    </a>
                  </Magnetic>
                  <motion.a
                    href="mailto:hola@maticaigency.com"
                    className="inline-flex cursor-pointer items-center gap-2 rounded-2xl border border-slate-500/90 px-8 py-4 text-base font-semibold text-white transition-all duration-300 hover:border-sky-400/50 hover:bg-slate-800/80"
                    whileHover={
                      reduce ? undefined : { scale: 1.04, x: 2 }
                    }
                    whileTap={reduce ? undefined : { scale: 0.98 }}
                  >
                    Escribirnos
                    <ArrowRight className="h-4 w-4" aria-hidden />
                  </motion.a>
                </div>
                <p className="mt-10 text-xs text-slate-500">
                  hola@maticaigency.com · Respuesta en un día laborable
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
