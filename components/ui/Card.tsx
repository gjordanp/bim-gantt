import { clsx } from "clsx";

type CardProps = {
  children: React.ReactNode;
  className?: string;
};

/** Tarjeta con borde superior rojo fino, eco de las secciones numeradas del PDF. */
export function Card({ children, className }: CardProps) {
  return (
    <div
      className={clsx(
        "rounded-md border border-border border-t-2 border-t-primary bg-surface p-5",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function SectionHeading({
  index,
  title,
}: {
  index: string;
  title: string;
}) {
  return (
    <div className="mb-3 border-b-2 border-primary pb-2">
      <h2 className="text-sm font-bold tracking-wide text-primary">
        {index} {title}
      </h2>
    </div>
  );
}
