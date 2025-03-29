import React from 'react';
import { motion } from 'framer-motion';
import { Search, Users } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  isBulkMode: boolean;
  onBulkModeToggle: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  onSearchChange,
  isBulkMode,
  onBulkModeToggle,
}) => {
  const { theme } = useTheme();

  return (
    <motion.div 
      className="flex items-center justify-between mb-6 px-2"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div 
        className={`relative flex-1 mr-3 group overflow-hidden ${
          theme === 'dark' 
            ? 'bg-gradient-to-r from-gray-800/50 to-gray-700/50' 
            : 'bg-gradient-to-r from-gray-100 to-gray-50'
        } rounded-2xl transition-all duration-300 
        ${searchQuery ? 'ring-2 ring-blue-500' : 'hover:ring-2 hover:ring-blue-400/50'}`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-blue-400/0 via-blue-400/0 to-blue-400/0"
          animate={{
            backgroundImage: [
              'linear-gradient(to right, rgba(59, 130, 246, 0) 0%, rgba(59, 130, 246, 0) 100%)',
              'linear-gradient(to right, rgba(59, 130, 246, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%)',
              'linear-gradient(to right, rgba(59, 130, 246, 0) 0%, rgba(59, 130, 246, 0) 100%)',
            ]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
        <motion.div
          className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-colors ${
            theme === 'dark' 
              ? 'text-gray-400 group-focus-within:text-blue-400' 
              : 'text-gray-400 group-focus-within:text-blue-500'
          }`}
          whileHover={{ scale: 1.1, rotate: 15 }}
        >
          <Search size={20} />
        </motion.div>
        <input
          type="text"
          placeholder="Buscar clientes..."
          className={`w-full pl-12 pr-4 py-4 focus:outline-none transition-colors duration-300 ${
            theme === 'dark'
              ? 'bg-transparent text-white placeholder-gray-400'
              : 'bg-transparent text-gray-900 placeholder-gray-500'
          }`}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        {searchQuery && (
          <motion.button
            className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-1.5 rounded-full ${
              theme === 'dark' ? 'bg-gray-700 text-gray-400' : 'bg-gray-200 text-gray-500'
            }`}
            onClick={() => onSearchChange('')}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </motion.button>
        )}
      </motion.div>
      <motion.button
        onClick={onBulkModeToggle}
        className={`p-4 rounded-2xl transition-all duration-300 ${
          isBulkMode
            ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-blue-500/30'
            : theme === 'dark'
              ? 'bg-gradient-to-r from-gray-800/50 to-gray-700/50 text-gray-300'
              : 'bg-gradient-to-r from-gray-100 to-gray-50 text-gray-600'
        }`}
        whileHover={{ 
          scale: 1.05,
          rotate: isBulkMode ? [0, -5, 5, -5, 0] : 0 
        }}
        whileTap={{ scale: 0.95 }}
        animate={isBulkMode ? {
          scale: [1, 1.1, 1],
          transition: {
            duration: 0.3
          }
        } : {}}
      >
        <Users 
          size={22} 
          className={`transform transition-transform duration-300 ${
            isBulkMode ? 'rotate-12' : 'hover:rotate-12'
          }`}
        />
      </motion.button>
    </motion.div>
  );
};
