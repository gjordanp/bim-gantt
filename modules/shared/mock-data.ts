import type { ScheduleTask } from "./types";

// TODO: reemplazar por modules/schedule/task.repository.ts (listTasksByProject).
export const MOCK_TASKS: ScheduleTask[] = [
  {
    id: "1",
    projectId: "demo-project",
    parentId: null,
    name: "Fundaciones",
    startDate: "2026-01-05",
    endDate: "2026-02-10",
    progress: 100,
    status: "done",
    dependencies: [],
  },
  {
    id: "2",
    projectId: "demo-project",
    parentId: null,
    name: "Estructura nivel 1",
    startDate: "2026-02-11",
    endDate: "2026-03-20",
    progress: 65,
    status: "in_progress",
    dependencies: ["1"],
  },
  {
    id: "3",
    projectId: "demo-project",
    parentId: null,
    name: "Estructura nivel 2",
    startDate: "2026-03-21",
    endDate: "2026-04-25",
    progress: 0,
    status: "pending",
    dependencies: ["2"],
  },
];
