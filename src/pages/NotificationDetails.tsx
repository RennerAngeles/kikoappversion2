import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { User, Package, Check, X } from 'lucide-react';
import TopNavigation from '../components/TopNavigation';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { useOrders } from '../context/OrderContext';
import { useProducts } from '../context/ProductContext';

const NotificationDetails: React.FC = () => {
  const { notificationId } = useParams<{ notificationId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { notifications, markAsRead, addNotification } = useNotifications();
  const { getOrderById, updateOrderStatus } = useOrders();
  const { getProductById } = useProducts();
  const [isLoading, setIsLoading] = React.useState(false);
  
  const notification = notifications.find(n => n.id === notificationId);
  const order = notification?.orderId ? getOrderById(notification.orderId) : undefined;
  const product = order ? getProductById(order.productId) : undefined;

  useEffect(() => {
    if (notification && !notification.read) {
      markAsRead(notification.id);
    }
  }, [notification]);

  if (!notification || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Notification not found</p>
      </div>
    );
  }

  const handleAccept = async () => {
    if (!order) return;
    setIsLoading(true);
    try {
      await updateOrderStatus(order.id, 'accepted');
      
      // Send notification to buyer
      await addNotification({
        userId: order.buyerId,
        title: 'Order Accepted',
        message: `Your order for ${product?.name} has been accepted by the seller.`,
        type: 'order',
        orderId: order.id,
      });
      
      // Navigate to process order page
      navigate(`/process-order/${order.id}`);
    } catch (error) {
      console.error('Failed to accept order:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDecline = async () => {
    if (!order) return;
    setIsLoading(true);
    try {
      await updateOrderStatus(order.id, 'rejected');
      
      // Send notification to buyer
      await addNotification({
        userId: order.buyerId,
        title: 'Order Declined',
        message: `Your order for ${product?.name} has been declined by the seller.`,
        type: 'order',
        orderId: order.id,
      });
      
      navigate('/notifications');
    } catch (error) {
      console.error('Failed to decline order:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-6 pt-16">
      <TopNavigation title="Notification Details" showBack />
      
      <div className="p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm overflow-hidden"
        >
          {/* Notification Header */}
          <div className="p-4 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800">
              {notification.title}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {new Date(notification.createdAt).toLocaleString()}
            </p>
          </div>

          {/* Notification Content */}
          <div className="p-4">
            <p className="text-gray-700">{notification.message}</p>
          </div>

          {/* Order Details (if it's an order notification) */}
          {order && product && (
            <div className="p-4 bg-gray-50">
              <h3 className="font-semibold text-gray-800 mb-4">Order Details</h3>
              
              {/* Product Info */}
              <div className="bg-white rounded-lg p-4 mb-4">
                <div className="flex items-center">
                  <div className="w-16 h-16 rounded-lg overflow-hidden mr-4">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">{product.name}</h4>
                    <p className="text-sm text-gray-500">
                      {order.quantity} sack{order.quantity > 1 ? 's' : ''}
                    </p>
                    <p className="text-teal-600 font-semibold mt-1">
                      ₱{order.totalAmount.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons (only show if order is pending) */}
              {order.status === 'pending' && notification.type === 'order' && (
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    variant="outline"
                    onClick={handleDecline}
                    icon={<X size={18} />}
                    isLoading={isLoading}
                  >
                    Decline
                  </Button>
                  <Button
                    onClick={handleAccept}
                    icon={<Check size={18} />}
                    isLoading={isLoading}
                  >
                    Accept
                  </Button>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default NotificationDetails;