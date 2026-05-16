# Build Progress

_Last audited from code: 2026-05-16 (post phase_5_6_7_9 migration)_

Each developer maintains their own module rows.
Run the audit prompt (see AUDIT.md) to refresh based on actual code state.

Status legend:
  Done        phase complete, tested, merged
  Partial     some files exist, incomplete
  Issue       implemented but bug exists (see DEBUGGING.md)
  NotStarted  nothing matching this exists
  Blocked     waiting on another module

**Overall system completion: ~75%**

---

## Phase progress

| Phase | Topic | Owner | Evidence in code | Status |
|-------|-------|-------|------------------|--------|
| 0 | Pre-flight setup | Tech lead | `.env.example`, `package.json`, branch workflow active | ✅ Done |
| 1 | Project scaffolding | Tech lead | `backend/src/app.js`, `frontend/src/App.jsx`, layouts, routing | ✅ Done |
| 2 | Database schema | Affhan | `prisma/schema.prisma` (9 models, 3 migrations applied) | ✅ Done (~95%) |
| 3 | Backend foundation | Tech lead | Express + Prisma + `middleware/auth`, `validate`, `error`, `asyncHandler`, `/api/health` | ✅ Done |
| 4 | Auth and RBAC | Dimalutang | `auth.routes.js`, `auth.controller.js`, `admin.routes.js`, `middleware/auth.js` | ✅ Done |
| 5 | Notifications | Ed | `src/notifications/{notify,email,emailTemplates}.js`, `notifications.controller.js`, `/api/notifications`, wired into approval + admin flows | ✅ Done (~85%) |
| 6 | Payment module | Asraf | RBAC on all routes, `lib/payment.js` gating helpers, 5MB upload cap, GCash/onsite enforced, approval/denial endpoints, idempotent | ✅ Done (~85%) |
| 7 | Approval workflow engine | Landia | `lib/approval.js`, `approval.controller.js`, `/api/approval/*` — 5 stage decisions, prereq checker, audit log, pending-by-role, auto-completes request | ✅ Done (~90%) |
| 8 | Clearance request and PDF | Naimah | `clearance.routes.js`, `clearance.controller.js` (submit, /me, progress, gated PDF) | ✅ Done (~85%) |
| 9 | Admin / Reports / Requirements | Affhan | `requirements.controller.js`, `reports.controller.js`, dashboard stats, CSV/PDF export, Requirement CRUD | ✅ Done (~85%) |
| 10 | Frontend scaffolding | Norman + Shaheel | `App.jsx` routes, `AdminLayout`, `StudentLayout`, `OfficerLayout`, `ProtectedRoute` | ✅ Done |
| 11 | Auth UI | Both FEs | `LoginPage`, `RegisterPage`, `AuthContext`, `api/auth.js` | ✅ Done |
| 12 | Student pages | Norman | `StudentDashboard`, `MyClearance`, `Notifications`, `Payment` (4 of ~12) | 🟡 Partial (~30%) |
| 13 | Admin dashboards | Shaheel | 9 screens + ApprovalModal + ApproverBoard, all wired to real APIs via `api/staff.js` | ✅ Done (~75%) |
| 14 | Approval action UI | Shaheel | `ApprovalModal` + 4 approver dashboards (Librarian/Adviser/Chairperson/Dean) all wired to `/api/approval/*` | ✅ Done (~80%) |
| 15 | Reports UI | Shaheel | `staff/Reports.jsx` with status/stage filters, PDF + CSV downloads via blob | ✅ Done (~85%) |
| 16 | Integration testing | Everyone | none | ⬜ NotStarted |
| 17 | Deployment | Tech lead + Affhan | none | ⬜ NotStarted |

---

## Auth module (Dimalutang) — 100%
- Done        User model
- Done        Register endpoint
- Done        Login endpoint (JWT)
- Done        Logout endpoint
- Done        /me endpoint
- Done        Pending accounts list
- Done        Approve account (+ email + in-app notification)
- Done        Reject account (+ email + in-app notification)
- Done        requireRole dependency
- Done        getCurrentUser / requireAuth dependency

## Clearance module (Naimah) — ~85%
- Done        ClearanceRequest model
- Done        Submit request endpoint (creates 5 ordered stages, 409 if active)
- Done        My requests endpoint
- Done        Status endpoint with stage aggregation (/me/progress)
- Done        PDF generation (pdfkit)
- Done        PDF download endpoint (gated — 409 if pending stages, 403 if not owner)

## Payment module (Asraf) — ~85%
- Done        Fine model and CRUD (BYTES-only)
- Done        Fee model and read (BYTES manages catalogue)
- Done        Payment model and submission (student scoped to self)
- Done        Receipt upload (multer, 5MB cap, image MIME filter)
- Done        Payment verification — BYTES Officer only, idempotent
- Done        Payment denial endpoint with reason
- Done        has_unpaid_fines / has_unpaid_fees helpers (lib/payment.js)
- Done        listFinancialBlockers gates BYTES stage approval
- NotStarted  Student frontend fines/fees views (Phase 12)

## Approval module (Landia) — ~90%
- Done        ClearanceStage model (created on request submission)
- Done        AuditLog model + indexes
- Done        initialize_stages on request submission
- Done        Prerequisite checker (STAGE_PREREQUISITES map)
- Done        BYTES approval endpoint (+ financial-blockers gate)
- Done        Librarian approval endpoint
- Done        Adviser approval endpoint
- Done        Chairperson approval endpoint
- Done        Dean approval endpoint (auto-completes request)
- Done        Stage denial endpoint (auto-fails request)
- Done        Audit trail endpoint (GET /api/approval/:id/audit)
- Done        Pending-by-role filter (only actionable items per role)

