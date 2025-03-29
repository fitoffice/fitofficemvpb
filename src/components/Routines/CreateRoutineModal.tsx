
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { X, Plus, Trash2, ChevronDown, List } from 'lucide-react';
import { BasicInformation } from './BasicInformation';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import ExerciseListModal from './ExerciseListModal'; // Import the new component

interface Exercise {
  id: string;
  name: string;
  metrics: Array<{ type: string; value: string }>;
  notes: string;
}

interface CreateRoutineModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  routine?: any;
  theme?: 'light' | 'dark';
  preselectedExercises?: Array<{
    _id: string;
    nombre: string;
    descripcion?: string;
  }>;
}

const metricOptions = [
  'Repeticiones', 'Peso', 'Descanso', 'Tiempo', 'RPE',
  'RPM', 'RIR', 'Tiempo'
];

const CreateRoutineModal: React.FC<CreateRoutineModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave,
  routine,
  theme = 'light',
  preselectedExercises = []
}) => {
  // Remove the useRoutines line
  // const { addRoutine } = useRoutines();
  
  const [routineName, setRoutineName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [openMetricDropdown, setOpenMetricDropdown] = useState<string | null>(null);
  const [apiExercises, setApiExercises] = useState<any[]>([]);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [focusedExerciseId, setFocusedExerciseId] = useState<string | null>(null);
  const [isExerciseListOpen, setIsExerciseListOpen] = useState(false);

  useEffect(() => {
    if (routine) {
      setRoutineName(routine.name || '');
      setDescription(routine.description || '');
      setSelectedTags(routine.tags || []);
      setNotes(routine.notes || '');
      setExercises(routine.exercises || []);
    } else if (preselectedExercises.length > 0) {
      // Convertir ejercicios preseleccionados al formato requerido
      const formattedExercises = preselectedExercises.map(exercise => ({
        id: exercise._id,
        name: exercise.nombre,
        metrics: [
          { type: 'Repeticiones', value: '' },
          { type: 'Peso', value: '' },
          { type: 'Descanso', value: '' }
        ],
        notes: exercise.descripcion || ''
      }));
      setExercises(formattedExercises);
    }
    // Eliminamos fetchExercises() de aquí
  }, [routine, preselectedExercises]);

  // Nuevo useEffect separado que solo se ejecuta una vez al montar el componente
  useEffect(() => {
    // Verificamos si ya tenemos ejercicios cargados para evitar solicitudes innecesarias
    if (apiExercises.length === 0) {
      fetchExercises();
    }
  }, []);  // Array de dependencias vacío = solo se ejecuta al montar

  const fetchExercises = async () => {
    try {
      const response = await axios.get('https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/exercises');
      setApiExercises(response.data.data);
    } catch (error) {
      console.error('Error fetching exercises:', error);
    }
  };

  const handleExerciseNameChange = (exerciseId: string, value: string) => {
    const filteredSuggestions = apiExercises.filter(exercise =>
      exercise.nombre.toLowerCase().includes(value.toLowerCase())
    );
    setSuggestions(value ? filteredSuggestions : []);
    setFocusedExerciseId(exerciseId);

    const newExercises = exercises.map(exercise =>
      exercise.id === exerciseId ? { ...exercise, name: value } : exercise
    );
    setExercises(newExercises);
  };
 const handleSelectExercises = (selectedExercises: any[]) => {
    // Convert selected exercises to the format required by this component
    const newExercises = selectedExercises.map(exercise => ({
      id: exercise._id,
      name: exercise.nombre,
      metrics: [
        { type: 'Repeticiones', value: '' },
        { type: 'Peso', value: '' },
        { type: 'Descanso', value: '' }
      ],
      notes: exercise.descripcion || ''
    }));
    
    // Add the selected exercises to the current exercises list
    setExercises([...exercises, ...newExercises]);
  };
  const selectSuggestion = (exerciseId: string, suggestion: any) => {
    const newExercises = exercises.map(exercise =>
      exercise.id === exerciseId ? { ...exercise, name: suggestion.nombre } : exercise
    );
    setExercises(newExercises);
    setSuggestions([]);
    setFocusedExerciseId(null);
  };

  const addExercise = () => {
    const newExercise: Exercise = {
      id: Date.now().toString(),
      name: '',
      metrics: [
        { type: 'Repeticiones', value: '' },
        { type: 'Peso', value: '' },
        { type: 'Descanso', value: '' }
      ],
      notes: ''
    };
    setExercises([...exercises, newExercise]);
  };

  const removeExercise = (id: string) => {
    setExercises(exercises.filter(exercise => exercise.id !== id));
  };

  const updateMetricValue = (exerciseId: string, metricIndex: number, value: string) => {
    setExercises(exercises.map(exercise =>
      exercise.id === exerciseId
        ? {
            ...exercise,
            metrics: exercise.metrics.map((metric, idx) =>
              idx === metricIndex ? { ...metric, value } : metric
            )
          }
        : exercise
    ));
  };

  const handleUpdateMetric = (exerciseId: string, metricIndex: number, newType: string) => {
    setExercises(prevExercises => 
      prevExercises.map(exercise => 
        exercise.id === exerciseId 
          ? {
              ...exercise,
              metrics: exercise.metrics.map((metric, idx) =>
                idx === metricIndex ? { ...metric, type: newType } : metric
              )
            }
          : exercise
      )
    );
    setOpenMetricDropdown(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('Preparando datos de la rutina para guardar...');
    
    // Transform exercises to the new format with sets
    const formattedExercises = exercises.map(ex => {
      // Create a single set from the metrics
      const set = {};
      ex.metrics.forEach(metric => {
        // Convert metric types to lowercase for property names
        const metricKey = metric.type.toLowerCase();
        set[metricKey] = metric.value;
      });
      
      return {
        name: ex.name,
        notes: ex.notes,
        sets: [set] // Put the single set in an array
      };
    });
    
    // Create render config based on the first exercise's metrics (if available)
    const renderConfig = {};
    if (exercises.length > 0 && exercises[0].metrics.length > 0) {
      exercises[0].metrics.forEach((metric, index) => {
        renderConfig[`campo${index + 1}`] = metric.type.toLowerCase();
      });
    }
    
    const routineData = {
      name: routineName,
      description,
      tags: selectedTags,
      notes,
      exercises: formattedExercises,
      renderConfig
    };
    
    console.log('Datos de la rutina:', routineData);
    
    try {
      console.log('Enviando petición POST a https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/routines...');
      const response = await axios.post('https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/routines', routineData);
      console.log('Rutina guardada exitosamente:', response.data);
      
      // Remove the addRoutine line
      // addRoutine(response.data);
      onSave(routineData);
    } catch (error) {
      console.error('Error al guardar la rutina:', error);
      // You might want to add error handling UI here
    } finally {
      console.log('Cerrando modal...');
      onClose();
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
          <div className={`px-8 py-6 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} bg-gradient-to-r from-blue-600/10 to-purple-600/10`}>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {routine ? "Editar Rutina" : "Crear Nueva Rutina"}
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

          {/* Content - Scrollable */}
          <div className="overflow-y-auto p-8" style={{ maxHeight: 'calc(90vh - 140px)' }}>
            <form onSubmit={handleSave} className="space-y-8">
              {/* Basic Information Section */}
              <div className={`${
                theme === 'dark' ? 'bg-gray-800/50' : 'bg-white'
              } rounded-xl p-6 shadow-lg border-2 ${
                theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
              } hover:border-blue-500/50 transition-all duration-200`}>
                <BasicInformation
                  routineName={routineName}
                  setRoutineName={setRoutineName}
                  description={description}
                  setDescription={setDescription}
                  selectedTags={selectedTags}
                  setSelectedTags={setSelectedTags}
                  notes={notes}
                  setNotes={setNotes}
                  theme={theme}
                />
              </div>
              <div className="flex justify-center">
            <button
              type="button"
              onClick={() => setIsExerciseListOpen(true)}
              className={`inline-flex items-center px-6 py-3 text-sm font-medium rounded-lg shadow-lg ${
                theme === 'dark'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800 text-white'
                  : 'bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white'
              } transition-all duration-200 transform hover:scale-[1.02] focus:ring-4 focus:ring-purple-500/30`}
            >
              <List className="w-5 h-5 mr-2" />
              Abrir Listado de Ejercicios
            </button>
          </div>
              {/* Exercises Section */}
              <div className={`${
                theme === 'dark' ? 'bg-gray-800/50' : 'bg-white'
              } rounded-xl shadow-lg border-2 ${
                theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
              } hover:border-blue-500/50 transition-all duration-200`}>
                <div className="overflow-x-auto">
                  <table className={`min-w-full divide-y ${theme === 'dark' ? 'divide-gray-700' : 'divide-gray-200'}`}>
                    <thead className={`${theme === 'dark' ? 'bg-gray-800/80' : 'bg-gray-50'}`}>
                      <tr>
                      <th className="px-6 py-4 text-left">
                          <span className={`text-xs font-semibold uppercase tracking-wider ${
                            theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                          }`}>
                            Ejercicio
                          </span>
                        </th>
                        {exercises.length > 0 && exercises[0]?.metrics ? 
                          exercises[0].metrics.map((metric, index) => (
                            <th key={index} className="px-6 py-4 text-left" data-metric-index={index}>
                              <div className="relative">
                                <button
                                  type="button"
                                  onClick={() => setOpenMetricDropdown(index.toString())}
                                  className={`group inline-flex items-center space-x-2 px-3 py-1 rounded-full ${
                                    theme === 'dark' 
                                      ? 'bg-gray-700 hover:bg-gray-600 text-blue-400' 
                                      : 'bg-gray-100 hover:bg-gray-200 text-blue-600'
                                  } transition-all duration-200`}
                                >
                                  <span className="text-xs font-semibold uppercase tracking-wider">{metric.type}</span>
                                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${
                                    openMetricDropdown === index.toString() ? 'rotate-180' : ''
                                  }`} />
                                </button>
                                {openMetricDropdown === index.toString() && (
                                  <div 
                                    className={`fixed mt-2 w-48 rounded-xl shadow-xl ${
                                      theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                                    } ring-1 ring-black ring-opacity-5 z-[9999] max-h-64 overflow-y-auto`}
                                    style={{ 
                                      top: 'auto',
                                      left: `${(document.querySelector(`[data-metric-index="${index}"]`) as HTMLElement)?.getBoundingClientRect().left}px`
                                    }}
                                  >
                                    <div className="py-2" role="menu" aria-orientation="vertical">
                                      {metricOptions.map((option) => (
                                        <button
                                          key={option}
                                          type="button"
                                          onClick={() => {
                                            // Update the metric type for all exercises
                                            exercises.forEach(exercise => {
                                              handleUpdateMetric(exercise.id, index, option);
                                            });
                                            setOpenMetricDropdown('');
                                          }}
                                          className={`block w-full text-left px-4 py-2 text-sm ${
                                            theme === 'dark'
                                              ? `${metric.type === option 
                                                  ? 'bg-blue-600 text-white' 
                                                  : 'text-gray-300 hover:bg-gray-700'
                                                }`
                                              : `${metric.type === option
                                                  ? 'bg-blue-50 text-blue-700'
                                                  : 'text-gray-700 hover:bg-gray-100'
                                                }`
                                          } transition-colors duration-150`}
                                          role="menuitem"
                                        >
                                          {option}
                                        </button>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </th>
                          ))
                        : (
                          // Default headers if no exercises or metrics exist
                          <>
                            <th className="px-6 py-4 text-left">
                              <span className={`text-xs font-semibold uppercase tracking-wider ${
                                theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                              }`}>
                                Repeticiones
                              </span>
                            </th>
                            <th className="px-6 py-4 text-left">
                              <span className={`text-xs font-semibold uppercase tracking-wider ${
                                theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                              }`}>
                                Peso
                              </span>
                            </th>
                            <th className="px-6 py-4 text-left">
                              <span className={`text-xs font-semibold uppercase tracking-wider ${
                                theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                              }`}>
                                Descanso
                              </span>
                            </th>
                          </>
                        )}
                        <th className="px-6 py-4 text-left">
                          <span className={`text-xs font-semibold uppercase tracking-wider ${
                            theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                          }`}>
                            Acciones
                          </span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className={`${
                      theme === 'dark' ? 'bg-gray-800/50 divide-y divide-gray-700' : 'bg-white divide-y divide-gray-200'
                    }`}>
                      {exercises.map((exercise, exerciseIndex) => (
                        <tr key={exercise.id} className={`${
                          theme === 'dark' ? 'hover:bg-gray-700/50' : 'hover:bg-blue-50'
                        } transition-colors duration-150`}>
                          <td className="px-6 py-4">
                            <div className="relative">
                              <input
                                type="text"
                                value={exercise.name}
                                onChange={(e) => handleExerciseNameChange(exercise.id, e.target.value)}
                                className={`block w-full px-4 py-2 rounded-lg border-2 ${
                                  theme === 'dark'
                                    ? 'border-gray-600 bg-gray-700 text-white focus:border-blue-500'
                                    : 'border-gray-300 bg-white text-gray-900 focus:border-blue-500'
                                } focus:ring-4 focus:ring-blue-500/20 transition-all duration-200`}
                                placeholder="Nombre del ejercicio"
                              />
                              {focusedExerciseId === exercise.id && suggestions.length > 0 && (
                                <div className={`absolute z-10 mt-1 w-full rounded-lg shadow-lg ${
                                  theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                                } border ${
                                  theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                                }`}>
                                  <ul className={`py-1 max-h-60 overflow-auto ${
                                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                                  }`}>
                                    {suggestions.map((suggestion) => (
                                      <li
                                        key={suggestion.id}
                                        onClick={() => selectSuggestion(exercise.id, suggestion)}
                                        className={`px-4 py-2 cursor-pointer ${
                                          theme === 'dark'
                                            ? 'hover:bg-blue-600/20'
                                            : 'hover:bg-blue-50'
                                        } transition-colors duration-150`}
                                      >
                                        {suggestion.nombre}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          </td>
                          {exercise.metrics.map((metric, metricIndex) => (
                            <td key={metricIndex} className="px-6 py-4">
                              <input
                                type="text"
                                value={metric.value}
                                onChange={(e) => updateMetricValue(exercise.id, metricIndex, e.target.value)}
                                className={`block w-full px-4 py-2 rounded-lg border-2 ${
                                  theme === 'dark'
                                    ? 'border-gray-600 bg-gray-700 text-white focus:border-blue-500'
                                    : 'border-gray-300 bg-white text-gray-900 focus:border-blue-500'
                                } focus:ring-4 focus:ring-blue-500/20 transition-all duration-200`}
                                placeholder={`Valor ${metric.type}`}
                              />
                            </td>
                          ))}
                          <td className="px-6 py-4 text-right">
                            <button
                              type="button"
                              onClick={() => removeExercise(exercise.id)}
                              className={`p-2 rounded-full ${
                                theme === 'dark'
                                  ? 'text-red-400 hover:red-500'
                                  : 'text-red-600 hover:red-500'
                              } transition-all duration-200`}
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {/* Add Exercise Button */}
                <div className={`p-6 border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                  <button
                    type="button"
                    onClick={addExercise}
                    className={`inline-flex items-center px-6 py-3 text-sm font-medium text-white rounded-lg shadow-lg ${
                      theme === 'dark'
                        ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800'
                        : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700'
                    } transition-all duration-200 transform hover:scale-[1.02] focus:ring-4 focus:ring-blue-500/30`}
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Agregar Ejercicio
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Footer - Fixed */}
          <div className={`px-8 py-6 ${
            theme === 'dark' ? 'bg-gray-900/80' : 'bg-gray-50/80'
          } border-t backdrop-blur-sm ${
            theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
          }`}>
            <div className="flex justify-end space-x-4">
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
                onClick={handleSave}
                className={`px-6 py-2.5 text-sm font-medium text-white rounded-lg shadow-lg transition-all duration-200 transform hover:scale-[1.02] ${
                  theme === 'dark'
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800'
                    : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700'
                } focus:ring-4 focus:ring-blue-500/30`}
              >
                {routine ? "Guardar Cambios" : "Crear Rutina"}
              </button>
            </div>
          </div>
          <ExerciseListModal 
        isOpen={isExerciseListOpen}
        onClose={() => setIsExerciseListOpen(false)}
        onSelectExercises={handleSelectExercises}
        theme={theme}
      />
    </motion.div>,

      </motion.div>
    );

    return ReactDOM.createPortal(
      modalContent,
      document.body
    );
  };

  export default CreateRoutineModal;