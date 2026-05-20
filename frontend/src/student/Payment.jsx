import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FiLoader, FiUpload, FiCheckCircle, FiAlertCircle } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import {
  getMyFines,
  listFees,
  listMyPayments,
  submitPayment,
  uploadReceipt,
} from "../api/student";

// Org-fee stages a fee can belong to (9-stage workflow).
const ORG_LABELS = {
  cursor_org: "Cursor",
  department_org: "Department",
  bytes_officer: "BYTES",
};

function StatusBadge({ status }) {
  const styles = {
    paid: "bg-green-100 text-green-700",
    approved: "bg-green-100 text-green-700",
    unpaid: "bg-red-100 text-red-600",
    pending: "bg-yellow-100 text-yellow-700",
    rejected: "bg-red-100 text-red-600",
  };
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${styles[status] || "bg-gray-100 text-gray-600"}`}>
      {status}
    </span>
  );
}

export default function Payment() {
  const { user } = useAuth();
  const [fines, setFines] = useState([]);
  const [fees, setFees] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selected, setSelected] = useState(null); // { type, amount, fineId?, label }
  const [method, setMethod] = useState("gcash");
  const [file, setFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const refresh = useCallback(async () => {
    if (!user?.id) return;
    try {
      const [finesRes, feesRes, paysRes] = await Promise.all([
        getMyFines(user.id).catch(() => ({ data: [] })),
        listFees().catch(() => ({ data: [] })),
        listMyPayments().catch(() => ({ data: [] })),
      ]);
      setFines(finesRes.data);
      setFees(feesRes.data);
      setPayments(paysRes.data);
    } catch {
      toast.error("Could not load payment data");
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selected) return;
    if (method === "gcash" && !file) {
      toast.error("Please upload a GCash receipt");
      return;
    }
    setSubmitting(true);
    try {
      let receipt = null;
      if (method === "gcash" && file) {
        const uploaded = await uploadReceipt(file);
        receipt = uploaded.file;
      }
      await submitPayment({
        type: selected.type,
        amount: selected.amount,
        method,
        receipt,
        fineId: selected.fineId,
        orgRole: selected.orgRole,
      });
      toast.success("Payment submitted — waiting for verification");
      setSelected(null);
      setFile(null);
      setMethod("gcash");
      await refresh();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not submit payment");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center font-inter text-gray-500">
        <FiLoader className="mr-2 animate-spin" /> Loading…
      </div>
    );
  }

  const unpaidFines = fines.filter((f) => f.status === "unpaid");

  return (
    <div className="space-y-6 font-inter">
      <div>
        <h1 className="bg-gradient-to-b from-[#0D27F7] to-[#0E1BEF] bg-clip-text text-3xl font-semibold tracking-tight text-transparent md:text-4xl">
          Payment
        </h1>
        <p className="mt-1 text-sm font-medium text-gray-500">
          Pay outstanding fines and fees. GCash receipts are verified by the BYTES Officer.
        </p>
      </div>

      {/* Fines */}
      <section className="rounded-[24px] border border-[#d6e2ff] bg-white/70 p-5 shadow-[0_4px_20px_rgba(13,39,247,0.06)]">
        <h2 className="mb-3 text-lg font-semibold text-[#0D27F7]">My Fines</h2>
        {fines.length === 0 ? (
          <p className="text-sm text-gray-500">No fines on record.</p>
        ) : (
          <ul className="space-y-2">
            {fines.map((fine) => (
              <li
                key={fine.id}
                className="flex flex-col gap-3 rounded-2xl border border-[#e2ebff] bg-white/60 p-4 md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <p className="font-medium text-gray-700">{fine.reason}</p>
                  <p className="text-sm text-gray-500">
                    ₱{Number(fine.amount).toFixed(2)} • Issued{" "}
                    {new Date(fine.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={fine.status} />
                  {fine.status === "unpaid" && (
                    <button
                      onClick={() =>
                        setSelected({
                          type: "fine",
                          amount: Number(fine.amount),
                          fineId: fine.id,
                          label: fine.reason,
                        })
                      }
                      className="rounded-full bg-gradient-to-b from-[#0D27F7] to-[#0E1BEF] px-4 py-2 text-xs font-semibold text-white transition hover:opacity-95"
                    >
                      Pay Now
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Fees */}
      <section className="rounded-[24px] border border-[#d6e2ff] bg-white/70 p-5 shadow-[0_4px_20px_rgba(13,39,247,0.06)]">
        <h2 className="mb-3 text-lg font-semibold text-[#0D27F7]">Fees Catalogue</h2>
        {fees.length === 0 ? (
          <p className="text-sm text-gray-500">No fees configured.</p>
        ) : (
          <ul className="grid gap-3 md:grid-cols-2">
            {fees.map((fee) => (
              <li
                key={fee.id}
                className="flex items-center justify-between rounded-2xl border border-[#e2ebff] bg-white/60 p-4"
              >
                <div>
                  <p className="font-medium text-gray-700">{fee.name}</p>
                  <p className="text-sm text-gray-500">
                    ₱{Number(fee.amount).toFixed(2)}
                    {fee.orgRole
                      ? ` • ${ORG_LABELS[fee.orgRole] || fee.orgRole} org fee`
                      : " • unassigned"}
                  </p>
                </div>
                <button
                  disabled={!fee.orgRole}
                  title={fee.orgRole ? undefined : "This fee is not linked to an organization yet."}
                  onClick={() =>
                    setSelected({
                      type: "fee",
                      amount: Number(fee.amount),
                      label: fee.name,
                      orgRole: fee.orgRole,
                    })
                  }
                  className="rounded-full border border-[#0D27F7] px-4 py-2 text-xs font-semibold text-[#0D27F7] transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Pay
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Payment history */}
      <section className="rounded-[24px] border border-[#d6e2ff] bg-white/70 p-5 shadow-[0_4px_20px_rgba(13,39,247,0.06)]">
        <h2 className="mb-3 text-lg font-semibold text-[#0D27F7]">Payment History</h2>
        {payments.length === 0 ? (
          <p className="text-sm text-gray-500">No payments submitted yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] text-left text-sm">
              <thead className="text-xs font-semibold text-gray-500">
                <tr className="border-b border-[#e2ebff]">
                  <th className="px-3 py-2">DATE</th>
                  <th className="px-3 py-2">TYPE</th>
                  <th className="px-3 py-2">METHOD</th>
                  <th className="px-3 py-2">AMOUNT</th>
                  <th className="px-3 py-2">STATUS</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => (
                  <tr key={p.id} className="border-b border-[#eef3ff]">
                    <td className="px-3 py-2 text-gray-600">
                      {new Date(p.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-3 py-2 capitalize text-gray-700">{p.type}</td>
                    <td className="px-3 py-2 capitalize text-gray-600">{p.method}</td>
                    <td className="px-3 py-2 text-gray-700">₱{Number(p.amount).toFixed(2)}</td>
                    <td className="px-3 py-2">
                      <StatusBadge status={p.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {unpaidFines.length === 0 && payments.some((p) => p.status === "approved") && (
        <div className="flex items-center gap-2 rounded-2xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
          <FiCheckCircle /> All fines cleared. BYTES Officer can now approve your clearance.
        </div>
      )}

      {/* Payment modal */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
          onClick={() => !submitting && setSelected(null)}
        >
          <form
            onClick={(e) => e.stopPropagation()}
            onSubmit={handleSubmit}
            className="w-full max-w-lg space-y-4 rounded-[28px] border border-[#d6e2ff] bg-white p-6 shadow-xl"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-semibold text-[#0D27F7]">Submit Payment</h3>
                <p className="text-sm text-gray-500">{selected.label}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="rounded-full border border-[#e2ebff] px-3 py-1 text-sm text-gray-500 hover:bg-blue-50"
              >
                ✕
              </button>
            </div>

            <div className="rounded-xl bg-blue-50 p-4 text-center">
              <p className="text-xs uppercase tracking-wide text-gray-500">Amount</p>
              <p className="text-3xl font-bold text-[#0D27F7]">₱{selected.amount.toFixed(2)}</p>
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500">
                Payment Method
              </label>
              <div className="grid grid-cols-2 gap-3">
                {["gcash", "onsite"].map((m) => (
                  <button
                    type="button"
                    key={m}
                    onClick={() => setMethod(m)}
                    className={`rounded-2xl border px-4 py-3 text-sm font-semibold capitalize transition ${
                      method === m
                        ? "border-[#0D27F7] bg-[#0D27F7] text-white"
                        : "border-[#e2ebff] bg-white text-gray-600 hover:border-[#0D27F7]"
                    }`}
                  >
                    {m === "gcash" ? "GCash" : "On-site"}
                  </button>
                ))}
              </div>
            </div>

            {method === "gcash" && (
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500">
                  GCash Receipt (image, max 5MB)
                </label>
                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-[#0D27F7]/40 bg-blue-50/40 px-4 py-3 text-sm text-gray-600 hover:bg-blue-50">
                  <FiUpload className="text-[#0D27F7]" />
                  <span className="truncate">
                    {file ? file.name : "Choose receipt image"}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                  />
                </label>
                {file && file.size > 5 * 1024 * 1024 && (
                  <p className="mt-1 flex items-center gap-1 text-xs text-red-600">
                    <FiAlertCircle /> File exceeds 5MB limit
                  </p>
                )}
              </div>
            )}

            {method === "onsite" && (
              <p className="rounded-xl bg-yellow-50 p-3 text-sm text-yellow-800">
                Visit the BYTES Office to pay in cash. The officer will mark this as paid on their end.
              </p>
            )}

            <button
              type="submit"
              disabled={submitting || (method === "gcash" && (!file || file.size > 5 * 1024 * 1024))}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-b from-[#0D27F7] to-[#0E1BEF] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-95 active:scale-[0.98] disabled:opacity-60"
            >
              {submitting && <FiLoader className="animate-spin" />}
              {submitting ? "Submitting…" : "Submit Payment"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
