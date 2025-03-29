import React from 'react';
import { motion } from 'framer-motion';
import { BarChart2, Mail, MousePointerClick, UserCheck } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface MetricCardMarketingCampañasCorreoProps {
  itemVariants: any;
}

export const MetricCardMarketingCampañasCorreo: React.FC<MetricCardMarketingCampañasCorreoProps> = ({ itemVariants }) => {
  const { theme } = useTheme();
  
  return (
    <div className="stats-container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <motion.div
        variants={itemVariants}
        className={`stat-card ${
          theme === 'dark' 
            ? 'bg-gradient-to-br from-gray-800 to-blue-900/30 border-blue-900/30' 
            : 'bg-gradient-to-br from-white to-blue-50 border-blue-100'
        } rounded-2xl shadow-lg p-6 border hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-md">
            <Mail className="h-6 w-6 text-white" />
          </div>
        </div>
        <h4 className={`text-4xl font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'} mb-3`}>2,567</h4>
        <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} text-lg font-medium`}>Emails</p>
      </motion.div>

      <motion.div
        variants={itemVariants}
        className={`stat-card ${
          theme === 'dark' 
            ? 'bg-gradient-to-br from-gray-800 to-green-900/30 border-green-900/30' 
            : 'bg-gradient-to-br from-white to-green-50 border-green-100'
        } rounded-2xl shadow-lg p-6 border hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-md">
            <MousePointerClick className="h-6 w-6 text-white" />
          </div>
        </div>
        <h4 className={`text-4xl font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'} mb-3`}>45.8%</h4>
        <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} text-lg font-medium`}>Apertura</p>
      </motion.div>

      <motion.div
        variants={itemVariants}
        className={`stat-card ${
          theme === 'dark' 
            ? 'bg-gradient-to-br from-gray-800 to-purple-900/30 border-purple-900/30' 
            : 'bg-gradient-to-br from-white to-purple-50 border-purple-100'
        } rounded-2xl shadow-lg p-6 border hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-md">
            <UserCheck className="h-6 w-6 text-white" />
          </div>
        </div>
        <h4 className={`text-4xl font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'} mb-3`}>892</h4>
        <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} text-lg font-medium`}>Suscriptores</p>
      </motion.div>

      <motion.div
        variants={itemVariants}
        className={`stat-card ${
          theme === 'dark' 
            ? 'bg-gradient-to-br from-gray-800 to-emerald-900/30 border-emerald-900/30' 
            : 'bg-gradient-to-br from-white to-emerald-50 border-emerald-100'
        } rounded-2xl shadow-lg p-6 border hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="p-3 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl shadow-md">
            <BarChart2 className="h-6 w-6 text-white" />
          </div>
        </div>
        <h4 className={`text-4xl font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'} mb-3`}>23.5%</h4>
        <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} text-lg font-medium`}>Conversión</p>
      </motion.div>
    </div>
  );
};