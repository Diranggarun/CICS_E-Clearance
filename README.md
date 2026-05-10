<div align="center">

# CICS E-Clearance System

**Web-based clearance management portal for the College of Information and Computing Studies, MSU – Main Campus.**

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-4-000000?logo=express&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-DB-4169E1?logo=postgresql&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-green)

</div>

---

## Overview

The **CICS E-Clearance System** digitizes the student clearance process at MSU – Main Campus. It enables students to submit, track, and complete clearance requirements online, while empowering BYTES officers, signatories, and administrators to manage accounts, fees, fines, and approvals through role-based dashboards.

The project follows a clean monorepo split between **frontend** (React + Vite) and **backend** (Node.js + Express + Prisma + PostgreSQL), and is being built collaboratively by a 9-person team.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Environment Variables](#environment-variables)
- [Default Accounts](#default-accounts)
- [API Reference](#api-reference)
- [Frontend Integration Guide](#frontend-integration-guide)
- [Branching Strategy](#branching-strategy)
- [Available Scripts](#available-scripts)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [Team](#team)
- [License](#license)

---

## Features

- **Role-based access control** — Student, BYTES Officer, Signatory, Admin
- **Student dashboard** — Submit clearance requests, track approvals, view fines
- **Officer dashboard** — Approve/deny pending accounts, manage clearance items
- **Admin dashboard** — User management, requirements configuration, reports
- **Secure authentication** — JWT-based login with pending/denied account gating
- **PDF clearance generation** *(planned)*
- **GCash payment integration** *(planned)*
- **Email + in-app notifications** *(planned)*

---

## Tech Stack

### Frontend
| Layer         | Technology                              |
| ------------- | --------------------------------------- |
| Framework     | React 18                                |
| Build Tool    | Vite 5                                  |
| Routing       | React Router v6                         |
| HTTP Client   | Axios                                   |
| Notifications | react-hot-toast                         |
| Styling       | Tailwind CSS, CSS Modules, CSS Variables|
| Fonts         | Poppins, Inter (Google Fonts)           |

### Backend
| Layer      | Technology  |
| ---------- | ----------- |
| Runtime    | Node.js 18+ |
| Framework  | Express     |
| ORM        | Prisma      |
| Database   | PostgreSQL  |
| Auth       | JWT         |
| Validation | Zod         |

---

## Project Structure

```
CICS_Clearance_System/
├── frontend/                       # React + Vite + Tailwind
│   ├── public/                     # Static assets
│   ├── src/
│   │   ├── api/                    # API client layer
│   │   │   └── auth.js
│   │   ├── components/             # Shared UI components
│   │   │   └── ProtectedRoute.jsx
│   │   ├── context/                # React contexts (auth, etc.)
│   │   │   └── AuthContext.jsx
│   │   ├── pages/                  # Route-level pages
│   │   │   ├── LoginPage.jsx
│   │   │   └── RegisterPage.jsx
│   │   ├── App.jsx                 # Route definitions
│   │   ├── main.jsx                # Entry point
│   │   └── index.css               # Global styles
│   ├── .env.example
│   ├── vite.config.js              # Dev server + API proxy
│   └── package.json
│
├── backend/                        # Node.js + Express + Prisma
│   ├── src/                        # Controllers, routes, middleware
│   ├── prisma/                     # Schema + migrations
│   ├── .env.example
│   └── package.json
│
├── README.md
└── .gitignore
```

---

## Prerequisites

Before running the project, ensure you have the following installed:

- [Node.js](https://nodejs.org/) **≥ 18**
- [npm](https://www.npmjs.com/) **≥ 9** (bundled with Node)
- [PostgreSQL](https://www.postgresql.org/) **≥ 14**
- [Git](https://git-scm.com/)

---

## Getting Started

Clone the repository:

```bash
git clone https://github.com/<your-org>/cics-eclearance.git
cd cics-eclearance
```

Run the backend and frontend in separate terminals.

### Backend Setup

```powershell
cd backend
npm install
copy .env.example .env               # then edit DATABASE_URL and JWT_SECRET
npx prisma migrate dev --name init
npm run seed
npm run dev                          # http://localhost:8000
```

### Frontend Setup

```powershell
cd frontend
npm install
copy .env.example .env.local
npm run dev                          # http://localhost:5173
```

Vite automatically proxies `/api/*` → `http://localhost:8000`, so no additional config is required.

---

## Environment Variables

### Backend (`backend/.env`)

| Variable       | Description                            | Example                                              |
| -------------- | -------------------------------------- | ---------------------------------------------------- |
| `DATABASE_URL` | PostgreSQL connection string           | `postgresql://user:pass@localhost:5432/cics_clearance` |
| `JWT_SECRET`   | Secret used to sign JWT tokens         | `super-secret-string`                                |
| `PORT`         | API server port (default `8000`)       | `8000`                                               |

### Frontend (`frontend/.env.local`)

| Variable       | Description                            | Example                  |
| -------------- | -------------------------------------- | ------------------------ |
| `VITE_API_URL` | Backend API base URL (optional override)| `http://localhost:8000` |

---

## Default Accounts

After seeding, a BYTES Officer account is available for approving new student registrations:

| Email               | Password     | Role           |
| ------------------- | ------------ | -------------- |
| `bytes@cics.edu.ph` | `Bytes#2026` | `bytes_officer`|

> Change this password immediately in production.

---

## API Reference

Base URL: `http://localhost:8000/api`

### Authentication

| Method | Endpoint              | Description                           | Auth |
| ------ | --------------------- | ------------------------------------- | ---- |
| `POST` | `/auth/register`      | Create a pending student account      | —    |
| `POST` | `/auth/login`         | Log in, returns JWT (blocks pending)  | —    |
| `GET`  | `/auth/me`            | Get the current authenticated user    | ✅   |
| `POST` | `/auth/logout`        | Stateless logout                      | ✅   |

### Admin (BYTES Officer only)

| Method | Endpoint                                   | Description                |
| ------ | ------------------------------------------ | -------------------------- |
| `GET`  | `/admin/pending-accounts`                  | List pending registrations |
| `POST` | `/admin/pending-accounts/:id/approve`      | Approve a pending account  |
| `POST` | `/admin/pending-accounts/:id/deny`         | Deny a pending account     |

### Register Payload

```json
{
  "id_number": "2024-00000",
  "course": "BS-Information Technology",
  "last_name": "Dela Cruz",
  "first_name": "Juan",
  "middle_name": "Santos",
  "gender": "Male",
  "date_of_birth": "2002-01-15",
  "contact_number": "09XX-XXX-XXXX",
  "email": "your@cics.edu.ph",
  "password": "securepassword"
}
```

### Login Response

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "email": "your@cics.edu.ph",
    "role": "student"
  }
}
```

---

## Frontend Integration Guide

This section is intended for the **backend team** integrating against the frontend.

### 1. API Proxy

The Vite dev server proxies `/api/*` to the backend. Update the target in `frontend/vite.config.js` if your API runs on a different port:

```js
// frontend/vite.config.js
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:8000',
      changeOrigin: true,
    },
  },
},
```

### 2. Activating Real API Calls

API integration points are marked with `// TODO (backend team):` comments. In `src/pages/LoginPage.jsx` and `src/pages/RegisterPage.jsx`, uncomment the real API calls inside the `try` blocks and remove the mock fallbacks once the backend is reachable.

### 3. CORS

Ensure the backend allows the frontend origin in development:

```
Access-Control-Allow-Origin: http://localhost:5173
```

---

## Branching Strategy

| Branch              | Purpose                                                |
| ------------------- | ------------------------------------------------------ |
| `main`              | Production-ready code only                             |
| `develop`           | Integration branch — frontend + backend merge here     |
| `feat/<feature>`    | New features (e.g. `feat/login-api`)                   |
| `fix/<issue>`       | Bug fixes                                              |
| `chore/<task>`      | Tooling, configs, dependencies                         |

**Workflow:** branch off `develop` → open PR → review → merge into `develop` → release into `main`.

---

## Available Scripts

### Frontend (`/frontend`)

| Command           | Description                              |
| ----------------- | ---------------------------------------- |
| `npm run dev`     | Start the Vite dev server with HMR       |
| `npm run build`   | Build production bundle to `dist/`       |
| `npm run preview` | Preview the production build locally     |
| `npm run lint`    | Run ESLint across the codebase           |

### Backend (`/backend`)

| Command                    | Description                          |
| -------------------------- | ------------------------------------ |
| `npm run dev`              | Start the API server with hot reload |
| `npm run start`            | Start the API server (production)    |
| `npm run seed`             | Seed initial data (BYTES Officer)    |
| `npx prisma migrate dev`   | Run development migrations           |
| `npx prisma studio`        | Open the Prisma DB GUI               |

---

## Roadmap

Tracked in `claude_prompt_and task.txt`. Current status:

- [x] **Task 1** — Authentication & user management (register, login, JWT, account approval)
- [ ] **Task 0b** — Full schema + OpenAPI contract
- [ ] **Task 2** — Student clearance request + PDF generation
- [ ] **Task 3** — Fines, fees, and GCash payments
- [ ] **Task 4** — Approval workflow engine (multi-role gating)
- [ ] **Task 5** — Email + in-app notifications
- [ ] **Task 6** — Admin dashboard, requirements, reports
- [ ] **Task 7** — Student frontend pages
- [ ] **Task 8** — Admin / staff frontend pages

---

## Contributing

1. Fork or clone the repository.
2. Create a feature branch: `git checkout -b feat/your-feature`.
3. Commit your changes using [Conventional Commits](https://www.conventionalcommits.org/):
   - `feat: add student clearance form`
   - `fix: handle 401 on expired tokens`
   - `chore: bump prisma to 5.x`
4. Push your branch and open a Pull Request against `develop`.
5. Ensure linting passes and the app builds before requesting review.

---

## Team

Built by a 9-person team from the College of Information and Computing Studies, MSU – Main Campus.

| Role               | Responsibilities                                        |
| ------------------ | ------------------------------------------------------- |
| Project Lead       | Coordination, architecture, code review                 |
| Backend Engineers  | API, database, auth, workflow engine                    |
| Frontend Engineers | UI, dashboards, integrations                            |
| QA / Documentation | Testing, OpenAPI spec, README                           |

---

## License

This project is released under the [MIT License](LICENSE).

---

<div align="center">

Made with ❤️ by the CICS – MSU Main Campus team.

</div>
