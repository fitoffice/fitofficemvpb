import React from 'react';
import { useTheme } from '../../../contexts/ThemeContext';
import Button from '../../Common/Button';

interface FilterOptions {
  fechaInicio: string;
  fechaFin: string;
  estado: string;
  categoria: string;
  tipo: string;
  montoMinimo: string;
  montoMaximo: string;
}

interface FiltroGastosPopupProps {
  filterOptions: FilterOptions;
  onFilterChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onClose: () => void;
  onApplyFilters: () => void;
  onClearFilters: () => void;
}

const FiltroGastosPopup: React.FC<FiltroGastosPopupProps> = ({
  filterOptions,
  onFilterChange,
  onClose,
  onApplyFilters,
  onClearFilters
}) => {
  const { theme } = useTheme();

  return (
    <div className={`absolute right-0 top-12 w-80 bg-${theme === 'dark' ? 'gray-800' : 'white'} rounded-lg shadow-lg p-4 z-50 border border-gray-200`}>
      <div className="space-y-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className={`text-lg font-semibold text-${theme === 'dark' ? 'white' : 'gray-900'}`}>Filtros</h3>
          <button
            onClick={onClose}
            className={`text-${theme === 'dark' ? 'gray-400' : 'gray-500'} hover:text-${theme === 'dark' ? 'white' : 'gray-700'}`}
          >
            ×
          </button>
        </div>

        <div>
          <label className={`block text-sm font-medium text-${theme === 'dark' ? 'gray-200' : 'gray-700'} mb-1`}>
            Fecha Inicio
          </label>
          <input
            type="date"
            name="fechaInicio"
            value={filterOptions.fechaInicio}
            onChange={onFilterChange}
            className={`w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 
              ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white'}`}
          />
        </div>

        <div>
          <label className={`block text-sm font-medium text-${theme === 'dark' ? 'gray-200' : 'gray-700'} mb-1`}>
            Fecha Fin
          </label>
          <input
            type="date"
            name="fechaFin"
            value={filterOptions.fechaFin}
            onChange={onFilterChange}
            className={`w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 
              ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white'}`}
          />
        </div>

        <div>
          <label className={`block text-sm font-medium text-${theme === 'dark' ? 'gray-200' : 'gray-700'} mb-1`}>
            Estado
          </label>
          <select
            name="estado"
            value={filterOptions.estado}
            onChange={onFilterChange}
            className={`w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 
              ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white'}`}
          >
            <option value="">Todos</option>
            <option value="pendiente">Pendiente</option>
            <option value="pagado">Pagado</option>
            <option value="cancelado">Cancelado</option>
          </select>
        </div>

        <div>
          <label className={`block text-sm font-medium text-${theme === 'dark' ? 'gray-200' : 'gray-700'} mb-1`}>
            Categoría
          </label>
          <select
            name="categoria"
            value={filterOptions.categoria}
            onChange={onFilterChange}
            className={`w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 
              ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white'}`}
          >
            <option value="">Todas</option>
            <option value="alquiler">Alquiler</option>
            <option value="servicios">Servicios</option>
            <option value="equipamiento">Equipamiento</option>
            <option value="marketing">Marketing</option>
            <option value="personal">Personal</option>
            <option value="otros">Otros</option>
          </select>
        </div>

        <div>
          <label className={`block text-sm font-medium text-${theme === 'dark' ? 'gray-200' : 'gray-700'} mb-1`}>
            Tipo
          </label>
          <select
            name="tipo"
            value={filterOptions.tipo}
            onChange={onFilterChange}
            className={`w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 
              ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white'}`}
          >
            <option value="">Todos</option>
            <option value="fijo">Fijo</option>
            <option value="variable">Variable</option>
          </select>
        </div>

        <div>
          <label className={`block text-sm font-medium text-${theme === 'dark' ? 'gray-200' : 'gray-700'} mb-1`}>
            Monto Mínimo
          </label>
          <input
            type="number"
            name="montoMinimo"
            value={filterOptions.montoMinimo}
            onChange={onFilterChange}
            className={`w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 
              ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white'}`}
          />
        </div>

        <div>
          <label className={`block text-sm font-medium text-${theme === 'dark' ? 'gray-200' : 'gray-700'} mb-1`}>
            Monto Máximo
          </label>
          <input
            type="number"
            name="montoMaximo"
            value={filterOptions.montoMaximo}
            onChange={onFilterChange}
            className={`w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 
              ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white'}`}
          />
        </div>

        <div className="flex justify-between pt-4">
          <Button
            onClick={onClearFilters}
            variant="secondary"
            className="w-[48%]"
          >
            Limpiar
          </Button>
          <Button
            onClick={onApplyFilters}
            variant="primary"
            className="w-[48%]"
          >
            Aplicar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FiltroGastosPopup;
