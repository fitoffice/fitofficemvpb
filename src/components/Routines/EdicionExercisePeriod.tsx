import React, { useEffect, useState } from 'react';
import { Search, Plus, Minus, Edit2, ChevronDown, ChevronUp, X } from 'lucide-react';
import clsx from 'clsx';

interface FieldOption {
  value: string;
  label: string;
}

interface FieldConfig {
  type: string;
  value: number;
}

interface Set {
  [key: string]: number;
  campo1: number;
  campo2: number;
  campo3: number;
}

interface ExerciseSet {
  exercise: string;
  sets: Set[];
  config: {
    campo1: string;
    campo2: string;
    campo3: string;
  };
}

interface Variant {
  color: string;
  exercises: ExerciseSet[];
}

interface Day {
  dayNumber: number;
  variants: Variant[];
}

interface Exercise {
  _id: string;
  nombre: string;
  grupoMuscular: string[];
  descripcion: string;
  equipo: string[];
  fechaCreacion: string;
}

interface Period {
  nombre: string;
  semanaInicio: number;
  diaInicio: number;
  semanaFin: number;
  diaFin: number;
  variants: Variant[];
}

interface EdicionExercisePeriodProps {
  periods: Period[];
  onSave: (updatedPeriods: Period[]) => void;
  onClose: () => void;
}

const fieldOptions = {
  campo1: [
    { value: 'reps', label: 'Repeticiones' },
    { value: 'distance', label: 'Distancia' },
    { value: 'tempo', label: 'Tempo' },
    { value: 'calories', label: 'Calorías' }
  ],
  campo2: [
    { value: 'weight', label: 'Peso' },
    { value: 'speed', label: 'Velocidad' },
    { value: 'height', label: 'Altura' },
    { value: 'cadence', label: 'Cadencia' },
    { value: 'rpm', label: 'RPM' }
  ],
  campo3: [
    { value: 'rest', label: 'Descanso' },
    { value: 'round', label: 'Ronda' },
    { value: 'rpe', label: 'RPE' },
    { value: 'rir', label: 'RIR' }
  ]
};

