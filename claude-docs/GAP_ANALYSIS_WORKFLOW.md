# Gap Analysis — Clearance Workflow Expansion (5 → 9 stages)

**Date:** 2026-05-20
**Requested by:** project owner
**Status:** IMPLEMENTED 2026-05-20 — code complete; DB migration + backfill
pending (see PROGRESS.md Phase 18).

## 1. Requested change

Replace the current 5-stage clearance pipeline with a 9-stage pipeline:

| # | New stage | Type | Status |
|---|-----------|------|--------|
| 1 | Admin | approval | NEW role + stage |
| 2 | Cursor (org fee) | org-fee approval | NEW role + stage |
| 3 | Department (org fee) | org-fee approval | NEW role + stage |
| 4 | BYTES (org fee) | org-fee approval | EXISTING role, moved from #1 → #4, repurposed |
| 5 | Library | approval | EXISTING (`librarian`) |
| 6 | Adviser | approval | EXISTING (`faculty_adviser`) |
| 7 | Chairperson | approval | EXISTING (`chairperson`) |
| 8 | Dean | approval | EXISTING (`dean`) |
| 9 | Enrolling Faculty | approval | NEW role + stage |

Confirmed with owner: **Cursor, Department, and BYTES are student organizations**
in CICS, each collecting a fee; each becomes its own clearance stage gated on
the student having paid that organization's fee.

## 2. Current state (what exists today)

5-stage pipeline `bytes_officer → librarian → faculty_adviser → chairperson → dean`,
defined in code (not config). Key facts:

- `bytes_officer` is currently stage #1 and is the only stage with a financial
  (fines + fees) prerequisite check.
- `librarian` currently has NO prerequisites — it can be decided any time after
  submission. The new linear flow would change that.
- The `Fee` model is a flat college-wide line item (`name`, `amount`) with no
  link to an organization or stage. There is no per-org fee concept.
- `bytes_officer` also performs new-account approval and payment approval, and
  is the only non-student role allowed to view another student's clearance PDF.

## 3. Files affected, by module owner

> Every item below crosses a module boundary. Per CLAUDE.md rule 3, each owner
> must approve changes to their module before code is written.

### Database / schema — Affhan (`backend/prisma/`, `database/`)
- `schema.prisma` `Role` enum — add `admin`, `cursor_org`, `department_org`,
  `enrolling_faculty` (4 new values).
- `schema.prisma` `StageRole` enum — same 4 additions.
- `schema.prisma` `Fee` model — add a field linking a fee to an org stage
  (e.g. `orgRole StageRole?`) so org-fee stages can check the right payment.
- New Prisma migration (`npx prisma migrate dev`).
- **Naming note:** the role for "Department" cannot be plain `department` —
  `User.department` already exists as a free-text field. Proposed `department_org`.

### Approval engine — Landia (`backend/src/lib/approval.js`, `clearance.js`, `controllers/approval.controller.js`, `routes/approval.routes.js`)
- `lib/clearance.js` — `STAGE_ORDER` (5 → 9 entries, reordered) and
  `STAGE_LABELS` (4 new labels).
- `lib/approval.js` — `ROLE_TO_STAGE` (4 new) and `STAGE_PREREQUISITES`
  (rebuilt for 9 strictly-sequential stages).
