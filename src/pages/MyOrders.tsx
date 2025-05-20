import React from 'react';
import { motion } from 'framer-motion';
import { Package, User, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import TopNavigation from '../components/TopNavigation';
import BottomNavigation from '../components/BottomNavigation';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../context/OrderContext';
import { useProducts } from '../context/ProductContext';
import { useStore } from '../context/StoreContext';
import { useNotifications } from '../context/NotificationContext';

const MyOrders: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getOrdersByBuyer, updateOrderStatus } = useOrders();
  const { getProductById } = useProducts();
  const { getVerificationStatus } = useStore();
  const { addNotification } = useNotifications();
  const [isLoading, setIsLoading] = React.useState(false);
  
  const orders = user ? getOrdersByBuyer(user.id!) : [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted':
        return 'bg-green-100 text-green-700';
      case 'rejected':
        return 'bg-red-100 text-red-700';
      case 'cancelled':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-yellow-100 text-yellow-700';
    }
  };

  const handleCancel = async (orderId: string, productId: string, sellerId: string) => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      await updateOrderStatus(orderId, 'cancelled');
      
      const product = getProductById(productId);
      if (product) {
        // Notify seller about cancellation
        await addNotification({
          userId: sellerId,
          title: 'Order Cancelled',
          message: `Order for ${product.name} has been cancelled by the buyer.`,
          type: 'order',
          orderId,
        });
      }
    } catch (error) {
      console.error('Failed to cancel order:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBuyAgain = (productId: string) => {
    navigate(`/product/${productId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 pt-16">
      <TopNavigation title="My Orders" showBack />
      
      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center px-4 py-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package size={24} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">No Orders Yet</h3>
            <p className="text-gray-500 max-w-xs mx-auto">
              Your order history will appear here once you make a purchase.
            </p>
          </motion.div>
        </div>
      ) : (
        <div className="p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            {orders.map((order) => {
              const product = getProductById(order.productId);
              const sellerVerification = product ? getVerificationStatus(product.sellerId) : undefined;
              const seller = sellerVerification?.user;
              const shop = sellerVerification?.shop;

              if (!product || !seller || !shop) return null;

              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-xl overflow-hidden shadow-sm"
                >
                  {/* Order Header */}
                  <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                        {seller.profilePhoto ? (
                          <img 
                            src={seller.profilePhoto} 
                            alt={seller.firstName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                            <User size={20} className="text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-800">{shop.name}</h3>
                        <p className="text-xs text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <span className={`text-xs px-3 py-1 rounded-full ${getStatusColor(order.status)}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>

                  {/* Order Content */}
                  <div className="p-4">
                    <button
                      className="w-full text-left"
                      onClick={() => navigate(`/orders/${order.id}`)}
                      disabled={order.status === 'cancelled'}
                    >
                      <div className="flex items-center">
                        <div className="w-16 h-16 rounded-lg overflow-hidden mr-4">
                          <img 
                            src={product.image} 
                            alt={product.name}
                            className={`w-full h-full object-cover ${order.status === 'cancelled' ? 'opacity-50' : ''}`}
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
                    </button>

                    {/* Action Buttons */}
                    <div className="mt-4">
                      {order.status === 'pending' && (
                        <Button
                          variant="outline"
                          fullWidth
                          onClick={() => handleCancel(order.id, order.productId, order.sellerId)}
                          isLoading={isLoading}
                        >
                          Cancel Order
                        </Button>
                      )}
                      {order.status === 'cancelled' && (
                        <Button
                          fullWidth
                          onClick={() => handleBuyAgain(order.productId)}
                          icon={<RefreshCw size={18} />}
                        >
                          Buy Again
                        </Button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      )}
      
      <BottomNavigation />
    </div>
  );
};

export default MyOrders;