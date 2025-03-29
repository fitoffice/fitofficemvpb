import { useState } from 'react';
import { X, Calendar, Clock, Target, Dumbbell, ChevronRight } from 'lucide-react';
import ExpressPlansResponse from './ExpressPlansResponse';

interface ExpressPlansProps {
  isVisible: boolean;
  onClose: () => void;
}

interface FormData {
  objective: string;
  duration: string;
  equipment: string[];
  fitnessLevel: 'beginner' | 'intermediate' | 'advanced';
  limitations: string;
  weeklyPlan: {
    [key: string]: string;
  };
}

interface DailyRoutine {
  rutina: string;
}

interface Exercises {
  [key: string]: string[];
}

interface SetsAndReps {
  [key: string]: string;
}

interface IntensificationTechniques {
  [key: string]: string;
}

interface ExecutionNotes {
  [key: string]: string;
}

interface Alternatives {
  [key: string]: string;
}

interface DailyRoutines {
  dailyRoutines: {
    [key: string]: DailyRoutine;
  };
  exercises: Exercises;
  setsAndReps: SetsAndReps;
  intensificationTechniques: IntensificationTechniques;
  executionNotes: ExecutionNotes;
  alternatives: Alternatives;
}

interface PlanOverview {
  overview: string;
  trainingDistribution: {
    [key: string]: string;
  };
  successTips: string[];
  precautions: string;
  nutrition: string;
  recovery: string;
}

interface ApiResponse {
  timestamp: string;
  planOverview: PlanOverview;
  dailyRoutines: DailyRoutines;
  status: string;
  version: string;
}

interface WorkoutPlan {
  overview: {
    totalDuration: string;
    intensity: string;
  };
  workouts: Array<{
    day: string;
    exercises: Array<{
      name: string;
      sets: number;
      reps: string;
      notes: string;
    }>;
  }>;
  tips: string;
}

