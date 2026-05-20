import prisma from '../lib/prisma.js'
import {
  ROLE_TO_STAGE,
  ORG_FEE_STAGES,
  checkPrerequisites,
  isFullyApproved,
  hasDenial,
} from '../lib/approval.js'
import { buildProgress, STAGE_LABELS } from '../lib/clearance.js'
import { notify } from '../notifications/notify.js'
import { listOrgFinancialBlockers } from '../lib/payment.js'

// Generic stage decision handler. The role is taken from req.user (set by
// requireAuth + requireRole), not from the URL, so an officer can never act
// outside their stage.
async function decide(req, res, action) {
  const { id } = req.params // clearance request id
  const { reason } = req.body || {}
  const actor = req.user

  if (action === 'deny' && !reason?.trim()) {
    return res.status(400).json({ message: 'A reason is required when denying a stage.' })
  }

  const targetRole = ROLE_TO_STAGE[actor.role]
  if (!targetRole) {
    return res.status(403).json({ message: 'Your role cannot decide on clearance stages.' })
  }

  const request = await prisma.clearanceRequest.findUnique({
    where: { id },
    include: { stages: true },
  })
  if (!request) return res.status(404).json({ message: 'Clearance request not found.' })

  const stage = request.stages.find((s) => s.role === targetRole)
  if (!stage) return res.status(404).json({ message: 'Stage not found for your role.' })

  if (stage.status !== 'pending') {
    return res.status(409).json({
      message: `This stage was already ${stage.status}.`,
      decided_at: stage.decidedAt,
    })
  }

  if (action === 'approve') {
    const unmet = checkPrerequisites(request.stages, targetRole)
    if (unmet) {
      return res.status(409).json({
        message: 'Prerequisite stages are not yet approved.',
        unmet_prerequisites: unmet,
      })
    }

    // Org-fee stages (Cursor / Department / BYTES) can only be approved once
    // the student has settled that organization's fee. The BYTES stage also
    // keeps the legacy unpaid-fines check.
    if (ORG_FEE_STAGES.includes(targetRole)) {
      const blockers = await listOrgFinancialBlockers(request.studentId, targetRole)
      if (blockers.org_fee_unpaid || blockers.unpaid_fines.length > 0) {
        return res.status(409).json({
          message: 'Student has outstanding financial obligations for this office.',
          blockers,
        })
      }
    }
  }

  const newStatus = action === 'approve' ? 'approved' : 'denied'

  const [updatedStage] = await prisma.$transaction([
    prisma.clearanceStage.update({
      where: { id: stage.id },
      data: {
        status: newStatus,
        approverId: actor.id,
        decidedAt: new Date(),
        reason: reason || null,
      },
    }),
    prisma.auditLog.create({
      data: {
        actorId: actor.id,
        actorRole: actor.role,
        action: `stage_${action}`,
        targetType: 'clearance_stage',
        targetId: stage.id,
        reason: reason || null,
        metadata: { clearance_request_id: request.id, stage_role: targetRole },
      },
    }),
  ])

  // Recompute the request-level status from all stages.
  const fresh = await prisma.clearanceRequest.findUnique({
    where: { id: request.id },
    include: { stages: { include: { approver: true } } },
  })

  let newRequestStatus = fresh.status
  let completedAt = fresh.completedAt
  if (hasDenial(fresh.stages)) {
    newRequestStatus = 'denied'
  } else if (isFullyApproved(fresh.stages)) {
    newRequestStatus = 'completed'
    completedAt = new Date()
  }

  if (newRequestStatus !== fresh.status) {
    await prisma.clearanceRequest.update({
      where: { id: request.id },
      data: { status: newRequestStatus, completedAt },
    })
    fresh.status = newRequestStatus
    fresh.completedAt = completedAt
  }

  // Fire notifications (best-effort, never blocks the response).
  const student = await prisma.user.findUnique({ where: { id: fresh.studentId } })
  if (student) {
    const officeName = STAGE_LABELS[targetRole]
    notify({
      userId: student.id,
      userEmail: student.email,
      type: 'clearance',
      title: `${officeName}: ${newStatus}`,
      message:
        action === 'approve'
          ? `${officeName} approved your clearance.`
          : `${officeName} denied your clearance. ${reason || ''}`.trim(),
      emailKey: 'stageDecision',
      emailArgs: [student.firstName, officeName, newStatus, reason || ''],
    })

    if (newRequestStatus === 'completed') {
      notify({
        userId: student.id,
        userEmail: student.email,
        type: 'clearance',
        title: 'Your clearance is ready',
        message: 'All stages approved. You may download your clearance PDF.',
        emailKey: 'finalClearance',
        emailArgs: [student.firstName],
      })
    }
  }

  res.json({
    message: `Stage ${action}d.`,
    stage: { id: updatedStage.id, status: updatedStage.status },
    progress: buildProgress(fresh),
  })
}

export const approveStage = (req, res) => decide(req, res, 'approve')
export const denyStage = (req, res) => decide(req, res, 'deny')

// GET /api/approval/pending — list requests where THIS role's stage is pending
// AND prerequisites are met. Each role only sees what's actionable.
export async function listPendingForRole(req, res) {
  const targetRole = ROLE_TO_STAGE[req.user.role]
  if (!targetRole) return res.json({ pending: [] })

  const requests = await prisma.clearanceRequest.findMany({
    where: {
      status: 'pending',
      stages: { some: { role: targetRole, status: 'pending' } },
    },
    include: { stages: true, student: true },
    orderBy: { createdAt: 'asc' },
  })

  const actionable = requests.filter((r) => !checkPrerequisites(r.stages, targetRole))

  res.json({
    pending: actionable.map((r) => ({
      id: r.id,
      reference_no: r.referenceNo,
      student: {
        id: r.student.id,
        school_id: r.student.schoolId,
        name: `${r.student.firstName} ${r.student.lastName}`.trim(),
        course: r.student.course,
      },
      created_at: r.createdAt,
    })),
  })
}

// GET /api/approval/:id/audit — full audit trail for one clearance request.
export async function getAuditTrail(req, res) {
  const { id } = req.params

  const request = await prisma.clearanceRequest.findUnique({
    where: { id },
    include: { stages: true },
  })
  if (!request) return res.status(404).json({ message: 'Clearance request not found.' })

  const stageIds = request.stages.map((s) => s.id)
  const logs = await prisma.auditLog.findMany({
    where: {
      OR: [
        { targetType: 'clearance_request', targetId: id },
        { targetType: 'clearance_stage', targetId: { in: stageIds } },
      ],
    },
    orderBy: { createdAt: 'asc' },
  })

  res.json({ audit: logs })
}
