# CICS E-Clearance — Frontend

> A digital clearance portal for CICS students. Built with **React + Vite**.

---

## Project Structure

```
cics-eclearance/
├── public/                  # Static assets (favicon, etc.)
├── src/
│   ├── api/
│   │   └── auth.js          # ← ALL backend API calls live here
│   ├── components/
│   │   └── ProtectedRoute.jsx
│   ├── context/
│   │   └── AuthContext.jsx  # Global auth state
│   ├── pages/
│   │   ├── LoginPage.jsx    # /login
│   │   ├── LoginPage.module.css
│   │   ├── RegisterPage.jsx # /register
│   │   └── RegisterPage.module.css
│   ├── App.jsx              # Routes
│   ├── main.jsx             # Entry point
│   └── index.css            # Global CSS variables & reset
├── .env.example             # Copy to .env.local
├── vite.config.js           # Dev server + API proxy config
└── package.json
```

---

## Frontend Setup (your machine)

**Prerequisites:** Node.js ≥ 18

```bash
# 1. Clone the repository
git clone https://github.com/<your-org>/cics-eclearance.git
cd cics-eclearance

# 2. Install dependencies
npm install

# 3. Copy environment file
cp .env.example .env.local

# 4. Start development server
npm run dev
# → opens at http://localhost:5173
```

---

## GitHub Repository Setup (one-time, team lead does this)

```bash
# Inside the project folder:
git init
git add .
git commit -m "feat: initial frontend scaffold — login & register pages"

# Create repo on GitHub (github.com → New repository → cics-eclearance)
git remote add origin https://github.com/<your-org>/cics-eclearance.git
git branch -M main
git push -u origin main
```

### Recommended branch strategy
| Branch | Purpose |
|--------|---------|
| `main` | Production-ready code only |
| `develop` | Integration branch — backend + frontend merge here |
| `feat/login-api` | Example feature branch |
| `feat/register-api` | Example feature branch |

---

## For the Backend Team 🔧

All API integration points are marked with `// TODO (backend team):` comments.

### 1. API base URL & proxy

The Vite dev server proxies `/api/*` → `http://localhost:8000`.
**Change the port** in `vite.config.js` if your backend runs on a different port:

```js
// vite.config.js
proxy: {
  '/api': {
    target: 'http://localhost:8000', // ← update this
  },
},
```

### 2. Required endpoints

| Method | Path | Request body | Expected response |
|--------|------|-------------|-------------------|
| `POST` | `/api/auth/login` | `{ email, password }` | `{ access_token, user }` |
| `POST` | `/api/auth/register` | see below | `{ message }` or `{ user }` |
| `POST` | `/api/auth/logout` | — | `{ message }` |
| `GET` | `/api/auth/me` | — | `{ user }` (requires Bearer token) |

**Register payload:**
```json
{
  "id_number": "2024-00000",
  "course": "BS-Information Technology",
  "last_name": "Dela Cruz",
  "first_name": "Juan",
  "middle_name": "Santos",
  "gender": "Male",
  "date_of_birth": "2002-01-15",
  "contact_number": "09XX-XXX-XXX",
  "email": "your@cics.edu.ph",
  "password": "securepassword"
}
```

### 3. Activating the API calls

In `src/pages/LoginPage.jsx` and `RegisterPage.jsx`, the `try` blocks contain the real API calls — just **uncomment them** and remove the mock sections once your backend is running.

### 4. CORS

Make sure your backend allows `http://localhost:5173` in development.

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server with hot reload |
| `npm run build` | Build for production → `dist/` |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 |
| Build tool | Vite 5 |
| Routing | React Router v6 |
| HTTP client | Axios |
| Notifications | react-hot-toast |
| Styling | CSS Modules + CSS Variables |
| Fonts | Poppins, Inter (Google Fonts) |
