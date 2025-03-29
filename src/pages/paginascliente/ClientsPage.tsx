import React, { useState } from 'react';
import ClientList from './ClientList';
import CalendarioLista from './CalendarioLista';
import CuestionariosLista from './CuestionariosLista';
import ChatPage from './ChatPage';
import AIToolsPage from './AIToolsPage';
import CheckInPage from './CheckinPage';
import CreateClient from '../../components/Clients/CreateClient';
import { Users, Calendar, ClipboardList, MessageCircle, Cpu, CheckSquare, LayoutDashboard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';
import Button from '../../components/Common/Button';


const ClientsPage: React.FC = () => {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState<'clientes' | 'cuestionarios' | 'calendario' | 'chat' | 'ia' | 'checkin'>('clientes');
  const [showCreateClient, setShowCreateClient] = useState<boolean>(false);


  const tabs = [
    { id: 'clientes', label: 'Clientes', icon: Users, color: 'from-blue-500 to-indigo-500', visible: true },
    { id: 'cuestionarios', label: 'Cuestionarios', icon: ClipboardList, color: 'from-purple-500 to-pink-500', visible: true },
    { id: 'calendario', label: 'Calendario', icon: Calendar, color: 'from-amber-500 to-orange-500', visible: true },
    { id: 'checkin', label: 'Check In', icon: CheckSquare, color: 'from-teal-500 to-cyan-500', visible: true },
    { id: 'chat', label: 'Chat', icon: MessageCircle, color: 'from-green-500 to-emerald-500', visible: true },
    { id: 'ia', label: 'Herramientas de IA', icon: Cpu, color: 'from-red-500 to-pink-500', visible: false },
  ];


  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.3,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.2 }
    }
  };


  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        type: "spring",
        stiffness: 200,
        damping: 20
      }
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: { duration: 0.2 }
    }
  };


  const buttonVariants = {
    hidden: { y: -10, opacity: 0 },
    visible: (i: number) => ({
      y: 0,
      opacity: 1,
      transition: {
        delay: i * 0.05,
        duration: 0.4,
        type: "spring",
        stiffness: 150,
        damping: 15
      }
    })
  };


  const handleClientCreated = () => {
    // Refresh the client list
    setShowCreateClient(false);
  };


  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={containerVariants}
      className={`min-h-screen py-8 ${
        theme === 'dark'
          ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900'
          : 'bg-gradient-to-br from-gray-50 via-gray-100 to-blue-100'
      }`}
    >
      <motion.div
        variants={contentVariants}
        className="w-full space-y-6 px-4 sm:px-6 animate-fadeIn"
      >
        {/* Header Section */}
        <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between ${
          theme === 'dark'
            ? 'bg-gray-800/90 border-gray-700/50'
            : 'bg-white/90 border-white/50'
        } backdrop-blur-xl p-6 rounded-3xl shadow-lg border hover:shadow-xl transition-all duration-300`}>
          <div className="flex items-center gap-4 mb-4 sm:mb-0">
            <div className="relative">
              <h1 className={`text-4xl font-extrabold ${
                theme === 'dark'
                  ? 'bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400'
                  : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600'
              } bg-clip-text text-transparent tracking-tight`}>
                Gestión de Clientes
              </h1>
              <div className={`absolute -bottom-2 left-0 w-full h-1.5 ${
                theme === 'dark'
                  ? 'bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400'
                  : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600'
              } rounded-full opacity-60 animate-pulse`}></div>
            </div>
            <span className={`text-sm font-semibold ${
              theme === 'dark'
                ? 'bg-gray-700 text-gray-300'
                : 'bg-gradient-to-r from-gray-100 to-blue-100 text-gray-700'
            } px-4 py-2 rounded-full flex items-center gap-2 shadow-inner`}>
              <Users className={`w-4 h-4 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} />
              Administración
            </span>
          </div>
          <Button
            onClick={() => setShowCreateClient(true)}
            variant="primary"
            className="w-full sm:w-auto"
          >
            + Nuevo Cliente
          </Button>
        </div>


        {/* Tab Navigation */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 p-6">
          {tabs.filter(tab => tab.visible).map((tab) => (
            <motion.div
              key={tab.id}
              className={`
                relative flex items-center gap-4 px-6 py-5
                flex-shrink-0 flex-grow basis-0 min-w-[200px]
                ${activeTab === tab.id
                  ? `${theme === 'dark'
                      ? `bg-gradient-to-br ${tab.color}/20 border-${tab.color.split('-')[1]}/30 shadow-[0_0_15px_rgba(139,92,246,0.15)]`
                      : `bg-gradient-to-br ${tab.color.replace('500', '50')}/60 border-${tab.color.split('-')[1]}/30 shadow-[0_0_15px_rgba(139,92,246,0.1)]`
                    }`
                  : `${theme === 'dark'
                      ? 'hover:bg-gray-800/30 border-gray-600/30'
                      : 'hover:bg-white/60 border-gray-200/60'
                    }`
                }
                group
                border rounded-3xl cursor-pointer
                backdrop-blur-sm
                transition-all duration-500 ease-out
                hover:shadow-lg hover:shadow-${tab.color.split('-')[1]}/5
                ${activeTab === tab.id ? 'scale-[1.01]' : ''}
              `}
              onClick={() => setActiveTab(tab.id as any)}
              whileHover={{
                scale: activeTab === tab.id ? 1.02 : 1.01,
                y: -2,
              }}
              whileTap={{ scale: 0.99 }}
            >
              <div className={`
                p-3 rounded-2xl
                ${activeTab === tab.id
                  ? `${theme === 'dark'
                      ? `bg-gradient-to-br ${tab.color}/20 shadow-md shadow-${tab.color.split('-')[1]}/10`
                      : `bg-gradient-to-br ${tab.color.replace('500', '100')}/50 shadow-md shadow-${tab.color.split('-')[1]}/5`
                    }`
                  : `${theme === 'dark'
                      ? 'bg-gray-800/30 group-hover:bg-gray-700/30'
                      : 'bg-white/40 group-hover:bg-gray-50/40'
                    }`
                }
                transition-all duration-300 ease-in-out
              `}>
                <tab.icon className={`w-6 h-6 transform transition-all duration-300 ${
                  activeTab === tab.id
                    ? `text-${tab.color.split('-')[1]}-300 scale-105 rotate-3`
                    : theme === 'dark'
                      ? `text-gray-400 group-hover:text-${tab.color.split('-')[1]}-400/50`
                      : `text-gray-500 group-hover:text-${tab.color.split('-')[1]}-500/50`
                }`} />
              </div>
              <span className={`
                font-medium text-sm tracking-wide
                ${activeTab === tab.id
                  ? `${theme === 'dark'
                      ? `text-${tab.color.split('-')[1]}-300/90`
                      : `text-${tab.color.split('-')[1]}-600/90`
                    }`
                  : `${theme === 'dark'
                      ? `text-gray-400 group-hover:text-${tab.color.split('-')[1]}-400/50`
                      : `text-gray-500 group-hover:text-${tab.color.split('-')[1]}-500/50`
                    }`
                }
                transition-all duration-300
              `}>
                {tab.label}
              </span>
              {activeTab === tab.id && (
                <motion.div
                  className={`
                    absolute -bottom-1 left-1/2 transform -translate-x-1/2
                    w-1.5 h-1.5 rounded-full
                    ${theme === 'dark' ? `bg-${tab.color.split('-')[1]}-400/70` : `bg-${tab.color.split('-')[1]}-500/70`}
                  `}
                  layoutId="activeIndicator"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  transition={{ duration: 0.4, type: "spring" }}
                />
              )}
            </motion.div>
          ))}
        </div>


        {/* Content Section */}
        <motion.div
          variants={contentVariants}
          className="mt-8"
        >
          <AnimatePresence mode="wait">
            {activeTab === 'clientes' && (
              <motion.div
                key="clientes"
                variants={contentVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <ClientList onCreateClient={() => setShowCreateClient(true)} />
              </motion.div>
            )}
            {activeTab === 'cuestionarios' && (
              <motion.div
                key="cuestionarios"
                variants={contentVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <CuestionariosLista />
              </motion.div>
            )}
            {activeTab === 'calendario' && (
              <motion.div
                key="calendario"
                variants={contentVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <CalendarioLista />
              </motion.div>
            )}
            {activeTab === 'chat' && (
              <motion.div
                key="chat"
                variants={contentVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <ChatPage />
              </motion.div>
            )}
            {activeTab === 'ia' && (
              <motion.div
                key="ia"
                variants={contentVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <AIToolsPage />
              </motion.div>
            )}
            {activeTab === 'checkin' && (
              <motion.div
                key="checkin"
                variants={contentVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <CheckInPage />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>


      {/* Create Client Modal */}
      {showCreateClient && (
        <CreateClient
          onClose={() => setShowCreateClient(false)}
          onClientCreated={handleClientCreated}
        />
      )}
    </motion.div>
  );
};


export default ClientsPage;