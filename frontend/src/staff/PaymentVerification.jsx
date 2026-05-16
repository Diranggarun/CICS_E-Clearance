import { useEffect, useState } from 'react'
import { FiCheck, FiX, FiEye, FiCreditCard } from 'react-icons/fi'
import toast from 'react-hot-toast'
import { listPayments, approvePayment, denyPayment } from '../api/staff'

const card =
  'rounded-[28px] border border-[#d6e2ff] bg-white/70 shadow-[0_4px_20px_rgba(13,39,247,0.06)] ring-1 ring-white/80 backdrop-blur-xl'

export default function PaymentVerification() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)
  const [reason, setReason] = useState('')

  const load = async () => {
    setLoading(true)
    try {
      const { data } = await listPayments('pending')
      setRows(data)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load payments.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const decide = async (action) => {
    if (action === 'deny' && !reason.trim()) return toast.error('Reason required.')
    try {
      if (action === 'approve') await approvePayment(selected.id)
      else await denyPayment(selected.id, reason)
      setRows((rs) => rs.filter((r) => r.id !== selected.id))
      toast.success(action === 'approve' ? 'Payment approved.' : 'Payment denied.')
      setSelected(null)
      setReason('')
    } catch (err) {
      toast.error(err.response?.data?.message || `${action} failed.`)
    }
  }

  return (
    <div className="space-y-8 font-inter">
      <div className="flex items-center gap-3">
        <FiCreditCard className="text-3xl text-[#0D27F7]" />
        <div>
          <h1 className="bg-gradient-to-b from-[#0D27F7] to-[#0E1BEF] bg-clip-text text-3xl font-semibold tracking-tight text-transparent md:text-4xl">
            Payment Verification
          </h1>
          <p className="mt-2 text-base font-medium text-gray-500 md:text-lg">
            Confirm GCash receipts and on-site payments.
          </p>
        </div>
      </div>

      <div className={`${card} overflow-hidden`}>
        <div className="grid grid-cols-6 border-b border-[#e2ebff] bg-white/60 px-6 py-4 text-sm font-semibold text-[#0D27F7]">
          <p>School ID</p>
          <p>Name</p>
          <p>Amount</p>
          <p>Method</p>
          <p>Type</p>
          <p>Actions</p>
        </div>

        {loading && (
          <p className="px-6 py-10 text-center text-sm text-gray-400">Loading…</p>
        )}
        {!loading && rows.length === 0 && (
          <p className="px-6 py-10 text-center text-sm text-gray-400">
            No payments awaiting verification.
          </p>
        )}

        {rows.map((r) => (
          <div
            key={r.id}
            className="grid grid-cols-6 items-center border-b border-[#e2ebff]/70 px-6 py-4 text-sm text-gray-600 last:border-b-0 hover:bg-blue-50/60"
          >
            <p>{r.user?.schoolId || '—'}</p>
            <p className="font-medium text-gray-700">
              {r.user ? `${r.user.firstName} ${r.user.lastName}` : r.userId}
            </p>
            <p>₱{r.amount}</p>
            <p>{r.method}</p>
            <p>{r.type}</p>
            <div className="flex gap-2">
              <button
                onClick={() => setSelected(r)}
                className="rounded-full bg-blue-100 p-2 text-[#0D27F7] hover:bg-blue-200"
              >
                <FiEye />
              </button>
            </div>
          </div>
        ))}
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
          <div className="w-full max-w-2xl rounded-[28px] border border-[#d6e2ff] bg-white p-8 shadow-2xl">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-[#0D27F7]">Verify Payment</h2>
              <button
                onClick={() => {
                  setSelected(null)
                  setReason('')
                }}
                className="text-gray-400 hover:text-red-500"
              >
                <FiX size={24} />
              </button>
            </div>

            <div className="mt-6 grid gap-3 md:grid-cols-2">
              <KV
                k="Student"
                v={selected.user ? `${selected.user.firstName} ${selected.user.lastName}` : selected.userId}
              />
              <KV k="School ID" v={selected.user?.schoolId || '—'} />
              <KV k="Amount" v={`₱${selected.amount}`} />
              <KV k="Method" v={selected.method} />
              <KV k="Type" v={selected.type} />
              <KV k="Date" v={new Date(selected.createdAt).toLocaleString()} />
              <KV
                k="Receipt"
                v={
                  selected.receipt ? (
                    <a
                      href={`/uploads/${selected.receipt}`}
                      target="_blank"
                      rel="noreferrer"
                      className="underline"
                    >
                      View file
                    </a>
                  ) : (
                    '—'
                  )
                }
                className="md:col-span-2"
              />
            </div>

            <textarea
              rows="3"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Denial reason (required if denying)"
              className="mt-4 w-full resize-none rounded-[12px] border border-[#dbe7ff] bg-white px-4 py-3 text-sm outline-none focus:ring-4 focus:ring-[#0D27F7]/20"
            />

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => decide('deny')}
                className="rounded-full bg-red-600 px-6 py-3 text-sm font-semibold text-white hover:bg-red-700"
              >
                <FiX className="inline" /> Deny
              </button>
              <button
                onClick={() => decide('approve')}
                className="rounded-full bg-green-600 px-6 py-3 text-sm font-semibold text-white hover:bg-green-700"
              >
                <FiCheck className="inline" /> Approve
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function KV({ k, v, className = '' }) {
  return (
    <div className={`rounded-2xl border border-[#e2ebff] bg-[#f8fbff] p-4 ${className}`}>
      <p className="text-sm text-gray-500">{k}</p>
      <p className="font-semibold text-[#0D27F7]">{v}</p>
    </div>
  )
}
