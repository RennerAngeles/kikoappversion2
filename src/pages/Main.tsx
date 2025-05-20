import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import TopNavigation from '../components/TopNavigation';
import BottomNavigation from '../components/BottomNavigation';
import CategoryIcon from '../components/CategoryIcon';
import { Category, CategoryType } from '../types';
import { cn } from '../lib/utils';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';

const categories: Category[] = [
  { type: 'vegetable', text: 'Vegetables' },
  { type: 'fruit', text: 'Fruits' },
  { type: 'seafood', text: 'Seafoods' },
  { type: 'rice', text: 'Rices' },
];

const monthlySpecials = [
  {
    id: 1,
    title: 'Summer Specials',
    description: 'Fresh seasonal favorites',
    bgColor: 'bg-orange-100',
    textColor: 'text-orange-800',
  },
  {
    id: 2,
    title: 'Organic Collection',
    description: 'Pesticide-free selection',
    bgColor: 'bg-green-100',
    textColor: 'text-green-800',
  },
  {
    id: 3,
    title: 'Local Farmers',
    description: 'Support your community',
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-800',
  },
];

const Main: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { welcomeImage } = useApp();
  const [activeSpecial, setActiveSpecial] = React.useState(0);
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 300, damping: 24 }
    }
  };
  
  // Handle swipe for monthly specials
  const handleDragEnd = (e: any, { offset, velocity }: any) => {
    const swipe = offset.x < -50 || velocity.x < -0.5;
    
    if (swipe && activeSpecial < monthlySpecials.length - 1) {
      setActiveSpecial(activeSpecial + 1);
    } else if (offset.x > 50 || velocity.x > 0.5) {
      if (activeSpecial > 0) {
        setActiveSpecial(activeSpecial - 1);
      }
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 pb-20 pt-16">
      <TopNavigation showStore title={`Welcome, ${user?.firstName || 'User'}`} />
      
      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="px-4 py-4"
      >
        <div className="relative rounded-2xl overflow-hidden h-40">
          <img
            src={welcomeImage}
            alt="Welcome to Kiko app"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-teal-600/80 to-transparent flex items-center">
            <div className="p-6">
              <h2 className="text-white text-2xl font-bold mb-2">Welcome to KikoApp</h2>
              <p className="text-white/90 text-sm max-w-[200px]">
                Fresh groceries delivered to your doorstep
              </p>
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Monthly Specials */}
      <div className="px-4 py-2 mb-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold text-gray-800">Monthly Specials</h3>
          <span className="text-sm text-teal-600">
            {activeSpecial + 1}/{monthlySpecials.length}
          </span>
        </div>
        
        <motion.div
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          onDragEnd={handleDragEnd}
          className="cursor-grab active:cursor-grabbing"
        >
          <div className="flex overflow-hidden">
            <motion.div
              animate={{ x: `-${activeSpecial * 100}%` }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="flex w-full flex-shrink-0"
            >
              {monthlySpecials.map((special) => (
                <div 
                  key={special.id} 
                  className={cn(
                    'w-full flex-shrink-0 p-5 rounded-xl mr-4',
                    special.bgColor
                  )}
                >
                  <h4 className={cn('text-xl font-bold mb-1', special.textColor)}>
                    {special.title}
                  </h4>
                  <p className="text-sm text-gray-600 mb-3">
                    {special.description}
                  </p>
                  <button className="text-sm font-medium flex items-center text-teal-600">
                    View offers <ChevronRight size={16} className="ml-1" />
                  </button>
                </div>
              ))}
            </motion.div>
          </div>
        </motion.div>
        
        <div className="flex justify-center mt-3">
          {monthlySpecials.map((_, index) => (
            <button
              key={index}
              className={cn(
                'w-2 h-2 mx-1 rounded-full transition-colors',
                index === activeSpecial ? 'bg-teal-600' : 'bg-gray-300'
              )}
              onClick={() => setActiveSpecial(index)}
            />
          ))}
        </div>
      </div>
      
      {/* Categories */}
      <div className="px-4 py-2">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Categories</h3>
        
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 gap-4"
        >
          {categories.map((category) => (
            <motion.button
              key={category.type}
              variants={itemVariants}
              whileTap={{ scale: 0.95 }}
              className="bg-white p-4 rounded-xl shadow-sm flex items-center space-x-3 border border-gray-100"
              onClick={() => navigate(`/category/${category.type}`)}
            >
              <div className="w-12 h-12 rounded-full flex items-center justify-center bg-gray-100">
                <CategoryIcon type={category.type} />
              </div>
              <span className="font-medium text-gray-800">{category.text}</span>
            </motion.button>
          ))}
        </motion.div>
      </div>
            
      <BottomNavigation />
    </div>
  );
};

export default Main;