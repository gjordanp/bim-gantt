import { clsx } from "clsx";

type CardProps = {
  children: React.ReactNode;
  className?: string;
};

export function Card({ children, className }: CardProps) {
  return (
    <div className={clsx("rounded-lg border border-border bg-surface p-5", className)}>
      {children}
    </div>
  );
}

export function SectionHeading({
  title,
  action,
}: {
  title: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-4 flex items-center justify-between border-b border-border pb-3">
      <h2 className="text-sm font-semibold text-ink">{title}</h2>
      {action}
    </div>
  );
}
