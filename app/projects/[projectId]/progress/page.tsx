import { Card, SectionHeading } from "@/components/ui/Card";
import { Row } from "@/components/ui/Row";

const SUMMARY = [
  { label: "Avance general de obra", value: "58%" },
  { label: "Tareas completadas", value: "1 / 3" },
  { label: "Elementos BIM con avance registrado", value: "246 / 493" },
];

export default function ProgressPage() {
  return (
    <Card>
      <SectionHeading index="07" title="AVANCE DE OBRA" />
      {SUMMARY.map((item) => (
        <Row key={item.label} label={item.label} trailing={<span className="font-bold text-primary">{item.value}</span>} />
      ))}
      <p className="mt-4 text-xs text-muted">
        Calculado desde{" "}
        <span className="kg-chip">modules/linking/progress-aggregator.ts</span>{" "}
        y la vista SQL <span className="kg-chip">bim_element_progress</span>.
      </p>
    </Card>
  );
}
