import { useEffect, useMemo, useState } from "react";
import { FiSearch, FiLoader, FiDownload } from "react-icons/fi";
import toast from "react-hot-toast";
import { clearanceReport, reportDownloadUrl } from "../api/staff";

const STAGES = [
  { key: "admin", label: "ADMIN" },
  { key: "cursor_org", label: "CURSOR" },
  { key: "department_org", label: "DEPT" },
  { key: "bytes_officer", label: "BYTES" },
  { key: "librarian", label: "LIBRARY" },
  { key: "faculty_adviser", label: "ADVISER" },
  { key: "chairperson", label: "CHAIR" },
  { key: "dean", label: "DEAN" },
  { key: "enrolling_faculty", label: "ENROLL" },
];

const STATUS_LABEL = {
  completed: "Cleared",
  pending: "Pending",
  denied: "Denied",
};

function AdminRecords() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    clearanceReport({})
      .then((res) => setRows(res.data.rows || []))
      .catch((err) =>
        toast.error(err.response?.data?.message || "Could not load records")
      )
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter((r) => {
      if (statusFilter !== "all" && r.status !== statusFilter) return false;
      if (!q) return true;
      return [r.name, r.school_id, r.reference_no, r.course]
        .filter(Boolean)
        .some((v) => v.toLowerCase().includes(q));
    });
  }, [rows, search, statusFilter]);

  const stageStatus = (row, stageKey) => {
    // The clearance report exposes the "current pending stage" — anything before it
    // is approved, anything after is still waiting. The summary status overrides this
    // when the request is completed or denied.
    if (row.status === "completed") return "approved";
    if (row.status === "denied") return "denied";
    const order = STAGES.findIndex((s) => s.key === row.current_stage);
    const idx = STAGES.findIndex((s) => s.key === stageKey);
    if (idx < order) return "approved";
    if (idx === order) return "pending";
    return "waiting";
  };

  const badge = (s) => {
    if (s === "approved") return "bg-[#B1FFB9] text-[#029422]";
    if (s === "denied") return "bg-red-100 text-red-700";
    if (s === "pending") return "bg-[#FFF0C2] text-[#FFB433]";
    return "bg-gray-100 text-gray-500";
  };

  const counts = useMemo(
    () => ({
      all: rows.length,
      completed: rows.filter((r) => r.status === "completed").length,
      pending: rows.filter((r) => r.status === "pending").length,
      denied: rows.filter((r) => r.status === "denied").length,
    }),
    [rows]
  );

  const handleExport = () => {
    const token = localStorage.getItem("access_token");
    fetch(reportDownloadUrl("csv"), {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => (r.ok ? r.blob() : Promise.reject()))
      .then((blob) => {
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "clearance-records.csv";
        a.click();
        URL.revokeObjectURL(a.href);
      })
      .catch(() => toast.error("Export failed"));
  };

  return (
    <div className="space-y-8 font-inter">
      <div>
        <h1 className="bg-gradient-to-b from-[#0D27F7] to-[#0E1BEF] bg-clip-text text-3xl font-semibold tracking-tight text-transparent md:text-4xl">
          Clearance Records
        </h1>
        <p className="mt-2 text-base font-medium text-gray-500 md:text-lg">
          View and manage all student clearance statuses.
        </p>
      </div>

      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="relative w-full xl:w-[360px]">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            placeholder="Search by name, ID, ref no, course…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-[53px] w-full rounded-[12px] border border-[#e2ebff] bg-white/60 px-12 text-sm text-gray-600 outline-none backdrop-blur transition focus:border-[#0D27F7] focus:ring-2 focus:ring-[#0D27F7]/15"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-[53px] rounded-[12px] border border-[#e2ebff] bg-white/60 px-4 text-sm text-gray-600 outline-none backdrop-blur"
        >
          <option value="all">All statuses</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
          <option value="denied">Denied</option>
        </select>
      </div>

      <div className="flex flex-wrap gap-3">
        {[
          { label: "All", value: counts.all },
          { label: "Completed", value: counts.completed },
          { label: "Pending", value: counts.pending },
          { label: "Denied", value: counts.denied },
        ].map((c) => (
          <span
            key={c.label}
            className="rounded-full border border-[#e2ebff] bg-white/60 px-4 py-2 text-sm text-gray-600 backdrop-blur"
          >
            {c.label} <span className="font-semibold text-[#0D27F7]">{c.value}</span>
          </span>
        ))}
      </div>

      <div className="overflow-x-auto rounded-[28px] border border-[#d6e2ff] bg-white/70 p-5 shadow-[0_4px_20px_rgba(13,39,247,0.06)] ring-1 ring-white/80 backdrop-blur-xl">
        {loading ? (
          <div className="flex items-center justify-center py-12 text-gray-500">
            <FiLoader className="mr-2 animate-spin" /> Loading records…
          </div>
        ) : filtered.length === 0 ? (
          <p className="py-12 text-center text-sm text-gray-500">
            No records match your filters.
          </p>
        ) : (
          <table className="w-full min-w-[1100px] text-left">
            <thead>
              <tr className="border-b border-[#e2ebff] text-xs font-semibold uppercase tracking-wide text-gray-500">
                <th className="px-4 py-4">Student</th>
                <th className="px-4 py-4">School ID</th>
                <th className="px-4 py-4">Course</th>
                {STAGES.map((s) => (
                  <th key={s.key} className="px-4 py-4">{s.label}</th>
                ))}
                <th className="px-4 py-4">Overall</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr
                  key={r.id}
                  className="border-b border-[#eef3ff] bg-white/60 transition hover:bg-blue-50"
                >
                  <td className="px-4 py-4 font-medium text-gray-700">{r.name}</td>
                  <td className="px-4 py-4 text-gray-600">{r.school_id}</td>
                  <td className="px-4 py-4 text-gray-600">{r.course || "—"}</td>
                  {STAGES.map((s) => {
                    const st = stageStatus(r, s.key);
                    return (
                      <td key={s.key} className="px-4 py-4">
                        <span
                          className={`whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold ${badge(st)}`}
                        >
                          {st === "waiting" ? "—" : STATUS_LABEL[st] || st}
                        </span>
                      </td>
                    );
                  })}
                  <td className="px-4 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        r.status === "completed"
                          ? "bg-green-100 text-green-700"
                          : r.status === "denied"
                          ? "bg-red-100 text-red-600"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {r.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleExport}
          className="flex items-center gap-2 rounded-full bg-gradient-to-b from-[#0D27F7] to-[#0E1BEF] px-8 py-3 text-sm font-semibold text-white shadow-[0_2px_10px_rgba(13,39,247,0.2)] transition hover:opacity-95 hover:shadow-[0_6px_20px_rgba(13,39,247,0.25)] active:scale-[0.98]"
        >
          <FiDownload /> Export CSV
        </button>
      </div>
    </div>
  );
}

export default AdminRecords;
