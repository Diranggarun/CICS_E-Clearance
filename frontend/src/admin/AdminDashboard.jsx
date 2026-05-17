import { useEffect, useState } from "react";
import {
  FiUsers,
  FiFileText,
  FiCheckCircle,
  FiClock,
  FiCreditCard,
  FiAlertTriangle,
  FiUserPlus,
  FiLoader,
} from "react-icons/fi";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import { dashboardStats } from "../api/staff";

function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    dashboardStats()
      .then((res) => setData(res.data))
      .catch((err) =>
        setError(err.response?.data?.message || "Could not load dashboard stats")
      )
      .finally(() => setLoading(false));
  }, []);

  const appleCard =
    "rounded-[28px] border border-[#d6e2ff] bg-white/70 shadow-[0_4px_20px_rgba(13,39,247,0.06)] ring-1 ring-white/80 backdrop-blur-xl transition-all duration-200 hover:-translate-y-[2px] hover:border-[#c3d4ff] hover:shadow-[0_8px_30px_rgba(13,39,247,0.08)]";

  const t = data?.totals || {};
  const stats = [
    { title: "Total Students", value: t.students ?? "—", icon: <FiUsers /> },
    { title: "Pending Accounts", value: t.pending_accounts ?? "—", icon: <FiUserPlus /> },
    { title: "Active Requests", value: t.active_requests ?? "—", icon: <FiFileText /> },
    { title: "Completed", value: t.completed_requests ?? "—", icon: <FiCheckCircle /> },
    { title: "Denied", value: t.denied_requests ?? "—", icon: <FiClock /> },
    { title: "Pending Payments", value: t.pending_payments ?? "—", icon: <FiCreditCard /> },
    { title: "Unpaid Fines", value: t.unpaid_fines ?? "—", icon: <FiAlertTriangle /> },
  ];

  const chartData = (data?.stages || []).map((s) => ({
    stage: s.label.replace("Faculty Adviser", "Adviser"),
    approved: s.approved,
    pending: s.pending,
    denied: s.denied,
  }));

  return (
    <div className="space-y-8 font-inter">
      <div>
        <h1 className="bg-gradient-to-b from-[#0D27F7] to-[#0E1BEF] bg-clip-text text-3xl font-semibold tracking-tight text-transparent md:text-4xl">
          Dashboard
        </h1>
        <p className="mt-2 text-base font-medium text-gray-500 md:text-lg">
          Live overview of the CICS E-Clearance system.
        </p>
      </div>

      {loading && (
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <FiLoader className="animate-spin" /> Loading stats…
        </div>
      )}

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => (
          <div key={item.title} className={`${appleCard} p-6`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">{item.title}</p>
                <h2 className="mt-3 text-3xl font-semibold text-[#0D27F7]">
                  {item.value}
                </h2>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#e2ebff] bg-white/60 text-2xl text-[#0D27F7] shadow-sm backdrop-blur">
                {item.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className={`${appleCard} p-6`}>
        <h2 className="text-xl font-semibold text-[#0D27F7]">
          Stage Progress
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Live breakdown of stage decisions across all clearance requests.
        </p>

        <div className="mt-5 h-[320px]">
          {chartData.length === 0 ? (
            <div className="flex h-full items-center justify-center text-sm text-gray-400">
              No clearance data yet.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="stage" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="approved" stackId="a" fill="#029422" radius={[0, 0, 0, 0]} />
                <Bar dataKey="pending" stackId="a" fill="#FFB433" radius={[0, 0, 0, 0]} />
                <Bar dataKey="denied" stackId="a" fill="#DC2626" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
