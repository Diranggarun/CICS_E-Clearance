<div align="center">

# CICS E-Clearance System

**Web-based clearance management portal for the College of Information and Computing Studies, MSU – Main Campus.**

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-4-000000?logo=express&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-DB-4169E1?logo=postgresql&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-green)

</div>

---

## Overview

The **CICS E-Clearance System** digitizes the student clearance process at MSU – Main Campus. Students submit clearance requests online and track them through a 5-stage sequential approval pipeline (BYTES → Librarian → Faculty Adviser → Chairperson → Dean). BYTES officers manage fines, fees, and GCash payments. Once all stages are approved, the student downloads an official PDF clearance form.

Monorepo split: **frontend** (React + Vite + Tailwind) and **backend** (Node.js + Express + Prisma + Supabase Postgres). Built collaboratively by a 9-person team.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Quick Start (Automated)](#quick-start-automated)
- [Manual Setup](#manual-setup)
- [Environment Variables](#environment-variables)
- [Default Accounts](#default-accounts)
- [Smoke Test (End-to-End Demo Path)](#smoke-test-end-to-end-demo-path)
- [API Reference](#api-reference)
- [Branching Strategy](#branching-strategy)
- [Available Scripts](#available-scripts)
- [Roadmap](#roadmap)
- [Team](#team)
- [License](#license)

---

## Features

- ✅ **Role-based access control** — Student, BYTES Officer, Librarian, Faculty Adviser, Chairperson, Dean
- ✅ **Student dashboard** — Submit clearance request, real-time progress, fines/fees view, payment history
- ✅ **5-stage sequential approval pipeline** — BYTES → Librarian → Adviser → Chairperson → Dean, with prerequisite gating
- ✅ **Approver dashboards** — Shared `ApproverBoard` UI consumed by Librarian, Adviser, Chairperson, Dean
- ✅ **BYTES Officer admin** — Pending-account approval, fine management, payment verification, requirements CRUD
- ✅ **Fines & fees + GCash payments** — Receipt upload (5 MB cap), on-site option, officer verification
- ✅ **PDF clearance generation** — Gated download (only after all 5 stages approved)
- ✅ **Email + in-app notifications** — Wired into account approval, every stage decision, and payment events
- ✅ **Reports** — Filterable clearance status report, PDF + CSV export
- ✅ **Audit trail** — Every approval/denial recorded with actor + reason

---

## Tech Stack

### Frontend
| Layer         | Technology                              |
| ------------- | --------------------------------------- |
| Framework     | React 18                                |
| Build Tool    | Vite 5                                  |
| Routing       | React Router v6                         |
| HTTP Client   | Axios                                   |
| Notifications | react-hot-toast                         |
| Styling       | Tailwind CSS                            |
| Icons         | react-icons                             |

### Backend
| Layer       | Technology                |
| ----------- | ------------------------- |
| Runtime     | Node.js 18+ (ESM)         |
| Framework   | Express                   |
| ORM         | Prisma 5                  |
| Database    | PostgreSQL (Supabase)     |
| Auth        | JWT + bcrypt              |
| File Upload | Multer (5 MB cap, images) |
| PDF         | pdfkit                    |
| Email       | Nodemailer (SMTP)         |
| Validation  | Zod                       |

---

## Project Structure

```
CICS_Clearance_System/
│
├── frontend/                            # React 18 + Vite 5 + Tailwind
│   ├── public/                          # Static assets (logos, seals, etc.)
│   ├── src/
│   │   ├── api/
│   │   │   ├── auth.js                  # Axios instance, login, register, JWT interceptor
│   │   │   ├── student.js               # Clearance, fines, fees, payments, PDF download
│   │   │   ├── staff.js                 # Admin/staff endpoints (approvals, reports, fines, users)
│   │   │   └── mock.js                  # Legacy mock data (kept for reference)
│   │   ├── components/
│   │   │   ├── ApprovalModal.jsx        # Reusable approve/deny modal
│   │   │   ├── ApproverBoard.jsx        # Shared queue UI for all 4 approver roles
│   │   │   ├── PaymentModal.jsx         # GCash receipt + reference number form
│   │   │   ├── ProtectedRoute.jsx       # Auth + role gate (uses AuthContext)
│   │   │   ├── Sidebar.jsx              # Admin/BYTES sidebar with logout
│   │   │   ├── StudentSidebar.jsx       # Student sidebar
│   │   │   └── OfficerSidebar.jsx       # Approver sidebar (role-aware)
│   │   ├── context/
│   │   │   └── AuthContext.jsx          # Real backend auth, hydrates from /auth/me
│   │   ├── layouts/
│   │   │   ├── AdminLayout.jsx
│   │   │   ├── StudentLayout.jsx
│   │   │   └── OfficerLayout.jsx
│   │   ├── pages/
│   │   │   ├── LoginPage.jsx            # Role-aware redirect after login
│   │   │   └── RegisterPage.jsx
│   │   ├── student/                     # (owned by Norman)
│   │   │   ├── StudentDashboard.jsx     # Live stats, stages, fines CTA, notifications
│   │   │   ├── MyClearance.jsx          # Submit request + gated PDF download
│   │   │   ├── Payment.jsx              # Fines + fees + GCash receipt upload
│   │   │   ├── Notifications.jsx        # Per-user feed
│   │   │   └── useNotifications.js      # Backend-backed hook
│   │   ├── staff/                       # (owned by Shaheel)
│   │   │   ├── PendingAccounts.jsx      # Approve / deny new student signups
│   │   │   ├── PaymentVerification.jsx  # GCash receipt review
│   │   │   ├── ManageFines.jsx          # Student dropdown, add / remove fines
│   │   │   ├── Reports.jsx              # Filterable report + PDF/CSV export
│   │   │   ├── LibrarianDashboard.jsx   # ┐
│   │   │   ├── AdviserDashboard.jsx     # ├─ all wrap ApproverBoard
│   │   │   ├── ChairpersonDashboard.jsx # │
│   │   │   └── DeanDashboard.jsx        # ┘
│   │   ├── admin/                       # (owned by Affhan)
│   │   │   ├── AdminDashboard.jsx       # Live KPIs + per-stage stacked bar chart
│   │   │   ├── AdminRecords.jsx         # Per-stage matrix with search + CSV export
│   │   │   └── CreateUser.jsx           # Create staff/approver accounts directly
│   │   ├── officer/                     # Legacy / unused namespace (kept for compat)
│   │   ├── App.jsx                      # Route table + ProtectedRoute wiring
│   │   ├── main.jsx                     # AuthProvider + Router entry
│   │   └── index.css                    # Tailwind base + global tokens
│   ├── .env.example
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── vite.config.js                   # Dev server :5173 → proxies /api → :5000
│   └── package.json
│
├── backend/                             # Node.js 18+ (ESM) + Express 4 + Prisma 5
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── auth.controller.js
│   │   │   ├── admin.controller.js      # pending accounts, students, create staff user
│   │   │   ├── clearance.controller.js  # create request, progress, gated PDF
│   │   │   ├── approval.controller.js   # 5-stage decisions + audit
│   │   │   ├── notifications.controller.js
│   │   │   ├── requirements.controller.js
│   │   │   └── reports.controller.js    # dashboard stats + clearance report (PDF/CSV)
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   ├── admin.routes.js          # /pending-accounts, /students, /users, /reports/*
│   │   │   ├── clearance.routes.js
│   │   │   ├── approval.routes.js
│   │   │   ├── notifications.routes.js
│   │   │   └── requirements.routes.js
│   │   ├── payments/                    # (owned by Asraf)
│   │   │   ├── fine.routes.js           # Accepts UUID or School ID for lookups
│   │   │   ├── fee.routes.js
│   │   │   ├── payment.routes.js
│   │   │   └── payment.controller.js
│   │   ├── notifications/               # (owned by Ed)
│   │   │   ├── notify.js                # Best-effort notify() helper
│   │   │   ├── email.js                 # Nodemailer (no-ops if SMTP unset)
│   │   │   └── emailTemplates.js
│   │   ├── lib/
│   │   │   ├── prisma.js                # Shared PrismaClient singleton
│   │   │   ├── jwt.js                   # Sign / verify
│   │   │   ├── clearance.js             # STAGE_ORDER, buildProgress, references
│   │   │   ├── approval.js              # Prereq checker, auto-complete logic
│   │   │   ├── payment.js               # Financial-blocker helpers
│   │   │   ├── pdf.js                   # streamClearancePdf (pdfkit)
│   │   │   ├── upload.js                # Multer (5 MB, image-only)
│   │   │   ├── asyncHandler.js
│   │   │   └── update.js
│   │   ├── middleware/                  # auth (JWT + requireRole), error, validate
│   │   ├── schemas/                     # Zod request schemas
│   │   ├── app.js                       # Express app + CORS + routes
│   │   └── server.js                    # Entry point (listens on :5000)
│   ├── prisma/
│   │   ├── schema.prisma                # 9 models: User, ClearanceRequest, ClearanceStage,
│   │   │                                # Fine, Fee, Payment, Notification, AuditLog, Requirement
│   │   ├── migrations/                  # 4 applied migrations
│   │   └── seed.js                      # Team + role-tester + test-student accounts
│   ├── .env.example
│   ├── .env                             # ← gitignored — fill via setup.ps1
│   └── package.json
│
├── claude-docs/                         # PROMPTS, PROGRESS, AUDIT, MODULES,
│                                        # API_CONTRACT, ERD, DECISIONS, DEBUGGING, WORKFLOW
├── CLAUDE.md                            # Module ownership + AI assistant rules
├── CONTRIBUTING.md                      # PR + branching rules
├── PROGRESS.md                          # Phase-by-phase status
├── RUN.md                               # Full local-run guide
├── README.md                            # ← this file
├── setup.ps1                            # One-shot bootstrap (Windows)
└── .gitignore
```

---

## Prerequisites

- [Node.js](https://nodejs.org/) **≥ 18**
- [npm](https://www.npmjs.com/) **≥ 9** (bundled with Node)
- [Git](https://git-scm.com/)
- A free [Supabase](https://supabase.com) project (provides hosted Postgres). From **Project Settings → Database → Connection string** copy two URIs:
  - **Transaction pooler** (port `6543`) → `DATABASE_URL`
  - **Session/Direct** (port `5432`) → `DIRECT_URL`

You do **not** need a local Postgres install — Supabase hosts the database.

---

## Quick Start (Automated)

The fastest path. From the project root:

```powershell
powershell -ExecutionPolicy Bypass -File .\setup.ps1
```

The script:
1. Verifies Node ≥ 18 and npm ≥ 9
2. Prompts for the two Supabase URIs (only the first time)
3. Generates a cryptographically random `JWT_SECRET`
4. Writes `backend/.env` and `frontend/.env.local`
5. Runs `npm install` in both workspaces
6. Applies Prisma migrations and seeds the database

It is idempotent — re-run anytime; any values already set are preserved.

After it finishes, start two terminals:

```powershell
# Terminal 1
cd backend ; npm run dev

# Terminal 2
cd frontend ; npm run dev
```

Open **http://localhost:5173**.

---

## Manual Setup

If you'd rather not run the script:

### Backend

```powershell
cd backend
npm install
copy .env.example .env
# Edit .env — fill DATABASE_URL, DIRECT_URL, set a JWT_SECRET
npx prisma migrate deploy
npx prisma generate
npm run seed
npm run dev                          # http://localhost:5000
```

### Frontend

```powershell
cd frontend
npm install
copy .env.example .env.local
npm run dev                          # http://localhost:5173
```

Vite proxies `/api/*` to `http://127.0.0.1:5000`. No additional config needed unless you change the backend port.

For full setup details + troubleshooting, see [`RUN.md`](RUN.md).

---

## Environment Variables

### Backend (`backend/.env`)

| Variable          | Description                                                       | Example                                                |
| ----------------- | ----------------------------------------------------------------- | ------------------------------------------------------ |
| `DATABASE_URL`    | Supabase Transaction pooler URI (port 6543, app runtime)          | `postgresql://postgres.xxx:PASS@aws-...:6543/postgres?pgbouncer=true` |
| `DIRECT_URL`      | Supabase Direct/Session URI (port 5432, used by `prisma migrate`) | `postgresql://postgres.xxx:PASS@aws-...:5432/postgres` |
| `JWT_SECRET`      | Secret used to sign JWT tokens (32+ random bytes recommended)     | `2fe2a6bb...`                                          |
| `JWT_EXPIRES_IN`  | Token lifetime                                                    | `7d`                                                   |
| `PORT`            | API server port                                                   | `5000`                                                 |
| `CORS_ORIGIN`     | Allowed frontend origin                                           | `http://localhost:5173`                                |
| `SMTP_*` *(opt)*  | SMTP host/port/user/pass for outbound email                       | gracefully no-ops if unset                             |

### Frontend (`frontend/.env.local`)

| Variable            | Description                                  | Example                  |
| ------------------- | -------------------------------------------- | ------------------------ |
| `VITE_API_BASE_URL` | Backend base URL (optional; usually proxied) | `http://localhost:5000`  |

---

## Default Accounts

After `npm run seed`, the following accounts are available. **Default password for all role testers and team members is `Cics#2026`** unless noted.

### Role testers (use these to walk the approval pipeline)

| Email                     | Password    | Role             |
| ------------------------- | ----------- | ---------------- |
| `admin2@cics.edu.ph`      | `Bytes#2026`| `admin`          |
| `librarian@cics.edu.ph`   | `Cics#2026` | `librarian`      |
| `adviser@cics.edu.ph`     | `Cics#2026` | `faculty_adviser`|
| `chairperson@cics.edu.ph` | `Cics#2026` | `chairperson`    |
| `dean@cics.edu.ph`        | `Cics#2026` | `dean`           |

### Team accounts (all seeded as `admin` for development)

`affhan@s.msumain.edu.ph`, `dimalutang@s.msumain.edu.ph`, `naimah@s.msumain.edu.ph`, `asraf@s.msumain.edu.ph`, `landia@s.msumain.edu.ph`, `ed@s.msumain.edu.ph`, `norman@s.msumain.edu.ph`, `shaheel@s.msumain.edu.ph`, `jonaidah@s.msumain.edu.ph`, `diranggarun.hg587@s.msumain.edu.ph`

> Change all default passwords before production.

---

## Smoke Test (End-to-End Demo Path)

1. Open http://localhost:5173 → **Register** a new student.
2. Log in as `admin2@cics.edu.ph` → **Pending Accounts** → approve the new student.
3. Log in as the student → **My Clearance** → **Submit Clearance Request**.
4. Log back in as `admin2@cics.edu.ph` → approve the BYTES stage.
5. Repeat for `librarian@...`, `adviser@...`, `chairperson@...`, `dean@...` (one login per role).
6. Log back in as the student → **My Clearance** → **Download PDF** button is now enabled → file downloads.

Optional: issue a fine to the student first to test the GCash receipt-upload flow and the BYTES financial-blocker gate.

---

## API Reference

Base URL: `http://localhost:5000/api`

### Authentication

| Method | Endpoint              | Description                           | Auth |
| ------ | --------------------- | ------------------------------------- | ---- |
| `POST` | `/auth/register`      | Create a pending student account      | —    |
| `POST` | `/auth/login`         | Log in, returns JWT (blocks pending)  | —    |
| `GET`  | `/auth/me`            | Get the current authenticated user    | ✅   |
| `POST` | `/auth/logout`        | Stateless logout                      | ✅   |

### Admin (BYTES Officer)

| Method | Endpoint                                   | Description                |
| ------ | ------------------------------------------ | -------------------------- |
| `GET`  | `/admin/pending-accounts`                  | List pending registrations |
| `POST` | `/admin/pending-accounts/:id/approve`      | Approve a pending account  |
| `POST` | `/admin/pending-accounts/:id/deny`         | Deny (`{ reason }`)        |
| `GET`  | `/admin/dashboard-stats`                   | Totals + per-stage breakdown |
| `GET`  | `/admin/reports/clearance`                 | Filtered report (`?status=`, `?stage=`) |
| `GET`  | `/admin/reports/clearance.pdf`             | PDF export                 |
| `GET`  | `/admin/reports/clearance.csv`             | CSV export                 |

### Clearance (Student)

| Method | Endpoint                       | Description                                  |
| ------ | ------------------------------ | -------------------------------------------- |
| `POST` | `/clearance/request`           | Create clearance request (5 ordered stages)  |
| `GET`  | `/clearance/me`                | Most recent request + progress               |
| `GET`  | `/clearance/me/progress`       | Active request stepper data                  |
| `GET`  | `/clearance/:id/pdf`           | Download PDF (409 if any stage not approved) |

### Approval (Role-gated)

| Method | Endpoint                       | Description                                  |
| ------ | ------------------------------ | -------------------------------------------- |
| `GET`  | `/approval/pending`            | Actionable items for the caller's role       |
| `POST` | `/approval/:id/approve`        | Approve current stage (`{ reason? }`)        |
| `POST` | `/approval/:id/deny`           | Deny stage (`{ reason }`, fails the request) |
| `GET`  | `/approval/:id/audit`          | Full audit trail for the request             |

### Fines / Fees / Payments

| Method   | Endpoint                       | Auth          | Description                                |
| -------- | ------------------------------ | ------------- | ------------------------------------------ |
| `POST`   | `/fines`                       | bytes_officer | Issue a fine                               |
| `GET`    | `/fines/:studentId`            | self/officer  | List a student's fines                     |
| `PUT`    | `/fines/:id`                   | bytes_officer | Edit / mark paid                           |
| `DELETE` | `/fines/:id`                   | bytes_officer | Remove                                     |
| `GET`    | `/fees`                        | any           | Fee catalogue (read-only)                  |
| `POST`   | `/fees`                        | bytes_officer | Add a fee                                  |
| `DELETE` | `/fees/:id`                    | bytes_officer | Remove a fee                               |
| `POST`   | `/payments`                    | student       | Submit a payment                           |
| `GET`    | `/payments`                    | student/officer | Self / all                               |
| `POST`   | `/payments/upload`             | student       | Upload receipt (multipart, ≤ 5 MB, image)  |
| `PUT`    | `/payments/:id/approve`        | bytes_officer | Verify payment (idempotent)                |
| `PUT`    | `/payments/:id/deny`           | bytes_officer | Deny (`{ reason }`)                        |

### Notifications

| Method | Endpoint                          | Description                  |
| ------ | --------------------------------- | ---------------------------- |
| `GET`  | `/notifications`                  | Feed for current user        |
| `POST` | `/notifications/:id/read`         | Mark one as read             |
| `POST` | `/notifications/read-all`         | Mark all as read             |

### Requirements

| Method   | Endpoint                       | Auth          | Description                  |
| -------- | ------------------------------ | ------------- | ---------------------------- |
| `GET`    | `/requirements`                | any           | Filter by `?role=`           |
| `POST`   | `/requirements`                | bytes_officer | Create                       |
| `PUT`    | `/requirements/:id`            | bytes_officer | Update                       |
| `DELETE` | `/requirements/:id`            | bytes_officer | Remove                       |

Full contract in [`claude-docs/API_CONTRACT.md`](claude-docs/API_CONTRACT.md).

---

## Branching Strategy

| Branch              | Purpose                                                |
| ------------------- | ------------------------------------------------------ |
| `main`              | Production-ready code only                             |
| `develop`           | Integration branch — feature merges land here          |
| `feat/<feature>`    | New features (e.g. `feat/auth-login-flow`)             |
| `fix/<issue>`       | Bug fixes                                              |
| `chore/<task>`      | Tooling, configs, dependencies                         |

Module ownership is documented in [`CLAUDE.md`](CLAUDE.md). Never modify another developer's module without coordinating first. Full workflow rules in [`claude-docs/WORKFLOW.md`](claude-docs/WORKFLOW.md).

---

## Available Scripts

### Frontend (`/frontend`)

| Command           | Description                              |
| ----------------- | ---------------------------------------- |
| `npm run dev`     | Vite dev server with HMR (port 5173)     |
| `npm run build`   | Production bundle to `dist/`             |
| `npm run preview` | Preview the production build locally     |
| `npm run lint`    | ESLint (currently missing config)        |

### Backend (`/backend`)

| Command                       | Description                          |
| ----------------------------- | ------------------------------------ |
| `npm run dev`                 | nodemon dev server (port 5000)       |
| `npm run start`               | Plain node start (production)        |
| `npm run seed`                | Seed team + role-tester accounts     |
| `npm run prisma:generate`     | Generate Prisma client               |
| `npm run prisma:migrate`      | Run dev migration interactively      |
| `npm run prisma:studio`       | Open Prisma DB GUI                   |

---

## Roadmap

Detailed status per phase + module: [`claude-docs/PROGRESS.md`](claude-docs/PROGRESS.md). Current overall completion: **~80%**.

- [x] **Phase 0–3** — Project scaffolding, DB schema, backend foundation
- [x] **Phase 4** — Auth + RBAC
- [x] **Phase 5** — Notifications (email + in-app)
- [x] **Phase 6** — Payment module (fines, fees, GCash, RBAC)
- [x] **Phase 7** — Approval workflow engine (5-stage gating, audit log)
- [x] **Phase 8** — Clearance request + gated PDF
- [x] **Phase 9** — Admin dashboard, reports, requirements
- [x] **Phase 10–11** — Frontend scaffolding + Auth UI
- [x] **Phase 12** — Student frontend (wired to real backend, gated PDF download)
- [x] **Phase 13** — Admin/staff dashboards (9 screens, real APIs)
- [x] **Phase 14–15** — Approval action UI + Reports UI
- [ ] **Phase 16** — Integration tests
- [ ] **Phase 17** — Deployment (Dockerfile, env, hosting)

---

## Team

College of Information and Computing Studies, MSU – Main Campus (9 members).

| Member                  | Module                                                                       |
| ----------------------- | ---------------------------------------------------------------------------- |
| Affhan Mimbisa          | DB schema, Admin Dashboard, Reports, Requirements                            |
| Dimalutang Amerhussein  | Authentication and User Management                                           |
| Naimah Abdulcader       | Student Clearance Request + PDF generation                                   |
| Asraf Alauya Jr.        | Payment (fines, fees, GCash receipts)                                        |
| Landia Cherry Mae       | Approval Workflow Engine                                                     |
| Ed Arafat               | Notification System (email + in-app)                                         |
| Norman Sharief          | Student-facing frontend                                                      |
| Shaheel Sarip           | Admin / staff-facing frontend                                                |
| Jonaidah Caris          | Design system + Figma mockups                                                |

---

## License

Released under the [MIT License](LICENSE).

---

<div align="center">

Made with care by the CICS – MSU Main Campus team.

</div>
