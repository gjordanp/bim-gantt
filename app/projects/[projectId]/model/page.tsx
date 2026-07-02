import { BimViewer } from "@/components/viewer/BimViewer";
import { ModelOverlays } from "@/components/viewer/ModelOverlays";
import { createAdminClient } from "@/lib/supabase/admin";
import { countElementsByType, getLatestModel } from "@/modules/bim/element.repository";
import { getIfcSignedUrl } from "@/modules/bim/storage";
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

  const [elements, initialModelUrl] = await Promise.all([
    model ? countElementsByType(supabase, model.id) : Promise.resolve([]),
    model && model.status === "ready"
      ? getIfcSignedUrl(supabase, model.storagePath)
      : Promise.resolve(null),
  ]);

  return (
    <div className="relative h-full w-full">
      <BimViewer
        projectId={projectId}
        initialModelUrl={initialModelUrl}
        initialModelName={model?.originalFilename}
      />
      <ModelOverlays elements={elements} tasks={tasks} />
    </div>
  );
}
