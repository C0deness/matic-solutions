import { Label, Pie, PieChart } from "recharts";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { ChartConfig } from "@/components/ui/chart";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

import {
  formatEur,
  netBenefitEur,
  roiMultiple,
  ytdMetrics,
} from "./mockData";

const pieData = [
  {
    segment: "inversion",
    value: ytdMetrics.consultancyFeesEur,
    fill: "var(--color-inversion)",
  },
  {
    segment: "neto",
    value: netBenefitEur,
    fill: "var(--color-neto)",
  },
];

const pieConfig = {
  inversion: {
    label: "Inversión consultoría",
    color: "var(--chart-2)",
  },
  neto: {
    label: "Beneficio neto estimado",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export function PortalComparison() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Inversión y retorno
        </h1>
        <p className="text-sm text-muted-foreground">
          Vista clara de lo que habéis invertido con Matic frente al valor
          operativo estimado que habéis recuperado en el mismo periodo.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Resumen del periodo (ejemplo)</CardTitle>
            <CardDescription>
              Mismas cifras que en el resumen, desglosadas para comité o
              dirección.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg border bg-muted/30 p-4">
                <p className="text-xs font-medium text-muted-foreground">
                  Inversión (consultoría)
                </p>
                <p className="mt-1 text-xl font-semibold tabular-nums">
                  {formatEur(ytdMetrics.consultancyFeesEur)}
                </p>
              </div>
              <div className="rounded-lg border bg-muted/30 p-4">
                <p className="text-xs font-medium text-muted-foreground">
                  Valor estimado generado
                </p>
                <p className="mt-1 text-xl font-semibold tabular-nums">
                  {formatEur(ytdMetrics.estimatedValueEur)}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3 rounded-lg border border-primary/20 bg-primary/5 p-4">
              <div className="flex-1">
                <p className="text-xs font-medium text-muted-foreground">
                  Beneficio neto estimado
                </p>
                <p className="text-2xl font-semibold tabular-nums text-primary">
                  {formatEur(netBenefitEur)}
                </p>
              </div>
              <Badge className="text-xs">
                Por cada 1 € invertido, ~{roiMultiple.toFixed(2)} € de valor
                atribuido
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              El ratio se calcula como valor estimado ÷ inversión en consultoría.
              Es un indicador de eficiencia del proyecto, no una promesa de
              retorno bursátil.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Reparto visual</CardTitle>
            <CardDescription>
              Inversión frente a beneficio neto estimado (mismos datos de
              ejemplo en front).
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <ChartContainer
              config={pieConfig}
              className="mx-auto aspect-square h-[260px] max-w-[260px]"
            >
              <PieChart>
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      nameKey="segment"
                      labelKey="segment"
                    />
                  }
                />
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="segment"
                  innerRadius={56}
                  strokeWidth={2}
                  stroke="var(--background)"
                >
                  <Label
                    content={({ viewBox }) => {
                      if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                        return (
                          <text
                            x={viewBox.cx}
                            y={viewBox.cy}
                            textAnchor="middle"
                            dominantBaseline="middle"
                          >
                            <tspan
                              x={viewBox.cx}
                              y={viewBox.cy}
                              className="fill-foreground text-lg font-bold"
                            >
                              {formatEur(netBenefitEur)}
                            </tspan>
                            <tspan
                              x={viewBox.cx}
                              y={(viewBox.cy ?? 0) + 18}
                              className="fill-muted-foreground text-[0.65rem]"
                            >
                              neto est.
                            </tspan>
                          </text>
                        );
                      }
                    }}
                  />
                </Pie>
              </PieChart>
            </ChartContainer>
            <ul className="mt-4 w-full space-y-2 text-xs text-muted-foreground">
              <li className="flex items-center gap-2">
                <span
                  className="size-2.5 rounded-sm"
                  style={{ background: "var(--color-inversion)" }}
                />
                Inversión consultoría: {formatEur(ytdMetrics.consultancyFeesEur)}
              </li>
              <li className="flex items-center gap-2">
                <span
                  className="size-2.5 rounded-sm"
                  style={{ background: "var(--color-neto)" }}
                />
                Beneficio neto estimado: {formatEur(netBenefitEur)}
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
