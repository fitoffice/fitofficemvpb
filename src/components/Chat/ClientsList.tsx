import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';
import { Client } from './types';
import { useTheme } from '../../contexts/ThemeContext';

interface ClientsListProps {
  clients: Client[];
  selectedClient: Client | null;
  isBulkMode: boolean;
  selectedClients: string[];
  onClientSelect: (client: Client) => void;
  onClientToggle: (clientId: string) => void;
}

export const ClientsList: React.FC<ClientsListProps> = ({
  clients,
  selectedClient,
  isBulkMode,
  selectedClients,
  onClientSelect,
  onClientToggle,
}) => {
  const { theme } = useTheme();

  const listVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0 }
  };

  return (
    <motion.div 
      className="space-y-3 px-2"
      variants={listVariants}
      initial="hidden"
      animate="show"
    >
      <AnimatePresence mode="popLayout">
        {clients.map((client, index) => (
          <motion.div
            key={client.id}
            variants={itemVariants}
            layout
            onClick={() => isBulkMode ? onClientToggle(client.id) : onClientSelect(client)}
            className={`group flex items-center p-4 rounded-2xl cursor-pointer transition-all duration-300 
              ${(selectedClient?.id === client.id || selectedClients.includes(client.id))
                ? theme === 'dark'
                  ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 shadow-lg shadow-blue-900/20'
                  : 'bg-gradient-to-r from-blue-50 to-purple-50 shadow-lg shadow-blue-100/50'
                : theme === 'dark'
                  ? 'hover:bg-gray-800/50'
                  : 'hover:bg-gray-50'
              } transform hover:scale-[1.02] hover:-translate-y-1`}
            style={{
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)'
            }}
          >
            <div className="relative">
              <motion.img
                src={client.avatar}
                alt={client.name}
                className={`w-14 h-14 rounded-2xl object-cover transition-all duration-300
                  ${theme === 'dark' 
                    ? 'ring-2 ring-gray-700 group-hover:ring-blue-500' 
                    : 'ring-2 ring-gray-100 group-hover:ring-blue-400'
                  }`}
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
              />
              {client.online && (
                <motion.div
                  className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full 
                    ${theme === 'dark' ? 'bg-green-500' : 'bg-green-400'}
                    border-2 ${theme === 'dark' ? 'border-gray-800' : 'border-white'}`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 15
                  }}
                >
                  <motion.div
                    className="absolute inset-0 rounded-full bg-green-400"
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [1, 0.5, 1]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                </motion.div>
              )}
            </div>

            <div className="ml-4 flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <motion.h3 
                    className={`font-semibold text-lg bg-clip-text ${
                      selectedClient?.id === client.id
                        ? 'text-transparent bg-gradient-to-r from-blue-400 to-purple-400'
                        : ''
                    }`}
                    whileHover={{ scale: 1.05 }}
                  >
                    {client.name}
                  </motion.h3>
                  {client.lastMessage && !isBulkMode && (
                    <motion.p
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`text-sm mt-1 ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      } line-clamp-1`}
                    >
                      {client.lastMessage}
                    </motion.p>
                  )}
                </div>
                <div className="flex flex-col items-end space-y-2">
                  {client.lastMessageTime && !isBulkMode && (
                    <motion.span
                      className={`text-xs px-2 py-1 rounded-full ${
                        theme === 'dark' ? 'bg-gray-800/50 text-gray-400' : 'bg-gray-100 text-gray-500'
                      }`}
                      whileHover={{ scale: 1.1 }}
                    >
                      {client.lastMessageTime.toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </motion.span>
                  )}
                  {!isBulkMode && client.unreadCount > 0 && (
                    <motion.div
                      className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs font-medium px-3 py-1 rounded-full
                        shadow-lg shadow-blue-500/20"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      whileHover={{ scale: 1.1 }}
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 15
                      }}
                    >
                      {client.unreadCount}
                    </motion.div>
                  )}
                </div>
              </div>
            </div>
            {isBulkMode && (
              <motion.div
                className={`ml-4 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                  selectedClients.includes(client.id)
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 border-transparent'
                    : theme === 'dark'
                      ? 'border-gray-600'
                      : 'border-gray-300'
                }`}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              >
                {selectedClients.includes(client.id) && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 500,
                      damping: 15
                    }}
                  >
                    <Check size={14} className="text-white" />
                  </motion.div>
                )}
              </motion.div>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
};
