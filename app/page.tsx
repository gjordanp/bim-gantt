import Link from "next/link";
import { AppHeader } from "@/components/ui/AppHeader";
import { Card, SectionHeading } from "@/components/ui/Card";
import { Row } from "@/components/ui/Row";

// TODO: reemplazar por lectura real desde Supabase (modules/shared + lib/supabase/server).
const MOCK_PROJECTS = [
  { id: "demo-project", name: "Edificio Corporativo Santiago", models: 1, tasks: 24 },
];

export default function Home() {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-surface-alt">
      <AppHeader context="PROYECTOS" />
      <main className="mx-auto w-full max-w-6xl flex-1 px-8 py-10">
        <Card>
          <SectionHeading index="01" title="PROYECTOS ACTIVOS" />
          <div>
            {MOCK_PROJECTS.map((project) => (
              <Row
                key={project.id}
                label={
                  <Link
                    href={`/projects/${project.id}/model`}
                    className="hover:text-primary"
                  >
                    {project.name}
                  </Link>
                }
                description={`${project.models} modelo(s) BIM · ${project.tasks} tareas`}
                trailing={
                  <Link
                    href={`/projects/${project.id}/model`}
                    className="kg-chip text-primary"
                  >
                    Abrir →
                  </Link>
                }
              />
            ))}
          </div>
        </Card>
      </main>
    </div>
  );
}
