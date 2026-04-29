import { FiCheck, FiX, FiEye } from "react-icons/fi";

function OfficerRequests() {
  const requests = [
    { id: "2021-0001", name: "Maria Santos", course: "BSIT 4A", requirement: "Department Society Fee" },
    { id: "2021-0002", name: "Juan Dela Cruz", course: "BSCS 4B", requirement: "Clearance Review" },
    { id: "2021-0003", name: "Ana Reyes", course: "BSIS 3A", requirement: "Payment Verification" },
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
          Students awaiting clearance — review and take action.
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
                Pending
              </span>
            </p>
            <div className="flex gap-2">
              <button className="rounded-full bg-blue-100 p-2 text-[#0D27F7] hover:bg-blue-200">
                <FiEye />
              </button>
              <button className="rounded-full bg-green-100 p-2 text-green-700 hover:bg-green-200">
                <FiCheck />
              </button>
              <button className="rounded-full bg-red-100 p-2 text-red-600 hover:bg-red-200">
                <FiX />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default OfficerRequests;