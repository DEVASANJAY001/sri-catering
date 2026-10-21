import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'leaf' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-[0.98] disabled:opacity-60 disabled:pointer-events-none disabled:active:scale-100 shadow-sm';

  const variantStyles = {
    primary:
      'bg-maroon-800 hover:bg-maroon-900 text-white focus:ring-maroon-700 shadow-maroon-900/10 hover:shadow-maroon-900/20',
    secondary:
      'bg-turmeric-500 hover:bg-turmeric-600 text-maroon-950 focus:ring-turmeric-400 font-bold',
    leaf:
      'bg-leaf-700 hover:bg-leaf-800 text-white focus:ring-leaf-600 shadow-leaf-900/10',
    outline:
      'border-2 border-maroon-800 text-maroon-800 hover:bg-maroon-50 focus:ring-maroon-700 bg-transparent',
    ghost:
      'text-charcoal hover:bg-stone-100 focus:ring-stone-400 shadow-none',
    danger:
      'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500 shadow-red-900/10',
  };

  const sizeStyles = {
    sm: 'text-xs md:text-sm px-3.5 py-1.5 gap-1.5',
    md: 'text-sm md:text-base px-5 py-2.5 gap-2',
    lg: 'text-base md:text-lg px-7 py-3.5 gap-2.5',
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin mr-2" />
      ) : leftIcon ? (
        <span className="shrink-0">{leftIcon}</span>
      ) : null}
      <span>{children}</span>
      {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
    </button>
  );
};
