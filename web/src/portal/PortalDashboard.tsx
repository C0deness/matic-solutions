import { useId } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";

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
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";

import { usePortalDashboardData } from "@/hooks/usePortalDashboardData";
import {
  computeNetBenefit,
  computeRoiMultiple,
  formatEur,
  formatHours,
} from "@/lib/formatMetrics";
import type { MonthlyChartPoint } from "@/lib/portalDb";

const chartConfig = {
  valor: {
    label: "Valor estimado",
    color: "var(--chart-1)",
  },
  inversion: {
    label: "Inversión consultoría",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

function MonthlyValueChart({ data }: { data: MonthlyChartPoint[] }) {
  const uid = useId().replace(/:/g, "");
  const gradValor = `gradValor-${uid}`;
  const gradInversion = `gradInversion-${uid}`;

  if (data.length === 0) {
    return (
      <p className="px-2 py-12 text-center text-sm text-muted-foreground">
        Aún no hay serie mensual cargada. Cuando Matic registre los puntos en
        Supabase, el gráfico se completará automáticamente.
      </p>
    );
  }

  return (
    <ChartContainer
      config={chartConfig}
      className="aspect-auto h-[320px] w-full sm:h-[340px]"
    >
      <AreaChart
        accessibilityLayer
        data={data}
        margin={{ left: 4, right: 12, top: 16, bottom: 4 }}
      >
        <defs>
          <linearGradient id={gradValor} x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="0%"
              stopColor="var(--color-valor)"
              stopOpacity={0.45}
            />
            <stop
              offset="55%"
              stopColor="var(--color-valor)"
              stopOpacity={0.12}
            />
            <stop
              offset="100%"
              stopColor="var(--color-valor)"
              stopOpacity={0}
            />
          </linearGradient>
          <linearGradient id={gradInversion} x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="0%"
              stopColor="var(--color-inversion)"
              stopOpacity={0.4}
            />
            <stop
              offset="60%"
              stopColor="var(--color-inversion)"
              stopOpacity={0.1}
            />
            <stop
              offset="100%"
              stopColor="var(--color-inversion)"
              stopOpacity={0}
            />
          </linearGradient>
        </defs>
        <CartesianGrid
          vertical={false}
          strokeDasharray="4 4"
          className="stroke-border/60"
        />
        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
          tickMargin={12}
          tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          width={48}
          tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
          tickFormatter={(v) => `${Number(v) / 1000}k €`}
        />
        <ChartTooltip
          cursor={{ stroke: "var(--border)", strokeWidth: 1 }}
          content={
            <ChartTooltipContent
              formatter={(value) => (
                <span className="font-mono tabular-nums">
                  {formatEur(Number(value))}
                </span>
              )}
              labelFormatter={(label) => `Mes: ${label}`}
              indicator="line"
            />
          }
        />
        <ChartLegend content={<ChartLegendContent />} />
        <Area
          type="natural"
          dataKey="inversion"
          name="inversion"
          stroke="var(--color-inversion)"
          strokeWidth={2}
          fill={`url(#${gradInversion})`}
          dot={false}
          activeDot={{
            r: 5,
            strokeWidth: 2,
            stroke: "var(--background)",
            fill: "var(--color-inversion)",
          }}
        />
        <Area
          type="natural"
          dataKey="valor"
          name="valor"
          stroke="var(--color-valor)"
          strokeWidth={2.5}
          fill={`url(#${gradValor})`}
          dot={false}
          activeDot={{
            r: 5,
            strokeWidth: 2,
            stroke: "var(--background)",
            fill: "var(--color-valor)",
          }}
        />
      </AreaChart>
    </ChartContainer>
  );
}

export function PortalDashboard() {
  const { loading, error, data } = usePortalDashboardData();

  const profile = data?.profile ?? {
    companyName: "Cliente",
    periodLabel: "Acumulado año en curso",
  };
  const ytd = data?.ytd ?? {
    hoursSavedYtd: 0,
    estimatedValueEur: 0,
    consultancyFeesEur: 0,
  };
  const monthly = data?.monthly ?? [];
  const netBenefitEur = computeNetBenefit(
    ytd.estimatedValueEur,
    ytd.consultancyFeesEur,
  );
  const roiMultiple = computeRoiMultiple(
    ytd.estimatedValueEur,
    ytd.consultancyFeesEur,
  );

  return (
    <div className="flex flex-col gap-6">
      {error ? (
        <p className="rounded-md border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-sm text-amber-950 dark:text-amber-100">
          {error}
        </p>
      ) : null}

      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Hola, {profile.companyName}
        </h1>
        <p className="text-sm text-muted-foreground">
          {profile.periodLabel}. Aquí ves el impacto acumulado de las mejoras y
          el uso de IA que hemos implementado contigo (datos de vuestra cuenta).
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {loading ? (
          <>
            <Skeleton className="h-[120px] rounded-xl" />
            <Skeleton className="h-[120px] rounded-xl" />
            <Skeleton className="h-[120px] rounded-xl" />
            <Skeleton className="h-[120px] rounded-xl" />
          </>
        ) : (
          <>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Horas liberadas (YTD)</CardDescription>
                <CardTitle className="text-2xl font-semibold tabular-nums">
                  {formatHours(ytd.hoursSavedYtd)} h
                </CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground">
                Tiempo que deja de dedicarse a tareas repetitivas según
                seguimiento quincenal.
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Valor estimado generado</CardDescription>
                <CardTitle className="text-2xl font-semibold tabular-nums">
                  {formatEur(ytd.estimatedValueEur)}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground">
                Horas × coste hora interno acordado en el marco del proyecto (no
                es facturación).
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Inversión en consultoría Matic</CardDescription>
                <CardTitle className="text-2xl font-semibold tabular-nums">
                  {formatEur(ytd.consultancyFeesEur)}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground">
                Honorarios / presupuesto del mismo periodo, tal como figura en
                contrato o anexos.
              </CardContent>
            </Card>
            <Card className="border-primary/25 bg-primary/5">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between gap-2">
                  <CardDescription>Beneficio neto estimado</CardDescription>
                  <Badge variant="secondary" className="text-[0.65rem]">
                    {roiMultiple > 0
                      ? `×${roiMultiple} respecto a inversión`
                      : "Sin ratio (inversión 0)"}
                  </Badge>
                </div>
                <CardTitle className="text-2xl font-semibold tabular-nums text-primary">
                  {formatEur(netBenefitEur)}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground">
                Valor estimado menos inversión en nuestro servicio, con la
                metodología que definimos juntos.
              </CardContent>
            </Card>
          </>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Evolución valor vs inversión</CardTitle>
          <CardDescription>
            Serie mensual desde Supabase: área bajo cada métrica; la línea
            superior marca el valor exacto del mes.
          </CardDescription>
        </CardHeader>
        <CardContent className="pl-0 sm:pl-2">
          {loading ? (
            <Skeleton className="mx-2 h-[320px] w-full rounded-lg sm:h-[340px]" />
          ) : (
            <MonthlyValueChart data={monthly} />
          )}
        </CardContent>
      </Card>

      <p className="text-[0.7rem] leading-relaxed text-muted-foreground">
        Nota metodológica: las cifras de valor dependen del coste hora y de las
        hipótesis firmadas en el plan de medición. No sustituyen a un informe
        financiero ni a auditoría externa; sirven para alinear dirección y
        equipos en torno al impacto de las implementaciones.
      </p>
    </div>
  );
}
