import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'maroon' | 'turmeric' | 'leaf' | 'gold' | 'charcoal' | 'outline';
  size?: 'sm' | 'md';
  className?: string;
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'maroon',
  size = 'md',
  className = '',
  dot = false,
}) => {
  const variantStyles = {
    maroon: 'bg-maroon-50 text-maroon-800 border-maroon-200',
    turmeric: 'bg-amber-50 text-amber-900 border-amber-300',
    leaf: 'bg-leaf-50 text-leaf-800 border-leaf-200',
    gold: 'bg-amber-100/70 text-amber-900 border-amber-400/50',
    charcoal: 'bg-stone-100 text-stone-800 border-stone-300',
    outline: 'bg-transparent text-charcoal border-stone-300',
  };

  const sizeStyles = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs md:text-sm px-3 py-1',
  };

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border transition-colors ${
        variantStyles[variant]
      } ${sizeStyles[size]} ${className}`}
    >
      {dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
            variant === 'leaf'
              ? 'bg-leaf-600'
              : variant === 'maroon'
              ? 'bg-maroon-600'
              : variant === 'turmeric'
              ? 'bg-amber-500'
              : 'bg-gold-dark'
          }`}
        />
      )}
      {children}
    </span>
  );
};
