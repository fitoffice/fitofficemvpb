import React, { useState } from 'react';
import DietList from '../components/Diets/DietList';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { Utensils, Plus } from 'lucide-react';

const DietsPage: React.FC = () => {
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  const [showFoods, setShowFoods] = useState(false);  // Add this line
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full min-h-screen py-8 space-y-6 animate-fadeIn"
    >
      <div className={`${
        isDarkMode
          ? 'bg-gray-800/90 border-gray-700/50'
          : 'bg-white/90 border-white/50'
      } backdrop-blur-xl rounded-3xl shadow-lg border hover:shadow-xl transition-all duration-300 mx-4 sm:mx-6`}>
        <div className="p-6">
          {/* Header Content */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <div className="flex items-center gap-4 mb-4 sm:mb-0">
              <div className="relative">
                <h1 className={`text-4xl font-extrabold ${
                  isDarkMode
                    ? 'bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400'
                    : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600'
                } bg-clip-text text-transparent tracking-tight`}>
                  Planes de Dieta
                </h1>
                <div className={`absolute -bottom-2 left-0 w-full h-1.5 ${
                  isDarkMode
                    ? 'bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400'
                    : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600'
                } rounded-full opacity-60 animate-pulse`}></div>
              </div>
              <span className={`
                text-sm font-semibold
                ${isDarkMode
                  ? 'bg-gradient-to-r from-gray-800 to-gray-700 text-gray-300 border border-gray-600/30'
                  : 'bg-gradient-to-r from-blue-50 to-indigo-50 text-gray-700 border border-blue-100/50'
                }
                px-4 py-2 rounded-full
                flex items-center gap-2
                shadow-lg
                hover:shadow-xl
                transform hover:scale-105
                transition-all duration-300 ease-out
                animate-fadeIn
                relative
                overflow-hidden
                group
              `}>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                <Utensils className={`w-4 h-4 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'} animate-pulse transform group-hover:rotate-12 transition-all duration-300`} />
                <span className="relative">Gestión de Dietas</span>
              </span>
            </div>
        
          </div>

          {/* Main Content */}
          <div className={`rounded-3xl ${
            isDarkMode
              ? 'bg-gray-900/50'
              : 'bg-gray-50/50'
          }`}>
            <DietList />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DietsPage;