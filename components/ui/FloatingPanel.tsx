"use client";

import { useState } from "react";
import { clsx } from "clsx";
import { ChevronDown, ChevronUp, X, type LucideIcon } from "lucide-react";

type FloatingPanelProps = {
  title: string;
  icon: LucideIcon;
  children: React.ReactNode;
  className?: string;
  defaultCollapsed?: boolean;
  onClose?: () => void;
};

/** Tarjeta flotante sobre el visor 3D: colapsable, con header fijo y contenido con scroll. */
export function FloatingPanel({
  title,
  icon: Icon,
  children,
  className,
  defaultCollapsed = false,
  onClose,
}: FloatingPanelProps) {
  const [collapsed, setCollapsed] = useState(defaultCollapsed);

  return (
    <div
      className={clsx(
        "pointer-events-auto flex flex-col overflow-hidden rounded-lg border border-border bg-surface shadow-lg",
        className,
      )}
    >
      <div className="flex shrink-0 items-center justify-between gap-2 border-b border-border bg-surface-alt px-3 py-2">
        <div className="flex items-center gap-2 text-sm font-semibold text-ink">
          <Icon size={15} strokeWidth={2} />
          {title}
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setCollapsed((v) => !v)}
            className="cursor-pointer rounded p-1 text-muted hover:bg-border hover:text-ink"
            aria-label={collapsed ? "Expandir" : "Colapsar"}
          >
            {collapsed ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
          </button>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer rounded p-1 text-muted hover:bg-border hover:text-ink"
              aria-label="Cerrar"
            >
              <X size={15} />
            </button>
          )}
        </div>
      </div>
      {!collapsed && <div className="min-h-0 flex-1 overflow-auto p-3">{children}</div>}
    </div>
  );
}
