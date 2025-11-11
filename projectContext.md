# Showcase3D – Project Context (GCE)

## TL;DR
- Upload CAD → convert to STL on **Google Cloud VM (GCE)** → share public viewer.
- Stack: Next.js + Supabase + Dockerized FreeCAD on GCE, hosted on Vercel.
- Automation: Claude MCP (SSH to GCE, Supabase, optional Vercel).

## Paths
- Frontend: `/app`, `/components`
- Backend libs: `/lib`
- Worker: `/worker`
- Docs: `/docs` (PRD, schema, seed, rpc)

## Buckets & Tables
- Buckets: `cad-uploaded`, `cad-converted` (private)
- Tables: `showcases`, `jobs`; view: `public_showcases`

## GCE SSH
Direct (Windows):
```bash
ssh -i "C:\Users\badaf\.ssh\google_compute_engine" -o "IdentitiesOnly=yes" badaf@35.192.97.17
```
Alias:
```
Host showcase3d-gce
  HostName 35.192.97.17
  User badaf
  IdentityFile C:\Users\badaf\.ssh\google_compute_engine
  IdentitiesOnly yes
```

## Priorities (MVP)
1) Worker: Supabase download → FreeCAD convert → upload → status update.
2) Frontend upload + RPC (create showcase + job) + polling.
3) Signed URLs for STL viewer.

