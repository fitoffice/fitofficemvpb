import React, { useState, useEffect } from 'react';
import { useTheme } from '../../../contexts/ThemeContext';
import { Search, X, Filter, Dumbbell, Target, Clock } from 'lucide-react';
import Button from '../../Common/Button';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

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

interface Set {
  reps: number;
  weight: number;
  weightType: string;
  rest: number;
  tempo: string;
  rpe: number;
}

interface ExerciseWithSets {
  exercise: Exercise;
  sets: Set[];
}

interface ExerciseSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectExercise: (exercise: ExerciseWithSets) => void;
  templateId: string;
  weekNumber: number;
  dayNumber: number;
  sessionId: string;
  rangoId?: string; // Added rangoId as an optional prop
}

const ExerciseSelector: React.FC<ExerciseSelectorProps> = ({
  isOpen,
  onClose,
  onSelectExercise,
  templateId,
  weekNumber,
  dayNumber,
  sessionId,
  rangoId,
}) => {
  const { theme } = useTheme();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('');
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState<string>('');

  // Log inicial de props y validación
  useEffect(() => {
    if (isOpen) {
      console.log('=== ExerciseSelector Abierto ===');
      console.log('Validando datos recibidos:');
      
      const missingData = [];
      if (!templateId) missingData.push('Template ID');
      if (!weekNumber) missingData.push('Semana');
      if (!dayNumber) missingData.push('Día');
      if (!sessionId) missingData.push('Sesión ID');
      // No validamos rangoId como requerido ya que es opcional

      if (missingData.length > 0) {
        console.error('Datos faltantes:', missingData.join(', '));
      }

      console.table({
        'Template ID': templateId || 'FALTA',
        'Semana': weekNumber || 'FALTA',
        'Día': dayNumber || 'FALTA',
        'Sesión ID': sessionId || 'FALTA',
        'Rango ID': rangoId || 'NO PROPORCIONADO'
      });
    }
  }, [isOpen, templateId, weekNumber, dayNumber, sessionId, rangoId]);

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

  const handleSelectExercise = async (exercise: Exercise) => {
    console.log('ExerciseSelector - handleSelectExercise llamado');
    console.log('Datos del ejercicio:', exercise);

    try {
      // Datos del ejercicio por defecto
      const defaultSet = {
        reps: 12,
        weight: 20,
        weightType: "absolute",
        rest: 60,
        tempo: "2-0-2",
        rpe: 8
      };

      const exerciseData = {
        exerciseId: exercise._id,
        sets: [defaultSet]
      };

      // Siempre usar el endpoint de rangos
      const url = `https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/planningtemplate/templates/${templateId}/rangos/${rangoId}/days/${dayNumber}/sessions/${sessionId}/exercises`;
      
      console.log('URL de la petición:', url);
      console.log('Datos a enviar:', exerciseData);

      const response = await axios.post(url, exerciseData);

      console.log('Respuesta del servidor:', response.data);

      if (response.status === 200 || response.status === 201) {
        onSelectExercise({
          exercise: exercise,
          sets: [defaultSet]
        });
        onClose();
      }
    } catch (error) {
      console.error('Error al agregar ejercicio:', error);
      if (axios.isAxiosError(error)) {
        console.error('Detalles del error:', {
          status: error.response?.status,
          data: error.response?.data,
          headers: error.response?.headers
        });
      }
      setError('Error al agregar el ejercicio');
      alert(error instanceof Error ? error.message : 'Error al añadir el ejercicio a la sesión');
    }
  };
  // Obtener tipos y grupos musculares únicos de los ejercicios
  const types = Array.from(
    new Set(exercises.map((e) => e.tipo).filter(Boolean))
  );
  
  const muscleGroups = Array.from(
    new Set(exercises.flatMap((e) => e.grupoMuscular))
  );

  const filteredExercises = exercises.filter((exercise) => {
    const matchesSearch = exercise.nombre
      .toLowerCase()
      .includes(searchTerm.toLowerCase()) ||
      exercise.descripcion.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType =
      !selectedType || exercise.tipo === selectedType;
    const matchesMuscleGroup =
      !selectedMuscleGroup || exercise.grupoMuscular.includes(selectedMuscleGroup);

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

          {/* Mostrar datos recibidos en la UI */}
          <div className={`mb-4 p-3 rounded-lg ${
            theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
          }`}>
            <h3 className="text-sm font-semibold mb-2">Datos de la Sesión:</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="font-medium">Template:</span>
                <span className="ml-2">{templateId?.slice(-6)}</span>
              </div>
              <div>
                <span className="font-medium">Semana:</span>
                <span className="ml-2">{weekNumber}</span>
              </div>
              <div>
                <span className="font-medium">Día:</span>
                <span className="ml-2">{dayNumber}</span>
              </div>
              <div>
                <span className="font-medium">Sesión:</span>
                <span className="ml-2">{sessionId?.slice(-6)}</span>
              </div>
              {rangoId && (
                <div className="col-span-2">
                  <span className="font-medium">Rango:</span>
                  <span className="ml-2">{rangoId?.slice(-6)}</span>
                </div>
              )}
            </div>
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
                  {types.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
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
                  {muscleGroups.map((group) => (
                    <option key={group} value={group}>
                      {group}
                    </option>
                  ))}
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
                  className="border rounded-lg p-4 hover:shadow-lg transition-shadow dark:bg-gray-700 dark:border-gray-600 cursor-pointer"
                  onClick={() => handleSelectExercise(exercise)}
                >
                  {exercise.imgUrl && (
                    <img
                      src={exercise.imgUrl}
                      alt={exercise.nombre}
                      className="w-full h-32 object-cover rounded-lg mb-3"
                    />
                  )}
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
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectExercise(exercise);
                    }}
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