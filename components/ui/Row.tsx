type RowProps = {
  label: React.ReactNode;
  description?: React.ReactNode;
  trailing?: React.ReactNode;
};

/** Fila con marcador rojo "—", patrón repetido en la guía de estilos KangoLab. */
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
