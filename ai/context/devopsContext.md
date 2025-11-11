# DevOps – Context (GCE)
Use SSH to GCE VM. Build/run worker with docker compose. Keep logs and restart on failure.

Windows quick command:
ssh -i "C:\Users\badaf\.ssh\google_compute_engine" -o "IdentitiesOnly=yes" badaf@35.192.97.17

Alias in %USERPROFILE%\.ssh\config:
Host showcase3d-gce
  HostName 35.192.97.17
  User badaf
  IdentityFile C:\Users\badaf\.ssh\google_compute_engine
  IdentitiesOnly yes
