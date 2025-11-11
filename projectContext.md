# Showcase3D – Project Context (AI-Ready)

## TL;DR
- **Goal:** Upload CAD (STEP/OBJ/STL) → convert to STL → share public 3D viewer.
- **Stack:** Next.js + Tailwind + Three.js (frontend), Supabase (auth/db/storage), Oracle VM + Docker + FreeCAD (worker), Vercel (hosting). 
- **Automation:** Claude MCPs: SSH (Oracle), Supabase, (optional) Vercel.

## Repos & Paths
- Main repo contains: `/app`, `/components`, `/lib`, `/worker`, `/docs`, `/ai/context`.
- Viewer component: `components/ViewerSTL.tsx`.
- Worker entry: `worker/worker.py` (polls), `worker/convert_to_stl.py` (conversion).
- Env template: `.env.example` (no secrets).

## Buckets & Tables
- Buckets: `cad-uploaded`, `cad-converted`.
- Tables: `users`(auth), `showcases`, `jobs`.
- Status: `uploaded|processing|ready|failed` (showcases); `queued|running|complete|failed` (jobs).

## Agents (Claude)
- **Architect:** Reads `PRD.md`, keeps structure consistent, delegates tasks.
- **Frontend:** Builds pages/routes/components; integrates Supabase client reads.
- **Backend:** Implements schema + `/lib` helpers; coordinates worker I/O.
- **DevOps:** SSH to VM, Docker compose up, monitor logs.

## Rules
- Do NOT commit secrets. Only `.env.example` in repo.
- Keep file ownership boundaries (frontend vs backend vs worker).
- Prefer small PRs, clear diffs, and comments explaining decisions.

## Current Priorities (MVP)
1) Finish worker loop (poll → download → FreeCAD → upload → update).  
2) Wire upload flow on frontend with Supabase Storage & job creation.  
3) Add visibility toggles and public slug routing.  
4) Realtime/polling updates for job status (3–5s).
