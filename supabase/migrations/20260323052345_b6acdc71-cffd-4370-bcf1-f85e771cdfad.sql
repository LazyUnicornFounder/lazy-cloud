create table if not exists public.blog_errors (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  error_message text not null
);

alter table public.blog_errors enable row level security;

create policy "No public access to blog_errors"
  on public.blog_errors
  for select
  to authenticated
  using (false);