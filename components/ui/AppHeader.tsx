type AppHeaderProps = {
  context?: string;
};

/** Header inspirado en la portada del PDF: marca, subtítulo itálico y línea roja. */
export function AppHeader({ context }: AppHeaderProps) {
  return (
    <header className="border-b border-border bg-surface px-8 py-5">
      <div className="mx-auto flex max-w-6xl items-start justify-between">
        <div>
          <div className="text-xl font-bold tracking-tight text-ink">
            BIM<span className="text-primary">Gantt</span>
          </div>
          <p className="text-xs italic text-muted">
            Avance de obra vinculado al modelo
          </p>
        </div>
        {context && (
          <div className="mt-1 text-xs font-semibold tracking-wide text-primary">
            {context}
          </div>
        )}
      </div>
      <div className="mx-auto mt-4 h-[3px] max-w-6xl bg-primary" />
    </header>
  );
}
