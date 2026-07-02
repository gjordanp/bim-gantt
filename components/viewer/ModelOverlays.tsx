"use client";

import { useState } from "react";
import { clsx } from "clsx";
import { Boxes, GanttChartSquare } from "lucide-react";
import { FloatingPanel } from "@/components/ui/FloatingPanel";
import { FrappeGanttChart } from "@/components/gantt/FrappeGanttChart";
import type { ScheduleTask } from "@/modules/shared/types";

type ModelOverlaysProps = {
  elements: { type: string; count: number }[];
  tasks: ScheduleTask[];
};

/** Paneles flotantes sobre el visor 3D: elementos del modelo y carta Gantt. */
export function ModelOverlays({ elements, tasks }: ModelOverlaysProps) {
  const [showElements, setShowElements] = useState(true);
  const [showGantt, setShowGantt] = useState(true);

  return (
    <div className="pointer-events-none absolute inset-0 flex flex-col justify-between p-4">
      <div className="flex items-start justify-end gap-3">
        <div className="pointer-events-auto flex gap-2">
          <ToggleButton
            active={showElements}
            icon={Boxes}
            label="Elementos"
            onClick={() => setShowElements((v) => !v)}
          />
          <ToggleButton
            active={showGantt}
            icon={GanttChartSquare}
            label="Carta Gantt"
            onClick={() => setShowGantt((v) => !v)}
          />
        </div>
      </div>

      <div className="flex items-end justify-between gap-4">
        {showElements ? (
          <FloatingPanel
            title="Elementos del modelo"
            icon={Boxes}
            className="pointer-events-auto w-72"
            onClose={() => setShowElements(false)}
          >
            <div>
              {elements.map((el) => (
                <div key={el.type} className="kg-row">
                  <span className="font-medium text-ink">{el.type}</span>
                  <span className="ml-auto text-sm text-muted">
                    {el.count} elementos
                  </span>
                </div>
              ))}
            </div>
          </FloatingPanel>
        ) : (
          <span />
        )}

        {showGantt && (
          <FloatingPanel
            title="Carta Gantt"
            icon={GanttChartSquare}
            className="pointer-events-auto h-72 w-[640px]"
            onClose={() => setShowGantt(false)}
          >
            <FrappeGanttChart tasks={tasks} viewMode="Week" />
          </FloatingPanel>
        )}
      </div>
    </div>
  );
}

function ToggleButton({
  active,
  icon: Icon,
  label,
  onClick,
}: {
  active: boolean;
  icon: typeof Boxes;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        "flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium shadow-sm transition-colors",
        active
          ? "border-primary bg-primary text-on-primary"
          : "border-border bg-surface text-ink hover:bg-surface-alt",
      )}
    >
      <Icon size={15} strokeWidth={2} />
      {label}
    </button>
  );
}
