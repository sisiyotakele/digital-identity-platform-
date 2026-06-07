-- ─── Profiles (extends auth.users 1:1) ───────────────────────────────────────
create table if not exists profiles (
  id           uuid references auth.users(id) on delete cascade primary key,
  username     varchar(50) unique,
  display_name varchar(100),
  avatar_url   text,
  role         text default 'user' check (role in ('user', 'admin')),
  created_at   timestamptz default now(),
  updated_at   timestamptz default now()
);

-- ─── Business Cards (many per user) ──────────────────────────────────────────
create table if not exists business_cards (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references profiles(id) on delete cascade not null,
  slug        varchar(100) unique not null,
  template    text default 'minimal'
              check (template in ('minimal','modern','corporate','creative','executive','dark','gradient','startup')),
  title       varchar(100),
  company     varchar(100),
  phone       varchar(30),
  email       varchar(255),
  website     varchar(255),
  address     text,
  bio         varchar(300),
  photo_url   text,
  logo_url    text,
  theme_color varchar(7) default '#1B4F8A',
  is_active   boolean default true,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- ─── Social Links ─────────────────────────────────────────────────────────────
create table if not exists social_links (
  id            uuid primary key default gen_random_uuid(),
  card_id       uuid references business_cards(id) on delete cascade not null,
  platform      varchar(50) not null,
  url           text not null,
  display_order integer default 0
);

-- ─── QR Codes ─────────────────────────────────────────────────────────────────
create table if not exists qr_codes (
  id         uuid primary key default gen_random_uuid(),
  card_id    uuid references business_cards(id) on delete cascade not null,
  created_at timestamptz default now()
);

-- ─── Analytics Events ─────────────────────────────────────────────────────────
create table if not exists analytics_events (
  id            uuid primary key default gen_random_uuid(),
  card_id       uuid references business_cards(id) on delete cascade not null,
  event_type    text check (event_type in (
                  'card_view', 'contact_download', 'link_click',
                  'qr_scan', 'share_click', 'email_click',
                  'phone_click', 'website_click'
                )),
  device_type   varchar(50),
  country       varchar(50),
  link_platform varchar(50),
  created_at    timestamptz default now()
);

-- ─── Daily Analytics (materialized summary) ──────────────────────────────────
create table if not exists daily_analytics (
  id                 uuid primary key default gen_random_uuid(),
  card_id            uuid references business_cards(id) on delete cascade not null,
  date               date not null,
  views              integer default 0,
  contact_downloads  integer default 0,
  link_clicks        integer default 0,
  qr_scans           integer default 0,
  share_clicks       integer default 0,
  unique (card_id, date)
);

-- ─── Leads ────────────────────────────────────────────────────────────────────
create table if not exists leads (
  id         uuid primary key default gen_random_uuid(),
  card_id    uuid references business_cards(id) on delete cascade not null,
  name       varchar(100) not null,
  email      varchar(255),
  phone      varchar(30),
  message    text,
  created_at timestamptz default now()
);

-- ─── Indexes ──────────────────────────────────────────────────────────────────
create index if not exists idx_profiles_username         on profiles(username);
create index if not exists idx_business_cards_slug       on business_cards(slug);
create index if not exists idx_business_cards_user_id    on business_cards(user_id);
create index if not exists idx_analytics_card_id         on analytics_events(card_id);
create index if not exists idx_analytics_created_at      on analytics_events(created_at);
create index if not exists idx_daily_analytics_card_date on daily_analytics(card_id, date);
create index if not exists idx_leads_card_id             on leads(card_id);

-- ─── Auto-create profile on signup ───────────────────────────────────────────
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into profiles (id, display_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- ─── Auto-update updated_at ───────────────────────────────────────────────────
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists update_profiles_updated_at on profiles;
create trigger update_profiles_updated_at
  before update on profiles
  for each row execute procedure update_updated_at();

drop trigger if exists update_cards_updated_at on business_cards;
create trigger update_cards_updated_at
  before update on business_cards
  for each row execute procedure update_updated_at();
