import { FiXCircle } from "react-icons/fi";

function OfficerDenied() {
  const denied = [
    { id: "2021-0006", name: "Mark Villanueva", course: "BSIT 3A", reason: "Incomplete payment proof" },
    { id: "2021-0007", name: "Ella Cruz", course: "BSIS 4A", reason: "Missing requirement" },
  ];

  const appleCard =
    "rounded-[28px] border border-[#d6e2ff] bg-white/70 shadow-[0_4px_20px_rgba(13,39,247,0.06)] ring-1 ring-white/80 backdrop-blur-xl";

  return (
    <div className="space-y-8 font-inter">
      <div>
        <h1 className="bg-gradient-to-b from-[#0D27F7] to-[#0E1BEF] bg-clip-text text-3xl font-semibold tracking-tight text-transparent md:text-4xl">
          Denied Clearances
        </h1>
        <p className="mt-2 text-base font-medium text-gray-500 md:text-lg">
          Students whose clearance requests were denied.
        </p>
      </div>

      <div className={`${appleCard} overflow-hidden`}>
        <div className="grid grid-cols-5 border-b border-[#e2ebff] bg-white/60 px-6 py-4 text-sm font-semibold text-[#0D27F7]">
          <p>Student ID</p>
          <p>Name</p>
          <p>Course</p>
          <p>Reason</p>
          <p>Status</p>
        </div>

        {denied.map((student) => (
          <div
            key={student.id}
            className="grid grid-cols-5 items-center border-b border-[#e2ebff]/70 px-6 py-4 text-sm text-gray-600 last:border-b-0 hover:bg-blue-50/60"
          >
            <p>{student.id}</p>
            <p className="font-medium text-gray-700">{student.name}</p>
            <p>{student.course}</p>
            <p>{student.reason}</p>
            <span className="flex w-fit items-center gap-1 rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-600">
              <FiXCircle />
              Denied
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default OfficerDenied;