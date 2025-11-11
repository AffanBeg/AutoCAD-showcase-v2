# Product Requirements Document (PRD)
## Project: Showcase3D
### Version 1.0 – November 2025

---

## 1. Overview
Showcase3D is a web-based platform that allows users to upload CAD files (STEP, OBJ, STL), automatically convert them into STL format using a Dockerized FreeCAD pipeline, and share them publicly through 3D-viewable showcase links. Target users: engineers, designers, students.

---

## 2. Core Goals
- Upload supported CAD → View STL in browser.
- Convert STEP/OBJ → STL on Oracle VM (Docker + FreeCAD).
- Store raw/converted files in Supabase storage.
- Auth isolation per user (Supabase Auth).
- Shareable public/unlisted/private showcase URLs.
- Secure, scalable, automation-friendly (Claude MCP).

---

## 3. Architecture Overview
| Layer | Technology | Description |
|-------|------------|-------------|
| Frontend | Next.js (App Router), TypeScript, Tailwind, shadcn/ui, Three.js | UI for uploads, dashboard, 3D viewer |
| Backend/DB | Supabase | Auth, Postgres, storage, simple RPCs |
| Conversion Worker | Oracle Cloud VM + Docker + FreeCAD CLI | Converts non‑STL formats to STL |
| Hosting/CI | Vercel | Auto-deploy from GitHub |
| Automation | Claude MCP (SSH, Supabase, Vercel) | Multi-agent AI orchestration |

---

## 4. Functional Flow
1) **Auth**: Supabase Auth → `/dashboard`  
2) **Upload**: file → `cad-uploaded` + DB rows (`showcases`, `jobs(status='uploaded'|'queued')`)  
3) **Convert**: Oracle worker polls jobs → download → FreeCAD → upload STL → `cad-converted` → update status `ready/failed`  
4) **Showcase**: public URL `/s/[slug]` renders STL via Three.js  
5) **Visibility**: `public | unlisted | private`

---

## 5. System Design

### 5.1 Frontend
- Routes: `/`, `/dashboard`, `/dashboard/new`, `/s/[slug]`
- Components: `ViewerSTL`, `UploadForm`, `ShowcaseCard`, `Badge`, `Navbar`
- UX: iOS-inspired minimal UI, accessible, responsive
- Performance: dynamic import for viewer, light skeletons

### 5.2 Backend (Supabase)

**Storage buckets**
- `cad-uploaded` (raw uploads)
- `cad-converted` (STL outputs)

**Tables**

`users` (from Supabase Auth)  
- `id (uuid)`, `email (text)`, `created_at (timestamp)`

`showcases`  
- `id (uuid)` PK  
- `user_id (uuid)` → `users.id`  
- `title (text)`  
- `slug (text)` unique  
- `visibility (enum)` = `public|unlisted|private` (default `private`)  
- `status (enum)` = `uploaded|processing|ready|failed`  
- `created_at (timestamp)`  
- `updated_at (timestamp)`  
- `input_path (text)` optional  
- `output_path (text)` optional

`jobs`
- `id (uuid)` PK  
- `showcase_id (uuid)` → `showcases.id`  
- `input_path (text)`  
- `output_path (text)` nullable  
- `status (enum)` = `queued|running|complete|failed`  
- `started_at (timestamp)` nullable  
- `finished_at (timestamp)` nullable  
- `error (text)` nullable

**RLS (MVP)**
- Owners can read/write their `showcases`/`jobs`.
- Public `showcases` viewable anonymously (by slug) with restricted projection.

### 5.3 Conversion Worker (Oracle VM)
- Ubuntu VM, Docker, FreeCAD (headless) in container
- Poll interval default 5s
- Steps: poll → download → convert → upload → update DB
- Retries + error logging; idempotent by `job.id`
- Deployed via SSH alias; restart on failure

---

## 6. Environment & Security

**Env variables (.env.example; real values in Vercel/VM):**
- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (VM only)
- `SUPABASE_STORAGE_BUCKET_UPLOADS=cad-uploaded`
- `SUPABASE_STORAGE_BUCKET_CONVERTED=cad-converted`
- `ORACLE_SSH_HOST`, `ORACLE_SSH_USER`, `ORACLE_SSH_KEY_PATH`
- `FREECAD_DOCKER_IMAGE=freecad/freecad:latest`
- `VERCEL_PROJECT_ID`, `VERCEL_TOKEN`
- `POLL_INTERVAL_SECONDS=5` (VM)

**Policies**
- `.env` never committed; only `.env.example` in repo
- Principle of least privilege (service role on VM only)
- File validation (type/size) at upload

---

## 7. Deployment Workflow
- GitHub → Vercel auto-deploy (`main` → production)
- Supabase managed in cloud; schema snapshots in `docs/schema.sql` (optional)
- Worker: SSH into VM → `docker compose up -d`
- Logs: `/var/log/showcase3d` + `docker logs`

---

## 8. Scalability & Roadmap
- Supabase Realtime for status updates
- Queue service (Supabase Functions or Redis) if needed
- More formats (IGES, DXF), larger files via multipart
- Viewer thumbnails/OG images
- Analytics (view count), tags, search
- Team workspaces

---

## 9. AI Integration & Automation (Claude MCP)
**Agents & scopes**
| Agent | Role | Access |
|-------|------|--------|
| Architect Claude | Orchestrates, guards architecture | `PRD.md`, `projectContext.md`, repo overview |
| Frontend Claude | Next.js UI, components, viewer | `/app`, `/components`, limited `/lib` calls |
| Backend Claude | Supabase schema, `lib/*`, worker logic | `/lib`, `/worker` |
| DevOps Claude | SSH to Oracle, Docker deploys, Vercel ops | SSH MCP, `.env` on VM, Vercel

**MCP connectors**
- Supabase MCP (schema + data ops in dev; read-mostly in prod)
- SSH MCP to `showcase3d-oracle` (non-root user; key auth)
- Vercel MCP (optional) to trigger/inspect deployments

**SSH config (local)**
```
Host showcase3d-oracle
  HostName <YOUR_ORACLE_IP>
  User ubuntu
  IdentityFile ~/.ssh/showcase3d_rsa
  IdentitiesOnly yes
```

**Automation sketch**
- New upload → row `status='uploaded'|job='queued'`
- DevOps Claude: SSH → run worker (or ensure it's healthy)
- Worker updates job → `complete` & showcase → `ready`
- Frontend reads `ready` → loads STL on `/s/[slug]`

---

## 10. Acceptance Criteria (MVP)
- Upload `.step/.obj/.stl` → persists & queues job
- Worker converts to `.stl` and stores in `cad-converted`
- `/s/[slug]` renders STL with orbit/zoom/pan
- Visibility toggles work; public link loads logged out
- Auth isolation: users only see their data
- No secrets committed; `.env.example` present

---

## 11. Summary
Showcase3D bridges CAD tools and web visualization with a clean, scalable architecture (Supabase + Oracle + Vercel) and AI-assisted automation via Claude MCP.
