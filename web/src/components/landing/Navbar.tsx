import { motion, useScroll, useTransform } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { cn } from "../../lib/cn";

const links = [
  { href: "#servicios", label: "Enfoque" },
  { href: "#industrias", label: "Sectores" },
  { href: "#casos", label: "Referencias" },
  { href: "#contacto", label: "Contacto" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { scrollY } = useScroll();
  const navBg = useTransform(
    scrollY,
    [0, 120],
    ["rgba(255,255,255,0.72)", "rgba(255,255,255,0.92)"],
  );
  const navShadow = useTransform(
    scrollY,
    [0, 120],
    ["0 0 0 1px rgb(226 232 240 / 0.5)", "0 10px 40px -20px rgb(15 23 42 / 0.12)"],
  );

  return (
    <motion.header
      className="fixed top-4 right-4 left-4 z-50 mx-auto max-w-6xl"
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] as const }}
    >
      <motion.nav
        className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200/70 px-4 py-3 shadow-sm shadow-slate-900/5 backdrop-blur-2xl md:px-6"
        style={{ backgroundColor: navBg, boxShadow: navShadow }}
      >
        <a
          href="#"
          className="flex cursor-pointer items-center gap-2.5 text-slate-900 transition-colors duration-200 hover:text-sky-800"
        >
          <span className="flex size-9 shrink-0 items-center justify-center">
            <img
              src="/favicon.svg"
              alt=""
              width={36}
              height={36}
              className="h-9 w-9 min-h-9 min-w-9 max-w-none shrink-0 rounded-lg object-contain shadow-sm ring-1 ring-slate-200/90"
            />
          </span>
          <span className="font-semibold tracking-tight">
            Matic{" "}
            <span className="font-medium text-slate-500">AIgency</span>
          </span>
        </a>

        <ul className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="cursor-pointer transition-colors duration-200 hover:text-sky-800"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            to="/portal/login"
            className="cursor-pointer rounded-xl px-3 py-2 text-sm font-medium text-slate-600 transition-colors duration-200 hover:bg-slate-100 hover:text-sky-800"
          >
            Portal cliente
          </Link>
          <a
            href="#contacto"
            className="cursor-pointer rounded-xl px-4 py-2 text-sm font-semibold text-slate-700 transition-colors duration-200 hover:bg-slate-100"
          >
            Primera conversación
          </a>
          <a
            href="#contacto"
            className="cursor-pointer rounded-xl bg-sky-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-sky-700/25 transition-all duration-200 hover:bg-sky-600 hover:shadow-md"
          >
            Diagnóstico exprés
          </a>
        </div>

        <button
          type="button"
          className="cursor-pointer rounded-lg p-2 text-slate-700 md:hidden"
          aria-expanded={open}
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </motion.nav>

      <div
        className={cn(
          "mt-2 overflow-hidden rounded-2xl border border-slate-200 bg-white/95 shadow-lg backdrop-blur-xl md:hidden",
          open ? "max-h-96 opacity-100" : "max-h-0 border-transparent opacity-0",
        )}
      >
        <ul className="flex flex-col gap-1 p-4">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="block cursor-pointer rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                onClick={() => setOpen(false)}
              >
                {l.label}
              </a>
            </li>
          ))}
          <Link
            to="/portal/login"
            className="block cursor-pointer rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
            onClick={() => setOpen(false)}
          >
            Portal cliente
          </Link>
          <a
            href="#contacto"
            className="mt-2 block cursor-pointer rounded-xl bg-sky-700 py-3 text-center text-sm font-semibold text-white"
            onClick={() => setOpen(false)}
          >
            Diagnóstico exprés
          </a>
        </ul>
      </div>
    </motion.header>
  );
}
