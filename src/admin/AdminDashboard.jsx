import { FiUsers, FiFileText, FiCheckCircle, FiClock } from "react-icons/fi";

function AdminDashboard() {
  const stats = [
    { title: "Total Students", value: "500", icon: <FiUsers /> },
    { title: "Clearance Requests", value: "128", icon: <FiFileText /> },
    { title: "Cleared", value: "230", icon: <FiCheckCircle /> },
    { title: "Pending", value: "270", icon: <FiClock /> },
  ];

  return (
    <div>
      <h1 className="text-4xl font-bold text-[#1767FE]">Dashboard</h1>
      <p className="mt-2 text-lg font-medium text-[#717171]">
        Overview of the CICS E-Clearance system.
      </p>

      <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => (
          <div
            key={item.title}
            className="rounded-[25px] border border-gray-200 bg-[#F8F8FF] p-6 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[#717171]">
                  {item.title}
                </p>
                <h2 className="mt-3 text-3xl font-bold text-[#1767FE]">
                  {item.value}
                </h2>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EAF2FF] text-2xl text-[#1767FE]">
                {item.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-[25px] border border-gray-200 bg-[#F8F8FF] p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-[#1767FE]">
            Recent Activity
          </h2>

          <div className="mt-5 space-y-3">
            <div className="rounded-2xl bg-white p-4 text-[#717171] shadow-sm">
              Maria Santos submitted a clearance request.
            </div>
            <div className="rounded-2xl bg-white p-4 text-[#717171] shadow-sm">
              Publication added a payment requirement.
            </div>
            <div className="rounded-2xl bg-white p-4 text-[#717171] shadow-sm">
              Dean approved Juan Dela Cruz.
            </div>
          </div>
        </div>

        <div className="rounded-[25px] border border-gray-200 bg-[#F8F8FF] p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-[#1767FE]">
            Quick Summary
          </h2>

          <div className="mt-5 space-y-4">
            <div>
              <div className="mb-2 flex justify-between text-sm text-[#717171]">
                <span>Clearance Completion</span>
                <span>46%</span>
              </div>
              <div className="h-3 rounded-full bg-white">
                <div className="h-3 w-[46%] rounded-full bg-[#1767FE]" />
              </div>
            </div>

            <div>
              <div className="mb-2 flex justify-between text-sm text-[#717171]">
                <span>Pending Requests</span>
                <span>54%</span>
              </div>
              <div className="h-3 rounded-full bg-white">
                <div className="h-3 w-[54%] rounded-full bg-[#FFB433]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;