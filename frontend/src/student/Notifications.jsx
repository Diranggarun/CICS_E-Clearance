import { useAuth } from '../context/AuthContext';
import { useNotifications } from './useNotifications';

export default function Notifications() {
  const { user } = useAuth();
  const { notifications, unread, loading, markOneRead } = useNotifications(user?.id);

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-10">
          <h1 className="text-[32px] font-bold text-blue-700 mb-2">Notifications</h1>
          <p className="text-gray-500">View updates about your clearance progress.</p>
        </div>

        {loading ? (
          <div className="py-10 text-center text-gray-400">
            Loading notifications...
          </div>
        ) : (
          <div className="space-y-4">
            {/* Red Badge Counter */}
            <div className="flex justify-end mb-2">
              <span className="bg-red-500 text-white text-sm font-semibold px-3 py-1 rounded-full">
                {unread} Unread
              </span>
            </div>

            {/* Notification Items */}
            {notifications.map(note => (
              <div
                key={note.id}
                onClick={() => markOneRead(note.id)}
                className={`p-6 rounded-2xl border-2 cursor-pointer transition-all duration-200 ${
                  !note.read_at 
                    ? 'border-blue-500 bg-blue-50/50 shadow-md' 
                    : 'border-gray-200 bg-white'
                }`}
              >
                <h3 className="font-bold text-lg text-gray-800">{note.title}</h3>
                <p className="text-gray-600 mt-1">{note.message}</p>
                <p className="text-xs text-gray-400 mt-3">
                  {new Date(note.created_at).toLocaleString('en-US', { 
                    month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' 
                  })}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}