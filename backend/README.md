# CICS E-Clearance — Backend (Task 1: Auth & User Management)

Node.js + Express + Prisma + Supabase (PostgreSQL). Powers the existing `cics-eclearance` frontend's Register/Login pages.

## Setup

1. **Create a [Supabase](https://supabase.com) project** (Dashboard → New project). Then open **Project Settings → Database → Connection string** and copy:
   - the **Transaction pooler** URI (port `6543`) → `DATABASE_URL`
   - the **Session / direct** URI (port `5432`) → `DIRECT_URL`
2. From this folder:
   ```bash
   npm install
   cp .env.example .env
   # edit DATABASE_URL, DIRECT_URL (your Supabase URIs) and JWT_SECRET in .env
   npx prisma migrate dev --name init
   npm run seed       # creates a BYTES Officer admin
   npm run dev
   ```
3. The API runs on `http://localhost:5000`. Vite proxies `/api/*` to it (see `frontend/vite.config.js`).

## Seeded admin

| email                 | password    | role          |
|-----------------------|-------------|---------------|
<<<<<<< HEAD
| bytes@cics.edu.ph     | Bytes#2026  | bytes_officer |
=======
| admin2@cics.edu.ph    | Bytes#2026  | admin         |
>>>>>>> d28bd3b538eb5eb7f22a9b7749abab309e37038e

Use this account to approve newly-registered students via `/api/admin/pending-accounts/:id/approve`.

## Endpoints

| Method | Path                                       | Auth          | Purpose                               |
|--------|--------------------------------------------|---------------|---------------------------------------|
| POST   | /api/auth/register                         | public        | Student signup (status = pending)     |
| POST   | /api/auth/login                            | public        | Returns `{ access_token, user }`      |
| POST   | /api/auth/logout                           | public        | No-op for stateless JWT               |
| GET    | /api/auth/me                               | Bearer        | Current user                          |
| GET    | /api/admin/pending-accounts                | bytes_officer | List accounts awaiting approval       |
| POST   | /api/admin/pending-accounts/:id/approve    | bytes_officer | Approve account                       |
| POST   | /api/admin/pending-accounts/:id/deny       | bytes_officer | Deny account (body: `{ reason }`)     |
| POST   | /api/clearance/request                     | student       | Start a clearance request             |
| GET    | /api/clearance/me                          | student       | Most recent request + progress        |
| GET    | /api/clearance/me/progress                 | student       | Active request progress (stepper)     |
| GET    | /api/clearance/:id/pdf                     | owner/officer | PDF form — 409 unless fully approved  |

## curl examples

```bash
# Register a student (matches the existing RegisterPage form payload)
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "id_number": "2024-00001",
    "course": "BS-Information Technology",
    "first_name": "Juan",
    "middle_name": "Santos",
    "last_name": "Dela Cruz",
    "gender": "Male",
    "date_of_birth": "2003-05-12",
    "contact_number": "09171234567",
    "email": "juan@cics.edu.ph",
    "password": "Pa55word!"
  }'

# Login as BYTES Officer
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
<<<<<<< HEAD
  -d '{"email":"bytes@cics.edu.ph","password":"Bytes#2026"}'
=======
  -d '{"email":"admin2@cics.edu.ph","password":"Bytes#2026"}'
>>>>>>> d28bd3b538eb5eb7f22a9b7749abab309e37038e

# Approve pending student (replace TOKEN and ID)
curl -X POST http://localhost:5000/api/admin/pending-accounts/<USER_ID>/approve \
  -H "Authorization: Bearer <TOKEN>"
```

## What's NOT in this task

Tasks 2–6 (clearance requests, fines/fees, payments, approval workflow, notifications, reports) extend this same Prisma schema and Express app. Don't add those tables or routes here yet — coordinate with the rest of the team per the prompt pack.
