import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";
import type { BimElement } from "@/modules/shared/types";

type Client = SupabaseClient<Database>;

export async function listElementsByModel(
  supabase: Client,
  modelId: string,
): Promise<BimElement[]> {
  const { data, error } = await supabase
    .from("bim_elements")
    .select("*")
    .eq("model_id", modelId);

  if (error) throw error;

  return data.map((row) => ({
    id: row.id,
    modelId: row.model_id,
    ifcGlobalId: row.ifc_global_id,
    ifcType: row.ifc_type,
    name: row.name,
    expressId: row.express_id,
    properties: row.properties,
  }));
}

export async function insertElements(
  supabase: Client,
  modelId: string,
  elements: Omit<BimElement, "id" | "modelId">[],
): Promise<void> {
  const rows = elements.map((el) => ({
    model_id: modelId,
    ifc_global_id: el.ifcGlobalId,
    ifc_type: el.ifcType,
    name: el.name,
    express_id: el.expressId,
    properties: el.properties,
  }));

  const { error } = await supabase.from("bim_elements").insert(rows);
  if (error) throw error;
}

/** Avance derivado (vista bim_element_progress) para cada elemento del modelo. */
export async function getElementProgress(
  supabase: Client,
  modelId: string,
): Promise<Record<string, number>> {
  const { data, error } = await supabase
    .from("bim_element_progress")
    .select("element_id, progress")
    .eq("model_id", modelId);

  if (error) throw error;

  return Object.fromEntries(data.map((row) => [row.element_id, row.progress]));
}
