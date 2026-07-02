import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";
import type { ScheduleTask } from "@/modules/shared/types";

type Client = SupabaseClient<Database>;

export async function listTasksByProject(
  supabase: Client,
  projectId: string,
): Promise<ScheduleTask[]> {
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("project_id", projectId)
    .order("start_date", { ascending: true });

  if (error) throw error;

  return data.map(rowToTask);
}

export async function updateTaskProgress(
  supabase: Client,
  taskId: string,
  progress: number,
): Promise<void> {
  const status = progress >= 100 ? "done" : progress > 0 ? "in_progress" : "pending";

  const { error } = await supabase
    .from("tasks")
    .update({ progress, status })
    .eq("id", taskId);

  if (error) throw error;
}

function rowToTask(row: Database["public"]["Tables"]["tasks"]["Row"]): ScheduleTask {
  return {
    id: row.id,
    projectId: row.project_id,
    parentId: row.parent_id,
    name: row.name,
    startDate: row.start_date,
    endDate: row.end_date,
    progress: row.progress,
    status: row.status,
    dependencies: row.dependencies,
  };
}
