import { FiBell, FiCheckCircle, FiClock, FiCreditCard } from "react-icons/fi";

function Notifications() {
  const notifications = [
    {
      id: 1,
      type: "approved",
      title: "Library clearance approved",
      message: "Your Library clearance has been approved.",
      time: "2 hours ago",
    },
    {
      id: 2,
      type: "payment",
      title: "Payment required",
      message: "Department Society requires ₱100 payment.",
      time: "Today",
    },
    {
      id: 3,
      type: "pending",
      title: "Publication pending review",
      message: "Your Publication clearance is still waiting for review.",
      time: "Yesterday",
    },
  ];

  const iconMap = {
    approved: <FiCheckCircle />,
    payment: <FiCreditCard />,
    pending: <FiClock />,
  };

  const colorMap = {
    approved: "bg-green-100 text-green-700",
    payment: "bg-blue-100 text-[#0D27F7]",
    pending: "bg-yellow-100 text-yellow-700",
  };

  return (
    <div className="space-y-8 font-inter">
      <div>
        <h1 className="bg-gradient-to-b from-[#0D27F7] to-[#0E1BEF] bg-clip-text text-3xl font-semibold tracking-tight text-transparent md:text-4xl">
          Notifications
        </h1>
        <p className="mt-2 text-base font-medium text-gray-500 md:text-lg">
          View updates about your clearance progress.
        </p>
      </div>

      <div className="rounded-[28px] border border-[#d6e2ff] bg-white/70 p-6 shadow-[0_4px_20px_rgba(13,39,247,0.06)] ring-1 ring-white/80 backdrop-blur-xl">
        <div className="flex items-center gap-2">
          <FiBell className="text-[#0D27F7]" />
          <h2 className="text-xl font-semibold text-[#0D27F7]">
            Recent Updates
          </h2>
        </div>

        <div className="mt-6 space-y-3">
          {notifications.map((item) => (
            <div
              key={item.id}
              className="flex gap-4 rounded-2xl border border-[#e2ebff] bg-white/60 p-4 transition hover:bg-blue-50"
            >
              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-xl ${colorMap[item.type]}`}
              >
                {iconMap[item.type]}
              </div>

              <div className="flex-1">
                <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
                  <h3 className="font-semibold text-gray-700">{item.title}</h3>
                  <span className="text-xs text-gray-400">{item.time}</span>
                </div>

                <p className="mt-1 text-sm text-gray-500">{item.message}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Notifications;