/**
 * Métricas, roadmaps y tablas del panel: datos de ejemplo en front.
 * Auth, registro y chat sí pueden ir contra Supabase (ver PortalAuthContext).
 * Sustituir por API/CRM cuando tengáis fuentes reales.
 */

import type { RoadmapPhase } from "@/components/ui/agent-plan";

export const clientProfile = {
  companyName: "Acme Industrial",
  periodLabel: "Acumulado año en curso (ejemplo)",
};

export const ytdMetrics = {
  hoursSavedYtd: 842,
  /** Valor estimado = horas × coste hora interno acordado en el proyecto */
  estimatedValueEur: 126_300,
  /** Facturación / presupuesto consultoría Matic en el mismo periodo */
  consultancyFeesEur: 38_400,
};

export const netBenefitEur =
  ytdMetrics.estimatedValueEur - ytdMetrics.consultancyFeesEur;

export const roiMultiple = Number(
  (ytdMetrics.estimatedValueEur / ytdMetrics.consultancyFeesEur).toFixed(2),
);

export const monthlyComparison = [
  { month: "Oct", valor: 8_200, inversion: 3_200 },
  { month: "Nov", valor: 11_400, inversion: 3_200 },
  { month: "Dic", valor: 14_100, inversion: 4_800 },
  { month: "Ene", valor: 18_600, inversion: 4_800 },
  { month: "Feb", valor: 21_300, inversion: 5_400 },
  { month: "Mar", valor: 24_800, inversion: 5_400 },
];

export type ImplementationRow = {
  id: string;
  name: string;
  area: string;
  status: "Activo" | "Piloto" | "Cerrado";
  hoursPerWeekSaved: number;
  estimatedMonthlyValueEur: number;
  startedAt: string;
};

export const implementations: ImplementationRow[] = [
  {
    id: "1",
    name: "Asistente de documentación de calidad",
    area: "Operaciones",
    status: "Activo",
    hoursPerWeekSaved: 28,
    estimatedMonthlyValueEur: 8_400,
    startedAt: "2025-09-12",
  },
  {
    id: "2",
    name: "Clasificación y enrutamiento de incidencias internas",
    area: "TI / Soporte",
    status: "Activo",
    hoursPerWeekSaved: 22,
    estimatedMonthlyValueEur: 6_600,
    startedAt: "2025-10-01",
  },
  {
    id: "3",
    name: "Resúmenes ejecutivos de proveedor (compras)",
    area: "Compras",
    status: "Piloto",
    hoursPerWeekSaved: 8,
    estimatedMonthlyValueEur: 2_400,
    startedAt: "2026-02-15",
  },
  {
    id: "4",
    name: "Onboarding de técnicos de campo (checklists)",
    area: "RR. HH. / Operaciones",
    status: "Cerrado",
    hoursPerWeekSaved: 15,
    estimatedMonthlyValueEur: 4_500,
    startedAt: "2025-06-01",
  },
];

