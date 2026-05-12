# CICS E-Clearance — Progress Report

_Last updated: 2026-05-12_

## Stack (locked)

- **Frontend:** React + Vite + Tailwind
- **Backend:** Node.js + Express (ES modules)
- **Database:** Supabase (PostgreSQL)
- **ORM:** Prisma
- **Auth:** JWT (Bearer tokens)
- **PDF:** pdfkit

## Status by task

| Task | Module | Owner | Status |
|------|--------|-------|--------|
| 0b | DB schema & API contract | Affhan | 🟡 In progress — `users`, `clearance_requests`, `clearance_stages` done; remaining tables (fines, fees, payments, requirements, notifications, audit_log) pending |
| 1 | Authentication & User Management | Dimalutang | ✅ Done |
| 2 | Student Clearance Request | Naimah | ✅ Done (backend) |
| 3 | Payment (Fines & Fees) | Asraf | ⬜ Not started |
| 4 | Approval Workflow Engine | Landia | ⬜ Not started |
| 5 | Notification System | Ed | ⬜ Not started |
| 6 | Admin Dashboard, Reports & Requirements | Affhan | ⬜ Not started |
| 7 | Student-Facing Frontend | Norman | 🟡 Partial — Register/Login pages exist; clearance/payment pages pending |
| 8 | Admin & Staff-Facing Frontend | Shaheel | 🟡 Partial — dashboards scaffolded |

## What works today

### Infrastructure
- Backend connected to **Supabase Postgres** via Prisma (session pooler for the app, direct connection for migrations — `DATABASE_URL` / `DIRECT_URL` in `backend/.env`, see `.env.example`).
- Migrations: `..._init` (users), `..._clearance_requests` (clearance tables).
- Express hardened with an `asyncHandler` wrapper so a DB hiccup returns `500` instead of crashing the process.

### Task 1 — Auth
- `POST /api/auth/register` — student signup → `pending` state. School ID accepts `2024-00000` **or** plain digits like `202300000`.
- `POST /api/auth/login` — returns `{ access_token, user }`; blocks `pending` / `denied` accounts.
- `POST /api/auth/logout`, `GET /api/auth/me`
- `GET /api/admin/pending-accounts`, `POST /api/admin/pending-accounts/:id/approve|deny` — BYTES Officer only.
- Passwords hashed with bcrypt; role-based middleware (`requireAuth`, `requireRole`).
- Seeded admin: `bytes@cics.edu.ph` / `Bytes#2026`.

### Task 2 — Student Clearance Request
- `POST /api/clearance/request` — creates a request + 5 ordered stages (BYTES → Librarian → Faculty Adviser → Chairperson → Dean). Returns `409` if the student already has an active request.
- `GET /api/clearance/me` — most recent request as a progress object.
- `GET /api/clearance/me/progress` — structured progress for the status stepper.
- `GET /api/clearance/:id/pdf` — printable PDF (student details, school ID, college/dept, academic year, approvers + timestamps, unique reference no.). Returns `409` with `pending_stages` unless every stage is approved; `403` if not the owner (BYTES Officer may also view).
- Stage *decisions* are intentionally read-only here — that belongs to Task 4.

## Frontend changes
- `RegisterPage.jsx` — client-side school-ID validation aligned with the backend; toasts now de-duplicate (shared `id`) instead of stacking.

## Next up
1. **Task 0b** — extend Prisma schema with the remaining tables.
2. **Task 4** — Approval Workflow Engine (prerequisite gating, audit log, notify stub).
3. **Task 3** — Payments (fines/fees, GCash receipt upload, admin confirmation).

## Run locally
```bash
# backend
cd backend && npm install && cp .env.example .env   # fill DATABASE_URL, DIRECT_URL, JWT_SECRET
npx prisma migrate dev
npm run seed
npm run dev            # http://localhost:5000

# frontend
cd frontend && npm install && npm run dev            # http://localhost:5173
```
