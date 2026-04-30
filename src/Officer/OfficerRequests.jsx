import { useState } from "react";
import {
  FiCheck,
  FiX,
  FiEye,
  FiCreditCard,
  FiCalendar,
  FiFileText,
} from "react-icons/fi";

function OfficerRequests() {
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [denyReason, setDenyReason] = useState("");

  const requests = [
    {
      id: "2021-0001",
      name: "Maria Santos",
      course: "BSIT 4A",
      requirement: "Department Society Fee",
      status: "Pending",
      paymentAmount: 100,
      paymentMethod: "GCash",
      referenceNumber: "GC12345678",
      paymentDate: "April 30, 2026",
      proof: "Receipt Uploaded",
    },
    {
      id: "2021-0002",
      name: "Juan Dela Cruz",
      course: "BSCS 4B",
      requirement: "Student Council Fee",
      status: "Pending",
      paymentAmount: 150,
      paymentMethod: "Cash",
      referenceNumber: "CASH-2026-22",
      paymentDate: "April 29, 2026",
      proof: "Receipt Uploaded",
    },
    {
      id: "2021-0003",
      name: "Ana Reyes",
      course: "BSIS 3A",
      requirement: "Publication Fee",
      status: "Pending",
      paymentAmount: 120,
      paymentMethod: "QR Code",
      referenceNumber: "QR889977",
      paymentDate: "April 28, 2026",
      proof: "Receipt Uploaded",
    },
  ];

  const appleCard =
    "rounded-[28px] border border-[#d6e2ff] bg-white/70 shadow-[0_4px_20px_rgba(13,39,247,0.06)] ring-1 ring-white/80 backdrop-blur-xl";

  return (
    <div className="space-y-8 font-inter">
      <div>
        <h1 className="bg-gradient-to-b from-[#0D27F7] to-[#0E1BEF] bg-clip-text text-3xl font-semibold tracking-tight text-transparent md:text-4xl">
          Clearance Requests
        </h1>
        <p className="mt-2 text-base font-medium text-gray-500 md:text-lg">
          Review payments, requirements, and student submissions.
        </p>
      </div>

      <div className={`${appleCard} overflow-hidden`}>
        <div className="grid grid-cols-6 border-b border-[#e2ebff] bg-white/60 px-6 py-4 text-sm font-semibold text-[#0D27F7]">
          <p>Student ID</p>
          <p>Name</p>
          <p>Course</p>
          <p>Requirement</p>
          <p>Status</p>
          <p>Actions</p>
        </div>

        {requests.map((student) => (
          <div
            key={student.id}
            className="grid grid-cols-6 items-center border-b border-[#e2ebff]/70 px-6 py-4 text-sm text-gray-600 last:border-b-0 hover:bg-blue-50/60"
          >
            <p>{student.id}</p>
            <p className="font-medium text-gray-700">{student.name}</p>
            <p>{student.course}</p>
            <p>{student.requirement}</p>

            <p>
              <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">
                {student.status}
              </span>
            </p>

            <div className="flex gap-2">
              <button
                onClick={() => setSelectedStudent(student)}
                className="rounded-full bg-blue-100 p-2 text-[#0D27F7] hover:bg-blue-200"
              >
                <FiEye />
              </button>

              <button className="rounded-full bg-green-100 p-2 text-green-700 hover:bg-green-200">
                <FiCheck />
              </button>

              <button
                onClick={() => setSelectedStudent(student)}
                className="rounded-full bg-red-100 p-2 text-red-600 hover:bg-red-200"
              >
                <FiX />
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
          <div className="w-full max-w-2xl rounded-[28px] border border-[#d6e2ff] bg-white p-8 shadow-2xl">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-[#0D27F7]">
                Payment Verification
              </h2>

              <button
                onClick={() => {
                  setSelectedStudent(null);
                  setDenyReason("");
                }}
                className="text-gray-400 hover:text-red-500"
              >
                <FiX size={24} />
              </button>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-[#e2ebff] bg-[#f8fbff] p-4">
                <p className="text-sm text-gray-500">Student</p>
                <p className="font-semibold text-[#0D27F7]">
                  {selectedStudent.name}
                </p>
              </div>

              <div className="rounded-2xl border border-[#e2ebff] bg-[#f8fbff] p-4">
                <p className="text-sm text-gray-500">Requirement</p>
                <p className="font-semibold text-[#0D27F7]">
                  {selectedStudent.requirement}
                </p>
              </div>

              <div className="rounded-2xl border border-[#e2ebff] bg-[#f8fbff] p-4">
                <p className="flex items-center gap-2 text-sm text-gray-500">
                  <FiCreditCard />
                  Payment Method
                </p>
                <p className="font-semibold text-[#0D27F7]">
                  {selectedStudent.paymentMethod}
                </p>
              </div>

              <div className="rounded-2xl border border-[#e2ebff] bg-[#f8fbff] p-4">
                <p className="text-sm text-gray-500">Amount Paid</p>
                <p className="font-semibold text-[#0D27F7]">
                  ₱{selectedStudent.paymentAmount}
                </p>
              </div>

              <div className="rounded-2xl border border-[#e2ebff] bg-[#f8fbff] p-4">
                <p className="text-sm text-gray-500">Reference Number</p>
                <p className="font-semibold text-[#0D27F7]">
                  {selectedStudent.referenceNumber}
                </p>
              </div>

              <div className="rounded-2xl border border-[#e2ebff] bg-[#f8fbff] p-4">
                <p className="flex items-center gap-2 text-sm text-gray-500">
                  <FiCalendar />
                  Payment Date
                </p>
                <p className="font-semibold text-[#0D27F7]">
                  {selectedStudent.paymentDate}
                </p>
              </div>

              <div className="md:col-span-2 rounded-2xl border border-[#e2ebff] bg-[#f8fbff] p-4">
                <p className="flex items-center gap-2 text-sm text-gray-500">
                  <FiFileText />
                  Proof of Payment
                </p>
                <p className="font-semibold text-[#0D27F7]">
                  {selectedStudent.proof}
                </p>
              </div>
            </div>

            <div className="mt-6">
              <label className="text-sm font-medium text-gray-500">
                Denial Reason (if rejecting)
              </label>

              <textarea
                rows="3"
                value={denyReason}
                onChange={(e) => setDenyReason(e.target.value)}
                placeholder="State reason for denial..."
                className="mt-2 w-full resize-none rounded-[12px] border border-[#dbe7ff] bg-white px-4 py-3 text-sm outline-none focus:ring-4 focus:ring-[#0D27F7]/20"
              />
            </div>

            <div className="mt-8 flex justify-end gap-3">
              <button className="rounded-full bg-green-600 px-6 py-3 text-sm font-semibold text-white hover:bg-green-700">
                Approve Payment
              </button>

              <button className="rounded-full bg-red-600 px-6 py-3 text-sm font-semibold text-white hover:bg-red-700">
                Deny Payment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default OfficerRequests;