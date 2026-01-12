import React, { useEffect, useState } from 'react';
import { notificationService } from '../services/notificationservice';

interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'new_listing' | 'tenant_interest' | 'system';
  isRead: boolean;
  date: string;
}

const NotificationCenter: React.FC = () => {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch notifications on component mount
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const data = await notificationService.getNotifications();
        setNotifications(data);
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  // Clear all notifications
  const handleClear = async () => {
    try {
      await notificationService.clearNotifications(); // Add this method in `notificationservice.ts`
      setNotifications([]);
    } catch (error) {
      console.error('Failed to clear notifications:', error);
    }
  };

  // Mark a notification as read
  const markAsRead = async (id: string) => {
    try {
      await notificationService.markAsRead(id); // Add this method in `notificationservice.ts`
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === id ? { ...notif, isRead: true } : notif
        )
      );
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  if (loading) {
    return <p>Loading notifications...</p>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-20">
      <div className="flex justify-between items-end mb-12">
        <div>
          <h2 className="text-4xl font-serif font-bold text-stone-900">Notifications</h2>
          <p className="text-stone-500 font-medium">Stay updated on your house hunt and tenant interest.</p>
        </div>
        <button
          onClick={handleClear}
          className="text-xs font-black uppercase tracking-widest text-stone-400 hover:text-orange-700 pb-1"
        >
          Clear All
        </button>
      </div>

      <div className="space-y-6">
        {notifications.length > 0 ? (
          notifications.map((notif) => (
            <div
              key={notif.id}
              className={`bg-white rounded-[2rem] p-8 shadow-lg border-2 flex gap-6 items-start ${
                notif.isRead
                  ? 'border-stone-50'
                  : 'border-orange-100 ring-2 ring-orange-50'
              }`}
            >
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                  notif.type === 'new_listing'
                    ? 'bg-orange-100 text-orange-700'
                    : 'bg-stone-900 text-white'
                }`}
              >
                {notif.type === 'new_listing' ? (
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                )}
              </div>
              <div className="flex-grow">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold text-stone-900">{notif.title}</h3>
                  <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest">
                    {notif.date}
                  </span>
                </div>
                <p className="text-stone-600 font-medium leading-relaxed">
                  {notif.message}
                </p>
                {!notif.isRead && (
                  <div className="mt-4">
                    <button
                      onClick={() => markAsRead(notif.id)}
                      className="text-[10px] font-black uppercase tracking-widest text-orange-700 hover:text-orange-900"
                    >
                      Mark as Read
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20 bg-stone-50/50 rounded-[3rem] border-2 border-dashed border-stone-100">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
              <svg
                className="w-8 h-8 text-stone-200"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
            </div>
            <p className="text-stone-400 font-black uppercase tracking-widest text-xs">
              No new alerts right now
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationCenter;