import type { SupabaseClient } from "@supabase/supabase-js";

import type { ClassifyResult } from "@/command-center/types";

export async function insertPortalCaseWithMessages(
  supabase: SupabaseClient,
  userId: string,
  userText: string,
  assistantText: string,
  classified: ClassifyResult | null
): Promise<{ caseId: string; error: string | null }> {
  const title =
    userText.length > 80 ? `${userText.slice(0, 77)}…` : userText;

  const { data: caseRow, error: caseErr } = await supabase
    .from("client_cases")
    .insert({
      user_id: userId,
      status: "open",
      source: "portal_chat",
      scenario_key: classified?.scenario.id ?? null,
      title,
    })
    .select("id")
    .single();

  if (caseErr || !caseRow) {
    return {
      caseId: "",
      error: caseErr?.message ?? "No se pudo crear el caso",
    };
  }

  const caseId = caseRow.id as string;

  const classifiedPayload = classified
    ? {
        scenario_id: classified.scenario.id,
        playbook_id: classified.scenario.playbookId,
        primary_dept: classified.scenario.primaryDept,
        score: classified.score,
        is_fallback: classified.isFallback,
      }
    : null;

  const { error: msgErr } = await supabase.from("client_case_messages").insert([
    { case_id: caseId, role: "user", body: userText, classified: null },
    {
      case_id: caseId,
      role: "assistant",
      body: assistantText,
      classified: classifiedPayload,
    },
  ]);

  if (msgErr) {
    return { caseId, error: msgErr.message };
  }

  return { caseId, error: null };
}

export async function appendCaseMessages(
  supabase: SupabaseClient,
  caseId: string,
  userText: string,
  assistantText: string,
  classified: ClassifyResult | null
): Promise<{ error: string | null }> {
  const classifiedPayload = classified
    ? {
        scenario_id: classified.scenario.id,
        playbook_id: classified.scenario.playbookId,
        primary_dept: classified.scenario.primaryDept,
        score: classified.score,
        is_fallback: classified.isFallback,
      }
    : null;

  const { error } = await supabase.from("client_case_messages").insert([
    { case_id: caseId, role: "user", body: userText, classified: null },
    {
      case_id: caseId,
      role: "assistant",
      body: assistantText,
      classified: classifiedPayload,
    },
  ]);

  if (error) {
    return { error: error.message };
  }

  await supabase
    .from("client_cases")
    .update({ status: "open" })
    .eq("id", caseId);

  return { error: null };
}
