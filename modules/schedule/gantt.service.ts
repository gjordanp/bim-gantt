import type { ScheduleTask } from "@/modules/shared/types";

export type GanttNode = ScheduleTask & { children: GanttNode[] };

/** Arma el árbol jerárquico (parentId) que consume <GanttChart />. */
export function buildTaskTree(tasks: ScheduleTask[]): GanttNode[] {
  const byId = new Map<string, GanttNode>(
    tasks.map((t) => [t.id, { ...t, children: [] }]),
  );
  const roots: GanttNode[] = [];

  for (const task of byId.values()) {
    if (task.parentId && byId.has(task.parentId)) {
      byId.get(task.parentId)!.children.push(task);
    } else {
      roots.push(task);
    }
  }

  return roots;
}

/** Avance de una tarea contenedora = promedio ponderado por duración de sus hijas. */
export function rollUpProgress(node: GanttNode): number {
  if (node.children.length === 0) return node.progress;

  const weighted = node.children.reduce(
    (acc, child) => {
      const duration = durationDays(child.startDate, child.endDate);
      return {
        sum: acc.sum + rollUpProgress(child) * duration,
        totalDuration: acc.totalDuration + duration,
      };
    },
    { sum: 0, totalDuration: 0 },
  );

  return weighted.totalDuration === 0 ? 0 : weighted.sum / weighted.totalDuration;
}

function durationDays(start: string, end: string): number {
  const ms = new Date(end).getTime() - new Date(start).getTime();
  return Math.max(1, Math.round(ms / 86_400_000));
}
