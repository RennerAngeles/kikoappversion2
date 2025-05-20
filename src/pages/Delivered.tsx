import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, Package } from 'lucide-react';
import TopNavigation from '../components/TopNavigation';
import Button from '../components/Button';
import { useOrders } from '../context/OrderContext';
import { useNotifications } from '../context/NotificationContext';

const Delivered: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { updateOrderStatus, getOrderById } = useOrders();
  const { addNotification } = useNotifications();
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    if (!orderId) return;
    
    setIsLoading(true);
    try {
      const order = getOrderById(orderId);
      if (order) {
        // Update order status to delivered
        await updateOrderStatus(orderId, 'delivered');
        
        // Send notification to buyer
        await addNotification({
          userId: order.buyerId,
          title: 'Order Delivered',
          message: 'Your order has been delivered successfully!',
          type: 'order',
          orderId: order.id,
        });
        
        setIsConfirmed(true);
        setTimeout(() => {
          navigate('/admin');
        }, 1500);
      }
    } catch (error) {
      console.error('Failed to confirm delivery:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-6 pt-16">
      <TopNavigation title="Delivery Confirmation" showBack />
      
      <div className="p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-6 shadow-sm text-center"
        >
          {isConfirmed ? (
            <>
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle size={32} className="text-green-600" />
                </div>
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                Product Delivered Successfully!
              </h2>
              <p className="text-gray-600">
                The delivery has been confirmed and the customer will be notified. 😊
              </p>
            </>
          ) : (
            <>
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center">
                  <Package size={32} className="text-teal-600" />
                </div>
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                Confirm Product Delivery
              </h2>
              <p className="text-gray-600 mb-6">
                Please confirm that the product has been delivered to the customer.
              </p>
              <Button
                onClick={handleConfirm}
                icon={<CheckCircle size={20} />}
                fullWidth
                isLoading={isLoading}
              >
                Confirm Delivery
              </Button>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Delivered;