import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";

export const IFC_STORAGE_BUCKET = "ifc-models";

/** URL firmada de corta duración para descargar un .ifc guardado en Storage. */
export async function getIfcSignedUrl(
  supabase: SupabaseClient<Database>,
  storagePath: string,
): Promise<string> {
  const { data, error } = await supabase.storage
    .from(IFC_STORAGE_BUCKET)
    .createSignedUrl(storagePath, 60 * 10);

  if (error) throw error;
  return data.signedUrl;
}
