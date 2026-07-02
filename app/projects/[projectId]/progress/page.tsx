import { Card, SectionHeading } from "@/components/ui/Card";
import { KpiCard } from "@/components/ui/KpiCard";
import { Boxes, ClipboardCheck, TrendingUp } from "lucide-react";

export default function ProgressPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <KpiCard label="Avance general de obra" value="58%" icon={TrendingUp} tone="accent" />
        <KpiCard label="Tareas completadas" value="1 / 3" icon={ClipboardCheck} />
        <KpiCard
          label="Elementos BIM con avance"
          value="246 / 493"
          icon={Boxes}
        />
      </div>
      <Card>
        <SectionHeading title="Fuente de los datos" />
        <p className="text-sm text-muted">
          Calculado desde{" "}
          <span className="kg-chip">modules/linking/progress-aggregator.ts</span>{" "}
          y la vista SQL <span className="kg-chip">bim_element_progress</span>.
        </p>
      </Card>
    </div>
  );
}
