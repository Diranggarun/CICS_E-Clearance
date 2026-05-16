# Running the CICS E-Clearance System Locally

End-to-end setup for a fresh clone. ~10 minutes if you already have a Supabase project.

## Prerequisites

- Node.js >= 18 (`node --version`)
- npm >= 9
- A Supabase Postgres project (free tier is fine). Dashboard: https://supabase.com
  - From **Project Settings → Database → Connection string** grab both:
    - **Transaction pooler** URI (port `6543`) — for `DATABASE_URL`
    - **Session/direct** URI (port `5432`) — for `DIRECT_URL`

## Quick start (automated)

Once Node/npm are installed and you have the two Supabase URIs ready:

```powershell
powershell -ExecutionPolicy Bypass -File .\setup.ps1
```

`setup.ps1` verifies versions, prompts for the two URIs once, auto-generates `JWT_SECRET`, writes the env files, installs dependencies in both workspaces, applies migrations, and seeds the database. Re-run anytime — it's idempotent and skips values already set.

After it finishes, jump to [Starting the servers](#starting-the-servers).

## Manual setup (if you'd rather not run the script)

### 1. Backend

```powershell
cd backend
npm install
copy .env.example .env
```

Edit `backend/.env` and fill in:
- `DATABASE_URL` — Supabase Transaction pooler URI (port 6543)
- `DIRECT_URL` — Supabase Session/Direct URI (port 5432)
- `JWT_SECRET` — any long random string (`openssl rand -hex 32` works)
- `PORT=5000` (leave as-is unless you also update `frontend/vite.config.js`)
- `CORS_ORIGIN=http://localhost:5173` (leave as-is — backend also accepts any other `localhost:*` port as a fallback)

SMTP vars are optional — email sending no-ops if unset, and the rest of the app keeps working.

Then:

```powershell
npx prisma migrate deploy      # apply existing migrations
npx prisma generate            # generate client
npm run seed                   # seed team accounts + role testers + test students
```

### 2. Frontend

```powershell
cd frontend
npm install
copy .env.example .env.local
```

No edits needed — Vite proxies `/api/*` to `http://127.0.0.1:5000`.

## Starting the servers

**Open two separate PowerShell windows** (not tabs — both servers must run simultaneously):

```powershell
# Window 1 — backend
cd "C:\Users\diran\OneDrive\Desktop\CICS_Clearance System\backend"
npm run dev
# wait for: CICS E-Clearance API running on http://localhost:5000
```

```powershell
# Window 2 — frontend
cd "C:\Users\diran\OneDrive\Desktop\CICS_Clearance System\frontend"
npm run dev
# wait for: Local: http://localhost:5173/
```

Open **http://localhost:5173**.

> If the frontend says `Local: http://localhost:5174/` instead of 5173, a zombie Vite is holding 5173. The backend's CORS will still accept it because we allow any `localhost:*`, but for consistency just kill all node and restart: `taskkill /IM node.exe /F`.

## Seeded test accounts

After `npm run seed` you can log in with any of these. **Default password is `Cics#2026`** unless noted.

### Role testers (use these to walk the full approval pipeline)

| Email                     | Password    | Role             |
|---------------------------|-------------|------------------|
| `bytes@cics.edu.ph`       | `Bytes#2026`| `bytes_officer`  |
| `librarian@cics.edu.ph`   | `Cics#2026` | `librarian`      |
| `adviser@cics.edu.ph`     | `Cics#2026` | `faculty_adviser`|
| `chairperson@cics.edu.ph` | `Cics#2026` | `chairperson`    |
| `dean@cics.edu.ph`        | `Cics#2026` | `dean`           |

### Test students

| Email                              | Password    | Notes               |
|------------------------------------|-------------|---------------------|
| `maria.santos@s.msumain.edu.ph`    | `Cics#2026` | BSIT 4A — approved  |
| `juan.delacruz@s.msumain.edu.ph`   | `Cics#2026` | BSCS 4B — approved  |

### Team accounts (all `bytes_officer` for development)

`affhan@`, `dimalutang@`, `naimah@`, `asraf@`, `landia@`, `ed@`, `norman@`, `shaheel@`, `jonaidah@`, `diranggarun.hg587@` (all `@s.msumain.edu.ph`) — password `Cics#2026`.

## End-to-end smoke test (full approval pipeline)

1. **Register** a new student via the Register page (or use Maria Santos).
2. As **BYTES Officer** → **Pending Accounts** → approve the new student (skip if using Maria).
3. As **BYTES Officer** → **Manage Fines** → pick the student → add a ₱100 fine.
4. As the **student** → **Payment** → click Pay Now on the fine → upload any small image as a GCash receipt → submit.
5. As **BYTES Officer** → **Payment Verification** → approve the payment.
6. As the **student** → **My Clearance** → **Submit Clearance Request**.
7. As **BYTES Officer** → approve the BYTES stage.
8. Log in as `librarian@`, then `adviser@`, then `chairperson@`, then `dean@cics.edu.ph` → approve each stage in order.
9. As the **student** → **My Clearance** → **Download PDF** (now enabled) → file downloads.

If any approval 409s with "prerequisites not met," that's expected — the workflow enforces sequential gating.

## Common issues

| Symptom | Fix |
|---|---|
| `EADDRINUSE :::5000` on backend start | A zombie node.exe is holding the port. `taskkill /IM node.exe /F`, then restart. |
| Vite falls back to port 5174 / 5175 | Same — a zombie Vite is on 5173. `taskkill /IM node.exe /F` and restart both servers. |
| Login spins forever / Network error | Backend isn't running. Check the backend terminal for errors. |
| `Invalid prisma.user.findUnique() ... invalid domain character` | Your `DATABASE_URL` still contains literal `[YOUR-PASSWORD]` placeholders or has special characters that need URL-encoding. Re-run `setup.ps1` or paste a fresh URI. |
| Prisma `migrate dev` hangs / SSL error | You used the pooler URI for `DIRECT_URL`. Use the **direct/session** URI (port 5432). |
| `prisma generate` EPERM file-lock on Windows | A running backend has the engine DLL open. Stop the backend, run `npx prisma generate`, restart. Harmless if the client was already generated. |
| Frontend 404s on `/api/*` | Backend not on port 5000, or you changed `PORT` without updating `vite.config.js`. |
| Receipt upload fails with 413 | Receipts are capped at 5 MB by Multer. |
| "Email already registered" on Register | The email is taken (likely a seeded team account). Use a different one. |
| `npm run lint` fails with "no config" | Known — frontend has no ESLint config yet. Skip lint; build and dev work. |

## Helpful one-liners

**List all student UUIDs and School IDs** (for adding fines via the new dropdown — usually unnecessary now, but useful for debugging):

```powershell
cd "C:\Users\diran\OneDrive\Desktop\CICS_Clearance System\backend"
node -e "import('./src/lib/prisma.js').then(async (m) => { const p = m.default; const u = await p.user.findMany({ where: { role: 'student' }, select: { id: true, schoolId: true, firstName: true, lastName: true } }); console.table(u); await p.`$disconnect(); })"
```

**Verify the env actually loads:**

```powershell
cd backend
node -e "require('dotenv').config(); console.log(process.env.DATABASE_URL)"
```

**Hit the API health check:**

```powershell
curl http://localhost:5000/api/health
# {"ok":true}
```

## Where to look when something breaks

- **API contract:** `claude-docs/API_CONTRACT.md`
- **Database schema:** `backend/prisma/schema.prisma` and `claude-docs/ERD.md`
- **Module ownership:** `CLAUDE.md` (don't edit another dev's module without asking)
- **Known bugs / fixes:** `claude-docs/DEBUGGING.md`
- **Detailed phase progress:** `claude-docs/PROGRESS.md`
