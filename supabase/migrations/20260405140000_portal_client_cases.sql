-- Matic portal: perfiles, casos y mensajes (RLS).
-- Ejecutar en un proyecto Supabase dedicado (MCP: apply_migration) o con CLI: supabase db push

-- Perfil por usuario (auth)
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  company_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles_select_own"
  on public.profiles for select
  using (auth.uid() = id);

create policy "profiles_insert_own"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id);

-- Casos (tickets / conversaciones)
create table if not exists public.client_cases (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  status text not null default 'open'
    check (status in ('open', 'in_progress', 'waiting_client', 'closed')),
  source text not null default 'portal_chat'
    check (source in ('portal_chat', 'webhook', 'operator')),
  scenario_key text,
  title text,
  external_ref text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists client_cases_user_id_idx on public.client_cases (user_id);
create index if not exists client_cases_created_at_idx on public.client_cases (created_at desc);

alter table public.client_cases enable row level security;

create policy "client_cases_select_own"
  on public.client_cases for select
  using (auth.uid() = user_id);

create policy "client_cases_insert_own"
  on public.client_cases for insert
  with check (auth.uid() = user_id);

create policy "client_cases_update_own"
  on public.client_cases for update
  using (auth.uid() = user_id);

-- Mensajes por caso
create table if not exists public.client_case_messages (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null references public.client_cases (id) on delete cascade,
  role text not null check (role in ('user', 'assistant', 'system')),
  body text not null,
  classified jsonb,
  created_at timestamptz not null default now()
);

create index if not exists client_case_messages_case_id_idx
  on public.client_case_messages (case_id, created_at);

alter table public.client_case_messages enable row level security;

create policy "client_case_messages_select"
  on public.client_case_messages for select
  using (
    exists (
      select 1 from public.client_cases c
      where c.id = case_id and c.user_id = auth.uid()
    )
  );

create policy "client_case_messages_insert"
  on public.client_case_messages for insert
  with check (
    exists (
      select 1 from public.client_cases c
      where c.id = case_id and c.user_id = auth.uid()
    )
  );

-- Trigger: sincronizar perfil al registrarse
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, company_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'company_name', null)
  )
  on conflict (id) do update
    set email = excluded.email,
        updated_at = now();
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- updated_at automático en casos
create or replace function public.touch_client_cases_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists client_cases_updated_at on public.client_cases;
create trigger client_cases_updated_at
  before update on public.client_cases
  for each row execute function public.touch_client_cases_updated_at();

comment on table public.client_cases is 'Casos del portal cliente / webhook (service role bypass RLS).';
comment on table public.client_case_messages is 'Mensajes del chat asociados a un caso.';
