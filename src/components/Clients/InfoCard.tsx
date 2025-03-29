import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from '../Common/Button';

interface InfoItemProps {
  icon: LucideIcon;
  text: React.ReactNode;
  className?: string;
}

const InfoItem: React.FC<InfoItemProps> = ({ icon: Icon, text, className }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  return (
    <motion.div 
      whileHover={{ x: 5 }}
      className={`flex items-center space-x-3 group p-2 rounded-lg transition-all duration-300 hover:bg-gray-50 dark:hover:bg-gray-800/70 ${className || ''}`}
    >
      <div className={`
        p-2 rounded-full transition-all duration-300
        ${isDark 
          ? 'bg-gray-800 text-gray-400 group-hover:text-blue-400 group-hover:bg-blue-900/20' 
          : 'bg-blue-50 text-blue-500 group-hover:text-blue-600 group-hover:bg-blue-100'}
      `}>
        <Icon className="w-5 h-5" />
      </div>
      <div className={`
        transition-colors duration-200 flex-1
        ${isDark ? 'text-gray-300 group-hover:text-white' : 'text-gray-600 group-hover:text-gray-900'}
      `}>
        {text}
      </div>
    </motion.div>
  );
};

interface InfoCardProps {
  title: string;
  items: Array<{ icon: LucideIcon; text: React.ReactNode; className?: string }>;
  delay?: number;
  actionButton?: {
    icon: LucideIcon;
    label: string;
    onClick: () => void;
    className?: string;
  };
  titleButton?: {
    icon: LucideIcon;
    label: string;
    onClick: () => void;
    className?: string;
  };
  className?: string;
}

const InfoCard: React.FC<InfoCardProps> = ({ 
  title, 
  items, 
  delay = 0, 
  actionButton, 
  titleButton,
  className = '' 
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={`
        ${isDark 
          ? 'bg-gradient-to-br from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-900' 
          : 'bg-gradient-to-br from-white to-gray-50 hover:from-blue-50 hover:to-white'}
        p-6 rounded-xl shadow-lg backdrop-blur-sm
        transform transition-all duration-500
        border ${isDark ? 'border-gray-700' : 'border-gray-200'}
        ${className}
      `}
    >
      <div className={`
        flex justify-between items-center mb-6 pb-3
        border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}
      `}>
        <h4 className={`text-lg font-bold ${
          isDark 
            ? 'text-white bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent' 
            : 'text-gray-800 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent'
        }`}>
          {title}
        </h4>
        {titleButton && (
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant="create"
              onClick={titleButton.onClick}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg shadow-sm hover:shadow-md transition-all duration-300 ${titleButton.className || 'bg-green-500 hover:bg-green-600 text-white'}`}
            >
              <titleButton.icon className="w-4 h-4 mr-2" />
              <span>{titleButton.label}</span>
            </Button>
          </motion.div>
        )}
      </div>
      <div className="space-y-3 mb-4">
        {items.map((item, index) => (
          <InfoItem 
            key={index} 
            icon={item.icon} 
            text={item.text} 
            className={item.className}
          />
        ))}
      </div>
      {actionButton && (
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="mt-6"
        >
          <Button
            variant="create"
            onClick={actionButton.onClick}
            className={`w-full py-2.5 rounded-lg font-medium ${
              actionButton.className || 
              `bg-gradient-to-r from-blue-500 to-indigo-600 
              hover:from-blue-600 hover:to-indigo-700 text-white
              shadow-md hover:shadow-lg transition-all duration-300`
            }`}
          >
            <actionButton.icon className="w-4 h-4 mr-2" />
            <span>{actionButton.label}</span>
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default InfoCard;