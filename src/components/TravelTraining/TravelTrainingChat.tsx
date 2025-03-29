import { useState } from 'react';
import { X, Globe, AlertCircle, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import TravelTrainingResponse from './TravelTrainingResponse';

interface TravelTrainingProps {
  isVisible: boolean;
  onClose: () => void;
}

interface FormData {
  destination: string;
  duration: string;
  equipment: string[];
  goals: string[];
  limitations: string[];
  preferences: string[];
  timeZone: string;
  notes: string;
}

const TravelTraining: React.FC<TravelTrainingProps> = ({
  isVisible,
  onClose,
}) => {
  const [form, setForm] = useState<FormData>({
    destination: '',
    duration: '',
    equipment: [],
    goals: [],
    limitations: [],
    preferences: [],
    timeZone: '',
    notes: ''
  });

  const [showPlan, setShowPlan] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [workoutPlan, setWorkoutPlan] = useState<any>({
    destination: '',
    duration: 0,
    startDate: '',
    workoutRoutines: [],
    bodyweightAlternatives: [],
    dailySchedule: [],
    nutritionTips: [],
    consistencyStrategies: [],
    contingencyPlan: []
  });

  const durationOptions = [
    'Menos de 1 semana',
    '1-2 semanas',
    '2-4 semanas',
    'Más de 1 mes'
  ];

  const equipmentOptions = [
    'Sin equipo',
    'Bandas elásticas',
    'TRX/Suspensión',
    'Esterilla',
    'Pesas ajustables',
    'Equipaje básico'
  ];

  const goalOptions = [
    'Mantener rutina',
    'Pérdida de peso',
    'Tonificación',
    'Movilidad',
    'Cardio',
    'Fuerza'
  ];

  const handleInputChange = (field: keyof FormData, value: any) => {
    setForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayToggle = (field: keyof FormData, value: string) => {
    if (Array.isArray(form[field])) {
      setForm(prev => ({
        ...prev,
        [field]: prev[field].includes(value)
          ? (prev[field] as string[]).filter(item => item !== value)
          : [...(prev[field] as string[]), value]
      }));
    }
  };

  const generateApiPayload = () => {
    const payload = {
      destination: {
        city: form.destination,
        country: 'No especificado',
        type: 'Urbano',
        climate: {
          season: 'No especificado',
          temperature: 'No especificado',
          conditions: 'No especificado'
        },
        accommodation: {
          type: 'Hotel',
          facilities: []
        }
      },
      duration: {
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        totalDays: 7,
        timezone: form.timeZone || 'UTC+1'
      },
      equipment: {
        available: form.equipment.map(eq => ({
          type: eq,
          portable: true
        })),
        hotelGym: [],
        outdoor: []
      },
      goals: {
        primary: form.goals[0] || 'Mantener rutina de entrenamiento',
        specific: form.goals.map(goal => ({
          type: goal,
          target: 'Mantener niveles actuales'
        })),
        expectations: {
          frequency: '3-4 días/semana',
          duration: '30-45 min/sesión'
        }
      },
      limitations: {
        time: {
          availableSlots: ['Mañana', 'Tarde'],
          constraints: form.limitations.join(', ') || 'Sin limitaciones específicas'
        },
        physical: [],
        environmental: []
      },
      preferences: {
        workoutStyle: form.preferences,
        timing: {
          preferred: 'Flexible',
          alternative: 'Flexible'
        },
        intensity: {
          cardio: 'Moderada',
          strength: 'Moderada'
        },
        focus: ['Full body']
      },
      timeZone: {
        origin: 'UTC+1',
        destination: form.timeZone || 'UTC+1',
        difference: 0,
        jetlagConsiderations: {
          direction: 'Ninguna',
          recoveryDays: 0
        }
      },
      notes: [{
        category: 'General',
        detail: form.notes || 'Sin notas adicionales'
      }]
    };

    console.log('🚀 Datos del formulario:', form);
    console.log('📦 Payload generado:', payload);
    
    return payload;
  };

  const generateWorkoutPlan = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('❌ Error: Token no encontrado');
        throw new Error('No se encontró el token de autenticación');
      }

      console.log('🔑 Token encontrado:', token.substring(0, 20) + '...');
      
      const payload = generateApiPayload();
      console.log('📤 Enviando solicitud a la API...');

      const response = await fetch('https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/chats/travel-workout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        console.error('❌ Error en la respuesta:', response.status, response.statusText);
        throw new Error('Error al generar el plan de entrenamiento');
      }

      const data = await response.json();
      console.log('📥 Respuesta de la API:', data);
      
      return formatWorkoutPlan(data);
    } catch (error) {
      console.error('❌ Error en generateWorkoutPlan:', error);
      return generateDefaultPlan();
    }
  };

  const generateDefaultPlan = () => {
    let plan = '';
    
    if (form.equipment.includes('Sin equipo')) {
      plan += `
Circuito corporal:
- Burpees: 10 reps
- Sentadillas: 15 reps
- Flexiones: 12 reps
- Mountain climbers: 30 segs
- Plancha: 45 segs
3-4 rondas`;
    }
    
    if (form.equipment.includes('Bandas elásticas')) {
      plan += `
Ejercicios con banda:
- Rows: 15 reps
- Press de hombro: 12 reps
- Extensiones de tríceps: 15 reps
- Curl de bíceps: 12 reps
2-3 rondas`;
    }
    
    return { plan };
  };

  const formatWorkoutPlan = (data: any) => {
    try {
      console.log('🎯 Formateando datos recibidos:', data);
      
      const plan = data.workoutPlan || {};
      
      // Asegurarse de que los datos son strings
      const formatValue = (value: any): string => {
        if (typeof value === 'string') return value;
        if (typeof value === 'object' && value !== null) {
          return JSON.stringify(value);
        }
        return String(value || '');
      };
      
      return {
        dailySchedule: Object.fromEntries(
          Object.entries(plan.dailySchedule || {}).map(([key, value]) => [key, formatValue(value)])
        ),
        workoutRoutines: Object.fromEntries(
          Object.entries(plan.workoutRoutines || {}).map(([key, value]) => [key, formatValue(value)])
        ),
        bodyweightAlternatives: Object.fromEntries(
          Object.entries(plan.bodyweightAlternatives || {}).map(([key, value]) => [key, formatValue(value)])
        ),
        consistencyStrategies: formatValue(plan.consistencyStrategies),
        contingencyPlan: formatValue(plan.contingencyPlan),
        nutritionTips: formatValue(plan.nutritionTips)
      };
    } catch (error) {
      console.error('❌ Error formateando el plan:', error);
      return {
        dailySchedule: {},
        workoutRoutines: {},
        bodyweightAlternatives: {},
        consistencyStrategies: '',
        contingencyPlan: '',
        nutritionTips: ''
      };
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const plan = await generateWorkoutPlan();
      setWorkoutPlan(plan);
      setShowPlan(true);
    } catch (error) {
      console.error('Error:', error);
      setWorkoutPlan(generateDefaultPlan());
      setShowPlan(true);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 z-50"
      >
        <motion.div
          initial={{ scale: 0.95, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.95, y: 20 }}
          transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
          className="bg-white dark:bg-gray-800/95 rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative border border-gray-100 dark:border-gray-700"
        >
          <div className="sticky top-0 z-20 bg-white/80 dark:bg-gray-800/90 backdrop-blur-sm p-6 border-b border-gray-100 dark:border-gray-700">
            <div className="flex justify-between items-center">
              <motion.h2 
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="text-2xl font-bold bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 bg-clip-text text-transparent flex items-center gap-3"
              >
                <Globe className="w-7 h-7 text-amber-500" />
                Plan de Entrenamiento para Viajes
              </motion.h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-all duration-300 hover:rotate-90"
              >
                <X className="w-5 h-5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200" />
              </button>
            </div>
          </div>

          <div className="p-6">
            {!showPlan ? (
              <motion.form 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                onSubmit={handleSubmit} 
                className="space-y-6"
              >
                {/* Destino */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-amber-500" />
                    Destino
                  </label>
                  <div className="relative group">
                    <input
                      type="text"
                      value={form.destination}
                      onChange={(e) => handleInputChange('destination', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-300 group-hover:border-amber-500"
                      placeholder="¿A dónde viajas?"
                      required
                    />
                  </div>
                </div>

                {/* Duración */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <Globe className="w-4 h-4 text-amber-500" />
                    Duración del Viaje
                  </label>
                  <select
                    value={form.duration}
                    onChange={(e) => handleInputChange('duration', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-300 hover:border-amber-500 cursor-pointer"
                    required
                  >
                    <option value="">Selecciona la duración</option>
                    {durationOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Equipamiento */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2 mb-2">
                    Equipamiento Disponible
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {equipmentOptions.map((option) => (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="button"
                        key={option}
                        onClick={() => handleArrayToggle('equipment', option)}
                        className={`px-4 py-2.5 rounded-xl border ${
                          form.equipment.includes(option)
                            ? 'bg-amber-500 border-amber-600 text-white'
                            : 'border-gray-200 dark:border-gray-600 hover:border-amber-500 dark:hover:border-amber-500'
                        } transition-all duration-200`}
                      >
                        {option}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Objetivos */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2 mb-2">
                    Objetivos de Entrenamiento
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {goalOptions.map((option) => (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="button"
                        key={option}
                        onClick={() => handleArrayToggle('goals', option)}
                        className={`px-4 py-2.5 rounded-xl border ${
                          form.goals.includes(option)
                            ? 'bg-amber-500 border-amber-600 text-white'
                            : 'border-gray-200 dark:border-gray-600 hover:border-amber-500 dark:hover:border-amber-500'
                        } transition-all duration-200`}
                      >
                        {option}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Botón de envío */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-6 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-medium shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Generando plan...
                    </div>
                  ) : (
                    'Generar Plan de Entrenamiento'
                  )}
                </motion.button>
              </motion.form>
            ) : (
              <TravelTrainingResponse 
                workoutPlan={workoutPlan}
                onBack={() => setShowPlan(false)}
              />
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default TravelTraining;
