import { BimViewer } from "@/components/viewer/BimViewer";
import { ModelOverlays } from "@/components/viewer/ModelOverlays";
import { createAdminClient } from "@/lib/supabase/admin";
import { countElementsByType, getLatestModel } from "@/modules/bim/element.repository";
import { listTasksByProject } from "@/modules/schedule/task.repository";

export default async function ModelPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const supabase = createAdminClient();

  const [model, tasks] = await Promise.all([
    getLatestModel(supabase, projectId),
    listTasksByProject(supabase, projectId),
  ]);

  const elements = model ? await countElementsByType(supabase, model.id) : [];

  return (
    <div className="relative h-full w-full">
      <BimViewer projectId={projectId} />
      <ModelOverlays elements={elements} tasks={tasks} />
    </div>
  );
}
