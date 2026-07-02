-- Esquema inicial: plataforma BIM (.ifc) + Gantt de avance de obra.
-- Aplicar con `supabase db push` o pegando en el SQL editor del proyecto.

create extension if not exists "pgcrypto";

-- ── Tipos ────────────────────────────────────────────────────────────────

create type bim_model_status as enum ('uploaded', 'parsing', 'ready', 'error');
create type task_status as enum ('pending', 'in_progress', 'done', 'blocked');
create type project_role as enum ('owner', 'editor', 'viewer');

-- ── Proyectos y membresía ───────────────────────────────────────────────

create table projects (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null,
  name text not null,
  created_at timestamptz not null default now()
);

create table project_members (
  project_id uuid not null references projects (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  role project_role not null default 'viewer',
  primary key (project_id, user_id)
);

-- ── Modelos BIM ──────────────────────────────────────────────────────────

create table bim_models (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects (id) on delete cascade,
  storage_path text not null,
  original_filename text not null,
  status bim_model_status not null default 'uploaded',
  version integer not null default 1,
  created_at timestamptz not null default now()
);

create table bim_elements (
  id uuid primary key default gen_random_uuid(),
  model_id uuid not null references bim_models (id) on delete cascade,
  ifc_global_id text not null,
  ifc_type text not null,
  name text,
  express_id integer not null,
  properties jsonb not null default '{}'::jsonb,
  unique (model_id, ifc_global_id)
);

create index bim_elements_model_id_idx on bim_elements (model_id);
create index bim_elements_ifc_type_idx on bim_elements (ifc_type);

-- ── Carta Gantt ──────────────────────────────────────────────────────────

create table tasks (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects (id) on delete cascade,
  parent_id uuid references tasks (id) on delete cascade,
  name text not null,
  start_date date not null,
  end_date date not null,
  progress numeric not null default 0 check (progress between 0 and 100),
  status task_status not null default 'pending',
  dependencies uuid[] not null default '{}',
  constraint tasks_valid_range check (end_date >= start_date)
);

create index tasks_project_id_idx on tasks (project_id);
create index tasks_parent_id_idx on tasks (parent_id);

-- ── Vínculo elemento BIM ↔ tarea (N:M) ──────────────────────────────────

create table element_task_links (
  id uuid primary key default gen_random_uuid(),
  element_id uuid not null references bim_elements (id) on delete cascade,
  task_id uuid not null references tasks (id) on delete cascade,
  weight numeric not null default 1 check (weight > 0 and weight <= 1),
  unique (element_id, task_id)
);

create index element_task_links_element_id_idx on element_task_links (element_id);
create index element_task_links_task_id_idx on element_task_links (task_id);

-- ── Avance derivado por elemento ────────────────────────────────────────
-- Promedio ponderado del progreso de las tareas vinculadas a cada elemento.
-- Se consulta bajo demanda; no se persiste para evitar desincronización.

create or replace view bim_element_progress as
select
  e.id as element_id,
  e.model_id,
  coalesce(
    sum(t.progress * l.weight) / nullif(sum(l.weight), 0),
    0
  ) as progress
from bim_elements e
left join element_task_links l on l.element_id = e.id
left join tasks t on t.id = l.task_id
group by e.id, e.model_id;

-- ── Row Level Security ───────────────────────────────────────────────────

alter table projects enable row level security;
alter table project_members enable row level security;
alter table bim_models enable row level security;
alter table bim_elements enable row level security;
alter table tasks enable row level security;
alter table element_task_links enable row level security;

create function is_project_member(p_project_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from project_members
    where project_id = p_project_id and user_id = auth.uid()
  );
$$;

create policy "members can read their projects"
  on projects for select
  using (is_project_member(id));

create policy "members can read their membership rows"
  on project_members for select
  using (user_id = auth.uid());

create policy "members can read models of their projects"
  on bim_models for select
  using (is_project_member(project_id));

create policy "editors can write models"
  on bim_models for insert
  with check (is_project_member(project_id));

create policy "members can read elements of their models"
  on bim_elements for select
  using (
    exists (
      select 1 from bim_models m
      where m.id = model_id and is_project_member(m.project_id)
    )
  );

create policy "members can read tasks of their projects"
  on tasks for select
  using (is_project_member(project_id));

create policy "editors can write tasks"
  on tasks for insert
  with check (is_project_member(project_id));

create policy "editors can update tasks"
  on tasks for update
  using (is_project_member(project_id));

create policy "members can read links of their projects"
  on element_task_links for select
  using (
    exists (
      select 1 from tasks t
      where t.id = task_id and is_project_member(t.project_id)
    )
  );

create policy "editors can write links"
  on element_task_links for insert
  with check (
    exists (
      select 1 from tasks t
      where t.id = task_id and is_project_member(t.project_id)
    )
  );
