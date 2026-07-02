import { Card, SectionHeading } from "@/components/ui/Card";
import { Row } from "@/components/ui/Row";
import { Chip } from "@/components/ui/Chip";

export default function LinkingPage() {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <Card>
        <SectionHeading title="Elementos sin vincular" />
        <Row
          label="IfcColumn #482"
          description="Nivel 2, eje C-4"
          trailing={<Chip tone="primary">Vincular</Chip>}
        />
        <Row
          label="IfcBeam #501"
          description="Nivel 2, eje C-5"
          trailing={<Chip tone="primary">Vincular</Chip>}
        />
      </Card>
      <Card>
        <SectionHeading title="Vínculos activos" />
        <Row
          label="Estructura nivel 1"
          description="86 elementos vinculados"
          trailing={<Chip>Ver</Chip>}
        />
        <p className="mt-4 text-xs text-muted">
          La vinculación se guarda en{" "}
          <span className="kg-chip">element_task_links</span> (ver{" "}
          <span className="kg-chip">modules/linking/link.repository.ts</span>).
        </p>
      </Card>
    </div>
  );
}
