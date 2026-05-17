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

### Account approval by BYTES before login allowed
Decision: New registrations are pending until a BYTES officer approves them.
Reasoning: Prevents fake or external accounts from accessing the system.

### GCash and on-site only (no payment gateway integration)
Decision: Students upload GCash receipts for manual verification, or visit BYTES office.
Reasoning: Matches what MSU students actually use. Gateway integration is out of scope.
Trade-off: Manual verification creates work for BYTES officer.

### PDF gated on full approval
Decision: Clearance PDF cannot be generated until all 5 stages are approved.
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

(empty - add entries as work progresses)
