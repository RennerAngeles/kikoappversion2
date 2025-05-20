import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Package } from 'lucide-react';
import TopNavigation from '../components/TopNavigation';
import BottomNavigation from '../components/BottomNavigation';
import { CategoryType } from '../types';
import { useProducts } from '../context/ProductContext';

const CategoryProducts: React.FC = () => {
  const { category } = useParams<{ category: CategoryType }>();
  const navigate = useNavigate();
  const { getProductsByCategory } = useProducts();
  
  const products = category ? getProductsByCategory(category) : [];
  
  const getCategoryTitle = (category: string | undefined) => {
    switch(category) {
      case 'vegetable':
        return 'Vegetables';
      case 'fruit':
        return 'Fruits';
      case 'seafood':
        return 'Seafoods';
      case 'rice':
        return 'Rice';
      default:
        return 'Products';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 pt-16">
      <TopNavigation title={getCategoryTitle(category)} showBack />
      
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
            <h3 className="text-lg font-semibold text-gray-800 mb-2">No Products Available</h3>
            <p className="text-gray-500 max-w-xs mx-auto">
              There are currently no products in this category.
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

export default CategoryProducts;