"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { parseIfcElements } from "@/modules/bim/ifc-parser";
import { insertElements } from "@/modules/bim/element.repository";

const STORAGE_BUCKET = "ifc-models";

async function ensureBucketExists(
  supabase: ReturnType<typeof createAdminClient>,
): Promise<void> {
  const { data: buckets } = await supabase.storage.listBuckets();
  if (buckets?.some((b) => b.name === STORAGE_BUCKET)) return;
  await supabase.storage.createBucket(STORAGE_BUCKET, { public: false });
}

export type UploadIfcResult = {
  modelId: string;
  elementCount: number;
};

/**
 * Sube un .ifc a Supabase Storage, crea la fila en bim_models, extrae
 * los elementos con web-ifc y los persiste en bim_elements.
 */
export async function uploadIfcModel(
  projectId: string,
  formData: FormData,
): Promise<UploadIfcResult> {
  const file = formData.get("file");
  if (!(file instanceof File)) {
    throw new Error("No se recibió ningún archivo.");
  }

  const supabase = createAdminClient();
  await ensureBucketExists(supabase);

  const buffer = new Uint8Array(await file.arrayBuffer());
  const storagePath = `${projectId}/${Date.now()}-${file.name}`;

  const { error: uploadError } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(storagePath, buffer, { contentType: "application/octet-stream" });
  if (uploadError) throw uploadError;

  const { data: model, error: modelError } = await supabase
    .from("bim_models")
    .insert({
      project_id: projectId,
      storage_path: storagePath,
      original_filename: file.name,
      status: "parsing",
    })
    .select("id")
    .single();
  if (modelError) throw modelError;

  try {
    const elements = await parseIfcElements(buffer);
    await insertElements(supabase, model.id, elements);

    await supabase.from("bim_models").update({ status: "ready" }).eq("id", model.id);

    revalidatePath(`/projects/${projectId}/model`);
    return { modelId: model.id, elementCount: elements.length };
  } catch (err) {
    await supabase.from("bim_models").update({ status: "error" }).eq("id", model.id);
    throw err;
  }
}
