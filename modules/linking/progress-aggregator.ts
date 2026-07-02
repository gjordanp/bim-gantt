import type { BimElement, ElementTaskLink, ScheduleTask } from "@/modules/shared/types";

/**
 * Calcula el avance de cada elemento BIM a partir de las tareas vinculadas.
 * Espejo en memoria de la vista SQL `bim_element_progress`, útil para
 * previsualizar en el cliente antes de guardar (ej. al editar un link).
 */
export function aggregateElementProgress(
  elements: BimElement[],
  links: ElementTaskLink[],
  tasks: ScheduleTask[],
): Map<string, number> {
  const taskById = new Map(tasks.map((t) => [t.id, t]));
  const linksByElement = new Map<string, ElementTaskLink[]>();

  for (const link of links) {
    const list = linksByElement.get(link.elementId) ?? [];
    list.push(link);
    linksByElement.set(link.elementId, list);
  }

  const result = new Map<string, number>();

  for (const element of elements) {
    const elementLinks = linksByElement.get(element.id) ?? [];
    if (elementLinks.length === 0) {
      result.set(element.id, 0);
      continue;
    }

    let weightedSum = 0;
    let totalWeight = 0;
    for (const link of elementLinks) {
      const task = taskById.get(link.taskId);
      if (!task) continue;
      weightedSum += task.progress * link.weight;
      totalWeight += link.weight;
    }

    result.set(element.id, totalWeight === 0 ? 0 : weightedSum / totalWeight);
  }

  return result;
}
