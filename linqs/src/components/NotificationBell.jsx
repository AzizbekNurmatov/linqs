import { useEffect, useMemo, useRef, useState } from 'react';
import { Bell } from 'lucide-react';

const HOT_PINK = '#FF69B4';
const LIME_TINT = '#E7FFB5';

const createInitialNotifications = () => [
  {
    id: 'n1',
    text: 'User123 joined your event: C YOU AT THE CISTERN!',
    unread: true,
    meta: 'Just now',
  },
  {
    id: 'n2',
    text: 'Your FLASH event expires in 1 hour',
    unread: true,
    meta: 'ETA: 59m',
  },
  {
    id: 'n3',
    text: 'New pins are trending near downtown',
    unread: false,
    meta: 'Yesterday',
  },
];

function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState(createInitialNotifications);
  const wrapperRef = useRef(null);

  const unreadCount = useMemo(
    () => notifications.filter((n) => n.unread).length,
    [notifications],
  );

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

  const handleToggle = () => setOpen((v) => !v);

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const handleNotificationClick = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: false } : n)),
    );
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
                      n.unread ? 'bg-[#E7FFB5]' : 'bg-white'
                    } hover:bg-[#E7FFB5]`}
                    role="menuitem"
                  >
                    <div className="flex items-start gap-2">
                      <span
                        className="mt-1 w-2 h-2 rounded-full border-[2px] border-black"
                        style={{
                          backgroundColor: n.unread ? HOT_PINK : '#ffffff',
                        }}
                      />
                      <div className="flex-1">
                        <div className="font-heading font-black uppercase tracking-tighter text-black text-[12px] leading-snug">
                          {n.text}
                        </div>
                        <div className="mt-2 font-mono text-[11px] text-black/60 uppercase">
                          {n.meta}
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

