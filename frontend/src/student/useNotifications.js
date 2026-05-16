import { useState, useEffect } from 'react';
import {
  listNotifications,
  markNotificationRead,
} from '../api/student';

export function useNotifications(userId) {
  const [notifications, setNotifications] = useState([]);
  const [unread, setUnread] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
