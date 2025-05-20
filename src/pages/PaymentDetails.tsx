import React from 'react';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { CreditCard, MapPin } from 'lucide-react';
import TopNavigation from '../components/TopNavigation';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../context/OrderContext';
import { useNotifications } from '../context/NotificationContext';
import { useMessages } from '../context/MessageContext';

interface LocationState {
  productId: string;
  sellerId: string;
  quantity: number;
  price: number;
  productName: string;
  productImage: string;
}

const PLATFORM_FEE = 20; // Fixed platform fee of 20 pesos

const PaymentDetails: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addOrder } = useOrders();
  const { addNotification } = useNotifications();
  const { startConversation } = useMessages();
  const [isLoading, setIsLoading] = React.useState(false);
  
  const state = location.state as LocationState;
  
  if (!state || !user) {
    navigate('/products');
    return null;
  }
  
  const { productId, sellerId, quantity, price, productName, productImage } = state;
  
  // Calculate delivery fee based on user's location
  const getDeliveryFee = () => {
    const location = user.location.toLowerCase();
    if (location.includes('manila')) return 50;
    if (location.includes('quezon')) return 80;
    if (location.includes('makati')) return 60;
    if (location.includes('pasig')) return 70;
    return 100; // Default delivery fee for other locations
  };
  
  const itemTotal = price * quantity;
  const deliveryFee = getDeliveryFee();
  const totalAmount = itemTotal + deliveryFee + PLATFORM_FEE;

  const handlePlaceOrder = async () => {
    setIsLoading(true);
    try {
      // Create order
      const orderId = await addOrder({
        productId,
        buyerId: user.id!,
        sellerId,
        quantity,
        totalAmount,
      });

      // Add notification for seller
      await addNotification({
        userId: sellerId,
        title: 'New Order Received',
        message: `${user.firstName} ${user.lastName} ordered ${quantity} sack${quantity > 1 ? 's' : ''} of ${productName}`,
        type: 'order',
        orderId,
      });

      // Start conversation between buyer and seller
      await startConversation(user.id!, sellerId, productId);

      // Navigate to orders page
      navigate('/orders');
    } catch (error) {
      console.error('Failed to place order:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-6 pt-16">
      <TopNavigation title="Payment Details" showBack />
      
      <div className="p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {/* Product Summary */}
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <h3 className="font-semibold text-gray-800 mb-4">Order Summary</h3>
            <div className="flex items-center">
              <div className="w-16 h-16 rounded-lg overflow-hidden mr-4">
                <img 
                  src={productImage} 
                  alt={productName}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h4 className="font-medium text-gray-800">{productName}</h4>
                <p className="text-sm text-gray-500">
                  {quantity} sack{quantity > 1 ? 's' : ''}
                </p>
                <p className="text-teal-600 font-semibold mt-1">
                  ₱{price.toLocaleString()} each
                </p>
              </div>
            </div>
          </div>

          {/* Delivery Address */}
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <h3 className="font-semibold text-gray-800 mb-4">Delivery Address</h3>
            <div className="flex items-center text-gray-700">
              <MapPin size={18} className="text-teal-600 mr-3" />
              <span>{user.location}</span>
            </div>
          </div>

          {/* Payment Breakdown */}
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <h3 className="font-semibold text-gray-800 mb-4">Payment Details</h3>
            
            <div className="space-y-3">
              <div className="flex justify-between text-gray-600">
                <span>Item Total</span>
                <span>₱{itemTotal.toLocaleString()}</span>
              </div>
              
              <div className="flex justify-between text-gray-600">
                <span>Delivery Fee</span>
                <span>₱{deliveryFee.toLocaleString()}</span>
              </div>
              
              <div className="flex justify-between text-gray-600">
                <span>Platform Fee</span>
                <span>₱{PLATFORM_FEE.toLocaleString()}</span>
              </div>
              
              <div className="border-t border-gray-100 pt-3">
                <div className="flex justify-between font-semibold">
                  <span className="text-gray-800">Total Amount</span>
                  <span className="text-teal-600">₱{totalAmount.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Place Order Button */}
          <Button
            fullWidth
            onClick={handlePlaceOrder}
            icon={<CreditCard size={20} />}
            isLoading={isLoading}
          >
            Place Order
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default PaymentDetails