import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { Truck, CheckCircle } from 'lucide-react';
import TopNavigation from '../components/TopNavigation';
import Button from '../components/Button';
import { useOrders } from '../context/OrderContext';
import { useNotifications } from '../context/NotificationContext';

const Shipping: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { getOrderById, updateOrderStatus } = useOrders();
  const { addNotification } = useNotifications();
  const [isApproved, setIsApproved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleApprove = async () => {
    if (!orderId) return;
    
    setIsLoading(true);
    try {
      const order = getOrderById(orderId);
      if (order) {
        // Update order status to include shipping approval
        await updateOrderStatus(orderId, 'shipped');
        
        // Send notification to buyer
        await addNotification({
          userId: order.buyerId,
          title: 'Order Shipped',
          message: 'Your order has been shipped and is on its way!',
          type: 'order',
          orderId: order.id,
        });
        
        setIsApproved(true);
        setTimeout(() => {
          navigate('/admin');
        }, 1500);
      }
    } catch (error) {
      console.error('Failed to approve shipping:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-6 pt-16">
      <TopNavigation title="Shipping Details" showBack />
      
      <div className="p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-6 shadow-sm text-center"
        >
          {isApproved ? (
            <>
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle size={32} className="text-green-600" />
                </div>
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                Shipping Approved!
              </h2>
              <p className="text-gray-600">
                The order has been marked as shipped and the customer will be notified.
              </p>
            </>
          ) : (
            <>
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center">
                  <Truck size={32} className="text-teal-600" />
                </div>
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                Shipping Approval
              </h2>
              <p className="text-gray-600 mb-6">
                Click the button below to approve shipping for this order.
              </p>
              <Button
                onClick={handleApprove}
                icon={<Truck size={20} />}
                fullWidth
                isLoading={isLoading}
              >
                Approve Shipping
              </Button>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Shipping;