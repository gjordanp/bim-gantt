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

export type BimModelSummary = {
  id: string;
  originalFilename: string;
  status: string;
  storagePath: string;
  createdAt: string;
};

function rowToModel(
  row: Pick<
    Database["public"]["Tables"]["bim_models"]["Row"],
    "id" | "original_filename" | "status" | "storage_path" | "created_at"
  >,
): BimModelSummary {
  return {
    id: row.id,
    originalFilename: row.original_filename,
    status: row.status,
    storagePath: row.storage_path,
    createdAt: row.created_at,
  };
}

/** Todos los modelos BIM subidos a un proyecto, del más reciente al más viejo. */
export async function listModelsByProject(
  supabase: Client,
  projectId: string,
): Promise<BimModelSummary[]> {
  const { data, error } = await supabase
    .from("bim_models")
    .select("id, original_filename, status, storage_path, created_at")
    .eq("project_id", projectId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data.map(rowToModel);
}

/** Un modelo BIM por id, o null si no existe o no pertenece al proyecto. */
export async function getModelById(
  supabase: Client,
  projectId: string,
  modelId: string,
): Promise<BimModelSummary | null> {
  const { data, error } = await supabase
    .from("bim_models")
    .select("id, original_filename, status, storage_path, created_at")
    .eq("project_id", projectId)
    .eq("id", modelId)
    .maybeSingle();

  if (error) throw error;
  return data ? rowToModel(data) : null;
}

/** Cantidad de elementos por tipo IFC (IfcWall, IfcSlab, ...) de un modelo. */
export async function countElementsByType(
  supabase: Client,
  modelId: string,
): Promise<{ type: string; count: number }[]> {
  const { data, error } = await supabase
    .from("bim_elements")
    .select("ifc_type")
    .eq("model_id", modelId);

  if (error) throw error;

  const counts = new Map<string, number>();
  for (const row of data) {
    counts.set(row.ifc_type, (counts.get(row.ifc_type) ?? 0) + 1);
  }
  return Array.from(counts.entries()).map(([type, count]) => ({ type, count }));
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
