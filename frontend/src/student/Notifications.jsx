import { FiBell, FiCheckCircle, FiClock, FiCreditCard } from "react-icons/fi";

// ✅ CORRECT PATH: same folder, so './useNotifications'
import { useNotifications } from './useNotifications';

// ✅ Added userId prop
function Notifications({ userId }) {

  // ✅ Get real data from database
  const { notifications: realNotifications, loading, markOneRead } = useNotifications(userId);

  // 🧪 TEST DATA: HARDCODED SAMPLE NOTIFICATIONS (WILL SHOW UP IMMEDIATELY!)
  const testNotifications = [
    {
      id: 'test-1',
      type: 'approved',
      title: '✅ Library Office Approved',
      message: 'Great! Your clearance step is successfully done.',
      created_at: new Date().toISOString(),
      read_at: null // 👈 NULL = UNREAD → shows blue left border
    },
    {
      id: 'test-2',
      type: 'payment',
      title: '⚠️ Payment Required: ₱150',
      message: 'Please pay now to complete Department Society step.',
      created_at: new Date().toISOString(),
      read_at: null
    },
    {
      id: 'test-3',
      type: 'pending',
      title: '⏳ Registrar: Reviewing Request',
      message: 'Your documents are being reviewed. We will update you soon.',
      created_at: new Date().toISOString(),
      read_at: null
    },
    {
      id: 'test-4',
      type: 'reminder',
      title: '⏰ Reminder: Deadline Soon',
      message: 'Complete all steps before October 30, 2025.',
      created_at: new Date().toISOString(),
      read_at: new Date().toISOString() // 👈 ALREADY READ → no blue border
    }
  ];

  // ✅ COMBINE: show test data first, then real data (when available)
  const notifications = [...testNotifications, ...realNotifications];

  const iconMap = {
    approved: <FiCheckCircle />,
    payment: <FiCreditCard />,
    pending: <FiClock />,
    reminder: <FiClock />,
    rejection: <FiClock />,
    update: <FiBell />
  };

  const colorMap = {
    approved: "bg-green-100 text-green-700",
    payment: "bg-blue-100 text-[#0D27F7]",
    pending: "bg-yellow-100 text-yellow-700",
    reminder: "bg-yellow-100 text-yellow-700",
    rejection: "bg-red-100 text-red-700",
    update: "bg-purple-100 text-purple-700"
  };

  // ✅ Loading state
  if (loading) {
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
          <p className="text-center text-gray-500">Loading notifications...</p>
        </div>
      </div>
    );
  }

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
          {/* ✅ Empty state if no notifications */}
          {notifications.length === 0 ? (
            <p className="text-center text-gray-500 py-4">No notifications yet.</p>
          ) : (
            // ✅ Show real notifications
            notifications.map((item) => {
              const isUnread = !item.read_at;

              return (
                <div
                  key={item.id}
                  onClick={() => isUnread && markOneRead(item.id)}
                  className={`flex gap-4 rounded-2xl border border-[#e2ebff] bg-white/60 p-4 transition hover:bg-blue-50 ${
                    isUnread ? 'border-l-4 border-l-[#0D27F7]' : ''
                  }`}
                >
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-xl ${colorMap[item.type] || "bg-gray-100 text-gray-700"}`}
                  >
                    {iconMap[item.type] || <FiBell />}
                  </div>

                  <div className="flex-1">
                    <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
                      <h3 className={`font-semibold ${isUnread ? 'text-black' : 'text-gray-700'}`}>
                        {item.title}
                      </h3>
                      <span className="text-xs text-gray-400">
                        {new Date(item.created_at).toLocaleString()}
                      </span>
                    </div>

                    <p className="mt-1 text-sm text-gray-500">{item.message}</p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

export default Notifications; 