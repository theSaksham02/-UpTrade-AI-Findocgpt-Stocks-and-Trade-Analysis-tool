-- Pro waitlist (from /pricing) and contact messages (from /contact).
-- Visitors may insert; nobody can read through the API. Read them in the Supabase dashboard.

create table if not exists public.waitlist (
    id bigint generated always as identity primary key,
    email text not null unique check (char_length(email) between 3 and 254 and email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
    created_at timestamptz not null default now()
);

alter table public.waitlist enable row level security;

drop policy if exists "Anyone can join the waitlist" on public.waitlist;
create policy "Anyone can join the waitlist"
    on public.waitlist for insert
    to anon, authenticated
    with check (true);

create table if not exists public.contact_messages (
    id bigint generated always as identity primary key,
    email text not null check (char_length(email) between 3 and 254 and email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
    topic text not null default 'general' check (topic in ('general', 'bug', 'data', 'account')),
    message text not null check (char_length(message) between 5 and 5000),
    user_id uuid references auth.users (id) on delete set null,
    created_at timestamptz not null default now()
);

alter table public.contact_messages enable row level security;

drop policy if exists "Anyone can send a message" on public.contact_messages;
create policy "Anyone can send a message"
    on public.contact_messages for insert
    to anon, authenticated
    with check (user_id is null or user_id = auth.uid());
