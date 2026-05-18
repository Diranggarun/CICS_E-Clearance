# How to Run the CICS Clearance System

*Step-by-step guide for non-IT students. Just follow each step in order.*

---

## PART 1 — One-Time Setup

*You only do this once on your computer. Takes about 15 minutes.*

### Step 1: Install Node.js (the engine that runs the system)

1. Open your browser and go to **https://nodejs.org**
2. Click the **big green button that says "LTS"** (the left one)
3. A file will download. Open it.
4. Click **Next → Next → Next → Install** (don't change anything)
5. When it's done, click **Finish**

Done with Step 1.

---

### Step 2: Make a free online database

1. Go to **https://supabase.com**
2. Click **Start your project** → sign in with Google or GitHub
3. Click **New Project**
4. Fill in:
   - **Name:** `cics-clearance` (or anything you want)
   - **Database Password:** make a password and **write it down on paper** — you'll need this!
   - **Region:** pick **Southeast Asia (Singapore)**
5. Click **Create new project**
6. Wait about 2 minutes (the page shows a green checkmark when it's ready)

Now get your two database links:

7. On the left side, click the **gear icon (Project Settings)**
8. Click **Database**
9. Scroll down to **Connection string**
10. You'll see tabs. Copy these **two links** into Notepad:
    - **Transaction pooler** (ends with `6543`) → label it `DATABASE_URL`
    - **Session pooler** (ends with `5432`) → label it `DIRECT_URL`
11. In **both** links, find the part that says `[YOUR-PASSWORD]` and **replace it with your password** from step 4.

Done with Step 2. Keep Notepad open — you'll paste these in a second.

---

### Step 3: Run the setup helper

1. Press the **Windows key** (bottom-left of your keyboard, has the Windows logo)
2. Type **`PowerShell`**
3. Click **Windows PowerShell** (the blue icon)
4. A blue window opens. **Click inside it** so it's active.
5. **Copy and paste this**, then press Enter:

   ```powershell
   cd "C:\Users\diran\OneDrive\Desktop\CICS_Clearance System"
   ```

6. Now copy and paste this, then press Enter:

   ```powershell
   powershell -ExecutionPolicy Bypass -File .\setup.ps1
   ```

7. It will ask you to paste your two links from Notepad — paste them when asked, press Enter after each.
8. Wait. It will print a lot of text. **Don't touch anything** until it stops and says it's done. (~2–5 minutes)

Done with Step 3. The system is now installed!

---

## PART 2 — Every Time You Want to Use the System

*You'll do this every time. Takes about 30 seconds.*

You need **TWO PowerShell windows open at the same time.** Don't close either one!

### Step 4: Start the backend (the brain)

1. Press **Windows key** → type **`PowerShell`** → press Enter
2. Copy and paste this, then press Enter:

   ```powershell
   cd "C:\Users\diran\OneDrive\Desktop\CICS_Clearance System\backend"
   ```

3. Then copy and paste this, then press Enter:

   ```powershell
   npm run dev
   ```

4. Wait until you see this message:

   ```
   CICS E-Clearance API running on http://localhost:5000
   ```

**Leave this window open. Don't close it!**

---

### Step 5: Start the frontend (the website)

1. Press **Windows key** again → type **`PowerShell`** → press Enter
   *(You should now have TWO PowerShell windows open)*
2. In the NEW window, copy and paste this, then press Enter:

   ```powershell
   cd "C:\Users\diran\OneDrive\Desktop\CICS_Clearance System\frontend"
   ```

3. Then paste this, then press Enter:

   ```powershell
   npm run dev
   ```

4. Wait until you see this:

   ```
   Local: http://localhost:5173/
   ```

**Leave this window open too!**

---

### Step 6: Open the website

1. Open **Google Chrome** (or any browser)
2. Go to: **http://localhost:5173**
3. Log in! Try one of these accounts:

   | If you want to be a... | Email | Password |
   |---|---|---|
   | **Student** | `maria.santos@s.msumain.edu.ph` | `Cics#2026` |
   | **BYTES Officer** | `bytes@cics.edu.ph` | `Bytes#2026` |
   | **Librarian** | `librarian@cics.edu.ph` | `Cics#2026` |
   | **Adviser** | `adviser@cics.edu.ph` | `Cics#2026` |
   | **Chairperson** | `chairperson@cics.edu.ph` | `Cics#2026` |
   | **Dean** | `dean@cics.edu.ph` | `Cics#2026` |

You're in! Use the system.

---

## When You're Done

1. Go to each PowerShell window
2. Press **Ctrl + C** (hold Ctrl, then press C)
3. Close both windows by clicking the **X**

---

## If Something Goes Wrong

**The website won't load?**
Both PowerShell windows must still be running. Check them.

**It says "port in use" or "EADDRINUSE"?**
Open PowerShell, paste this, press Enter:

```powershell
taskkill /IM node.exe /F
```

Then start over from Step 4.

**You see a red error?**
Close both windows, start over from Step 4. 90% of problems are fixed this way.

**Still broken?**
Take a screenshot of the red text and send it to the team.

---

## Try the Full Approval Flow (Optional Demo)

Want to see clearance go from request all the way to PDF? Do this in order:

1. Log in as **Student** (`maria.santos@s.msumain.edu.ph`) → click **My Clearance** → click **Submit Clearance Request**.
2. Log out. Log in as **BYTES Officer** (`bytes@cics.edu.ph` / `Bytes#2026`) → approve the BYTES stage.
3. Log out. Log in as **Librarian** → approve.
4. Log out. Log in as **Adviser** → approve.
5. Log out. Log in as **Chairperson** → approve.
6. Log out. Log in as **Dean** → approve.
7. Log back in as the **Student** → **My Clearance** → click **Download PDF** — it works now!

---

## Where to Look When Something Breaks (For the Tech-Savvy)

- **API contract:** `claude-docs/API_CONTRACT.md`
- **Database schema:** `backend/prisma/schema.prisma` and `claude-docs/ERD.md`
- **Module ownership:** `CLAUDE.md` (don't edit another dev's module without asking)
- **Known bugs / fixes:** `claude-docs/DEBUGGING.md`
- **Detailed phase progress:** `claude-docs/PROGRESS.md`
