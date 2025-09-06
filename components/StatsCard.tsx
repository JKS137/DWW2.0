import React from 'react';
import { motion } from 'framer-motion';
import { fadeUpVariant } from '../services/animations';

interface StatsCardProps {
  title: string;
  value: number | string;
  Icon: React.FC<React.SVGProps<SVGSVGElement>>;
  color: 'blue' | 'pink' | 'teal';
}

const colorStyles = {
  blue: {
    bg: 'bg-blue-900/30',
    border: 'border-blue-500',
    glow: 'hover:shadow-glow-blue',
    icon: 'text-blue-400'
  },
  pink: {
    bg: 'bg-pink-900/30',
    border: 'border-pink-500',
    glow: 'hover:shadow-glow-pink',
    icon: 'text-pink-400'
  },
  teal: {
    bg: 'bg-teal-900/30',
    border: 'border-teal-500',
    glow: 'hover:shadow-glow-teal',
    icon: 'text-teal-400'
  }
};

const StatsCard: React.FC<StatsCardProps> = ({ title, value, Icon, color }) => {
  const styles = colorStyles[color];

  return (
    <motion.div 
      className={`
        relative p-5 rounded-xl border backdrop-blur-sm transition-all duration-300
        ${styles.bg} ${styles.border} ${styles.glow}
      `}
      variants={fadeUpVariant}
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-content-secondary">{title}</p>
          <p className="text-3xl font-bold text-content-primary mt-1">{value}</p>
        </div>
        <div className={`p-2 rounded-lg ${styles.bg}`}>
          <Icon className={`h-6 w-6 ${styles.icon}`} />
        </div>
      </div>
    </motion.div>
  );
};

export default StatsCard;
