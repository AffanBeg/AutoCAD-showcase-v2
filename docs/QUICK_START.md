# QUICK START - Showcase3D
## TL;DR - Start Here

> **First time?** Read `YOUR_COMPLETE_GUIDE.md` for detailed step-by-step instructions.
> **Already set up?** Use this quick reference to resume work.

---

## ⚡ QUICK SETUP (If Starting Fresh)

### 1. Manual Setup (YOU - 30 mins)
- [ ] Create Google OAuth credentials → Save Client ID + Secret
- [ ] Enable Google in Supabase Auth → Paste credentials
- [ ] Copy Supabase URL, Anon Key, Service Role Key
- [ ] Update `.env` file with all credentials
- [ ] Verify `.env` is in `.gitignore`

**Detailed instructions:** `YOUR_COMPLETE_GUIDE.md` → Phase 0

---

### 2. Start Three Chatbots

**Chatbot 1 - DevOps:**
```
You are the DevOps specialist for Showcase3D.
Read C:\Users\badaf\Documents\VVork\AutoCAD-showcase-v2\docs\DevOps_Tasks.md
Start with task D1 (Supabase Schema Deployment).
A0 (Google OAuth) was completed manually by the user.
```

**Chatbot 2 - Backend:**
```
You are the Backend developer for Showcase3D.
Read C:\Users\badaf\Documents\VVork\AutoCAD-showcase-v2\docs\Backend_Tasks.md
Wait for DevOps to complete D1 and D2, then start with B1.
```

**Chatbot 3 - Frontend:**
```
You are the Frontend developer for Showcase3D.
Read C:\Users\badaf\Documents\VVork\AutoCAD-showcase-v2\docs\Frontend_Tasks.md
Start with task A1 (Login Page).
A0 (Google OAuth) was completed manually by the user.
```

---

## 📋 TASK ORDER

**Phase 1 - Foundation (30 mins):**
- DevOps: D1 (Deploy Schema) → D2 (Create Buckets)
- Frontend: A1 (Login Page) → A2 (Callback) → A3 (Protected Routes)

**Phase 2 - Backend (1 hour):**
- Backend: B1 (Upload Helper) → B2 (DB Helpers) → B3 (Signed URLs)

**Phase 3 - Worker (2 hours):**
- Backend: W1 → W2 → W3 → W4 → W5 → W6 (Worker implementation)
- DevOps: D3 (Docker Build)

**Phase 4 - Deployment (1 hour):**
- DevOps: D4 (Deploy Worker to GCE)
- Frontend: F1 (Upload) → F2 (Dashboard) → F3 (Viewer)
- DevOps: D5 (Deploy to Vercel)

**Phase 5 - Testing (30 mins):**
- Test end-to-end: Login → Upload → Convert → View

**Total Time: 5-6 hours**

---

## 🔗 DEPENDENCIES

```
YOU → A0 ✅ → D1, D2
D1 → B2, W1
D2 → B1, B3, W3
A0 → A1 → A2 → A3
B1 → F1
B2 → F2
B3 → F3
W1 → W2 → W3 → W4 → W5 → W6 → D3 → D4
F1, F2, F3 → D5
```

---

## ✅ CHECKPOINTS

**30 minutes in:**
- [ ] D1, D2 done (schema + buckets in Supabase)
- [ ] A1, A2 done (login pages exist)
- [ ] B1 started (upload helper)

**2 hours in:**
- [ ] A1-A3 done (auth complete)
- [ ] B1-B3 done (backend libs complete)
- [ ] W1-W6 in progress (worker being built)

**4 hours in:**
- [ ] W1-W6 done (worker complete)
- [ ] D3, D4 done (worker deployed to GCE)
- [ ] F1-F3 in progress (frontend UI)

**5-6 hours in:**
- [ ] F1-F3 done (UI complete)
- [ ] D5 done (deployed to Vercel)
- [ ] End-to-end test passes

---

