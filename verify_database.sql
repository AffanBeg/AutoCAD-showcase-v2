-- Comprehensive Supabase Database Verification Script
-- =====================================================

-- 1. TABLES CHECK
\echo '=== 1. TABLES CHECK ==='
\echo 'Checking showcases table columns:'
SELECT
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public'
    AND table_name = 'showcases'
ORDER BY ordinal_position;

\echo ''
\echo 'Checking jobs table columns:'
SELECT
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public'
    AND table_name = 'jobs'
ORDER BY ordinal_position;

-- 2. VIEWS CHECK
\echo ''
\echo '=== 2. VIEWS CHECK ==='
SELECT
    table_name as view_name,
    view_definition
FROM information_schema.views
WHERE table_schema = 'public'
    AND table_name = 'public_showcases';

-- 3. FUNCTIONS CHECK
\echo ''
\echo '=== 3. FUNCTIONS CHECK ==='
SELECT
    proname as function_name,
    pg_get_function_arguments(p.oid) as arguments,
    pg_get_functiondef(p.oid) as definition
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public'
    AND proname IN ('create_showcase_and_job', 'ensure_unique_slug', 'tg_set_updated_at');

-- 4. RLS POLICIES CHECK
\echo ''
\echo '=== 4. RLS POLICIES CHECK ==='
\echo 'RLS Status:'
SELECT
    schemaname,
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
    AND tablename IN ('showcases', 'jobs');

\echo ''
\echo 'Showcases table policies:'
SELECT
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE schemaname = 'public'
    AND tablename = 'showcases';

\echo ''
\echo 'Jobs table policies:'
SELECT
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE schemaname = 'public'
    AND tablename = 'jobs';

-- 5. CUSTOM TYPES CHECK
\echo ''
\echo '=== 5. CUSTOM TYPES CHECK ==='
\echo 'Enum types:'
SELECT
    t.typname as enum_name,
    array_agg(e.enumlabel ORDER BY e.enumsortorder) as enum_values
FROM pg_type t
JOIN pg_enum e ON t.oid = e.enumtypid
JOIN pg_namespace n ON t.typnamespace = n.oid
WHERE n.nspname = 'public'
    AND t.typname IN ('visibility_t', 'showcase_status_t', 'job_status_t')
GROUP BY t.typname;

-- 6. EXTENSIONS CHECK
\echo ''
\echo '=== 6. EXTENSIONS CHECK ==='
SELECT
    extname as extension_name,
    extversion as version
FROM pg_extension
WHERE extname IN ('pgcrypto', 'uuid-ossp');

-- 7. TRIGGERS CHECK
\echo ''
\echo '=== 7. TRIGGERS CHECK ==='
SELECT
    trigger_name,
    event_manipulation,
    event_object_table,
    action_statement,
    action_timing
FROM information_schema.triggers
WHERE event_object_schema = 'public'
    AND event_object_table IN ('showcases', 'jobs')
ORDER BY event_object_table, trigger_name;

-- 8. INDEXES CHECK
\echo ''
\echo '=== 8. INDEXES CHECK ==='
SELECT
    schemaname,
    tablename,
    indexname,
    indexdef
FROM pg_indexes
WHERE schemaname = 'public'
    AND indexname IN ('idx_showcases_user_id', 'idx_jobs_showcase_id', 'idx_jobs_status')
ORDER BY indexname;

-- SUMMARY CHECK
\echo ''
\echo '=== SUMMARY ==='
SELECT
    'Tables' as component_type,
    COUNT(*) as count,
    2 as expected,
    CASE WHEN COUNT(*) = 2 THEN 'PASS' ELSE 'FAIL' END as status
FROM information_schema.tables
WHERE table_schema = 'public'
    AND table_name IN ('showcases', 'jobs')
UNION ALL
SELECT
    'Views' as component_type,
    COUNT(*) as count,
    1 as expected,
    CASE WHEN COUNT(*) = 1 THEN 'PASS' ELSE 'FAIL' END as status
FROM information_schema.views
WHERE table_schema = 'public'
    AND table_name = 'public_showcases'
UNION ALL
SELECT
    'Functions' as component_type,
    COUNT(*) as count,
    3 as expected,
    CASE WHEN COUNT(*) = 3 THEN 'PASS' ELSE 'FAIL' END as status
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public'
    AND proname IN ('create_showcase_and_job', 'ensure_unique_slug', 'tg_set_updated_at')
UNION ALL
SELECT
    'Enum Types' as component_type,
    COUNT(*) as count,
    3 as expected,
    CASE WHEN COUNT(*) = 3 THEN 'PASS' ELSE 'FAIL' END as status
FROM pg_type t
JOIN pg_namespace n ON t.typnamespace = n.oid
WHERE n.nspname = 'public'
    AND t.typname IN ('visibility_t', 'showcase_status_t', 'job_status_t')
UNION ALL
SELECT
    'Extensions' as component_type,
    COUNT(*) as count,
    2 as expected,
    CASE WHEN COUNT(*) = 2 THEN 'PASS' ELSE 'FAIL' END as status
FROM pg_extension
WHERE extname IN ('pgcrypto', 'uuid-ossp')
UNION ALL
SELECT
    'Indexes' as component_type,
    COUNT(*) as count,
    3 as expected,
    CASE WHEN COUNT(*) = 3 THEN 'PASS' ELSE 'FAIL' END as status
FROM pg_indexes
WHERE schemaname = 'public'
    AND indexname IN ('idx_showcases_user_id', 'idx_jobs_showcase_id', 'idx_jobs_status')
UNION ALL
SELECT
    'Triggers' as component_type,
    COUNT(*) as count,
    2 as expected,
    CASE WHEN COUNT(*) = 2 THEN 'PASS' ELSE 'FAIL' END as status
FROM information_schema.triggers
WHERE event_object_schema = 'public'
    AND event_object_table IN ('showcases', 'jobs')
    AND trigger_name IN ('tr_showcases_set_updated', 'tr_jobs_set_updated');
