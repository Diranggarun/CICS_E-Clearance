import { useEffect, useState } from 'react'
import { FiDownload, FiFileText, FiFilter } from 'react-icons/fi'
import toast from 'react-hot-toast'
import { clearanceReport, reportDownloadUrl } from '../api/staff'

const card =
  'rounded-[28px] border border-[#d6e2ff] bg-white/70 shadow-[0_4px_20px_rgba(13,39,247,0.06)] ring-1 ring-white/80 backdrop-blur-xl'

export default function Reports() {
  const [statusFilter, setStatusFilter] = useState('All')
  const [stageFilter, setStageFilter] = useState('All')
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)

  const params = () => {
    const p = {}
    if (statusFilter !== 'All') p.status = statusFilter.toLowerCase()
    if (stageFilter !== 'All') p.stage = stageFilter
    return p
  }

  const load = async () => {
    setLoading(true)
    try {
      const { data } = await clearanceReport(params())
      setRows(data.rows || [])
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load report.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter, stageFilter])

  const downloadFile = (format) => {
    const url = reportDownloadUrl(format, params())
    // Tokenized via cookie or via direct nav — for Bearer JWT we open in same tab
    // with a temporary anchor that pulls the token. Simpler: fetch + blob.
    const token = localStorage.getItem('access_token')
    fetch(url, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => {
        if (!r.ok) throw new Error('Download failed')
        return r.blob()
      })
      .then((blob) => {
        const a = document.createElement('a')
        a.href = URL.createObjectURL(blob)
        a.download = `clearance-report.${format}`
        a.click()
        URL.revokeObjectURL(a.href)
      })
      .catch(() => toast.error('Download failed.'))
  }

  return (
    <div className="space-y-8 font-inter">
      <div className="flex items-center gap-3">
        <FiFileText className="text-3xl text-[#0D27F7]" />
        <div>
          <h1 className="bg-gradient-to-b from-[#0D27F7] to-[#0E1BEF] bg-clip-text text-3xl font-semibold tracking-tight text-transparent md:text-4xl">
            Clearance Reports
          </h1>
          <p className="mt-2 text-base font-medium text-gray-500 md:text-lg">
            Filter and export clearance status across the college.
          </p>
        </div>
      </div>

      <div className={`${card} p-6 flex flex-wrap items-center gap-3`}>
        <FiFilter className="text-[#0D27F7]" />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-full border border-[#dbe7ff] bg-white px-4 py-2 text-sm outline-none focus:ring-4 focus:ring-[#0D27F7]/20"
        >
          {['All', 'pending', 'completed', 'denied'].map((s) => (
            <option key={s}>{s === 'All' ? s : s}</option>
          ))}
        </select>
        <select
          value={stageFilter}
          onChange={(e) => setStageFilter(e.target.value)}
          className="rounded-full border border-[#dbe7ff] bg-white px-4 py-2 text-sm outline-none focus:ring-4 focus:ring-[#0D27F7]/20"
        >
<<<<<<< HEAD
          {['All', 'bytes_officer', 'librarian', 'faculty_adviser', 'chairperson', 'dean'].map(
            (s) => (
              <option key={s}>{s}</option>
            ),
          )}
=======
          {[
            'All',
            'admin',
            'cursor_org',
            'department_org',
            'bytes_officer',
            'librarian',
            'faculty_adviser',
            'chairperson',
            'dean',
            'enrolling_faculty',
          ].map((s) => (
            <option key={s}>{s}</option>
          ))}
>>>>>>> d28bd3b538eb5eb7f22a9b7749abab309e37038e
        </select>

        <div className="ml-auto flex gap-2">
          <button
            onClick={() => downloadFile('pdf')}
            className="rounded-full bg-[#0D27F7] px-5 py-2 text-sm font-semibold text-white hover:bg-[#0a1fcc] flex items-center gap-2"
          >
            <FiDownload /> Export PDF
          </button>
          <button
            onClick={() => downloadFile('csv')}
            className="rounded-full bg-green-600 px-5 py-2 text-sm font-semibold text-white hover:bg-green-700 flex items-center gap-2"
          >
            <FiDownload /> Export CSV
          </button>
        </div>
      </div>

      <div className={`${card} overflow-hidden`}>
        <div className="grid grid-cols-6 border-b border-[#e2ebff] bg-white/60 px-6 py-4 text-sm font-semibold text-[#0D27F7]">
          <p>Ref No</p>
          <p>School ID</p>
          <p>Name</p>
          <p>Course</p>
          <p>Status</p>
          <p>Current Stage</p>
        </div>

        {loading && <p className="px-6 py-10 text-center text-sm text-gray-400">Loading…</p>}
        {!loading && rows.length === 0 && (
          <p className="px-6 py-10 text-center text-sm text-gray-400">
            No rows match the filters.
          </p>
        )}

        {rows.map((r) => (
          <div
            key={r.id}
            className="grid grid-cols-6 items-center border-b border-[#e2ebff]/70 px-6 py-4 text-sm text-gray-600 last:border-b-0 hover:bg-blue-50/60"
          >
            <p>{r.reference_no}</p>
            <p>{r.school_id}</p>
            <p className="font-medium text-gray-700">{r.name}</p>
            <p>{r.course}</p>
            <p>
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  r.status === 'completed'
                    ? 'bg-green-100 text-green-700'
                    : r.status === 'denied'
                    ? 'bg-red-100 text-red-700'
                    : 'bg-yellow-100 text-yellow-700'
                }`}
              >
                {r.status}
              </span>
            </p>
            <p>{r.current_stage_label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
