# Module Contracts

Each module is owned by one developer.
This file defines what each module owns, exposes, and depends on.

---

## Module 1: Authentication and User Management
**Owner:** Dimalutang, Amerhussein
**Location:** backend/modules/auth/

### Owns
- User registration: school_id, role, full_name, sex, birthdate, email,
  contact_number, college, department, password
- Login and logout
- Password hashing (bcrypt)
- JWT issuance and validation
- RBAC for all 6 roles
- Account approval flow (BYTES reviews pending registrations)

### Exposes to other modules
- require_role([roles...]) dependency
- get_current_user() dependency
- is_account_approved(user_id) -> bool

### Depends on
- users table (Affhan schema)
- Ed notification module (email on account approval)

### Endpoints
- POST /api/auth/register
- POST /api/auth/login
- POST /api/auth/logout
- GET  /api/auth/me
- GET  /api/auth/pending-accounts  [bytes only]
- POST /api/auth/accounts/{id}/approve  [bytes only]
- POST /api/auth/accounts/{id}/reject   [bytes only]

---

## Module 2: Student Clearance Request
**Owner:** Naimah, Abdulcader
**Location:** backend/modules/clearance/

### Owns
- Submitting a clearance request
- Real-time status tracking per stage
- PDF generation of final clearance form
- Gate: PDF cannot generate until ALL 5 stages approved

### Exposes
- get_clearance_status(request_id) -> stage breakdown
- is_fully_cleared(request_id) -> bool

### Depends on
- auth module
- approval module (reads stage states)
- payment module (checks fines before allowing submission)

### Endpoints
- POST /api/clearance/request
- GET  /api/clearance/my-requests
- GET  /api/clearance/requests/{id}
- GET  /api/clearance/requests/{id}/status
- GET  /api/clearance/requests/{id}/pdf  [409 if not fully cleared]

---

## Module 3: Payment (Fines and Fees)
**Owner:** Asraf, Alauya Jr.
**Location:** backend/modules/payment/

### Owns
- Fines management (add/update/view per student)
- Fees management (SSG, course, department, college)
- GCash receipt upload (max 5MB, image or PDF)
- On-site payment marking
- BYTES payment verification

### Exposes
- has_unpaid_fines(user_id) -> bool   [used by approval module]
- has_unpaid_fees(user_id) -> bool

### Depends on
- auth module
- uploads/receipts/ folder (restricted, not served publicly)

### Endpoints
- GET  /api/payment/fines/me
- GET  /api/payment/fees/me
- POST /api/payment/fines/{id}/pay
- POST /api/payment/upload-receipt  [multipart, max 5MB]
- GET  /api/payment/pending-verifications  [bytes]
- POST /api/payment/verify/{payment_id}  [bytes]
- POST /api/payment/fines  [bytes — create]
- PATCH /api/payment/fines/{id}  [bytes — update]

---

## Module 4: Approval Workflow Engine
**Owner:** Landia, Cherry Mae
**Location:** backend/modules/approval/

### Owns
- Per-stage approval logic (5 stages)
- Prerequisite validation
- Approve/deny with reason field
- Audit trail (immutable append-only log)

### Prerequisites enforced
- BYTES: no unpaid fines (calls payment.has_unpaid_fines)
- Librarian: anytime after submission
- Adviser: BYTES must be approved
- Chairperson: BYTES + Librarian + Adviser all approved
- Dean: all four prior stages approved

### Exposes
- get_approval_state(request_id, stage)
- record_approval(request_id, stage, approver_id, action, reason)

### Depends on
- auth module
- payment module (has_unpaid_fines)
- notifications module (trigger emails on each transition)

### Endpoints
- GET  /api/approval/pending  [filtered by caller role]
- POST /api/approval/{request_id}/bytes
- POST /api/approval/{request_id}/librarian
- POST /api/approval/{request_id}/adviser
- POST /api/approval/{request_id}/chairperson
- POST /api/approval/{request_id}/dean
- GET  /api/approval/{request_id}/audit-trail

---

## Module 5: Notification System
**Owner:** Ed, Arafat
**Location:** backend/modules/notifications/

### Owns
- Email service (SMTP/SendGrid/Gmail API)
- Email templates (Jinja2 HTML)
- In-app notification feed
- All notification triggers

### Exposes
- send_email(to, template, context)
- create_in_app_notification(user_id, title, body, link)

### Depends on
- Email credentials in .env
- notifications table (Affhan schema)
- Templates in backend/modules/notifications/templates/

### Email templates needed
- account_approved.html
- account_rejected.html
- clearance_submitted.html
- clearance_stage_approved.html
- clearance_stage_denied.html
- clearance_fully_cleared.html
- fine_added.html
- payment_received.html
- payment_verified.html
- payment_rejected.html

### Endpoints
- GET  /api/notifications/me
- POST /api/notifications/{id}/mark-read

---

## Module 6: Admin Dashboard + Reports + Requirements + Database
**Owner:** Affhan, Mimbisa
**Location:** backend/modules/admin/, backend/modules/requirements/, backend/modules/reports/, database/

### Owns
- database/schema.sql (source of truth for all tables)
- All migration files: database/migration_NNN_*.sql
- Admin dashboard aggregation APIs
- Requirements CRUD (BYTES manages clearance requirements)
- Reports with PDF and Excel export

### Special responsibility
Affhan is the schema coordinator. Any database change from any module owner
must go through Affhan first. Affhan writes the migration file.

### Endpoints
- GET  /api/admin/dashboard/stats
- GET  /api/admin/requirements
- POST /api/admin/requirements  [bytes]
- PATCH /api/admin/requirements/{id}  [bytes]
- DELETE /api/admin/requirements/{id}  [bytes]
- GET  /api/admin/reports/clearance-status
- GET  /api/admin/reports/export.pdf
- GET  /api/admin/reports/export.xlsx

---

## Module 7: Student Frontend
**Owner:** Norman, Sharief
**Location:** frontend/src/pages/student/

### Owns
- Landing page, signup, login
- Student dashboard
- Request clearance form
- Clearance status tracker (real-time polling)
- Fines view and payment selection (GCash upload + on-site)
- Fees payment page
- Notifications panel
- Download clearance PDF page

### Depends on
- Shared components at frontend/src/components/shared/
- Jonaidah design system

---

## Module 8: Admin/Staff Frontend
**Owner:** Shaheel, Sarip
**Location:** frontend/src/pages/admin/

### Owns
- BYTES dashboard (accounts, payments, clearances, fines, requirements, reports)
- Payment verification screen (receipt preview, approve/reject)
- Librarian, Adviser, Chairperson, Dean dashboards
- Approval action modal (shared component, approve/deny with reason)

### Depends on
- Shared components at frontend/src/components/shared/
- Jonaidah design system

---

## Shared zones (coordinate before changing)

| Path | Rule |
|---|---|
| database/schema.sql | Affhan only edits |
| claude-docs/API_CONTRACT.md | Team consensus to change |
| frontend/src/components/shared/ | Additions free, modifications announce first |
| frontend/src/services/api.js | Additions free, modifications announce first |
| .env.example | Anyone can add a variable, document its purpose |

## Dependency graph

notifications (Ed)
       ^ (triggered by)
       |
auth (Dimalutang) <-- approval (Landia) --> payment (Asraf)
       ^                    ^                    ^
       |                    |                    |
       +------- clearance (Naimah) --------------+
                     |
                     v
              admin/reports (Affhan)
                     ^
          +----------+----------+
          |                     |
  student FE (Norman)    admin FE (Shaheel)
