# Showcase3D (GCE)

## Overview
Upload CAD → convert to STL on **Google Cloud VM (GCE)** → share public viewer.

## Run locally
npm install
npm run dev

## Deploy worker (on GCE VM)
1) SSH:
```bash
ssh -i "C:\Users\badaf\.ssh\google_compute_engine" -o "IdentitiesOnly=yes" badaf@35.192.97.17
```
2) Install docker:
```bash
sudo apt update && sudo apt install -y docker.io docker-compose
sudo usermod -aG docker $USER && newgrp docker
```
3) Put .env in /home/badaf/app/.env (service role key ONLY here)
4) Build + run worker:
```bash
cd ~/app/worker
docker compose up -d --build
docker compose logs -f
```

