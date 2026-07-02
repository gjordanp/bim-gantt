# BIM-Gantt

Plataforma web para vincular modelos BIM (`.ifc`) con una carta Gantt y hacer
seguimiento del avance de obra. Next.js (App Router) + TypeScript + Tailwind v4
+ Supabase (DB, Auth, Storage) + Vercel.

## Stack

- **Frontend:** Next.js 16, React 19, Tailwind CSS v4, TypeScript estricto.
- **BIM:** `web-ifc` (parsing WASM) + `web-ifc-three` (render sobre `three@0.159.0`,
  pinneado porque `web-ifc-three` no está mantenido y no soporta versiones más
  nuevas de `three`).
- **Datos:** Supabase (Postgres + RLS, Auth, Storage, Realtime).
- **Hosting:** Vercel.

## Estructura

```
app/                          rutas (App Router) — solo presentación
components/ui/                design system (tokens de la guía KangoLab)
components/viewer/            visor 3D IFC (three.js)
components/gantt/             carta Gantt
modules/bim/                  parser IFC + adaptador de render
modules/schedule/             entidades y agregación de la carta Gantt
modules/linking/              vínculo N:M elemento BIM ↔ tarea
modules/shared/                tipos de dominio compartidos
lib/supabase/                 clientes Supabase (browser/server/middleware)
supabase/schema.sql           esquema + políticas RLS
```

## Desarrollo local

```bash
npm install
cp .env.local.example .env.local   # completar con las credenciales del proyecto Supabase
npm run dev
```

Para habilitar la carga real de `.ifc`, los binarios `.wasm` de `web-ifc` ya
están copiados en `public/wasm/`.

## Base de datos

Aplicar `supabase/schema.sql` en el SQL editor del proyecto Supabase (crea
tablas, la vista `bim_element_progress` y las políticas RLS).

## Despliegue

Conectar el repositorio en Vercel y configurar las variables de entorno
(`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
`SUPABASE_SERVICE_ROLE_KEY`) en el dashboard del proyecto.
