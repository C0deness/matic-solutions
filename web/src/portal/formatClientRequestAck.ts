import type { ClassifyResult } from "@/command-center/types";

/**
 * Respuesta visible para el cliente del portal (sin playbooks, escenarios ni departamentos).
 * La clasificación puede usarse solo en backend / consola operador.
 */
export function formatClientRequestAck(_result: ClassifyResult): string {
  return [
    "Gracias. Hemos recibido vuestra petición.",
    "",
    "El equipo de Matic la revisará y os responderá por el canal acordado (correo o este portal) con los siguientes pasos y, si hace falta, alguna pregunta breve.",
    "",
    "Si es urgente, indicadlo también por vuestro contacto directo con Matic.",
  ].join("\n");
}
