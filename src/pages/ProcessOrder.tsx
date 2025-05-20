import React from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { Package, User, MapPin, Phone } from 'lucide-react';
import TopNavigation from '../components/TopNavigation';
import Button from '../components/Button';
import { useOrders } from '../context/OrderContext';
import { useProducts } from '../context/ProductContext';
import { useAuth } from '../context/AuthContext';

const ProcessOrder: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { getOrderById } = useOrders();
  const { getProductById } = useProducts();
  const { getRegisteredUsers, user } = useAuth();
  
  const order = orderId ? getOrderById(orderId) : undefined;
  const product = order ? getProductById(order.productId) : undefined;
  const buyer = order ? getRegisteredUsers().find(user => user.id === order.buyerId) : undefined;

  // Check if current user is admin
  const isAdmin = user?.email === 'admin@gmail.com';

  if (!order || !product || !buyer) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Order not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-6 pt-16">
      <TopNavigation title="Process Order" showBack />
      
      <div className="p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {/* Order Status */}
          <div className="bg-white rounded-xl p-6 shadow-sm text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center">
                <Package size={32} className="text-teal-600" />
              </div>
            </div>
            <h2 className="text-xl font-bold text-gray-800">Processing Order</h2>
            <p className="text-gray-600 mt-2">
              Order placed on {new Date(order.createdAt).toLocaleDateString()}
            </p>
          </div>

          {/* Buyer Info */}
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <h3 className="font-semibold text-gray-800 mb-4">Buyer Information</h3>
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                {buyer.profilePhoto ? (
                  <img 
                    src={buyer.profilePhoto} 
                    alt={`${buyer.firstName} ${buyer.lastName}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                    <User size={24} className="text-gray-400" />
                  </div>
                )}
              </div>
              <div>
                <h4 className="font-medium text-gray-800">
                  {buyer.firstName} {buyer.lastName}
                </h4>
                <p className="text-sm text-gray-500">{buyer.email}</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center text-gray-600">
                <MapPin size={18} className="mr-2" />
                <span className="text-sm">{buyer.location}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Phone size={18} className="mr-2" />
                <span className="text-sm">{buyer.contact}</span>
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

          {/* Action Buttons - Only visible for admin */}
          {isAdmin && (
            <div className="space-y-3">
              <Button 
                onClick={() => navigate(`/shipping/${order.id}`)}
                fullWidth
              >
                Mark as Shipped
              </Button>
              <Button 
                onClick={() => navigate(`/delivered/${order.id}`)}
                fullWidth
              >
                Mark as Delivered
              </Button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ProcessOrder;