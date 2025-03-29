import React from 'react';
import { useTheme } from '../../../contexts/ThemeContext';

interface MetricCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  change?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, icon, change }) => {
  const { theme } = useTheme();

  return (
    <div
      className={`p-6 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} rounded-lg shadow-lg`}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>{title}</h3>
        <div className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'} p-3 rounded-full`}>
          {icon}
        </div>
      </div>
      <div className={`text-3xl font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
        {value}
      </div>
      {change && (
        <div className={`mt-2 text-sm ${change.startsWith('↑') ? 'text-green-500' : 'text-red-500'}`}>
          {change}
        </div>
      )}
    </div>
  );
};

export default MetricCard;
