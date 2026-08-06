-- Link auto-generated recurring income occurrences back to their template row

alter table public.incomes
  add column if not exists recurring_parent_id uuid references public.incomes (id) on delete cascade;

create index if not exists incomes_recurring_parent_id_idx on public.incomes (recurring_parent_id);
