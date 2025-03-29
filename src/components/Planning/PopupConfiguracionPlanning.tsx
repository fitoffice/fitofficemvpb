import React from 'react';
import { X } from 'lucide-react';
import { motion } from 'framer-motion';
import { Planning } from '../../pages/types/planning';
import Button from '../Common/Button';
import { useTheme } from '../../contexts/ThemeContext';

interface PopupConfiguracionPlanningProps {
  planning: Planning | null;
  setPlanning: React.Dispatch<React.SetStateAction<Planning | null>>;
  onClose: () => void;
  isOpen: boolean;
}

const PopupConfiguracionPlanning: React.FC<PopupConfiguracionPlanningProps> = ({
  planning,
  setPlanning,
  onClose,
  isOpen
}) => {
  const { theme } = useTheme();
  
  if (!isOpen || !planning) return null;

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPlanning({
      ...planning,
      nombre: e.target.value
    });
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPlanning({
      ...planning,
      descripcion: e.target.value
    });
  };

  const handleWeeksChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const weeks = parseInt(e.target.value);
    if (!isNaN(weeks) && weeks > 0) {
      setPlanning({
        ...planning,
        semanas: weeks
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className={`relative w-full max-w-2xl p-6 rounded-xl shadow-2xl ${
          theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
        }`}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
            Configuración de Planificación
          </h2>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Nombre de la planificación</label>
            <input
              type="text"
              value={planning.nombre}
              onChange={handleNameChange}
              className={`w-full p-3 rounded-lg border ${
                theme === 'dark' 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              } focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Descripción</label>
            <textarea
              value={planning.descripcion}
              onChange={handleDescriptionChange}
              rows={4}
              className={`w-full p-3 rounded-lg border ${
                theme === 'dark' 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              } focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Número de semanas</label>
            <input
              type="number"
              min="1"
              value={planning.semanas || 4}
              onChange={handleWeeksChange}
              className={`w-full p-3 rounded-lg border ${
                theme === 'dark' 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              } focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
            />
          </div>

          <div className="flex justify-end space-x-4 mt-8">
            <Button
              variant="danger"
              onClick={onClose}
              className="px-6 py-2.5"
            >
              Cancelar
            </Button>
            <Button
              variant="create"
              onClick={onClose}
              className="px-6 py-2.5"
            >
              Guardar
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PopupConfiguracionPlanning;