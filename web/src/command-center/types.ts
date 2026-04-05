/** Tipos del centro de mando — alineados con `agencia/escenarios-centro-mando.md` */

export type CommandDept = "CEO" | "MKT" | "VTA" | "ING" | "SUP" | "OPS";

export type ScenarioDefinition = {
  id: string;
  title: string;
  summary: string;
  primaryDept: CommandDept;
  playbookId: string;
  humanGates: string[];
  /** Pasos orientativos que verá el cliente en el portal (demo). */
  steps: string[];
  /** Palabras para clasificación local (sin API). Minúsculas. */
  keywords: string[];
};

export type ClassifyResult = {
  scenario: ScenarioDefinition;
  score: number;
  matchedKeywords: string[];
  isFallback: boolean;
};
