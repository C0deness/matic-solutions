import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "framer-motion";
import {
  CheckCircle2,
  Circle,
  CircleAlert,
  CircleDotDashed,
  CircleX,
} from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

export type RoadmapStatus =
  | "completed"
  | "in-progress"
  | "pending"
  | "need-help"
  | "failed";

export interface RoadmapSubtask {
  id: string;
  title: string;
  description: string;
  status: RoadmapStatus;
  priority: "high" | "medium" | "low";
  /** Entregables o artefactos asociados al hito */
  deliverables?: string[];
}

export interface RoadmapPhase {
  id: string;
  title: string;
  description: string;
  status: RoadmapStatus;
  priority: "high" | "medium" | "low";
  level: number;
  dependencies: string[];
  subtasks: RoadmapSubtask[];
}

const STATUS_LABEL: Record<RoadmapStatus, string> = {
  completed: "Completada",
  "in-progress": "En curso",
  pending: "Pendiente",
  "need-help": "Requiere input",
  failed: "Bloqueada",
};

function StatusIcon({
  status,
  className,
}: {
  status: RoadmapStatus;
  className?: string;
}) {
  const c = cn("size-4 shrink-0", className);
  switch (status) {
    case "completed":
      return <CheckCircle2 className={cn(c, "text-green-600 dark:text-green-400")} />;
    case "in-progress":
      return <CircleDotDashed className={cn(c, "text-sky-600 dark:text-sky-400")} />;
    case "need-help":
      return <CircleAlert className={cn(c, "text-amber-600 dark:text-amber-400")} />;
    case "failed":
      return <CircleX className={cn(c, "text-red-600 dark:text-red-400")} />;
    default:
      return <Circle className={cn(c, "text-muted-foreground")} />;
  }
}

function StatusBadge({ status }: { status: RoadmapStatus }) {
  const label = STATUS_LABEL[status];
  const cls = cn(
    "rounded px-1.5 py-0.5 text-[10px] font-medium",
    status === "completed" &&
      "bg-green-500/15 text-green-800 dark:text-green-300",
    status === "in-progress" &&
      "bg-sky-500/15 text-sky-800 dark:text-sky-300",
    status === "need-help" &&
      "bg-amber-500/15 text-amber-900 dark:text-amber-200",
    status === "failed" && "bg-red-500/15 text-red-800 dark:text-red-300",
    status === "pending" && "bg-muted text-muted-foreground",
  );
  return <span className={cls}>{label}</span>;
}

export interface AgentPlanProps {
  tasks: RoadmapPhase[];
  className?: string;
}

