import React from 'react';
import { ShoppingBag, ChevronLeft, Bell } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';

interface TopNavigationProps {
  title?: string;
  showBack?: boolean;
  showStore?: boolean;
  showNotifications?: boolean;
  rightContent?: React.ReactNode;
}

const TopNavigation: React.FC<TopNavigationProps> = ({
  title = 'KikoApp',
  showBack = false,
  showStore = false,
  showNotifications = false,
  rightContent,
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getUnreadCount } = useNotifications();
  
  const unreadCount = user ? getUnreadCount(user.id!) : 0;
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 px-4 py-3 z-10 flex items-center justify-between"
    >
      <div className="flex items-center">
        {showBack && (
          <motion.button 
            whileTap={{ scale: 0.9 }}
            className="mr-3 text-gray-700"
            onClick={() => navigate(-1)}
          >
            <ChevronLeft size={24} />
          </motion.button>
        )}
        <h1 className="text-xl font-bold text-teal-600">{title}</h1>
      </div>
      
      <div className="flex items-center space-x-4">
        {showNotifications && (
          <motion.button 
            whileTap={{ scale: 0.9 }}
            className="text-gray-600 relative"
            onClick={() => navigate('/notifications')}
          >
            <Bell size={24} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </motion.button>
        )}
        
        {showStore && (
          <motion.button 
            whileTap={{ scale: 0.9 }}
            className="text-orange-500"
            onClick={() => navigate('/store')}
          >
            <ShoppingBag size={24} />
          </motion.button>
        )}
        
        {rightContent}
      </div>
    </motion.div>
  );
};

export default TopNavigation;