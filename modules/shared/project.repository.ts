import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";

type Client = SupabaseClient<Database>;

export type ProjectSummary = {
  id: string;
  name: string;
  createdAt: string;
  modelCount: number;
  taskCount: number;
  avgProgress: number;
};

export async function listProjectSummaries(supabase: Client): Promise<ProjectSummary[]> {
  const { data: projects, error } = await supabase
    .from("projects")
    .select("id, name, created_at")
    .order("created_at", { ascending: false });
  if (error) throw error;
  if (projects.length === 0) return [];

  const projectIds = projects.map((p) => p.id);

  const [{ data: models }, { data: tasks }] = await Promise.all([
    supabase.from("bim_models").select("id, project_id").in("project_id", projectIds),
    supabase.from("tasks").select("project_id, progress").in("project_id", projectIds),
  ]);

  return projects.map((project) => {
    const projectTasks = (tasks ?? []).filter((t) => t.project_id === project.id);
    const avgProgress =
      projectTasks.length === 0
        ? 0
        : Math.round(
            projectTasks.reduce((sum, t) => sum + t.progress, 0) / projectTasks.length,
          );

    return {
      id: project.id,
      name: project.name,
      createdAt: project.created_at,
      modelCount: (models ?? []).filter((m) => m.project_id === project.id).length,
      taskCount: projectTasks.length,
      avgProgress,
    };
  });
}
