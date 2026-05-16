import { useState } from 'react'
import { FiX, FiUser, FiBookOpen, FiCalendar, FiHash } from 'react-icons/fi'
import toast from 'react-hot-toast'
import { approveStage, denyStage } from '../api/staff'

// Reusable approve/deny modal for any clearance stage (BYTES, Librarian,
// Adviser, Chairperson, Dean) and for pending account approvals.
function ApprovalModal({ open, onClose, subject, kind = 'stage', onDone }) {
  const [reason, setReason] = useState('')
  const [busy, setBusy] = useState(false)

  if (!open || !subject) return null

  const handle = async (action) => {
    if (action === 'deny' && !reason.trim()) {
      toast.error('Please provide a reason for denial.')
      return
    }
    setBusy(true)
    try {
      const fn = action === 'approve' ? approveStage : denyStage
      const { data } = await fn(subject.id, reason)
      toast.success(action === 'approve' ? 'Approved.' : 'Denied.')
      onDone?.({ id: subject.id, status: action === 'approve' ? 'approved' : 'denied', progress: data.progress })
      onClose()
      setReason('')
    } catch (err) {
      const msg = err.response?.data?.message || 'Something went wrong.'
      toast.error(msg)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
      <div className="w-full max-w-xl rounded-[28px] border border-[#d6e2ff] bg-white p-8 shadow-2xl">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-[#0D27F7]">
            Review {subject.label || 'Request'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-red-500">
            <FiX size={24} />
          </button>
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-2">
          <Field icon={<FiUser />} label="Student" value={subject.name} />
          <Field icon={<FiHash />} label="Student ID" value={subject.studentId || subject.id} />
          <Field icon={<FiBookOpen />} label="Course" value={subject.course} />
          <Field icon={<FiCalendar />} label="Submitted" value={subject.submittedAt} />
        </div>

        <div className="mt-6">
          <label className="text-sm font-medium text-gray-500">
            Remarks / denial reason
          </label>
          <textarea
            rows="3"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Optional for approval, required for denial..."
            className="mt-2 w-full resize-none rounded-[12px] border border-[#dbe7ff] bg-white px-4 py-3 text-sm outline-none focus:ring-4 focus:ring-[#0D27F7]/20"
          />
        </div>

        <div className="mt-8 flex justify-end gap-3">
          <button
            disabled={busy}
            onClick={() => handle('deny')}
            className="rounded-full bg-red-600 px-6 py-3 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
          >
            Deny
          </button>
          <button
            disabled={busy}
            onClick={() => handle('approve')}
            className="rounded-full bg-green-600 px-6 py-3 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-50"
          >
            Approve
          </button>
        </div>
      </div>
    </div>
  )
}

function Field({ icon, label, value }) {
  return (
    <div className="rounded-2xl border border-[#e2ebff] bg-[#f8fbff] p-4">
      <p className="flex items-center gap-2 text-sm text-gray-500">
        {icon}
        {label}
      </p>
      <p className="font-semibold text-[#0D27F7]">{value ?? '—'}</p>
    </div>
  )
}

export default ApprovalModal
