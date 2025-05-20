import React, { forwardRef } from 'react';
import { cn } from '../lib/utils';
import { ChevronDownIcon } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  label?: string;
  options: SelectOption[];
  error?: string;
  onChange?: (value: string) => void;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, error, className, onChange, ...props }, ref) => {
    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
      if (event?.target?.value !== undefined) {
        onChange?.(event.target.value);
      }
    };

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
          <select
            ref={ref}
            className={cn(
              'w-full appearance-none px-4 py-2 pr-10 rounded-lg border text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 transition-all duration-200',
              error 
                ? 'border-red-500 focus:border-red-500 focus:ring-red-200' 
                : 'border-gray-300 focus:border-teal-500 focus:ring-teal-200',
              className
            )}
            onChange={handleChange}
            {...props}
          >
            <option value="" disabled>Select an option</option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
            <ChevronDownIcon size={18} />
          </div>
        </div>
        
        {error && (
          <p className="text-sm text-red-500 mt-1">{error}</p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select;