- `controllers/approval.controller.js` line ~50 — the `bytes_officer`-only
  financial-blocker check must be generalized to all three org-fee stages
  (each checks its own org's fee).
- `routes/approval.routes.js` lines 16–20 — add the 4 new roles to the
  decision-route role list.

### Clearance — Naimah (`backend/src/controllers/clearance.controller.js`, `lib/pdf.js`)
- `clearance.controller.js` line 88 — `isOfficer` hard-codes `bytes_officer`
  for cross-student PDF access; decide which role(s) keep that access.
- `lib/pdf.js` — iterates `STAGE_ORDER` automatically, so it picks up 9 rows
  for free; verify 9 approval blocks still fit one A4 page.

### Payment — Asraf (`backend/src/lib/payment.js`, `backend/src/payments/`)
- `lib/payment.js` — `hasUnpaidFees` / `listFinancialBlockers` are
  college-wide; need a per-org variant so each org-fee stage checks only its
  own fee.
- Per-org fee creation/management UI + endpoints in `payments/fee.routes.js`.

### Auth / User Management — Dimalutang (`backend/src/schemas/auth.schema.js`, `routes/admin.routes.js`)
- `schemas/auth.schema.js` line 17 — registration `role` enum; decide whether
  new staff roles are self-registerable or admin-created only.
- `routes/admin.routes.js` line 14 — account approval is gated to
  `bytes_officer`. Decide whether the new **Admin** role takes this over.

### Admin / Requirements — Affhan (`backend/src/controllers/admin.controller.js`, `requirements.controller.js`, `routes/requirements.routes.js`)
- `admin.controller.js` lines 6–10 — valid-role list, add 4.
- `requirements.controller.js` line 3 — `VALID_ROLES`, add 4.
- `requirements.routes.js` line 14 — `MANAGER_ROLES`, add 4.

### Frontend — Norman (student) + Shaheel (staff) (`frontend/src/`)
- `App.jsx` lines 35–40 — role arrays; add routes + `ProtectedRoute`s for the
  4 new dashboards.
- 4 new dashboard pages mirroring `LibrarianDashboard.jsx` /
  `ChairpersonDashboard.jsx` / `DeanDashboard.jsx`.
- `LoginPage.jsx` — role-based post-login redirect.
- `OfficerSidebar.jsx`, `admin/AdminRecords.jsx`, `admin/CreateUser.jsx`,
  `staff/Reports.jsx` — role option lists.
- Clearance stepper components are data-driven from `buildProgress`, so they
  adapt to 9 stages automatically.

### Tests & docs
- `e2e/`, `backend/tests/`, `postman/` — fixtures assume the 5-stage flow.
- `claude-docs/` — `MODULES.md`, `API_CONTRACT.md`, `ERD.md`, `PROGRESS.md`,
  `DECISIONS.md`; and the "Clearance approval flow" section of `CLAUDE.md`.

## 4. Decisions (resolved with owner, 2026-05-20)

1. **Gating:** STRICTLY SEQUENTIAL — every stage requires ALL prior stages
   approved. Library loses its "approve anytime" behavior.
2. **Admin role:** takes over new-account approval from BYTES.
3. **Org-fee stages:** an org officer MANUALLY approves after reviewing the
   payment; the stage does not auto-approve.
4. **Role names:** `admin`, `cursor_org`, `department_org`, `enrolling_faculty`.
5. **Migration:** BACKFILL — add the 4 new stages (pending) to every existing
   request; already-completed clearances are re-opened.

## 5. Implementation plan (once approved)

### Step 1 — Schema + migration (Affhan)
- `Role` + `StageRole` enums: add `admin`, `cursor_org`, `department_org`,
  `enrolling_faculty`.
- `Fee` model: add `orgRole StageRole?` so a fee belongs to an org stage.
- `npx prisma migrate dev` for the schema change.
- Backfill script `scripts/backfill-workflow-stages.js`: for each existing
  `ClearanceRequest`, create the 4 missing `ClearanceStage` rows (status
  `pending`); reset `status` to `pending` and clear `completedAt` for requests
  that were `completed`/`denied` but now have pending stages.

### Step 2 — Approval engine (Landia)
- `lib/clearance.js`: `STAGE_ORDER` = the 9 roles in order; `STAGE_LABELS` += 4.
- `lib/approval.js`: `ROLE_TO_STAGE` += 4; `STAGE_PREREQUISITES` rebuilt so
  each stage's prereqs = every earlier stage in `STAGE_ORDER`.
- `controllers/approval.controller.js`: replace the `bytes_officer`-only
  financial check with a per-org-fee check for `cursor_org`, `department_org`,
  `bytes_officer` — each verifies an approved payment for THAT org's fee.
  BYTES stage additionally keeps the unpaid-fines check.
- `routes/approval.routes.js`: add the 4 roles to the decision-route list.

### Step 3 — Payment per-org fee logic (Asraf)
- `lib/payment.js`: add `hasUnpaidOrgFee(studentId, orgRole)` and update
  `listFinancialBlockers` to report per-org status.
- `payments/` routes: allow creating/listing fees scoped to an `orgRole`.

### Step 4 — Role lists (Dimalutang, Affhan)
- `routes/admin.routes.js`: account-approval gate `bytes_officer` → `admin`.
- `controllers/admin.controller.js`, `requirements.controller.js`,
  `routes/requirements.routes.js`: add the 4 roles to valid/manager lists.
- `schemas/auth.schema.js`: new staff roles are admin-created (CreateUser),
  not self-registerable — no change to the public registration enum.

### Step 5 — Frontend (Norman, Shaheel)
- `App.jsx`: role arrays + `ProtectedRoute`s + routes for 4 new dashboards.
- 4 new dashboard pages cloned from `LibrarianDashboard.jsx`; org-fee
  dashboards also surface the student's payment/receipt for review.
- `LoginPage.jsx` post-login redirect; role lists in `OfficerSidebar.jsx`,
  `AdminRecords.jsx`, `CreateUser.jsx`, `Reports.jsx`.

### Step 6 — Tests + docs
- Update `e2e/`, `backend/tests/`, `postman/` fixtures to the 9-stage flow.
- Update `MODULES.md`, `API_CONTRACT.md`, `ERD.md`, `PROGRESS.md`,
  `DECISIONS.md`, and the flow section of `CLAUDE.md`.

## 6. Sequencing & ownership note

Steps run in the order above (Step 1 blocks all others). Every step modifies a
different developer's module. Recommend implementing per-module and confirming
with each owner, or getting blanket approval from the project owner to proceed
across all modules in one pass.