export function formatEur(value: number) {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatHours(n: number) {
  return new Intl.NumberFormat("es-ES").format(n);
}

/** Roadmap por implementación (fases → hitos). IDs alineados con `implementations`. */
export const implementationRoadmaps: Record<string, RoadmapPhase[]> = {
  "1": [
    {
      id: "1",
      title: "Descubrimiento y alcance",
      description: "",
      status: "completed",
      priority: "high",
      level: 0,
      dependencies: [],
      subtasks: [
        {
          id: "1.1",
          title: "Entrevistas con calidad y operaciones",
          description:
            "Alineación de casos de uso, documentos fuente y criterios de aceptación.",
          status: "completed",
          priority: "high",
          deliverables: ["Acta de alcance", "Mapa de documentos"],
        },
        {
          id: "1.2",
          title: "Inventario de plantillas y normativa",
          description:
            "Revisión de formatos ISO y plantillas vigentes para automatizar.",
          status: "completed",
          priority: "medium",
          deliverables: ["Matriz de plantillas"],
        },
      ],
    },
    {
      id: "2",
      title: "Diseño de la solución",
      description: "",
      status: "completed",
      priority: "high",
      level: 0,
      dependencies: ["1"],
      subtasks: [
        {
          id: "2.1",
          title: "Flujo asistido de redacción",
          description:
            "Definición de prompts, validaciones y puntos de revisión humana.",
          status: "completed",
          priority: "high",
          deliverables: ["Especificación funcional"],
        },
        {
          id: "2.2",
          title: "Integración con repositorio documental",
          description:
            "Acceso lectura/escritura según permisos del cliente (demo: mock).",
          status: "completed",
          priority: "high",
        },
      ],
    },
    {
      id: "3",
      title: "Desarrollo e integración",
      description: "",
      status: "in-progress",
      priority: "high",
      level: 0,
      dependencies: ["2"],
      subtasks: [
        {
          id: "3.1",
          title: "MVP del asistente en entorno de pruebas",
          description:
            "Primera versión con plantillas prioritarias y trazabilidad de cambios.",
          status: "in-progress",
          priority: "high",
          deliverables: ["Entorno staging", "Guía de prueba"],
        },
        {
          id: "3.2",
          title: "Pruebas con usuarios piloto",
          description:
            "Sesiones guiadas con 4 redactores de calidad; recogida de feedback.",
          status: "pending",
          priority: "medium",
        },
      ],
    },
    {
      id: "4",
      title: "Piloto en producción limitada",
      description: "",
      status: "pending",
      priority: "medium",
      level: 1,
      dependencies: ["3"],
      subtasks: [
        {
          id: "4.1",
          title: "Despliegue por departamento",
          description:
            "Rollout acotado con métricas de tiempo y errores de primera versión.",
          status: "pending",
          priority: "high",
        },
      ],
    },
    {
      id: "5",
      title: "Producción y handover",
      description: "",
      status: "pending",
      priority: "medium",
      level: 1,
      dependencies: ["4"],
      subtasks: [
        {
          id: "5.1",
          title: "Documentación y formación",
          description:
            "Playbook de uso, contacto de soporte y revisión trimestral acordada.",
          status: "pending",
          priority: "medium",
          deliverables: ["Playbook", "Sesión de formación"],
        },
      ],
    },
  ],
  "2": [
    {
      id: "1",
      title: "Descubrimiento",
      description: "",
      status: "completed",
      priority: "high",
      level: 0,
      dependencies: [],
      subtasks: [
        {
          id: "1.1",
          title: "Taxonomía de incidencias y SLAs",
          description:
            "Clasificación actual vs objetivo; reglas de enrutamiento deseadas.",
          status: "completed",
          priority: "high",
        },
      ],
    },
    {
      id: "2",
      title: "Diseño del clasificador",
      description: "",
      status: "completed",
      priority: "high",
      level: 0,
      dependencies: ["1"],
      subtasks: [
        {
          id: "2.1",
          title: "Dataset etiquetado y métricas",
          description:
            "Conjunto de entrenamiento validado con el equipo de soporte.",
          status: "completed",
          priority: "high",
          deliverables: ["Informe de calidad de datos"],
        },
      ],
    },
    {
      id: "3",
      title: "Integración con herramienta de tickets",
      description: "",
      status: "in-progress",
      priority: "high",
      level: 0,
      dependencies: ["2"],
      subtasks: [
        {
          id: "3.1",
          title: "Conector y reglas de enrutamiento",
          description:
            "Escritura de campos sugeridos y colas destino según confianza del modelo.",
          status: "in-progress",
          priority: "high",
        },
        {
          id: "3.2",
          title: "Observabilidad y auditoría",
          description:
            "Logs mínimos para explicar decisiones automáticas (demo).",
          status: "pending",
          priority: "medium",
        },
      ],
    },
    {
      id: "4",
      title: "Piloto y extensión",
      description: "",
      status: "pending",
      priority: "medium",
      level: 1,
      dependencies: ["3"],
      subtasks: [
        {
          id: "4.1",
          title: "Ampliación a segunda cola",
          description: "Replicar flujo en incidencias de aplicaciones.",
          status: "pending",
          priority: "medium",
        },
      ],
    },
  ],
  "3": [
    {
      id: "1",
      title: "Descubrimiento",
      description: "",
      status: "completed",
      priority: "high",
      level: 0,
      dependencies: [],
      subtasks: [
        {
          id: "1.1",
          title: "Fuentes de datos de proveedor",
          description:
            "Contratos, correos y plataformas donde se centraliza la información.",
          status: "completed",
          priority: "high",
        },
      ],
    },
    {
      id: "2",
      title: "Diseño de resúmenes ejecutivos",
      description: "",
      status: "completed",
      priority: "high",
      level: 0,
      dependencies: ["1"],
      subtasks: [
        {
          id: "2.1",
          title: "Plantilla de salida y tono",
          description:
            "Alineación con dirección de compras y legal para el formato final.",
          status: "completed",
          priority: "high",
        },
      ],
    },
    {
      id: "3",
      title: "Piloto con compras",
      description: "",
      status: "in-progress",
      priority: "high",
      level: 0,
      dependencies: ["2"],
      subtasks: [
        {
          id: "3.1",
          title: "Semanal: lote de 15 expedientes",
          description:
            "Validación humana obligatoria antes de enviar a comité.",
          status: "in-progress",
          priority: "high",
          deliverables: ["Cuadro de métricas piloto"],
        },
        {
          id: "3.2",
          title: "Ajuste de riesgos y exclusiones",
          description:
            "Lista de casos que no deben automatizarse (umbrales, proveedores críticos).",
          status: "need-help",
          priority: "high",
          deliverables: ["Pendiente: criterio de umbrales"],
        },
      ],
    },
    {
      id: "4",
      title: "Producción",
      description: "",
      status: "pending",
      priority: "medium",
      level: 1,
      dependencies: ["3"],
      subtasks: [
        {
          id: "4.1",
          title: "Despliegue y acuerdo de revisión",
          description: "Tras cerrar el piloto con KPIs aceptados.",
          status: "pending",
          priority: "medium",
        },
      ],
    },
  ],
  "4": [
    {
      id: "1",
      title: "Descubrimiento",
      description: "",
      status: "completed",
      priority: "high",
      level: 0,
      dependencies: [],
      subtasks: [
        {
          id: "1.1",
          title: "Taller con jefes de equipo",
          description: "Checklist actual en papel y excepciones habituales.",
          status: "completed",
          priority: "high",
        },
      ],
    },
    {
      id: "2",
      title: "Diseño y desarrollo",
      description: "",
      status: "completed",
      priority: "high",
      level: 0,
      dependencies: ["1"],
      subtasks: [
        {
          id: "2.1",
          title: "App móvil / PWA de checklist",
          description:
            "Flujo offline-first básico y sincronización al volver cobertura.",
          status: "completed",
          priority: "high",
        },
      ],
    },
    {
      id: "3",
      title: "Piloto en campo",
      description: "",
      status: "completed",
      priority: "medium",
      level: 0,
      dependencies: ["2"],
      subtasks: [
        {
          id: "3.1",
          title: "Dos semanas con 12 técnicos",
          description: "Medición de tiempo por intervención y satisfacción.",
          status: "completed",
          priority: "medium",
        },
      ],
    },
    {
      id: "4",
      title: "Producción y cierre",
      description: "",
      status: "completed",
      priority: "medium",
      level: 1,
      dependencies: ["3"],
      subtasks: [
        {
          id: "4.1",
          title: "Handover a RR. HH. y operaciones",
          description:
            "Proyecto cerrado; soporte reactivo finalizado según contrato.",
          status: "completed",
          priority: "low",
          deliverables: ["Informe de cierre"],
        },
      ],
    },
  ],
};
