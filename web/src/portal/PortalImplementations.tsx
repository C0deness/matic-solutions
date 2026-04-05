import { useMemo, useState } from "react";

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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  formatEur,
  formatHours,
  implementationRoadmaps,
  implementations,
} from "./mockData";

function statusVariant(
  s: (typeof implementations)[number]["status"],
): "default" | "secondary" | "outline" {
  if (s === "Activo") return "default";
  if (s === "Piloto") return "secondary";
  return "outline";
}

export function PortalImplementations() {
  const [roadmapImplId, setRoadmapImplId] = useState(implementations[0]!.id);
  const roadmapTasks = useMemo(
    () => implementationRoadmaps[roadmapImplId] ?? [],
    [roadmapImplId],
  );

  return (
    <div className="flex flex-col gap-6">
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
            Horas ahorradas por semana y valor mensual atribuido (demo).
          </CardDescription>
        </CardHeader>
        <CardContent>
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
                {implementations.map((row) => (
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
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Roadmap por implementación</CardTitle>
          <CardDescription>
            Fases e hitos acordados (demo). Desplegáis cada fase y el detalle
            de los hitos al hacer clic.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-2 sm:max-w-md">
            <Label htmlFor="roadmap-impl">Iniciativa</Label>
            <select
              id="roadmap-impl"
              className="border-input bg-input/20 dark:bg-input/30 h-9 w-full rounded-md border px-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 md:text-xs/relaxed"
              value={roadmapImplId}
              onChange={(e) => setRoadmapImplId(e.target.value)}
            >
              {implementations.map((row) => (
                <option key={row.id} value={row.id}>
                  {row.name}
                </option>
              ))}
            </select>
          </div>
          <AgentPlan tasks={roadmapTasks} />
        </CardContent>
      </Card>
    </div>
  );
}
