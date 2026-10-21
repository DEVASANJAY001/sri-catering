import React from 'react';

interface KolamDividerProps {
  className?: string;
  theme?: 'gold' | 'maroon' | 'leaf';
}

export const KolamDivider: React.FC<KolamDividerProps> = ({
  className = '',
  theme = 'gold',
}) => {
  const lineColor =
    theme === 'maroon'
      ? 'from-transparent via-maroon-700 to-transparent'
      : theme === 'leaf'
      ? 'from-transparent via-leaf-600 to-transparent'
      : 'from-transparent via-gold to-transparent';

  const dotColor =
    theme === 'maroon'
      ? 'bg-maroon-700'
      : theme === 'leaf'
      ? 'bg-leaf-600'
      : 'bg-gold';

  return (
    <div className={`flex items-center justify-center space-x-2 my-2.5 ${className}`}>
      <div className={`h-[1px] w-12 sm:w-20 bg-gradient-to-r ${lineColor}`} />
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
      <div className={`h-[1px] w-12 sm:w-20 bg-gradient-to-l ${lineColor}`} />
    </div>
  );
};
