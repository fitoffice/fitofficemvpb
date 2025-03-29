import React from 'react';
import { Command, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ShortcutItem {
  key: string;
  description: string;
}

interface PopupShortcutProps {
  isOpen: boolean;
  onClose: () => void;
  shortcuts: ShortcutItem[];
  theme: string;
}

const PopupShortcut: React.FC<PopupShortcutProps> = ({
  isOpen,
  onClose,
  shortcuts,
  theme,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className={`p-6 rounded-xl shadow-2xl max-w-md w-full border ${
              theme === 'dark' 
                ? 'bg-gray-800 border-gray-700' 
                : 'bg-white border-gray-200'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold flex items-center">
                <Command className={`w-5 h-5 mr-2 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-500'}`} />
                Atajos de Teclado
              </h3>
              <button 
                onClick={onClose}
                className={`p-1.5 rounded-full transition-colors ${
                  theme === 'dark' 
                    ? 'hover:bg-gray-700 text-gray-400 hover:text-white' 
                    : 'hover:bg-gray-100 text-gray-500 hover:text-gray-900'
                }`}
              >
                <X size={18} />
              </button>
            </div>
            
            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
              {shortcuts.map((shortcut, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`flex justify-between items-center p-3 rounded-lg ${
                    theme === 'dark'
                      ? 'bg-gray-750 hover:bg-gray-700'
                      : 'bg-gray-50 hover:bg-gray-100'
                  } transition-colors duration-200`}
                >
                  <kbd className={`px-3 py-1.5 rounded-md font-mono text-sm shadow-sm ${
                    theme === 'dark'
                      ? 'bg-gray-700 text-blue-300 border border-gray-600'
                      : 'bg-white text-blue-600 border border-gray-300'
                  }`}>
                    {shortcut.key}
                  </kbd>
                  <span className={`text-sm ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  } font-medium`}>
                    {shortcut.description}
                  </span>
                </motion.div>
              ))}
            </div>
            
            <div className={`mt-6 pt-4 border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
              <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} text-center`}>
                Presiona <kbd className={`px-1.5 py-0.5 rounded text-xs ${
                  theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                }`}>Esc</kbd> para cerrar
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Add global styles for custom scrollbar
const globalStyles = `
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.5);
  border-radius: 20px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: rgba(156, 163, 175, 0.7);
}
`;

// Add the styles to the document head
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.innerHTML = globalStyles;
  document.head.appendChild(styleElement);
}

export default PopupShortcut;