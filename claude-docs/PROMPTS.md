# CICS E-Clearance — Phase Prompts for Claude Code

For the 9-person CICS E-Clearance team.
Use: say "Do Phase N" or "Gap analysis for Phase N" in Claude Code.
Critical: these prompts describe the END STATE for an empty folder.
Claude Code reads CLAUDE.md and will gap-analyze against existing code first.

---

## Phase index

Phase 0   Pre-flight setup             Tech lead
Phase 1   Project scaffolding          Tech lead
Phase 2   Database schema              Affhan
Phase 3   Backend foundation           Tech lead
Phase 4   Auth and RBAC                Dimalutang
Phase 5   Notification foundation      Ed
Phase 6   Payment module               Asraf
Phase 7   Approval workflow engine     Landia
Phase 8   Clearance request and PDF    Naimah
Phase 9   Admin / Reports / Reqs       Affhan
Phase 10  Frontend scaffolding         Norman and Shaheel
Phase 11  Auth UI                      Both FEs
Phase 12  Student pages                Norman
Phase 13  Admin dashboards             Shaheel
Phase 14  Approval action UI           Shaheel
Phase 15  Reports UI                   Shaheel
Phase 16  Integration testing          Everyone
Phase 17  Deployment                   Tech lead and Affhan

Phases 4-9 can run in parallel (each dev owns a distinct module).
Phases 12-15 can also run in parallel.

---

## PHASE 0 - Pre-flight Setup

Goal: lock decisions before any code is written.

  Set up the project foundations. Do NOT write code yet.

  1. Confirm and record these decisions in claude-docs/DECISIONS.md:
     - Backend framework (FastAPI vs Express)
     - Database (MySQL vs PostgreSQL)
     - Email provider (SMTP vs SendGrid vs Gmail API)
     - PDF library (ReportLab vs WeasyPrint vs pdfkit)
     - Hosting target

  2. Initialize Git with main and dev branches.
     Add .gitignore for the chosen stack.
     Document branch naming in claude-docs/WORKFLOW.md.

  3. Confirm the API contract in claude-docs/API_CONTRACT.md.
     Each backend developer reads their section.
     Lock version 1.0 once everyone signs off.

  Print a summary of locked decisions and any remaining open items.

---

## PHASE 1 - Project Scaffolding

Goal: create the folder skeleton everyone commits into.

  Create this folder structure. Do NOT install dependencies yet.

  backend/
    modules/
      auth/         __init__.py routes.py service.py schemas.py models.py
      clearance/    __init__.py routes.py service.py schemas.py models.py
      payment/      __init__.py routes.py service.py schemas.py models.py
      approval/     __init__.py routes.py service.py schemas.py models.py
      notifications/ __init__.py routes.py service.py schemas.py models.py
      admin/        __init__.py routes.py service.py schemas.py
      requirements/ __init__.py routes.py service.py schemas.py
      reports/      __init__.py routes.py service.py schemas.py
    shared/
      __init__.py database.py auth_deps.py
    uploads/
      receipts/.gitkeep
    main.py requirements.txt .env.example

  frontend/
    src/
      pages/
        student/
        admin/
      components/
        shared/
      services/ api.js
      hooks/
      App.jsx main.jsx
    public/ package.json .env.example

  database/
    schema.sql

  Top-level README.md with team structure from CLAUDE.md.

---

## PHASE 2 - Database Schema (Affhan)

Goal: lock the schema. Everyone codes against this.

  I am Affhan. Create database/schema.sql for MySQL 8.

  Use all 13 tables documented in claude-docs/ERD.md with exact column names,
  types, ENUMs, FKs, and indexes.

  Include:
  - CREATE DATABASE IF NOT EXISTS cics_eclearance;
  - Tables in order: users, account_approvals, clearance_requests,
    approval_stages, audit_logs, fines, fees, payments, payment_receipts,
    requirements, requirement_completions, notifications, email_logs
  - DEV RESET block at the top with DROP TABLE IF EXISTS, commented out by default
  - Seed data: 1 BYTES officer, 1 Dean, 3 starter requirements

  Print: clean run confirmation, SHOW TABLES output.
  Update PROGRESS.md: Phase 2 Done.

---

## PHASE 3 - Backend Foundation (Tech Lead)

