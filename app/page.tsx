import Link from "next/link";
import { Card, SectionHeading } from "@/components/ui/Card";
import { KpiCard } from "@/components/ui/KpiCard";
import {
  FolderKanban,
  Boxes,
  GanttChartSquare,
  TrendingUp,
  ArrowRight,
} from "lucide-react";

// TODO: reemplazar por lectura real desde Supabase (modules/shared + lib/supabase/server).
const MOCK_PROJECTS = [
  {
    id: "demo-project",
    name: "Edificio Corporativo Santiago",
    models: 1,
    tasks: 24,
    progress: 58,
  },
];

export default function Home() {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-background">
      <header className="flex h-14 shrink-0 items-center gap-2 border-b border-border bg-surface px-8">
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-on-primary">
          <FolderKanban size={16} strokeWidth={2} />
        </div>
        <span className="text-sm font-bold text-ink">
          BIM<span className="text-accent">Gantt</span>
        </span>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-8 py-10">
        <h1 className="mb-6 text-xl font-bold text-ink">Proyectos</h1>

        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <KpiCard label="Proyectos activos" value="1" icon={Boxes} />
          <KpiCard label="Tareas en curso" value="24" icon={GanttChartSquare} />
          <KpiCard
            label="Avance promedio"
            value="58%"
            icon={TrendingUp}
            tone="accent"
          />
        </div>

        <Card>
          <SectionHeading title="Proyectos" />
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-muted">
                <th className="pb-2 font-medium">Proyecto</th>
                <th className="pb-2 font-medium">Modelos</th>
                <th className="pb-2 font-medium">Tareas</th>
                <th className="pb-2 font-medium">Avance</th>
                <th className="pb-2 font-medium" />
              </tr>
            </thead>
            <tbody>
              {MOCK_PROJECTS.map((project) => (
                <tr key={project.id} className="border-t border-border">
                  <td className="py-3 font-medium text-ink">
                    <Link
                      href={`/projects/${project.id}/model`}
                      className="hover:text-primary"
                    >
                      {project.name}
                    </Link>
                  </td>
                  <td className="py-3 text-muted tabular-nums">{project.models}</td>
                  <td className="py-3 text-muted tabular-nums">{project.tasks}</td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-24 overflow-hidden rounded-full bg-surface-alt">
                        <div
                          className="h-full rounded-full bg-accent"
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                      <span className="text-xs tabular-nums text-muted">
                        {project.progress}%
                      </span>
                    </div>
                  </td>
                  <td className="py-3 text-right">
                    <Link
                      href={`/projects/${project.id}/model`}
                      className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary-hover"
                    >
                      Abrir <ArrowRight size={14} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </main>
    </div>
  );
}
