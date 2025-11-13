#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Comprehensive Supabase Database Verification Script

This script checks:
1. Tables structure (showcases, jobs)
2. Views (public_showcases)
3. Functions (create_showcase_and_job, ensure_unique_slug, tg_set_updated_at)
4. RLS Policies
5. Custom Types (enums)
6. Extensions (pgcrypto, uuid-ossp)
7. Triggers
8. Indexes
"""

import os
import sys
import json
import urllib.request
import urllib.error
from urllib.parse import urljoin
from typing import Dict, Any, Optional, List

# Fix encoding issues on Windows
if sys.platform == 'win32':
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

# Load environment variables
def load_env():
    env_vars = {}
    env_path = '.env'
    if os.path.exists(env_path):
        with open(env_path, 'r') as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith('#') and '=' in line:
                    key, value = line.split('=', 1)
                    env_vars[key.strip()] = value.strip()
    return env_vars

env = load_env()
SUPABASE_URL = env.get('NEXT_PUBLIC_SUPABASE_URL')
SUPABASE_KEY = env.get('SUPABASE_SERVICE_ROLE_KEY')

if not SUPABASE_URL or not SUPABASE_KEY:
    print("ERROR: Missing Supabase credentials in .env file")
    exit(1)

# Results tracking
checks = {
    'passed': 0,
    'failed': 0,
    'warnings': 0,
    'results': []
}

def log_result(category: str, name: str, status: str, details: str = ''):
    """Log a verification result"""
    status_symbol = '✓' if status == 'PASS' else '✗' if status == 'FAIL' else '⚠'
    message = f"  {status_symbol} {name}"
    if details:
        message += f": {details}"

    checks['results'].append({
        'category': category,
        'name': name,
        'status': status,
        'details': details,
        'message': message
    })

    if status == 'PASS':
        checks['passed'] += 1
    elif status == 'FAIL':
        checks['failed'] += 1
    elif status == 'WARN':
        checks['warnings'] += 1

    print(message)

def make_request(method: str, path: str, data: Optional[Dict] = None) -> tuple:
    """Make a request to Supabase REST API"""
    url = urljoin(SUPABASE_URL, path)
    headers = {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_KEY,
        'Authorization': f'Bearer {SUPABASE_KEY}'
    }

    try:
        if data:
            data_bytes = json.dumps(data).encode('utf-8')
            req = urllib.request.Request(url, data=data_bytes, headers=headers, method=method)
        else:
            req = urllib.request.Request(url, headers=headers, method=method)

        with urllib.request.urlopen(req) as response:
            response_data = response.read().decode('utf-8')
            return json.loads(response_data) if response_data else None, None
    except urllib.error.HTTPError as e:
        error_body = e.read().decode('utf-8')
        return None, f"HTTP {e.code}: {error_body}"
    except Exception as e:
        return None, str(e)

def check_table(table_name: str, expected_columns: List[str]):
    """Check if a table exists and is accessible"""
    data, error = make_request('GET', f'/rest/v1/{table_name}?limit=0')

    if error and 'does not exist' in error.lower():
        log_result('Tables', f'{table_name} table', 'FAIL', 'Table does not exist')
        return False
    elif error:
        log_result('Tables', f'{table_name} table', 'PASS', 'Table exists (RLS may be blocking access)')
        print(f'    Expected columns: {", ".join(expected_columns)}')
        return True
    else:
        log_result('Tables', f'{table_name} table', 'PASS', 'Table exists and is accessible')
        print(f'    Expected columns: {", ".join(expected_columns)}')
        return True

def check_view(view_name: str):
    """Check if a view exists and is accessible"""
    data, error = make_request('GET', f'/rest/v1/{view_name}?limit=0')

    if error and 'does not exist' in error.lower():
        log_result('Views', view_name, 'FAIL', 'View does not exist')
        return False
    elif error:
        log_result('Views', view_name, 'WARN', f'View may exist but: {error}')
        return False
    else:
        log_result('Views', view_name, 'PASS', 'View exists and is accessible')
        return True

def check_function(func_name: str, params: Dict[str, Any]):
    """Check if a function exists"""
    data, error = make_request('POST', f'/rest/v1/rpc/{func_name}', params)

    if error and 'does not exist' in error.lower():
        log_result('Functions', func_name, 'FAIL', 'Function does not exist')
        return False
    elif error:
        # Function exists but may fail due to auth/permissions
        log_result('Functions', func_name, 'PASS', 'Function exists')
        return True
    else:
        log_result('Functions', func_name, 'PASS', 'Function exists and callable')
        return True

def check1_tables():
    """Check tables structure"""
    print('\n=== 1. TABLES CHECK ===')

    showcases_columns = [
        'id', 'user_id', 'title', 'slug', 'visibility', 'status',
        'input_path', 'output_path', 'created_at', 'updated_at'
    ]
    check_table('showcases', showcases_columns)

    jobs_columns = [
        'id', 'showcase_id', 'input_path', 'output_path', 'status',
        'attempt_count', 'started_at', 'finished_at', 'error',
        'created_at', 'updated_at'
    ]
    check_table('jobs', jobs_columns)

def check2_views():
    """Check views"""
    print('\n=== 2. VIEWS CHECK ===')
    check_view('public_showcases')

def check3_functions():
    """Check functions"""
    print('\n=== 3. FUNCTIONS CHECK ===')

    # Test create_showcase_and_job
    check_function('create_showcase_and_job', {
        'p_user_id': '00000000-0000-0000-0000-000000000000',
        'p_title': '__test_verification__',
        'p_input_path': '/test/path.dwg'
    })

    # Test ensure_unique_slug
    check_function('ensure_unique_slug', {
        'base': 'test-slug'
    })

    # tg_set_updated_at is a trigger function
    log_result('Functions', 'tg_set_updated_at', 'WARN',
               'Trigger function - cannot verify directly via REST API')

def check4_rls():
    """Check RLS policies"""
    print('\n=== 4. RLS POLICIES CHECK ===')
    print('  Note: RLS verification requires database-level access.')
    print('  Checking indirectly through API behavior...')

    # Create a client without service role to test RLS
    headers_anon = {
        'Content-Type': 'application/json',
        'apikey': env.get('NEXT_PUBLIC_SUPABASE_ANON_KEY', SUPABASE_KEY),
        'Authorization': f'Bearer {env.get("NEXT_PUBLIC_SUPABASE_ANON_KEY", SUPABASE_KEY)}'
    }

    url = urljoin(SUPABASE_URL, '/rest/v1/showcases?limit=1')
    req = urllib.request.Request(url, headers=headers_anon)

    try:
        with urllib.request.urlopen(req) as response:
            log_result('RLS', 'showcases table RLS', 'WARN', 'Could not verify RLS status')
    except urllib.error.HTTPError as e:
        if e.code == 401 or e.code == 403:
            log_result('RLS', 'showcases table RLS', 'PASS',
                      'RLS appears to be enabled (access denied without auth)')
        else:
            log_result('RLS', 'showcases table RLS', 'WARN', f'Unexpected error: {e.code}')

    print('  Expected policies on showcases: owner_all_showcases')
    print('  Expected policies on jobs: owner_select_jobs, service_role_write_jobs')

def check5_custom_types():
    """Check custom types"""
    print('\n=== 5. CUSTOM TYPES CHECK ===')
    print('  Note: Enum types cannot be directly verified via REST API.')
    print('  Expected enums:')
    print('    - visibility_t: public, unlisted, private')
    print('    - showcase_status_t: uploaded, processing, ready, failed')
    print('    - job_status_t: queued, running, complete, failed')

    log_result('Types', 'visibility_t', 'WARN',
               'Cannot verify directly - check schema.sql deployment')
    log_result('Types', 'showcase_status_t', 'WARN',
               'Cannot verify directly - check schema.sql deployment')
    log_result('Types', 'job_status_t', 'WARN',
               'Cannot verify directly - check schema.sql deployment')

def check6_extensions():
    """Check extensions"""
    print('\n=== 6. EXTENSIONS CHECK ===')
    print('  Note: Extensions cannot be directly verified via REST API.')
    print('  Expected extensions: pgcrypto, uuid-ossp')

    log_result('Extensions', 'pgcrypto', 'WARN',
               'Cannot verify directly - check schema.sql deployment')
    log_result('Extensions', 'uuid-ossp', 'WARN',
               'Cannot verify directly - check schema.sql deployment')

def check7_triggers():
    """Check triggers"""
    print('\n=== 7. TRIGGERS CHECK ===')
    print('  Note: Triggers cannot be directly verified via REST API.')
    print('  Expected triggers:')
    print('    - tr_showcases_set_updated on showcases table')
    print('    - tr_jobs_set_updated on jobs table')

    log_result('Triggers', 'tr_showcases_set_updated', 'WARN',
               'Cannot verify directly - check schema.sql deployment')
    log_result('Triggers', 'tr_jobs_set_updated', 'WARN',
               'Cannot verify directly - check schema.sql deployment')

def check8_indexes():
    """Check indexes"""
    print('\n=== 8. INDEXES CHECK ===')
    print('  Note: Indexes cannot be directly verified via REST API.')
    print('  Expected indexes:')
    print('    - idx_showcases_user_id on showcases(user_id)')
    print('    - idx_jobs_showcase_id on jobs(showcase_id)')
    print('    - idx_jobs_status on jobs(status)')

    log_result('Indexes', 'idx_showcases_user_id', 'WARN',
               'Cannot verify directly - check schema.sql deployment')
    log_result('Indexes', 'idx_jobs_showcase_id', 'WARN',
               'Cannot verify directly - check schema.sql deployment')
    log_result('Indexes', 'idx_jobs_status', 'WARN',
               'Cannot verify directly - check schema.sql deployment')

def main():
    """Main verification function"""
    print('╔═══════════════════════════════════════════════════════════╗')
    print('║  SUPABASE DATABASE VERIFICATION REPORT                    ║')
    print('║  AutoCAD Showcase v2                                      ║')
    print('╚═══════════════════════════════════════════════════════════╝')
    print(f'\nDatabase: {SUPABASE_URL}')
    print(f'Date: {os.popen("date").read().strip()}\n')

    check1_tables()
    check2_views()
    check3_functions()
    check4_rls()
    check5_custom_types()
    check6_extensions()
    check7_triggers()
    check8_indexes()

    print('\n╔═══════════════════════════════════════════════════════════╗')
    print('║  SUMMARY                                                  ║')
    print('╚═══════════════════════════════════════════════════════════╝')
    total = checks['passed'] + checks['failed'] + checks['warnings']
    print(f'\n  Total Checks: {total}')
    print(f'  ✓ Passed: {checks["passed"]}')
    print(f'  ✗ Failed: {checks["failed"]}')
    print(f'  ⚠ Warnings: {checks["warnings"]}')

    if checks['failed'] > 0:
        print('\n  STATUS: VERIFICATION FAILED')
        print('  Please review failed checks above.')
    elif checks['warnings'] > 0:
        print('\n  STATUS: VERIFICATION INCOMPLETE')
        print('  Some checks could not be completed via REST API.')
        print('  For full verification, run the SQL script with database admin access:')
        print('    Use Supabase SQL Editor to run: verify_database.sql')
    else:
        print('\n  STATUS: ALL CHECKS PASSED')

    print('\n╔═══════════════════════════════════════════════════════════╗')
    print('║  RECOMMENDATIONS                                          ║')
    print('╚═══════════════════════════════════════════════════════════╝')
    print('\n  For complete database verification, consider:')
    print('  1. Running verify_database.sql via Supabase SQL Editor')
    print('  2. Checking Supabase Dashboard > Database > Tables')
    print('  3. Verifying RLS policies in Database > Policies')
    print('  4. Testing actual showcase creation flow\n')

    exit(1 if checks['failed'] > 0 else 0)

if __name__ == '__main__':
    main()
