import type { LucideIcon } from "lucide-react";
import { clsx } from "clsx";

type KpiCardProps = {
  label: string;
  value: string;
  icon: LucideIcon;
  tone?: "primary" | "accent";
};

export function KpiCard({ label, value, icon: Icon, tone = "primary" }: KpiCardProps) {
  return (
    <div className="flex items-center gap-4 rounded-lg border border-border bg-surface p-5">
      <div
        className={clsx(
          "flex h-11 w-11 shrink-0 items-center justify-center rounded-md",
          tone === "primary" ? "bg-primary/10 text-primary" : "bg-accent/10 text-accent",
        )}
      >
        <Icon size={20} strokeWidth={2} />
      </div>
      <div className="min-w-0">
        <div className="whitespace-nowrap text-xl font-bold tabular-nums text-ink">
          {value}
        </div>
        <div className="text-xs text-muted">{label}</div>
      </div>
    </div>
  );
}