Goal: shared code every module depends on.

  1. Fill backend/requirements.txt with pinned versions:
     fastapi uvicorn[standard] sqlalchemy pymysql cryptography pydantic
     pydantic-settings python-multipart python-jose[cryptography]
     bcrypt==4.0.1 passlib[bcrypt] python-dotenv reportlab openpyxl jinja2

  2. Fill backend/.env.example:
     DATABASE_URL JWT_SECRET JWT_ALGORITHM ACCESS_TOKEN_EXPIRE_MINUTES
     EMAIL_PROVIDER SMTP_HOST SMTP_PORT SMTP_USER SMTP_PASS FROM_EMAIL
     UPLOAD_DIR MAX_UPLOAD_MB FRONTEND_ORIGIN

  3. backend/shared/config.py  pydantic-settings Settings class loading .env

  4. backend/shared/database.py  SQLAlchemy engine, SessionLocal, Base, get_db

  5. backend/main.py  FastAPI app titled CICS E-Clearance API,
     CORS allowing FRONTEND_ORIGIN, GET /health returning status ok,
     stub routers for all 8 modules registered.

  6. Install dependencies. Confirm uvicorn starts and /health works.
  7. Update PROGRESS.md.

---

## PHASE 4 - Auth Module (Dimalutang)

Goal: registration, login, RBAC. Everything else gates on this.

  I am Dimalutang, owner of backend/modules/auth/.

  Reference: claude-docs/API_CONTRACT.md (Auth section)
  Reference: claude-docs/MODULES.md (Module 1)

  Build in backend/modules/auth/:

  1. models.py  SQLAlchemy User and AccountApproval models
  2. schemas.py  RegisterRequest LoginRequest TokenResponse UserOut AccountApprovalAction
  3. service.py:
     - register_user: validate email, check duplicate, hash pw, insert is_approved=False
     - login_user: verify pw, check is_approved, create JWT, return TokenResponse
     - get_pending_accounts
     - approve_account: update is_approved, insert account_approval row, trigger email
     - reject_account: insert account_approval row with reason, trigger email
  4. routes.py: all endpoints from API contract for /api/auth/*
  5. backend/shared/auth_deps.py: get_current_user and require_role factory

  Test: register -> BYTES approves -> login -> /api/auth/me
  Update PROGRESS.md.

  CRITICAL: only modify backend/modules/auth/ and backend/shared/auth_deps.py.

---

## PHASE 5 - Notifications Foundation (Ed)

Goal: email service and in-app feed, callable by other modules.

  I am Ed, owner of backend/modules/notifications/.

  Reference: claude-docs/MODULES.md (Module 5)

  1. service.py:
     - configure_email() based on EMAIL_PROVIDER in .env
     - send_email(to, template_name, context): load Jinja2 template, render, send, log
     - create_in_app_notification(db, user_id, title, body, link)

  2. templates/ folder with 10 HTML templates (use placeholders now):
     account_approved, account_rejected, clearance_submitted,
     clearance_stage_approved, clearance_stage_denied, clearance_fully_cleared,
     fine_added, payment_received, payment_verified, payment_rejected

  3. routes.py: GET /api/notifications/me and POST /api/notifications/{id}/mark-read

  Test: send a test email, create an in-app notification, fetch via endpoint.
  Update PROGRESS.md.

  CRITICAL: only modify backend/modules/notifications/.

---

## PHASE 6 - Payment Module (Asraf)

Goal: fines, fees, payment, receipt upload, BYTES verification.

  I am Asraf, owner of backend/modules/payment/.

  Reference: claude-docs/API_CONTRACT.md (Payment section)
  Reference: claude-docs/MODULES.md (Module 3)

  1. models.py  Fine, Fee, Payment, PaymentReceipt SQLAlchemy models
  2. schemas.py  Pydantic models for all endpoints
  3. service.py:
     - create_fine(db, student_id, description, amount, created_by)
     - get_fines_for_student(db, student_id)
     - submit_payment(db, fine_id_or_fee_id, method)
     - upload_receipt(db, payment_id, file): validate max 5MB image or PDF,
       save under uploads/receipts/{uuid}.ext, update payment status
     - verify_payment(db, payment_id, reviewer_id, action, reason)
     - has_unpaid_fines(db, user_id) -> bool
     - has_unpaid_fees(db, user_id) -> bool
  4. routes.py: all endpoints from API contract

  Trigger Ed notifications on: fine created, payment uploaded, payment verified/rejected.
  Use a TODO comment if Ed module not ready yet.

  Test: BYTES creates fine -> student uploads receipt -> BYTES verifies.
  Update PROGRESS.md.

  CRITICAL: only modify backend/modules/payment/.

---

## PHASE 7 - Approval Workflow Engine (Landia)

Goal: 5-stage approval with prerequisites and audit trail.

  I am Landia, owner of backend/modules/approval/.

  Reference: claude-docs/API_CONTRACT.md (Approval section)
  Reference: claude-docs/MODULES.md (Module 4)

  The prerequisite rules are the most critical part. Re-read them in MODULES.md.

  1. models.py  ApprovalStage and AuditLog SQLAlchemy models
  2. schemas.py  Pydantic for approve/deny payloads
  3. service.py:
     - initialize_stages(db, request_id): create 5 rows in approval_stages,
       bytes and librarian as pending, others as blocked
     - check_prerequisites(db, request_id, stage) -> (ok: bool, reason: str)
     - act_on_stage(db, request_id, stage, approver_id, action, reason):
       validate prerequisites, update stage, write audit_log,
       unlock next stage if prerequisites now met, trigger notification
     - get_pending_for_role(db, role)
     - get_audit_trail(db, request_id)
  4. routes.py: all stage endpoints

  Write 5 integration tests:
  - Happy path full approval
  - Adviser before BYTES: expect 400
  - Dean before chairperson: expect 400
  - BYTES with unpaid fines: expect 400
  - Denial creates audit_log entry

  Update PROGRESS.md.

  CRITICAL: only modify backend/modules/approval/.
  The prerequisite check is the heart of the system.

---

## PHASE 8 - Clearance Request and PDF (Naimah)

Goal: submission, status tracking, PDF generation gated on full approval.

  I am Naimah, owner of backend/modules/clearance/.

  Reference: claude-docs/API_CONTRACT.md (Clearance section)
  Reference: claude-docs/MODULES.md (Module 2)

  1. models.py  ClearanceRequest SQLAlchemy model
  2. schemas.py  request submission, rich status response
  3. service.py:
     - submit_request(db, student_id, semester, academic_year, purpose):
       check has_unpaid_fines, check no existing in-progress request,
       INSERT clearance_requests, call approval.initialize_stages, return request_id
     - get_status(db, request_id): aggregate approval_stages into rich response
     - get_student_requests(db, student_id)
     - generate_pdf(db, request_id): use ReportLab A4,
       raise 409 if not fully cleared,
       include MSU/CICS letterhead placeholder, student details,
       approval signatures section with approver name and date
  4. routes.py: all endpoints

  Trigger notifications: on submission notify approvers, on fully cleared email student.
  Test end-to-end with Phase 7 approval flow.
  Update PROGRESS.md.

  CRITICAL: PDF must FAIL with 409 if not fully cleared. Do not relax this gate.

---

## PHASE 9 - Admin / Reports / Requirements (Affhan)

Goal: BYTES/Dean dashboard, requirement management, exportable reports.

  I am Affhan. Build admin, requirements, and reports modules.

  Reference: claude-docs/API_CONTRACT.md (Admin section)

  1. admin/service.py: get_dashboard_stats(db, role)
  2. admin/routes.py: GET /api/admin/dashboard/stats

  3. requirements/models.py schemas.py service.py routes.py:
     CRUD for requirements (BYTES only). Read for anyone authenticated.

  4. reports/service.py:
     - clearance_status_report(db, filters): return list of student/semester/status/stages
     - export_pdf(rows): ReportLab, return BytesIO
     - export_xlsx(rows): openpyxl, return BytesIO
  5. reports/routes.py: clearance-status, export.pdf, export.xlsx

  Test: BYTES sees stats, CRUD requirements, generate PDF and Excel reports.
  Update PROGRESS.md.

---

## PHASE 10 - Frontend Scaffolding (Norman and Shaheel together)

Goal: Vite React Tailwind, shared services, routing.

  cd frontend/
  npm create vite@latest . -- --template react
  npm i react-router-dom axios react-hot-toast lucide-react @tanstack/react-query react-hook-form zod
  npm i -D tailwindcss@3 postcss autoprefixer
  npx tailwindcss init -p

  Configure tailwind.config.js: content ["./index.html","./src/**/*.{js,jsx}"]
  Replace src/index.css with @tailwind base/components/utilities.

  Create src/services/api.js:
    axios instance, VITE_API_URL, JWT interceptor, 401 redirect to /login

  Create src/contexts/AuthContext.jsx:
    provides user login logout register loading, persists token in localStorage,
    on mount calls /api/auth/me to revalidate

  Create src/components/shared/:
    Button Input Card Modal Table StatusBadge Spinner

  Routing in App.jsx:
    / redirect based on role
    /login /register public
    /student/* student role only
    /admin/bytes/* /admin/librarian/* /admin/adviser/*
    /admin/chairperson/* /admin/dean/* role-protected
    * NotFound

  Create frontend/.env: VITE_API_URL=http://localhost:8000

  Run npm run dev, confirm app loads at localhost:5173.

---

## PHASE 11 - Auth UI (Both FEs)

Goal: login and register screens.

  Build /login and /register pages.

  Login: email and password fields, redirect by role after success.
  Register: all fields from API contract (school_id, role, full_name, sex,
  birthdate, email, contact_number, college, department, password).
  After register: show pending message, do NOT auto-login.

  Form validation with react-hook-form and zod.
  Error messages from backend 422 responses shown inline.
  Loading spinner on submit button.

  Role redirect on login:
    student -> /student/dashboard
    bytes -> /admin/bytes/dashboard
    librarian -> /admin/librarian
    adviser -> /admin/adviser
    chairperson -> /admin/chairperson
    dean -> /admin/dean

  Update PROGRESS.md.

---

## PHASE 12 - Student Pages (Norman)

Goal: full student journey in the UI.

  Pages in frontend/src/pages/student/:

  StudentDashboard.jsx
    Current clearance status summary, unpaid fines count,
    unread notifications, quick action buttons.

  RequestClearance.jsx
    Form: semester, academic_year, purpose.

  ClearanceStatus.jsx  /student/clearance/:id
    5-stage progress tracker with status badges.
    Poll every 10 seconds or React Query refetch.

  Fines.jsx
    List with status badges, Pay button on unpaid rows.

  PaymentSelection.jsx
    GCash: upload receipt flow.
    On-site: instructions to visit BYTES office.

  Fees.jsx
  Notifications.jsx  feed with mark as read.
  DownloadClearance.jsx  button enabled only when fully_cleared is true.

  Use shared components throughout.
  Update PROGRESS.md after each page.

---

## PHASE 13 - Admin Dashboards (Shaheel)

Goal: all staff-facing dashboards.

  Pages in frontend/src/pages/admin/:

  bytes/BytesDashboard.jsx
    Overview cards: pending accounts, pending payments, pending clearances.

  bytes/PendingAccounts.jsx
    List with approve/reject buttons.

  bytes/PaymentVerification.jsx
    Receipts with preview, approve/reject.

  bytes/ManageFines.jsx
    Search student, add fine, list/edit.

  bytes/ManageRequirements.jsx
    CRUD on requirements.

  librarian/LibrarianDashboard.jsx
    Pending clearances at librarian stage.

  adviser/AdviserDashboard.jsx
  chairperson/ChairpersonDashboard.jsx
  dean/DeanDashboard.jsx

  Update PROGRESS.md.

---

## PHASE 14 - Approval Action UI (Shaheel)

Goal: shared approval modal used across all 5 approver dashboards.

  src/components/admin/ClearanceDetailModal.jsx
    Opens when approver clicks a pending request.
    Shows: student info, stage progress, audit trail.
    Approve button (green), Deny button (red).
    On Deny: prompt for reason (required field).
    After action: refetch dashboard list, show toast.

  src/components/admin/AuditTrailList.jsx
    Formatted list of audit_log entries.

  Wire modal into Librarian, Adviser, Chairperson, Dean dashboards.
  Update PROGRESS.md.

---

## PHASE 15 - Reports UI (Shaheel)

Goal: reports page with filters and export buttons.

  src/pages/admin/bytes/Reports.jsx
    Filter bar: department, status, semester, academic year.
    Paginated results table.
    Export PDF button: hits /api/admin/reports/export.pdf, triggers download.
    Export Excel button: hits /api/admin/reports/export.xlsx, triggers download.
    Loading states and empty state.

  Update PROGRESS.md.

---

## PHASE 16 - Integration Testing (Everyone)

Run through these scenarios as a team:

  1. Register -> BYTES approves -> login.
  2. Fine added -> GCash receipt uploaded -> BYTES verifies.
  3. Clearance request -> all 5 stages -> PDF downloaded.
  4. Submit with unpaid fine -> blocked.
  5. Adviser approves before BYTES -> blocked.
  6. Librarian denies -> audit trail shows reason, student notified.
  7. Reports PDF and Excel both open correctly.
  8. Mobile responsive check on every page.
  9. Email notifications fire at every stage transition.

File bugs when anything fails. Module owners fix their own bugs.
Update PROGRESS.md and DEBUGGING.md.

---

## PHASE 17 - Deployment (Tech Lead and Affhan)

  1. deploy/run_backend.bat or .sh
  2. deploy/run_frontend_build.bat or .sh
  3. deploy/nginx.conf  reverse proxy backend and serve frontend
  4. deploy/backup.sh  mysqldump cron
  5. Update README.md with deployment runbook
  6. Confirm .env.production values
  7. Deploy, smoke test, hand over to CICS

  Update PROGRESS.md: Phase 17 Done.
