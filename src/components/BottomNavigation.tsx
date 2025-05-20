import React from 'react';
import { Home, Package, User, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';
import { useMessages } from '../context/MessageContext';
import { useAuth } from '../context/AuthContext';

const BottomNavigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { conversations, getUnreadCount } = useMessages();
  
  // Calculate total unread messages across all conversations
  const totalUnreadMessages = React.useMemo(() => {
    if (!user) return 0;
    return conversations.reduce((total, conversation) => {
      return total + getUnreadCount(conversation.id, user.id!);
    }, 0);
  }, [user, conversations, getUnreadCount]);
  
  const navItems = [
    { icon: Home, label: 'Home', path: '/main' },
    { icon: Package, label: 'Products', path: '/products' },
    { icon: MessageCircle, label: 'Messages', path: '/messages', badge: totalUnreadMessages },
    { icon: User, label: 'Profile', path: '/profile' },
  ];
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-10">
      <div className="flex justify-around items-center">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          
          return (
            <motion.button
              key={item.path}
              whileTap={{ scale: 0.9 }}
              className={cn(
                'flex flex-col items-center py-1 px-3 rounded-xl transition-colors relative',
                isActive ? 'text-teal-600' : 'text-gray-500'
              )}
              onClick={() => navigate(item.path)}
            >
              <div className="relative">
                <Icon size={24} />
                {isActive && (
                  <motion.div
                    layoutId="bottomNavIndicator"
                    className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-4 h-1 bg-teal-600 rounded-full"
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
                {item.badge > 0 && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
                    {item.badge}
                  </div>
                )}
              </div>
              <span className="text-xs mt-1">{item.label}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNavigation;