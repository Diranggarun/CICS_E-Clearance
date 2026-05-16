// Mock API for staff frontend — real endpoints land with Phase 7 (Landia).
// Each call resolves after a short delay so the UI feels real.
const wait = (ms) => new Promise((r) => setTimeout(r, ms))

export async function mockApprove(kind, id, payload = {}) {
  await wait(400)
  console.log(`[mock] approve ${kind}/${id}`, payload)
  return { ok: true, id, status: 'approved', ...payload }
}

export async function mockDeny(kind, id, reason) {
  await wait(400)
  console.log(`[mock] deny ${kind}/${id}`, reason)
  return { ok: true, id, status: 'denied', reason }
}

export async function mockList(kind) {
  await wait(200)
  return { ok: true, kind }
}
