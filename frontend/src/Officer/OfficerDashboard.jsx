import {
<<<<<<< HEAD
  FiUsers,
=======
>>>>>>> d28bd3b538eb5eb7f22a9b7749abab309e37038e
  FiFileText,
  FiCheckCircle,
  FiClock,
} from "react-icons/fi";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

function OfficerDashboard() {
  const stats = [
   
    { title: "Requests", value: "24", icon: <FiFileText /> },
    { title: "Approved", value: "42", icon: <FiCheckCircle /> },
    { title: "Pending", value: "20", icon: <FiClock /> },
  ];

  const requestData = [
    { status: "Pending", count: 20 },
    { status: "Approved", count: 42 },
    { status: "Denied", count: 8 },
    { status: "Payment", count: 16 },
  ];

  const appleCard =
    "rounded-[28px] border border-[#d6e2ff] bg-white/70 shadow-[0_4px_20px_rgba(13,39,247,0.06)] ring-1 ring-white/80 backdrop-blur-xl transition-all duration-200 hover:-translate-y-[2px] hover:border-[#c3d4ff] hover:shadow-[0_8px_30px_rgba(13,39,247,0.08)]";

  return (
    <div className="space-y-8 font-inter">
      <div>
        <h1 className="bg-gradient-to-b from-[#0D27F7] to-[#0E1BEF] bg-clip-text text-3xl font-semibold tracking-tight text-transparent md:text-4xl">
          Officer Dashboard
        </h1>
        <p className="mt-2 text-base font-medium text-gray-500 md:text-lg">
          Manage clearance requests for your assigned office.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => (
          <div key={item.title} className={`${appleCard} p-6`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  {item.title}
                </p>
                <h2 className="mt-3 text-3xl font-semibold text-[#0D27F7]">
                  {item.value}
                </h2>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#e2ebff] bg-white/60 text-2xl text-[#0D27F7] shadow-sm backdrop-blur">
                {item.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <div className={`${appleCard} p-6`}>
          <h2 className="text-xl font-semibold text-[#0D27F7]">
            Request Overview
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Clearance status under your assigned office.
          </p>

          <div className="mt-5 h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={requestData}>
                <XAxis dataKey="status" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#0D27F7" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className={`${appleCard} p-6`}>
          <h2 className="text-xl font-semibold text-[#0D27F7]">
            Recent Activity
          </h2>

          <div className="mt-5 space-y-3">
            {[
              "Maria Santos submitted a clearance request.",
              "Juan Dela Cruz was approved.",
              "Ana Reyes requires payment verification.",
            ].map((text) => (
              <div
                key={text}
                className="rounded-2xl border border-[#e2ebff] bg-white/60 p-4 text-sm text-gray-500 shadow-[0_2px_10px_rgba(13,39,247,0.04)] backdrop-blur transition hover:border-[#c3d4ff] hover:bg-blue-50"
              >
                {text}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default OfficerDashboard;