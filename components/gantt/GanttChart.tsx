import { clsx } from "clsx";
import type { ScheduleTask } from "@/modules/shared/types";

const STATUS_LABEL: Record<ScheduleTask["status"], string> = {
  pending: "Pendiente",
  in_progress: "En curso",
  done: "Completada",
  blocked: "Bloqueada",
};

const STATUS_CLASS: Record<ScheduleTask["status"], string> = {
  pending: "bg-status-pending",
  in_progress: "bg-status-progress",
  done: "bg-status-done",
  blocked: "bg-status-blocked",
};

/** Carta Gantt simplificada: barra de progreso por tarea, sin dependencias visuales aún. */
export function GanttChart({ tasks }: { tasks: ScheduleTask[] }) {
  return (
    <div>
      {tasks.map((task) => (
        <div key={task.id} className="kg-row items-center">
          <div className="w-48 shrink-0">
            <div className="font-semibold text-ink">{task.name}</div>
            <div className="text-xs text-muted">
              {task.startDate} → {task.endDate}
            </div>
          </div>
          <div className="grow">
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-surface-alt">
              <div
                className={clsx("h-full rounded-full", STATUS_CLASS[task.status])}
                style={{ width: `${task.progress}%` }}
              />
            </div>
          </div>
          <div className="w-24 shrink-0 text-right text-xs font-semibold text-muted">
            {task.progress}% · {STATUS_LABEL[task.status]}
          </div>
        </div>
      ))}
    </div>
  );
}
