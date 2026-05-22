<<<<<<< HEAD
=======
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
>>>>>>> d28bd3b538eb5eb7f22a9b7749abab309e37038e
import {
  FiCheckCircle,
  FiClock,
  FiZap,
<<<<<<< HEAD
  FiBell,
  FiCreditCard,
  FiArrowRight,
} from "react-icons/fi";

// ✅ ADDED: Import our real notification component
import Notifications from './Notifications';

function StudentDashboard() {
  const progress = 37;

  // ⚠️ NOTE: Since your current code uses hardcoded "Jonaidah", 
  // we will use a TEST USER ID here. Later replace this with real logged-in user ID
  const currentUserId = "test-user-123"; // 👈 CHANGE THIS TO REAL USER ID LATER

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
=======
  FiArrowRight,
  FiLoader,
} from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { getMyProgress, getMyFines } from "../api/student";
import Notifications from "./Notifications";

const STATUS_BADGE = (status) => {
  if (status === "approved") return "bg-green-100 text-green-700";
  if (status === "denied") return "bg-red-100 text-red-600";
  return "bg-yellow-100 text-yellow-700";
};

function StudentDashboard() {
  const { user } = useAuth();
  const [progress, setProgress] = useState(null);
  const [unpaidCount, setUnpaidCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    Promise.allSettled([getMyProgress(), getMyFines(user.id)])
      .then(([p, f]) => {
        if (p.status === "fulfilled") setProgress(p.value.data.progress);
        if (f.status === "fulfilled") {
          setUnpaidCount(
            f.value.data.filter((fine) => fine.status === "unpaid").length
          );
        }
      })
      .finally(() => setLoading(false));
  }, [user?.id]);
>>>>>>> d28bd3b538eb5eb7f22a9b7749abab309e37038e

  const glassCard =
    "rounded-[28px] border border-[#d6e2ff] bg-white/70 shadow-[0_4px_20px_rgba(13,39,247,0.06)] ring-1 ring-white/80 backdrop-blur-xl";

<<<<<<< HEAD
=======
  const approved = progress?.approved_count ?? 0;
  const total = progress?.total_stages ?? 5;
  const pending = Math.max(total - approved, 0);
  const pct = total ? Math.round((approved / total) * 100) : 0;

  const greetingName =
    user?.firstName ? user.firstName.toUpperCase() : user?.email || "Student";

