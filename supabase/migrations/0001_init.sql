-- Finora initial schema: profiles, income, budget, savings modules + RLS

create extension if not exists "pgcrypto";

-- ─── profiles ────────────────────────────────────────────────────────────
create table if not exists public.profiles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  subscription_status text not null default 'free'
    check (subscription_status in ('free', 'trialing', 'active', 'canceled', 'past_due')),
  stripe_customer_id text,
  stripe_subscription_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = user_id);
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = user_id);
create policy "profiles_insert_own" on public.profiles
  for insert with check (auth.uid() = user_id);

-- auto-create a profile row whenever a new auth user signs up
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (user_id, display_name)
  values (new.id, new.raw_user_meta_data ->> 'display_name');
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ─── incomes ─────────────────────────────────────────────────────────────
create table if not exists public.incomes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  source text not null,
  amount numeric(12, 2) not null check (amount >= 0),
  date date not null default current_date,
  is_recurring boolean not null default false,
  recurrence_interval text check (recurrence_interval in ('weekly', 'biweekly', 'monthly')),
  created_at timestamptz not null default now()
);

alter table public.incomes enable row level security;

create policy "incomes_all_own" on public.incomes
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create index if not exists incomes_user_id_date_idx on public.incomes (user_id, date desc);

-- ─── budgets ─────────────────────────────────────────────────────────────
create table if not exists public.budgets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  period_start date not null,
  period_end date not null,
  total_amount numeric(12, 2) not null default 0 check (total_amount >= 0),
  created_at timestamptz not null default now()
);

alter table public.budgets enable row level security;

create policy "budgets_all_own" on public.budgets
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create index if not exists budgets_user_id_idx on public.budgets (user_id, period_start desc);

-- ─── budget_categories ───────────────────────────────────────────────────
create table if not exists public.budget_categories (
  id uuid primary key default gen_random_uuid(),
  budget_id uuid not null references public.budgets (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  allocated_amount numeric(12, 2) not null default 0 check (allocated_amount >= 0),
  created_at timestamptz not null default now()
);

alter table public.budget_categories enable row level security;

create policy "budget_categories_all_own" on public.budget_categories
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create index if not exists budget_categories_budget_id_idx on public.budget_categories (budget_id);

-- ─── expenses ────────────────────────────────────────────────────────────
create table if not exists public.expenses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  budget_category_id uuid not null references public.budget_categories (id) on delete cascade,
  amount numeric(12, 2) not null check (amount >= 0),
  date date not null default current_date,
  description text,
  created_at timestamptz not null default now()
);

alter table public.expenses enable row level security;

create policy "expenses_all_own" on public.expenses
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create index if not exists expenses_category_id_idx on public.expenses (budget_category_id);
create index if not exists expenses_user_id_date_idx on public.expenses (user_id, date desc);

-- ─── savings_goals ───────────────────────────────────────────────────────
create table if not exists public.savings_goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  target_amount numeric(12, 2) not null check (target_amount > 0),
  current_amount numeric(12, 2) not null default 0 check (current_amount >= 0),
  target_date date,
  created_at timestamptz not null default now()
);

alter table public.savings_goals enable row level security;

create policy "savings_goals_all_own" on public.savings_goals
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create index if not exists savings_goals_user_id_idx on public.savings_goals (user_id, created_at desc);

-- ─── savings_contributions ───────────────────────────────────────────────
create table if not exists public.savings_contributions (
  id uuid primary key default gen_random_uuid(),
  goal_id uuid not null references public.savings_goals (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  amount numeric(12, 2) not null check (amount > 0),
  date date not null default current_date,
  created_at timestamptz not null default now()
);

alter table public.savings_contributions enable row level security;

create policy "savings_contributions_all_own" on public.savings_contributions
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create index if not exists savings_contributions_goal_id_idx on public.savings_contributions (goal_id);

-- keep savings_goals.current_amount in sync with contributions
create or replace function public.handle_savings_contribution_change()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  update public.savings_goals
  set current_amount = coalesce((
    select sum(amount) from public.savings_contributions
    where goal_id = coalesce(new.goal_id, old.goal_id)
  ), 0)
  where id = coalesce(new.goal_id, old.goal_id);
  return coalesce(new, old);
end;
$$;

drop trigger if exists on_savings_contribution_change on public.savings_contributions;
create trigger on_savings_contribution_change
  after insert or update or delete on public.savings_contributions
  for each row execute function public.handle_savings_contribution_change();
