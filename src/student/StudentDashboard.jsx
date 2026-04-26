import {
  FiCheckCircle,
  FiClock,
  FiZap,
  FiBell,
  FiCreditCard,
  FiArrowRight,
} from "react-icons/fi";

function StudentDashboard() {
  const progress = 37;

  const clearanceItems = [
    { office: "Library", signatory: "Maria Santos", status: "Approved" },
    { office: "Student Council", signatory: "Carlo Reyes", status: "Approved" },
    { office: "Department Society", signatory: "Ana Cruz", status: "Pay Now" },
    { office: "Publication", signatory: "Liza Gomez", status: "Pending" },
    { office: "Academic Adviser", signatory: "Mr. Bautista", status: "Pending" },
  ];

  const badgeClass = (status) => {
    if (status === "Approved") return "bg-green-100 text-green-700";
    if (status === "Pay Now") return "bg-red-100 text-red-600";
    return "bg-yellow-100 text-yellow-700";
  };

  const glassCard =
    "rounded-[28px] border border-[#d6e2ff] bg-white/70 shadow-[0_4px_20px_rgba(13,39,247,0.06)] ring-1 ring-white/80 backdrop-blur-xl";

  return (
    <div className="space-y-6 font-inter">
      <div className={`${glassCard} overflow-hidden p-6 md:p-8`}>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#0D27F7]/60">
              Student Dashboard
            </p>
            <h1 className="mt-3 bg-gradient-to-b from-[#0D27F7] to-[#0E1BEF] bg-clip-text text-3xl font-semibold tracking-tight text-transparent md:text-4xl">
              Welcome back, Jonaidah!
            </h1>
            <p className="mt-2 max-w-2xl text-gray-500">
              AY 2025–2026 • Second Semester Enrollment Clearance
            </p>
          </div>

          <div className="rounded-2xl border border-[#e2ebff] bg-white/60 px-5 py-4 text-right">
            <p className="text-xs font-medium text-gray-500">Current Status</p>
            <p className="mt-1 text-2xl font-semibold text-[#0D27F7]">Active</p>
          </div>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        <StatCard icon={<FiCheckCircle />} label="Approved" value="2" />
        <StatCard icon={<FiClock />} label="Pending" value="6" />
        <StatCard icon={<FiZap />} label="Progress" value={`${progress}%`} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
        <div className={`${glassCard} p-6`}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-[#0D27F7]">
                Clearance Progress
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Parallel review from all required offices.
              </p>
            </div>

            <button className="rounded-full border border-[#e2ebff] bg-white/60 px-4 py-2 text-sm font-medium text-[#0D27F7] transition hover:bg-blue-50">
              View Details
            </button>
          </div>

          <div className="mt-5 h-3 rounded-full border border-[#e2ebff] bg-white">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#0D27F7] to-[#0E1BEF]"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="mt-6 space-y-3">
            {clearanceItems.map((item) => (
              <div
                key={item.office}
                className="flex items-center justify-between rounded-2xl border border-[#e2ebff] bg-white/60 p-4 transition hover:bg-blue-50"
              >
                <div>
                  <p className="font-medium text-gray-700">{item.office}</p>
                  <p className="text-sm text-gray-500">{item.signatory}</p>
                </div>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${badgeClass(
                    item.status
                  )}`}
                >
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[28px] bg-gradient-to-b from-[#0D27F7] to-[#0E1BEF] p-6 text-white shadow-[0_8px_30px_rgba(13,39,247,0.22)]">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white/70">
              Next Action
            </p>
            <h2 className="mt-3 text-2xl font-semibold">
              Pay Department Society
            </h2>
            <p className="mt-2 text-sm text-white/75">
              Required payment: ₱100
            </p>

            <button className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#0D27F7] transition hover:bg-blue-50 active:scale-[0.98]">
              Pay Now <FiArrowRight />
            </button>
          </div>

          <div className={`${glassCard} p-6`}>
            <div className="flex items-center gap-2">
              <FiBell className="text-[#0D27F7]" />
              <h2 className="text-xl font-semibold text-[#0D27F7]">
                Notifications
              </h2>
            </div>

            <div className="mt-5 space-y-3">
              <Notice text="Library clearance approved" time="2 hours ago" />
              <Notice text="Payment required for Department Society" time="Today" />
              <Notice text="Publication is still pending review" time="Yesterday" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value }) {
  return (
    <div className="rounded-[28px] border border-[#d6e2ff] bg-white/70 p-6 shadow-[0_4px_20px_rgba(13,39,247,0.06)] ring-1 ring-white/80 backdrop-blur-xl transition-all duration-200 hover:-translate-y-[2px] hover:border-[#c3d4ff]">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{label}</p>
          <h2 className="mt-2 text-3xl font-semibold text-[#0D27F7]">
            {value}
          </h2>
        </div>

        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#e2ebff] bg-white/60 text-2xl text-[#0D27F7]">
          {icon}
        </div>
      </div>
    </div>
  );
}

function Notice({ text, time }) {
  return (
    <div className="flex gap-3 rounded-2xl border border-[#e2ebff] bg-white/60 p-4 transition hover:bg-blue-50">
      <FiCreditCard className="mt-0.5 text-[#0D27F7]" />
      <div>
        <p className="text-sm font-medium text-gray-700">{text}</p>
        <p className="text-xs text-gray-500">{time}</p>
      </div>
    </div>
  );
}

export default StudentDashboard;