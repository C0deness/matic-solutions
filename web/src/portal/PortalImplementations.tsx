import { useEffect, useMemo, useState } from "react";

import { AgentPlan } from "@/components/ui/agent-plan";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { usePortalImplementations } from "@/hooks/usePortalImplementations";
import { formatEur, formatHours } from "@/lib/formatMetrics";
import type { ImplementationUiRow } from "@/lib/portalDb";

function statusVariant(
  s: ImplementationUiRow["status"],
): "default" | "secondary" | "outline" {
  if (s === "Activo") return "default";
  if (s === "Piloto") return "secondary";
  return "outline";
}

export function PortalImplementations() {
  const { loading, error, rows } = usePortalImplementations();
  const [roadmapImplId, setRoadmapImplId] = useState<string>("");

  useEffect(() => {
    if (rows.length === 0) {
      setRoadmapImplId("");
      return;
    }
    setRoadmapImplId((prev) => {
      if (prev && rows.some((r) => r.id === prev)) return prev;
      return rows[0]!.id;
    });
  }, [rows]);

  const roadmapTasks = useMemo(() => {
    const row = rows.find((r) => r.id === roadmapImplId);
    return row?.roadmapPhases ?? [];
  }, [rows, roadmapImplId]);

  return (
    <div className="flex flex-col gap-6">
      {error ? (
        <p className="rounded-md border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-sm text-amber-950 dark:text-amber-100">
          {error}
        </p>
      ) : null}

      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Implementaciones
        </h1>
        <p className="text-sm text-muted-foreground">
          Líneas de trabajo donde hemos aplicado IA y rediseño de proceso. El
          valor mensual es una estimación acordada en cada caso.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Detalle por iniciativa</CardTitle>
          <CardDescription>
            Horas ahorradas por semana y valor mensual atribuido (Supabase).
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-[200px] w-full rounded-lg" />
          ) : rows.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No hay implementaciones registradas para vuestra cuenta. Cuando se
              den de alta en la base de datos, aparecerán aquí.
            </p>
          ) : (
            <ScrollArea className="w-full">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Iniciativa</TableHead>
                    <TableHead>Área</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">h/sem</TableHead>
                    <TableHead className="text-right">Valor mes est.</TableHead>
                    <TableHead>Inicio</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell className="max-w-[220px] font-medium">
                        {row.name}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {row.area}
                      </TableCell>
                      <TableCell>
                        <Badge variant={statusVariant(row.status)}>
                          {row.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {formatHours(row.hoursPerWeekSaved)}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {formatEur(row.estimatedMonthlyValueEur)}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(row.startedAt).toLocaleDateString("es-ES", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Roadmap por implementación</CardTitle>
          <CardDescription>
            Fases e hitos cargados desde Supabase. Desplegáis cada fase y el
            detalle de los hitos al hacer clic.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {loading ? (
            <Skeleton className="h-[280px] w-full rounded-lg" />
          ) : rows.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Elegí una iniciativa cuando existan filas en la tabla de
              implementaciones.
            </p>
          ) : (
            <>
              <div className="flex flex-col gap-2 sm:max-w-md">
                <Label htmlFor="roadmap-impl">Iniciativa</Label>
                <select
                  id="roadmap-impl"
                  className="border-input bg-input/20 dark:bg-input/30 h-9 w-full rounded-md border px-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 md:text-xs/relaxed"
                  value={roadmapImplId}
                  onChange={(e) => setRoadmapImplId(e.target.value)}
                >
                  {rows.map((row) => (
                    <option key={row.id} value={row.id}>
                      {row.name}
                    </option>
                  ))}
                </select>
              </div>
              <AgentPlan tasks={roadmapTasks} />
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
