// Build-time helper. Replaces BACKEND_URL_PLACEHOLDER in frontend/vercel.json
// with the value of process.env.BACKEND_URL so the Vercel rewrites point at
// the live backend. Set BACKEND_URL in the Vercel project's Environment
// Variables (e.g. "cics-backend.onrender.com" — no protocol, no trailing slash).
//
// Idempotent and a no-op when BACKEND_URL is unset (preserves placeholder).

import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const target = resolve(__dirname, '..', 'frontend', 'vercel.json')

if (!existsSync(target)) {
  console.warn(`[inject-backend-url] ${target} not found — skipping`)
  process.exit(0)
}

const backend = process.env.BACKEND_URL?.replace(/^https?:\/\//, '').replace(/\/$/, '')

if (!backend) {
  console.warn('[inject-backend-url] BACKEND_URL not set — leaving placeholder in place')
  process.exit(0)
}

const before = readFileSync(target, 'utf8')
const after = before.replaceAll('BACKEND_URL_PLACEHOLDER', backend)

if (before === after) {
  console.log('[inject-backend-url] no placeholder found (already replaced?)')
  process.exit(0)
}

writeFileSync(target, after)
console.log(`[inject-backend-url] replaced placeholder with ${backend}`)