>>>>>>> d28bd3b538eb5eb7f22a9b7749abab309e37038e
  return (
    <div className="space-y-6 font-inter">
      <div className={`${glassCard} overflow-hidden p-6 md:p-8`}>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#0D27F7]/60">
              Student Dashboard
            </p>
            <h1 className="mt-3 bg-gradient-to-b from-[#0D27F7] to-[#0E1BEF] bg-clip-text text-3xl font-semibold tracking-tight text-transparent md:text-4xl">
<<<<<<< HEAD
              Welcome back, PLANGUGN A WATA!
            </h1>
            <p className="mt-2 max-w-2xl text-gray-500">
              AY 2025–2026 • Second Semester Enrollment Clearance
=======
              Welcome back, {greetingName}!
            </h1>
            <p className="mt-2 max-w-2xl text-gray-500">
              {progress?.academic_year
                ? `AY ${progress.academic_year} • ${progress.reference_no}`
                : "Submit a clearance request from the My Clearance page to get started."}
>>>>>>> d28bd3b538eb5eb7f22a9b7749abab309e37038e
            </p>
          </div>

          <div className="rounded-2xl border border-[#e2ebff] bg-white/60 px-5 py-4 text-right">
            <p className="text-xs font-medium text-gray-500">Current Status</p>
<<<<<<< HEAD
            <p className="mt-1 text-2xl font-semibold text-[#0D27F7]">Active</p>
=======
            <p className="mt-1 text-2xl font-semibold capitalize text-[#0D27F7]">
              {progress?.status || "No Request"}
            </p>
>>>>>>> d28bd3b538eb5eb7f22a9b7749abab309e37038e
          </div>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
<<<<<<< HEAD
        <StatCard icon={<FiCheckCircle />} label="Approved" value="2" />
        <StatCard icon={<FiClock />} label="Pending" value="6" />
        <StatCard icon={<FiZap />} label="Progress" value={`${progress}%`} />
=======
        <StatCard icon={<FiCheckCircle />} label="Approved" value={approved} />
        <StatCard icon={<FiClock />} label="Pending" value={pending} />
        <StatCard icon={<FiZap />} label="Progress" value={`${pct}%`} />
>>>>>>> d28bd3b538eb5eb7f22a9b7749abab309e37038e
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
        <div className={`${glassCard} p-6`}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-[#0D27F7]">
                Clearance Progress
              </h2>
              <p className="mt-1 text-sm text-gray-500">
<<<<<<< HEAD
                Parallel review from all required offices.
              </p>
            </div>

            <button className="rounded-full border border-[#e2ebff] bg-white/60 px-4 py-2 text-sm font-medium text-[#0D27F7] transition hover:bg-blue-50">
              View Details
            </button>
=======
                Sequential review across all required offices.
              </p>
            </div>

            <Link
              to="/student/my-clearance"
              className="rounded-full border border-[#e2ebff] bg-white/60 px-4 py-2 text-sm font-medium text-[#0D27F7] transition hover:bg-blue-50"
            >
              View Details
            </Link>
>>>>>>> d28bd3b538eb5eb7f22a9b7749abab309e37038e
          </div>

          <div className="mt-5 h-3 rounded-full border border-[#e2ebff] bg-white">
            <div
<<<<<<< HEAD
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

          {/* ✅ REPLACED: Your old hardcoded notifications box → NOW USING REAL COMPONENT */}
          <Notifications userId={currentUserId} />
          
=======
              className="h-full rounded-full bg-gradient-to-r from-[#0D27F7] to-[#0E1BEF] transition-all"
              style={{ width: `${pct}%` }}
            />
          </div>

          {loading ? (
            <div className="mt-6 flex items-center gap-2 text-sm text-gray-500">
              <FiLoader className="animate-spin" /> Loading stages…
            </div>
          ) : progress?.stages ? (
            <div className="mt-6 space-y-3">
              {progress.stages.map((stage) => (
                <div
                  key={stage.role}
                  className="flex items-center justify-between rounded-2xl border border-[#e2ebff] bg-white/60 p-4 transition hover:bg-blue-50"
                >
                  <div>
                    <p className="font-medium text-gray-700">{stage.label}</p>
                    <p className="text-sm text-gray-500">
                      {stage.approver || "Awaiting approver"}
                    </p>
                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${STATUS_BADGE(stage.status)}`}
                  >
                    {stage.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-6 text-sm text-gray-500">
              No active clearance request. Head to{" "}
              <Link to="/student/my-clearance" className="font-semibold text-[#0D27F7] underline">
                My Clearance
              </Link>{" "}
              to submit one.
            </p>
          )}
        </div>

        <div className="space-y-6">
          {unpaidCount > 0 ? (
            <div className="rounded-[28px] bg-gradient-to-b from-[#0D27F7] to-[#0E1BEF] p-6 text-white shadow-[0_8px_30px_rgba(13,39,247,0.22)]">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white/70">
                Next Action
              </p>
              <h2 className="mt-3 text-2xl font-semibold">
                Settle Outstanding Fines
              </h2>
              <p className="mt-2 text-sm text-white/75">
                You have {unpaidCount} unpaid fine{unpaidCount === 1 ? "" : "s"} blocking BYTES clearance.
              </p>

              <Link
                to="/student/payment"
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#0D27F7] transition hover:bg-blue-50 active:scale-[0.98]"
              >
                Pay Now <FiArrowRight />
              </Link>
            </div>
          ) : (
            <div className="rounded-[28px] border border-green-200 bg-green-50/70 p-6 text-green-800">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-green-600/80">
                All Clear
              </p>
              <h2 className="mt-3 text-xl font-semibold">No outstanding fines</h2>
              <p className="mt-2 text-sm text-green-700/80">
                Your account has no payment blockers.
              </p>
            </div>
          )}

          <Notifications userId={user?.id} />
>>>>>>> d28bd3b538eb5eb7f22a9b7749abab309e37038e
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
<<<<<<< HEAD
          <h2 className="mt-2 text-3xl font-semibold text-[#0D27F7]">
            {value}
          </h2>
=======
          <h2 className="mt-2 text-3xl font-semibold text-[#0D27F7]">{value}</h2>
>>>>>>> d28bd3b538eb5eb7f22a9b7749abab309e37038e
        </div>

        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#e2ebff] bg-white/60 text-2xl text-[#0D27F7]">
          {icon}
        </div>
      </div>
    </div>
  );
}

<<<<<<< HEAD
// ❌ REMOVED: We don't need the Notice function anymore because <Notifications /> handles it
// function Notice({ text, time }) { ... }

export default StudentDashboard;
=======
export default StudentDashboard;
>>>>>>> d28bd3b538eb5eb7f22a9b7749abab309e37038e
