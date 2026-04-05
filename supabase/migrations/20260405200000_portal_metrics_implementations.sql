-- Métricas de dashboard, serie mensual e implementaciones (por usuario, RLS).

-- Resumen YTD (una fila por usuario)
create table if not exists public.client_dashboard_metrics (
  user_id uuid primary key references auth.users (id) on delete cascade,
  company_name_display text,
  period_label text not null default 'Acumulado año en curso',
  hours_saved_ytd integer not null default 0 check (hours_saved_ytd >= 0),
  estimated_value_eur numeric(14, 2) not null default 0 check (estimated_value_eur >= 0),
  consultancy_fees_eur numeric(14, 2) not null default 0 check (consultancy_fees_eur >= 0),
  updated_at timestamptz not null default now()
);

alter table public.client_dashboard_metrics enable row level security;

create policy "cdm_select_own"
  on public.client_dashboard_metrics for select
  using (auth.uid() = user_id);

create policy "cdm_insert_own"
  on public.client_dashboard_metrics for insert
  with check (auth.uid() = user_id);

create policy "cdm_update_own"
  on public.client_dashboard_metrics for update
  using (auth.uid() = user_id);

-- Puntos del gráfico mensual (valor vs inversión)
create table if not exists public.client_monthly_metrics (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  month_label text not null,
  sort_index integer not null default 0,
  valor_eur numeric(14, 2) not null default 0,
  inversion_eur numeric(14, 2) not null default 0,
  unique (user_id, month_label)
);

create index if not exists client_monthly_user_sort_idx
  on public.client_monthly_metrics (user_id, sort_index);

alter table public.client_monthly_metrics enable row level security;

create policy "cmm_select_own"
  on public.client_monthly_metrics for select
  using (auth.uid() = user_id);

create policy "cmm_insert_own"
  on public.client_monthly_metrics for insert
  with check (auth.uid() = user_id);

create policy "cmm_update_own"
  on public.client_monthly_metrics for update
  using (auth.uid() = user_id);

create policy "cmm_delete_own"
  on public.client_monthly_metrics for delete
  using (auth.uid() = user_id);

-- Implementaciones con roadmap en JSON (misma forma que RoadmapPhase[] del front)
create table if not exists public.client_implementations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  area text not null,
  status text not null check (status in ('active', 'pilot', 'closed')),
  hours_per_week_saved numeric(10, 2) not null default 0,
  estimated_monthly_value_eur numeric(14, 2) not null default 0,
  started_at date not null default (current_date),
  roadmap_phases jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists client_impl_user_started_idx
  on public.client_implementations (user_id, started_at desc);

alter table public.client_implementations enable row level security;

create policy "ci_select_own"
  on public.client_implementations for select
  using (auth.uid() = user_id);

create policy "ci_insert_own"
  on public.client_implementations for insert
  with check (auth.uid() = user_id);

create policy "ci_update_own"
  on public.client_implementations for update
  using (auth.uid() = user_id);

create policy "ci_delete_own"
  on public.client_implementations for delete
  using (auth.uid() = user_id);

-- Fila de métricas al crear perfil
create or replace function public.ensure_dashboard_metrics_for_profile()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.client_dashboard_metrics (user_id, company_name_display, period_label)
  values (
    new.id,
    coalesce(nullif(trim(new.company_name), ''), 'Cliente'),
    'Acumulado año en curso'
  )
  on conflict (user_id) do nothing;
  return new;
end;
$$;

drop trigger if exists trg_profiles_ensure_dashboard on public.profiles;
create trigger trg_profiles_ensure_dashboard
  after insert on public.profiles
  for each row execute procedure public.ensure_dashboard_metrics_for_profile();

-- Perfiles ya existentes: crear métricas si faltan
insert into public.client_dashboard_metrics (user_id, company_name_display, period_label)
select
  p.id,
  coalesce(nullif(trim(p.company_name), ''), 'Cliente'),
  'Acumulado año en curso'
from public.profiles p
where not exists (
  select 1 from public.client_dashboard_metrics m where m.user_id = p.id
);

comment on table public.client_dashboard_metrics is 'KPIs YTD del panel cliente; editable por Matic vía SQL o futuro admin.';
comment on table public.client_monthly_metrics is 'Serie mensual valor vs inversión para gráficos del panel.';
comment on table public.client_implementations is 'Iniciativas y roadmaps (JSON) del panel cliente.';
