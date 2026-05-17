import { useEffect, useState } from 'react'
import { FiCheck, FiX, FiUserPlus } from 'react-icons/fi'
import toast from 'react-hot-toast'
import {
  listPendingAccounts,
  approveAccount,
  denyAccount,
} from '../api/staff'

const card =
  'rounded-[28px] border border-[#d6e2ff] bg-white/70 shadow-[0_4px_20px_rgba(13,39,247,0.06)] ring-1 ring-white/80 backdrop-blur-xl'

export default function PendingAccounts() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [denying, setDenying] = useState(null)
  const [reason, setReason] = useState('')

  const load = async () => {
    setLoading(true)
    try {
      const { data } = await listPendingAccounts()
      setRows(data.users || [])
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const approve = async (id) => {
    try {
      await approveAccount(id)
      setRows((rs) => rs.filter((r) => r.id !== id))
      toast.success('Account approved.')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Approval failed.')
    }
  }

  const submitDeny = async () => {
    if (!reason.trim()) return toast.error('Reason required.')
    try {
      await denyAccount(denying.id, reason)
      setRows((rs) => rs.filter((r) => r.id !== denying.id))
      toast.success('Account denied.')
      setDenying(null)
      setReason('')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Denial failed.')
    }
  }

  return (
    <div className="space-y-8 font-inter">
      <div className="flex items-center gap-3">
        <FiUserPlus className="text-3xl text-[#0D27F7]" />
        <div>
          <h1 className="bg-gradient-to-b from-[#0D27F7] to-[#0E1BEF] bg-clip-text text-3xl font-semibold tracking-tight text-transparent md:text-4xl">
            Pending Accounts
          </h1>
          <p className="mt-2 text-base font-medium text-gray-500 md:text-lg">
            Review and approve new student registrations.
          </p>
        </div>
      </div>

      <div className={`${card} overflow-hidden`}>
        <div className="grid grid-cols-6 border-b border-[#e2ebff] bg-white/60 px-6 py-4 text-sm font-semibold text-[#0D27F7]">
          <p>School ID</p>
          <p>Name</p>
          <p>Email</p>
          <p>Course</p>
          <p>Registered</p>
          <p>Actions</p>
        </div>

        {loading && (
          <p className="px-6 py-10 text-center text-sm text-gray-400">Loading…</p>
        )}
        {!loading && rows.length === 0 && (
          <p className="px-6 py-10 text-center text-sm text-gray-400">No pending accounts.</p>
        )}

        {rows.map((r) => (
          <div
            key={r.id}
            className="grid grid-cols-6 items-center border-b border-[#e2ebff]/70 px-6 py-4 text-sm text-gray-600 last:border-b-0 hover:bg-blue-50/60"
          >
            <p>{r.schoolId}</p>
            <p className="font-medium text-gray-700">
              {r.firstName} {r.lastName}
            </p>
            <p className="truncate">{r.email}</p>
            <p>{r.course || '—'}</p>
            <p>{new Date(r.createdAt).toLocaleDateString()}</p>
            <div className="flex gap-2">
              <button
                onClick={() => approve(r.id)}
                className="rounded-full bg-green-100 p-2 text-green-700 hover:bg-green-200"
              >
                <FiCheck />
              </button>
              <button
                onClick={() => setDenying(r)}
                className="rounded-full bg-red-100 p-2 text-red-600 hover:bg-red-200"
              >
                <FiX />
              </button>
            </div>
          </div>
        ))}
      </div>

      {denying && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
          <div className="w-full max-w-md rounded-[28px] border border-[#d6e2ff] bg-white p-8 shadow-2xl">
            <h2 className="text-xl font-semibold text-[#0D27F7]">
              Deny {denying.firstName} {denying.lastName}?
            </h2>
            <textarea
              rows="3"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Reason for denial"
              className="mt-4 w-full resize-none rounded-[12px] border border-[#dbe7ff] bg-white px-4 py-3 text-sm outline-none focus:ring-4 focus:ring-[#0D27F7]/20"
            />
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => {
                  setDenying(null)
                  setReason('')
                }}
                className="rounded-full bg-gray-100 px-6 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={submitDeny}
                className="rounded-full bg-red-600 px-6 py-2 text-sm font-semibold text-white hover:bg-red-700"
              >
                Deny
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
