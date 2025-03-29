import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { X, Search, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';

interface ExerciseListModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectExercises: (exercises: any[]) => void;
  theme?: 'light' | 'dark';
}

const ExerciseListModal: React.FC<ExerciseListModalProps> = ({
  isOpen,
  onClose,
  onSelectExercises,
  theme = 'light'
}) => {
  const [exercises, setExercises] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedExercises, setSelectedExercises] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      fetchExercises();
    }
  }, [isOpen]);

  const fetchExercises = async () => {
    try {
      setLoading(true);
      const response = await axios.get('https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/exercises');
      setExercises(response.data.data);
      
      // Extract unique categories
      const uniqueCategories = Array.from(
        new Set(response.data.data.map((exercise: any) => exercise.categoria))
      ).filter(Boolean) as string[];
      
      setCategories(uniqueCategories);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching exercises:', error);
      setError('Error al cargar los ejercicios. Por favor, inténtalo de nuevo.');
      setLoading(false);
    }
  };

  const handleSelectExercise = (exercise: any) => {
    setSelectedExercises(prev => {
      const isSelected = prev.some(e => e._id === exercise._id);
      if (isSelected) {
        return prev.filter(e => e._id !== exercise._id);
      } else {
        return [...prev, exercise];
      }
    });
  };

  const handleConfirmSelection = () => {
    onSelectExercises(selectedExercises);
    setSelectedExercises([]);
    onClose();
  };

  const filteredExercises = exercises.filter(exercise => {
    const matchesSearch = exercise.nombre.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory ? exercise.categoria === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  if (!isOpen) return null;

  const modalContent = (
    <motion.div 
      className="fixed inset-0 flex items-center justify-center"
      style={{ zIndex: 10000 }}
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
        className={`relative w-full max-w-4xl mx-4 rounded-2xl shadow-2xl overflow-hidden ${
          theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
        }`}
        style={{ 
          maxHeight: '90vh',
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
        <div className={`px-8 py-6 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} bg-gradient-to-r from-purple-600/10 to-indigo-600/10`}>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Listado de Ejercicios
          </h2>
          <button
            onClick={onClose}
            className={`absolute top-6 right-6 p-2 rounded-full transition-all duration-200 hover:rotate-90 ${
              theme === 'dark' 
                ? 'hover:bg-gray-700 text-gray-400 hover:text-gray-200' 
                : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
            }`}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Search and Filter */}
        <div className={`p-6 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`}>
                <Search className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar ejercicios..."
                className={`block w-full pl-10 pr-4 py-3 rounded-lg border-2 ${
                  theme === 'dark'
                    ? 'border-gray-600 bg-gray-700 text-white focus:border-purple-500'
                    : 'border-gray-300 bg-white text-gray-900 focus:border-purple-500'
                } focus:ring-4 focus:ring-purple-500/20 transition-all duration-200`}
              />
            </div>
            <div className="md:w-1/3">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className={`block w-full px-4 py-3 rounded-lg border-2 ${
                  theme === 'dark'
                    ? 'border-gray-600 bg-gray-700 text-white focus:border-purple-500'
                    : 'border-gray-300 bg-white text-gray-900 focus:border-purple-500'
                } focus:ring-4 focus:ring-purple-500/20 transition-all duration-200`}
              >
                <option value="">Todas las categorías</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Exercise List */}
        <div className="overflow-y-auto p-6" style={{ maxHeight: 'calc(90vh - 280px)' }}>
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className={`animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 ${
                theme === 'dark' ? 'border-purple-400' : 'border-purple-600'
              }`}></div>
            </div>
          ) : error ? (
            <div className={`text-center py-12 ${theme === 'dark' ? 'text-red-400' : 'text-red-600'}`}>
              {error}
            </div>
          ) : filteredExercises.length === 0 ? (
            <div className={`text-center py-12 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              No se encontraron ejercicios que coincidan con tu búsqueda.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredExercises.map((exercise) => {
                const isSelected = selectedExercises.some(e => e._id === exercise._id);
                return (
                  <div
                    key={exercise._id}
                    onClick={() => handleSelectExercise(exercise)}
                    className={`p-4 rounded-xl cursor-pointer transition-all duration-200 ${
                      isSelected
                        ? theme === 'dark'
                          ? 'bg-purple-900/50 border-2 border-purple-500'
                          : 'bg-purple-50 border-2 border-purple-500'
                        : theme === 'dark'
                          ? 'bg-gray-700/50 border-2 border-gray-700 hover:border-purple-500/50'
                          : 'bg-white border-2 border-gray-200 hover:border-purple-500/50'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className={`font-semibold ${
                          theme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}>
                          {exercise.nombre}
                        </h3>
                        {exercise.categoria && (
                          <span className={`inline-block mt-1 px-2 py-1 text-xs rounded-full ${
                            theme === 'dark'
                              ? 'bg-gray-600 text-gray-300'
                              : 'bg-gray-100 text-gray-700'
                          }`}>
                            {exercise.categoria}
                          </span>
                        )}
                      </div>
                      <div className={`flex-shrink-0 ${
                        isSelected
                          ? theme === 'dark' ? 'text-purple-400' : 'text-purple-600'
                          : 'opacity-0'
                      }`}>
                        <Check className="w-5 h-5" />
                      </div>
                    </div>
                    {exercise.descripcion && (
                      <p className={`mt-2 text-sm ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      } line-clamp-2`}>
                        {exercise.descripcion}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={`px-8 py-6 ${
          theme === 'dark' ? 'bg-gray-900/80' : 'bg-gray-50/80'
        } border-t backdrop-blur-sm ${
          theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <div className="flex justify-between items-center">
            <div className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              {selectedExercises.length} ejercicio{selectedExercises.length !== 1 ? 's' : ''} seleccionado{selectedExercises.length !== 1 ? 's' : ''}
            </div>
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={onClose}
                className={`px-6 py-2.5 text-sm font-medium rounded-lg border-2 transition-all duration-200 ${
                  theme === 'dark'
                    ? 'text-gray-300 bg-gray-800 hover:bg-gray-700 border-gray-600 hover:border-gray-500'
                    : 'text-gray-700 bg-white hover:bg-gray-50 border-gray-300 hover:border-gray-400'
                } focus:ring-4 focus:ring-gray-500/20`}
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmSelection}
                className={`px-6 py-2.5 text-sm font-medium text-white rounded-lg shadow-lg transition-all duration-200 transform hover:scale-[1.02] ${
                  theme === 'dark'
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800'
                    : 'bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700'
                } focus:ring-4 focus:ring-purple-500/30`}
                disabled={selectedExercises.length === 0}
              >
                Agregar a la Rutina
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );

  return ReactDOM.createPortal(
    modalContent,
    document.body
  );
};

export default ExerciseListModal;