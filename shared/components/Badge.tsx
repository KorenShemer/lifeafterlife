import { HTMLAttributes, forwardRef } from 'react';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'success' | 'warning' | 'error' | 'info' | 'default';
  size?: 'sm' | 'md';
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ children, variant = 'default', size = 'md', className = '', ...props }, ref) => {
    const baseStyles = 'inline-flex items-center gap-1 font-medium rounded';
    
    const variants = {
      success: 'bg-emerald-400/20 text-emerald-400',
      warning: 'bg-yellow-400/20 text-yellow-400',
      error: 'bg-red-400/20 text-red-400',
      info: 'bg-blue-400/20 text-blue-400',
      default: 'bg-gray-800 text-gray-300',
    };
    
    const sizes = {
      sm: 'px-2 py-0.5 text-xs',
      md: 'px-2 py-1 text-xs',
    };

    return (
      <span
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';