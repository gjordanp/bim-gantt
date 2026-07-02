type RowProps = {
  label: React.ReactNode;
  description?: React.ReactNode;
  trailing?: React.ReactNode;
};

/** Fila de tabla de datos: label + descripción + acción, separador sutil. */
export function Row({ label, description, trailing }: RowProps) {
  return (
    <div className="kg-row">
      <div className="min-w-40 shrink-0 font-semibold text-ink">{label}</div>
      {description && (
        <div className="grow text-sm text-muted">{description}</div>
      )}
      {trailing && <div className="shrink-0">{trailing}</div>}
    </div>
  );
}
