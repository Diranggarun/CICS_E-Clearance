# Known Errors and Fixes

Add entries as you solve non-obvious errors.
Tag with module name so developers find their own section fast.
Format: symptom, root cause, fix.

---

## Environment and setup

### PowerShell: venv activation blocked
Symptom: venv\Scripts\activate cannot be loaded
Fix: Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned

### MySQL: cannot connect
Symptom: (2003, "Can't connect to MySQL server")
Fix: net start MySQL80
Check .env: DATABASE_URL=mysql+pymysql://root:PASSWORD@localhost:3306/cics_eclearance

### npm install fails with ERESOLVE
Cause: peer dependency mismatch
Fix: npm install --legacy-peer-deps

---

## Auth module (Dimalutang)

### Registered user cannot log in
Cause: is_approved is FALSE. This is intentional.
Fix: BYTES officer must approve the account first.
Dev shortcut: UPDATE users SET is_approved = TRUE WHERE user_id = ?;

### 403 Forbidden even though role is correct
Cause: JWT was issued before the role was changed in DB.
Fix: Log out and log back in to get a fresh token.

### bcrypt import error
Symptom: cannot import name __version__ from bcrypt
Fix: pip install --force-reinstall bcrypt==4.0.1 passlib

---

## Payment module (Asraf)

### Receipt upload returns 413
Cause: File exceeds 5MB cap. This is intentional.

### has_unpaid_fines returns False with unpaid fines
Cause: Query not filtering out paid and waived statuses.
Fix: WHERE student_id = ? AND status IN ('unpaid','awaiting_verification')

### BYTES cannot see uploaded receipt
Cause: payment status not updated to awaiting_verification, or receipt row not inserted.
Fix: Check payments.status and payment_receipts table both updated in the upload endpoint.

---

## Approval module (Landia)

### Adviser can approve before BYTES
Cause: check_prerequisites not being called or wrong stage name used.
Fix: Add unit test: submit request, skip BYTES, try adviser approve, assert 400.

### Stage does not unlock after approval
Cause: act_on_stage not updating next stage from blocked to pending.
Fix: After updating current stage, check if next stage prerequisites now met
and update its status to pending.

### Dean approves but clearance_requests.status stays in_progress
Cause: Status not being updated when all 5 stages are approved.
Fix: After recording Dean approval, check all stages approved,
then UPDATE clearance_requests SET status='fully_cleared', completed_at=NOW()

---

## Clearance module (Naimah)

### PDF download returns 500
Cause: Usually a None value passed to string formatting in ReportLab.
Fix: Guard all student fields: full_name or 'Unknown', etc.

### Submit request returns 400 with unpaid fines when there are none
Cause: has_unpaid_fines query filter is wrong or test data has stale rows.
Fix: SELECT from fines WHERE student_id=? AND status IN ('unpaid','awaiting_verification')

---

## Notifications module (Ed)

### Emails not sending
Cause: SMTP credentials wrong or EMAIL_PROVIDER not set in .env
Fix: Test directly:
  import smtplib
  s = smtplib.SMTP_SSL('smtp.gmail.com', 465)
  s.login('user@gmail.com', 'app_password')
Note: Gmail requires an App Password, not your real password.

### Emails go to spam
Cause: No SPF/DKIM on sender domain.
Fix: Accept in development. Use SendGrid for production.

### In-app notification count always 0
Cause: Frontend not polling, or backend missing WHERE is_read = FALSE.
Fix: Add is_read = FALSE to count query. Frontend: refetchInterval every 30 seconds.

---

## Admin / Reports module (Affhan)

### PDF report is blank
Cause: ReportLab flowables list is empty when query returns no rows.
Fix: Add a No data paragraph for empty results.

### Excel export downloads but Excel says file is corrupt
Cause: Wrong Content-Type or response headers.
Fix:
  return Response(
    content=buffer.getvalue(),
    media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    headers={"Content-Disposition": "attachment; filename=report.xlsx"}
  )

### Migration fails: Duplicate column name
Cause: Migration already applied.
Fix: Use ALTER TABLE ... ADD COLUMN IF NOT EXISTS (MySQL 8.0.29+)

---

## Frontend

### Failed to fetch on every API call
Fix:
  1. Confirm backend running: curl http://localhost:8000/health
  2. Check frontend/.env: VITE_API_URL=http://localhost:8000
  3. Check backend CORS allows http://localhost:5173

