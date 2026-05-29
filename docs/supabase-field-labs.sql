-- ============================================================
-- RWP Platform — Field Labs table + seed data
-- Run this in Supabase SQL Editor for project ebyayglvlpclposazxjs
-- Run AFTER supabase-combined-schema.sql
-- ============================================================

-- ── 1. Create field_labs table ──
create table if not exists field_labs (
  id            uuid        primary key default gen_random_uuid(),
  site_id       uuid        references pathway_site_applications(id) on delete cascade,
  title         text        not null,
  type          text        not null default 'Field Lab™',
  description   text,
  capacity      int         not null default 10,
  duration      text,
  grade_levels  text,
  location      text,
  is_virtual    boolean     not null default false,
  status        text        not null default 'active'
                            check (status in ('active','inactive','full','draft')),
  created_at    timestamptz not null default now()
);

alter table field_labs enable row level security;

drop policy if exists "Authenticated users can read field labs" on field_labs;
drop policy if exists "Authenticated users can insert field labs" on field_labs;
drop policy if exists "Authenticated users can update field labs" on field_labs;

create policy "Authenticated users can read field labs"
  on field_labs for select using (auth.role() = 'authenticated');

create policy "Authenticated users can insert field labs"
  on field_labs for insert with check (auth.role() = 'authenticated');

create policy "Authenticated users can update field labs"
  on field_labs for update using (auth.role() = 'authenticated');

grant select, insert, update on field_labs to authenticated;


-- ── 2. Seed Field Labs (only if table is empty) ──
-- Linked to Delta Air Lines and Truist Bank (the two approved Pathway Sites)
insert into field_labs
  (site_id, title, type, description, capacity, duration, grade_levels, location, is_virtual, status)
select
  s.id,
  v.title,
  v.type,
  v.description,
  v.capacity,
  v.duration,
  v.grade_levels,
  v.location,
  v.is_virtual,
  'active'
from
  pathway_site_applications s,
  (values
    -- Delta Air Lines Field Labs
    ('Delta Air Lines', 'Aviation Operations Job Shadow',
     'Job Shadow',
     'Spend a day alongside Delta''s operations team at Hartsfield-Jackson. See how the world''s busiest airport runs — from ground crews to air traffic coordination to logistics. Students leave with a real picture of what aviation careers look like.',
     12, '1 full day (8am–4pm)', 'Grades 10–12',
     'Hartsfield-Jackson Atlanta International Airport, Atlanta, GA', false),

    ('Delta Air Lines', 'Engineering & Innovation Site Visit',
     'Site Visit',
     'Tour Delta''s TechOps facility — the largest airline maintenance operation in the world. Engineers walk students through aircraft maintenance, avionics, and the technology keeping 900+ planes in the air.',
     20, '3 hours', 'Grades 9–12',
     'Delta TechOps, Atlanta, GA', false),

    ('Delta Air Lines', 'Careers in Aviation Career Panel',
     'Career Panel',
     'Delta professionals across 6 departments — pilots, data analysts, HR, logistics, finance, and marketing — share their career paths and answer student questions live. Ideal for career exploration at any grade level.',
     30, '90 minutes', 'Grades 8–12',
     'Virtual (Zoom)', true),

    -- Truist Bank Field Labs
    ('SunTrust (Truist) Bank', 'Personal Finance & Banking Career Panel',
     'Career Panel',
     'Truist bankers, financial advisors, and data analysts explain how money moves, how banks work, and what it takes to build a career in finance. Students explore roles they didn''t know existed.',
     25, '60 minutes', 'Grades 9–12',
     'Virtual (Zoom)', true),

    ('SunTrust (Truist) Bank', 'Financial Services Mentorship Program',
     'Mentorship',
     'A 6-week cohort pairing students with Truist professionals in banking, wealth management, and fintech. Each student has one mentor, one goal-setting session, and one workplace touchpoint.',
     8, '6 weeks (1 hour/week)', 'Grades 11–12',
     'Truist Financial Center, Atlanta, GA', false)

  ) as v(company, title, type, description, capacity, duration, grade_levels, location, is_virtual)
where
  s.company = v.company
  and s.status = 'approved'
  and not exists (select 1 from field_labs);


-- ── 3. Reload schema cache ──
notify pgrst, 'reload schema';