export function EdicionExercisePeriod({ periods, onSave, onClose }: EdicionExercisePeriodProps) {
  console.log('EdicionExercisePeriod - Props recibidos:', { periods, onSave, onClose });

  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<'verde'>('verde');
  const [currentPeriods, setCurrentPeriods] = useState<Period[]>(periods);
  const [selectedPeriodIndex, setSelectedPeriodIndex] = useState<number>(0);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [showSetModal, setShowSetModal] = useState(false);
  const [currentSets, setCurrentSets] = useState<Set[]>([]);
  const [currentConfig, setCurrentConfig] = useState({
    campo1: 'reps',
    campo2: 'weight',
    campo3: 'rest'
  });
  const [expandedExercises, setExpandedExercises] = useState<string[]>([]);

  console.log('EdicionExercisePeriod - Estado inicial:', {
    currentPeriods,
    selectedPeriodIndex,
    selectedVariant,
    currentSets,
    currentConfig
  });

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        console.log('EdicionExercisePeriod - Iniciando fetchExercises');
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No se encontró el token de autenticación');
        }

        const response = await fetch('https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/exercises', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Error al obtener los ejercicios');
        }

        const data = await response.json();
        console.log('EdicionExercisePeriod - Ejercicios obtenidos:', data);
        setExercises(data.data);
        setLoading(false);
      } catch (err) {
        console.error('EdicionExercisePeriod - Error en fetchExercises:', err);
        setError(err instanceof Error ? err.message : 'Error desconocido');
        setLoading(false);
      }
    };

    fetchExercises();
  }, []);

  const handleAddSet = () => {
    setCurrentSets([...currentSets, { campo1: 0, campo2: 0, campo3: 0 }]);
  };

  const handleRemoveSet = (index: number) => {
    setCurrentSets(currentSets.filter((_, i) => i !== index));
  };

  const handleSetChange = (index: number, field: string, value: number) => {
    const newSets = [...currentSets];
    
    // For campo2 (weight field), restrict value between 1 and 100
    if (field === 'campo2' && currentConfig[field] === 'weight') {
      if (value < 1) value = 1;
      if (value > 100) value = 100;
    }
    
    newSets[index] = { ...newSets[index], [field]: value };
    setCurrentSets(newSets);
  };

  const handleConfigChange = (field: string, value: string) => {
    setCurrentConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddExercise = (exercise: Exercise) => {
    setSelectedExercise(exercise);
    setCurrentSets([{ campo1: 0, campo2: 0, campo3: 0 }]);
    
    const existingExercise = getCurrentExercise(exercise._id);
    if (existingExercise) {
      setCurrentConfig(existingExercise.config);
      setCurrentSets(existingExercise.sets);
    } else {
      setCurrentConfig({
        campo1: 'reps',
        campo2: 'weight',
        campo3: 'rest'
      });
    }
    
    setShowSetModal(true);
  };

  const getCurrentExercise = (exerciseId: string) => {
    const currentPeriod = currentPeriods[selectedPeriodIndex];
    const variant = currentPeriod.variants.find(v => v.color === selectedVariant);
    return variant?.exercises.find(e => e.exercise === exerciseId);
  };

  const handleSaveExercise = () => {
    console.log('EdicionExercisePeriod - Iniciando handleSaveExercise');
    if (!selectedExercise) return;

    console.log('EdicionExercisePeriod - Ejercicio seleccionado:', selectedExercise);
    console.log('EdicionExercisePeriod - Sets actuales:', currentSets);
    console.log('EdicionExercisePeriod - Configuración actual:', currentConfig);

    const newExercise: ExerciseSet = {
      exercise: selectedExercise._id,
      sets: currentSets,
      config: currentConfig
    };

    console.log('EdicionExercisePeriod - Nuevo ejercicio creado:', newExercise);

    const newPeriods = [...currentPeriods];
    const currentPeriod = newPeriods[selectedPeriodIndex];
    const variantIndex = currentPeriod.variants.findIndex(v => v.color === selectedVariant);

    if (variantIndex === -1) {
      currentPeriod.variants.push({
        color: selectedVariant,
        exercises: [newExercise]
      });
    } else {
      currentPeriod.variants[variantIndex].exercises.push(newExercise);
    }

    console.log('EdicionExercisePeriod - Periodos actualizados:', newPeriods);
    setCurrentPeriods(newPeriods);
    setShowSetModal(false);
  };

  const handleSavePeriods = () => {
    console.log('EdicionExercisePeriod - Guardando periodos:', currentPeriods);
    onSave(currentPeriods);
    onClose();
  };

  const toggleExerciseExpand = (exerciseId: string) => {
    setExpandedExercises(prev => {
      if (prev.includes(exerciseId)) {
        return prev.filter(id => id !== exerciseId);
      } else {
        return [...prev, exerciseId];
      }
    });
  };

  const getFieldLabel = (field: string, type: string) => {
    if (field === 'campo2' && type === 'weight') {
      if (selectedPeriodIndex === 0) {
        return 'RM*';
      }
      return 'Peso del periodo anterior';
    }
    return fieldOptions[field as keyof typeof fieldOptions]
      .find(option => option.value === type)?.label || type;
  };

  const filteredExercises = exercises.filter(exercise =>
    exercise.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    exercise.grupoMuscular.some(grupo => 
      grupo.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  if (loading) return <div className="p-4">Cargando ejercicios...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-8 w-[90%] max-w-5xl relative max-h-[90vh] overflow-y-auto shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-500 hover:text-gray-700 transition-colors duration-200"
        >
          <X size={24} />
        </button>

        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">Editar Periodos</h2>
          
          {/* Selector de periodo */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Seleccionar Periodo
            </label>
            <select
              value={selectedPeriodIndex}
              onChange={(e) => setSelectedPeriodIndex(Number(e.target.value))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            >
              {currentPeriods.map((period, index) => (
                <option key={index} value={index}>
                  {period.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-6">
            <div className="relative mb-6">
              <input
                type="text"
                placeholder="Buscar ejercicios..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              />
              <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
            </div>

            <div className="space-y-4">
              {filteredExercises.map((exercise) => {
                const isExpanded = expandedExercises.includes(exercise._id);
                const existingExercise = getCurrentExercise(exercise._id);

                return (
                  <div
                    key={exercise._id}
                    className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow duration-200"
                  >
                    <div
                      className={clsx(
                        "flex items-center justify-between p-5 cursor-pointer hover:bg-gray-50 transition-colors duration-200",
                        existingExercise && "cursor-pointer",
                        !existingExercise && "cursor-default"
                      )}
                      onClick={() => existingExercise && toggleExerciseExpand(exercise._id)}
                    >
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">{exercise.nombre}</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {exercise.grupoMuscular.join(', ')}
                        </p>
                      </div>
                      <div className="flex items-center space-x-4">
                        {existingExercise && (
                          <>
                            <span className="px-3 py-1 text-sm font-medium text-green-600 bg-green-100 rounded-full">
                              Configurado
                            </span>
                            {isExpanded ? (
                              <ChevronUp className="w-5 h-5 text-gray-500" />
                            ) : (
                              <ChevronDown className="w-5 h-5 text-gray-500" />
                            )}
                          </>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddExercise(exercise);
                          }}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                        >
                          <Edit2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    {isExpanded && existingExercise && (
                      <div className="p-5 bg-gray-50 border-t border-gray-200">
                        <h4 className="font-semibold text-gray-800 mb-3">Configuración actual:</h4>
                        <div className="space-y-3">
                          {existingExercise.sets.map((set, index) => (
                            <div key={index} className="flex flex-wrap gap-4 p-3 bg-white rounded-lg shadow-sm">
                              <span className="text-gray-700">{getFieldLabel('campo1', existingExercise.config.campo1)}: <span className="font-medium">{set.campo1}</span></span>
                              <span className="text-gray-700">{getFieldLabel('campo2', existingExercise.config.campo2)}: <span className="font-medium">{set.campo2}</span></span>
                              <span className="text-gray-700">{getFieldLabel('campo3', existingExercise.config.campo3)}: <span className="font-medium">{set.campo3}</span></span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {showSetModal && selectedExercise && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl p-8">
              <h3 className="text-2xl font-bold mb-6 text-gray-800">
                Configurar {selectedExercise.nombre}
              </h3>

              <div className="space-y-6">
                <div className="grid grid-cols-3 gap-6">
                  {Object.entries(fieldOptions).map(([field, options]) => (
                    <div key={field}>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Campo {field.slice(-1)}
                      </label>
                      <select
                        value={currentConfig[field as keyof typeof currentConfig]}
                        onChange={(e) => handleConfigChange(field, e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      >
                        {options.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>

                {currentSets.map((set, index) => (
                  <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
                    <div className="grid grid-cols-3 gap-6 flex-1">
                      {Object.entries(currentConfig).map(([field, type]) => (
                        <div key={field}>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            {getFieldLabel(field, type)}
                          </label>
                          <input
                            type="number"
                            value={set[field as keyof Set]}
                            onChange={(e) => handleSetChange(index, field, Number(e.target.value))}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                            min={field === 'campo2' && type === 'weight' ? 1 : undefined}
                            max={field === 'campo2' && type === 'weight' ? 100 : undefined}
                          />
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={() => handleRemoveSet(index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200 self-end"
                    >
                      <Minus className="w-5 h-5" />
                    </button>
                  </div>
                ))}

                <div className="flex justify-between mt-8">
                  <button
                    onClick={handleAddSet}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
                  >
                    <Plus className="w-5 h-5" />
                    <span>Agregar Set</span>
                  </button>
                  <div className="space-x-4">
                    <button
                      onClick={() => setShowSetModal(false)}
                      className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleSaveExercise}
                      className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                    >
                      Guardar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end mt-8">
          <button
            onClick={handleSavePeriods}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"          >
            Guardar Cambios
          </button>
        </div>
      </div>
    </div>
  );
}