### Token saved but useAuth shows user as null
Cause: AuthContext reads token only on mount.
Fix: Trigger refetch in AuthContext after setting the token.

### Tailwind classes have no effect
Fix: tailwind.config.js content must be:
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"]
Restart npm run dev after changing.

### File upload returns 422 even with file selected
Cause: Manually setting Content-Type breaks the multipart boundary.
Fix: Never set Content-Type manually when using FormData. Axios sets it correctly.

---

## Git / collaboration

### Merge conflict in database/schema.sql
Cause: Two developers edited it. Only Affhan should edit this file.
Fix: Revert your changes. Request schema change via team channel. Affhan writes migration.

### Lost changes after git rebase
Fix:
  git reflog
  git reset --hard SHA-before-rebase

---

<<<<<<< HEAD
=======
## Node / Prisma / Supabase (current stack)

### EADDRINUSE :::5000 on backend start
Cause: A zombie node.exe from a previous run is holding the port.
Fix: `taskkill /IM node.exe /F` then `npm run dev` again. If the error persists, run `netstat -ano | findstr :5000` to find the PID and `taskkill /PID <pid> /F`.

### Vite says "Port 5173 is in use, trying another one..." and lands on 5174
Cause: Same — a zombie Vite is on 5173.
Fix: `taskkill /IM node.exe /F` then restart frontend. The backend's CORS was widened to accept any localhost port, so 5174 still works for the demo, but URLs in bookmarks/docs assume 5173.

### Prisma: "invalid domain character in database URL"
Cause: `backend/.env` still contains literal `[YOUR-PASSWORD]` / `[PROJECT-REF]` placeholders, OR the password has un-escaped special chars (`@ # / ? % :`).
Fix: Re-run `setup.ps1` (it'll prompt for fresh values), or URL-encode the password. PowerShell quick encode: `Add-Type -AssemblyName System.Web; [System.Web.HttpUtility]::UrlEncode("YourPassword")`.

### Prisma migrate hangs / SSL handshake error
Cause: Using the Transaction pooler URI (port 6543) for `DIRECT_URL`. Migrations need a real session connection.
Fix: Set `DIRECT_URL` to the Supabase **Session/Direct** URI (port 5432). The pooler URI goes in `DATABASE_URL`.

### `prisma generate` fails with EPERM rename query_engine-windows.dll.node
Cause: A running backend (or Prisma Studio) has the engine DLL file-locked. Windows can't replace it.
Fix: Stop all node processes (`taskkill /IM node.exe /F`), then `npx prisma generate`. Harmless if the client was already generated before — runtime still works.

### Login spins forever / "Network Error" toast
Cause: Backend isn't running, wrong port, or the user's stale process is on a different port.
Fix: Confirm backend terminal shows `CICS E-Clearance API running on http://localhost:5000`. Hit `http://localhost:5000/api/health` directly — should return `{"ok":true}`.

### "Email already registered" on Register
Cause: The email is taken (often a seeded team account like `diranggarun.hg587@s.msumain.edu.ph`).
Fix: Use a different email. Or wipe the user: `node -e "import('./src/lib/prisma.js').then(async m => { const p=m.default; await p.user.delete({where:{email:'X'}}); await p.\$disconnect()})"`.

### "Please fill in all required fields" on Register even though everything looks filled
Cause: The Date of Birth field still shows `mm/dd/yyyy` placeholder — it's actually empty.
Fix: Click the date picker and select a date.

### Manage Fines: "No user found for 2026-9001"
Cause: Until 2026-05-17, the backend only accepted UUIDs in the studentId field. Now it accepts School IDs too.
Fix: Restart the backend if it predates the fix. Or paste the UUID instead.

### Multiple zombie node.exe processes accumulate
Cause: Re-running `npm run dev` in the same terminal without Ctrl+C'ing the previous one leaves orphans (Windows quirk).
Fix: `taskkill /IM node.exe /F` between runs. Or always use Ctrl+C to stop before restarting.

### Browser stuck showing old code after a Vite change
Cause: Service worker / aggressive cache.
Fix: Hard reload — Ctrl+Shift+R (Chrome/Edge) or open DevTools → Network → "Disable cache".

---

>>>>>>> d28bd3b538eb5eb7f22a9b7749abab309e37038e
## Adding entries

Format:
### Short symptom description
Cause: what was actually wrong
Fix: exact command or code that resolved it
