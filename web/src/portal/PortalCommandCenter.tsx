import { Search } from "lucide-react";
import * as React from "react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { SCENARIOS } from "@/command-center/scenarios";
import type { CommandDept } from "@/command-center/types";

const DEPT_VARIANT: Record<
  CommandDept,
  "default" | "secondary" | "outline" | "destructive"
> = {
  CEO: "default",
  MKT: "secondary",
  VTA: "outline",
  ING: "default",
  SUP: "secondary",
  OPS: "outline",
};

function normalize(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "");
}

export function PortalCommandCenter() {
  const [q, setQ] = React.useState("");
  const nq = normalize(q.trim());

  const filtered = React.useMemo(() => {
    if (!nq) return SCENARIOS;
    return SCENARIOS.filter((s) => {
      const blob = normalize(
        `${s.id} ${s.title} ${s.summary} ${s.playbookId} ${s.primaryDept} ${s.keywords.join(" ")}`
      );
      return blob.includes(nq);
    });
  }, [nq]);

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Centro de mando
        </h1>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
          Catálogo interno de escenarios → playbook, departamento inicial y
          puertas humanas. Uso operador; el cliente del portal no ve esta
          taxonomía. La clasificación por palabras clave (demo) puede alimentar
          backend o tickets; en el chat del cliente solo se muestra un acuse
          genérico.
        </p>
      </div>

      <div className="relative">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden
        />
        <Input
          type="search"
          placeholder="Buscar por escenario, playbook, departamento…"
          className="pl-9"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          aria-label="Filtrar escenarios"
        />
      </div>

      <p className="text-xs text-muted-foreground">
        {filtered.length} de {SCENARIOS.length} escenarios
        {nq ? " (filtrado)" : ""}.
      </p>

      <ul className="flex flex-col gap-3">
        {filtered.map((s) => (
          <li key={s.id}>
            <Card className="border-border/80 shadow-sm">
              <CardHeader className="gap-1 pb-2">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <CardTitle className="text-base font-semibold leading-snug">
                    {s.title}
                  </CardTitle>
                  <Badge variant={DEPT_VARIANT[s.primaryDept]}>
                    {s.primaryDept}
                  </Badge>
                </div>
                <CardDescription className="font-mono text-[0.7rem] text-muted-foreground">
                  {s.id} · {s.playbookId}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <p className="text-muted-foreground">{s.summary}</p>
                <div>
                  <p className="mb-1 text-xs font-medium text-foreground">
                    Pasos típicos
                  </p>
                  <ol className="list-decimal space-y-0.5 pl-4 text-xs text-muted-foreground">
                    {s.steps.map((step, i) => (
                      <li key={i}>{step}</li>
                    ))}
                  </ol>
                </div>
                {s.humanGates.length > 0 ? (
                  <div>
                    <p className="mb-1 text-xs font-medium text-amber-700 dark:text-amber-400">
                      Puerta humana
                    </p>
                    <ul className="list-disc space-y-0.5 pl-4 text-xs text-muted-foreground">
                      {s.humanGates.map((g, i) => (
                        <li key={i}>{g}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </CardContent>
            </Card>
          </li>
        ))}
      </ul>

      {filtered.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No hay escenarios que coincidan con la búsqueda.
        </p>
      ) : null}
    </div>
  );
}
