import { HTMLAttributes, forwardRef } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'bordered' | 'gradient';
  hover?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ children, variant = 'default', hover = false, className = '', ...props }, ref) => {
    const baseStyles = 'p-3 rounded-xl transition-all';
    
    const variants = {
      default: 'bg-[#0f1419] border border-gray-800',
      bordered: 'bg-[#1a1f2e] border border-gray-700',
      gradient: 'bg-gradient-to-br from-emerald-900/20 to-teal-900/20 border border-emerald-500/30',
    };
    
    const hoverStyles = hover ? 'hover:border-emerald-400/50 cursor-pointer' : '';

    return (
      <div
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${hoverStyles} ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';