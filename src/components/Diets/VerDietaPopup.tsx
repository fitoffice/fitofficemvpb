import React from 'react';
import Modal from '../Common/Modal';
import { X } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface VerDietaPopupProps {
  isOpen: boolean;
  onClose: () => void;
  dietData: {
    nombre: string;
    cliente: string;
    fechaInicio: string;
    objetivo: string;
    restricciones: string;
    estado: string;
    // Add any other diet properties you want to display
  };
}

const VerDietaPopup: React.FC<VerDietaPopupProps> = ({ isOpen, onClose, dietData }) => {
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Detalles de la Dieta">
      <div className={`p-6 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className={`font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Nombre
              </h3>
              <p>{dietData.nombre}</p>
            </div>
            <div>
              <h3 className={`font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Cliente
              </h3>
              <p>{dietData.cliente}</p>
            </div>
            <div>
              <h3 className={`font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Fecha de Inicio
              </h3>
              <p>{dietData.fechaInicio}</p>
            </div>
            <div>
              <h3 className={`font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Objetivo
              </h3>
              <p>{dietData.objetivo}</p>
            </div>
            <div>
              <h3 className={`font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Restricciones
              </h3>
              <p>{dietData.restricciones}</p>
            </div>
            <div>
              <h3 className={`font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Estado
              </h3>
              <p>{dietData.estado}</p>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className={`flex items-center px-4 py-2 rounded-lg ${
              isDarkMode
                ? 'bg-gray-700 hover:bg-gray-600 text-white'
                : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
            } transition-colors duration-200`}
          >
            <X className="w-4 h-4 mr-2" />
            Cerrar
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default VerDietaPopup;