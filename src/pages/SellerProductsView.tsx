import React from 'react';
import { motion } from 'framer-motion';
import { useParams } from 'react-router-dom';
import { Package } from 'lucide-react';
import TopNavigation from '../components/TopNavigation';
import { useProducts } from '../context/ProductContext';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';

const SellerProductsView: React.FC = () => {
  const { sellerId } = useParams<{ sellerId: string }>();
  const { getProductsBySeller } = useProducts();
  const { getRegisteredUsers } = useAuth();
  const { getVerificationStatus } = useStore();
  
  const products = sellerId ? getProductsBySeller(sellerId) : [];
  const seller = getRegisteredUsers().find(user => user.id === sellerId);
  const verificationStatus = sellerId ? getVerificationStatus(sellerId) : undefined;
  
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
        title={`${verificationStatus.shop.name}'s Products`}
        showBack 
      />
      
      {products.length === 0 ? (
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
            <h3 className="text-lg font-semibold text-gray-800 mb-2">No Products Found</h3>
            <p className="text-gray-500 max-w-xs mx-auto">
              This seller hasn't added any products yet.
            </p>
          </motion.div>
        </div>
      ) : (
        <div className="p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-2 gap-4"
          >
            {products.map((product) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl overflow-hidden shadow-sm"
              >
                <div className="aspect-square">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-3">
                  <h3 className="font-medium text-gray-800 mb-1 truncate">
                    {product.name}
                  </h3>
                  <p className="text-teal-600 font-semibold">
                    ₱{product.price.toLocaleString()}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default SellerProductsView;