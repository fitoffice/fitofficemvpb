import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface StatCardProps {
  icon: LucideIcon;
  title: string;
  value: string | number;
  color: string;
  delay?: number;
}

const StatCard: React.FC<StatCardProps> = ({ icon: Icon, title, value, color, delay = 0 }) => {
  const { theme } = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={`
        ${theme === 'dark' ? 'bg-gray-800/50 hover:bg-gray-800' : 'bg-white hover:bg-gray-50'}
        p-4 rounded-xl shadow-lg backdrop-blur-sm
        transform transition-all duration-300 hover:scale-105
        border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-100'}
      `}
    >
      <div className="flex items-center space-x-3">
        <div className={`p-3 rounded-lg ${color} shadow-lg transform transition-transform duration-300 hover:rotate-12`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
            {title}
          </p>
          <p className="text-lg font-bold mt-0.5">{value}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default StatCard;