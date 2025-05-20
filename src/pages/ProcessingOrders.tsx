import React from 'react';
import { motion } from 'framer-motion';
import { Package, User } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import TopNavigation from '../components/TopNavigation';
import { useOrders } from '../context/OrderContext';
import { useProducts } from '../context/ProductContext';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';

const ProcessingOrders: React.FC = () => {
  const { sellerId } = useParams<{ sellerId: string }>();
  const navigate = useNavigate();
  const { getOrdersBySeller } = useOrders();
  const { getProductById } = useProducts();
  const { getRegisteredUsers } = useAuth();
  const { getVerificationStatus } = useStore();
  
  const seller = sellerId ? getRegisteredUsers().find(user => user.id === sellerId) : undefined;
  const verificationStatus = sellerId ? getVerificationStatus(sellerId) : undefined;
  const orders = sellerId ? getOrdersBySeller(sellerId).filter(order => 
    order.status === 'accepted' || order.status === 'shipped' || order.status === 'delivered'
  ) : [];

  if (!seller || !verificationStatus) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Seller not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-6 pt-16">
      <TopNavigation 
        title={`${verificationStatus.shop.name}'s Orders`}
        showBack 
      />
      
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
            <h3 className="text-lg font-semibold text-gray-800 mb-2">No Processing Orders</h3>
            <p className="text-gray-500 max-w-xs mx-auto">
              There are no orders being processed at the moment.
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
              const buyer = getRegisteredUsers().find(user => user.id === order.buyerId);
              if (!product || !buyer) return null;

              return (
                <motion.button
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="w-full bg-white rounded-xl p-4 shadow-sm text-left"
                  onClick={() => navigate(`/process-order/${order.id}`)}
                >
                  {/* Buyer Info */}
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                      {buyer.profilePhoto ? (
                        <img 
                          src={buyer.profilePhoto} 
                          alt={buyer.firstName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                          <User size={20} className="text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-800">
                        {buyer.firstName} {buyer.lastName}
                      </h3>
                      <p className="text-sm text-gray-500">{buyer.location}</p>
                    </div>
                  </div>

                  {/* Product Info */}
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

                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-sm text-gray-500">
                      Order placed on {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                    <p className="text-sm font-medium text-teal-600 mt-1">
                      Status: {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </p>
                  </div>
                </motion.button>
              );
            })}
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ProcessingOrders;