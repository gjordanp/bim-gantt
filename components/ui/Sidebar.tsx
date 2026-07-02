"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";
import {
  Boxes,
  GanttChartSquare,
  Link2,
  TrendingUp,
  FolderKanban,
} from "lucide-react";

const NAV_ITEMS = [
  { slug: "model", label: "Modelo BIM", icon: Boxes },
  { slug: "schedule", label: "Carta Gantt", icon: GanttChartSquare },
  { slug: "linking", label: "Vinculación", icon: Link2 },
  { slug: "progress", label: "Avance", icon: TrendingUp },
] as const;

export function Sidebar({ projectId }: { projectId: string }) {
  const pathname = usePathname();

  return (
    <aside className="flex w-60 shrink-0 flex-col border-r border-border bg-surface">
      <div className="flex items-center gap-2 border-b border-border px-5 py-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-on-primary">
          <FolderKanban size={18} strokeWidth={2} />
        </div>
        <div>
          <div className="text-sm font-bold leading-tight text-ink">
            BIM<span className="text-accent">Gantt</span>
          </div>
          <div className="text-[11px] text-muted">Avance de obra</div>
        </div>
      </div>

      <nav className="flex flex-col gap-1 p-3">
        {NAV_ITEMS.map(({ slug, label, icon: Icon }) => {
          const href = `/projects/${projectId}/${slug}`;
          const active = pathname === href;
          return (
            <Link
              key={slug}
              href={href}
              className={clsx(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-primary text-on-primary"
                  : "text-muted hover:bg-surface-alt hover:text-ink",
              )}
            >
              <Icon size={17} strokeWidth={2} />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
