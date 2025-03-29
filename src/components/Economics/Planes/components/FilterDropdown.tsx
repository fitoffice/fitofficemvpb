import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Users, BookOpen, ArrowUpDown } from 'lucide-react';
import { FilterOptions } from '../types';

interface FilterDropdownProps {
  filterOptions: FilterOptions;
  onFilterChange: (opcion: string, valor: string) => void;
  theme: 'dark' | 'light';
}

const FilterDropdown: React.FC<FilterDropdownProps> = ({
  filterOptions,
  onFilterChange,
  theme
}) => {
  const buttonClass = (isSelected: boolean) => `
    w-full text-left px-4 py-3 text-sm transition-all duration-200
    flex items-center gap-2 rounded-lg
    ${isSelected 
      ? theme === 'dark'
        ? 'bg-violet-900/30 text-violet-300 border border-violet-700'
        : 'bg-violet-50 text-violet-700 border border-violet-200'
      : theme === 'dark'
        ? 'text-gray-300 hover:bg-gray-800'
        : 'text-gray-600 hover:bg-gray-50'
    }
  `;

  const sectionClass = `
    p-4 space-y-2 border-b 
    ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}
    last:border-b-0
  `;

  const titleClass = `
    flex items-center gap-2 px-2 py-2 text-sm font-medium
    ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}
  `;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className={`
        absolute right-0 mt-2 w-72 overflow-hidden
        ${theme === 'dark' 
          ? 'bg-gray-900 border border-gray-700' 
          : 'bg-white border border-gray-200'
        }
        rounded-2xl shadow-xl backdrop-blur-sm
        ${theme === 'dark' ? 'shadow-black/20' : 'shadow-gray-200/80'}
      `}
    >
      {/* Cantidad de Planes */}
      <div className={sectionClass}>
        <div className={titleClass}>
          <BookOpen className="w-4 h-4" />
          <span>Cantidad de Planes</span>
        </div>
        <div className="space-y-1">
          <button
            onClick={() => onFilterChange('cantidadPlanes', 'todos')}
            className={buttonClass(filterOptions.cantidadPlanes === 'todos')}
          >
            Todos los planes
          </button>
          <button
            onClick={() => onFilterChange('cantidadPlanes', 'sin_planes')}
            className={buttonClass(filterOptions.cantidadPlanes === 'sin_planes')}
          >
            Sin planes
          </button>
          <button
            onClick={() => onFilterChange('cantidadPlanes', 'un_plan')}
            className={buttonClass(filterOptions.cantidadPlanes === 'un_plan')}
          >
            Un plan
          </button>
          <button
            onClick={() => onFilterChange('cantidadPlanes', 'multiple_planes')}
            className={buttonClass(filterOptions.cantidadPlanes === 'multiple_planes')}
          >
            Múltiples planes
          </button>
        </div>
      </div>

      {/* Cantidad de Clientes */}
      <div className={sectionClass}>
        <div className={titleClass}>
          <Users className="w-4 h-4" />
          <span>Cantidad de Clientes</span>
        </div>
        <div className="space-y-1">
          <button
            onClick={() => onFilterChange('cantidadClientes', 'todos')}
            className={buttonClass(filterOptions.cantidadClientes === 'todos')}
          >
            Todos los clientes
          </button>
          <button
            onClick={() => onFilterChange('cantidadClientes', 'sin_clientes')}
            className={buttonClass(filterOptions.cantidadClientes === 'sin_clientes')}
          >
            Sin clientes
          </button>
          <button
            onClick={() => onFilterChange('cantidadClientes', 'pocos')}
            className={buttonClass(filterOptions.cantidadClientes === 'pocos')}
          >
            1-5 clientes
          </button>
          <button
            onClick={() => onFilterChange('cantidadClientes', 'muchos')}
            className={buttonClass(filterOptions.cantidadClientes === 'muchos')}
          >
            Más de 5 clientes
          </button>
        </div>
      </div>

      {/* Fecha de Creación */}
      <div className={sectionClass}>
        <div className={titleClass}>
          <Calendar className="w-4 h-4" />
          <span>Fecha de Creación</span>
        </div>
        <div className="space-y-1">
          <button
            onClick={() => onFilterChange('fechaCreacion', 'todos')}
            className={buttonClass(filterOptions.fechaCreacion === 'todos')}
          >
            Todas las fechas
          </button>
          <button
            onClick={() => onFilterChange('fechaCreacion', 'hoy')}
            className={buttonClass(filterOptions.fechaCreacion === 'hoy')}
          >
            Hoy
          </button>
          <button
            onClick={() => onFilterChange('fechaCreacion', 'semana')}
            className={buttonClass(filterOptions.fechaCreacion === 'semana')}
          >
            Última semana
          </button>
          <button
            onClick={() => onFilterChange('fechaCreacion', 'mes')}
            className={buttonClass(filterOptions.fechaCreacion === 'mes')}
          >
            Último mes
          </button>
        </div>
      </div>

      {/* Ordenar por */}
      <div className={sectionClass}>
        <div className={titleClass}>
          <ArrowUpDown className="w-4 h-4" />
          <span>Ordenar por</span>
        </div>
        <div className="space-y-1">
          <button
            onClick={() => onFilterChange('ordenarPor', 'nombre')}
            className={buttonClass(filterOptions.ordenarPor === 'nombre')}
          >
            Nombre
          </button>
          <button
            onClick={() => onFilterChange('ordenarPor', 'clientes')}
            className={buttonClass(filterOptions.ordenarPor === 'clientes')}
          >
            Cantidad de clientes
          </button>
          <button
            onClick={() => onFilterChange('ordenarPor', 'planes')}
            className={buttonClass(filterOptions.ordenarPor === 'planes')}
          >
            Cantidad de planes
          </button>
          <button
            onClick={() => onFilterChange('ordenarPor', 'fecha')}
            className={buttonClass(filterOptions.ordenarPor === 'fecha')}
          >
            Fecha de creación
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default FilterDropdown;
