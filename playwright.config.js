import { defineConfig, devices } from '@playwright/test'

// E2E config for the CICS E-Clearance System.
//
// Playwright starts and supervises both dev servers itself (see `webServer`
// below) so the run never depends on a separately-launched terminal staying
// alive. If the servers are already running they are reused as-is.
//   backend:  cd backend  && npm run dev   -> http://localhost:5000
//   frontend: cd frontend && npm run dev   -> http://localhost:5173
//
// Note: the Vite dev server binds to the IPv6 loopback only, so every URL
// here uses `localhost` (resolves to ::1) rather than 127.0.0.1.
export default defineConfig({
  testDir: './e2e',
  // The clearance flow is sequential and stateful — never parallelise it.
  fullyParallel: false,
  workers: 1,
  retries: 0,
  timeout: 120_000,
  expect: { timeout: 15_000 },
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: 'http://localhost:5173',
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
  webServer: [
    {
      command: 'npm run dev',
      cwd: './backend',
      url: 'http://localhost:5000/api/health',
      reuseExistingServer: true,
      timeout: 120_000,
    },
    {
      command: 'npm run dev',
      cwd: './frontend',
      url: 'http://localhost:5173',
      reuseExistingServer: true,
      timeout: 120_000,
    },
  ],
})
