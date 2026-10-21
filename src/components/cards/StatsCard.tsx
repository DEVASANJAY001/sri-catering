import React from 'react';

interface StatsCardProps {
  title: string;
  count: number | string;
  icon: React.ReactNode;
  variant?: 'blue' | 'amber' | 'emerald' | 'purple' | 'rose' | 'stone';
  subtitle?: string;
  onClick?: () => void;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  count,
  icon,
  variant = 'blue',
  subtitle,
  onClick,
}) => {
  const variantStyles = {
    blue: {
      bg: 'bg-blue-50/70 hover:bg-blue-50 border-blue-200',
      iconBg: 'bg-blue-600 text-white',
      textColor: 'text-blue-900',
    },
    amber: {
      bg: 'bg-amber-50/70 hover:bg-amber-50 border-amber-200',
      iconBg: 'bg-amber-500 text-white',
      textColor: 'text-amber-900',
    },
    emerald: {
      bg: 'bg-emerald-50/70 hover:bg-emerald-50 border-emerald-200',
      iconBg: 'bg-emerald-600 text-white',
      textColor: 'text-emerald-900',
    },
    purple: {
      bg: 'bg-purple-50/70 hover:bg-purple-50 border-purple-200',
      iconBg: 'bg-purple-600 text-white',
      textColor: 'text-purple-900',
    },
    rose: {
      bg: 'bg-rose-50/70 hover:bg-rose-50 border-rose-200',
      iconBg: 'bg-rose-600 text-white',
      textColor: 'text-rose-900',
    },
    stone: {
      bg: 'bg-stone-50 hover:bg-stone-100 border-stone-200',
      iconBg: 'bg-stone-700 text-white',
      textColor: 'text-stone-900',
    },
  };

  const style = variantStyles[variant];

  return (
    <div
      onClick={onClick}
      className={`p-5 rounded-2xl border transition-all duration-200 shadow-xs flex items-center justify-between ${
        style.bg
      } ${onClick ? 'cursor-pointer hover:shadow-md hover:-translate-y-0.5' : ''}`}
    >
      <div className="space-y-1">
        <p className="text-xs font-bold uppercase tracking-wider text-stone-500">
          {title}
        </p>
        <p className={`text-2xl sm:text-3xl font-extrabold ${style.textColor}`}>
          {count}
        </p>
        {subtitle && (
          <p className="text-[11px] font-medium text-stone-500">
            {subtitle}
          </p>
        )}
      </div>

      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${style.iconBg}`}>
        {icon}
      </div>
    </div>
  );
};
