import { Card, SectionHeading } from "@/components/ui/Card";
import { FrappeGanttChart } from "@/components/gantt/FrappeGanttChart";
import { MOCK_TASKS } from "@/modules/shared/mock-data";

export default function SchedulePage() {
  return (
    <div className="px-8 py-8">
      <Card className="h-[calc(100dvh-9rem)]">
        <SectionHeading title="Carta Gantt" />
        <div className="h-[calc(100%-3rem)]">
          <FrappeGanttChart tasks={MOCK_TASKS} />
        </div>
      </Card>
    </div>
  );
}
