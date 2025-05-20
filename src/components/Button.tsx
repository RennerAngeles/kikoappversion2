import React from 'react';
import { cn } from '../lib/utils';
import { motion } from 'framer-motion';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  children,
  className,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  fullWidth = false,
  icon,
  ...props
}) => {
  // Base classes
  const baseClasses = 'rounded-lg font-medium transition-all duration-200 flex items-center justify-center';
  
  // Size classes
  const sizeClasses = {
    sm: 'text-sm px-3 py-1',
    md: 'text-base px-4 py-2',
    lg: 'text-lg px-6 py-3',
  };
  
  // Variant classes
  const variantClasses = {
    primary: 'bg-teal-600 text-white hover:bg-teal-700 active:bg-teal-800',
    secondary: 'bg-orange-500 text-white hover:bg-orange-600 active:bg-orange-700',
    outline: 'border border-teal-600 text-teal-600 hover:bg-teal-50 active:bg-teal-100',
    ghost: 'text-teal-600 hover:bg-teal-50 active:bg-teal-100',
    danger: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800',
  };
  
  // Width class
  const widthClass = fullWidth ? 'w-full' : '';
  
  // Disabled and loading classes
  const disabledClasses = (props.disabled || isLoading) 
    ? 'opacity-70 cursor-not-allowed' 
    : '';

  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      className={cn(
        baseClasses,
        sizeClasses[size],
        variantClasses[variant],
        widthClass,
        disabledClasses,
        className
      )}
      disabled={props.disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : icon ? (
        <span className="mr-2">{icon}</span>
      ) : null}
      {children}
    </motion.button>
  );
};

export default Button;