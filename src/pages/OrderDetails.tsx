import React from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { User, MapPin, Phone, Package, CheckCircle, XCircle } from 'lucide-react';
import TopNavigation from '../components/TopNavigation';
import { useOrders } from '../context/OrderContext';
import { useProducts } from '../context/ProductContext';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';

const OrderDetails: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { getOrderById } = useOrders();
  const { getProductById } = useProducts();
  const { getRegisteredUsers, user } = useAuth();
  const { getVerificationStatus } = useStore();
  
  const order = orderId ? getOrderById(orderId) : undefined;
  const product = order ? getProductById(order.productId) : undefined;
  const sellerVerification = product ? getVerificationStatus(product.sellerId) : undefined;
  const seller = sellerVerification?.user;
  const shop = sellerVerification?.shop;

  // Check if current user is admin
  const isAdmin = user?.email === 'admin@gmail.com';

  if (!order || !product || !seller || !shop) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Order not found</p>
      </div>
    );
  }

  const getStatusIcon = () => {
    switch (order.status) {
      case 'accepted':
        return <CheckCircle size={32} className="text-green-600" />;
      case 'rejected':
        return <XCircle size={32} className="text-red-600" />;
      case 'cancelled':
        return <XCircle size={32} className="text-gray-600" />;
      case 'shipped':
        return <Package size={32} className="text-blue-600" />;
      case 'delivered':
        return <CheckCircle size={32} className="text-green-600" />;
      default:
        return <Package size={32} className="text-yellow-600" />;
    }
  };

  const getStatusColor = () => {
    switch (order.status) {
      case 'accepted':
        return 'bg-green-100';
      case 'rejected':
        return 'bg-red-100';
      case 'cancelled':
        return 'bg-gray-100';
      case 'shipped':
        return 'bg-blue-100';
      case 'delivered':
        return 'bg-green-100';
      default:
        return 'bg-yellow-100';
    }
  };

  const getStatusText = () => {
    switch (order.status) {
      case 'accepted':
        return 'Order Accepted';
      case 'rejected':
        return 'Order Rejected';
      case 'cancelled':
        return 'Order Cancelled';
      case 'shipped':
        return 'Order Shipped';
      case 'delivered':
        return 'Order Delivered';
      default:
        return 'Order Pending';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-6 pt-16">
      <TopNavigation title="Order Details" showBack />
      
      <div className="p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {/* Order Status */}
          <div className="bg-white rounded-xl p-6 shadow-sm text-center">
            <div className="flex justify-center mb-4">
              <div className={`w-16 h-16 ${getStatusColor()} rounded-full flex items-center justify-center`}>
                {getStatusIcon()}
              </div>
            </div>
            <h2 className="text-xl font-bold text-gray-800">
              {getStatusText()}
            </h2>
            <p className="text-gray-600 mt-2">
              {new Date(order.createdAt).toLocaleDateString()}
            </p>
          </div>

          {/* Seller Info */}
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <h3 className="font-semibold text-gray-800 mb-4">Seller Information</h3>
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                {seller.profilePhoto ? (
                  <img 
                    src={seller.profilePhoto} 
                    alt={`${seller.firstName} ${seller.lastName}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                    <User size={24} className="text-gray-400" />
                  </div>
                )}
              </div>
              <div>
                <h4 className="font-medium text-gray-800">{shop.name}</h4>
                <p className="text-sm text-gray-500">
                  {seller.firstName} {seller.lastName}
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center text-gray-600">
                <MapPin size={18} className="mr-2" />
                <span className="text-sm">{shop.location}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Phone size={18} className="mr-2" />
                <span className="text-sm">{shop.contact}</span>
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <h3 className="font-semibold text-gray-800 mb-4">Product Information</h3>
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
        </motion.div>
      </div>
    </div>
  );
};

export default OrderDetails;