import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, User, ChevronRight, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import TopNavigation from '../components/TopNavigation';
import BottomNavigation from '../components/BottomNavigation';
import { useAuth } from '../context/AuthContext';
import { useMessages } from '../context/MessageContext';
import { useProducts } from '../context/ProductContext';
import { useStore } from '../context/StoreContext';
import { useNotifications } from '../context/NotificationContext';

function Messages() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { conversations, getUnreadCount } = useMessages();
  const { getProductById } = useProducts();
  const { getVerificationStatus } = useStore();
  const { getUnreadCount: getNotificationCount } = useNotifications();

  // Filter conversations for current user
  const userConversations = conversations.filter(conv => 
    user && conv.participants.includes(user.id!)
  );

  const unreadNotifications = user ? getNotificationCount(user.id!) : 0;

  return (
    <div className="min-h-screen bg-gray-50 pb-20 pt-16">
      <TopNavigation 
        title="Messages" 
        showBack 
        rightContent={
          <button
            onClick={() => navigate('/notifications')}
            className="relative text-gray-600"
          >
            <Bell size={24} />
            {unreadNotifications > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
                {unreadNotifications}
              </span>
            )}
          </button>
        }
      />
      
      <div className="p-4">
        {userConversations.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-12"
          >
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <MessageCircle size={24} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">No Messages Yet</h3>
            <p className="text-gray-500 text-center max-w-xs">
              Start a conversation by purchasing a product or responding to customer inquiries.
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-3"
          >
            {userConversations.map((conversation) => {
              const product = getProductById(conversation.productId);
              const otherUserId = conversation.participants.find(id => id !== user?.id);
              const sellerVerification = product ? getVerificationStatus(product.sellerId) : undefined;
              const seller = sellerVerification?.user;
              const shop = sellerVerification?.shop;
              
              if (!product || !otherUserId) return null;

              const unreadCount = user ? getUnreadCount(conversation.id, user.id!) : 0;

              return (
                <motion.button
                  key={conversation.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="w-full bg-white rounded-xl p-4 shadow-sm"
                  onClick={() => navigate(`/chat/${conversation.id}`)}
                >
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                      {seller?.profilePhoto ? (
                        <img 
                          src={seller.profilePhoto} 
                          alt={seller.firstName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                          <User size={24} className="text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 text-left">
                      <h3 className="font-medium text-gray-800">
                        {user?.id === product.sellerId ? 
                          `${seller?.firstName} ${seller?.lastName}` : 
                          shop?.name
                        }
                      </h3>
                      <p className="text-sm text-gray-500">
                        {product.name}
                      </p>
                    </div>
                    <div className="flex items-center">
                      {unreadCount > 0 && (
                        <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full mr-2">
                          {unreadCount}
                        </span>
                      )}
                      <ChevronRight size={20} className="text-gray-400" />
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </motion.div>
        )}
      </div>

      <BottomNavigation />
    </div>
  );
}

export default Messages;