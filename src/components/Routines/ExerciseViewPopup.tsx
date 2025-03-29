import React from 'react';
import ReactDOM from 'react-dom';
import { motion } from 'framer-motion';
import { Dumbbell } from 'lucide-react';

interface Exercise {
  _id: string;
  nombre: string;
  creador?: string;
  grupoMuscular: string[];
  equipo: string[];
  descripcion: string;
  imgUrl?: string;
  videoUrl?: string;
  fechaCreacion?: string;
  __v?: number;
}

interface ExerciseViewPopupProps {
  isOpen: boolean;
  onClose: () => void;
  exercise: Exercise;
  theme: string;
}

const ExerciseViewPopup: React.FC<ExerciseViewPopupProps> = ({
  isOpen,
  onClose,
  exercise,
  theme
}) => {
  if (!isOpen || !exercise) return null;

  const modalContent = (
    <motion.div
      className="fixed inset-0 flex items-center justify-center"
      style={{ zIndex: 9999 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div 
        className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm" 
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className={`${
          theme === 'dark'
            ? 'bg-gray-800 border-gray-700'
            : 'bg-white border-gray-200'
        } p-6 rounded-2xl shadow-xl border w-[600px] max-h-[90vh] overflow-y-auto relative z-50`}
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className={`text-2xl font-bold ${
            theme === 'dark'
              ? 'bg-gradient-to-r from-blue-400 to-purple-400'
              : 'bg-gradient-to-r from-blue-600 to-purple-600'
          } bg-clip-text text-transparent`}>Detalles del Ejercicio</h3>
          <button
            onClick={onClose}
            className={`p-2 rounded-xl transition-all duration-200 ${
              theme === 'dark'
                ? 'hover:bg-gray-700 text-gray-400 hover:text-gray-300'
                : 'hover:bg-gray-100 text-gray-600 hover:text-gray-700'
            }`}
          >
            <Dumbbell className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Rest of the content remains the same */}
          {/* Nombre */}
          <div>
            <h4 className={`text-sm font-medium ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            }`}>Nombre</h4>
            <p className={`text-lg ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>{exercise.nombre}</p>
          </div>

          {/* Descripción */}
          <div>
            <h4 className={`text-sm font-medium ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            }`}>Descripción</h4>
            <p className={`text-lg ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>{exercise.descripcion}</p>
          </div>

          {/* Grupos Musculares */}
          <div>
            <h4 className={`text-sm font-medium ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            }`}>Grupos Musculares</h4>
            <div className="flex flex-wrap gap-2 mt-2">
              {exercise.grupoMuscular.map((musculo) => (
                <span
                  key={musculo}
                  className={`px-3 py-1 rounded-full text-sm ${
                    theme === 'dark'
                      ? 'bg-blue-500/20 text-blue-300'
                      : 'bg-blue-100 text-blue-700'
                  }`}
                >
                  {musculo}
                </span>
              ))}
            </div>
          </div>

          {/* Equipamiento */}
          <div>
            <h4 className={`text-sm font-medium ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            }`}>Equipamiento</h4>
            <div className="flex flex-wrap gap-2 mt-2">
              {exercise.equipo.map((equipo) => (
                <span
                  key={equipo}
                  className={`px-3 py-1 rounded-full text-sm ${
                    theme === 'dark'
                      ? 'bg-purple-500/20 text-purple-300'
                      : 'bg-purple-100 text-purple-700'
                  }`}
                >
                  {equipo}
                </span>
              ))}
            </div>
          </div>

          {/* Imágenes y Videos */}
          {(exercise.imgUrl || exercise.videoUrl) && (
            <div className="space-y-4">
              {exercise.imgUrl && (
                <div>
                  <h4 className={`text-sm font-medium mb-2 ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                  }`}>Imagen</h4>
                  <img
                    src={exercise.imgUrl}
                    alt={exercise.nombre}
                    className="w-full h-auto rounded-xl"
                  />
                </div>
              )}
              {exercise.videoUrl && (
                <div>
                  <h4 className={`text-sm font-medium mb-2 ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                  }`}>Video</h4>
                  <div className="relative pt-[56.25%]">
                    <iframe
                      src={exercise.videoUrl}
                      className="absolute inset-0 w-full h-full rounded-xl"
                      allowFullScreen
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );

  return ReactDOM.createPortal(
    modalContent,
    document.body
  );
};

export default ExerciseViewPopup;