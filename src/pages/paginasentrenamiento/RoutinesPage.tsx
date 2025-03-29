import React, { useState } from 'react';
import PlanningList from './PlanningList';
import ExerciseList from './ExerciseList';
import WorkoutList from './WorkoutList';
import { useTheme } from '../../contexts/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Dumbbell, Calendar, ListChecks } from 'lucide-react';

const tabs = [
  {
    id: 'planificaciones',
    label: 'Planificaciones',
    icon: Calendar,
    color: 'from-blue-500 to-indigo-500'
  },
  {
    id: 'ejercicios',
    label: 'Ejercicios',
    icon: Dumbbell,
    color: 'from-purple-500 to-pink-500'
  },
  {
    id: 'rutinas',
    label: 'Rutinas',
    icon: ListChecks,
    color: 'from-amber-500 to-orange-500'
  }
];

const RoutinesPage: React.FC = () => {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState('planificaciones');
  const isDarkMode = theme === 'dark';

  return (
    <div className="w-full space-y-6 animate-fadeIn">
      {/* Header Section */}
      <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between ${
        isDarkMode
          ? 'bg-gray-800/90 border-gray-700/50'
          : 'bg-white/90 border-white/50'
      } backdrop-blur-xl p-6 rounded-3xl shadow-lg border hover:shadow-xl transition-all duration-300`}>
        <div className="flex items-center gap-4 mb-4 sm:mb-0">
          <div className="relative">
            <h2 className={`text-4xl font-extrabold ${
              isDarkMode
                ? 'bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400'
                : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600'
            } bg-clip-text text-transparent tracking-tight`}>
              {activeTab === 'ejercicios' 
                ? 'Ejercicios'
                : activeTab === 'rutinas'
                  ? 'Rutinas'
                  : 'Planificaciones'}
            </h2>
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
            <Calendar className={`w-4 h-4 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'} animate-pulse transform group-hover:rotate-12 transition-all duration-300`} />
            <span className="relative">Gestión de Rutinas</span>
          </span>
        </div>
      </div>

      {/* Tabs Section */}
      <div className={`${
        isDarkMode
          ? 'bg-gray-800/90 border-gray-700/50'
          : 'bg-white/90 border-white/50'
      } backdrop-blur-xl p-6 rounded-3xl shadow-lg border hover:shadow-xl transition-all duration-300`}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-6">
          {tabs.map((tab) => (
            <motion.div
              key={tab.id}
              className={`
                relative flex items-center gap-4 px-6 py-5
                ${activeTab === tab.id 
                  ? `${isDarkMode
                      ? `bg-gradient-to-br ${tab.color}/20 border-${tab.color.split('-')[1]}/30 shadow-[0_0_15px_rgba(139,92,246,0.15)]` 
                      : `bg-gradient-to-br ${tab.color.replace('500', '50')}/60 border-${tab.color.split('-')[1]}/30 shadow-[0_0_15px_rgba(139,92,246,0.1)]`
                    }`
                  : `${isDarkMode
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
              onClick={() => setActiveTab(tab.id)}
              whileHover={{ 
                scale: activeTab === tab.id ? 1.02 : 1.01,
                y: -2,
              }}
              whileTap={{ scale: 0.99 }}
            >
              <div className={`
                p-3 rounded-2xl
                ${activeTab === tab.id
                  ? `${isDarkMode
                      ? `bg-gradient-to-br ${tab.color}/20 shadow-md shadow-${tab.color.split('-')[1]}/10`
                      : `bg-gradient-to-br ${tab.color.replace('500', '100')}/50 shadow-md shadow-${tab.color.split('-')[1]}/5`
                    }`
                  : `${isDarkMode
                      ? 'bg-gray-800/30 group-hover:bg-gray-700/30' 
                      : 'bg-white/40 group-hover:bg-gray-50/40'
                    }`
                }
                transition-all duration-300 ease-in-out
              `}>
                <tab.icon className={`w-6 h-6 transform transition-all duration-300 ${
                  activeTab === tab.id
                    ? `text-${tab.color.split('-')[1]}-300 scale-105 rotate-3`
                    : isDarkMode
                      ? `text-gray-400 group-hover:text-${tab.color.split('-')[1]}-400/50`
                      : `text-gray-500 group-hover:text-${tab.color.split('-')[1]}-500/50`
                }`} />
              </div>
              <span className={`
                font-medium text-sm tracking-wide
                ${activeTab === tab.id
                  ? `${isDarkMode
                      ? `text-${tab.color.split('-')[1]}-300/90`
                      : `text-${tab.color.split('-')[1]}-600/80`
                    }`
                  : `${isDarkMode
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
                    ${isDarkMode ? `bg-${tab.color.split('-')[1]}-400/70` : `bg-${tab.color.split('-')[1]}-500/60`}
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
        <div className={`rounded-2xl ${
          isDarkMode
            ? 'bg-gray-900/50 border-gray-700/50'
            : 'bg-gray-50/50 border-gray-200/50'
        } border backdrop-blur-sm p-4`}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === 'planificaciones' && <PlanningList />}
              {activeTab === 'ejercicios' && <ExerciseList />}
              {activeTab === 'rutinas' && <WorkoutList />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default RoutinesPage;