import type { SupabaseClient } from "@supabase/supabase-js";

import type { RoadmapPhase } from "@/components/ui/agent-plan";

export type PortalClientProfile = {
  companyName: string;
  periodLabel: string;
};

export type PortalYtdMetrics = {
  hoursSavedYtd: number;
  estimatedValueEur: number;
  consultancyFeesEur: number;
};

export type MonthlyChartPoint = {
  month: string;
  valor: number;
  inversion: number;
};

export type ImplementationUiRow = {
  id: string;
  name: string;
  area: string;
  status: "Activo" | "Piloto" | "Cerrado";
  hoursPerWeekSaved: number;
  estimatedMonthlyValueEur: number;
  startedAt: string;
  roadmapPhases: RoadmapPhase[];
};

function num(v: unknown): number {
  if (v == null) return 0;
  if (typeof v === "number") return Number.isFinite(v) ? v : 0;
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

const STATUS_MAP = {
  active: "Activo",
  pilot: "Piloto",
  closed: "Cerrado",
} as const;

function parseRoadmapPhases(raw: unknown): RoadmapPhase[] {
  if (!Array.isArray(raw)) return [];
  return raw as RoadmapPhase[];
}

export async function fetchPortalDashboardData(
  supabase: SupabaseClient,
  userId: string
): Promise<{
  profile: PortalClientProfile;
  ytd: PortalYtdMetrics;
  monthly: MonthlyChartPoint[];
  error: string | null;
}> {
  const [{ data: profileRow }, { data: dashRow, error: dashErr }, { data: monthRows, error: monthErr }] =
    await Promise.all([
      supabase.from("profiles").select("company_name").eq("id", userId).maybeSingle(),
      supabase.from("client_dashboard_metrics").select("*").eq("user_id", userId).maybeSingle(),
      supabase
        .from("client_monthly_metrics")
        .select("month_label, sort_index, valor_eur, inversion_eur")
        .eq("user_id", userId)
        .order("sort_index", { ascending: true }),
    ]);

  const companyFromProfile =
    typeof profileRow?.company_name === "string" && profileRow.company_name.trim()
      ? profileRow.company_name.trim()
      : "Cliente";

  if (dashErr) {
    return {
      profile: {
        companyName: companyFromProfile,
        periodLabel: "Acumulado año en curso",
      },
      ytd: { hoursSavedYtd: 0, estimatedValueEur: 0, consultancyFeesEur: 0 },
      monthly: [],
      error: dashErr.message,
    };
  }

  if (monthErr) {
    return {
      profile: {
        companyName: companyFromProfile,
        periodLabel: "Acumulado año en curso",
      },
      ytd: { hoursSavedYtd: 0, estimatedValueEur: 0, consultancyFeesEur: 0 },
      monthly: [],
      error: monthErr.message,
    };
  }

  const d = dashRow as Record<string, unknown> | null;
  const companyName =
    (typeof d?.company_name_display === "string" && d.company_name_display.trim()
      ? d.company_name_display.trim()
      : null) ?? companyFromProfile;
  const periodLabel =
    typeof d?.period_label === "string" && d.period_label.trim()
      ? d.period_label.trim()
      : "Acumulado año en curso";

  const ytd: PortalYtdMetrics = {
    hoursSavedYtd: Math.round(num(d?.hours_saved_ytd)),
    estimatedValueEur: num(d?.estimated_value_eur),
    consultancyFeesEur: num(d?.consultancy_fees_eur),
  };

  const monthly: MonthlyChartPoint[] = (monthRows ?? []).map((r) => ({
    month: String((r as Record<string, unknown>).month_label ?? ""),
    valor: num((r as Record<string, unknown>).valor_eur),
    inversion: num((r as Record<string, unknown>).inversion_eur),
  }));

  return {
    profile: { companyName, periodLabel },
    ytd,
    monthly,
    error: null,
  };
}

export async function fetchPortalImplementations(
  supabase: SupabaseClient,
  userId: string
): Promise<{ rows: ImplementationUiRow[]; error: string | null }> {
  const { data, error } = await supabase
    .from("client_implementations")
    .select(
      "id, name, area, status, hours_per_week_saved, estimated_monthly_value_eur, started_at, roadmap_phases"
    )
    .eq("user_id", userId)
    .order("started_at", { ascending: false });

  if (error) {
    return { rows: [], error: error.message };
  }

  const rows: ImplementationUiRow[] = (data ?? []).map((raw) => {
    const r = raw as Record<string, unknown>;
    const st = r.status as string;
    const status =
      st === "pilot" || st === "closed" || st === "active"
        ? STATUS_MAP[st]
        : "Activo";
    return {
      id: String(r.id),
      name: String(r.name ?? ""),
      area: String(r.area ?? ""),
      status,
      hoursPerWeekSaved: num(r.hours_per_week_saved),
      estimatedMonthlyValueEur: num(r.estimated_monthly_value_eur),
      startedAt: String(r.started_at ?? "").slice(0, 10),
      roadmapPhases: parseRoadmapPhases(r.roadmap_phases),
    };
  });

  return { rows, error: null };
}
