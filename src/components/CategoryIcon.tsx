import React from 'react';
import { Leaf, Apple, Fish, Wheat } from 'lucide-react';
import { CategoryType } from '../types';
import { cn } from '../lib/utils';

interface CategoryIconProps {
  type: CategoryType;
  size?: number;
  className?: string;
}

const CategoryIcon: React.FC<CategoryIconProps> = ({ 
  type, 
  size = 24, 
  className 
}) => {
  const getIcon = () => {
    switch(type) {
      case 'vegetable':
        return <Leaf size={size} className={cn('text-green-500', className)} />;
      case 'fruit':
        return <Apple size={size} className={cn('text-red-500', className)} />;
      case 'seafood':
        return <Fish size={size} className={cn('text-blue-500', className)} />;
      case 'rice':
        return <Wheat size={size} className={cn('text-yellow-600', className)} />;
      default:
        return <Leaf size={size} className={className} />;
    }
  };

  return getIcon();
};

export default CategoryIcon;