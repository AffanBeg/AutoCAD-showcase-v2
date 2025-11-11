-- Replace with your real Supabase auth user id
-- 11111111-1111-1111-1111-111111111111

with params as (select '11111111-1111-1111-1111-111111111111'::uuid as user_id)
insert into public.showcases (user_id, title, slug, visibility, status, input_path, output_path)
select p.user_id, 'Gear Housing', public.ensure_unique_slug('gear-housing'), 'public', 'ready',
       'cad-uploaded/demo/gear.step', 'cad-converted/demo/gear.stl'
from params p
on conflict do nothing;

with params as (select '11111111-1111-1111-1111-111111111111'::uuid as user_id)
insert into public.showcases (user_id, title, slug, visibility, status, input_path)
select p.user_id, 'Robot Arm', public.ensure_unique_slug('robot-arm'), 'private', 'processing',
       'cad-uploaded/demo/arm.step'
from params p
on conflict do nothing;

insert into public.jobs (showcase_id, input_path, status)
select s.id, s.input_path, 'queued' from public.showcases s where s.slug='robot-arm' on conflict do nothing;
