-- One watchlist per user, synced from the terminal (components/uptrade-terminal/use-watchlist-sync.ts)
create table if not exists public.watchlists (
    user_id uuid primary key references auth.users (id) on delete cascade,
    symbols text[] not null default '{}',
    updated_at timestamptz not null default now(),
    constraint watchlists_symbols_limit check (cardinality(symbols) <= 200)
);

alter table public.watchlists enable row level security;

create policy "watchlists: read own" on public.watchlists
    for select to authenticated using ((select auth.uid()) = user_id);

create policy "watchlists: insert own" on public.watchlists
    for insert to authenticated with check ((select auth.uid()) = user_id);

create policy "watchlists: update own" on public.watchlists
    for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
