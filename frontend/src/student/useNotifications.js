import { useState, useEffect } from 'react';

export function useNotifications(userId) {
  const [notifications, setNotifications] = useState([]);
  const [unread, setUnread] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ✅ This runs immediately when page loads
    console.log("Loading notifications for:", userId);

    // ✅ YOUR 3 NOTIFICATIONS — EXACTLY WHAT WE WANT
    const testData = [
      {
        id: 'test-1',
        type: 'approved',
        title: '✅ Library Office Approved',
        message: 'Great! Your clearance step is done.',
        created_at: new Date().toISOString(),
        read_at: null
      },
      {
        id: 'test-2',
        type: 'payment',
        title: '⚠️ Payment Required: ₱150',
        message: 'Pay now to complete Department step.',
        created_at: new Date().toISOString(),
        read_at: null
      },
      {
        id: 'test-3',
        type: 'pending',
        title: '⏳ Registrar: Reviewing',
        message: 'We will update you soon.',
        created_at: new Date().toISOString(),
        read_at: null
      }
    ];

    // ✅ Set data — NO DELAY
    setNotifications(testData);
    setUnread(testData.filter(n => !n.read_at).length);
    setLoading(false);

  }, [userId]);

  // ✅ Function to mark as read
  const markOneRead = (id) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? {...n, read_at: new Date().toISOString()} : n)
    );
    setUnread(prev => prev - 1);
  };

  return { notifications, unread, loading, markOneRead };
}