"use server";

import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";

export async function createProject(formData: FormData): Promise<void> {
  const name = formData.get("name");
  if (typeof name !== "string" || name.trim().length === 0) {
    throw new Error("El nombre del proyecto es obligatorio.");
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("projects")
    .insert({ name: name.trim() })
    .select("id")
    .single();

  if (error) throw error;

  redirect(`/projects/${data.id}/model`);
}
