import React from 'react';
import { X } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface PopupSkeletonProps {
  isOpen: boolean;
  onClose: () => void;
  rutina: any;
}

const PopupSkeleton: React.FC<PopupSkeletonProps> = ({ isOpen, onClose, rutina }) => {
  const { theme } = useTheme();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className={`relative w-full max-w-4xl ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-white'
      } rounded-lg shadow-xl p-6`}>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X size={24} />
        </button>

        <h2 className={`text-2xl font-bold mb-6 ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>
          Esqueleto de la Rutina: {rutina.nombre}
        </h2>

        <div className="grid grid-cols-2 gap-8">
          {/* Vista frontal */}
          <div className={`p-4 rounded-lg ${
            theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
          }`}>
            <h3 className={`text-xl font-semibold mb-4 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Vista Frontal
            </h3>
            <img 
              src="/skeleton-front.png" 
              alt="Esqueleto vista frontal"
              className="w-full h-auto"
            />
          </div>

          {/* Vista trasera */}
          <div className={`p-4 rounded-lg ${
            theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
          }`}>
            <h3 className={`text-xl font-semibold mb-4 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Vista Trasera
            </h3>
            <img 
              src="/skeleton-back.png" 
              alt="Esqueleto vista trasera"
              className="w-full h-auto"
            />
          </div>
        </div>

        <div className={`mt-6 p-4 rounded-lg ${
          theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
        }`}>
          <h3 className={`text-xl font-semibold mb-4 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Grupos Musculares Trabajados
          </h3>
          <div className="grid grid-cols-3 gap-4">
            {rutina.ejercicios?.map((ejercicio: any, index: number) => (
              <div key={index} className={`p-2 rounded ${
                theme === 'dark' ? 'bg-gray-600' : 'bg-gray-100'
              }`}>
                <p className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>
                  {ejercicio.grupoMuscular}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PopupSkeleton;
