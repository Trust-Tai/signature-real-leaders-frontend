import React from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  variant?: 'default' | 'verification' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  error?: string;
  className?: string;
  labelClassName?: string;
}

const Input: React.FC<InputProps> = ({
  variant = 'default',
  size = 'md',
  label,
  error,
  className,
  labelClassName,
  ...props
}) => {
  const baseClasses = 'w-full rounded-lg border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed input-text transform hover:scale-[1.02] hover:shadow-lg focus:scale-[1.02] focus:shadow-xl';
  
  const variants = {
    default: 'border-gray-300 bg-white text-gray-900 focus:border-custom-red focus:ring-custom-red placeholder:text-gray-500 hover:border-gray-400 hover:shadow-gray-200/50 focus:shadow-custom-red/25',
    verification: 'border-custom-red-border bg-white text-gray-900 focus:border-custom-red focus:ring-custom-red text-center font-mono text-lg hover:border-red-400 hover:shadow-red-200/50 focus:shadow-custom-red/25',
    outline: 'border-2 border-gray-600 bg-transparent text-white focus:border-custom-red focus:ring-custom-red placeholder:text-gray-400 hover:border-gray-500 hover:shadow-white/10 focus:shadow-custom-red/25'
  };
  
  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3 text-base',
    lg: 'px-6 py-4 text-lg'
  };

  return (
    <div className="w-full">
      {label && (
        <label className={cn("block text-sm font-medium mb-2", labelClassName ?? 'text-white')}>
          {label}
        </label>
      )}
      <input
        className={cn(
          baseClasses,
          variants[variant],
          sizes[size],
          error && 'border-custom-red focus:border-custom-red focus:ring-custom-red',
          className
        )}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-custom-red">{error}</p>
      )}
    </div>
  );
};

export default Input;
