// Aplica un archivo .sql directo contra Postgres via el session pooler
// de Supabase (IPv4). Usar cuando el SQL Editor del dashboard no es
// práctico. Requiere en .env.local: NEXT_PUBLIC_SUPABASE_URL,
// SUPABASE_PASSWORD y POSTGRES_POOLER_HOST (Settings → Database →
// Connection string → Session pooler, sin el usuario/password).
//
// Uso: node --env-file=.env.local scripts/apply-schema.mjs supabase/schema.sql
import { readFileSync } from "node:fs";
import { Client } from "pg";

const password = process.env.SUPABASE_PASSWORD;
const poolerHost = process.env.POSTGRES_POOLER_HOST;
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const projectRef = new URL(supabaseUrl).hostname.split(".")[0];

const sqlPath = process.argv[2];
if (!sqlPath) {
  console.error("Uso: node scripts/apply-schema.mjs <archivo.sql>");
  process.exit(1);
}
const sql = readFileSync(sqlPath, "utf-8");

const client = new Client({
  host: poolerHost,
  port: 5432,
  user: `postgres.${projectRef}`,
  password,
  database: "postgres",
  ssl: { rejectUnauthorized: false },
  connectionTimeoutMillis: 10000,
});

try {
  await client.connect();
  console.log(`Connected to ${poolerHost}`);
  await client.query(sql);
  console.log("Schema applied successfully.");
} catch (err) {
  console.error("ERROR:", err.message);
  process.exit(1);
} finally {
  await client.end().catch(() => {});
}
