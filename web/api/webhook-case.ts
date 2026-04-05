import { createClient } from "@supabase/supabase-js";
import type { VercelRequest, VercelResponse } from "@vercel/node";

type WebhookBody = {
  user_id: string;
  message: string;
  external_ref?: string;
  scenario_key?: string;
};

/**
 * Webhook servidor-a-servidor (n8n, Make, etc.).
 * Authorization: Bearer <WEBHOOK_SECRET>
 * Body JSON: { "user_id": "<uuid auth.users>", "message": "...", "external_ref"?: "..." }
 */
export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const secret = process.env.WEBHOOK_SECRET;
  const auth = req.headers.authorization;
  if (!secret || auth !== `Bearer ${secret}`) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const url = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    return res.status(500).json({ error: "Server misconfigured" });
  }

  let body: WebhookBody;
  try {
    const raw = req.body;
    body = typeof raw === "string" ? (JSON.parse(raw) as WebhookBody) : raw;
  } catch {
    return res.status(400).json({ error: "Invalid JSON" });
  }

  if (!body?.user_id || typeof body.message !== "string" || !body.message.trim()) {
    return res.status(400).json({ error: "user_id and message are required" });
  }

  const admin = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const trimmed = body.message.trim();
  const title = trimmed.length > 80 ? `${trimmed.slice(0, 77)}…` : trimmed;

  const { data: caseRow, error: caseErr } = await admin
    .from("client_cases")
    .insert({
      user_id: body.user_id,
      status: "open",
      source: "webhook",
      title,
      external_ref: body.external_ref ?? null,
      scenario_key: body.scenario_key ?? null,
    })
    .select("id")
    .single();

  if (caseErr || !caseRow) {
    return res.status(400).json({
      error: caseErr?.message ?? "Could not create case",
    });
  }

  const caseId = caseRow.id as string;

  const { error: msgErr } = await admin.from("client_case_messages").insert({
    case_id: caseId,
    role: "user",
    body: trimmed,
  });

  if (msgErr) {
    return res.status(500).json({ error: msgErr.message });
  }

  return res.status(201).json({ case_id: caseId });
}
