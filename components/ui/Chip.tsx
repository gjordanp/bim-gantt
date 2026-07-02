import { clsx } from "clsx";

type ChipProps = {
  children: React.ReactNode;
  tone?: "default" | "primary";
  className?: string;
};

/** Botón pequeño estilo "pill", usado para acciones inline en tablas/listas. */
export function Chip({ children, tone = "default", className }: ChipProps) {
  return (
    <button
      type="button"
      className={clsx(
        "cursor-pointer rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
        tone === "primary"
          ? "bg-primary text-on-primary hover:bg-primary-hover"
          : "bg-surface-alt text-ink hover:bg-border",
        className,
      )}
    >
      {children}
    </button>
  );
}
