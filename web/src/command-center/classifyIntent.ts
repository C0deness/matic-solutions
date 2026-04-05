import { getFallbackScenario, SCENARIOS } from "./scenarios";
import type { ClassifyResult } from "./types";

function normalizeText(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "");
}

/**
 * Clasificador local (demo). En producción: API con LLM + reglas + historial del caso.
 */
export function classifyUserMessage(raw: string): ClassifyResult {
  const haystack = normalizeText(raw);
  let bestScore = 0;
  let bestMatched: string[] = [];
  let best = getFallbackScenario();

  for (const scenario of SCENARIOS) {
    if (scenario.id === "gen.triaje") continue;
    const matched: string[] = [];
    for (const kw of scenario.keywords) {
      const needle = normalizeText(kw);
      if (needle.length < 2) continue;
      if (haystack.includes(needle)) matched.push(kw);
    }
    const score = matched.length;
    if (score > bestScore) {
      bestScore = score;
      best = scenario;
      bestMatched = matched;
    }
  }

  if (bestScore === 0) {
    return {
      scenario: getFallbackScenario(),
      score: 0,
      matchedKeywords: [],
      isFallback: true,
    };
  }

  return {
    scenario: best,
    score: bestScore,
    matchedKeywords: bestMatched,
    isFallback: false,
  };
}
