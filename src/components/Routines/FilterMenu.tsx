import React from 'react';
import { motion } from 'framer-motion';
import Dropdown from '../Common/Dropdown';
import { useTheme } from '../../contexts/ThemeContext';
import { Filter, Target, Clock } from 'lucide-react';

interface FilterMenuProps {
  selectedFilters: {
    difficulty: string;
    muscleGroup: string;
    duration: string;
  };
  onFilterChange: (filterType: string, value: string) => void;
  style?: React.CSSProperties;
}

const FilterMenu: React.FC<FilterMenuProps> = ({
  selectedFilters,
  onFilterChange,
  style
}) => {
  const { theme } = useTheme();

  const difficultyOptions = [
    { value: '', label: 'Todas' },
    { value: 'principiante', label: 'Principiante' },
    { value: 'intermedio', label: 'Intermedio' },
    { value: 'avanzado', label: 'Avanzado' }
  ];

  const muscleGroupOptions = [
    { value: '', label: 'Todos' },
    { value: 'pecho', label: 'Pecho' },
    { value: 'espalda', label: 'Espalda' },
    { value: 'piernas', label: 'Piernas' },
    { value: 'hombros', label: 'Hombros' },
    { value: 'brazos', label: 'Brazos' },
    { value: 'core', label: 'Core' }
  ];

  const durationOptions = [
    { value: '', label: 'Todas' },
    { value: '30', label: '30 min' },
    { value: '45', label: '45 min' },
    { value: '60', label: '60 min' },
    { value: '90', label: '90 min' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className={`${
        theme === 'dark' 
          ? 'bg-gray-800/95 border-gray-700' 
          : 'bg-white/95 border-gray-200'
      } backdrop-blur-sm border rounded-xl shadow-lg p-5 w-[320px]`}
      style={{
        ...style,
        zIndex: 50,
      }}
    >
      <div className="space-y-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className={`text-lg font-semibold ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Filtros
          </h3>
          <Filter className={`w-5 h-5 ${
            theme === 'dark' ? 'text-blue-400' : 'text-blue-500'
          }`} />
        </div>

        <div className="space-y-4">
          <div className={`p-4 rounded-lg transition-colors ${
            theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'
          }`}>
            <div className="flex items-center gap-2 mb-3">
              <Target className={`w-4 h-4 ${
                theme === 'dark' ? 'text-blue-400' : 'text-blue-500'
              }`} />
              <span className={`text-sm font-medium ${
                theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
              }`}>
                Nivel y Músculo
              </span>
            </div>
            <div className="space-y-3">
              <Dropdown
                options={difficultyOptions}
                value={selectedFilters.difficulty}
                onChange={(value) => onFilterChange('difficulty', value)}
                placeholder="Seleccionar dificultad"
                width="w-full"
                position="left"
              />
              
              <Dropdown
                options={muscleGroupOptions}
                value={selectedFilters.muscleGroup}
                onChange={(value) => onFilterChange('muscleGroup', value)}
                placeholder="Seleccionar grupo muscular"
                width="w-full"
                position="left"
              />
            </div>
          </div>

          <div className={`p-4 rounded-lg transition-colors ${
            theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'
          }`}>
            <div className="flex items-center gap-2 mb-3">
              <Clock className={`w-4 h-4 ${
                theme === 'dark' ? 'text-blue-400' : 'text-blue-500'
              }`} />
              <span className={`text-sm font-medium ${
                theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
              }`}>
                Tiempo
              </span>
            </div>
            <Dropdown
              options={durationOptions}
              value={selectedFilters.duration}
              onChange={(value) => onFilterChange('duration', value)}
              placeholder="Seleccionar duración"
              width="w-full"
              position="left"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default FilterMenu;
