"use client";

import { useRouter, usePathname } from "next/navigation";
import type { BimModelSummary } from "@/modules/bim/element.repository";

const STATUS_LABEL: Record<string, string> = {
  uploaded: "subido",
  parsing: "procesando",
  ready: "listo",
  error: "error",
};

export function ModelSelector({
  models,
  selectedModelId,
}: {
  models: BimModelSummary[];
  selectedModelId: string | null;
}) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <select
      value={selectedModelId ?? ""}
      onChange={(e) => router.push(`${pathname}?modelId=${e.target.value}`)}
      className="cursor-pointer rounded-md border border-border bg-surface px-3 py-2 text-sm font-medium text-ink shadow-sm outline-none hover:bg-surface-alt"
    >
      {models.map((model) => (
        <option key={model.id} value={model.id}>
          {model.originalFilename} ({STATUS_LABEL[model.status] ?? model.status})
        </option>
      ))}
    </select>
  );
}
