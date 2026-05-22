# Database Schema Reference

Owner: Affhan Mimbisa (schema coordinator)
<<<<<<< HEAD
Source of truth: database/schema.sql
Migrations: database/migration_NNN_short_name.sql (never edit old ones)
=======
Source of truth: `backend/prisma/schema.prisma`
Migrations: `backend/prisma/migrations/` (Prisma; never edit applied ones)

> 2026-05-20 — Workflow expansion: `Role` and `StageRole` enums each gained
> `admin`, `cursor_org`, `department_org`, `enrolling_faculty`. `Fee` and
> `Payment` gained an `orgRole` column linking a fee/payment to an org-fee
> stage. See migration `20260520120000_workflow_9_stages`.
>>>>>>> d28bd3b538eb5eb7f22a9b7749abab309e37038e

---

## Tables (13 total)

| Table | Purpose | Module |
|---|---|---|
| users | All accounts (student, bytes, librarian, adviser, chairperson, dean) | auth |
| account_approvals | Audit of BYTES approving/rejecting accounts | auth |
| clearance_requests | Top-level request from a student | clearance |
<<<<<<< HEAD
| approval_stages | Per-stage approval state (5 rows per request) | approval |
=======
| approval_stages | Per-stage approval state (9 rows per request as of 2026-05-20) | approval |
>>>>>>> d28bd3b538eb5eb7f22a9b7749abab309e37038e
| audit_logs | Immutable log of every approval action | approval |
| fines | Fines per student | payment |
| fees | Fees per student (SSG, course, dept, college) | payment |
| payments | Payment attempts (links fine/fee to receipt) | payment |
| payment_receipts | Uploaded receipt files | payment |
| requirements | Clearance requirements managed by BYTES | requirements |
| requirement_completions | Tracks which student met which requirement | requirements |
| notifications | In-app notification feed | notifications |
| email_logs | Sent email audit | notifications |

---

## Schemas

### users
user_id          INT PK AUTO_INCREMENT
school_id        VARCHAR(50) UNIQUE NOT NULL
full_name        VARCHAR(150) NOT NULL
sex              ENUM('male','female','other') NOT NULL
birthdate        DATE NOT NULL
email            VARCHAR(150) UNIQUE NOT NULL
contact_number   VARCHAR(30)
college          VARCHAR(100)
department       VARCHAR(100)
role             ENUM('student','bytes','librarian','adviser','chairperson','dean') NOT NULL
password_hash    VARCHAR(255) NOT NULL
is_approved      BOOLEAN DEFAULT FALSE
is_active        BOOLEAN DEFAULT TRUE
created_at       DATETIME DEFAULT CURRENT_TIMESTAMP

### account_approvals
approval_id    INT PK AUTO_INCREMENT
user_id        INT FK users.user_id
reviewed_by    INT FK users.user_id
action         ENUM('approved','rejected') NOT NULL
reason         TEXT NULL
reviewed_at    DATETIME DEFAULT CURRENT_TIMESTAMP

### clearance_requests
request_id     INT PK AUTO_INCREMENT
student_id     INT FK users.user_id
semester       ENUM('1st','2nd','summer') NOT NULL
academic_year  VARCHAR(20) NOT NULL
purpose        VARCHAR(255) NULL
status         ENUM('submitted','in_progress','fully_cleared','denied') DEFAULT 'submitted'
submitted_at   DATETIME DEFAULT CURRENT_TIMESTAMP
completed_at   DATETIME NULL

### approval_stages
stage_id     INT PK AUTO_INCREMENT
request_id   INT FK clearance_requests.request_id ON DELETE CASCADE
stage        ENUM('bytes','librarian','adviser','chairperson','dean') NOT NULL
status       ENUM('pending','approved','denied','blocked') DEFAULT 'pending'
approver_id  INT NULL FK users.user_id
reason       TEXT NULL
acted_at     DATETIME NULL
UNIQUE(request_id, stage)

### audit_logs (immutable, append-only)
log_id      INT PK AUTO_INCREMENT
request_id  INT FK clearance_requests.request_id
stage       VARCHAR(30)
action      VARCHAR(30) NOT NULL
actor_id    INT FK users.user_id
reason      TEXT NULL
logged_at   DATETIME DEFAULT CURRENT_TIMESTAMP

### fines
fine_id      INT PK AUTO_INCREMENT
student_id   INT FK users.user_id
description  VARCHAR(255) NOT NULL
amount       DECIMAL(10,2) NOT NULL
status       ENUM('unpaid','awaiting_verification','paid','waived') DEFAULT 'unpaid'
created_by   INT FK users.user_id
created_at   DATETIME DEFAULT CURRENT_TIMESTAMP

### fees
fee_id        INT PK AUTO_INCREMENT
fee_type      ENUM('ssg','course','department','college') NOT NULL
description   VARCHAR(255)
amount        DECIMAL(10,2) NOT NULL
applies_to    VARCHAR(100)
academic_year VARCHAR(20)

### payments
payment_id   INT PK AUTO_INCREMENT
student_id   INT FK users.user_id
fine_id      INT NULL FK fines.fine_id
fee_id       INT NULL FK fees.fee_id
method       ENUM('gcash','onsite') NOT NULL
amount       DECIMAL(10,2) NOT NULL
status       ENUM('awaiting_verification','approved','rejected') DEFAULT 'awaiting_verification'
verified_by  INT NULL FK users.user_id
verified_at  DATETIME NULL
reject_reason TEXT NULL
submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP

### payment_receipts
receipt_id   INT PK AUTO_INCREMENT
payment_id   INT FK payments.payment_id ON DELETE CASCADE
file_path    VARCHAR(500) NOT NULL
file_type    VARCHAR(50)
uploaded_at  DATETIME DEFAULT CURRENT_TIMESTAMP

### requirements
requirement_id  INT PK AUTO_INCREMENT
title           VARCHAR(150) NOT NULL
description     TEXT
applies_to_role ENUM('student') DEFAULT 'student'
is_active       BOOLEAN DEFAULT TRUE
created_by      INT FK users.user_id
created_at      DATETIME DEFAULT CURRENT_TIMESTAMP

### requirement_completions
completion_id   INT PK AUTO_INCREMENT
requirement_id  INT FK requirements.requirement_id ON DELETE CASCADE
student_id      INT FK users.user_id ON DELETE CASCADE
status          ENUM('met','not_met') DEFAULT 'not_met'
evidence_note   TEXT NULL
marked_by       INT NULL FK users.user_id
marked_at       DATETIME NULL
UNIQUE(requirement_id, student_id)

### notifications
notification_id  INT PK AUTO_INCREMENT
user_id          INT FK users.user_id ON DELETE CASCADE
title            VARCHAR(150) NOT NULL
body             TEXT
link             VARCHAR(500) NULL
is_read          BOOLEAN DEFAULT FALSE
created_at       DATETIME DEFAULT CURRENT_TIMESTAMP

### email_logs
email_id   INT PK AUTO_INCREMENT
to_email   VARCHAR(150) NOT NULL
subject    VARCHAR(255)
template   VARCHAR(100)
status     ENUM('sent','failed') NOT NULL
error_msg  TEXT NULL
sent_at    DATETIME DEFAULT CURRENT_TIMESTAMP

---

## Schema change process

1. Module owner posts request in team channel
2. Affhan evaluates impact on other modules
3. Affhan writes database/migration_NNN_description.sql
4. Migration runs on dev database
5. Affhan updates schema.sql and this ERD.md
6. All module owners pull and check their code still works
