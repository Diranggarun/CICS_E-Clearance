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

  return (
    <div className="space-y-4 font-inter">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="bg-gradient-to-b from-[#0D27F7] to-[#0E1BEF] bg-clip-text text-3xl font-semibold tracking-tight text-transparent md:text-4xl">
            My Clearance
          </h1>
          <p className="mt-1 text-sm font-medium text-gray-500 md:text-base">
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
      </div>

      <div className="rounded-[24px] border border-[#d6e2ff] bg-white/70 p-4 shadow-[0_4px_20px_rgba(13,39,247,0.06)] ring-1 ring-white/80 backdrop-blur-xl">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-[#0D27F7]">
              Jonaidah Caris
            </h2>
            <p className="mt-1 text-xs text-gray-500 md:text-sm">
              ID: STU-2025-001 • BSIT • 3rd Year • juan@univ.edu
            </p>
          </div>

          <span className="w-fit rounded-full bg-green-100 px-4 py-1.5 text-xs font-semibold text-green-700">
            Active
          </span>
        </div>
      </div>

      <div className="overflow-x-auto rounded-[24px] border border-[#d6e2ff] bg-white/70 p-4 shadow-[0_4px_20px_rgba(13,39,247,0.06)] ring-1 ring-white/80 backdrop-blur-xl">
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
            </tr>
          </thead>

          <tbody>
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
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <PaymentModal
        payment={selectedPayment}
        onClose={() => setSelectedPayment(null)}
      />
    </div>
  );
}

export default MyClearance;