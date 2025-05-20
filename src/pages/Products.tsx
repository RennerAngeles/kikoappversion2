import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Package, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import TopNavigation from '../components/TopNavigation';
import BottomNavigation from '../components/BottomNavigation';
import { useProducts } from '../context/ProductContext';
import { useNotifications } from '../context/NotificationContext';
import { useAuth } from '../context/AuthContext';

const Products: React.FC = () => {
  const navigate = useNavigate();
  const { products } = useProducts();
  const { getUnreadCount } = useNotifications();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const unreadCount = user ? getUnreadCount(user.id!) : 0;
  
  return (
    <div className="min-h-screen bg-gray-50 pb-20 pt-16">
      <TopNavigation 
        title="Products" 
        rightContent={
          <button
            onClick={() => navigate('/notifications')}
            className="relative text-gray-600"
          >
            <Bell size={24} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>
        }
      />
      
      {/* Search and Filter */}
      <div className="px-4 py-4">
        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white rounded-full pl-12 pr-4 py-3 text-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent shadow-sm"
          />
          <Search 
            size={18} 
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" 
          />
          <button className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
            <Filter size={18} />
          </button>
        </div>
      </div>
      
      {filteredProducts.length === 0 ? (
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
              {searchTerm 
                ? 'No products match your search criteria.' 
                : 'There are currently no products available.'}
            </p>
          </motion.div>
        </div>
      ) : (
        <div className="px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-2 gap-4"
          >
            {filteredProducts.map((product) => (
              <motion.button
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl overflow-hidden shadow-sm text-left"
                onClick={() => navigate(`/product/${product.id}`)}
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
              </motion.button>
            ))}
          </motion.div>
        </div>
      )}
      
      <BottomNavigation />
    </div>
  );
};

export default Products;