## 🧪 END-TO-END TEST

When everything is deployed, test this flow:

1. Go to your Vercel URL
2. Click "Login with Google" → Authorize
3. Should land on `/dashboard`
4. Click "New Showcase"
5. Upload a STEP file
6. Wait 10-30 seconds, refresh dashboard
7. Status should change to "ready"
8. Click "View" → Should see 3D model
9. Copy URL, open in incognito → Should still work (public sharing)
10. Click "Logout" → Should clear session

**All steps work? ✅ MVP COMPLETE!**

---

## 🚨 COMMON ISSUES

| Problem | Quick Fix |
|---------|-----------|
| Login redirect fails | Check Google OAuth redirect URI matches Supabase exactly |
| Upload fails | Check `.env` has `NEXT_PUBLIC_SUPABASE_URL` and `ANON_KEY` |
| Worker can't connect | Check `.env` on GCE has `SERVICE_ROLE_KEY` (not ANON_KEY) |
| Conversion fails | Check FreeCAD installed in Docker: `docker run --rm showcase3d-worker freecad --version` |
| Viewer doesn't load | Check file exists in Supabase Storage → `cad-converted` bucket |
| Vercel build fails | Test locally: `npm run build` |

**Detailed troubleshooting:** `YOUR_COMPLETE_GUIDE.md` → Troubleshooting Guide

---

## 📁 FILES CREATED FOR YOU

| File | Purpose |
|------|---------|
| `YOUR_COMPLETE_GUIDE.md` | ⭐ **START HERE** - Complete step-by-step instructions |
| `Plan.md` | Architecture overview, milestones, costs |
| `Taskboard.md` | Master task tracker (all roles) |
| `Frontend_Tasks.md` | Detailed frontend tasks (give to Frontend chatbot) |
| `Backend_Tasks.md` | Detailed backend tasks (give to Backend chatbot) |
| `DevOps_Tasks.md` | Detailed DevOps tasks (give to DevOps chatbot) |
| `Getting_Started.md` | Multi-agent workflow guide |
| `Git_Workflow.md` | Branch strategy and PR templates |
| `QUICK_START.md` | This file - quick reference |

---

## 🎯 NEXT ACTIONS

**If you haven't started:**
1. Read `YOUR_COMPLETE_GUIDE.md` (seriously, read it all)
2. Do Phase 0 manual setup (30 mins)
3. Start the three chatbots with the prompts above
4. Coordinate between them as tasks complete

**If you're in progress:**
1. Check where each chatbot is in their task list
2. Look at the dependencies chart above
3. Unblock chatbots by relaying completion messages
4. Test at each checkpoint

**If you're stuck:**
1. Check the troubleshooting guide in `YOUR_COMPLETE_GUIDE.md`
2. Ask the relevant chatbot for help (paste error messages)
3. Check Supabase Dashboard for data
4. Check worker logs: `docker logs -f showcase3d-worker`

---

## 🔗 IMPORTANT LINKS

- **Google OAuth:** https://console.cloud.google.com/apis/credentials
- **Supabase:** https://app.supabase.com/
- **Vercel:** https://vercel.com/dashboard
- **Local Project:** `C:\Users\badaf\Documents\VVork\AutoCAD-showcase-v2`

---

## 💡 PRO TIPS

1. **Read YOUR_COMPLETE_GUIDE.md first** - It answers 99% of questions
2. **Don't skip manual setup** - Chatbots can't do OAuth setup for you
3. **Test at checkpoints** - Don't wait until the end
4. **Keep chatbot tabs organized** - Label them "DevOps", "Backend", "Frontend"
5. **Check logs frequently** - `docker logs`, Vercel build logs, browser console
6. **Save credentials safely** - Never commit `.env` to Git
7. **Take breaks** - This is a marathon, not a sprint

---

**Ready to start? Open `YOUR_COMPLETE_GUIDE.md` and begin with Phase 0, Step 1!** 🚀
