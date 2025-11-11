-- Showcase3D Seed Data
-- IMPORTANT: Replace the UUID below with YOUR actual Supabase auth user id before running.
-- Example: select auth.uid(); -- (only available in RPC/security context)
-- You can find your user id in Auth > Users in the Supabase dashboard.
-- Replace ALL occurrences of 11111111-1111-1111-1111-111111111111

-- 👇 EDIT THIS FIRST
-- :USER_ID := 11111111-1111-1111-1111-111111111111

with params as (
  select '11111111-1111-1111-1111-111111111111'::uuid as user_id
)
insert into public.showcases (user_id, title, slug, visibility, status, input_path, output_path)
select p.user_id, 'Gear Housing', public.ensure_unique_slug('gear-housing'), 'public', 'ready',
       'cad-uploaded/demo/gear.step', 'cad-converted/demo/gear.stl'
from params p
on conflict do nothing;

with params as (
  select '11111111-1111-1111-1111-111111111111'::uuid as user_id
)
insert into public.showcases (user_id, title, slug, visibility, status, input_path)
select p.user_id, 'Robot Arm', public.ensure_unique_slug('robot-arm'), 'private', 'processing',
       'cad-uploaded/demo/arm.step'
from params p
on conflict do nothing;

-- Create a job for the 'Robot Arm' showcase
insert into public.jobs (showcase_id, input_path, status)
select s.id, s.input_path, 'queued'
from public.showcases s
where s.slug = 'robot-arm'
on conflict do nothing;

-- Verify
-- select * from public.showcases order by created_at desc;
-- select * from public.jobs order by created_at desc;
