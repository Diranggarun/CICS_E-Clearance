# Project Decisions Log

Newest entries first.
Format: ## YYYY-MM-DD - Short title

---

## Template

## YYYY-MM-DD - Short title

Decision: what was decided.
Context: why this came up.
Alternatives considered: what else we looked at.
Reasoning: why we picked this one.
Trade-offs: what we give up.
Proposed by: name
Approved by: names

---

## Foundational decisions (from task division document)

### Multi-stage sequential clearance gating
Decision: BYTES first, then Librarian and Adviser can act, then Chairperson
requires BYTES + Librarian + Adviser, then Dean requires all four.
Reasoning: This matches how the institution actually operates.
Implementation: approval_stages table with prerequisite checker in approval module.
**Superseded 2026-05-20** — expanded to a strict 9-stage pipeline; see Build decisions.

### Account approval by BYTES before login allowed
Decision: New registrations are pending until a BYTES officer approves them.
Reasoning: Prevents fake or external accounts from accessing the system.
**Updated 2026-05-20** — account approval moved from BYTES to the new `admin` role.

### GCash and on-site only (no payment gateway integration)
Decision: Students upload GCash receipts for manual verification, or visit BYTES office.
Reasoning: Matches what MSU students actually use. Gateway integration is out of scope.
Trade-off: Manual verification creates work for BYTES officer.

### PDF gated on full approval
Decision: Clearance PDF cannot be generated until all stages are approved.
(As of 2026-05-20 that means all 9 stages.)
Reasoning: A clearance form is an official document. Premature generation is a forgery risk.
Implementation: Endpoint returns 409 if not fully_cleared.

### Audit trail on every approval and denial
Decision: Every approve/deny action is logged immutably in audit_logs.
Reasoning: Required for institutional accountability and dispute resolution.

### Module ownership enforced in CLAUDE.md
Decision: Claude Code is explicitly told each module owner and instructed to
refuse cross-module changes without explicit permission.
Reasoning: 9 developers, 8 modules. Without ownership rules, Claude Code will
write across module boundaries and create merge conflicts.

---

## Open decisions (decide before coding starts)

- Backend framework: FastAPI vs Express?
- Database: MySQL vs PostgreSQL?
- Email provider: SMTP vs SendGrid vs Gmail API?
- PDF library: ReportLab vs WeasyPrint vs pdfkit?
- Hosting: MSU server vs cloud free tier?

Move each to resolved above once decided and add the outcome.

---

## Build decisions (add during development)

## 2026-05-20 - Clearance workflow expanded to 9 stages

Decision: The clearance pipeline grows from 5 stages to 9, strictly sequential:
Admin → Cursor → Department → BYTES → Library → Adviser → Chairperson → Dean →
Enrolling Faculty.

Context: The institution's actual clearance process includes an Admin gate, three
student-organization fee stages (Cursor, Department, BYTES — each an org that
collects a fee), and a final Enrolling Faculty sign-off.

Details:
- 4 new roles added to the `Role` and `StageRole` enums: `admin`, `cursor_org`,
  `department_org`, `enrolling_faculty`. The existing `bytes_officer` role is
  repurposed from "stage 1 + system admin" into the BYTES org-fee stage (#4).
- Gating is now strictly sequential — every stage requires ALL prior stages
  approved. Library loses its former "approve anytime" freedom.
- Org-fee stages (Cursor / Department / BYTES) can only be approved once the
  student has settled that organization's fee. `Fee.orgRole` and
  `Payment.orgRole` tag fees/payments to an org; each org officer verifies only
  their own org's payments. The BYTES stage also keeps the unpaid-fines check.
- Account approval, user creation, fines, and reports move from the BYTES
  Officer to the new `admin` role (the BYTES Officer is now just an approver).
- Existing clearance requests were backfilled with the 4 new stages
  (`scripts/backfill-workflow-stages.js`); completed requests re-open.

Reasoning: Matches the real institutional flow; keeps pipeline order in one
place (`lib/clearance.js` `STAGE_ORDER`).
Trade-offs: Re-opens previously-completed clearances; legacy fees with no
`orgRole` cannot be paid until an officer re-tags them.
Approved by: project owner (gap analysis GAP_ANALYSIS_WORKFLOW.md)
