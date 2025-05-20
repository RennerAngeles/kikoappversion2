import React, { forwardRef } from 'react';
import { cn } from '../lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, icon, ...props }, ref) => {
    return (
      <div className="space-y-1 w-full">
        {label && (
          <label 
            htmlFor={props.id} 
            className="text-sm font-medium text-gray-700 block"
          >
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
              {icon}
            </div>
          )}
          
          <input
            ref={ref}
            className={cn(
              'w-full px-4 py-2 rounded-lg border text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 transition-all duration-200',
              error 
                ? 'border-red-500 focus:border-red-500 focus:ring-red-200' 
                : 'border-gray-300 focus:border-teal-500 focus:ring-teal-200',
              icon && 'pl-10',
              className
            )}
            {...props}
          />
        </div>
        
        {error && (
          <p className="text-sm text-red-500 mt-1">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;