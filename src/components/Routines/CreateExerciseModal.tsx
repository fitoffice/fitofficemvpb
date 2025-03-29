import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import { X, Save, AlertCircle } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';

interface CreateExerciseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExerciseCreated: () => void;
  initialData?: {
    _id?: string;
    nombre?: string;
    descripcion?: string;
    gruposMusculares?: string[];
    equipamiento?: string[];
    videoUrl?: string;
  };
  isEditing?: boolean;
}

interface ExerciseFormData {
  nombre: string;
  descripcion: string;
  gruposMusculares: string[];
  equipamiento: string[];
  videoUrl: string;
}

const gruposMusculares = [
  'Soleo',
  'Gemelo',
  'Tríceps femoral',
  'Abductor',
  'Aductor',
  'Cuádriceps',
  'Glúteo',
  'Abdominales',
  'Lumbar',
  'Dorsales',
  'Trapecio',
  'Hombro anterior',
  'Hombro lateral',
  'Hombro posterior',
  'Pecho',
  'Tríceps',
  'Bíceps',
  'Cuello',
  'Antebrazo'
];

const equipamientoDisponible = [
  'Pesas',
  'Mancuernas',
  'Barra',
  'Kettlebell',
  'Banda de resistencia',
  'Esterilla',
  'Banco',
  'Máquina de cable',
  'Maquina de Musculación',
  'TRX',
  'Rueda de abdominales',
  'Cuerda para saltar',
  'Balón medicinal',
  'Plataforma de step'
];

