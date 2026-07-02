import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export function TopBar({ projectName }: { projectName: string }) {
  return (
    <header className="flex h-14 shrink-0 items-center gap-3 border-b border-border bg-surface px-6">
      <Link
        href="/"
        className="flex items-center gap-1 text-sm text-muted hover:text-ink"
      >
        <ChevronLeft size={16} />
        Proyectos
      </Link>
      <span className="text-border">/</span>
      <span className="text-sm font-semibold text-ink">{projectName}</span>
    </header>
  );
}
