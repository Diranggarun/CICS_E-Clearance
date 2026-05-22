import { useState, useEffect } from 'react';
<<<<<<< HEAD
=======
import {
  listNotifications,
  markNotificationRead,
} from '../api/student';
>>>>>>> d28bd3b538eb5eb7f22a9b7749abab309e37038e

export function useNotifications(userId) {
  const [notifications, setNotifications] = useState([]);
  const [unread, setUnread] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
<<<<<<< HEAD
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
=======
    if (!userId) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    listNotifications()
      .then((res) => {
        if (cancelled) return;
        const items = Array.isArray(res.data) ? res.data : res.data.items || [];
        setNotifications(items);
        setUnread(items.filter((n) => !n.readAt && !n.read_at).length);
      })
      .catch(() => {
        if (!cancelled) setNotifications([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [userId]);

  const markOneRead = async (id) => {
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === id ? { ...n, read_at: new Date().toISOString(), readAt: new Date().toISOString() } : n
      )
    );
    setUnread((prev) => Math.max(0, prev - 1));
    try {
      await markNotificationRead(id);
    } catch {
      /* best-effort — UI already updated */
    }
  };

  return { notifications, unread, loading, markOneRead };
}
>>>>>>> d28bd3b538eb5eb7f22a9b7749abab309e37038e
