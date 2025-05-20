import React from 'react';
import { motion } from 'framer-motion';
import { useParams } from 'react-router-dom';
import { Package } from 'lucide-react';
import TopNavigation from '../components/TopNavigation';

const OrderStatus: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();

  return (
    <div className="min-h-screen bg-gray-50 pb-6 pt-16">
      <TopNavigation title="Order Status" showBack />
      
      <div className="p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-6 shadow-sm text-center"
        >
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
              <Package size={32} className="text-orange-600" />
            </div>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            Your Order is Being Processed
          </h2>
          <p className="text-gray-600">
            Hang tight! Our seller is preparing your order with care. 
            We'll keep you updated on its progress. 😊
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default OrderStatus;