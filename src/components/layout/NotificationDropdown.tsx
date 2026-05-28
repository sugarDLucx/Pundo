import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '../ui/Icon';
import { useNotificationStore } from '../../store/notificationStore';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '../../lib/utils';

export const NotificationDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotificationStore();

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const toggleOpen = () => setIsOpen(!isOpen);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'success': return <Icon name="check_circle" className="text-primary" />;
      case 'warning': return <Icon name="warning" className="text-tertiary" />;
      case 'error': return <Icon name="error" className="text-error" />;
      default: return <Icon name="info" className="text-on-surface-variant" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button 
        onClick={toggleOpen}
        className="relative p-2 rounded-full text-on-surface-variant hover:bg-surface-container-high transition-colors focus:outline-none"
      >
        <Icon name="notifications" className="text-[24px]" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-error text-on-error text-[10px] font-bold rounded-full flex items-center justify-center animate-in zoom-in">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-80 sm:w-96 bg-surface-container-lowest border border-surface-container-low rounded-xl shadow-lg z-50 overflow-hidden"
          >
            <div className="p-4 border-b border-surface-container-low flex justify-between items-center bg-surface/50 backdrop-blur-sm">
              <h3 className="font-headline-sm text-headline-sm text-on-surface">Notifications</h3>
              {unreadCount > 0 && (
                <button 
                  onClick={() => markAllAsRead()}
                  className="text-label-sm font-label-sm text-primary hover:underline focus:outline-none"
                >
                  Mark all as read
                </button>
              )}
            </div>

            <div className="max-h-[400px] overflow-y-auto no-scrollbar">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-on-surface-variant font-body-md flex flex-col items-center gap-2">
                  <Icon name="notifications_off" className="text-[32px] opacity-50" />
                  <p>You have no notifications yet.</p>
                </div>
              ) : (
                <ul className="divide-y divide-surface-container-low">
                  {notifications.map((notification) => (
                    <li 
                      key={notification.id}
                      onClick={() => !notification.is_read && markAsRead(notification.id)}
                      className={cn(
                        "p-4 hover:bg-surface-container-low transition-colors cursor-pointer flex gap-3",
                        !notification.is_read ? "bg-primary-container/20" : ""
                      )}
                    >
                      <div className="shrink-0 mt-1">
                        {getTypeIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-1">
                          <p className={cn(
                            "font-label-md text-label-md truncate pr-2",
                            !notification.is_read ? "text-on-surface font-bold" : "text-on-surface-variant"
                          )}>
                            {notification.title}
                          </p>
                          <span className="shrink-0 text-label-sm text-outline font-label-sm">
                            {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                          </span>
                        </div>
                        <p className={cn(
                          "font-body-sm text-body-sm line-clamp-2",
                          !notification.is_read ? "text-on-surface" : "text-on-surface-variant"
                        )}>
                          {notification.message}
                        </p>
                      </div>
                      {!notification.is_read && (
                        <div className="shrink-0 w-2 h-2 rounded-full bg-primary mt-2"></div>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
