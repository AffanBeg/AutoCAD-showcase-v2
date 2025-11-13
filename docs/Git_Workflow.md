# Git Workflow & Branch Strategy
## Showcase3D Development

---

## 🌳 Branch Structure

```
main (protected)
├── feat/auth-mvp (Frontend + DevOps)
├── feat/backend-libs-mvp (Backend)
├── feat/worker-mvp (Backend)
├── feat/frontend-ui-mvp (Frontend)
└── feat/devops-deploy (DevOps)
```

**Branch Protection Rules:**
- `main` branch: Requires PR review, no force push
- `feat/*` branches: Squash merge to main

---

## 📦 Pull Requests (PRs)

### Phase 1: Authentication & Foundation

#### PR #1: Google OAuth Setup (DevOps)
**Branch:** `feat/auth-mvp`
**Task:** A0
**Files Modified:**
- `docs/GOOGLE_OAUTH_SETUP.md` (new - documentation only)
**Description:**
- Configure Google OAuth in Google Cloud Console
- Enable Google provider in Supabase Dashboard
- Document setup process for future reference
**Reviewer:** You (verify OAuth works via login test)
**Merge Target:** `main`

---

#### PR #2: Supabase Schema Deployment (DevOps)
**Branch:** `feat/backend-schema`
**Tasks:** D1, D2
**Files Modified:**
- `docs/DEPLOYMENT_LOG.md` (new - deployment verification)
**Description:**
- Deploy schema.sql to Supabase
- Deploy rpc_create_showcase.sql
- Create storage buckets (cad-uploaded, cad-converted)
- Verify RLS policies and indexes
**Reviewer:** Backend (verify tables/buckets exist)
**Merge Target:** `main`

---

### Phase 2: Backend Libraries

#### PR #3: Upload & Storage Helpers (Backend)
**Branch:** `feat/backend-libs-mvp`
**Tasks:** B1, B3
**Files Modified:**
- `lib/upload.ts`
- `package.json` (add uuid dependency)
**Description:**
- Implement uploadFile() for cad-uploaded bucket
- Implement getSignedUrl() for cad-converted bucket
- Add TypeScript types for upload result
**Acceptance:**
- [ ] uploadFile() uploads to correct bucket path
- [ ] getSignedUrl() generates 60min signed URLs
- [ ] TypeScript compiles without errors
**Reviewer:** Frontend (will integrate in F1)
**Merge Target:** `main`

---

