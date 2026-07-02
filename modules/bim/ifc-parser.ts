import * as WebIFC from "web-ifc";
import type { BimElement } from "@/modules/shared/types";

/**
 * Extrae los elementos (con su GlobalId, tipo IFC y propiedades básicas)
 * de un archivo .ifc usando web-ifc (WASM). Corre tanto en cliente como
 * en un runtime Node/Edge que soporte WASM.
 */
export async function parseIfcElements(
  fileBuffer: Uint8Array,
): Promise<Omit<BimElement, "id" | "modelId">[]> {
  const api = new WebIFC.IfcAPI();
  await api.Init();

  const modelId = api.OpenModel(fileBuffer);
  const elements: Omit<BimElement, "id" | "modelId">[] = [];

  const lines = api.GetAllLines(modelId);
  for (let i = 0; i < lines.size(); i++) {
    const expressId = lines.get(i);
    const line = api.GetLine(modelId, expressId);

    if (!line?.GlobalId?.value) continue;

    elements.push({
      ifcGlobalId: line.GlobalId.value,
      ifcType: api.GetNameFromTypeCode?.(line.type) ?? String(line.type),
      name: line.Name?.value ?? null,
      expressId,
      properties: extractProperties(line),
    });
  }

  api.CloseModel(modelId);
  return elements;
}

function extractProperties(line: Record<string, unknown>): Record<string, unknown> {
  const { GlobalId, Name, type, expressID, ...rest } = line as Record<
    string,
    { value?: unknown } | unknown
  >;
  void GlobalId;
  void Name;
  void type;
  void expressID;

  const properties: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(rest)) {
    if (value && typeof value === "object" && "value" in value) {
      properties[key] = (value as { value: unknown }).value;
    }
  }
  return properties;
}
