import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { Send } from 'lucide-react';
import TopNavigation from '../components/TopNavigation';
import { useAuth } from '../context/AuthContext';
import { useMessages } from '../context/MessageContext';
import { useProducts } from '../context/ProductContext';
import { useStore } from '../context/StoreContext';

function Chat() {
  const { conversationId } = useParams<{ conversationId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { messages, conversations, sendMessage, markConversationAsRead } = useMessages();
  const { getProductById } = useProducts();
  const { getVerificationStatus } = useStore();
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    if (conversationId && user) {
      markConversationAsRead(conversationId, user.id!);
    }
  }, [conversationId, user, markConversationAsRead]);

  if (!conversationId || !user) {
    navigate('/messages');
    return null;
  }

  const conversation = conversations.find(c => c.id === conversationId);
  if (!conversation) {
    navigate('/messages');
    return null;
  }

  const product = getProductById(conversation.productId);
  const otherUserId = conversation.participants.find(id => id !== user.id);
  const sellerVerification = product ? getVerificationStatus(product.sellerId) : undefined;
  const seller = sellerVerification?.user;
  const shop = sellerVerification?.shop;

  if (!product || !otherUserId || !seller || !shop) {
    navigate('/messages');
    return null;
  }

  const conversationMessages = messages.filter(m => m.conversationId === conversationId);

  const handleSend = async () => {
    if (!newMessage.trim()) return;

    await sendMessage(conversationId, user.id!, newMessage.trim());
    setNewMessage('');
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pt-16">
      <TopNavigation 
        title={user.id === product.sellerId ? `${seller.firstName} ${seller.lastName}` : shop.name}
        showBack 
      />
      
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="bg-white rounded-xl p-4 shadow-sm mb-4">
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-lg overflow-hidden mr-4">
              <img 
                src={product.image} 
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h3 className="font-medium text-gray-800">{product.name}</h3>
              <p className="text-teal-600 font-semibold">₱{product.price.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {conversationMessages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${message.senderId === user.id ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                  message.senderId === user.id 
                    ? 'bg-teal-600 text-white' 
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                <p>{message.content}</p>
                <p className={`text-xs mt-1 ${
                  message.senderId === user.id ? 'text-teal-100' : 'text-gray-500'
                }`}>
                  {formatTime(message.createdAt)}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="bg-white border-t border-gray-100 p-4">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-gray-100 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          />
          <button
            onClick={handleSend}
            className="w-10 h-10 bg-teal-600 text-white rounded-full flex items-center justify-center"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Chat;