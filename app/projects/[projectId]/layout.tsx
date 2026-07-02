import { AppHeader } from "@/components/ui/AppHeader";
import { ProjectNav } from "@/components/ui/ProjectNav";

export default async function ProjectLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;

  return (
    <div className="flex min-h-full flex-1 flex-col bg-surface-alt">
      <AppHeader context="EDIFICIO CORPORATIVO SANTIAGO" />
      <ProjectNav projectId={projectId} />
      <main className="mx-auto w-full max-w-6xl flex-1 px-8 py-8">
        {children}
      </main>
    </div>
  );
}
