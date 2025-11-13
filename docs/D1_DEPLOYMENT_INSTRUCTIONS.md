# D1: Schema Deployment Instructions

## 🎯 Goal
Deploy database schema, tables, RLS policies, and RPC functions to Supabase.

---

## 📋 Step-by-Step Deployment

### Step 1: Open Supabase SQL Editor

1. Go to: https://app.supabase.com/project/laqkjozqcpemaqgdnsix
2. Click **SQL Editor** in the left sidebar
3. Click **New query**

---

### Step 2: Deploy Main Schema

**File to use:** `docs/schema.sql`

1. Open `docs/schema.sql` in your text editor
2. Copy the entire contents (Ctrl+A, Ctrl+C)
3. Paste into Supabase SQL Editor
4. Click **Run** (or press Ctrl+Enter)
5. ✅ Wait for "Success" message

**What this creates:**
- Extensions: pgcrypto, uuid-ossp
- Custom types: visibility_t, showcase_status_t, job_status_t
- Tables: showcases, jobs
- View: public_showcases
- RLS policies for security
- Indexes for performance
- Helper function: ensure_unique_slug()

---

### Step 3: Deploy RPC Function

**File to use:** `docs/rpc_create_showcase.sql`

1. Click **New query** in Supabase SQL Editor
2. Open `docs/rpc_create_showcase.sql` in your text editor
3. Copy the entire contents
4. Paste into Supabase SQL Editor
5. Click **Run**
6. ✅ Wait for "Success" message

**What this creates:**
- Function: create_showcase_and_job() - Used by frontend to atomically create showcase + job

---

### Step 4: Verify Deployment

**File to use:** `docs/d1_verification.sql`

1. Click **New query** in Supabase SQL Editor
2. Open `docs/d1_verification.sql` in your text editor
3. Copy the entire contents
4. Paste into Supabase SQL Editor
5. Click **Run**

**Expected Output:**

| type     | name                      |
|----------|---------------------------|
| Function | create_showcase_and_job   |
| Function | ensure_unique_slug        |
| Function | tg_set_updated_at         |
| Tables   | jobs                      |
| Tables   | showcases                 |
| View     | public_showcases          |

**Plus RLS check:**

| tablename  | RLS Enabled |
|------------|-------------|
| showcases  | t           |
| jobs       | t           |

---

## ✅ Success Criteria

- [ ] schema.sql deployed without errors
- [ ] rpc_create_showcase.sql deployed without errors
- [ ] Verification query shows 2 tables, 1 view, 3 functions
- [ ] RLS enabled on both tables (t = true)
- [ ] No error messages in Supabase SQL Editor

---

## 🚨 Troubleshooting

**Error: "relation already exists"**
- This is OK! It means the schema was already deployed
- The `CREATE IF NOT EXISTS` statements will skip existing objects

**Error: "permission denied"**
- Make sure you're logged into the correct Supabase project
- Verify you have admin/owner access to the project

**Error: "syntax error"**
- Make sure you copied the ENTIRE file contents
- Check for any accidental line breaks or truncation

---

## 📞 After Completion

Report back to DevOps chatbot:
- ✅ "D1 complete. Paste verification output here."
- Or if errors: "D1 failed with error: [paste error message]"
