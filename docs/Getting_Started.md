# Getting Started - Showcase3D
## Multi-Agent Development Guide

This project uses a **role-based development approach** with three specialized AI agents (chatbots) working in parallel.

---

## 📚 Documentation Overview

| File | Purpose | Give To |
|------|---------|---------|
| **Plan.md** | High-level architecture, milestones, dependencies | Everyone (read first) |
| **Taskboard.md** | Master task tracker (all roles) | Project Manager / You |
| **Frontend_Tasks.md** | Detailed frontend tasks with code examples | Frontend Chatbot |
| **Backend_Tasks.md** | Detailed backend tasks with code examples | Backend Chatbot |
| **DevOps_Tasks.md** | Detailed infrastructure tasks with commands | DevOps Chatbot |

---

## 🚀 Quick Start

### Step 1: Read the Plan (You)
Start by reading `Plan.md` to understand:
- Project architecture
- MVP vs Beta scope
- Dependencies between roles
- Timeline estimates

### Step 2: Assign Roles to Chatbots

You'll use **three separate chat sessions** (e.g., three Claude Code windows, or three ChatGPT/Claude conversations):

**Session 1: DevOps Agent**
```
Prompt:
"You are the DevOps specialist for Showcase3D. Read /docs/DevOps_Tasks.md
and /docs/Plan.md. Start with task A0 (Google OAuth Setup).
Report progress after each task completion."
```

**Session 2: Backend Agent**
```
Prompt:
"You are the Backend developer for Showcase3D. Read /docs/Backend_Tasks.md
and /docs/Plan.md. Wait for DevOps to complete D1 and D2, then start with B1.
Report progress after each task completion."
```

**Session 3: Frontend Agent**
```
Prompt:
"You are the Frontend developer for Showcase3D. Read /docs/Frontend_Tasks.md
and /docs/Plan.md. Wait for DevOps to complete A0, then start with A1.
Report progress after each task completion."
```

---

## 📋 Workflow

### Phase 1: Foundation (DevOps-led)
1. **DevOps:** Complete A0, D1, D2 (Google OAuth + Supabase setup)
2. **DevOps:** Report to other agents: "✅ A0, D1, D2 complete. Ready for Backend + Frontend."

### Phase 2: Backend + Frontend (Parallel)
3. **Frontend:** Complete A1, A2, A3 (Auth pages + protected routes)
4. **Backend:** Complete B1, B2, B3 (Upload helpers + DB queries)
5. Both report when complete

### Phase 3: Worker (Backend-led)
6. **Backend:** Complete W1 → W2 → W3 → W4 → W5 → W6 (Worker implementation)
7. **Backend:** Report: "✅ Worker code complete. Ready for D3."

### Phase 4: Deployment (DevOps-led)
8. **DevOps:** Complete D3 (Docker build) → D4 (Deploy worker to GCE)
9. **Frontend:** Complete F1, F2, F3 (Upload, Dashboard, Viewer)
10. **DevOps:** Complete D5 (Deploy frontend to Vercel)

### Phase 5: Testing (Everyone)
11. **DevOps:** Run end-to-end test (Login → Upload → View)
12. **Frontend:** Verify all UI flows work
13. **Backend:** Check worker logs for errors

---

## 🎯 Tracking Progress

Use `Taskboard.md` as your central tracker. Update task status:

```markdown
### A0: Google OAuth Provider Setup (DevOps)
**Status:** ✅ Complete
```

### Communication Protocol

Each agent should report in this format:

**When starting a task:**
```
🔵 [Role] Starting task [A1/B1/D1]: [Task Name]
```

**When completing a task:**
```
✅ [Role] Task [A1/B1/D1] complete.
Files modified: [list]
Dependencies unblocked: [B1 → F1]
Ready for [Frontend/Backend/DevOps] to proceed with [F1/W1/etc].
```

**When blocked:**
```
⚠️ [Role] Blocked on [A1/B1/D1].
Waiting for: [DevOps D1]
ETA: [ask other agent]
```

---

## 💡 Best Practices

### For You (Project Manager):
1. **Start with DevOps first** (A0, D1, D2 are blockers)
2. **Don't parallelize dependencies** (e.g., don't start F1 until B1 is done)
3. **Check logs frequently** (worker logs, Vercel builds, Supabase Dashboard)
4. **Test early and often** (don't wait until D5 to test login)

### For Agents:
1. **Read the task file completely** before starting
2. **Check dependencies** before beginning a task
3. **Report progress immediately** after completing a task
4. **Ask questions early** if requirements are unclear
5. **Test locally** before deploying to production

---

## 🔍 Troubleshooting

### "Agent is stuck on a task"
- Check if dependencies are complete (e.g., B1 needs D2)
- Ask agent: "What is blocking you?"
- Review task acceptance criteria

### "End-to-end test fails"
- Check worker logs: `docker logs -f showcase3d-worker`
- Check Supabase Dashboard → Logs
- Check Vercel deployment logs
- Verify environment variables

### "Agents are not communicating"
- Use `Taskboard.md` as shared source of truth
- Explicitly ask: "Has DevOps completed D1?"
- Copy/paste status updates between chat sessions

---

## 📊 Completion Criteria (MVP)

**You're done when:**

1. ✅ User can login with Google
2. ✅ User can upload STEP/OBJ/STL file (authenticated)
3. ✅ Worker converts file to STL (logs show success)
4. ✅ User can view converted STL in 3D viewer
5. ✅ Anonymous user can view public showcase (no login required)
6. ✅ User can logout
7. ✅ No secrets in Git repo (`.env` in `.gitignore`)
8. ✅ Frontend deployed to Vercel
9. ✅ Worker running on GCE
10. ✅ All task files marked as complete in `Taskboard.md`

**Test Script:**
```bash
# 1. Login
Visit https://[your-vercel-url].vercel.app
Click "Login with Google"
Authorize with your Google account
Should redirect to /dashboard

# 2. Upload
Click "New Showcase"
Upload small STEP file (<5MB)
Should redirect to /dashboard
Should see showcase with status "uploaded" or "processing"

# 3. Wait for conversion
Refresh dashboard every 5 seconds
Status should change to "ready" (within 30 seconds for small files)

# 4. View
Click "View" button
Should load 3D viewer with STL model

# 5. Share
Copy URL (e.g., /s/[slug])
Open in incognito/private window (no login)
Should still load viewer (for public showcases)

# 6. Logout
Click "Logout"
Should redirect to homepage
Session cleared
```

---

## 🎉 Next Steps (Beta)

After MVP is complete and tested:

1. **Frontend:** Implement F4 (status polling), F5 (error handling)
2. **Backend:** Implement B4 (file validation), W7 (retry logic)
3. **DevOps:** Implement D6 (monitoring & logging)

See `Plan.md` → Beta section for details.

---

## 🆘 Need Help?

- **File not found:** Check file paths in task descriptions
- **Permission errors:** Check RLS policies in Supabase Dashboard
- **Build errors:** Test `npm run build` locally before deploying
- **Worker crashes:** Check `.env` on GCE, verify service role key
- **Auth issues:** Verify Google OAuth redirect URIs match exactly

**Report issues to project Lead Architect (me) with:**
- Task ID (A1, B1, D1, etc.)
- Error message
- Steps to reproduce
- Logs (if applicable)

Good luck! 🚀
