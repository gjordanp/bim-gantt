import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

/**
 * Cliente Supabase con la Secret Key: bypassa RLS. Solo para uso en
 * Server Components / Route Handlers / Server Actions — nunca importar
 * desde un Client Component. Mientras no exista login real, este es el
 * único cliente con acceso de lectura/escritura a los datos (ver
 * decisión en supabase/schema.sql: las policies quedan listas para
 * cuando exista auth.uid()).
 */
export function createAdminClient() {
  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!,
    { auth: { persistSession: false } },
  );
}
