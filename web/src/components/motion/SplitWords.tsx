import { motion, useReducedMotion } from "framer-motion";
import { cn } from "../../lib/cn";

const ease = [0.22, 1, 0.36, 1] as const;

type SplitWordsProps = {
  text: string;
  className?: string;
  delayStart?: number;
  wordDelay?: number;
};

export function SplitWords({
  text,
  className,
  delayStart = 0.2,
  wordDelay = 0.045,
}: SplitWordsProps) {
  const reduce = useReducedMotion();
  const words = text.split(" ");

  if (reduce) {
    return <span className={className}>{text}</span>;
  }

  return (
    <span className={cn("inline-block", className)}>
      {words.map((word, i) => (
        <span key={`${word}-${i}`} className="inline-block overflow-hidden pb-1">
          <motion.span
            className="inline-block"
            initial={{ opacity: 0, y: "100%", rotateX: -42 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{
              duration: 0.65,
              delay: delayStart + i * wordDelay,
              ease,
            }}
          >
            {word}
            {i < words.length - 1 ? "\u00A0" : ""}
          </motion.span>
        </span>
      ))}
    </span>
  );
}
