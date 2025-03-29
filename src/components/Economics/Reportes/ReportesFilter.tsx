import React from 'react';
import { useTheme } from '../../../contexts/ThemeContext';
import Button from '../../Common/Button';
import { X } from 'lucide-react';

interface FilterProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: FilterValues) => void;
}

export interface FilterValues {
  tipo: string[];
  fechaDesde: string;
  fechaHasta: string;
  estado: string[];
}

const ReportesFilter: React.FC<FilterProps> = ({ isOpen, onClose, onApplyFilters }) => {
  const { theme } = useTheme();
  const [filters, setFilters] = React.useState<FilterValues>({
    tipo: [],
    fechaDesde: '',
    fechaHasta: '',
    estado: [],
  });

  if (!isOpen) return null;

  const handleCheckboxChange = (category: 'tipo' | 'estado', value: string) => {
    setFilters(prev => ({
      ...prev,
      [category]: prev[category].includes(value)
        ? prev[category].filter(item => item !== value)
        : [...prev[category], value]
    }));
  };

  const handleApplyFilters = () => {
    onApplyFilters(filters);
    onClose();
  };

  const handleClearFilters = () => {
    setFilters({
      tipo: [],
      fechaDesde: '',
      fechaHasta: '',
      estado: [],
    });
  };

  return (
    <div className="absolute right-0 top-12 z-50 w-80">
      <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-xl border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} p-4`}>
        <div className="flex justify-between items-center mb-4">
          <h3 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>Filtros</h3>
          <button
            onClick={onClose}
            className={`p-1 rounded-full ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
          >
            <X size={16} />
          </button>
        </div>

        <div className="space-y-4">
          {/* Tipo de Reporte */}
          <div>
            <h4 className={`text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Tipo de Reporte</h4>
            <div className="space-y-2">
              {['Mensual', 'Trimestral', 'Anual'].map(tipo => (
                <label key={tipo} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={filters.tipo.includes(tipo)}
                    onChange={() => handleCheckboxChange('tipo', tipo)}
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>{tipo}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Estado */}
          <div>
            <h4 className={`text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Estado</h4>
            <div className="space-y-2">
              {['Generado', 'Pendiente', 'En Proceso'].map(estado => (
                <label key={estado} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={filters.estado.includes(estado)}
                    onChange={() => handleCheckboxChange('estado', estado)}
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>{estado}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Fecha */}
          <div>
            <h4 className={`text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Fecha</h4>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Desde</label>
                <input
                  type="date"
                  value={filters.fechaDesde}
                  onChange={(e) => setFilters(prev => ({ ...prev, fechaDesde: e.target.value }))}
                  className={`w-full mt-1 px-2 py-1 text-sm rounded border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                />
              </div>
              <div>
                <label className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Hasta</label>
                <input
                  type="date"
                  value={filters.fechaHasta}
                  onChange={(e) => setFilters(prev => ({ ...prev, fechaHasta: e.target.value }))}
                  className={`w-full mt-1 px-2 py-1 text-sm rounded border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between mt-6 gap-2">
          <Button variant="warning" onClick={handleClearFilters}>
            Limpiar
          </Button>
          <Button variant="success" onClick={handleApplyFilters}>
            Aplicar Filtros
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ReportesFilter;