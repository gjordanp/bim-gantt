"use client";

import { useRef, useState, useTransition } from "react";
import { Plus } from "lucide-react";
import { createProject } from "@/app/actions/projects";

export function CreateProjectForm() {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      try {
        await createProject(formData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "No se pudo crear el proyecto.");
      }
    });
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex cursor-pointer items-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-medium text-on-primary hover:bg-primary-hover"
      >
        <Plus size={15} strokeWidth={2} />
        Nuevo proyecto
      </button>
    );
  }

  return (
    <form
      ref={formRef}
      action={handleSubmit}
      className="flex items-center gap-2"
    >
      <input
        name="name"
        autoFocus
        required
        placeholder="Nombre del proyecto"
        className="rounded-md border border-border bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-primary"
      />
      <button
        type="submit"
        disabled={pending}
        className="cursor-pointer rounded-md bg-primary px-3 py-2 text-sm font-medium text-on-primary hover:bg-primary-hover disabled:opacity-50"
      >
        {pending ? "Creando…" : "Crear"}
      </button>
      <button
        type="button"
        onClick={() => setOpen(false)}
        className="cursor-pointer rounded-md px-3 py-2 text-sm text-muted hover:bg-surface-alt"
      >
        Cancelar
      </button>
      {error && <span className="text-xs text-status-blocked">{error}</span>}
    </form>
  );
}
