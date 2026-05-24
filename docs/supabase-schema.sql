-- ============================================================
-- RWP Platform — Full Schema
-- Run this in your Supabase project: SQL Editor → New Query
-- ============================================================

-- ── Impact Organizations (schools / nonprofits / afterschool) ──

create table if not exists impact_organizations (
  id              uuid        primary key default gen_random_uuid(),
  user_id         uuid        references auth.users(id) on delete set null,
  org_type        text,
  org_name        text        not null,
  city            text,
  state           text,
  zip             text,
  grades          text,
  students        text,
  notes           text,
  exp_types       text[]      default '{}',
  interests       text[]      default '{}',
  contact_name    text,
  contact_title   text,
  contact_email   text,
  contact_phone   text,
  created_at      timestamptz not null default now()
);

alter table impact_organizations enable row level security;

create policy "Authenticated users can read organizations"
  on impact_organizations for select
  using (auth.role() = 'authenticated');

create policy "Authenticated users can insert organizations"
  on impact_organizations for insert
  with check (auth.role() = 'authenticated');

create policy "Users can update their own organization"
  on impact_organizations for update
  using (auth.uid() = user_id);

create table if not exists pathway_site_applications (
  id               uuid        primary key default gen_random_uuid(),
  company          text        not null,
  industry         text,
  city             text,
  contact_name     text,
  contact_email    text,
  submitted_at     date        not null default current_date,
  status           text        not null default 'pending'
                               check (status in ('pending','approved','flagged','denied')),
  experiences      text[]      default '{}',
  ein              text,
  insurance_amount text,
  insurance_exp    date,
  bg_check         text        not null default 'Not Submitted',
  training         text        not null default 'Not Started',
  doc_safety       boolean     not null default false,
  doc_conduct      boolean     not null default false,
  doc_youth        boolean     not null default false,
  flag_note        text,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

-- Auto-update updated_at on every row change
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger pathway_site_applications_updated_at
  before update on pathway_site_applications
  for each row execute function set_updated_at();

-- RLS: allow authenticated admin users to read/write all rows
alter table pathway_site_applications enable row level security;

create policy "Authenticated users can read applications"
  on pathway_site_applications for select
  using (auth.role() = 'authenticated');

create policy "Authenticated users can update application status"
  on pathway_site_applications for update
  using (auth.role() = 'authenticated');

create policy "Authenticated users can insert applications"
  on pathway_site_applications for insert
  with check (auth.role() = 'authenticated');


-- ============================================================
-- Seed Data — mirrors the existing mock applications
-- ============================================================

insert into pathway_site_applications
  (company, industry, city, contact_name, contact_email, submitted_at, status,
   experiences, ein, insurance_amount, insurance_exp, bg_check, training,
   doc_safety, doc_conduct, doc_youth, flag_note)
values
  ('Grady Health System', 'Healthcare', 'Atlanta, GA', 'Marcus Webb', 'mwebb@gradyhealth.org',
   '2026-05-18', 'pending',
   ARRAY['Job Shadows','Career Panels','Internships'],
   '58-0633971', '$2,000,000', '2027-01-01', 'Submitted', 'Pending',
   true, true, false, null),

  ('Chick-fil-A Corporate', 'Hospitality', 'College Park, GA', 'Dana Kimura', 'dkimura@cfa.com',
   '2026-05-17', 'pending',
   ARRAY['Site Visits','Career Panels','Mentorships'],
   '58-1437061', '$1,000,000', '2026-12-15', 'Submitted', 'Pending',
   true, true, true, null),

  ('Delta Air Lines', 'Logistics', 'Atlanta, GA', 'Priya Nair', 'pnair@delta.com',
   '2026-05-15', 'approved',
   ARRAY['Site Visits','Job Shadows','Internships','Project Partnerships'],
   '58-0218548', '$5,000,000+', '2027-03-01', 'Cleared', 'Complete',
   true, true, true, null),

  ('SunTrust (Truist) Bank', 'Finance', 'Charlotte, NC', 'Jerome Banks', 'jbanks@truist.com',
   '2026-05-14', 'approved',
   ARRAY['Career Panels','Mentorships','Project Partnerships'],
   '56-0906908', '$2,000,000', '2026-11-30', 'Cleared', 'Complete',
   true, true, true, 'Insurance expires in 6 months'),

  ('Fulton County School District', 'Government', 'Atlanta, GA', 'Tamara Ellis', 'tellis@fultonschools.org',
   '2026-05-12', 'flagged',
   ARRAY['Site Visits','Career Panels'],
   '58-6000902', '$1,000,000', '2026-08-01', 'Issues Found', 'Pending',
   true, false, false, 'Background check returned incomplete results — follow-up required'),

  ('Piedmont Healthcare', 'Healthcare', 'Atlanta, GA', 'Robert Chen', 'rchen@piedmont.org',
   '2026-05-10', 'denied',
   ARRAY['Internships'],
   '', '', null, 'Not Submitted', 'Not Started',
   false, false, false, 'EIN could not be verified. Incomplete application submitted.');
