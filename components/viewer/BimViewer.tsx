"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Upload } from "lucide-react";
import { ThatOpenViewer, type SelectedElement } from "@/modules/bim/thatopen-viewer";
import { uploadIfcModel } from "@/app/actions/bim-models";
import { ModelSelector } from "@/components/viewer/ModelSelector";
import type { BimModelSummary } from "@/modules/bim/element.repository";

type LoadStatus = "idle" | "loading" | "saving" | "ready" | "error";

type BimViewerProps = {
  projectId: string;
  initialModelUrl?: string | null;
  initialModelName?: string;
  models?: BimModelSummary[];
  selectedModelId?: string | null;
  onSelectionChange?: (elements: SelectedElement[]) => void;
};

/**
 * Visor 3D a pantalla completa sobre @thatopen/components: carga de IFC,
 * hover animado (Hoverer) y selección con contorno (Highlighter + Outliner).
 */
export function BimViewer({
  projectId,
  initialModelUrl,
  initialModelName,
  models = [],
  selectedModelId = null,
  onSelectionChange,
}: BimViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<ThatOpenViewer | null>(null);
  const loadedUrlRef = useRef<string | null | undefined>(undefined);
  const router = useRouter();
  const pathname = usePathname();

  const [status, setStatus] = useState<LoadStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  async function loadModelFromUrl(
    viewer: ThatOpenViewer,
    url: string,
    name: string | undefined,
  ) {
    setStatus("loading");
    setErrorMessage(null);
    setFileName(name ?? "modelo guardado");
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`No se pudo descargar el modelo (${response.status}).`);
      const buffer = new Uint8Array(await response.arrayBuffer());
      await viewer.loadIfc(buffer, name ?? "modelo.ifc");
      setStatus("ready");
    } catch (err) {
      setStatus("error");
      setErrorMessage(
        err instanceof Error ? err.message : "No se pudo cargar el modelo guardado.",
      );
    }
  }

  // Crea el visor una sola vez y carga el modelo inicial (si corresponde).
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let disposed = false;
    let unsubscribe: (() => void) | undefined;

    ThatOpenViewer.create(container).then(async (viewer) => {
      if (disposed) {
        viewer.dispose();
        return;
      }
      viewerRef.current = viewer;
      if (onSelectionChange) {
        unsubscribe = viewer.onSelectionChange(onSelectionChange);
      }

      if (initialModelUrl) {
        loadedUrlRef.current = initialModelUrl;
        await loadModelFromUrl(viewer, initialModelUrl, initialModelName);
      }
    });

    return () => {
      disposed = true;
      unsubscribe?.();
      viewerRef.current?.dispose();
      viewerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Recarga el modelo cuando el usuario elige otro en el selector (el
  // efecto de montaje ya cubrió la carga inicial, por eso el guard).
  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer || loadedUrlRef.current === initialModelUrl) return;
    loadedUrlRef.current = initialModelUrl;

    if (initialModelUrl) {
      loadModelFromUrl(viewer, initialModelUrl, initialModelName);
    } else {
      viewer.clearModels();
      setStatus("idle");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialModelUrl]);

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file || !viewerRef.current) return;

    setStatus("loading");
    setErrorMessage(null);
    setFileName(file.name);

    try {
      const buffer = new Uint8Array(await file.arrayBuffer());
      await viewerRef.current.loadIfc(buffer, file.name);

      setStatus("saving");
      const uploadForm = new FormData();
      uploadForm.set("file", file);
      const { modelId } = await uploadIfcModel(projectId, uploadForm);

      setStatus("ready");
      router.push(`${pathname}?modelId=${modelId}`);
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "No se pudo cargar el archivo .ifc");
    } finally {
      event.target.value = "";
    }
  }

  return (
    <div className="relative h-full w-full">
      <div ref={containerRef} className="h-full w-full" />

      <div className="pointer-events-none absolute inset-x-4 top-4 flex items-center gap-3">
        {models.length > 0 && (
          <div className="pointer-events-auto">
            <ModelSelector models={models} selectedModelId={selectedModelId} />
          </div>
        )}
        <label className="pointer-events-auto flex cursor-pointer items-center gap-2 rounded-md border border-border bg-surface px-3 py-2 text-sm font-medium text-ink shadow-sm hover:bg-surface-alt">
          <Upload size={15} strokeWidth={2} />
          Subir archivo .ifc
          <input
            type="file"
            accept=".ifc"
            className="hidden"
            onChange={handleFileChange}
          />
        </label>
        {status === "loading" && (
          <span className="pointer-events-auto rounded-md bg-surface px-3 py-2 text-xs text-muted shadow-sm">
            Cargando {fileName}…
          </span>
        )}
        {status === "saving" && (
          <span className="pointer-events-auto rounded-md bg-surface px-3 py-2 text-xs text-muted shadow-sm">
            Guardando en Supabase…
          </span>
        )}
        {status === "ready" && (
          <span className="pointer-events-auto rounded-md bg-surface px-3 py-2 text-xs text-status-done shadow-sm">
            {fileName} cargado
          </span>
        )}
        {status === "error" && (
          <span className="pointer-events-auto rounded-md bg-surface px-3 py-2 text-xs text-status-blocked shadow-sm">
            {errorMessage}
          </span>
        )}
      </div>
    </div>
  );
}
