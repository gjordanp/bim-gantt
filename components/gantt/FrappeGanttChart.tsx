"use client";

import { useEffect, useRef } from "react";
import Gantt from "frappe-gantt";
// Copia local: frappe-gantt no expone dist/frappe-gantt.css como subpath
// importable en su package.json "exports", así que un import profundo falla.
import "./frappe-gantt.css";
import type { ScheduleTask } from "@/modules/shared/types";

type ViewMode = "Day" | "Week" | "Month";

export function FrappeGanttChart({
  tasks,
  viewMode = "Week",
}: {
  tasks: ScheduleTask[];
  viewMode?: ViewMode;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || tasks.length === 0) return;

    const ganttTasks = tasks.map((task) => ({
      id: task.id,
      name: task.name,
      start: task.startDate,
      end: task.endDate,
      progress: task.progress,
      dependencies: task.dependencies.join(","),
      custom_class: `gantt-status-${task.status}`,
    }));

    const chart = new Gantt(container, ganttTasks, {
      view_mode: viewMode,
      date_format: "YYYY-MM-DD",
      readonly: true,
    });

    return () => {
      container.innerHTML = "";
      void chart;
    };
  }, [tasks, viewMode]);

  if (tasks.length === 0) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-muted">
        Sin tareas para mostrar.
      </div>
    );
  }

  return <div ref={containerRef} className="frappe-gantt-container" />;
}
