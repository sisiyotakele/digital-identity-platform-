-- ─── Enable RLS on all tables ─────────────────────────────────────────────────
alter table profiles          enable row level security;
alter table business_cards    enable row level security;
alter table social_links      enable row level security;
alter table analytics_events  enable row level security;
alter table daily_analytics   enable row level security;
alter table leads             enable row level security;
alter table qr_codes          enable row level security;

-- ─── Profiles ────────────────────────────────────────────────────────────────
create policy "Public profiles are viewable by everyone"
  on profiles for select
  using (true);

create policy "Users can update own profile"
  on profiles for update
  using (auth.uid() = id);

-- ─── Business Cards ──────────────────────────────────────────────────────────
create policy "Owner full access to own cards"
  on business_cards for all
  using (auth.uid() = user_id);

create policy "Public can view active cards"
  on business_cards for select
  using (is_active = true);

-- ─── Social Links ────────────────────────────────────────────────────────────
create policy "Owner can manage social links"
  on social_links for all
  using (
    exists (
      select 1 from business_cards
      where id = social_links.card_id
        and user_id = auth.uid()
    )
  );

create policy "Public can view social links of active cards"
  on social_links for select
  using (
    exists (
      select 1 from business_cards
      where id = social_links.card_id
        and is_active = true
    )
  );

-- ─── Analytics Events ────────────────────────────────────────────────────────
create policy "Anyone can record analytics events"
  on analytics_events for insert
  with check (true);

create policy "Owner can view own card analytics"
  on analytics_events for select
  using (
    exists (
      select 1 from business_cards
      where id = analytics_events.card_id
        and user_id = auth.uid()
    )
  );

-- ─── Daily Analytics ─────────────────────────────────────────────────────────
create policy "Anyone can upsert daily analytics"
  on daily_analytics for all
  using (true)
  with check (true);

create policy "Owner can view own daily analytics"
  on daily_analytics for select
  using (
    exists (
      select 1 from business_cards
      where id = daily_analytics.card_id
        and user_id = auth.uid()
    )
  );

-- ─── Leads ────────────────────────────────────────────────────────────────────
create policy "Anyone can submit a lead"
  on leads for insert
  with check (true);

create policy "Owner can view leads for own cards"
  on leads for select
  using (
    exists (
      select 1 from business_cards
      where id = leads.card_id
        and user_id = auth.uid()
    )
  );

-- ─── QR Codes ────────────────────────────────────────────────────────────────
create policy "Anyone can insert qr_codes"
  on qr_codes for insert
  with check (true);

create policy "Owner can view own qr_codes"
  on qr_codes for select
  using (
    exists (
      select 1 from business_cards
      where id = qr_codes.card_id
        and user_id = auth.uid()
    )
  );