/** Roadmap por fases (descubrimiento → producción) con hitos desplegables. Solo lectura. */
export function AgentPlan({ tasks, className }: AgentPlanProps) {
  const reduceMotion = useReducedMotion();
  const prefersReducedMotion = reduceMotion ?? false;

  const [expandedTasks, setExpandedTasks] = React.useState<string[]>(() =>
    tasks.length ? [tasks[0]!.id] : [],
  );
  const [expandedSubtasks, setExpandedSubtasks] = React.useState<
    Record<string, boolean>
  >({});

  React.useEffect(() => {
    if (tasks.length) {
      setExpandedTasks([tasks[0]!.id]);
    } else {
      setExpandedTasks([]);
    }
  }, [tasks]);

  const depTitle = React.useCallback(
    (depId: string) => tasks.find((t) => t.id === depId)?.title ?? depId,
    [tasks],
  );

  const toggleTaskExpansion = (taskId: string) => {
    setExpandedTasks((prev) =>
      prev.includes(taskId) ? prev.filter((id) => id !== taskId) : [...prev, taskId],
    );
  };

  const toggleSubtaskExpansion = (taskId: string, subtaskId: string) => {
    const key = `${taskId}-${subtaskId}`;
    setExpandedSubtasks((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const taskVariants = {
    hidden: {
      opacity: 0,
      y: prefersReducedMotion ? 0 : -5,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: prefersReducedMotion ? ("tween" as const) : ("spring" as const),
        stiffness: 500,
        damping: 30,
        duration: prefersReducedMotion ? 0.2 : undefined,
      },
    },
    exit: {
      opacity: 0,
      y: prefersReducedMotion ? 0 : -5,
      transition: { duration: 0.15 },
    },
  };

  const subtaskListVariants = {
    hidden: {
      opacity: 0,
      height: 0,
      overflow: "hidden" as const,
    },
    visible: {
      height: "auto",
      opacity: 1,
      overflow: "visible" as const,
      transition: {
        duration: 0.25,
        staggerChildren: prefersReducedMotion ? 0 : 0.05,
        when: "beforeChildren" as const,
        ease: [0.2, 0.65, 0.3, 0.9] as const,
      },
    },
    exit: {
      height: 0,
      opacity: 0,
      overflow: "hidden" as const,
      transition: {
        duration: 0.2,
        ease: [0.2, 0.65, 0.3, 0.9] as const,
      },
    },
  };

  const subtaskVariants = {
    hidden: {
      opacity: 0,
      x: prefersReducedMotion ? 0 : -10,
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: prefersReducedMotion ? ("tween" as const) : ("spring" as const),
        stiffness: 500,
        damping: 25,
        duration: prefersReducedMotion ? 0.2 : undefined,
      },
    },
    exit: {
      opacity: 0,
      x: prefersReducedMotion ? 0 : -10,
      transition: { duration: 0.15 },
    },
  };

  const subtaskDetailsVariants = {
    hidden: {
      opacity: 0,
      height: 0,
      overflow: "hidden" as const,
    },
    visible: {
      opacity: 1,
      height: "auto",
      overflow: "visible" as const,
      transition: {
        duration: 0.25,
        ease: [0.2, 0.65, 0.3, 0.9] as const,
      },
    },
  };

  if (!tasks.length) {
    return (
      <div
        className={cn(
          "text-muted-foreground rounded-lg border border-dashed p-6 text-center text-sm",
          className,
        )}
      >
        No hay fases de roadmap para esta implementación.
      </div>
    );
  }

  return (
    <div className={cn("text-foreground h-full overflow-auto", className)}>
      <motion.div
        className="bg-card border-border overflow-hidden rounded-lg border shadow-sm"
        initial={{ opacity: 0, y: 10 }}
        animate={{
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.3,
            ease: [0.2, 0.65, 0.3, 0.9],
          },
        }}
      >
        <LayoutGroup>
          <div className="overflow-hidden p-4">
            <ul className="space-y-1 overflow-hidden">
              {tasks.map((task, index) => {
                const isExpanded = expandedTasks.includes(task.id);
                const isCompleted = task.status === "completed";

                return (
                  <motion.li
                    key={task.id}
                    className={index !== 0 ? "mt-1 pt-2" : ""}
                    initial="hidden"
                    animate="visible"
                    variants={taskVariants}
                  >
                    <motion.div className="group flex items-center rounded-md px-3 py-1.5 hover:bg-muted/50">
                      <div className="mr-2 flex shrink-0 cursor-default">
                        <StatusIcon status={task.status} />
                      </div>

                      <motion.div
                        className="flex min-w-0 flex-1 cursor-pointer items-center justify-between"
                        onClick={() => toggleTaskExpansion(task.id)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            toggleTaskExpansion(task.id);
                          }
                        }}
                        role="button"
                        tabIndex={0}
                      >
                        <div className="mr-2 min-w-0 flex-1 truncate">
                          <span
                            className={
                              isCompleted ? "text-muted-foreground line-through" : ""
                            }
                          >
                            {task.title}
                          </span>
                        </div>

                        <div className="flex shrink-0 items-center gap-2 text-xs">
                          {task.dependencies.length > 0 && (
                            <div className="mr-1 flex flex-wrap items-center gap-1">
                              {task.dependencies.map((dep) => (
                                <span
                                  key={dep}
                                  className="bg-secondary/50 text-secondary-foreground rounded px-1.5 py-0.5 text-[10px] font-medium"
                                  title={`Depende de: ${depTitle(dep)}`}
                                >
                                  Tras: {depTitle(dep)}
                                </span>
                              ))}
                            </div>
                          )}
                          <StatusBadge status={task.status} />
                        </div>
                      </motion.div>
                    </motion.div>

                    <AnimatePresence mode="wait">
                      {isExpanded && task.subtasks.length > 0 && (
                        <motion.div
                          className="relative overflow-hidden"
                          variants={subtaskListVariants}
                          initial="hidden"
                          animate="visible"
                          exit="hidden"
                          layout
                        >
                          <div className="border-muted-foreground/30 absolute top-0 bottom-0 left-5 border-l-2 border-dashed" />
                          <ul className="border-muted mt-1 mr-2 mb-1.5 ml-3 space-y-0.5">
                            {task.subtasks.map((subtask) => {
                              const subtaskKey = `${task.id}-${subtask.id}`;
                              const isSubtaskExpanded = expandedSubtasks[subtaskKey];

                              return (
                                <motion.li
                                  key={subtask.id}
                                  className="group flex flex-col py-0.5 pl-6"
                                  onClick={() =>
                                    toggleSubtaskExpansion(task.id, subtask.id)
                                  }
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter" || e.key === " ") {
                                      e.preventDefault();
                                      toggleSubtaskExpansion(task.id, subtask.id);
                                    }
                                  }}
                                  role="button"
                                  tabIndex={0}
                                  variants={subtaskVariants}
                                  initial="hidden"
                                  animate="visible"
                                  exit="exit"
                                  layout
                                >
                                  <motion.div
                                    className="flex flex-1 items-center rounded-md p-1 hover:bg-muted/50"
                                    layout
                                  >
                                    <div className="mr-2 shrink-0">
                                      <StatusIcon
                                        status={subtask.status}
                                        className="size-3.5"
                                      />
                                    </div>

                                    <span
                                      className={cn(
                                        "cursor-pointer text-sm",
                                        subtask.status === "completed" &&
                                          "text-muted-foreground line-through",
                                      )}
                                    >
                                      {subtask.title}
                                    </span>
                                  </motion.div>

                                  <AnimatePresence mode="wait">
                                    {isSubtaskExpanded && (
                                      <motion.div
                                        className="text-muted-foreground border-border/60 mt-1 ml-1.5 border-l border-dashed pl-5 text-xs"
                                        variants={subtaskDetailsVariants}
                                        initial="hidden"
                                        animate="visible"
                                        exit="hidden"
                                        layout
                                      >
                                        <p className="py-1">{subtask.description}</p>
                                        {subtask.deliverables &&
                                          subtask.deliverables.length > 0 && (
                                            <div className="mb-1 mt-0.5 flex flex-wrap items-center gap-1.5">
                                              <span className="text-muted-foreground font-medium">
                                                Entregables:
                                              </span>
                                              <div className="flex flex-wrap gap-1">
                                                {subtask.deliverables.map((d) => (
                                                  <span
                                                    key={d}
                                                    className="bg-secondary/50 text-secondary-foreground rounded px-1.5 py-0.5 text-[10px] font-medium"
                                                  >
                                                    {d}
                                                  </span>
                                                ))}
                                              </div>
                                            </div>
                                          )}
                                      </motion.div>
                                    )}
                                  </AnimatePresence>
                                </motion.li>
                              );
                            })}
                          </ul>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.li>
                );
              })}
            </ul>
          </div>
        </LayoutGroup>
      </motion.div>
    </div>
  );
}

export default AgentPlan;
