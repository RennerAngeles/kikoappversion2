import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Package, Trash2, Edit2, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import TopNavigation from '../components/TopNavigation';
import BottomNavigation from '../components/BottomNavigation';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';
import { useProducts } from '../context/ProductContext';
import { useStore } from '../context/StoreContext';

const SellerProducts: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getProductsBySeller, deleteProduct } = useProducts();
  const { getVerificationStatus } = useStore();
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  const products = user ? getProductsBySeller(user.id!) : [];
  const verificationStatus = user ? getVerificationStatus(user.id!) : undefined;

  const handleDelete = async (productId: string) => {
    const success = await deleteProduct(productId);
    if (success) {
      setSuccessMessage('Product deleted successfully!');
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 pb-20 pt-16">
      <TopNavigation 
        title="My Products" 
        showBack
      />

      {showSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-20 left-4 right-4 bg-green-50 border border-green-100 text-green-700 px-4 py-3 rounded-lg shadow-lg z-50 flex items-center justify-center"
        >
          {successMessage}
        </motion.div>
      )}

      {/* Restriction Banner */}
      {verificationStatus?.restricted && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-4 mt-4 bg-red-50 border border-red-100 text-red-700 px-4 py-3 rounded-lg"
        >
          <div className="flex items-start">
            <AlertCircle size={20} className="mr-2 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold mb-1">Account Restricted</h3>
              <p className="text-sm">{verificationStatus.restrictionReason}</p>
            </div>
          </div>
        </motion.div>
      )}
      
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
            <h3 className="text-lg font-semibold text-gray-800 mb-2">No Products Yet</h3>
            <p className="text-gray-500 max-w-xs mx-auto mb-8">
              Start adding products to your store to begin selling.
            </p>
          </motion.div>
        </div>
      ) : (
        <div className="p-4">
          <AnimatePresence>
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
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white rounded-xl overflow-hidden shadow-sm relative group cursor-pointer"
                  onClick={() => !verificationStatus?.restricted && navigate(`/seller/add-product?edit=${product.id}`)}
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
                  <div className="absolute top-2 right-2 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    {verificationStatus?.restricted ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(product.id);
                        }}
                        className="bg-red-500 text-white p-2 rounded-full"
                      >
                        <Trash2 size={16} />
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/seller/add-product?edit=${product.id}`);
                          }}
                          className="bg-teal-500 text-white p-2 rounded-full"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(product.id);
                          }}
                          className="bg-red-500 text-white p-2 rounded-full"
                        >
                          <Trash2 size={16} />
                        </button>
                      </>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      )}
      
      {!verificationStatus?.restricted && (
        <motion.div 
          className="fixed bottom-24 right-4 z-50"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Button
            onClick={() => navigate('/seller/add-product')}
            className="w-14 h-14 rounded-full shadow-lg p-0 flex items-center justify-center"
          >
            <Plus size={24} />
          </Button>
        </motion.div>
      )}
      
      <BottomNavigation />
    </div>
  );
};

export default SellerProducts;