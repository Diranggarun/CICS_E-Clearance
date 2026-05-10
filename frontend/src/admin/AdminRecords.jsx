function AdminRecords() {
  const appleCard =
    "rounded-[28px] border border-[#d6e2ff] bg-white/70 shadow-[0_4px_20px_rgba(13,39,247,0.06)] ring-1 ring-white/80 backdrop-blur-xl";

  const inputClass =
    "h-[53px] rounded-[12px] border border-[#e2ebff] bg-white/60 px-4 text-sm text-gray-500 outline-none backdrop-blur transition hover:border-[#c3d4ff] focus:border-[#0D27F7] focus:ring-2 focus:ring-[#0D27F7]/15";

  const offices = [
    { key: "library", label: "LIBRARY" },
    { key: "publication", label: "PUBLICATION" },
    { key: "studentCouncil", label: "STUDENT COUNCIL" },
    { key: "departmentSociety", label: "DEPARTMENT SOCIETY" },
    { key: "academicAdviser", label: "ACADEMIC ADVISER" },
    { key: "chairperson", label: "CHAIRPERSON" },
    { key: "dean", label: "DEAN" },
    { key: "enrollingOfficer", label: "ENROLLING OFFICER" },
  ];

  const records = [
    {
      student: "Maria Santos",
      id: "2022-0001",
      program: "BSCS",
      library: "Cleared",
      publication: "Cleared",
      studentCouncil: "Pending",
      departmentSociety: "Cleared",
      academicAdviser: "Cleared",
      chairperson: "Pending",
      dean: "Pending",
      enrollingOfficer: "Pending",
    },
    {
      student: "Juan Dela Cruz",
      id: "2022-0002",
      program: "BSIT",
      library: "Cleared",
      publication: "Pending",
      studentCouncil: "Cleared",
      departmentSociety: "Pending",
      academicAdviser: "Cleared",
      chairperson: "Cleared",
      dean: "Pending",
      enrollingOfficer: "Pending",
    },
  ];

  const badgeClass = (status) =>
    status === "Cleared"
      ? "bg-[#B1FFB9] text-[#029422]"
      : "bg-[#FFF0C2] text-[#FFB433]";

  return (
    <div className="space-y-8 font-inter">
      <div>
        <h1 className="bg-gradient-to-b from-[#0D27F7] to-[#0E1BEF] bg-clip-text text-3xl font-semibold tracking-tight text-transparent md:text-4xl">
          Clearance Records
        </h1>
        <p className="mt-2 text-base font-medium text-gray-500 md:text-lg">
          View and manage all student clearance statuses.
        </p>
      </div>

      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <input
          placeholder="Search Records"
          className={`${inputClass} w-full px-5 xl:w-[333px]`}
        />

        <div className="flex flex-wrap gap-3">
          {["All Statuses", "All Program", "All Year Level"].map((label) => (
            <select key={label} className={inputClass}>
              <option>{label}</option>
            </select>
          ))}
        </div>
      </div>

      <div className="flex gap-3">
        {["All 500", "Cleared 230", "Pending 270"].map((item) => (
          <span
            key={item}
            className="rounded-full border border-[#e2ebff] bg-white/60 px-4 py-2 text-sm text-gray-600 backdrop-blur transition hover:bg-blue-50"
          >
            {item}
          </span>
        ))}
      </div>

      <div className={`${appleCard} overflow-x-auto p-5`}>
        <table className="w-full min-w-[1500px] text-left">
          <thead>
            <tr className="border-b border-[#e2ebff] text-sm font-semibold text-gray-500">
              <th className="px-4 py-4">STUDENT</th>
              <th className="px-4 py-4">ID NUMBER</th>
              <th className="px-4 py-4">PROGRAM</th>
              {offices.map((office) => (
                <th key={office.key} className="px-4 py-4">
                  {office.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {records.map((record) => (
              <tr
                key={record.id}
                className="border-b border-[#eef3ff] bg-white/60 transition hover:bg-blue-50"
              >
                <td className="px-4 py-5 text-gray-600">{record.student}</td>
                <td className="px-4 py-5 text-gray-600">{record.id}</td>
                <td className="px-4 py-5 text-gray-600">{record.program}</td>

                {offices.map((office) => (
                  <td key={office.key} className="px-4 py-5">
                    <span
                      className={`whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold ${badgeClass(
                        record[office.key]
                      )}`}
                    >
                      {record[office.key]}
                    </span>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-6 flex items-center justify-end gap-2">
          {[1, 2, 3].map((num) => (
            <button
              key={num}
              className={`rounded-xl px-4 py-2 text-sm transition ${
                num === 1
                  ? "bg-gradient-to-b from-[#0D27F7] to-[#0E1BEF] text-white"
                  : "border border-[#e2ebff] bg-white/60 text-[#0D27F7] hover:bg-blue-50"
              }`}
            >
              {num}
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <button className="rounded-full bg-gradient-to-b from-[#0D27F7] to-[#0E1BEF] px-8 py-3 text-sm font-semibold text-white shadow-[0_2px_10px_rgba(13,39,247,0.2)] transition hover:opacity-95 hover:shadow-[0_6px_20px_rgba(13,39,247,0.25)] active:scale-[0.98]">
          Export Data
        </button>
      </div>
    </div>
  );
}

export default AdminRecords;