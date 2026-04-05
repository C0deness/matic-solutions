import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

import { PortalCommandCenter } from "@/portal/PortalCommandCenter";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";

/** Vista interna: catálogo de escenarios y playbooks. No enlazar desde el portal cliente. */
export function OperatorCommandCenterPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 flex h-14 items-center justify-between gap-3 border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="flex min-w-0 items-center gap-2">
          <Button variant="ghost" size="sm" className="shrink-0 gap-1.5" asChild>
            <Link to="/">
              <ArrowLeft className="size-4" aria-hidden />
              Salir
            </Link>
          </Button>
          <span className="truncate text-xs font-medium text-amber-700 dark:text-amber-400">
            Consola interna · no visible para clientes
          </span>
        </div>
        <ThemeToggle />
      </header>
      <main className="p-4 md:p-6">
        <PortalCommandCenter />
      </main>
    </div>
  );
}
