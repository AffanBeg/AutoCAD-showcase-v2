# YOUR COMPLETE GUIDE - Showcase3D
## Everything You Need to Do, Step by Step

> **READ THIS FIRST:** This guide tells you EXACTLY what to do, when to do it, and what to tell each chatbot. Follow steps in order. Don't skip ahead.

---

## 📋 **PREREQUISITES (Do This First)**

### What You Need:

- [ ] **Google Account** (for Google OAuth)
- [ ] **Supabase Account** (free tier is fine)
  - Sign up at: https://app.supabase.com/
  - Create a project (if you haven't already)
  - Write down your project name: ________________
- [ ] **Vercel Account** (for frontend deployment)
  - Sign up at: https://vercel.com/
- [ ] **Google Cloud Account** (for OAuth credentials)
  - Sign up at: https://console.cloud.google.com/
- [ ] **GCE VM** (you already have this at 35.192.97.17)
  - Verify SSH works: `ssh -i "C:\Users\badaf\.ssh\google_compute_engine" badaf@35.192.97.17`
- [ ] **This project** on your local machine
  - Path: `C:\Users\badaf\Documents\VVork\AutoCAD-showcase-v2`
- [ ] **Three browser tabs/windows** for three chatbot sessions
  - Tab 1: DevOps Chatbot
  - Tab 2: Backend Chatbot
  - Tab 3: Frontend Chatbot

---

## 🎯 **PHASE 0: MANUAL SETUP (YOU DO THIS)**

These steps MUST be done by you manually before chatbots can work.

---

### **STEP 1: Set Up Google OAuth (15-20 minutes)**

#### 1.1 Create Google Cloud Project

1. Go to: https://console.cloud.google.com/
2. Sign in with your Google account
3. At the top, click **"Select a project"** dropdown
4. Click **"NEW PROJECT"**
5. Enter project name: **Showcase3D**
6. Click **"Create"**
7. Wait 30 seconds for project to be created
8. Make sure "Showcase3D" is selected in the project dropdown (top left)

#### 1.2 Configure OAuth Consent Screen

1. In Google Cloud Console, click the hamburger menu (☰) in top-left
2. Navigate to: **APIs & Services** → **OAuth consent screen**
3. Select **"External"** (unless you have Google Workspace, then use Internal)
4. Click **"CREATE"**

**Fill out OAuth consent screen:**

| Field | What to Enter |
|-------|---------------|
| App name | `Showcase3D` |
| User support email | Your email address (select from dropdown) |
| App logo | (Skip for now - optional) |
| Application home page | (Leave blank for now) |
| Authorized domains | (Leave blank for now) |
| Developer contact information | Your email address |

5. Click **"SAVE AND CONTINUE"**

**Scopes (Step 2 of 4):**
6. Click **"ADD OR REMOVE SCOPES"**
7. You'll see many scopes. The default ones are fine:
   - `.../auth/userinfo.email`
   - `.../auth/userinfo.profile`
   - `openid`
8. Click **"UPDATE"**
9. Click **"SAVE AND CONTINUE"**

**Test users (Step 3 of 4):**
10. Click **"ADD USERS"**
11. Enter your email address (the one you'll use to test login)
12. Click **"ADD"**
13. Click **"SAVE AND CONTINUE"**

**Summary (Step 4 of 4):**
14. Review the summary
15. Click **"BACK TO DASHBOARD"**

#### 1.3 Create OAuth Credentials

1. In the left sidebar, click **"Credentials"**
2. Click **"+ CREATE CREDENTIALS"** at the top
3. Select **"OAuth 2.0 Client ID"**

**If prompted to configure consent screen:**
- You already did this in step 1.2, so this shouldn't happen
- If it does, go back and complete step 1.2

**Create OAuth client ID:**

4. Application type: Select **"Web application"**
5. Name: Enter `Showcase3D Web Client`

**Authorized redirect URIs:**
6. Click **"+ ADD URI"** under "Authorized redirect URIs"
7. **IMPORTANT:** You need your Supabase project URL first. Do this:

   **Open a new tab** and go to: https://app.supabase.com/
   - Click on your Showcase3D project (or create one if you haven't)
   - In the left sidebar, click **Settings** (gear icon at bottom)
   - Click **API**
   - Look for **"Project URL"** - it looks like: `https://abcdefghijk.supabase.co`
   - **Copy this URL** (you'll need it multiple times)

8. **Back in Google Cloud Console tab**, paste this in the redirect URI field:
   ```
   https://[YOUR-PROJECT-ID].supabase.co/auth/v1/callback
   ```
   **Replace `[YOUR-PROJECT-ID]`** with your actual Supabase project URL

   **Example:** If your Supabase URL is `https://xyzabc123.supabase.co`, then enter:
   ```
   https://xyzabc123.supabase.co/auth/v1/callback
   ```

9. Click **"CREATE"**

**IMPORTANT - Save These Credentials:**

10. A popup will appear with:
    - **Client ID** (starts with something like `123456789-abc...googleusercontent.com`)
    - **Client Secret** (starts with `GOCSPX-...`)

11. **COPY BOTH OF THESE** and paste them somewhere safe (Notepad, Notes app, etc.)
    - Client ID: ________________________________
    - Client Secret: ________________________________

12. Click **"OK"** to close the popup

**You're done with Google Cloud Console for now!** ✅

---

### **STEP 2: Configure Supabase Auth (10 minutes)**

#### 2.1 Enable Google Provider

1. Go to: https://app.supabase.com/
2. Click on your **Showcase3D** project
3. In the left sidebar, click **Authentication** (🔐 icon)
4. Click **"Providers"** tab at the top
5. Scroll down and find **"Google"**
6. Click on **"Google"** to expand it

**Configure Google Provider:**

7. Toggle **"Enable Sign in with Google"** to ON (it will turn green)
8. Paste your **Client ID** from Step 1.3 (the one you saved)
9. Paste your **Client Secret** from Step 1.3
10. Leave other settings as default
11. Click **"Save"** at the bottom

#### 2.2 Verify Redirect URL

12. Still in the Google provider settings, look for **"Callback URL (for OAuth)"**
13. You'll see something like: `https://[your-project].supabase.co/auth/v1/callback`
14. **Verify this matches** what you entered in Google Cloud Console Step 1.3
15. If it doesn't match, go back to Google Cloud Console → Credentials → Edit your OAuth client → Update the redirect URI

**You're done with Supabase Auth setup!** ✅

---

### **STEP 3: Prepare Your Environment Files (5 minutes)**

#### 3.1 Get Supabase Credentials

1. Still in Supabase Dashboard, go to **Settings** → **API** (in left sidebar)
2. You'll see three important pieces of information:

| What You Need | Where to Find It | Starts With |
|---------------|------------------|-------------|
| **Project URL** | Under "Project URL" | `https://` |
| **Anon/Public Key** | Under "Project API keys" → `anon` `public` | `eyJ...` (short-ish) |
| **Service Role Key** | Under "Project API keys" → `service_role` (click "Reveal" first) | `eyJ...` (very long) |

3. **Copy all three** and save them:
   - Project URL: ________________________________
   - Anon Key: ________________________________
   - Service Role Key: ________________________________

#### 3.2 Update Your .env File

1. On your computer, navigate to: `C:\Users\badaf\Documents\VVork\AutoCAD-showcase-v2`
2. Open the `.env` file in a text editor (Notepad, VS Code, etc.)
3. Update it with your values:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://[YOUR-PROJECT-ID].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ[YOUR-ANON-KEY]
SUPABASE_SERVICE_ROLE_KEY=eyJ[YOUR-SERVICE-ROLE-KEY]

# Worker
POLL_INTERVAL_SECONDS=5
```

4. **Replace:**
   - `[YOUR-PROJECT-ID]` with your actual Supabase project URL
   - `[YOUR-ANON-KEY]` with the anon key you copied
   - `[YOUR-SERVICE-ROLE-KEY]` with the service role key you copied

5. **Save the file**

**IMPORTANT:**
- The `NEXT_PUBLIC_` prefix is required for frontend variables
- The `SUPABASE_SERVICE_ROLE_KEY` does NOT have `NEXT_PUBLIC_` prefix (it's backend-only)

#### 3.3 Verify .env.example (Optional)

1. Open `.env.example` in the same folder
2. Make sure it looks like this (with NO real values):

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Worker
POLL_INTERVAL_SECONDS=5
```

3. This is just a template - never put real secrets in `.env.example`

**You're done with environment setup!** ✅

---

### **STEP 4: Verify Git Setup (2 minutes)**

1. Open Command Prompt or PowerShell
2. Navigate to project:
   ```bash
   cd C:\Users\badaf\Documents\VVork\AutoCAD-showcase-v2
   ```

3. Check git status:
   ```bash
   git status
   ```

4. **Verify `.env` is NOT staged:**
   - You should see `.env` listed under "Untracked files" or not at all
   - If you see `.env` under "Changes to be committed", run:
     ```bash
     git reset .env
     ```

5. **Add .env to .gitignore** (if not already there):
   ```bash
   echo .env >> .gitignore
   ```

6. Commit .gitignore change (if needed):
   ```bash
   git add .gitignore
   git commit -m "chore: ensure .env is ignored"
   ```

**You're done with manual setup!** ✅

---

## 🤖 **PHASE 1: SET UP YOUR THREE CHATBOTS**

Now you'll create three separate AI chatbot sessions to work in parallel.

### **OPTION A: Using Claude Code (Recommended)**

If you're using Claude Code (the tool you're in right now), open THREE separate Claude Code windows/instances.

### **OPTION B: Using ChatGPT or Claude.ai**

Open three browser tabs:
- Tab 1: https://chatgpt.com/ (or https://claude.ai/)
- Tab 2: https://chatgpt.com/ (or https://claude.ai/)
- Tab 3: https://chatgpt.com/ (or https://claude.ai/)

Each tab will be a separate chatbot session.

---

## 🎯 **CHATBOT 1: DEVOPS AGENT**

### **Initial Prompt (Copy and paste this exactly):**

```
You are the DevOps specialist for Showcase3D, a CAD file viewer application.

Your responsibilities:
- Deploy Supabase database schema
- Configure Supabase storage buckets
- Build and deploy Docker worker to Google Cloud VM
- Deploy frontend to Vercel

READ THESE FILES FIRST (in order):
1. C:\Users\badaf\Documents\VVork\AutoCAD-showcase-v2\docs\Plan.md
2. C:\Users\badaf\Documents\VVork\AutoCAD-showcase-v2\docs\DevOps_Tasks.md

After reading, tell me:
- What is your first task?
- What manual steps have already been completed by the user?
- What do you need to do next?

START with task D1 (Supabase Schema Deployment) because A0 (Google OAuth) has already been completed manually by the user.
```

### **What This Chatbot Will Do:**
- Task D1: Deploy database schema to Supabase
- Task D2: Create storage buckets in Supabase
- Task D3: Build Docker image for worker
- Task D4: Deploy worker to GCE VM
- Task D5: Deploy frontend to Vercel

### **When to Start:**
✅ **Start NOW** (after reading this section)

---

## 🎯 **CHATBOT 2: BACKEND AGENT**

### **Initial Prompt (Copy and paste this exactly):**

```
You are the Backend developer for Showcase3D, a CAD file viewer application.

Your responsibilities:
- Implement Supabase upload helpers (TypeScript)
- Implement database query helpers (TypeScript)
- Implement worker service (Python) for CAD file conversion using FreeCAD
- Process jobs: download CAD files, convert to STL, upload results

READ THESE FILES FIRST (in order):
1. C:\Users\badaf\Documents\VVork\AutoCAD-showcase-v2\docs\Plan.md
2. C:\Users\badaf\Documents\VVork\AutoCAD-showcase-v2\docs\Backend_Tasks.md

After reading, tell me:
- What is your first task?
- What dependencies do you need from DevOps before you can start?
- What files will you modify?

WAIT for DevOps to complete D1 (schema deployment) and D2 (storage buckets) before starting your first task (B1).
```

### **What This Chatbot Will Do:**
- Task B1: Implement `uploadFile()` in `/lib/upload.ts`
- Task B2: Implement database helpers in `/lib/db.ts`
- Task B3: Implement `getSignedUrl()` in `/lib/upload.ts`
- Tasks W1-W6: Implement worker service in `/worker/worker.py`

### **When to Start:**
⏸️ **WAIT** - This chatbot should wait until DevOps completes D1 and D2 (about 15-20 minutes)

---

## 🎯 **CHATBOT 3: FRONTEND AGENT**

### **Initial Prompt (Copy and paste this exactly):**

```
You are the Frontend developer for Showcase3D, a CAD file viewer application built with Next.js 14.

Your responsibilities:
- Implement Google OAuth login pages
- Implement protected routes and authentication context
- Implement upload form for CAD files
- Implement dashboard to view user's showcases
- Implement 3D viewer page for converted STL files

READ THESE FILES FIRST (in order):
1. C:\Users\badaf\Documents\VVork\AutoCAD-showcase-v2\docs\Plan.md
2. C:\Users\badaf\Documents\VVork\AutoCAD-showcase-v2\docs\Frontend_Tasks.md

After reading, tell me:
- What is your first task?
- What dependencies do you need from DevOps before you can start?
- What files will you create/modify?

START with task A1 (Login Page) after DevOps confirms that Google OAuth is configured (A0 was done manually by the user).
```

### **What This Chatbot Will Do:**
- Task A1: Create login page (`/app/(auth)/login/page.tsx`)
- Task A2: Create auth callback handler (`/app/auth/callback/route.ts`)
- Task A3: Implement protected routes and auth context
- Task F1: Implement upload form
- Task F2: Implement dashboard
- Task F3: Implement viewer page

### **When to Start:**
✅ **Start NOW** - Frontend can start building auth pages immediately (A0 is done)

---

## 📅 **YOUR WORKFLOW - WHAT TO DO WHEN**

### **RIGHT NOW (Next 10 minutes):**

1. **Start DevOps chatbot** (Chatbot 1)
   - Copy/paste the DevOps prompt
   - It will ask you to confirm schema files are ready
   - Tell it: "Yes, proceed with D1 (deploy schema)"

2. **Start Frontend chatbot** (Chatbot 3)
   - Copy/paste the Frontend prompt
   - It will start working on A1 (login page)
   - Let it work

3. **Wait on Backend chatbot** (Chatbot 2) for now

---

### **After DevOps Completes D1 and D2 (~20 minutes):**

DevOps chatbot will report something like:
```
✅ Task D1 complete. Schema deployed to Supabase.
✅ Task D2 complete. Storage buckets created.
Ready for Backend to proceed with B1, B2, B3.
```

**When you see this:**

4. **Start Backend chatbot** (Chatbot 2)
   - Copy/paste the Backend prompt
   - Tell it: "DevOps has completed D1 and D2. Please start with B1 (upload helper)"

---

### **Coordination Between Chatbots:**

As chatbots complete tasks, they'll report progress. You need to relay messages:

**Example Flow:**

1. **Backend completes B1:**
   ```
   ✅ Task B1 complete. uploadFile() implemented in /lib/upload.ts.
   Ready for Frontend to use in F1 (Upload Flow).
   ```

2. **You tell Frontend chatbot:**
   ```
   Backend has completed B1. The uploadFile() function is ready in /lib/upload.ts.
   You can now proceed with F1 (Upload Flow Implementation).
   ```

3. **Frontend starts F1** and works on upload form

**You are the coordinator** - chatbots can't talk to each other, so you relay messages.

---

## 📊 **TASK DEPENDENCY CHART**

Use this to know what depends on what:

```
YOU (Manual Setup)
  ├─> A0: Google OAuth ✅ DONE
  ├─> .env file ✅ DONE
  └─> Supabase project ✅ DONE

DevOps Chatbot
  ├─> D1: Deploy Schema (START NOW)
  │     └─> BLOCKS: B1, B2, W1
  ├─> D2: Create Buckets (START NOW)
  │     └─> BLOCKS: B1, B3, W3
  ├─> D3: Docker Build (wait for W1-W6)
  ├─> D4: Deploy Worker (wait for D3)
  └─> D5: Deploy Frontend (wait for F1, F2, F3)

Frontend Chatbot
  ├─> A1: Login Page (START NOW)
  ├─> A2: Auth Callback (wait for A1)
  ├─> A3: Protected Routes (wait for A2)
  ├─> F1: Upload Flow (wait for B1, A3)
  ├─> F2: Dashboard (wait for B2, A3)
  └─> F3: Viewer (wait for B3)

Backend Chatbot
  ├─> B1: Upload Helper (wait for D2)
  │     └─> UNBLOCKS: F1
  ├─> B2: DB Helpers (wait for D1)
  │     └─> UNBLOCKS: F2, F3
  ├─> B3: Signed URLs (wait for D2)
  │     └─> UNBLOCKS: F3
  ├─> W1: Worker - Supabase Client (wait for D1, D2)
  ├─> W2: Worker - Job Polling (wait for W1)
  ├─> W3: Worker - File Download (wait for W2)
  ├─> W4: Worker - FreeCAD Conversion (wait for W3)
  ├─> W5: Worker - Upload Converted (wait for W4)
  └─> W6: Worker - Status Update (wait for W5)
        └─> UNBLOCKS: D3
```

---

## ✅ **CHECKPOINTS - HOW TO KNOW YOU'RE ON TRACK**

### **Checkpoint 1: After 30 Minutes**

You should have:
- [ ] DevOps completed D1 (schema deployed)
- [ ] DevOps completed D2 (buckets created)
- [ ] Frontend completed A1 (login page exists)
- [ ] Frontend working on A2 or A3
- [ ] Backend started on B1 or B2

**If not, troubleshoot:**
- Check Supabase Dashboard → SQL Editor for schema
- Check Supabase Dashboard → Storage for buckets
- Check chatbot responses for errors

---

### **Checkpoint 2: After 1-2 Hours**

You should have:
- [ ] Frontend completed A1, A2, A3 (auth pages + protected routes)
- [ ] Backend completed B1, B2, B3 (upload helpers + DB queries)
- [ ] Backend started on W1-W6 (worker implementation)

**Test login at this point:**
1. Run `npm run dev` in your project folder
2. Navigate to `http://localhost:3000/login`
3. Click "Login with Google"
4. Should redirect to Google → authorize → redirect back
5. Should land on `/dashboard`

**If login doesn't work:**
- Check Google OAuth redirect URIs match exactly
- Check Supabase Auth → Providers → Google is enabled
- Check `.env` has correct NEXT_PUBLIC_SUPABASE_URL and ANON_KEY
- Check browser console for errors

---

### **Checkpoint 3: After 3-4 Hours**

You should have:
- [ ] Backend completed W1-W6 (worker fully implemented)
- [ ] DevOps completed D3 (Docker image built)
- [ ] Frontend started on F1, F2, F3 (UI pages)

**Test worker locally at this point:**
1. Make sure Docker Desktop is running (if on Windows)
2. Navigate to `/worker` folder
3. Run `docker compose build`
4. Should build successfully without errors

---

### **Checkpoint 4: After 5-6 Hours (End of Day 1)**

You should have:
- [ ] DevOps completed D4 (worker deployed to GCE)
- [ ] Frontend completed F1, F2, F3 (upload, dashboard, viewer)
- [ ] DevOps working on D5 (Vercel deployment)

**Test worker on GCE:**
1. SSH to GCE: `ssh -i "C:\Users\badaf\.ssh\google_compute_engine" badaf@35.192.97.17`
2. Run: `docker logs -f showcase3d-worker`
3. Should see: "Supabase connection successful"
4. Should see: "polling for new jobs..."

---

### **Final Checkpoint: MVP Complete**

You should have:
- [ ] DevOps completed D5 (frontend deployed to Vercel)
- [ ] All tasks marked complete in `/docs/Taskboard.md`
- [ ] End-to-end test passes (see below)

---

## 🧪 **END-TO-END TEST (MVP Complete)**

Run this test to verify everything works:

### **Test 1: Authentication**
1. Go to your Vercel URL (e.g., `https://showcase3d.vercel.app`)
2. Click "Login with Google"
3. Authorize with Google account
4. Should redirect to `/dashboard`
5. Should see "My Showcases" heading
6. ✅ **PASS** if you land on dashboard

### **Test 2: Upload**
1. Click "New Showcase" button
2. Enter title: "Test Upload"
3. Select a small STEP file (<5MB) from your computer
   - Don't have a STEP file? Download test file from: https://grabcad.com/library (search "step file")
4. Click "Upload"
5. Should show "Uploading..." then redirect to dashboard
6. ✅ **PASS** if upload succeeds and redirects

### **Test 3: Conversion**
1. On dashboard, find your uploaded showcase
2. Status should show "uploaded" or "processing"
3. Wait 10-30 seconds
4. Refresh the page
5. Status should change to "ready" (green badge)
6. ✅ **PASS** if status becomes "ready"

**If stuck on "processing":**
- SSH to GCE and check worker logs: `docker logs -f showcase3d-worker`
- Look for errors in conversion
- Check Supabase Dashboard → Storage → `cad-converted` bucket for output file

### **Test 4: Viewer**
1. Click "View" button on your showcase
2. Should navigate to `/s/[some-slug]`
3. 3D viewer should load with your STL model
4. You should be able to rotate the model (click and drag)
5. ✅ **PASS** if viewer loads and shows 3D model

### **Test 5: Public Sharing**
1. Copy the URL from Test 4 (e.g., `https://showcase3d.vercel.app/s/test-upload`)
2. Open an Incognito/Private browser window
3. Paste the URL (don't log in)
4. Viewer should still load (if showcase visibility is "public" or "unlisted")
5. ✅ **PASS** if anonymous user can view

### **Test 6: Logout**
1. Click "Logout" in navbar
2. Should redirect to homepage
3. Try to access `/dashboard` directly
4. Should redirect to `/login`
5. ✅ **PASS** if logout clears session

**If all 6 tests pass: 🎉 MVP COMPLETE!**

---

## 🚨 **TROUBLESHOOTING GUIDE**

### **Problem: DevOps can't deploy schema (D1)**

**Symptoms:** SQL errors in Supabase SQL Editor

**Solutions:**
1. Make sure you're in the correct Supabase project
2. Check that `/docs/schema.sql` file exists and is complete
3. Try running schema.sql section by section (not all at once)
4. Check Supabase Dashboard → Database → Tables to see what's there
5. If tables already exist, schema will skip them (this is OK)

---

### **Problem: Backend can't upload files (B1)**

**Symptoms:** "Upload failed" or "Not authenticated" errors

**Solutions:**
1. Check `.env` has `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
2. Verify bucket `cad-uploaded` exists in Supabase Dashboard → Storage
3. Check RLS policy on bucket allows authenticated users to upload
4. Make sure you're logged in when testing upload
5. Check browser console (F12) for specific error messages

---

### **Problem: Worker won't connect to Supabase (W1)**

**Symptoms:** "Supabase connection failed" in worker logs

**Solutions:**
1. Check `.env` on GCE has `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`
2. **IMPORTANT:** Make sure you're using SERVICE_ROLE_KEY, not ANON_KEY
3. Verify key has no extra spaces or line breaks
4. Test connection from GCE:
   ```bash
   curl https://[your-project].supabase.co
   ```
   Should return HTML (not timeout)
5. Check GCE firewall allows outbound HTTPS (port 443)

---

### **Problem: Worker can't convert files (W4)**

**Symptoms:** "FreeCAD conversion failed" in logs

**Solutions:**
1. Check FreeCAD is installed in Docker image:
   ```bash
   docker run --rm showcase3d-worker freecad --version
   ```
   Should output version number
2. Try converting a simple STEP file first (complex files may fail)
3. Check `/worker/convert_to_stl.py` for errors
4. Look at worker logs for specific FreeCAD error messages
5. Test conversion manually:
   ```bash
   docker exec -it showcase3d-worker python convert_to_stl.py /path/to/test.step /path/to/output.stl
   ```

---

### **Problem: Frontend login redirect fails**

**Symptoms:** After Google consent, redirects to error page or 404

**Solutions:**
1. Check Google OAuth redirect URI **exactly matches** Supabase callback URL
   - Google: `https://[project].supabase.co/auth/v1/callback`
   - Supabase: Same URL
2. Make sure Google OAuth app is in "Production" mode (not "Testing")
3. Check Supabase Auth → Providers → Google is enabled
4. Clear browser cookies and try again
5. Check browser console (F12) for specific error messages

---

### **Problem: Viewer doesn't load STL**

**Symptoms:** Blank viewer or "Failed to load 3D model"

**Solutions:**
1. Check file exists in Supabase Dashboard → Storage → `cad-converted`
2. Verify signed URL is being generated (check browser Network tab)
3. Try opening signed URL directly in browser (should download STL file)
4. Check STL file is valid (download and open in MeshLab or online viewer)
5. Check browser console for CORS errors (Supabase should handle CORS automatically)

---

### **Problem: Vercel deployment fails (D5)**

**Symptoms:** Build errors in Vercel dashboard

**Solutions:**
1. Test build locally first:
   ```bash
   npm run build
   ```
   Should complete without errors
2. Check Vercel environment variables are set:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Make sure all dependencies in `package.json` are installed:
   ```bash
   npm install
   ```
4. Check Vercel build logs for specific error messages
5. Try redeploying: Vercel Dashboard → Deployments → Redeploy

---

## 📞 **GETTING HELP FROM CHATBOTS**

If something breaks and you don't know why, ask the relevant chatbot:

**For database/schema issues:**
```
DevOps chatbot, I'm getting this error when trying to [action]: [paste error message]
What should I check? How do I fix this?
```

**For backend/worker issues:**
```
Backend chatbot, the worker is failing with this error: [paste error]
What does this mean? How do I debug it?
```

**For frontend/UI issues:**
```
Frontend chatbot, the login page shows this error: [paste error]
What's wrong? How do I fix it?
```

Chatbots can help debug if you give them:
- Exact error message
- What you were trying to do
- What files you modified
- Relevant logs

---

## 🎯 **FINAL CHECKLIST - YOU'RE DONE WHEN:**

- [ ] ✅ You completed manual setup (Phase 0)
- [ ] ✅ DevOps completed all D1-D5 tasks
- [ ] ✅ Backend completed all B1-B3 and W1-W6 tasks
- [ ] ✅ Frontend completed all A1-A3 and F1-F3 tasks
- [ ] ✅ All 6 end-to-end tests pass
- [ ] ✅ Worker is running on GCE (check logs)
- [ ] ✅ Frontend is deployed to Vercel (check URL)
- [ ] ✅ You can demo the app to someone:
  - Login with Google
  - Upload a CAD file
  - Wait for conversion
  - View 3D model
  - Share link with them (they can view without login)

**When all checkboxes are checked: 🎉 YOU'RE DONE WITH MVP!**

---

## 🚀 **WHAT'S NEXT? (After MVP)**

Once MVP is complete and tested, you can add Beta features:

**Beta Tasks:**
- F4: Real-time status polling (dashboard auto-updates)
- F5: Better error handling and UX (toast notifications, loading skeletons)
- B4: File validation (magic bytes check)
- W7: Retry logic (retry failed conversions up to 3 times)
- D6: Monitoring and logging (GCE monitoring, log aggregation)

**To start Beta:**
Tell each chatbot:
```
MVP is complete and tested. Please proceed with Beta tasks:
- DevOps: D6 (Monitoring)
- Backend: B4 (File Validation) and W7 (Retry Logic)
- Frontend: F4 (Status Polling) and F5 (Error Handling)
```

---

## 💡 **TIPS FOR SUCCESS**

1. **Don't skip Phase 0** - Manual setup MUST be done first
2. **Don't rush chatbots** - Let them complete tasks fully before moving on
3. **Test at checkpoints** - Don't wait until the end to test
4. **Read error messages** - They usually tell you exactly what's wrong
5. **Check Supabase Dashboard** frequently - Verify data is being created
6. **Check worker logs** frequently - See what the worker is doing
7. **Keep credentials safe** - Never commit `.env` to Git
8. **Ask chatbots for help** - They can debug issues if you provide errors
9. **Take breaks** - This is a 5-6 hour project, not a 30-minute sprint
10. **Celebrate checkpoints** - Pat yourself on the back when tests pass!

---

## 📚 **QUICK REFERENCE - IMPORTANT LINKS**

| What | URL |
|------|-----|
| Google Cloud Console | https://console.cloud.google.com/ |
| Supabase Dashboard | https://app.supabase.com/ |
| Vercel Dashboard | https://vercel.com/dashboard |
| Your Local Project | `C:\Users\badaf\Documents\VVork\AutoCAD-showcase-v2` |
| DevOps Tasks | `/docs/DevOps_Tasks.md` |
| Backend Tasks | `/docs/Backend_Tasks.md` |
| Frontend Tasks | `/docs/Frontend_Tasks.md` |
| Master Plan | `/docs/Plan.md` |
| Taskboard | `/docs/Taskboard.md` |

---

## 🎓 **UNDERSTANDING THE ARCHITECTURE**

If you're curious how it all fits together:

```
USER
  ↓
FRONTEND (Vercel - Next.js)
  ↓
SUPABASE (Auth + Database + Storage)
  ↓
WORKER (GCE VM - Docker + Python + FreeCAD)
  ↓
CONVERTED FILES (Supabase Storage)
  ↓
3D VIEWER (Frontend - Three.js)
```

**Flow:**
1. User logs in with Google OAuth (Supabase Auth)
2. User uploads CAD file (Frontend → Supabase Storage)
3. Frontend creates job in database (Supabase DB)
4. Worker polls for jobs (GCE → Supabase DB)
5. Worker downloads file (GCE → Supabase Storage)
6. Worker converts to STL (FreeCAD on GCE)
7. Worker uploads STL (GCE → Supabase Storage)
8. Worker updates job status (GCE → Supabase DB)
9. Frontend polls status (Frontend → Supabase DB)
10. Frontend loads STL (Frontend → Supabase Storage signed URL)
11. Viewer displays 3D model (Three.js in browser)

---

**Good luck! You've got this! 🚀**

**Time estimate:**
- Phase 0 (Manual setup): 30-45 minutes
- Phase 1 (Chatbot setup): 5 minutes
- Chatbots working: 4-6 hours total
- Testing: 30 minutes
- **Total: 5-7 hours** (can be split across multiple days)

**Questions?**
- Re-read the relevant section
- Check troubleshooting guide
- Ask the chatbots for help
- Check error messages carefully

You're ready to start! Begin with Phase 0, Step 1. 📋
