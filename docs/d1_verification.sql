-- D1 Verification Query
-- Run this AFTER deploying schema.sql and rpc_create_showcase.sql
-- Expected: 2 tables, 1 view, 3 functions

SELECT 'Tables' as type, table_name as name FROM information_schema.tables
WHERE table_schema = 'public' AND table_name IN ('showcases', 'jobs')
UNION ALL
SELECT 'View' as type, table_name as name FROM information_schema.views
WHERE table_schema = 'public' AND table_name = 'public_showcases'
UNION ALL
SELECT 'Function' as type, proname as name FROM pg_proc
WHERE proname IN ('create_showcase_and_job', 'ensure_unique_slug', 'tg_set_updated_at')
ORDER BY type, name;

-- Additional verification: Check RLS is enabled
SELECT
  tablename,
  rowsecurity as "RLS Enabled"
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('showcases', 'jobs');
