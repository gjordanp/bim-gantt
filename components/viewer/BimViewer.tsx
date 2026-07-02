"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Upload } from "lucide-react";
import { ThatOpenViewer, type SelectedElement } from "@/modules/bim/thatopen-viewer";
import { uploadIfcModel } from "@/app/actions/bim-models";

type LoadStatus = "idle" | "loading" | "saving" | "ready" | "error";

type BimViewerProps = {
  projectId: string;
  onSelectionChange?: (elements: SelectedElement[]) => void;
};

/**
 * Visor 3D a pantalla completa sobre @thatopen/components: carga de IFC,
 * hover animado (Hoverer) y selección con contorno (Highlighter + Outliner).
 */
export function BimViewer({ projectId, onSelectionChange }: BimViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<ThatOpenViewer | null>(null);
  const router = useRouter();

  const [status, setStatus] = useState<LoadStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let disposed = false;
    let unsubscribe: (() => void) | undefined;

    ThatOpenViewer.create(container).then((viewer) => {
      if (disposed) {
        viewer.dispose();
        return;
      }
      viewerRef.current = viewer;
      if (onSelectionChange) {
        unsubscribe = viewer.onSelectionChange(onSelectionChange);
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
      await uploadIfcModel(projectId, uploadForm);

      setStatus("ready");
      router.refresh();
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
