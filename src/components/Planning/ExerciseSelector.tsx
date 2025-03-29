import React, { useState, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { Search, X, Filter, Dumbbell, Target } from 'lucide-react';
import Button from '../Common/Button';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
// Fix the import to match what's actually exported from the context
import { useExercise } from '../../contexts/ExerciseContext';

interface Exercise {
  _id: string;
  nombre: string;
  tipo?: string;
  grupoMuscular: string[];
  descripcion: string;
  equipo: string[];
  imgUrl: string;
  fechaCreacion: string;
}

// Use the Exercise interface instead of redefining ExerciseWithSets
interface ExerciseWithSets {
  _id: string;
  exercise: Exercise;
  sets: Array<{
    _id: string;
    reps: number;
    weight?: number;
    rest?: number;
  }>;
  createdAt: string;
  updatedAt: string;
}

// Define ExerciseData type if it's not imported
type ExerciseData = Exercise;

interface ExerciseSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectExercise: (exercise: ExerciseWithSets) => void;
  planningId: string;
  weekNumber: number;
  selectedDay: string;
  sessionId: string;
}

const ExerciseSelector: React.FC<ExerciseSelectorProps> = ({
  isOpen,
  onClose,
  onSelectExercise,
  planningId,
  weekNumber,
  selectedDay,
  sessionId,
}) => {
  // Add console log to check weekNumber value and type
  console.log('ExerciseSelector - weekNumber recibido:', weekNumber, 'tipo:', typeof weekNumber);
  
  const { theme } = useTheme();
  // Get the correct function from the context
  const exerciseContext = useExercise();
  const [searchTerm, setSearchTerm] = useState('');
   const [selectedType, setSelectedType] = useState<string>('');
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState<string>('');
  const [exercises, setExercises] = useState<ExerciseData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('ExerciseSelector: Iniciando fetchExercises');
    fetchExercises();
  }, []);

  const fetchExercises = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No se encontró el token de autenticación');
      }

      console.log('ExerciseSelector: Realizando petición a la API de ejercicios');
      const response = await axios.get('https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/exercises', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.data) {
        console.log('ExerciseSelector: Ejercicios obtenidos exitosamente:', response.data.data.length);
        setExercises(response.data.data);
      } else {
        throw new Error('Error al obtener los ejercicios');
      }
    } catch (err) {
      console.error('ExerciseSelector: Error en fetchExercises:', err);
      setError(err instanceof Error ? err.message : 'Error al cargar los ejercicios');
    } finally {
      setLoading(false);
    }
  };

  const addExerciseToSession = async (exercise: ExerciseData) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No se encontró el token de autenticación');
      }

      // Log the URL parameters before making the API call
      console.log('ExerciseSelector - Añadiendo ejercicio con parámetros:', {
        planningId,
        weekNumber,
        selectedDay,
        sessionId,
        exerciseId: exercise._id
      });

      // Hacer la petición POST para añadir el ejercicio a la sesión
      const url = `https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/plannings/${planningId}/weeks/${weekNumber}/days/${selectedDay}/sessions/${sessionId}/exercises`;
      const response = await axios.post(
        url,
        { exerciseId: exercise._id },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.data) {
        throw new Error('Error al agregar el ejercicio a la sesión');
      }

      // Remove this line that's causing the error
      // setExerciseResponse(response.data);
      
      // If you need to update the exercise context, check if the function exists first
      if (exerciseContext && typeof exerciseContext.setExerciseData === 'function') {
        exerciseContext.setExerciseData(response.data);
      }

      // Crear el objeto ExerciseWithSets con los datos de la respuesta
      const exerciseWithSets: ExerciseWithSets = {
        _id: response.data.data._id, // Fix: Access the _id from response.data.data
        exercise: exercise,
        sets: response.data.data.sets || [], // Fix: Access sets from response.data.data
        createdAt: response.data.data.createdAt, // Fix: Access createdAt from response.data.data
        updatedAt: response.data.data.updatedAt // Fix: Access updatedAt from response.data.data
      };

      console.log('Ejercicio añadido exitosamente:', response.data);
      onSelectExercise(exerciseWithSets);
      onClose();
    } catch (error) {
      console.error('Error al añadir ejercicio:', error);
      // Mostrar un mensaje de error al usuario
      alert(error instanceof Error ? error.message : 'Error al añadir el ejercicio a la sesión');
    }
  };

  const filteredExercises = exercises.filter(exercise => {
    const matchesSearch = exercise.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exercise.descripcion.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !selectedType || (exercise.tipo && exercise.tipo === selectedType);
    const matchesMuscleGroup = !selectedMuscleGroup || exercise.grupoMuscular.includes(selectedMuscleGroup);
    return matchesSearch && matchesType && matchesMuscleGroup;
  });

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className={`bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto ${
            theme === 'dark' ? 'dark' : ''
          }`}
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold dark:text-white">Seleccionar Ejercicio</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <X size={24} />
            </button>
          </div>

          {/* Search and Filters */}
          <div className="mb-6 space-y-4">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Buscar ejercicio..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedType('');
                  setSelectedMuscleGroup('');
                  setSearchTerm('');
                }}
              >
                Limpiar filtros
              </Button>
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Dumbbell size={20} className="text-gray-500" />
                  <span className="text-sm font-medium dark:text-white">Tipo de ejercicio</span>
                </div>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="">Todos los tipos</option>
                  <option value="Fuerza">Fuerza</option>
                  <option value="Cardio">Cardio</option>
                  <option value="Flexibilidad">Flexibilidad</option>
                </select>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Target size={20} className="text-gray-500" />
                  <span className="text-sm font-medium dark:text-white">Grupo muscular</span>
                </div>
                <select
                  value={selectedMuscleGroup}
                  onChange={(e) => setSelectedMuscleGroup(e.target.value)}
                  className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="">Todos los grupos</option>
                  <option value="Pecho">Pecho</option>
                  <option value="Espalda">Espalda</option>
                  <option value="Piernas">Piernas</option>
                  <option value="Hombros">Hombros</option>
                  <option value="Brazos">Brazos</option>
                  <option value="Core">Core</option>
                </select>
              </div>
            </div>
          </div>

          {/* Exercise List */}
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
            </div>
          ) : error ? (
            <div className="text-red-500 text-center py-4">{error}</div>
          ) : filteredExercises.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              No se encontraron ejercicios que coincidan con los filtros.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredExercises.map((exercise) => (
                <div
                  key={exercise._id}
                  className="border rounded-lg p-4 hover:shadow-lg transition-shadow dark:bg-gray-700 dark:border-gray-600"
                >
                  <h3 className="font-semibold mb-2 dark:text-white">{exercise.nombre}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">{exercise.descripcion}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {exercise.grupoMuscular.map((grupo, index) => (
                      <span
                        key={`${exercise._id}-${grupo}-${index}`}
                        className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                      >
                        {grupo}
                      </span>
                    ))}
                  </div>
                  <Button
                    variant="primary"
                    onClick={() => addExerciseToSession(exercise)}
                    className="w-full"
                  >
                    Seleccionar
                  </Button>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ExerciseSelector;