## Notifications module (Ed) — ~85%
- Done        Email service (nodemailer, ESM, SMTP env-driven, gracefully no-ops if not configured)
- Done        Template loader (6 ESM templates)
- Done        send_email helper
- Done        notify() helper (best-effort, never throws)
- Done        Notifications feed endpoint (GET /api/notifications)
- Done        Mark read endpoint (POST /api/notifications/:id/read)
- Done        Mark-all-read endpoint
- Done        6 of 10 email templates (accountApproval, accountDenial, stageDecision, finalClearance, paymentConfirmation, finesReminder)
- Done        Triggers wired: account approve/deny, every stage decision, payment approve/deny, final clearance
- Deprecated  Stranded `backend/services/*.js` CJS files — safe to delete

## Admin / Reports / Requirements module (Affhan) — ~85%
- Done        prisma/schema.prisma (9 models: User, ClearanceRequest, ClearanceStage, Fine, Fee, Payment, Notification, AuditLog, Requirement)
- Done        Dashboard stats endpoint (totals + per-stage breakdown)
- Done        Requirements CRUD (per-role)
- Done        Clearance status report query (?status= & ?stage= filters)
- Done        PDF export (pdfkit)
- Done        CSV export (Excel-compatible; trade-off: avoids exceljs dependency)
- NotStarted  Excel .xlsx export (CSV good enough for v1)

## Student frontend (Norman) — ~30%
- NotStarted  Landing page
- Done        Signup
- Done        Login
- Done        Student dashboard
- Partial     Request clearance
- Partial     Clearance status tracker
- NotStarted  Fines view
- Partial     Payment selection (GCash and on-site)
- Partial     Receipt upload
- NotStarted  Fees payment
- Done        Notifications panel
- NotStarted  Download clearance PDF

## Admin/staff frontend (Shaheel) — ~75%
- Done        BYTES/Admin dashboard
- Done        Pending accounts UI (wired to /api/admin/pending-accounts)
- Done        Payment verification UI (wired to /api/payments)
- Done        Manage fines UI (wired to /api/fines)
- Done        Manage requirements UI (OfficerRequirement)
- Done        Reports page + PDF/CSV export (wired to /api/admin/reports/*)
- Done        Librarian dashboard (uses ApproverBoard)
- Done        Faculty Adviser dashboard
- Done        Chairperson dashboard
- Done        Dean dashboard
- Done        Approval action modal (`components/ApprovalModal.jsx`, reusable)
- Done        Shared ApproverBoard component (used by 4 approver roles)
- Done        api/staff.js — typed wrapper for all staff endpoints

---

## Cross-cutting
- Done        Shared component library (ApprovalModal, ApproverBoard, layouts)
- Done        API contract v1.0 effectively locked (consumed by staff frontend)
- Done        Database schema v1.0 locked (9 tables, migration applied)
- Done        Git workflow (feature branches, PR workflow)

---

## Critical blockers — RESOLVED this session

| Blocker | Status |
|---|---|
| Approval workflow engine (Phase 7) was 0% | ✅ Resolved — fully implemented |
| Notification service stranded (CJS + Supabase) | ✅ Resolved — rewritten in ESM + Prisma, wired into flows |
| Payment routes had no RBAC | ✅ Resolved — all routes locked down |
| 3 DB tables missing (Requirement, Notification, AuditLog) | ✅ Resolved — all added + migrated |

## Remaining work

| Phase | Module | Effort |
|---|---|---|
| 12 | Student frontend (fines/fees views, PDF download, landing) | medium |
| 16 | Integration tests | medium |
| 17 | Deployment (Dockerfile, env, Supabase/Vercel) | small-medium |

---

## Completion log
Format: YYYY-MM-DD | Phase N / Module X | Status change | Note | By: name

2026-05-16 | Full audit | NotStarted → actual state | Re-baselined PROGRESS.md from code scan after merges of amer_backend, payment-module, notification-system | By: Hussien (via Claude)
2026-05-16 | Phase 13 + 14 + 15 | NotStarted → Done (~75%) | Vibe-coded 9 staff screens + ApprovalModal + ApproverBoard | By: Hussien (via Claude)
2026-05-16 | Phase 7 | NotStarted → Done (~90%) | Built full approval engine: 5 stage decisions, prereq checker, audit log, pending-by-role | By: Hussien (via Claude)
2026-05-16 | Phase 5 | Partial → Done (~85%) | Rewrote stranded notification service to ESM+Prisma, added Notification model, wired into all flows | By: Hussien (via Claude)
2026-05-16 | Phase 6 | Partial → Done (~85%) | Locked RBAC on all payment/fine/fee routes, added financial-blocker gating, 5MB upload cap | By: Hussien (via Claude)
2026-05-16 | Phase 9 | Partial → Done (~85%) | Requirement model + CRUD, dashboard stats, PDF/CSV reports | By: Hussien (via Claude)
2026-05-16 | Phase 13 | Mock APIs → Done | Wired all staff screens to real backend via api/staff.js | By: Hussien (via Claude)
2026-05-16 | Migration | Applied | phase_5_6_7_9 migration applied to Supabase (audit_logs, notifications, requirements) | By: Hussien (via Claude)
