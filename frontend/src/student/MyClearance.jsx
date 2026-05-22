<<<<<<< HEAD
import { useState } from "react";
import { FiPrinter } from "react-icons/fi";
import PaymentModal from "../components/PaymentModal";

function MyClearance() {
  const [selectedPayment, setSelectedPayment] = useState(null);

  const clearanceData = [
    { id: 1, office: "Library", signatory: "Maria Santos", requirement: "Library Clearance", status: "Approved", date: "2025-01-10" },
    { id: 2, office: "Student Council", signatory: "Maria Santos", requirement: "SC Dues", status: "Approved", date: "2025-01-10" },
    { id: 3, office: "Department Society", signatory: "Maria Santos", requirement: "Society Fee", status: "Pay Now", date: "-", amount: 100 },
    { id: 4, office: "Publication", signatory: "Maria Santos", requirement: "Publication Fee", status: "Pending", date: "-" },
    { id: 5, office: "Academic Adviser", signatory: "Maria Santos", requirement: "Adviser Approval", status: "Pending", date: "-" },
    { id: 6, office: "Chairperson", signatory: "Maria Santos", requirement: "Chairperson Approval", status: "Pending", date: "-" },
    { id: 7, office: "Dean", signatory: "Maria Santos", requirement: "Dean Approval", status: "Pending", date: "-" },
    { id: 8, office: "Enrolling Officer", signatory: "Maria Santos", requirement: "Enrollment Validation", status: "Pending", date: "-" },
  ];

  const badgeClass = (status) => {
    if (status === "Approved") return "bg-green-100 text-green-700";
    if (status === "Pay Now") return "bg-red-100 text-red-600";
    return "bg-yellow-100 text-yellow-700";
  };

=======
import { useState, useEffect } from "react";
import { FiPrinter, FiDownload, FiSend, FiLoader } from "react-icons/fi";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import {
  getMyProgress,
  submitClearanceRequest,
  downloadClearancePdf,
} from "../api/student";

const STATUS_LABEL = {
  pending: "Pending",
  approved: "Approved",
  denied: "Denied",
};

function MyClearance() {
  const { user } = useAuth();
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const refresh = async () => {
    try {
      const res = await getMyProgress();
      setProgress(res.data.progress);
    } catch (err) {
      if (err.response?.status === 404) {
        setProgress(null);
      } else {
        toast.error("Could not load clearance progress");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await submitClearanceRequest();
      toast.success("Clearance request submitted");
      await refresh();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not submit");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDownload = async () => {
    if (!progress?.request_id) return;
    setDownloading(true);
    try {
      await downloadClearancePdf(progress.request_id, progress.reference_no);
      toast.success("Clearance PDF downloaded");
    } catch (err) {
      const data = err.response?.data;
      // Blob error responses need decoding
      let message = data?.message || "Could not download PDF";
      if (data instanceof Blob) {
        try {
          const text = await data.text();
          message = JSON.parse(text).message || message;
        } catch { /* keep default */ }
      }
      toast.error(message);
    } finally {
      setDownloading(false);
    }
  };

  const badgeClass = (status) => {
    if (status === "approved") return "bg-green-100 text-green-700";
    if (status === "denied") return "bg-red-100 text-red-600";
    return "bg-yellow-100 text-yellow-700";
  };

  const allApproved =
    progress &&
    progress.approved_count === progress.total_stages &&
    progress.total_stages > 0;

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center font-inter text-gray-500">
        <FiLoader className="mr-2 animate-spin" /> Loading clearance…
      </div>
    );
  }

  if (!progress) {
    return (
      <div className="space-y-4 font-inter">
        <h1 className="bg-gradient-to-b from-[#0D27F7] to-[#0E1BEF] bg-clip-text text-3xl font-semibold tracking-tight text-transparent md:text-4xl">
          My Clearance
        </h1>
        <div className="rounded-[24px] border border-[#d6e2ff] bg-white/70 p-8 text-center shadow-[0_4px_20px_rgba(13,39,247,0.06)]">
          <p className="text-gray-600">You don&apos;t have an active clearance request yet.</p>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-gradient-to-b from-[#0D27F7] to-[#0E1BEF] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-95 active:scale-[0.98] disabled:opacity-60"
          >
            {submitting ? <FiLoader className="animate-spin" /> : <FiSend />}
            {submitting ? "Submitting…" : "Submit Clearance Request"}
          </button>
        </div>
      </div>
    );
  }

>>>>>>> d28bd3b538eb5eb7f22a9b7749abab309e37038e
  return (
    <div className="space-y-4 font-inter">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="bg-gradient-to-b from-[#0D27F7] to-[#0E1BEF] bg-clip-text text-3xl font-semibold tracking-tight text-transparent md:text-4xl">
            My Clearance
          </h1>
          <p className="mt-1 text-sm font-medium text-gray-500 md:text-base">
<<<<<<< HEAD
            Track your clearance status from all required offices.
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 rounded-full bg-gradient-to-b from-[#0D27F7] to-[#0E1BEF] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-95 active:scale-[0.98] print:hidden"
        >
          <FiPrinter />
          Print
        </button>
=======
            {progress.reference_no} • AY {progress.academic_year}
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 rounded-full border border-[#e2ebff] bg-white px-4 py-2 text-sm font-semibold text-[#0D27F7] transition hover:bg-blue-50 print:hidden"
          >
            <FiPrinter />
            Print
          </button>

          <button
            onClick={handleDownload}
            disabled={!allApproved || downloading}
            title={!allApproved ? "Available after all stages are approved" : "Download official PDF"}
            className="flex items-center gap-2 rounded-full bg-gradient-to-b from-[#0D27F7] to-[#0E1BEF] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-95 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 print:hidden"
          >
            {downloading ? <FiLoader className="animate-spin" /> : <FiDownload />}
            {downloading ? "Downloading…" : "Download PDF"}
          </button>
        </div>
>>>>>>> d28bd3b538eb5eb7f22a9b7749abab309e37038e
      </div>

      <div className="rounded-[24px] border border-[#d6e2ff] bg-white/70 p-4 shadow-[0_4px_20px_rgba(13,39,247,0.06)] ring-1 ring-white/80 backdrop-blur-xl">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-[#0D27F7]">
<<<<<<< HEAD
              Jonaidah Caris
            </h2>
            <p className="mt-1 text-xs text-gray-500 md:text-sm">
              ID: STU-2025-001 • BSIT • 3rd Year • juan@univ.edu
            </p>
          </div>

          <span className="w-fit rounded-full bg-green-100 px-4 py-1.5 text-xs font-semibold text-green-700">
            Active
          </span>
=======
              {user ? `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.email : "Student"}
            </h2>
            <p className="mt-1 text-xs text-gray-500 md:text-sm">
              {user?.schoolId ? `ID: ${user.schoolId} • ` : ""}
              {user?.course || ""}
              {user?.email ? ` • ${user.email}` : ""}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-full bg-blue-100 px-4 py-1.5 text-xs font-semibold text-[#0D27F7]">
              {progress.approved_count}/{progress.total_stages} approved
            </div>
            <span className="rounded-full bg-green-100 px-4 py-1.5 text-xs font-semibold text-green-700 capitalize">
              {progress.status}
            </span>
          </div>
        </div>

        <div className="mt-4 h-2 overflow-hidden rounded-full bg-blue-50">
          <div
            className="h-full bg-gradient-to-r from-[#0D27F7] to-[#0E1BEF] transition-all"
            style={{
              width: `${(progress.approved_count / progress.total_stages) * 100}%`,
            }}
          />
>>>>>>> d28bd3b538eb5eb7f22a9b7749abab309e37038e
        </div>
      </div>

      <div className="overflow-x-auto rounded-[24px] border border-[#d6e2ff] bg-white/70 p-4 shadow-[0_4px_20px_rgba(13,39,247,0.06)] ring-1 ring-white/80 backdrop-blur-xl">
<<<<<<< HEAD
        <table className="w-full min-w-[900px] text-left">
          <thead>
            <tr className="border-b border-[#e2ebff] text-xs font-semibold text-gray-500">
              <th className="px-3 py-3">NO.</th>
              <th className="px-3 py-3">OFFICE</th>
              <th className="px-3 py-3">SIGNATORY</th>
              <th className="px-3 py-3">REQUIREMENT</th>
              <th className="px-3 py-3">STATUS</th>
              <th className="px-3 py-3">DATE</th>
              <th className="px-3 py-3 print:hidden">ACTION</th>
=======
        <table className="w-full min-w-[800px] text-left">
          <thead>
            <tr className="border-b border-[#e2ebff] text-xs font-semibold text-gray-500">
              <th className="px-3 py-3">NO.</th>
              <th className="px-3 py-3">STAGE</th>
              <th className="px-3 py-3">APPROVER</th>
              <th className="px-3 py-3">STATUS</th>
              <th className="px-3 py-3">DECIDED</th>
              <th className="px-3 py-3">NOTE</th>
>>>>>>> d28bd3b538eb5eb7f22a9b7749abab309e37038e
            </tr>
          </thead>

          <tbody>
<<<<<<< HEAD
            {clearanceData.map((item) => (
              <tr
                key={item.id}
                className="border-b border-[#eef3ff] bg-white/60 transition hover:bg-blue-50"
              >
                <td className="px-3 py-3 text-sm text-gray-600">{item.id}</td>
                <td className="px-3 py-3 text-sm font-medium text-gray-700">
                  {item.office}
                </td>
                <td className="px-3 py-3 text-sm text-gray-600">{item.signatory}</td>
                <td className="px-3 py-3 text-sm text-gray-600">{item.requirement}</td>
                <td className="px-3 py-3">
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${badgeClass(item.status)}`}>
                    {item.status}
                  </span>
                </td>
                <td className="px-3 py-3 text-sm text-gray-600">{item.date}</td>
                <td className="px-3 py-3 print:hidden">
                  {item.status === "Pay Now" ? (
                    <button
                      onClick={() => setSelectedPayment(item)}
                      className="rounded-full bg-gradient-to-b from-[#0D27F7] to-[#0E1BEF] px-4 py-2 text-xs font-semibold text-white transition hover:opacity-95 active:scale-[0.98]"
                    >
                      Pay Now
                    </button>
                  ) : (
                    <button className="rounded-full border border-[#e2ebff] bg-white/60 px-4 py-2 text-xs font-semibold text-gray-500">
                      View
                    </button>
                  )}
=======
            {progress.stages.map((stage, idx) => (
              <tr
                key={stage.role}
                className="border-b border-[#eef3ff] bg-white/60 transition hover:bg-blue-50"
              >
                <td className="px-3 py-3 text-sm text-gray-600">{idx + 1}</td>
                <td className="px-3 py-3 text-sm font-medium text-gray-700">
                  {stage.label}
                </td>
                <td className="px-3 py-3 text-sm text-gray-600">
                  {stage.approver || "—"}
                </td>
                <td className="px-3 py-3">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${badgeClass(stage.status)}`}
                  >
                    {STATUS_LABEL[stage.status] || stage.status}
                  </span>
                </td>
                <td className="px-3 py-3 text-sm text-gray-600">
                  {stage.decided_at
                    ? new Date(stage.decided_at).toLocaleDateString()
                    : "—"}
                </td>
                <td className="px-3 py-3 text-sm text-gray-500">
                  {stage.reason || "—"}
>>>>>>> d28bd3b538eb5eb7f22a9b7749abab309e37038e
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

<<<<<<< HEAD
      <PaymentModal
        payment={selectedPayment}
        onClose={() => setSelectedPayment(null)}
      />
=======
      {!allApproved && (
        <p className="text-center text-xs text-gray-500">
          The official PDF unlocks once all {progress.total_stages} stages are approved.
        </p>
      )}
>>>>>>> d28bd3b538eb5eb7f22a9b7749abab309e37038e
    </div>
  );
}

<<<<<<< HEAD
export default MyClearance;
=======
export default MyClearance;
>>>>>>> d28bd3b538eb5eb7f22a9b7749abab309e37038e
