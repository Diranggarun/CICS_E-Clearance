import { useState } from 'react'
import { FiPlus, FiTrash2, FiDollarSign, FiSearch } from 'react-icons/fi'
import toast from 'react-hot-toast'
import { listFines, createFine, deleteFine } from '../api/staff'

const card =
  'rounded-[28px] border border-[#d6e2ff] bg-white/70 shadow-[0_4px_20px_rgba(13,39,247,0.06)] ring-1 ring-white/80 backdrop-blur-xl'

export default function ManageFines() {
  const [studentId, setStudentId] = useState('')
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ studentId: '', reason: '', amount: '' })

  const load = async (id) => {
    const target = id || studentId
    if (!target) return toast.error('Enter a student ID to look up fines.')
    setLoading(true)
    try {
      const { data } = await listFines(target)
      setRows(data)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Lookup failed.')
    } finally {
      setLoading(false)
    }
  }

  const add = async (e) => {
    e.preventDefault()
    if (!form.studentId || !form.reason || !form.amount)
      return toast.error('Fill all fields.')
    try {
      await createFine({
        studentId: form.studentId,
        reason: form.reason,
        amount: Number(form.amount),
      })
      toast.success('Fine added.')
      setForm({ studentId: form.studentId, reason: '', amount: '' })
      setStudentId(form.studentId)
      await load(form.studentId)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Add failed.')
    }
  }

  const remove = async (id) => {
    try {
      await deleteFine(id)
      setRows((rs) => rs.filter((r) => r.id !== id))
      toast.success('Fine removed.')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed.')
    }
  }

  return (
    <div className="space-y-8 font-inter">
      <div className="flex items-center gap-3">
        <FiDollarSign className="text-3xl text-[#0D27F7]" />
        <div>
          <h1 className="bg-gradient-to-b from-[#0D27F7] to-[#0E1BEF] bg-clip-text text-3xl font-semibold tracking-tight text-transparent md:text-4xl">
            Manage Fines
          </h1>
          <p className="mt-2 text-base font-medium text-gray-500 md:text-lg">
            Issue and remove student fines. Unpaid fines block BYTES clearance.
          </p>
        </div>
      </div>

      <div className={`${card} p-6 flex flex-wrap items-center gap-3`}>
        <input
          placeholder="Student UUID or School ID"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
          className="flex-1 min-w-[240px] rounded-[12px] border border-[#dbe7ff] bg-white px-4 py-3 text-sm outline-none focus:ring-4 focus:ring-[#0D27F7]/20"
        />
        <button
          onClick={() => load()}
          className="rounded-full bg-[#0D27F7] px-5 py-2 text-sm font-semibold text-white hover:bg-[#0a1fcc] flex items-center gap-2"
        >
          <FiSearch /> Look up
        </button>
      </div>

      <form onSubmit={add} className={`${card} p-6 grid gap-3 md:grid-cols-4`}>
        <input
          placeholder="Student UUID"
          value={form.studentId}
          onChange={(e) => setForm({ ...form, studentId: e.target.value })}
          className="rounded-[12px] border border-[#dbe7ff] bg-white px-4 py-3 text-sm outline-none focus:ring-4 focus:ring-[#0D27F7]/20"
        />
        <input
          placeholder="Reason"
          value={form.reason}
          onChange={(e) => setForm({ ...form, reason: e.target.value })}
          className="rounded-[12px] border border-[#dbe7ff] bg-white px-4 py-3 text-sm outline-none focus:ring-4 focus:ring-[#0D27F7]/20"
        />
        <input
          placeholder="Amount"
          type="number"
          value={form.amount}
          onChange={(e) => setForm({ ...form, amount: e.target.value })}
          className="rounded-[12px] border border-[#dbe7ff] bg-white px-4 py-3 text-sm outline-none focus:ring-4 focus:ring-[#0D27F7]/20"
        />
        <button className="rounded-full bg-[#0D27F7] px-6 py-3 text-sm font-semibold text-white hover:bg-[#0a1fcc] flex items-center justify-center gap-2">
          <FiPlus /> Add Fine
        </button>
      </form>

      <div className={`${card} overflow-hidden`}>
        <div className="grid grid-cols-5 border-b border-[#e2ebff] bg-white/60 px-6 py-4 text-sm font-semibold text-[#0D27F7]">
          <p>Reason</p>
          <p>Amount</p>
          <p>Status</p>
          <p>Created</p>
          <p>Actions</p>
        </div>

        {loading && <p className="px-6 py-10 text-center text-sm text-gray-400">Loading…</p>}
        {!loading && rows.length === 0 && (
          <p className="px-6 py-10 text-center text-sm text-gray-400">
            No fines found. Look up a student ID above.
          </p>
        )}

        {rows.map((r) => (
          <div
            key={r.id}
            className="grid grid-cols-5 items-center border-b border-[#e2ebff]/70 px-6 py-4 text-sm text-gray-600 last:border-b-0 hover:bg-blue-50/60"
          >
            <p>{r.reason}</p>
            <p>₱{r.amount}</p>
            <p>
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  r.status === 'paid'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-yellow-100 text-yellow-700'
                }`}
              >
                {r.status}
              </span>
            </p>
            <p>{new Date(r.createdAt).toLocaleDateString()}</p>
            <div className="flex gap-2">
              <button
                onClick={() => remove(r.id)}
                className="rounded-full bg-red-100 p-2 text-red-600 hover:bg-red-200"
              >
                <FiTrash2 />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
