import { BimViewer } from "@/components/viewer/BimViewer";
import { ModelOverlays } from "@/components/viewer/ModelOverlays";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  countElementsByType,
  getModelById,
  listModelsByProject,
} from "@/modules/bim/element.repository";
import { getIfcSignedUrl } from "@/modules/bim/storage";
import { listTasksByProject } from "@/modules/schedule/task.repository";

export default async function ModelPage({
  params,
  searchParams,
}: {
  params: Promise<{ projectId: string }>;
  searchParams: Promise<{ modelId?: string }>;
}) {
  const { projectId } = await params;
  const { modelId } = await searchParams;
  const supabase = createAdminClient();

  const [models, tasks] = await Promise.all([
    listModelsByProject(supabase, projectId),
    listTasksByProject(supabase, projectId),
  ]);

  const model = modelId
    ? await getModelById(supabase, projectId, modelId)
    : (models.find((m) => m.status === "ready") ?? models[0] ?? null);

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
        models={models}
        selectedModelId={model?.id ?? null}
      />
      <ModelOverlays elements={elements} tasks={tasks} />
    </div>
  );
}
