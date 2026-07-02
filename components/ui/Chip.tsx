import { clsx } from "clsx";

type ChipProps = {
  children: React.ReactNode;
  tone?: "default" | "primary";
  className?: string;
};

export function Chip({ children, tone = "default", className }: ChipProps) {
  return (
    <span
      className={clsx(
        "kg-chip",
        tone === "primary" && "text-primary",
        className,
      )}
    >
      {children}
    </span>
  );
}
