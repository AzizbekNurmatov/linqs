import { useEffect, useRef, useState } from 'react';
import { Bell } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

const HOT_PINK = '#FF69B4';

function formatRelativeTime(createdAt) {
  if (!createdAt) return 'Just now';

  const created = new Date(createdAt);
  const now = new Date();
  const diffMs = now.getTime() - created.getTime();

  if (Number.isNaN(diffMs) || diffMs < 0) return 'Just now';

  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const wrapperRef = useRef(null);
  const { user } = useAuth();
  const currentUserId = user?.id;

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (e) => {
      const el = wrapperRef.current;
      if (!el) return;
      if (el.contains(e.target)) return;
      setOpen(false);
    };

    window.addEventListener('mousedown', handlePointerDown);
    return () => window.removeEventListener('mousedown', handlePointerDown);
  }, [open]);

  useEffect(() => {
    let isMounted = true;
    let channel = null;

    // Keep state updates asynchronous to satisfy react-hooks linting.
    const init = async () => {
      await Promise.resolve();

      if (!currentUserId) {
        setNotifications([]);
        setUnreadCount(0);
        return;
      }

      // Pull user's notifications on mount
      const fetchNotifications = async () => {
        const { data, error } = await supabase
          .from('notifications')
          .select('id, recipient_id, message, is_read, created_at')
          .eq('recipient_id', currentUserId)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching notifications:', error);
          return;
        }

        if (!isMounted) return;

        const next = data || [];
        setNotifications(next);
        setUnreadCount(next.filter((n) => !n.is_read).length);
      };

      await fetchNotifications();

      // Supabase Realtime: listen for INSERT events for this recipient
      channel = supabase
        .channel(`notifications-inserts:${currentUserId}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'notifications',
            filter: `recipient_id=eq.${currentUserId}`,
          },
          (payload) => {
            const newRow = payload?.new;
            if (!newRow) return;
            if (!isMounted) return;

            // Prepend new notifications to the top
            setNotifications((prev) => [newRow, ...prev]);
            if (!newRow.is_read) setUnreadCount((c) => c + 1);
          },
        )
        .subscribe();
    };

    init();

    return () => {
      isMounted = false;
      if (channel) supabase.removeChannel(channel);
    };
  }, [currentUserId]);

  const handleToggle = () => setOpen((v) => !v);

  const handleMarkAllAsRead = () => {
    if (!currentUserId) return;

    // Optimistic UI update
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    setUnreadCount(0);

    // Persist to Supabase
    supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('recipient_id', currentUserId)
      .catch((err) => {
        console.error('Error marking notifications as read:', err);
      });
  };

  const handleNotificationClick = (id) => {
    if (!currentUserId) return;

    const target = notifications.find((n) => n.id === id);
    const wasUnread = target ? !target.is_read : false;

    if (wasUnread) setUnreadCount((c) => Math.max(0, c - 1));

    // Optimistic UI update
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)),
    );

    // Best-effort persistence
    supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', id)
      .eq('recipient_id', currentUserId)
      .catch((err) => {
        console.error('Error marking notification as read:', err);
      });
  };

  return (
    <div ref={wrapperRef} className="relative">
      <button
        type="button"
        onClick={handleToggle}
        className="relative w-10 h-10 flex items-center justify-center bg-white border-[3px] border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-[#FEF08A] transition-colors"
        aria-label="Notifications"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <Bell className="w-5 h-5 text-black" />
        {unreadCount > 0 && (
          <span
            className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-[#FF69B4] border-[2px] border-black"
            aria-hidden="true"
          />
        )}
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full mt-2 w-[340px] bg-white border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-xl overflow-hidden z-[60]"
        >
          <div className="p-3 border-b-[3px] border-black flex items-center justify-between gap-3">
            <div>
              <div className="font-heading font-black uppercase tracking-tighter text-black text-sm">
                Notifications
              </div>
              <div className="font-mono text-[11px] text-black/60 uppercase">
                {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}
              </div>
            </div>
            <div className="w-3 h-3 rounded-full bg-[#39FF14] border-[2px] border-black" />
          </div>

          <div className="max-h-72 overflow-y-auto scrollbar-hide">
            <ul className="divide-y-2 divide-black">
              {notifications.map((n) => (
                <li key={n.id}>
                  <button
                    type="button"
                    onClick={() => handleNotificationClick(n.id)}
                    className={`w-full text-left px-3 py-3 transition-colors ${
                      !n.is_read ? 'bg-[#E7FFB5]' : 'bg-white'
                    } hover:bg-[#E7FFB5]`}
                    role="menuitem"
                  >
                    <div className="flex items-start gap-2">
                      <span
                        className="mt-1 w-2 h-2 rounded-full border-[2px] border-black"
                        style={{
                          backgroundColor: !n.is_read ? HOT_PINK : '#ffffff',
                        }}
                      />
                      <div className="flex-1">
                        <div className="font-heading font-black uppercase tracking-tighter text-black text-[12px] leading-snug">
                          {n.message}
                        </div>
                        <div className="mt-2 font-mono text-[11px] text-black/60 uppercase">
                          {formatRelativeTime(n.created_at)}
                        </div>
                      </div>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-3 bg-white">
            <button
              type="button"
              onClick={handleMarkAllAsRead}
              className="w-full bg-white border-[3px] border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] py-2.5 font-heading font-black uppercase tracking-tighter text-black hover:bg-black hover:text-white transition-colors"
            >
              Mark all as read
            </button>
            <div className="mt-2 text-center font-mono text-[10px] text-black/50 uppercase">
              Placeholder UI
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default NotificationBell;

