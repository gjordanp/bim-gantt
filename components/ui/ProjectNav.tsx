"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";

const TABS = [
  { slug: "model", label: "Modelo BIM" },
  { slug: "schedule", label: "Carta Gantt" },
  { slug: "linking", label: "Vinculación" },
  { slug: "progress", label: "Avance" },
] as const;

export function ProjectNav({ projectId }: { projectId: string }) {
  const pathname = usePathname();

  return (
    <nav className="flex gap-1 border-b border-border px-8">
      {TABS.map((tab) => {
        const href = `/projects/${projectId}/${tab.slug}`;
        const active = pathname === href;
        return (
          <Link
            key={tab.slug}
            href={href}
            className={clsx(
              "border-b-2 px-3 py-3 text-sm font-semibold transition-colors",
              active
                ? "border-primary text-primary"
                : "border-transparent text-muted hover:text-ink",
            )}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
