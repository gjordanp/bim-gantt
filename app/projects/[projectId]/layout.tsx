import { notFound } from "next/navigation";
import { Sidebar } from "@/components/ui/Sidebar";
import { TopBar } from "@/components/ui/TopBar";
import { createAdminClient } from "@/lib/supabase/admin";

export default async function ProjectLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;

  const supabase = createAdminClient();
  const { data: project } = await supabase
    .from("projects")
    .select("name")
    .eq("id", projectId)
    .single();

  if (!project) notFound();

  return (
    <div className="flex min-h-full flex-1">
      <Sidebar projectId={projectId} />
      <div className="flex h-full min-h-full flex-1 flex-col overflow-hidden bg-background">
        <TopBar projectName={project.name} />
        <main className="min-h-0 flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
