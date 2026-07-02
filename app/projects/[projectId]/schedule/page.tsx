import { Card, SectionHeading } from "@/components/ui/Card";
import { FrappeGanttChart } from "@/components/gantt/FrappeGanttChart";
import { createAdminClient } from "@/lib/supabase/admin";
import { listTasksByProject } from "@/modules/schedule/task.repository";

export default async function SchedulePage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const supabase = createAdminClient();
  const tasks = await listTasksByProject(supabase, projectId);

  return (
    <div className="px-8 py-8">
      <Card className="h-[calc(100dvh-9rem)]">
        <SectionHeading title="Carta Gantt" />
        <div className="h-[calc(100%-3rem)]">
          <FrappeGanttChart tasks={tasks} />
        </div>
      </Card>
    </div>
  );
}
