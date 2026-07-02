import { Sidebar } from "@/components/ui/Sidebar";
import { TopBar } from "@/components/ui/TopBar";

export default async function ProjectLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;

  return (
    <div className="flex min-h-full flex-1">
      <Sidebar projectId={projectId} />
      <div className="flex min-h-full flex-1 flex-col bg-background">
        <TopBar projectName="Edificio Corporativo Santiago" />
        <main className="flex-1 px-8 py-8">{children}</main>
      </div>
    </div>
  );
}