const ExpressPlans: React.FC<ExpressPlansProps> = ({
  isVisible,
  onClose,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState<FormData>({
    objective: '',
    duration: '1 semana',
    equipment: [],
    fitnessLevel: 'intermediate',
    limitations: '',
    weeklyPlan: {
      Lunes: '',
      Martes: '',
      Miércoles: '',
      Jueves: '',
      Viernes: '',
      Sábado: '',
      Domingo: ''
    }
  });

  const [plan, setPlan] = useState<WorkoutPlan | null>(null);
  const [apiResponse, setApiResponse] = useState<ApiResponse | null>(null);

  const equipmentOptions = [
    'Gimnasio',
    'Mancuernas',
    'Bandas elásticas',
    'Barra',
    'TRX',
    'Kettlebell',
    'Sin equipamiento'
  ];

  const fitnessLevels = [
    { value: 'beginner', label: 'Principiante' },
    { value: 'intermediate', label: 'Intermedio' },
    { value: 'advanced', label: 'Avanzado' }
  ];

  const durationOptions = [
    '1 día',
    '3 días',
    '5 días',
    '1 semana'
  ];

  const weekDays = [
    'Lunes',
    'Martes',
    'Miércoles',
    'Jueves',
    'Viernes',
    'Sábado',
    'Domingo'
  ];

  const getDaysForDuration = (duration: string) => {
    switch (duration) {
      case '1 semana':
        return ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
      case '5 días':
        return ['Día 1', 'Día 2', 'Día 3', 'Día 4', 'Día 5'];
      case '3 días':
        return ['Día 1', 'Día 2', 'Día 3'];
      default:
        return [];
    }
  };

  const handleInputChange = (field: keyof FormData, value: any) => {
    if (field === 'duration') {
      const days = getDaysForDuration(value);
      const newWeeklyPlan: { [key: string]: string } = {};
      days.forEach(day => {
        newWeeklyPlan[day] = '';
      });
      
      setForm(prev => ({
        ...prev,
        [field]: value,
        weeklyPlan: newWeeklyPlan
      }));
    } else {
      setForm(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const toggleEquipment = (equipment: string) => {
    setForm(prev => ({
      ...prev,
      equipment: prev.equipment.includes(equipment)
        ? prev.equipment.filter(e => e !== equipment)
        : [...prev.equipment, equipment]
    }));
  };

  const handleDaySelection = (day: string) => {
    setForm(prev => ({
      ...prev,
      selectedDays: prev.selectedDays.includes(day)
        ? prev.selectedDays.filter(d => d !== day)
        : [...prev.selectedDays, day]
    }));
  };

  const generatePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      console.log('Token usado en la petición:', token);
      
      if (!token) {
        throw new Error('No se encontró el token de autenticación');
      }

      const expressPlansPayload = {
        objective: {
          primary: form.objective,
          specific: [
            "Optimización del rendimiento",
            "Mejora de técnica",
            "Desarrollo de fuerza"
          ]
        },
        duration: form.duration,
        equipment: {
          available: form.equipment,
          preferences: form.equipment.map(eq => ({
            item: eq,
            priority: "Alta"
          }))
        },
        fitnessLevel: {
          overall: form.fitnessLevel,
          specifics: {
            strength: form.fitnessLevel,
            cardio: form.fitnessLevel,
            flexibility: form.fitnessLevel
          }
        },
        limitations: {
          general: form.limitations,
          adaptations: form.limitations ? ["Ejercicios adaptados según limitaciones"] : []
        },
        weeklyPlan: Object.entries(form.weeklyPlan).reduce((acc, [day, activity]) => ({
          ...acc,
          [day.toLowerCase()]: {
            focus: activity,
            timeSlot: "Flexible",
            duration: "45-60 min",
            intensity: form.fitnessLevel === 'beginner' ? 'Moderada' : 
                      form.fitnessLevel === 'intermediate' ? 'Media-Alta' : 'Alta'
          }
        }), {})
      };

      const response = await fetch('https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/chats/express-plans', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(expressPlansPayload)
      });

      if (!response.ok) {
        throw new Error('Error al generar el plan express');
      }

      const data: ApiResponse = await response.json();
      console.log('Response data:', data);

      // Mostrar todo excepto userData
      const { userData, ...restData } = data;
      console.log('Datos del plan (sin userData):', restData);

      setPlan({
        overview: {
          totalDuration: form.duration,
          intensity: "Personalizada según nivel"
        },
        workouts: Object.entries(data.dailyRoutines.dailyRoutines).map(([day, { rutina }]) => {
          const exercises = data.dailyRoutines.exercises[rutina] || [];
          return {
            day,
            exercises: exercises.map(exercise => ({
              name: exercise,
              sets: 1,
              reps: data.dailyRoutines.setsAndReps[exercise] || '',
              notes: data.dailyRoutines.executionNotes[exercise] || ''
            }))
          };
        }),
        tips: data.planOverview.successTips.join('. ')
      });

      setApiResponse(restData);
    } catch (error) {
      console.error('Error generando el plan:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      console.log('Datos del formulario:', form);
    } catch (error) {
      console.error('Error al enviar el formulario:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fillWithExampleData = () => {
    const exampleData: FormData = {
      objective: 'Ganar masa muscular y mejorar la fuerza general',
      duration: '1 semana',
      equipment: ['Gimnasio', 'Mancuernas', 'Bandas elásticas'],
      fitnessLevel: 'intermediate',
      limitations: 'Ninguna lesión o limitación específica',
      weeklyPlan: {
        Lunes: 'Entrenamiento de pecho y tríceps',
        Martes: 'Entrenamiento de espalda y bíceps',
        Miércoles: 'Descanso activo - cardio ligero',
        Jueves: 'Entrenamiento de hombros y abdominales',
        Viernes: 'Entrenamiento de piernas',
        Sábado: 'Entrenamiento funcional completo',
        Domingo: 'Descanso completo'
      }
    };

    setForm(exampleData);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {!apiResponse ? (
          <>
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Plan de Entrenamiento Express
                </h2>
                <button
                  onClick={fillWithExampleData}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
                >
                  Rellenar Ejemplo
                </button>
              </div>
            </div>

            <div className="p-6">
              <form onSubmit={generatePlan} className="space-y-6">
                {/* Objetivo */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Objetivo principal
                  </label>
                  <input
                    type="text"
                    value={form.objective}
                    onChange={(e) => handleInputChange('objective', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    placeholder="Ej: Pérdida de peso, ganancia muscular..."
                    required
                  />
                </div>

                {/* Duración */}
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Duración del Plan
                    <Clock className="inline-block ml-2 w-4 h-4" />
                  </label>
                  <div className="flex gap-3 flex-wrap">
                    {durationOptions.map(option => (
                      <button
                        key={option}
                        onClick={() => handleInputChange('duration', option)}
                        className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                          form.duration === option
                            ? 'bg-blue-500 text-white shadow-lg scale-105'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Plan de entrenamiento según duración */}
                {form.duration !== '1 día' ? (
                  <div className="mb-6 overflow-x-auto">
                    <label className="block text-sm font-medium mb-2 text-gray-700">
                      Plan de Entrenamiento
                      <Calendar className="inline-block ml-2 w-4 h-4" />
                    </label>
                    <div className="min-w-full">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr>
                            {Object.keys(form.weeklyPlan).map((day) => (
                              <th 
                                key={day}
                                className="p-2 text-sm font-semibold text-gray-700 border border-gray-200 bg-gray-50"
                              >
                                {day}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            {Object.keys(form.weeklyPlan).map((day) => (
                              <td key={day} className="border border-gray-200 p-1">
                                <textarea
                                  value={form.weeklyPlan[day]}
                                  onChange={(e) => {
                                    const newWeeklyPlan = {
                                      ...form.weeklyPlan,
                                      [day]: e.target.value
                                    };
                                    setForm(prev => ({
                                      ...prev,
                                      weeklyPlan: newWeeklyPlan
                                    }));
                                  }}
                                  placeholder="Ejercicios del día..."
                                  className="w-full p-2 text-sm border-0 bg-transparent resize-none focus:ring-1 focus:ring-blue-500 outline-none"
                                  rows={4}
                                />
                              </td>
                            ))}
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div className="mb-6">
                    <label className="block text-sm font-medium mb-2 text-gray-700">
                      Plan de Entrenamiento
                      <Calendar className="inline-block ml-2 w-4 h-4" />
                    </label>
                    <textarea
                      value={form.weeklyPlan['Día 1'] || ''}
                      onChange={(e) => {
                        setForm(prev => ({
                          ...prev,
                          weeklyPlan: { 'Día 1': e.target.value }
                        }));
                      }}
                      placeholder="Detalla aquí los ejercicios del día..."
                      className="w-full p-3 border border-gray-200 rounded-lg resize-vertical focus:ring-1 focus:ring-blue-500 outline-none min-h-[150px]"
                    />
                  </div>
                )}

                {/* Equipamiento */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Equipamiento disponible
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {equipmentOptions.map(equipment => (
                      <button
                        key={equipment}
                        type="button"
                        onClick={() => toggleEquipment(equipment)}
                        className={`p-2 rounded-lg text-sm transition-colors ${
                          form.equipment.includes(equipment)
                            ? 'bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300'
                            : 'bg-gray-50 text-gray-700 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                        }`}
                      >
                        {equipment}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Nivel de condición física */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Nivel de fitness
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {fitnessLevels.map(level => (
                      <button
                        key={level.value}
                        type="button"
                        onClick={() => handleInputChange('fitnessLevel', level.value)}
                        className={`p-2 rounded-lg text-sm transition-colors ${
                          form.fitnessLevel === level.value
                            ? 'bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300'
                            : 'bg-gray-50 text-gray-700 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                        }`}
                      >
                        {level.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Limitaciones */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Limitaciones o lesiones
                  </label>
                  <textarea
                    value={form.limitations}
                    onChange={(e) => handleInputChange('limitations', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    rows={2}
                    placeholder="¿Tienes alguna lesión o limitación que debamos considerar?"
                  />
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 dark:text-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 disabled:opacity-50"
                  >
                    {isLoading ? 'Generando...' : 'Generar Plan'}
                    {!isLoading && <ChevronRight size={20} />}
                  </button>
                </div>
              </form>
            </div>
          </>
        ) : (
          <ExpressPlansResponse apiResponse={apiResponse} onClose={onClose} />
        )}
      </div>
    </div>
  );
};

export default ExpressPlans;
