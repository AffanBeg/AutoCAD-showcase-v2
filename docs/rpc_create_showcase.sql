create or replace function public.create_showcase_and_job(
  p_user_id uuid,
  p_title text,
  p_input_path text
) returns uuid
language plpgsql
security definer
as $$
declare v_showcase_id uuid;
begin
  insert into public.showcases (user_id, title, slug, input_path, status)
  values (p_user_id, p_title, public.ensure_unique_slug(p_title), p_input_path, 'uploaded')
  returning id into v_showcase_id;

  insert into public.jobs (showcase_id, input_path, status)
  values (v_showcase_id, p_input_path, 'queued');

  return v_showcase_id;
end;
$$;
