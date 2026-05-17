import { useEffect, useState } from 'react'
import { FiCheck, FiX, FiEye, FiClock, FiCheckCircle, FiXCircle } from 'react-icons/fi'
import toast from 'react-hot-toast'
import ApprovalModal from './ApprovalModal'
import { listPendingForRole } from '../api/staff'

const card =
  'rounded-[28px] border border-[#d6e2ff] bg-white/70 shadow-[0_4px_20px_rgba(13,39,247,0.06)] ring-1 ring-white/80 backdrop-blur-xl'

function ApproverBoard({ title, subtitle, kind }) {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)

  const load = async () => {
    setLoading(true)
    try {
      const { data } = await listPendingForRole()
      setRows(
        data.pending.map((p) => ({
          id: p.id,
          studentId: p.student?.school_id,
          name: p.student?.name,
          course: p.student?.course,
          submittedAt: new Date(p.created_at).toLocaleDateString(),
          status: 'Pending',
        })),
      )
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load pending requests.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const stats = {
    pending: rows.length,
    approved: 0, // historical totals belong on the dashboard, not the queue
    denied: 0,
  }

  const onDone = (res) => {
    // Decided rows drop out of the pending feed on the next load.
    setRows((rs) => rs.filter((r) => r.id !== res.id))
  }

  return (
    <div className="space-y-8 font-inter">
      <div>
        <h1 className="bg-gradient-to-b from-[#0D27F7] to-[#0E1BEF] bg-clip-text text-3xl font-semibold tracking-tight text-transparent md:text-4xl">
          {title}
        </h1>
        <p className="mt-2 text-base font-medium text-gray-500 md:text-lg">{subtitle}</p>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        <StatCard label="Pending" value={stats.pending} icon={<FiClock />} />
        <StatCard label="Approved" value={stats.approved} icon={<FiCheckCircle />} />
        <StatCard label="Denied" value={stats.denied} icon={<FiXCircle />} />
      </div>

      <div className={`${card} overflow-hidden`}>
        <div className="grid grid-cols-6 border-b border-[#e2ebff] bg-white/60 px-6 py-4 text-sm font-semibold text-[#0D27F7]">
          <p>Student ID</p>
          <p>Name</p>
          <p>Course</p>
          <p>Submitted</p>
          <p>Status</p>
          <p>Actions</p>
        </div>

        {loading && (
          <p className="px-6 py-10 text-center text-sm text-gray-400">Loading…</p>
        )}
        {!loading && rows.length === 0 && (
          <p className="px-6 py-10 text-center text-sm text-gray-400">
            No requests awaiting your decision.
          </p>
        )}

        {rows.map((r) => (
          <div
            key={r.id}
            className="grid grid-cols-6 items-center border-b border-[#e2ebff]/70 px-6 py-4 text-sm text-gray-600 last:border-b-0 hover:bg-blue-50/60"
          >
            <p>{r.studentId}</p>
            <p className="font-medium text-gray-700">{r.name}</p>
            <p>{r.course}</p>
            <p>{r.submittedAt}</p>
            <p>
              <Badge status={r.status} />
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setSelected({ ...r, label: title })}
                className="rounded-full bg-blue-100 p-2 text-[#0D27F7] hover:bg-blue-200"
                title="Review"
              >
                <FiEye />
              </button>
              <button
                onClick={() => setSelected({ ...r, label: title })}
                className="rounded-full bg-green-100 p-2 text-green-700 hover:bg-green-200"
                title="Approve"
              >
                <FiCheck />
              </button>
              <button
                onClick={() => setSelected({ ...r, label: title })}
                className="rounded-full bg-red-100 p-2 text-red-600 hover:bg-red-200"
                title="Deny"
              >
                <FiX />
              </button>
            </div>
          </div>
        ))}
      </div>

      <ApprovalModal
        open={!!selected}
        subject={selected}
        kind={kind}
        onClose={() => setSelected(null)}
        onDone={onDone}
      />
    </div>
  )
}

function StatCard({ label, value, icon }) {
  return (
    <div className={`${card} p-6`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{label}</p>
          <h2 className="mt-3 text-3xl font-semibold text-[#0D27F7]">{value}</h2>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#e2ebff] bg-white/60 text-2xl text-[#0D27F7] shadow-sm backdrop-blur">
          {icon}
        </div>
      </div>
    </div>
  )
}

function Badge({ status }) {
  const map = {
    Pending: 'bg-yellow-100 text-yellow-700',
    Approved: 'bg-green-100 text-green-700',
    Denied: 'bg-red-100 text-red-700',
  }
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${map[status]}`}>{status}</span>
  )
}

export default ApproverBoard
