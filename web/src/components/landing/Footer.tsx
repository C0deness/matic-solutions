import { ExternalLink, Mail } from "lucide-react";
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white py-12">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-8 px-4 md:flex-row md:px-6">
        <div className="text-center md:text-left">
          <div className="flex items-center justify-center gap-2.5 md:justify-start">
            <img
              src="/favicon.svg"
              alt=""
              width={36}
              height={36}
              className="h-9 w-9 min-h-9 min-w-9 max-w-none shrink-0 rounded-lg object-contain shadow-sm ring-1 ring-slate-200/90"
            />
            <p className="font-semibold text-slate-900">Matic AIgency</p>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            Consultoría en inteligencia artificial: problemas operativos, procesos
            y adopción en empresas.
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-6 md:justify-end">
          <Link
            to="/portal/login"
            className="text-sm font-medium text-slate-600 transition-colors duration-200 hover:text-sky-800"
          >
            Portal cliente
          </Link>
          <a
            href="mailto:hola@maticaigency.com"
            className="flex cursor-pointer items-center gap-2 text-sm font-medium text-slate-600 transition-colors duration-200 hover:text-sky-800"
          >
            <Mail className="h-4 w-4" aria-hidden />
            Contacto
          </a>
          <a
            href="https://www.linkedin.com"
            target="_blank"
            rel="noreferrer noopener"
            className="flex cursor-pointer items-center gap-2 text-sm font-medium text-slate-600 transition-colors duration-200 hover:text-sky-800"
          >
            <ExternalLink className="h-4 w-4" aria-hidden />
            LinkedIn
          </a>
        </div>
        <p className="text-center text-xs text-slate-400 md:text-right">
          © {new Date().getFullYear()} Matic AIgency. Todos los derechos
          reservados.
        </p>
      </div>
    </footer>
  );
}
