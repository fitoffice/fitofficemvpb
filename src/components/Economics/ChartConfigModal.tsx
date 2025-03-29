import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

interface ChartConfigModalProps {
  onClose: () => void;
  onSave: (chartType: 'line' | 'bar') => void;
  currentChartType: 'line' | 'bar';
  viewType: 'weekly' | 'monthly' | 'annual';
}

const ChartConfigModal: React.FC<ChartConfigModalProps> = ({
  onClose,
  onSave,
  currentChartType,
  viewType,
}) => {
  const { theme } = useTheme();
  const [selectedType, setSelectedType] = React.useState(currentChartType);

  const handleSave = () => {
    onSave(selectedType);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} p-6 rounded-lg shadow-xl`}>
        <h3 className="text-lg font-semibold mb-4">Configuración del Gráfico</h3>
        <div className="mb-4">
          <label className="block mb-2">Tipo de Gráfico:</label>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value as 'line' | 'bar')}
            className={`w-full p-2 rounded ${
              theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-800'
            }`}
          >
            <option value="line">Línea</option>
            <option value="bar">Barras</option>
          </select>
        </div>
        {viewType === 'monthly' && selectedType === 'bar' && (
          <p className="text-yellow-500 mb-4">
            Nota: Para la vista monthly, se recomienda usar el gráfico de líneas para una mejor visualización.
          </p>
        )}
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded ${
              theme === 'dark' ? 'bg-gray-600 hover:bg-gray-500' : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChartConfigModal;