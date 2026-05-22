// One-off backfill for the 5-stage -> 9-stage workflow expansion.
//
// For every existing ClearanceRequest it:
//   1. Creates any ClearanceStage rows missing from the new STAGE_ORDER
//      (Admin, Cursor, Department, Enrolling Faculty) with status 'pending'.
//   2. Recomputes the request-level status — a request that was 'completed'
//      now has pending stages again, so it is re-opened to 'pending'
//      (or kept 'denied' if any stage was denied).
//
// Safe to run more than once: stages already present are left untouched.
//
// Run from the backend/ directory AFTER `prisma migrate deploy`:
//   node scripts/backfill-workflow-stages.js

import prisma from '../src/lib/prisma.js'
import { STAGE_ORDER } from '../src/lib/clearance.js'

async function main() {
  const requests = await prisma.clearanceRequest.findMany({
    include: { stages: true },
  })

  let stagesAdded = 0
  let requestsReopened = 0

  for (const request of requests) {
    const existing = new Set(request.stages.map((s) => s.role))
    const missing = STAGE_ORDER.filter((role) => !existing.has(role))

    if (missing.length > 0) {
      await prisma.clearanceStage.createMany({
        data: missing.map((role) => ({
          clearanceRequestId: request.id,
          role,
        })),
      })
      stagesAdded += missing.length
    }

    // Recompute status from the full (existing + newly added) stage set.
    const statuses = [
      ...request.stages.map((s) => s.status),
      ...missing.map(() => 'pending'),
    ]
    let status = 'pending'
    if (statuses.includes('denied')) status = 'denied'
    else if (statuses.every((s) => s === 'approved')) status = 'completed'

    if (status !== request.status) {
      await prisma.clearanceRequest.update({
        where: { id: request.id },
        data: {
          status,
          completedAt: status === 'completed' ? request.completedAt : null,
        },
      })
      if (request.status === 'completed') requestsReopened += 1
    }
  }

  console.log(
    `Backfill complete: ${requests.length} request(s) processed, ` +
      `${stagesAdded} stage(s) added, ${requestsReopened} re-opened.`,
  )
}

main()
  .catch((err) => {
    console.error('Backfill failed:', err)
    process.exitCode = 1
  })
  .finally(() => prisma.$disconnect())
