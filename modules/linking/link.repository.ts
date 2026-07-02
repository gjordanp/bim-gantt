import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";
import type { ElementTaskLink } from "@/modules/shared/types";

type Client = SupabaseClient<Database>;

export async function linkElementsToTask(
  supabase: Client,
  taskId: string,
  elementIds: string[],
  weight = 1,
): Promise<void> {
  const rows = elementIds.map((elementId) => ({
    element_id: elementId,
    task_id: taskId,
    weight,
  }));

  const { error } = await supabase
    .from("element_task_links")
    .upsert(rows, { onConflict: "element_id,task_id" });

  if (error) throw error;
}

export async function unlinkElementFromTask(
  supabase: Client,
  elementId: string,
  taskId: string,
): Promise<void> {
  const { error } = await supabase
    .from("element_task_links")
    .delete()
    .eq("element_id", elementId)
    .eq("task_id", taskId);

  if (error) throw error;
}

export async function listLinksByTask(
  supabase: Client,
  taskId: string,
): Promise<ElementTaskLink[]> {
  const { data, error } = await supabase
    .from("element_task_links")
    .select("*")
    .eq("task_id", taskId);

  if (error) throw error;

  return data.map((row) => ({
    id: row.id,
    elementId: row.element_id,
    taskId: row.task_id,
    weight: row.weight,
  }));
}
