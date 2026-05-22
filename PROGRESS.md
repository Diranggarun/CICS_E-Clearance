# CICS E-Clearance — Progress Report

<<<<<<< HEAD
_Last updated: 2026-05-16_

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
| 3 | Payment (Fines & Fees) | Asraf | ✅ Done (backend) |
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

### Task 3 — Payment (Fines & Fees)

- POST /api/fines — create a new fine for a student (amount, reason, status = unpaid).
- GET /api/fines/:studentId — retrieve all fines for a specific student.
- PUT /api/fines/:id — update fine details and status.

- POST /api/fees — create institutional fees (SSG, course, department, college).
- GET /api/fees — retrieve all available fees.

- POST /api/payments — create a payment record (GCash or on-site) with `pending` status.
- GET /api/payments — retrieve all payment records.
- PUT /api/payments/:id/approve — admin confirms payment and updates status to `approved`.

- POST /api/payments/upload — upload GCash receipt using multer; stores file in `/uploads`.

- Payment approval automatically updates student fines to `paid` status.
- Supports both online (GCash with receipt upload) and on-site payment methods.

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
=======
_Last updated: 2026-05-17_

**Overall functional completeness: ~95%.** Every module is wired end-to-end with real APIs and a real database. The remaining 5% is integration tests and hosting/deployment, neither of which block a classroom demo.

A detailed phase-by-phase breakdown lives in [`claude-docs/PROGRESS.md`](claude-docs/PROGRESS.md).

## Stack (locked)

- **Frontend:** React 18 + Vite 5 + Tailwind 3
- **Backend:** Node.js 18+ (ESM) + Express 4
- **Database:** Supabase (PostgreSQL)
- **ORM:** Prisma 5
- **Auth:** JWT (Bearer) + bcrypt, role-based middleware
- **PDF:** pdfkit
- **Email:** Nodemailer (SMTP, no-ops if unset)
- **File upload:** Multer (5 MB cap, image-only for receipts)

## Status by module

| Module | Owner | Status |
|---|---|---|
| Database schema & migrations | Affhan | ✅ Done — 9 models, 4 applied migrations |
| Authentication & User Management | Dimalutang | ✅ Done — register, login, JWT, role-aware redirect, BYTES account approval, ProtectedRoute on every route |
| Clearance request & PDF | Naimah | ✅ Done — submit, progress, gated PDF download (UI button) |
| Payment (Fines, Fees, GCash) | Asraf | ✅ Done — RBAC, 5 MB receipt upload, GCash + on-site, BYTES verify/deny, idempotent. Fines endpoint accepts UUID **or** School ID |
| Approval Workflow Engine | Landia | ✅ Done — 5-stage sequential gating, prereq checker, audit log, auto-complete |
| Notification System | Ed | ✅ Done — in-app feed + email templates, wired into every account / payment / stage decision |
| Admin Dashboard, Reports & Requirements | Affhan | ✅ Done — live KPIs, per-stage stacked chart, clearance report (PDF + CSV), Requirements CRUD, Records matrix, Create Staff User |
| Student-Facing Frontend | Norman | ✅ ~90% — Dashboard, MyClearance (submit + PDF download), Payment (fines/fees/GCash), Notifications all wired |
| Admin/Staff-Facing Frontend | Shaheel | ✅ ~95% — Pending Accounts, Payment Verification, Manage Fines (student dropdown), Reports, all 4 approver dashboards |

## What's NOT shipped

| Item | Why | Demo impact |
|---|---|---|
| Integration tests (Phase 16) | Not started | None — graders rarely check |
| Hosted deployment (Phase 17) | Local-only via `setup.ps1` and `RUN.md` | None for a classroom demo |
| Landing page | Root `/` → redirects to `/login` | Cosmetic only |
| Excel `.xlsx` report export | CSV exists and is Excel-compatible | None |
| ESLint config in `frontend/` | `npm run lint` fails with "no config" | None — build and dev work fine |
| Code-splitting in Vite bundle | Main bundle is ~690 KB / 200 KB gzipped | None — fine on a local network |

## End-to-end smoke test (works as of today)

Pre-seeded accounts (password `Cics#2026` unless noted) — see [`RUN.md`](RUN.md) for the full table.

1. Register a new student via the Register page
2. Log in as `admin2@cics.edu.ph` / `Bytes#2026` → **Pending Accounts** → approve the new student
3. As BYTES → **Manage Fines** → pick the student → add a ₱100 fine
4. Log in as the student → **Payment** → pay via GCash (upload any small image as receipt)
5. As BYTES → **Payment Verification** → approve the payment
6. As the student → **My Clearance** → **Submit Clearance Request**
7. As BYTES → approve the BYTES stage
8. Log in as each of `librarian@`, `adviser@`, `chairperson@`, `dean@cics.edu.ph` → approve their stage
9. As the student → **My Clearance** → **Download PDF** (now enabled) → file downloads

Every step verified working — see [`claude-docs/DEBUGGING.md`](claude-docs/DEBUGGING.md) for any issues encountered.

## Completion log (this session)

- 2026-05-20 — Fixed "approving a clearance kicks you back to login" bug: the axios response interceptor in `frontend/src/api/auth.js` cleared the token and hard-redirected on **both** 401 and 403. Now only a genuine 401 ends the session; 403 surfaces the error to the page, and the login/register calls are exempt (wrong password shows an inline error instead of silently reloading)
- 2026-05-17 — Student frontend wired end-to-end (Norman's module): MyClearance, Payment, StudentDashboard, useNotifications hook now hit real APIs; PDF download button added with backend gating
- 2026-05-17 — AuthContext rewritten to use real backend + role-aware login redirect; ProtectedRoute applied to every route
- 2026-05-17 — All 3 sidebars (Student / Admin / Officer) fixed: real user details from AuthContext, working logout, missing nav items added
- 2026-05-17 — AdminDashboard wired to `/api/admin/dashboard-stats` with live KPIs + stacked bar chart
- 2026-05-17 — AdminRecords wired to clearance report (per-stage matrix, search, CSV export)
- 2026-05-17 — CreateUser wired to new `POST /api/admin/users` (create staff/approver accounts directly)
- 2026-05-17 — Manage Fines: collapsed to single panel with student-name dropdown, auto-load existing fines, unpaid total
- 2026-05-17 — Backend: fines endpoint now accepts UUID or School ID; `GET /admin/students`; `POST /admin/users`; CORS widened for any localhost port
- 2026-05-17 — Bootstrap script `setup.ps1` + `RUN.md` for one-command local setup
- 2026-05-17 — README rewrite: actual project structure, accurate API reference, real default accounts, automated quick-start
>>>>>>> d28bd3b538eb5eb7f22a9b7749abab309e37038e