#### PR #4: Database Query Helpers (Backend)
**Branch:** `feat/backend-libs-mvp`
**Task:** B2
**Files Modified:**
- `lib/db.ts` (new)
- `lib/types.ts` (update with Showcase, Job interfaces)
**Description:**
- Implement getUserShowcases() with RLS
- Implement getShowcaseBySlug() using public_showcases view
- Implement getJobStatus()
- Add TypeScript interfaces
**Acceptance:**
- [ ] RLS enforced (cannot access other users' data)
- [ ] Anonymous access works for public_showcases
- [ ] TypeScript compiles without errors
**Reviewer:** Frontend (will integrate in F2, F3)
**Merge Target:** `main`

---

### Phase 3: Frontend Auth

#### PR #5: Auth Pages & Protected Routes (Frontend)
**Branch:** `feat/auth-mvp`
**Tasks:** A1, A2, A3
**Files Modified:**
- `app/(auth)/login/page.tsx` (new)
- `app/auth/callback/route.ts` (new)
- `components/AuthProvider.tsx` (new)
- `app/layout.tsx` (update - wrap with AuthProvider)
- `middleware.ts` (new)
- `components/Navbar.tsx` (update - add logout)
**Description:**
- Implement login page with Google OAuth
- Implement callback handler for OAuth redirect
- Create AuthProvider context for session management
- Add middleware for protected routes
- Update navbar with login/logout buttons
**Acceptance:**
- [ ] Login with Google works
- [ ] Session persists across page refreshes
- [ ] Protected routes redirect to /login when not authenticated
- [ ] Logout clears session
**Reviewer:** DevOps (verify OAuth flow)
**Merge Target:** `main`

---

### Phase 4: Worker Implementation

#### PR #6: Worker Foundation (Backend)
**Branch:** `feat/worker-mvp`
**Tasks:** W1, W2
**Files Modified:**
- `worker/worker.py` (update)
- `worker/requirements.txt` (new)
**Description:**
- Initialize Supabase client with service role key
- Implement job polling logic (query queued jobs)
- Claim job by updating status to 'running'
- Error handling and logging
**Acceptance:**
- [ ] Worker connects to Supabase on startup
- [ ] Polls jobs table every 5 seconds
- [ ] Claims oldest queued job
- [ ] Handles empty queue gracefully
**Reviewer:** DevOps (will deploy in D4)
**Merge Target:** `main`

---

#### PR #7: File Download & Conversion (Backend)
**Branch:** `feat/worker-mvp`
**Tasks:** W3, W4
**Files Modified:**
- `worker/worker.py` (update)
- `worker/convert_to_stl.py` (update)
**Description:**
- Implement file download from cad-uploaded bucket
- Implement FreeCAD conversion (STEP/OBJ → STL)
- Handle conversion errors
- Clean up temp files
**Acceptance:**
- [ ] Downloads file to /tmp
- [ ] Converts STEP → STL using FreeCAD
- [ ] Converts OBJ → STL
- [ ] Copies STL → STL (passthrough)
- [ ] Validates output file exists
**Reviewer:** DevOps (test locally before deploying)
**Merge Target:** `main`

---

#### PR #8: Upload & Status Updates (Backend)
**Branch:** `feat/worker-mvp`
**Tasks:** W5, W6
**Files Modified:**
- `worker/worker.py` (update)
**Description:**
- Upload converted STL to cad-converted bucket
- Update job status to 'complete' with output_path
- Update showcase status to 'ready'
- Handle errors (mark as 'failed')
**Acceptance:**
- [ ] Uploads STL to correct bucket path
- [ ] Updates job.status = 'complete'
- [ ] Updates showcase.status = 'ready'
- [ ] Updates output_path in both tables
- [ ] Error handling sets status = 'failed'
**Reviewer:** DevOps (verify end-to-end in D4)
**Merge Target:** `main`

---

### Phase 5: Docker & Deployment

#### PR #9: Docker Configuration (DevOps)
**Branch:** `feat/devops-deploy`
**Task:** D3
**Files Modified:**
- `worker/Dockerfile` (update)
- `worker/docker-compose.yml` (verify)
- `worker/requirements.txt` (verify)
**Description:**
- Update Dockerfile with FreeCAD installation
- Verify docker-compose.yml configuration
- Test build locally
**Acceptance:**
- [ ] docker build succeeds
- [ ] FreeCAD installed in image
- [ ] Image size reasonable (<1GB)
- [ ] docker-compose build succeeds
**Reviewer:** Backend (verify worker code compatible)
**Merge Target:** `main`

---

#### PR #10: GCE Deployment Documentation (DevOps)
**Branch:** `feat/devops-deploy`
**Task:** D4
**Files Modified:**
- `docs/GCE_DEPLOYMENT.md` (new)
**Description:**
- Document GCE deployment process
- Include SSH commands, docker commands
- Verify worker running on GCE
- Include troubleshooting section
**Acceptance:**
- [ ] Worker deployed to GCE
- [ ] Container running (docker ps)
- [ ] Logs show "Supabase connection successful"
- [ ] End-to-end test passes (upload → convert → view)
**Reviewer:** Backend (verify worker processes jobs correctly)
**Merge Target:** `main`

---

### Phase 6: Frontend UI

#### PR #11: Upload Flow (Frontend)
**Branch:** `feat/frontend-ui-mvp`
**Task:** F1
**Files Modified:**
- `components/UploadForm.tsx` (update)
- `app/dashboard/new/page.tsx` (update)
**Description:**
- Implement file upload form with validation
- Call uploadFile() from lib/upload.ts
- Call create_showcase_and_job RPC
- Redirect to dashboard on success
**Acceptance:**
- [ ] File input validation (type, size)
- [ ] Upload to Supabase storage works
- [ ] RPC creates showcase + job
- [ ] Redirects to /dashboard
- [ ] Error handling with user-friendly messages
**Reviewer:** Backend (verify storage + DB entries)
**Merge Target:** `main`

---

#### PR #12: Dashboard (Frontend)
**Branch:** `feat/frontend-ui-mvp`
**Task:** F2
**Files Modified:**
- `app/dashboard/page.tsx` (update)
- `components/ShowcaseCard.tsx` (update)
- `components/Navbar.tsx` (update)
- `components/Badge.tsx` (verify)
**Description:**
- Fetch user's showcases using getUserShowcases()
- Display showcase cards with status badges
- Enable "View" button only for ready showcases
- Add logout functionality to Navbar
**Acceptance:**
- [ ] Dashboard loads authenticated user's showcases
- [ ] Status badges display correctly
- [ ] "View" button works for ready showcases
- [ ] Empty state shown when no showcases
- [ ] Logout clears session
**Reviewer:** Backend (verify RLS works, no data leaks)
**Merge Target:** `main`

---

#### PR #13: Viewer Page (Frontend)
**Branch:** `feat/frontend-ui-mvp`
**Task:** F3
**Files Modified:**
- `app/s/[slug]/page.tsx` (update)
- `components/ViewerSTL.tsx` (verify)
**Description:**
- Fetch showcase by slug using getShowcaseBySlug()
- Generate signed URL for STL file
- Pass URL to ViewerSTL component
- Handle "processing" and "failed" states
- Anonymous access for public/unlisted showcases
**Acceptance:**
- [ ] Viewer loads STL model in 3D
- [ ] Anonymous users can view public showcases
- [ ] Processing state shown while converting
- [ ] Failed state shown on errors
- [ ] Not found page for invalid slugs
**Reviewer:** DevOps (end-to-end test)
**Merge Target:** `main`

---

### Phase 7: Final Deployment

#### PR #14: Vercel Deployment Documentation (DevOps)
**Branch:** `feat/devops-deploy`
**Task:** D5
**Files Modified:**
- `docs/VERCEL_DEPLOYMENT.md` (new)
**Description:**
- Document Vercel deployment process
- Include environment variable setup
- Update Google OAuth redirect URIs
- Verify production deployment
**Acceptance:**
- [ ] Frontend deployed to Vercel
- [ ] Environment variables configured
- [ ] Production URL works
- [ ] Google OAuth works on production
- [ ] End-to-end test passes
**Reviewer:** Frontend + Backend (full system test)
**Merge Target:** `main`

---

## 🏷️ Release Tags

After all PRs merged and tested:

```bash
git tag -a v0.1.0-mvp -m "MVP Release: Login → Upload → Convert → View"
git push origin v0.1.0-mvp
```

**Tag Format:**
- `v0.1.0-mvp` - MVP complete
- `v0.2.0-beta` - Beta features (polling, retry, monitoring)
- `v1.0.0` - Production-ready

---

## 📝 PR Template

Use this template for all PRs:

```markdown
## Description
[Brief description of changes]

## Tasks Completed
- [ ] A1 / B1 / D1 / F1 / W1 (check applicable)

## Files Modified
- path/to/file1.ts
- path/to/file2.tsx

## Testing
- [ ] Local testing complete
- [ ] No TypeScript errors
- [ ] No console errors
- [ ] Acceptance criteria met

## Dependencies
- Depends on: [PR #X or None]
- Unblocks: [PR #Y or Task Z]

## Screenshots (if applicable)
[Add screenshots for UI changes]

## Reviewer Notes
[Any special instructions for reviewer]
```

---

## 🔄 Branch Workflow

**Creating a branch:**
```bash
git checkout main
git pull origin main
git checkout -b feat/your-branch-name
```

**Committing changes:**
```bash
git add .
git commit -m "feat: implement upload helper (B1)"
git push origin feat/your-branch-name
```

**Creating a PR:**
1. Go to GitHub repository
2. Click "Compare & pull request"
3. Fill out PR template
4. Request review from appropriate role
5. Wait for approval
6. Squash and merge to main

**After merge:**
```bash
git checkout main
git pull origin main
git branch -d feat/your-branch-name  # Delete local branch
```

---

## 🚨 Merge Conflicts

If you encounter merge conflicts:

1. **Pull latest main:**
   ```bash
   git checkout main
   git pull origin main
   ```

2. **Merge main into your branch:**
   ```bash
   git checkout feat/your-branch-name
   git merge main
   ```

3. **Resolve conflicts:**
   - Open conflicted files
   - Look for `<<<<<<<`, `=======`, `>>>>>>>` markers
   - Keep appropriate changes
   - Remove conflict markers

4. **Commit resolution:**
   ```bash
   git add .
   git commit -m "chore: resolve merge conflicts"
   git push origin feat/your-branch-name
   ```

---

## 📊 PR Review Checklist

**For Reviewers:**

- [ ] Code follows project structure (correct directories)
- [ ] No secrets committed (check .env usage)
- [ ] TypeScript compiles without errors
- [ ] Functions have clear names and comments
- [ ] Error handling implemented
- [ ] Acceptance criteria met
- [ ] No unnecessary dependencies added
- [ ] Tests pass (if applicable)
- [ ] No console.log() in production code (use proper logging)

**Approval Process:**
1. Review code changes
2. Test locally if possible
3. Leave comments or request changes
4. Approve when satisfied
5. PR author squash-merges to main

---

## 🎯 MVP Merge Sequence

**Recommended merge order:**

1. PR #1 (Google OAuth) → `main`
2. PR #2 (Schema) → `main`
3. PR #5 (Auth Pages) → `main` (can parallelize with #3-4)
4. PR #3 (Upload Helpers) → `main`
5. PR #4 (DB Helpers) → `main`
6. PR #6 (Worker Foundation) → `main`
7. PR #7 (Conversion) → `main`
8. PR #8 (Status Updates) → `main`
9. PR #9 (Docker) → `main`
10. PR #10 (GCE Deploy) → `main`
11. PR #11 (Upload Flow) → `main`
12. PR #12 (Dashboard) → `main`
13. PR #13 (Viewer) → `main`
14. PR #14 (Vercel Deploy) → `main`
15. Tag `v0.1.0-mvp`

**Total PRs:** 14
**Estimated Timeline:** 2-3 weeks (with 3 agents working in parallel)

---

## ✅ Post-Merge Verification

After each PR merge:

1. **Pull latest main:**
   ```bash
   git checkout main
   git pull origin main
   ```

2. **Test locally:**
   ```bash
   npm install  # If dependencies changed
   npm run dev  # For frontend changes
   ```

3. **Verify Vercel deployment:**
   - Check Vercel Dashboard → Deployments
   - Verify auto-deploy succeeded

4. **Update Taskboard:**
   - Mark task as ✅ Complete in `Taskboard.md`

---

## 🆘 Rollback Procedure

If a PR breaks production:

**Vercel (Frontend):**
1. Vercel Dashboard → Deployments
2. Find last working deployment
3. Click "Promote to Production"

**GCE (Worker):**
```bash
ssh showcase3d-gce
cd ~/showcase3d
git log  # Find last working commit
git checkout [commit-hash]
cd worker
docker compose down
docker compose build
docker compose up -d
```

**Database (Schema):**
- Supabase doesn't support rollback easily
- Avoid destructive schema changes in PRs
- Always use `IF EXISTS` checks in SQL

---

Good luck with the PRs! 🚀
