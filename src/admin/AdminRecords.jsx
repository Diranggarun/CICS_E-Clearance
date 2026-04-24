function AdminRecords() {
  const records = [
    {
      student: "Maria Santos",
      id: "2022-0001",
      program: "BSCS",
      department: "Cleared",
      library: "Cleared",
      council: "Pending",
    },
    {
      student: "Juan Dela Cruz",
      id: "2022-0002",
      program: "BSIT",
      department: "Pending",
      library: "Cleared",
      council: "Cleared",
    },
  ];

  const badgeClass = (status) =>
    status === "Cleared"
      ? "bg-[#B1FFB9] text-[#029422]"
      : "bg-[#FFF0C2] text-[#FFB433]";

  return (
    <div>
      <h1 className="text-4xl font-bold text-[#1767FE]">
        Clearance Records
      </h1>
      <p className="mt-2 text-lg font-medium text-[#717171]">
        View and manage all student clearance statuses.
      </p>

      <div className="mt-8 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <input
          placeholder="Search Records"
          className="h-[53px] w-full rounded-xl border border-gray-300 bg-[#F2F3FF] px-5 text-sm outline-none focus:border-[#1767FE] xl:w-[333px]"
        />

        <div className="flex flex-wrap gap-3">
          <select className="h-[53px] rounded-xl border border-gray-300 bg-[#F2F3FF] px-4 text-sm text-[#717171]">
            <option>All Statuses</option>
            <option>Cleared</option>
            <option>Pending</option>
          </select>

          <select className="h-[53px] rounded-xl border border-gray-300 bg-[#F2F3FF] px-4 text-sm text-[#717171]">
            <option>All Program</option>
            <option>BSCS</option>
            <option>BSIT</option>
          </select>

          <select className="h-[53px] rounded-xl border border-gray-300 bg-[#F2F3FF] px-4 text-sm text-[#717171]">
            <option>All Year Level</option>
            <option>1st Year</option>
            <option>2nd Year</option>
            <option>3rd Year</option>
            <option>4th Year</option>
          </select>
        </div>
      </div>

      <div className="mt-5 flex gap-3">
        <span className="rounded-full border bg-white px-4 py-2 text-sm text-[#717171]">
          All 500
        </span>
        <span className="rounded-full border bg-white px-4 py-2 text-sm text-[#717171]">
          Cleared 230
        </span>
        <span className="rounded-full border bg-white px-4 py-2 text-sm text-[#717171]">
          Pending 270
        </span>
      </div>

      <div className="mt-6 overflow-x-auto rounded-[25px] border border-gray-200 bg-[#F8F8FF] p-5 shadow-sm">
        <table className="w-full min-w-[900px] text-left">
          <thead>
            <tr className="border-b border-gray-200 text-sm font-semibold text-[#717171]">
              <th className="px-4 py-4">STUDENT</th>
              <th className="px-4 py-4">ID NUMBER</th>
              <th className="px-4 py-4">PROGRAM</th>
              <th className="px-4 py-4">DEPARTMENT</th>
              <th className="px-4 py-4">LIBRARY</th>
              <th className="px-4 py-4">ST. COUNCIL</th>
            </tr>
          </thead>

          <tbody>
            {records.map((record) => (
              <tr key={record.id} className="border-b border-gray-100 bg-white">
                <td className="px-4 py-5 text-[#717171]">{record.student}</td>
                <td className="px-4 py-5 text-[#717171]">{record.id}</td>
                <td className="px-4 py-5 text-[#717171]">{record.program}</td>
                <td className="px-4 py-5">
                  <span
                    className={`rounded-lg px-3 py-1 text-xs font-medium ${badgeClass(
                      record.department
                    )}`}
                  >
                    {record.department}
                  </span>
                </td>
                <td className="px-4 py-5">
                  <span
                    className={`rounded-lg px-3 py-1 text-xs font-medium ${badgeClass(
                      record.library
                    )}`}
                  >
                    {record.library}
                  </span>
                </td>
                <td className="px-4 py-5">
                  <span
                    className={`rounded-lg px-3 py-1 text-xs font-medium ${badgeClass(
                      record.council
                    )}`}
                  >
                    {record.council}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-6 flex items-center justify-end gap-2">
          <button className="rounded-xl bg-[#0054F4] px-4 py-2 text-white">
            1
          </button>
          <button className="rounded-xl border bg-white px-4 py-2 text-[#1767FE]">
            2
          </button>
          <button className="rounded-xl border bg-white px-4 py-2 text-[#1767FE]">
            3
          </button>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <button className="rounded-[15px] bg-gradient-to-b from-[#0D27F7] to-[#0E1BEF] px-8 py-3 font-semibold text-white shadow-sm">
          Export Data
        </button>
      </div>
    </div>
  );
}

export default AdminRecords;