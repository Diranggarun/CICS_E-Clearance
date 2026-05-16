# API Contract

The shared specification all backend and frontend developers code against.
Changes require team consensus. Update the version number when modifying.

Version: 1.0
Base URL: /api
Auth: Authorization: Bearer <jwt> on all protected endpoints
Content-Type: application/json (except file uploads: multipart/form-data)

---

## Conventions

Roles allowed listed in [brackets].
Success: HTTP 2xx with JSON body.
Validation error: HTTP 422.
Auth error: HTTP 401 (not logged in) or 403 (wrong role).
Not found: HTTP 404.
Business rule violation: HTTP 400 with {detail: "reason"}.
All timestamps: ISO 8601 UTC ("2026-03-15T10:30:00Z").

---

## Auth (Dimalutang)

POST /api/auth/register  [public]
Request:
{
  "school_id": "2021-12345",
  "role": "student",
  "full_name": "Juan Dela Cruz",
  "sex": "male",
  "birthdate": "2003-04-15",
  "email": "juan@msumain.edu.ph",
  "contact_number": "+639171234567",
  "college": "CICS",
  "department": "Information Technology",
  "password": "secure_password"
}
Response 201:
{ "user_id": 42, "status": "pending", "message": "Account created. Awaiting BYTES approval." }

POST /api/auth/login  [public]
Request: { "email": "juan@msumain.edu.ph", "password": "secure_password" }
Response 200:
{
  "access_token": "eyJ...",
  "token_type": "bearer",
  "user": {
    "user_id": 42,
    "school_id": "2021-12345",
    "full_name": "Juan Dela Cruz",
    "role": "student",
    "email": "juan@msumain.edu.ph",
    "department": "Information Technology",
    "is_approved": true
  }
}

POST /api/auth/logout  [any authenticated]
GET  /api/auth/me     [any authenticated]  returns same user object as login
GET  /api/auth/pending-accounts            [bytes]
POST /api/auth/accounts/{user_id}/approve  [bytes]
POST /api/auth/accounts/{user_id}/reject   [bytes]  body: { "reason": "..." }

---

## Clearance (Naimah)

POST /api/clearance/request  [student]
Request: { "semester": "2nd", "academic_year": "2025-2026", "purpose": "Graduation" }
Response 201: { "request_id": 17, "status": "submitted", "submitted_at": "..." }
Returns 400 if student has unpaid fines.

GET /api/clearance/my-requests   [student]
GET /api/clearance/requests/{id} [student, all approvers]
Response:
{
  "request_id": 17,
  "student": { "user_id": 42, "full_name": "...", "school_id": "..." },
  "semester": "2nd", "academic_year": "2025-2026",
  "submitted_at": "...",
  "current_stage": "librarian",
  "stages": {
    "bytes":       { "status": "approved", "approver": "...", "at": "...", "reason": null },
    "librarian":   { "status": "pending",  "approver": null,  "at": null,  "reason": null },
    "adviser":     { "status": "pending",  "approver": null,  "at": null,  "reason": null },
    "chairperson": { "status": "blocked",  "reason": "Waiting for adviser" },
    "dean":        { "status": "blocked",  "reason": "Waiting for chairperson" }
  },
  "fully_cleared": false
}

GET /api/clearance/requests/{id}/status  [student, approvers]  lighter version
GET /api/clearance/requests/{id}/pdf     [student]  returns application/pdf, 409 if not cleared

---

## Payment (Asraf)

GET  /api/payment/fines/me   [student]
Response: [{ "fine_id": 5, "description": "...", "amount": 50.00, "status": "unpaid", "created_at": "..." }]

GET  /api/payment/fees/me    [student]
POST /api/payment/fines/{fine_id}/pay  [student]
Request: { "method": "gcash" }   or  { "method": "onsite" }
Response: { "payment_id": 88, "status": "awaiting_verification" }

POST /api/payment/upload-receipt  [student]  multipart: fields payment_id + file (max 5MB, image or PDF)
GET  /api/payment/pending-verifications       [bytes]
POST /api/payment/verify/{payment_id}         [bytes]
Request: { "action": "approve" }  or  { "action": "reject", "reason": "..." }

POST  /api/payment/fines       [bytes]  body: { "user_id", "description", "amount" }
PATCH /api/payment/fines/{id}  [bytes]

---

## Approval (Landia)

GET /api/approval/pending  [bytes, librarian, adviser, chairperson, dean]
Returns requests pending the caller's action, filtered by their role.

POST /api/approval/{request_id}/bytes        [bytes]
POST /api/approval/{request_id}/librarian    [librarian]
POST /api/approval/{request_id}/adviser      [adviser]       400 if BYTES not approved
POST /api/approval/{request_id}/chairperson  [chairperson]  400 if BYTES/librarian/adviser not all approved
POST /api/approval/{request_id}/dean         [dean]          400 if any prior stage not approved

Request body for all stage endpoints:
{ "action": "approve" }   or   { "action": "deny", "reason": "explanation" }

GET /api/approval/{request_id}/audit-trail  [student, all approvers]
Response:
[
  { "stage": "bytes", "action": "approved", "by": "Name", "at": "...", "reason": null },
  { "stage": "librarian", "action": "denied", "by": "Name", "at": "...", "reason": "Unreturned book" }
]

---

## Notifications (Ed)

GET  /api/notifications/me             [any authenticated]
Response: [{ "notification_id": 12, "title": "...", "body": "...", "link": "...", "is_read": false, "created_at": "..." }]

POST /api/notifications/{id}/mark-read  [any authenticated, must own it]

---

## Admin / Reports / Requirements (Affhan)

GET /api/admin/dashboard/stats  [bytes, dean, chairperson]
Response:
{
  "pending_accounts": 5,
  "pending_clearance_requests": 23,
  "approved_today": 8,
  "denied_today": 1,
  "pending_payment_verifications": 12
}

GET    /api/admin/requirements                [any authenticated]
POST   /api/admin/requirements                [bytes]  body: { "title", "description", "applies_to_role" }
PATCH  /api/admin/requirements/{id}           [bytes]
DELETE /api/admin/requirements/{id}           [bytes]

GET /api/admin/reports/clearance-status       [bytes, dean, chairperson]
Query params: ?department=IT&status=cleared&semester=2nd&academic_year=2025-2026

GET /api/admin/reports/export.pdf    [bytes, dean, chairperson]
GET /api/admin/reports/export.xlsx   [bytes, dean, chairperson]

---

## Standard error shapes

400: { "detail": "Cannot approve: student has unpaid fines totaling 150" }
401: { "detail": "Not authenticated" }
403: { "detail": "Requires role: bytes" }
404: { "detail": "Clearance request 999 not found" }
409: { "detail": "PDF cannot be generated until all approvals are complete" }
422: { "detail": [{ "loc": ["body", "email"], "msg": "field required" }] }

---

## Versioning

When changing this contract:
1. Open a team discussion
2. Bump the version number at the top
3. Add an entry to DECISIONS.md
4. Notify everyone before merging
5. Coordinate frontend update (Norman and Shaheel) to happen with backend update
