import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { VercelRequest, VercelResponse } from "@vercel/node";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function adminClient(): { admin: SupabaseClient | null; error?: string } {
  const url = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    return { admin: null, error: "Server misconfigured" };
  }
  return {
    admin: createClient(url, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    }),
  };
}

function authorize(req: VercelRequest): string | null {
  const secret =
    process.env.PORTAL_METRICS_SECRET ?? process.env.WEBHOOK_SECRET;
  const auth = req.headers.authorization;
  if (!secret || auth !== `Bearer ${secret}`) {
    return "Unauthorized";
  }
  return null;
}

type MonthlyPoint = {
  month_label: string;
  sort_index: number;
  valor_eur: number;
  inversion_eur: number;
};

type Body =
  | {
      action: "upsert_dashboard";
      user_id: string;
      company_name_display?: string | null;
      period_label?: string | null;
      hours_saved_ytd?: number;
      estimated_value_eur?: number;
      consultancy_fees_eur?: number;
    }
  | {
      action: "replace_monthly";
      user_id: string;
      points: MonthlyPoint[];
    }
  | {
      action: "upsert_implementation";
      user_id: string;
      id?: string | null;
      name: string;
      area: string;
      status: "active" | "pilot" | "closed";
      hours_per_week_saved?: number;
      estimated_monthly_value_eur?: number;
      started_at?: string;
      roadmap_phases?: unknown;
    }
  | {
      action: "delete_implementation";
      user_id: string;
      id: string;
    };

function parseBody(req: VercelRequest): Body | null {
  try {
    const raw = req.body;
    const o = typeof raw === "string" ? (JSON.parse(raw) as unknown) : raw;
    if (!o || typeof o !== "object" || !("action" in o)) return null;
    return o as Body;
  } catch {
    return null;
  }
}

/**
 * Ingesta de métricas del portal (n8n, Make, script curl).
 * Authorization: Bearer PORTAL_METRICS_SECRET (si existe) o WEBHOOK_SECRET
 *
 * Acciones:
 * - upsert_dashboard: KPIs YTD en client_dashboard_metrics
 * - replace_monthly: borra serie del usuario e inserta points[]
 * - upsert_implementation: insert o update client_implementations
 * - delete_implementation: borra por id (del usuario)
 */
export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const authErr = authorize(req);
  if (authErr) {
    return res.status(401).json({ error: authErr });
  }

  const { admin, error: cfgErr } = adminClient();
  if (cfgErr || !admin) {
    return res.status(500).json({ error: cfgErr ?? "Server misconfigured" });
  }

  const body = parseBody(req);
  if (!body?.action) {
    return res.status(400).json({ error: "Invalid JSON or missing action" });
  }

  if (!body.user_id || !UUID_RE.test(body.user_id)) {
    return res.status(400).json({ error: "user_id must be a valid UUID" });
  }

  const uid = body.user_id;

  if (body.action === "upsert_dashboard") {
    const row = {
      user_id: uid,
      company_name_display: body.company_name_display ?? null,
      period_label: body.period_label ?? "Acumulado año en curso",
      hours_saved_ytd: Math.max(0, Math.floor(Number(body.hours_saved_ytd ?? 0))),
      estimated_value_eur: Math.max(0, Number(body.estimated_value_eur ?? 0)),
      consultancy_fees_eur: Math.max(0, Number(body.consultancy_fees_eur ?? 0)),
      updated_at: new Date().toISOString(),
    };

    const { error } = await admin
      .from("client_dashboard_metrics")
      .upsert(row, { onConflict: "user_id" });

    if (error) {
      return res.status(400).json({ error: error.message });
    }
    return res.status(200).json({ ok: true, action: "upsert_dashboard" });
  }

  if (body.action === "replace_monthly") {
    if (!Array.isArray(body.points)) {
      return res.status(400).json({ error: "points must be an array" });
    }

    const { error: delErr } = await admin
      .from("client_monthly_metrics")
      .delete()
      .eq("user_id", uid);

    if (delErr) {
      return res.status(400).json({ error: delErr.message });
    }

    const rows = body.points.map((p) => ({
      user_id: uid,
      month_label: String(p.month_label ?? "").trim() || "?",
      sort_index: Number(p.sort_index) || 0,
      valor_eur: Math.max(0, Number(p.valor_eur ?? 0)),
      inversion_eur: Math.max(0, Number(p.inversion_eur ?? 0)),
    }));

    if (rows.length === 0) {
      return res.status(200).json({ ok: true, action: "replace_monthly", inserted: 0 });
    }

    const { error: insErr } = await admin
      .from("client_monthly_metrics")
      .insert(rows);

    if (insErr) {
      return res.status(400).json({ error: insErr.message });
    }
    return res.status(200).json({
      ok: true,
      action: "replace_monthly",
      inserted: rows.length,
    });
  }

  if (body.action === "upsert_implementation") {
    const status = body.status;
    if (status !== "active" && status !== "pilot" && status !== "closed") {
      return res.status(400).json({
        error: "status must be active, pilot or closed",
      });
    }

    const name = String(body.name ?? "").trim();
    const area = String(body.area ?? "").trim();
    if (!name || !area) {
      return res.status(400).json({ error: "name and area are required" });
    }

    const roadmap =
      body.roadmap_phases !== undefined
        ? body.roadmap_phases
        : ([] as unknown[]);

    const base = {
      user_id: uid,
      name,
      area,
      status,
      hours_per_week_saved: Math.max(0, Number(body.hours_per_week_saved ?? 0)),
      estimated_monthly_value_eur: Math.max(
        0,
        Number(body.estimated_monthly_value_eur ?? 0),
      ),
      started_at: body.started_at?.trim() || new Date().toISOString().slice(0, 10),
      roadmap_phases: roadmap,
      updated_at: new Date().toISOString(),
    };

    if (body.id && UUID_RE.test(body.id)) {
      const { data, error } = await admin
        .from("client_implementations")
        .update(base)
        .eq("id", body.id)
        .eq("user_id", uid)
        .select("id")
        .maybeSingle();

      if (error) {
        return res.status(400).json({ error: error.message });
      }
      if (!data) {
        return res.status(404).json({ error: "Implementation not found" });
      }
      return res.status(200).json({
        ok: true,
        action: "upsert_implementation",
        id: data.id,
      });
    }

    const { data, error } = await admin
      .from("client_implementations")
      .insert({ ...base, created_at: new Date().toISOString() })
      .select("id")
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }
    return res.status(201).json({
      ok: true,
      action: "upsert_implementation",
      id: data.id as string,
    });
  }

  if (body.action === "delete_implementation") {
    if (!body.id || !UUID_RE.test(body.id)) {
      return res.status(400).json({ error: "id must be a valid UUID" });
    }

    const { data: deleted, error } = await admin
      .from("client_implementations")
      .delete()
      .eq("id", body.id)
      .eq("user_id", uid)
      .select("id");

    if (error) {
      return res.status(400).json({ error: error.message });
    }
    if (!deleted?.length) {
      return res.status(404).json({ error: "Implementation not found" });
    }
    return res.status(200).json({ ok: true, action: "delete_implementation" });
  }

  return res.status(400).json({ error: "Unknown action" });
}
