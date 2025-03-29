import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useFilters } from '../../contexts/FilterContext';

interface Filters {
  estado: string;
  tag: string;
  tipoPlan: string;
  clase: string;
  servicio: string;
}

interface FilterPanelProps {
  // Mantenemos las props para compatibilidad, pero usaremos el contexto
  filters: Filters;
  setFilters: (filters: Filters) => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({ filters: propFilters, setFilters: propSetFilters }) => {
  const { theme } = useTheme();
  const { filters, setFilters } = useFilters();

  const filterOptions = {
    estado: ['Activo', 'Inactivo', 'Pendiente'],
    tag: ['Premium', 'Básico', 'VIP', 'Sin etiqueta'],
    tipoPlan: ['Mensual', 'Trimestral', 'Anual'],
    clase: ['CrossFit', 'Yoga', 'Pilates', 'Funcional'],
    servicio: ['Personal', 'Grupal', 'Online'],
  };

  const handleFilterChange = (key: keyof Filters, value: string) => {
    // Actualizamos los filtros en el contexto
    setFilters({ ...filters, [key]: value === filters[key] ? '' : value });
    // También actualizamos las props para mantener compatibilidad
    propSetFilters({ ...propFilters, [key]: value === propFilters[key] ? '' : value });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`absolute z-50 right-0 mt-2 w-[340px] rounded-xl shadow-xl 
        ${theme === 'dark' 
          ? 'bg-gray-800 border border-gray-700' 
          : 'bg-white border border-gray-200'
        } backdrop-blur-sm backdrop-filter`}
    >
      <div className="max-h-[80vh] overflow-y-auto">
        <div className="sticky top-0 z-10 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold">Filtros</h2>
        </div>

        <div className="p-4">
          {Object.entries(filterOptions).map(([key, options]) => (
            <div key={key} className="mb-6 last:mb-2">
              <h3 className="text-sm font-medium capitalize mb-3 text-gray-600 dark:text-gray-300">
                {key}
              </h3>
              <div className="flex flex-wrap gap-2">
                {options.map((option) => (
                  <button
                    key={option}
                    onClick={() => handleFilterChange(key as keyof Filters, option)}
                    className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 
                      ${filters[key as keyof Filters] === option
                        ? 'bg-blue-500 text-white shadow-sm shadow-blue-500/25'
                        : theme === 'dark'
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      } transform hover:scale-105 active:scale-95`}
                  >
                    {option}
                    {filters[key as keyof Filters] === option && (
                      <X className="inline-block w-4 h-4 ml-2 -mr-1" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="sticky bottom-0 p-4 border-t border-gray-200 dark:border-gray-700 bg-inherit">
          <div className="flex justify-between gap-3">
            <button
              onClick={() => setFilters({ estado: '', tag: '', tipoPlan: '', clase: '', servicio: '' })}
              className={`px-4 py-2 rounded-lg text-sm font-medium w-full
                ${theme === 'dark'
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              Limpiar filtros
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default FilterPanel;
