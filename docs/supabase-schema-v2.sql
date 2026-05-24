-- ============================================================
-- RWP Platform — Full Schema (v2 — idempotent, safe to re-run)
-- Run this in Supabase SQL Editor → New Query
-- ============================================================

-- ── Impact Organizations ──
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

drop policy if exists "Authenticated users can read organizations" on impact_organizations;
drop policy if exists "Authenticated users can insert organizations" on impact_organizations;
drop policy if exists "Users can update their own organization" on impact_organizations;

create policy "Authenticated users can read organizations"
  on impact_organizations for select using (auth.role() = 'authenticated');

create policy "Authenticated users can insert organizations"
  on impact_organizations for insert with check (auth.role() = 'authenticated');

create policy "Users can update their own organization"
  on impact_organizations for update using (auth.uid() = user_id);


-- ── Pathway Site Applications ──
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

create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists pathway_site_applications_updated_at on pathway_site_applications;
create trigger pathway_site_applications_updated_at
  before update on pathway_site_applications
  for each row execute function set_updated_at();

alter table pathway_site_applications enable row level security;

drop policy if exists "Authenticated users can read applications" on pathway_site_applications;
drop policy if exists "Authenticated users can update application status" on pathway_site_applications;
drop policy if exists "Authenticated users can insert applications" on pathway_site_applications;

create policy "Authenticated users can read applications"
  on pathway_site_applications for select using (auth.role() = 'authenticated');

create policy "Authenticated users can update application status"
  on pathway_site_applications for update using (auth.role() = 'authenticated');

create policy "Authenticated users can insert applications"
  on pathway_site_applications for insert with check (auth.role() = 'authenticated');


-- ── Seed Data (skip if already exists) ──
insert into pathway_site_applications
  (company, industry, city, contact_name, contact_email, submitted_at, status,
   experiences, ein, insurance_amount, insurance_exp, bg_check, training,
   doc_safety, doc_conduct, doc_youth, flag_note)
select * from (values
  ('Grady Health System', 'Healthcare', 'Atlanta, GA', 'Marcus Webb', 'mwebb@gradyhealth.org',
   '2026-05-18'::date, 'pending',
   ARRAY['Job Shadows','Career Panels','Internships'],
   '58-0633971', '$2,000,000', '2027-01-01'::date, 'Submitted', 'Pending',
   true, true, false, null::text),

  ('Chick-fil-A Corporate', 'Hospitality', 'College Park, GA', 'Dana Kimura', 'dkimura@cfa.com',
   '2026-05-17'::date, 'pending',
   ARRAY['Site Visits','Career Panels','Mentorships'],
   '58-1437061', '$1,000,000', '2026-12-15'::date, 'Submitted', 'Pending',
   true, true, true, null::text),

  ('Delta Air Lines', 'Logistics', 'Atlanta, GA', 'Priya Nair', 'pnair@delta.com',
   '2026-05-15'::date, 'approved',
   ARRAY['Site Visits','Job Shadows','Internships','Project Partnerships'],
   '58-0218548', '$5,000,000+', '2027-03-01'::date, 'Cleared', 'Complete',
   true, true, true, null::text),

  ('SunTrust (Truist) Bank', 'Finance', 'Charlotte, NC', 'Jerome Banks', 'jbanks@truist.com',
   '2026-05-14'::date, 'approved',
   ARRAY['Career Panels','Mentorships','Project Partnerships'],
   '56-0906908', '$2,000,000', '2026-11-30'::date, 'Cleared', 'Complete',
   true, true, true, 'Insurance expires in 6 months'),

  ('Fulton County School District', 'Government', 'Atlanta, GA', 'Tamara Ellis', 'tellis@fultonschools.org',
   '2026-05-12'::date, 'flagged',
   ARRAY['Site Visits','Career Panels'],
   '58-6000902', '$1,000,000', '2026-08-01'::date, 'Issues Found', 'Pending',
   true, false, false, 'Background check returned incomplete results — follow-up required'),

  ('Piedmont Healthcare', 'Healthcare', 'Atlanta, GA', 'Robert Chen', 'rchen@piedmont.org',
   '2026-05-10'::date, 'denied',
   ARRAY['Internships'],
   '', '', null::date, 'Not Submitted', 'Not Started',
   false, false, false, 'EIN could not be verified. Incomplete application submitted.')
) as v(company, industry, city, contact_name, contact_email, submitted_at, status,
       experiences, ein, insurance_amount, insurance_exp, bg_check, training,
       doc_safety, doc_conduct, doc_youth, flag_note)
where not exists (select 1 from pathway_site_applications);
