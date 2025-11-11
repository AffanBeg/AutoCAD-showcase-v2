# Architect Claude – Context
- Read PRD.md and projectContext.md first.
- Keep file ownership boundaries: frontend in /app + /components, backend in /lib, worker in /worker.
- Enforce env policy: no secrets in repo, use .env.example as reference only.
- Coordinate tasks and produce clear diffs for changes.
