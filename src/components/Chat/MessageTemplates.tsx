import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, FileText } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { MessageTemplate } from './types';

interface MessageTemplatesProps {
  templates: MessageTemplate[];
  onSelectTemplate: (template: MessageTemplate) => void;
}

export const MessageTemplates: React.FC<MessageTemplatesProps> = ({
  templates,
  onSelectTemplate,
}) => {
  const { theme } = useTheme();

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.95 }}
        className={`absolute top-4 right-4 w-80 rounded-3xl shadow-2xl z-10 overflow-hidden ${
          theme === 'dark'
            ? 'bg-gradient-to-br from-gray-800/95 to-gray-900/95 shadow-gray-900/50'
            : 'bg-gradient-to-br from-white/95 to-gray-50/95 shadow-gray-200/50'
        }`}
        style={{
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)'
        }}
      >
        <motion.div 
          className={`p-5 border-b flex justify-between items-center ${
            theme === 'dark' ? 'border-gray-700/50' : 'border-gray-200/50'
          }`}
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center space-x-3">
            <motion.div
              animate={{
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut"
              }}
            >
              <FileText size={24} className={`${
                theme === 'dark' ? 'text-blue-400' : 'text-blue-500'
              }`} />
            </motion.div>
            <motion.h3 
              className="font-semibold text-xl bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400"
              animate={{
                backgroundPosition: ['0%', '100%', '0%'],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "linear"
              }}
              style={{
                backgroundSize: '200% auto',
              }}
            >
              Plantillas
            </motion.h3>
          </div>
          <motion.button
            onClick={() => onSelectTemplate({ id: '', title: '', content: '' })}
            className={`p-2 rounded-xl transition-all ${
              theme === 'dark'
                ? 'hover:bg-gray-700/50 text-gray-400 hover:text-gray-200'
                : 'hover:bg-gray-100/50 text-gray-500 hover:text-gray-700'
            }`}
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
          >
            <X size={20} />
          </motion.button>
        </motion.div>
        <motion.div 
          className="p-3 space-y-2 max-h-[60vh] overflow-y-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {templates.map((template, index) => (
            <motion.button
              key={template.id}
              onClick={() => onSelectTemplate(template)}
              className={`w-full p-4 text-left rounded-2xl transition-all ${
                theme === 'dark'
                  ? 'hover:bg-gray-700/50'
                  : 'hover:bg-gray-100/50'
              } group`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * (index + 1) }}
              whileHover={{ 
                scale: 1.02,
                x: 8,
                transition: { duration: 0.2 }
              }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.div 
                className={`font-medium text-base mb-2 ${
                  theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
                } group-hover:text-blue-500 transition-colors duration-200`}
                layout
              >
                {template.title}
              </motion.div>
              <motion.div 
                className={`text-sm line-clamp-2 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                } group-hover:text-opacity-80 transition-opacity duration-200`}
                layout
              >
                {template.content}
              </motion.div>
              <motion.div
                className={`w-full h-0.5 mt-3 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ${
                  theme === 'dark'
                    ? 'bg-gradient-to-r from-blue-500/50 to-purple-500/50'
                    : 'bg-gradient-to-r from-blue-400/30 to-purple-400/30'
                }`}
              />
            </motion.button>
          ))}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
