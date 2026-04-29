import { FiCheckCircle } from "react-icons/fi";

function OfficerApproved() {
  const approved = [
    { id: "2021-0004", name: "Liza Gomez", course: "BSIT 4B", date: "April 28, 2026" },
    { id: "2021-0005", name: "Carlo Reyes", course: "BSCS 4A", date: "April 29, 2026" },
  ];

  const appleCard =
    "rounded-[28px] border border-[#d6e2ff] bg-white/70 shadow-[0_4px_20px_rgba(13,39,247,0.06)] ring-1 ring-white/80 backdrop-blur-xl";

  return (
    <div className="space-y-8 font-inter">
      <div>
        <h1 className="bg-gradient-to-b from-[#0D27F7] to-[#0E1BEF] bg-clip-text text-3xl font-semibold tracking-tight text-transparent md:text-4xl">
          Approved Clearances
        </h1>
        <p className="mt-2 text-base font-medium text-gray-500 md:text-lg">
          Students approved by your assigned office.
        </p>
      </div>

      <div className={`${appleCard} overflow-hidden`}>
        <div className="grid grid-cols-5 border-b border-[#e2ebff] bg-white/60 px-6 py-4 text-sm font-semibold text-[#0D27F7]">
          <p>Student ID</p>
          <p>Name</p>
          <p>Course</p>
          <p>Date Approved</p>
          <p>Status</p>
        </div>

        {approved.map((student) => (
          <div
            key={student.id}
            className="grid grid-cols-5 items-center border-b border-[#e2ebff]/70 px-6 py-4 text-sm text-gray-600 last:border-b-0 hover:bg-blue-50/60"
          >
            <p>{student.id}</p>
            <p className="font-medium text-gray-700">{student.name}</p>
            <p>{student.course}</p>
            <p>{student.date}</p>
            <span className="flex w-fit items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
              <FiCheckCircle />
              Approved
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default OfficerApproved;