const CreateExerciseModal: React.FC<CreateExerciseModalProps> = ({
  isOpen,
  onClose,
  onExerciseCreated,
  initialData,
  isEditing = false,
}) => {
  const { theme } = useTheme();
  const [formData, setFormData] = useState<ExerciseFormData>({
    nombre: '',
    descripcion: '',
    gruposMusculares: [],
    equipamiento: [],
    videoUrl: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        nombre: initialData.nombre || '',
        descripcion: initialData.descripcion || '',
        gruposMusculares: initialData.gruposMusculares || [],
        equipamiento: initialData.equipamiento || [],
        videoUrl: initialData.videoUrl || ''
      });
    } else {
      setFormData({
        nombre: '',
        descripcion: '',
        gruposMusculares: [],
        equipamiento: [],
        videoUrl: ''
      });
    }
  }, [initialData]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (type: 'gruposMusculares' | 'equipamiento', value: string) => {
    setFormData((prev) => {
      const currentArray = prev[type];
      const newArray = currentArray.includes(value)
        ? currentArray.filter(item => item !== value)
        : [...currentArray, value];
      return {
        ...prev,
        [type]: newArray
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!formData.nombre.trim()) {
        throw new Error('El nombre del ejercicio es obligatorio');
      }

      if (isEditing && initialData?._id) {
        await axios.put(`https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/exercises/${initialData._id}`, {
          ...formData,
          grupoMuscular: formData.gruposMusculares,
          equipo: formData.equipamiento
        });
      } else {
        await axios.post('https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/exercises', {
          ...formData,
          grupoMuscular: formData.gruposMusculares,
          equipo: formData.equipamiento
        });
      }
      onExerciseCreated();
      onClose();
      setFormData({
        nombre: '',
        descripcion: '',
        gruposMusculares: [],
        equipamiento: [],
        videoUrl: ''
      });
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Error al guardar el ejercicio. Por favor, intente de nuevo.'
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const modalContent = (
    <motion.div 
      className="fixed inset-0 flex items-center justify-center"
      style={{ zIndex: 9999 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div 
        className="fixed inset-0 bg-black/70 backdrop-blur-sm" 
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />
      <motion.div
        className={`${
          theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
        } rounded-2xl shadow-2xl relative w-[800px] max-h-[90vh] overflow-y-auto z-50`}
        style={{
          backgroundColor: theme === 'dark' ? 'rgb(31, 41, 55)' : '#ffffff',
          boxShadow: theme === 'dark' 
            ? '0 25px 50px -12px rgba(0, 0, 0, 0.5)' 
            : '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
        }}
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        transition={{ type: "spring", duration: 0.5 }}
      >
        {/* Header */}
        <div className={`p-6 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} bg-gradient-to-r from-blue-600/10 to-purple-600/10`}>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {isEditing ? 'Editar Ejercicio' : 'Crear Nuevo Ejercicio'}
          </h2>
          <button
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 hover:rotate-90"
            onClick={onClose}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-lg bg-red-100/90 dark:bg-red-900/30 text-red-800 dark:text-red-200 flex items-center gap-3 border border-red-200 dark:border-red-800"
            >
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}

          <div className="space-y-8">
            {/* Nombre del ejercicio */}
            <div className="group">
              <label htmlFor="nombre" className="block text-sm font-semibold mb-2 group-hover:text-blue-500 transition-colors">
                Nombre del ejercicio *
              </label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 rounded-lg border-2 ${
                  theme === 'dark' 
                    ? 'bg-gray-700/50 border-gray-600 focus:border-blue-500' 
                    : 'bg-white border-gray-200 focus:border-blue-500'
                } focus:ring-4 focus:ring-blue-500/20 transition-all duration-200`}
                placeholder="Ej: Press de banca"
              />
            </div>

            {/* Descripción */}
            <div className="group">
              <label htmlFor="descripcion" className="block text-sm font-semibold mb-2 group-hover:text-blue-500 transition-colors">
                Descripción
              </label>
              <textarea
                id="descripcion"
                name="descripcion"
                value={formData.descripcion}
                onChange={handleInputChange}
                rows={4}
                className={`w-full px-4 py-3 rounded-lg border-2 ${
                  theme === 'dark' 
                    ? 'bg-gray-700/50 border-gray-600 focus:border-blue-500' 
                    : 'bg-white border-gray-200 focus:border-blue-500'
                } focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 resize-none`}
                placeholder="Describe el ejercicio y su ejecución..."
              />
            </div>

            {/* Grupos Musculares y Equipamiento en grid */}
            <div className="grid grid-cols-2 gap-8">
              {/* Grupos Musculares */}
              <div className="group">
                <label className="block text-sm font-semibold mb-3 group-hover:text-blue-500 transition-colors">
                  Grupos Musculares
                </label>
                <div className={`p-4 rounded-lg border-2 ${
                  theme === 'dark' ? 'border-gray-600 bg-gray-700/50' : 'border-gray-200 bg-gray-50'
                } max-h-[240px] overflow-y-auto custom-scrollbar`}>
                  {gruposMusculares.map((grupo) => (
                    <label key={grupo} className="flex items-center p-2.5 hover:bg-blue-500/10 rounded-lg cursor-pointer transition-colors">
                      <input
                        type="checkbox"
                        checked={formData.gruposMusculares.includes(grupo)}
                        onChange={() => handleCheckboxChange('gruposMusculares', grupo)}
                        className="w-4 h-4 text-blue-600 rounded-md focus:ring-blue-500/30 transition-all"
                      />
                      <span className="ml-3 select-none">{grupo}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Equipamiento */}
              <div className="group">
                <label className="block text-sm font-semibold mb-3 group-hover:text-blue-500 transition-colors">
                  Equipamiento
                </label>
                <div className={`p-4 rounded-lg border-2 ${
                  theme === 'dark' ? 'border-gray-600 bg-gray-700/50' : 'border-gray-200 bg-gray-50'
                } max-h-[240px] overflow-y-auto custom-scrollbar`}>
                  {equipamientoDisponible.map((equipo) => (
                    <label key={equipo} className="flex items-center p-2.5 hover:bg-blue-500/10 rounded-lg cursor-pointer transition-colors">
                      <input
                        type="checkbox"
                        checked={formData.equipamiento.includes(equipo)}
                        onChange={() => handleCheckboxChange('equipamiento', equipo)}
                        className="w-4 h-4 text-blue-600 rounded-md focus:ring-blue-500/30 transition-all"
                      />
                      <span className="ml-3 select-none">{equipo}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* URL del video */}
            <div className="group">
              <label htmlFor="videoUrl" className="block text-sm font-semibold mb-2 group-hover:text-blue-500 transition-colors">
                Link video tutorial
              </label>
              <input
                type="url"
                id="videoUrl"
                name="videoUrl"
                value={formData.videoUrl}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 rounded-lg border-2 ${
                  theme === 'dark' 
                    ? 'bg-gray-700/50 border-gray-600 focus:border-blue-500' 
                    : 'bg-white border-gray-200 focus:border-blue-500'
                } focus:ring-4 focus:ring-blue-500/20 transition-all duration-200`}
                placeholder="https://www.youtube.com/watch?v=..."
              />
            </div>
          </div>

          {/* Footer con botones */}
          <div className="flex justify-end gap-4 mt-10 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className={`px-6 py-2.5 rounded-lg font-medium transition-all duration-200 ${
                theme === 'dark'
                  ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              } focus:ring-4 focus:ring-gray-500/20`}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-medium flex items-center gap-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:ring-4 focus:ring-blue-500/30 shadow-lg shadow-blue-500/30"
            >
              <Save className="w-5 h-5" />
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Guardando...
                </span>
              ) : (
                'Guardar'
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );

  return ReactDOM.createPortal(
    modalContent,
    document.body
  );
};

export default CreateExerciseModal;