# Product Requirements Document (PRD)
## Project: Showcase3D
### Version 1.0 – November 2025

## 1. Overview
Showcase3D lets users upload CAD files (STEP, OBJ, STL), converts them to STL (via Dockerized FreeCAD on a Google Cloud VM / GCE), and publishes **shareable 3D pages**.

## 2. Core Goals
- Upload supported CAD → view STL in browser.
- Convert STEP/OBJ → STL on **GCE VM** (Docker + FreeCAD).
- Store raw/converted files in Supabase (private buckets).
- Supabase Auth isolation; public/unlisted/private showcase links.
- Secure, scalable, Claude MCP–assisted pipeline.

## 3. Architecture
| Layer | Tech | Notes |
|---|---|---|
| Frontend | Next.js + Tailwind + Three.js | UI, Viewer |
| Backend | Supabase | Auth, DB, Storage |
| Worker | **Google Cloud VM (GCE)** + Docker + FreeCAD | Conversion |
| Hosting | Vercel | CI/CD |
| Automation | Claude MCP | SSH (GCE), Supabase, (opt) Vercel |

## 4. Flow
Auth → Upload → `cad-uploaded` + DB rows → Worker polls → FreeCAD → `cad-converted` → status `ready` → `/s/[slug]` renders STL (signed URL).

## 5. Data
Buckets: `cad-uploaded`, `cad-converted` (private).  
Tables: `showcases`, `jobs` (+ `public_showcases` view).  
RLS: owner-only, anon reads via view for public/unlisted.

## 6. Env & Security
- `.env` not in Git; `.env.example` only.
- Service role key lives **only on GCE VM**.
- File validation: MIME/magic bytes, size cap.

## 7. Deploy
- GitHub → Vercel.
- GCE VM: Docker + `docker compose up -d` in `/worker`.
- Logs: `docker logs -f showcase3d-worker`

## 8. AI Integration (Claude MCP)
Agents: Architect / Frontend / Backend / DevOps.  
- DevOps uses **SSH to GCE**.
- Supabase MCP for schema ops.
- Optional Vercel MCP for deploys.

**GCE SSH (Windows):**
```bash
ssh -i "C:\Users\badaf\.ssh\google_compute_engine" -o "IdentitiesOnly=yes" badaf@35.192.97.17
```
Optional alias in `%USERPROFILE%\.ssh\config`:
```
Host showcase3d-gce
  HostName 35.192.97.17
  User badaf
  IdentityFile C:\Users\badaf\.ssh\google_compute_engine
  IdentitiesOnly yes
```
Then: `ssh showcase3d-gce`

## 9. Acceptance (MVP)
- Upload persists; job queued.
- Worker converts, stores STL; status `ready`.
- Public `/s/[slug]` loads STL with signed URL.
- Auth isolation; no secrets in repo.

