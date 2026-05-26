# Project Context for Claude Code

## What this project is

**CICS E-Clearance System** — a web-based clearance management system for the
College of Information and Computing Studies, MSU Main Campus.
Students request clearance digitally, BYTES Officers manage fines and requirements,
and Librarians / Faculty Advisers / Chairpersons / Deans approve clearance in a
multi-stage sequential workflow.

**Institution:** College of Information and Computing Studies, MSU Main Campus
**Team:** 6 backend developers, 2 frontend developers, 1 UI designer (9 total)

## Team and module ownership

| Owner | Module | Code location |
|---|---|---|
| Affhan Mimbisa | Database schema + Admin Dashboard + Reports + Requirements | backend/modules/admin/, backend/modules/requirements/, backend/modules/reports/, database/ |
| Dimalutang Amerhussein | Authentication and User Management | backend/modules/auth/ |
| Naimah Abdulcader | Student Clearance Request + PDF generation | backend/modules/clearance/ |
| Asraf Alauya Jr. | Payment (Fines, Fees, GCash receipts) | backend/modules/payment/ |
| Landia Cherry Mae | Approval Workflow Engine | backend/modules/approval/ |
| Ed Arafat | Notification System (email + in-app) | backend/modules/notifications/ |
| Norman Sharief | Student-facing frontend | frontend/src/pages/student/ |
| Shaheel Sarip | Admin/staff-facing frontend | frontend/src/pages/admin/ |
| Jonaidah Caris | Design system and mockups | (Figma, not in codebase) |

## Tech stack (confirm against actual codebase in AUDIT.md)

- Backend: Python FastAPI + SQLAlchemy (or Node Express — check requirements.txt vs package.json)
- Database: MySQL 8
- Frontend: React + Vite + TailwindCSS
- Auth: JWT + bcrypt + RBAC
- PDF: ReportLab (Python) or pdfkit (Node)
- Email: SMTP / SendGrid / Gmail API
- File storage: local filesystem for receipts

## User roles (RBAC — 10 roles)

student, admin, cursor_org, department_org, bytes_officer, librarian,
faculty_adviser, chairperson, dean, enrolling_faculty

Role codes: `cursor_org` / `department_org` / `bytes_officer` are the three
student-organization fee stages; `admin` owns the staff surface (account
approval, user creation, fines, reports).

## Clearance approval flow

9-stage strictly-sequential pipeline (updated 2026-05-20):

Student submits → Admin → Cursor → Department → BYTES → Library → Adviser →
Chairperson → Dean → Enrolling Faculty → PDF generated

Order + labels live in `backend/src/lib/clearance.js` (`STAGE_ORDER`); gating
is derived in `backend/src/lib/approval.js` (`STAGE_PREREQUISITES`).

Prerequisites:
- Every stage requires ALL prior stages in the pipeline to be approved.
- Org-fee stages (Cursor, Department, BYTES) also require the student to have
  settled that organization's fee; the BYTES stage additionally requires no
  unpaid fines.
- PDF is gated until all 9 stages are approved.

See claude-docs/GAP_ANALYSIS_WORKFLOW.md for the full design.

## Where the documentation lives

Read these BEFORE making changes:

- claude-docs/PROMPTS.md       phase-by-phase build specification
- claude-docs/PROGRESS.md      what is done per module
- claude-docs/AUDIT.md         snapshot of existing code (run audit prompt)
- claude-docs/MODULES.md       contract for each of the 8 modules
- claude-docs/API_CONTRACT.md  shared API endpoint specification
- claude-docs/ERD.md           database schema reference (13 tables)
- claude-docs/DECISIONS.md     project decisions log
- claude-docs/DEBUGGING.md     known errors and fixes
- claude-docs/WORKFLOW.md      Git branch rules and PR process

## CRITICAL — Existing code protection rules

This project has EXISTING CODE owned by MULTIPLE DEVELOPERS.

1. Phase prompts describe the END STATE, not literal commands. Do not run them
   as scripts. Adapt them to what already exists.

2. Read before writing. Check if a file exists before creating it. If it does,
   read it first, then ask whether to modify or leave alone.

3. Never cross module boundaries without asking. If a change touches another
   developer's module (per the ownership table above), STOP and confirm first.

4. Module ownership is sacred:
   - backend/modules/auth/          Dimalutang — do not modify without permission
   - backend/modules/clearance/     Naimah
   - backend/modules/payment/       Asraf
   - backend/modules/approval/      Landia
   - backend/modules/notifications/ Ed
   - backend/modules/admin/ + reports/ + requirements/ + database/   Affhan
   - frontend/src/pages/student/    Norman
   - frontend/src/pages/admin/      Shaheel

5. Never touch without asking: .env files, the database directly,
   node_modules/, venv/, .git/, package-lock.json, requirements.txt

6. When asked to do Phase N or Module X:
   a. Read the relevant phase in PROMPTS.md
   b. Read AUDIT.md to see what exists
   c. Read PROGRESS.md to confirm current state
   d. Produce a GAP ANALYSIS first
   e. Wait for approval before writing code
   Skip the gap analysis only if explicitly told to.

7. After any change to source code, update PROGRESS.md.

8. claude-docs/ is safe to write to freely. Existing source code is not.

9. Modify, do not replace. If a file exists and partially works, add to it
   or refactor it. Do not overwrite it wholesale.

10. When in doubt, show the diff and ask.

## Conventions

Backend:
- One module per folder under backend/modules/name/
- Each module has: routes.py, service.py, schemas.py, models.py
- All endpoints declare required role via require_role dependency
- All DB access through shared get_db dependency
- Migration files: database/migration_NNN_description.sql, never edit old ones

Frontend:
- Page files: frontend/src/pages/student/ and frontend/src/pages/admin/
- Shared components: frontend/src/components/shared/
- API calls: always through src/services/api.js (JWT interceptor)
- TailwindCSS only, no inline styles
- Toasts: react-hot-toast, Icons: lucide-react

Git:
- Branch naming: feat/module-description (e.g. feat/auth-login-flow)
- Never commit directly to main. PRs only.
- See WORKFLOW.md for full rules.

## Constraints from the task division

- Account approval flow (BYTES reviews new registrations)
- Multi-stage clearance with sequential gating
- GCash payment with receipt upload (max 5MB) + on-site option
- Audit trail on every approval and denial
- Email notification at every stage transition
- PDF clearance form gated until ALL approvals complete
- Reports exportable to PDF and Excel
- Responsive on desktop and mobile
