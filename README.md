# CICS E-Clearance System

Web-based clearance system for the College of Information and Computing Studies, MSU – Main Campus. Built by a 9-person team following the task division in `claude_prompt_and task.txt`.

## Structure

```
CICS_Clearance System/
├── frontend/        # React + Vite + Tailwind (student, BYTES officer, signatory dashboards)
│   ├── src/
│   ├── package.json
│   └── .vscode/
├── backend/         # Node.js + Express + Prisma + PostgreSQL (REST API)
│   ├── src/
│   ├── prisma/
│   ├── package.json
│   └── .vscode/
├── README.md
└── .gitignore
```

> The frontend folder is currently still named `cics-eclearance/` — rename pending OneDrive lock release. After renaming, it will be `frontend/`.

## Quick start

Two terminals.

### Backend
```powershell
cd backend
npm install
copy .env.example .env       # edit DATABASE_URL + JWT_SECRET
npx prisma migrate dev --name init
npm run seed
npm run dev                  # http://localhost:8000
```

### Frontend
```powershell
cd frontend                  # currently: cd cics-eclearance
npm install
npm run dev                  # http://localhost:5173
```

Vite proxies `/api/*` → `http://localhost:8000`, so the frontend talks to the backend with no extra config.

## Seeded admin

| Email             | Password   | Role           |
|-------------------|------------|----------------|
| bytes@cics.edu.ph | Bytes#2026 | bytes_officer  |

Use this account to approve newly-registered students.

## Implemented (Task 1)

- `POST /api/auth/register` — creates pending student account
- `POST /api/auth/login` — JWT, blocks pending/denied accounts
- `GET /api/auth/me` — current user
- `POST /api/auth/logout` — stateless no-op
- `GET /api/admin/pending-accounts` — BYTES Officer only
- `POST /api/admin/pending-accounts/:id/approve|deny` — BYTES Officer only

## Pending tasks

See `claude_prompt_and task.txt` for the full task pack:

- Task 0b — Full schema + OpenAPI contract
- Task 2 — Student clearance request + PDF
- Task 3 — Fines, fees, GCash payments
- Task 4 — Approval workflow engine (multi-role gating)
- Task 5 — Email + in-app notifications
- Task 6 — Admin dashboard, requirements, reports
- Task 7 — Student frontend pages
- Task 8 — Admin/staff frontend pages
