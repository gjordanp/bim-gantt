import { Card, SectionHeading } from "@/components/ui/Card";
import { Row } from "@/components/ui/Row";
import { BimViewer } from "@/components/viewer/BimViewer";

export default function ModelPage() {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <Card className="lg:col-span-2">
        <SectionHeading index="02" title="MODELO BIM (.IFC)" />
        <BimViewer />
      </Card>
      <Card>
        <SectionHeading index="03" title="ELEMENTOS DEL MODELO" />
        <Row label="IfcWall" description="248 elementos" />
        <Row label="IfcSlab" description="36 elementos" />
        <Row label="IfcColumn" description="112 elementos" />
        <Row label="IfcBeam" description="97 elementos" />
        <p className="mt-4 text-xs text-muted">
          Sube un archivo .ifc para reemplazar este listado con datos reales
          (ver <span className="kg-chip">modules/bim/ifc-parser.ts</span>).
        </p>
      </Card>
    </div>
  );
}
