import React from 'react';

interface StatsCardProps {
  title: string;
  value: number | string;
  Icon: React.FC<React.SVGProps<SVGSVGElement>>;
  color: 'blue' | 'pink' | 'teal';
}

const colorStyles = {
  blue: {
    bg: 'bg-gradient-to-br from-blue-900/40 to-blue-900/20',
    border: 'border-blue-500/50',
    glow: 'hover:shadow-glow-blue hover:border-blue-500',
    icon: 'text-blue-400',
    gradient: 'from-blue-500/20 to-transparent'
  },
  pink: {
    bg: 'bg-gradient-to-br from-pink-900/40 to-pink-900/20',
    border: 'border-pink-500/50',
    glow: 'hover:shadow-glow-pink hover:border-pink-500',
    icon: 'text-pink-400',
    gradient: 'from-pink-500/20 to-transparent'
  },
  teal: {
    bg: 'bg-gradient-to-br from-teal-900/40 to-teal-900/20',
    border: 'border-teal-500/50',
    glow: 'hover:shadow-glow-teal hover:border-teal-500',
    icon: 'text-teal-400',
    gradient: 'from-teal-500/20 to-transparent'
  }
};

const StatsCard: React.FC<StatsCardProps> = ({ title, value, Icon, color }) => {
  const styles = colorStyles[color];

  return (
    <div 
      className={`
        relative p-5 rounded-xl border backdrop-blur-sm transition-all duration-300
        overflow-hidden group cursor-default
        ${styles.bg} ${styles.border} ${styles.glow}
      `}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${styles.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
      <div className="relative z-10 flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-content-secondary">{title}</p>
          <p className="text-3xl font-bold text-content-primary mt-1">{value}</p>
        </div>
        <div className={`p-3 rounded-lg bg-base-900/50 border border-current/20 transition-transform duration-300 group-hover:scale-110`}>
          <Icon className={`h-6 w-6 ${styles.icon}`} />
        </div>
      </div>
    </div>
  );
};

export default StatsCard;