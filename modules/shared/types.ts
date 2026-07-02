export type UUID = string;

export type BimModelStatus = "uploaded" | "parsing" | "ready" | "error";

export type TaskStatus = "pending" | "in_progress" | "done" | "blocked";

export type Project = {
  id: UUID;
  orgId: UUID;
  name: string;
  createdAt: string;
};

export type BimModel = {
  id: UUID;
  projectId: UUID;
  storagePath: string;
  originalFilename: string;
  status: BimModelStatus;
  version: number;
  createdAt: string;
};

export type BimElement = {
  id: UUID;
  modelId: UUID;
  ifcGlobalId: string;
  ifcType: string;
  name: string | null;
  expressId: number;
  properties: Record<string, unknown>;
  /** Avance derivado de las tareas vinculadas, 0-100. No se persiste. */
  progress?: number;
};

export type ScheduleTask = {
  id: UUID;
  projectId: UUID;
  parentId: UUID | null;
  name: string;
  startDate: string;
  endDate: string;
  progress: number;
  status: TaskStatus;
  dependencies: UUID[];
};

export type ElementTaskLink = {
  id: UUID;
  elementId: UUID;
  taskId: UUID;
  /** Fracción del elemento que representa esta tarea (0-1). Por defecto 1. */
  weight: number;
};
