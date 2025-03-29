import React, { ReactNode } from 'react';
import { AlertTriangle, Calendar, TrendingUp, TrendingDown } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface MetricCardProps {
  title: string;
  value: number | string;
  icon: ReactNode;
  trend?: number;
  trendIcon?: ReactNode;
  className?: string;
  headerDecorator?: ReactNode;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  icon,
  trend,
  trendIcon,
  className = '',
  headerDecorator
}) => {
  const { theme } = useTheme();

  return (
    <div className={`
      p-6 rounded-xl border ${theme === 'dark' ? 'border-gray-700 bg-gray-800/90' : 'border-gray-200 bg-white'} 
      shadow-lg backdrop-blur-sm
      transform transition-all duration-300 
      hover:scale-102 hover:shadow-xl
      ${theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-50'}
      ${className}
    `}>
      {headerDecorator}
      <div className="flex justify-between items-start">
        <div>
          <h3 className={`text-lg font-semibold mb-2 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}>
            {title}
          </h3>
          <p className={`text-3xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            {value}
          </p>
          <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
            description
          </p>
        </div>
        <div className={`p-3 rounded-full transition-colors duration-200 ${
          theme === 'dark' 
            ? 'bg-[#E61D2B]/20 hover:bg-[#E61D2B]/30' 
            : 'bg-[#E61D2B]/10 hover:bg-[#E61D2B]/20'
        }`}>
          {icon}
        </div>
      </div>
      {trend !== undefined && (
        <div className={`mt-4 flex items-center ${trend >= 0 ? 'text-green-500' : 'text-red-500'}`}>
          {trendIcon || (trend >= 0 ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />)}
          <span className="text-sm font-medium">
            {Math.abs(trend)}% {trend >= 0 ? 'incremento' : 'decremento'}
          </span>
        </div>
      )}
    </div>
  );
};

export default MetricCard;