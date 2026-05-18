# Deployment Guide

Three supported paths — pick whichever matches your audience.

## Option A — Local Docker Compose (single machine)

Best for: classroom demo on a laptop, LAN demo for jury panel.

```bash
# from repo root, with backend/.env already filled in (see RUN.md)
docker compose build
docker compose up -d
```

Visit **http://localhost** (port 80, frontend served by nginx; nginx proxies `/api/*` to the backend container).

Stop:
```bash
docker compose down
```

Reset uploads volume too:
```bash
docker compose down -v
```

## Option B — Render (backend) + Vercel (frontend)

Best for: public URL the panel can hit from anywhere.

### Backend on Render

1. Push the repo to GitHub (already done — `origin/main`).
2. Sign in at https://render.com → **New → Blueprint** → point at this repo.
3. Render reads `render.yaml` and provisions `cics-backend`.
4. Fill in the four env vars Render prompts for:
   - `DATABASE_URL` — Supabase Transaction pooler URI (port 6543)
   - `DIRECT_URL` — Supabase Session URI (port 5432)
   - `CORS_ORIGIN` — your Vercel URL once you have it (e.g. `https://cics-clearance.vercel.app`)
   - `JWT_SECRET` — Render auto-generates this
5. After first deploy, open a Render shell and run migrations + seed once:
   ```bash
   npx prisma migrate deploy
   npm run seed
   ```
6. Health check: `https://<your-service>.onrender.com/api/health` → `{"ok":true}`

### Frontend on Vercel

1. Edit `frontend/vercel.json` and replace `YOUR-BACKEND.onrender.com` with the Render URL from step 6 above (both `/api/*` and `/uploads/*` rewrites).
2. Sign in at https://vercel.com → **Add New → Project** → import the GitHub repo.
3. Set the **Root Directory** to `frontend`. Vercel auto-detects Vite.
4. Deploy. Vercel returns a URL like `https://cics-clearance.vercel.app`.
5. Go back to Render → update `CORS_ORIGIN` to this Vercel URL → redeploy backend.

## Option C — Backend on Fly.io / Railway / Heroku

The `backend/Dockerfile` is platform-agnostic — point any container host at it. Required env vars are the same four as Render. Set the start command to `node src/server.js` if the platform doesn't honor Docker `CMD`.

## Production env vars (backend)

| Var | Where to get it | Example |
|-----|-----------------|---------|
| `DATABASE_URL` | Supabase Transaction pooler | `postgresql://...:6543/postgres?...` |
| `DIRECT_URL` | Supabase Session/Direct | `postgresql://...:5432/postgres?...` |
| `JWT_SECRET` | Generate: `openssl rand -hex 32` | `a1b2c3...` (64 hex chars) |
| `CORS_ORIGIN` | Public frontend URL | `https://cics-clearance.vercel.app` |
| `PORT` | Platform-assigned or 5000 | `5000` |
| `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS` | Gmail / SendGrid | optional — emails no-op if unset |

## Smoke test after deploy

```bash
curl https://<backend-url>/api/health
# {"ok":true}

curl -i https://<backend-url>/api/auth/me
# HTTP/1.1 401 — confirms auth middleware loaded
```

Then open the frontend URL → login as `maria.santos@s.msumain.edu.ph` / `Cics#2026` → walk the full pipeline (see RUN.md "Try the Full Approval Flow").

## Rollback

```bash
# local
docker compose down && git checkout <previous-sha> && docker compose up -d --build

# Render / Vercel: use the dashboard "Rollback" button on the previous deploy
```
