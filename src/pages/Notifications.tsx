import React from 'react';
import { motion } from 'framer-motion';
import { Bell, ChevronRight, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import TopNavigation from '../components/TopNavigation';
import BottomNavigation from '../components/BottomNavigation';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';

const Notifications: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getNotificationsByUser, removeNotification } = useNotifications();
  const [removingId, setRemovingId] = React.useState<string | null>(null);
  
  const notifications = user ? getNotificationsByUser(user.id!) : [];

  const handleRemove = async (notificationId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setRemovingId(notificationId);
    try {
      await removeNotification(notificationId);
    } catch (error) {
      console.error('Failed to remove notification:', error);
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 pt-16">
      <TopNavigation title="Notifications" showBack />
      
      {notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center px-4 py-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bell size={24} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">No Notifications Yet</h3>
            <p className="text-gray-500 max-w-xs mx-auto">
              You'll see your notifications here when you receive them.
            </p>
          </motion.div>
        </div>
      ) : (
        <div className="p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-3"
          >
            {notifications.map((notification) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                className={`relative bg-white rounded-xl p-4 shadow-sm ${
                  !notification.read ? 'border-l-4 border-teal-500' : ''
                }`}
              >
                <button
                  className="w-full text-left"
                  onClick={() => navigate(`/notifications/${notification.id}`)}
                >
                  <div className="pr-8">
                    <h3 className={`font-medium ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}>
                      {notification.title}
                    </h3>
                    <p className={`text-sm mt-1 line-clamp-2 ${!notification.read ? 'text-gray-700' : 'text-gray-500'}`}>
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-400 mt-2">
                      {new Date(notification.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </button>
                
                <button
                  onClick={(e) => handleRemove(notification.id, e)}
                  disabled={removingId === notification.id}
                  className="absolute top-4 right-4 p-1 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={18} />
                </button>
              </motion.div>
            ))}
          </motion.div>
        </div>
      )}
      
      <BottomNavigation />
    </div>
  );
};

export default Notifications;