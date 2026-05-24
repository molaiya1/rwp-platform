-- ============================================================
-- RWP Platform — Safety Schema Extension
-- Run this in Supabase SQL Editor → New Query
-- Safe to re-run (idempotent)
-- ============================================================

-- ── Emergency contact columns on impact_organizations ──
alter table impact_organizations
  add column if not exists ec_name  text,
  add column if not exists ec_phone text,
  add column if not exists ec_email text;


-- ── Incident Reports ──
create table if not exists incident_reports (
  id             uuid        primary key default gen_random_uuid(),
  reporter_name  text,
  reporter_email text,
  reporter_type  text        not null default 'other',
  incident_date  date,
  partner_name   text,
  location       text,
  description    text        not null,
  severity       text        not null default 'low'
                             check (severity in ('low','medium','high','critical')),
  status         text        not null default 'open'
                             check (status in ('open','investigating','resolved','closed')),
  admin_notes    text,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create or replace function set_incident_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists incident_reports_updated_at on incident_reports;
create trigger incident_reports_updated_at
  before update on incident_reports
  for each row execute function set_incident_updated_at();

alter table incident_reports enable row level security;

drop policy if exists "Anyone can submit an incident report" on incident_reports;
drop policy if exists "Authenticated users can read incident reports" on incident_reports;
drop policy if exists "Authenticated users can update incident reports" on incident_reports;

create policy "Anyone can submit an incident report"
  on incident_reports for insert with check (true);

create policy "Authenticated users can read incident reports"
  on incident_reports for select using (auth.role() = 'authenticated');

create policy "Authenticated users can update incident reports"
  on incident_reports for update using (auth.role() = 'authenticated');


-- ── Experience Ratings ──
create table if not exists experience_ratings (
  id                    uuid  primary key default gen_random_uuid(),
  partner_name          text  not null,
  org_name              text,
  experience_title      text,
  experience_date       date,
  safety_score          int   check (safety_score between 1 and 5),
  professionalism_score int   check (professionalism_score between 1 and 5),
  engagement_score      int   check (engagement_score between 1 and 5),
  overall_score         int   check (overall_score between 1 and 5),
  notes                 text,
  flag_for_review       boolean not null default false,
  created_at            timestamptz not null default now()
);

alter table experience_ratings enable row level security;

drop policy if exists "Authenticated users can submit ratings" on experience_ratings;
drop policy if exists "Authenticated users can read ratings" on experience_ratings;

create policy "Authenticated users can submit ratings"
  on experience_ratings for insert with check (auth.role() = 'authenticated');

create policy "Authenticated users can read ratings"
  on experience_ratings for select using (auth.role() = 'authenticated');
