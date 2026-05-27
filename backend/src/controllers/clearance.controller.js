import prisma from '../lib/prisma.js'
import {
  STAGE_ORDER,
  ACTIVE_STATUSES,
  buildProgress,
  generateReferenceNo,
  currentAcademicYear,
} from '../lib/clearance.js'
import { streamClearancePdf } from '../lib/pdf.js'
import { notify } from '../notifications/notify.js'

const requestInclude = {
  stages: { include: { approver: true } },
}

// POST /api/clearance/request — student initiates a clearance request.
export async function createRequest(req, res) {
  const studentId = req.user.id

  const active = await prisma.clearanceRequest.findFirst({
    where: { studentId, status: { in: ACTIVE_STATUSES } },
  })
  if (active) {
    return res.status(409).json({
      message: 'You already have an active clearance request.',
      request_id: active.id,
    })
  }

  // Retry once on the (extremely unlikely) reference-number collision.
  let request
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      request = await prisma.clearanceRequest.create({
        data: {
          studentId,
          referenceNo: generateReferenceNo(),
          academicYear: currentAcademicYear(),
          stages: { create: STAGE_ORDER.map((role) => ({ role })) },
        },
        include: requestInclude,
      })
      break
    } catch (err) {
      if (err.code === 'P2002' && attempt < 2) continue
      throw err
    }
  }

  notify({
    userId: req.user.id,
    userEmail: req.user.email,
    type: 'clearance',
    title: 'Clearance request submitted',
    message: `Your request ${request.referenceNo} is now in the approval pipeline.`,
    emailKey: 'clearanceSubmitted',
    emailArgs: [req.user.firstName, request.referenceNo],
  })

  res.status(201).json({
    message: 'Clearance request submitted.',
    progress: buildProgress(request),
  })
}

// GET /api/clearance/me — student's current (or most recent) request.
export async function getMine(req, res) {
  const request = await prisma.clearanceRequest.findFirst({
    where: { studentId: req.user.id },
    orderBy: { createdAt: 'desc' },
    include: requestInclude,
  })
  if (!request) return res.json({ request: null })
  res.json({ request: buildProgress(request) })
}

// GET /api/clearance/me/progress — structured progress for the stepper.
export async function getMyProgress(req, res) {
  // Includes 'completed' so a fully-approved clearance still renders on the
  // student's My Clearance page (and keeps the Download PDF button reachable).
  // ACTIVE_STATUSES itself is left untouched — createRequest relies on it to
  // decide whether the student may start a new request.
  const request = await prisma.clearanceRequest.findFirst({
    where: {
      studentId: req.user.id,
      status: { in: [...ACTIVE_STATUSES, 'completed'] },
    },
    orderBy: { createdAt: 'desc' },
    include: requestInclude,
  })
  if (!request) {
    return res.json({ progress: null })
  }
  res.json({ progress: buildProgress(request) })
}

// GET /api/clearance/:id/pdf — printable form; refuses unless fully approved.
export async function getPdf(req, res) {
  const request = await prisma.clearanceRequest.findUnique({
    where: { id: req.params.id },
    include: { ...requestInclude, student: true },
  })
  if (!request) return res.status(404).json({ message: 'Clearance request not found.' })

  const isOwner = request.studentId === req.user.id
  // Admin oversees the whole pipeline; Dean and Enrolling Faculty handle the
  // final stages and need the completed form on hand.
  const isStaff = ['admin', 'dean', 'enrolling_faculty'].includes(req.user.role)
  if (!isOwner && !isStaff) {
    return res.status(403).json({ message: 'You can only access your own clearance.' })
  }

  const allApproved =
    request.stages.length === STAGE_ORDER.length &&
    request.stages.every((s) => s.status === 'approved')
  if (!allApproved) {
    const pending = request.stages
      .filter((s) => s.status !== 'approved')
      .map((s) => s.role)
    return res.status(409).json({
      message: 'Clearance is not complete yet. All stages must be approved.',
      pending_stages: pending,
    })
  }

  res.setHeader('Content-Type', 'application/pdf')
  res.setHeader('Content-Disposition', `inline; filename="clearance-${request.referenceNo}.pdf"`)
  streamClearancePdf(res, { request, student: request.student })
}
