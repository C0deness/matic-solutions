/**
 * Borde animado tipo “border beam” — patrón habitual en registros tipo 21st.dev.
 */
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "../../lib/cn";

type BorderBeamProps = {
  className?: string;
};

export function BorderBeam({ className }: BorderBeamProps) {
  const reduce = useReducedMotion();

  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]",
        className,
      )}
      aria-hidden
    >
      <motion.span
        className="absolute -inset-[100%] opacity-60"
        style={{
          background:
            "conic-gradient(from 0deg, transparent 0%, transparent 25%, rgb(14 165 233 / 0.5) 40%, rgb(56 189 248 / 0.35) 50%, transparent 65%, transparent 100%)",
        }}
        animate={reduce ? undefined : { rotate: 360 }}
        transition={
          reduce
            ? undefined
            : { duration: 5.5, repeat: Infinity, ease: "linear" }
        }
      />
    </div>
  );
}
