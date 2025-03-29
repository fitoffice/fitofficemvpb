import { useState } from 'react';
import { X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import MicroHabitsBuilderResponse from './MicroHabitsBuilderResponse';

interface MicroHabitsBuilderProps {
  isVisible: boolean;
  onClose: () => void;
}

interface FormData {
  studentName: string;
  currentLevel: string;
  habitName: string;
  category: string;
  frequency: string;
  duration: string;
  trigger: string;
  reminders: string[];
  potentialObstacles: string[];
  adaptations: string[];
  progressMetrics: string[];
  supportStrategy: string;
}

interface HabitData {
  name: string;
  level: string;
  currentHabits: string[];
  consistency: string;
  challenges: string[];
  habitName: string;
  category: string;
  frequency: string;
  preferredTime: string;
  reminder: string;
  context: string;
  location: string;
  obstacles: string[];
  strategy: string;
  duration: string;
}

const MicroHabitsBuilder: React.FC<MicroHabitsBuilderProps> = ({
  isVisible,
  onClose,
}) => {
  const [showForm, setShowForm] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [plan, setPlan] = useState<any>(null);

  const [form, setForm] = useState<FormData>({
    studentName: '',
    currentLevel: '',
    habitName: '',
    category: '',
    frequency: '',
    duration: '',
    trigger: '',
    reminders: [],
    potentialObstacles: [],
    adaptations: [],
    progressMetrics: [],
    supportStrategy: ''
  });

  const levelOptions = [
    'Principiante',
    'Intermedio',
    'Avanzado',
    'Elite'
  ];

  const categoryOptions = [
    'Nutrición y Alimentación',
    'Entrenamiento y Ejercicio',
    'Recuperación y Descanso',
    'Hidratación',
    'Movilidad y Postura',
    'Mentalidad y Meditación'
  ];

  const frequencyOptions = [
    'Diario',
    '3-4 veces/semana',
    'Días específicos',
    'Post-entrenamiento'
  ];

  const durationOptions = [
    '1-2 minutos (micro-inicio)',
    '5 minutos (establecimiento)',
    '10 minutos (desarrollo)',
    '15+ minutos (avanzado)'
  ];

  const reminderOptions = [
    'Mensaje de WhatsApp',
    'Recordatorio en app de entrenamiento',
    'Check-in diario',
    'Seguimiento en grupo',
    'Antes/después del entrenamiento',
    'Vinculado a rutina existente'
  ];

  const progressMetricOptions = [
    'Check diario en app',
    'Foto/video de ejecución',
    'Registro en diario de hábitos',
    'Evaluación semanal',
    'Mediciones específicas',
    'Feedback cualitativo'
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
        [field]: (prev[field] as string[]).includes(value)
          ? (prev[field] as string[]).filter(item => item !== value)
          : [...(prev[field] as string[]), value]
      }));
    }
  };

  const formatHabitPlan = (data: any) => {
    const { habitPlan } = data;
    const studentProfile = habitPlan.studentProfile || {};
    const habitAnalysis = habitPlan.habitAnalysis || {};
    const implementationPlan = habitPlan.implementationPlan || {};
    const adaptationStrategies = habitPlan.adaptationStrategies || {};
    const successMetrics = habitPlan.successMetrics || {};
    const trackingSystem = habitPlan.trackingSystem || {};
    const coachGuide = habitPlan.coachGuide || {};
    const contingencyPlan = habitPlan.contingencyPlan || {};

    return `
# 🎯 Plan de Micro-Hábito: ${habitAnalysis.habitName || 'No especificado'}

## 👤 Perfil del Alumno
- **Nombre:** ${studentProfile.name || 'No especificado'}
- **Nivel actual:** ${studentProfile.level || 'No especificado'}

## 📋 Detalles del Hábito
- **Hábito:** ${habitAnalysis.habitName || 'No especificado'}
- **Categoría:** ${habitAnalysis.category || 'No especificado'}
- **Frecuencia:** ${habitAnalysis.frequency || 'No especificado'}
- **Duración inicial:** ${habitAnalysis.initialDuration || 'No especificado'}
- **Disparador:** ${habitAnalysis.trigger || 'No especificado'}

## 🔔 Recordatorios y Seguimiento
${(habitAnalysis.reminderMethods || []).map(method => `- ${method}`).join('\n')}

## ⚡ Plan de Implementación
${(implementationPlan.phases || []).map(phase => `
### Fase ${phase.phase}: ${phase.description}
**Duración:** ${phase.duration}
${(phase.actions || []).map(action => `- ${action}`).join('\n')}`).join('\n')}

## 🚧 Obstáculos Potenciales
${(habitAnalysis.potentialObstacles || []).map(obstacle => `- ${obstacle}`).join('\n')}

## 🔄 Plan de Contingencia
${contingencyPlan.plan || 'No especificado'}

## 💪 Estrategias de Adaptación
${(adaptationStrategies.strategies || []).map(strategy => `- ${strategy}`).join('\n')}

## 📊 Métricas de Éxito
${(successMetrics.metrics || []).map(metric => `- ${metric}`).join('\n')}

## 📈 Sistema de Seguimiento
- **Aplicación de progreso:** ${trackingSystem.progressApp || 'No especificado'}
- **Estrategia de soporte:** ${trackingSystem.supportStrategy || 'No especificado'}

## 👨‍🏫 Guía para el Coach
${coachGuide.guide || 'No especificado'}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      console.log('🚀 Enviando petición con datos:', {
        method: 'POST',
        endpoint: 'https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/chats/micro-habits',
        payload: form
      });

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No se encontró el token de autenticación');
      }

      const response = await fetch('https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/chats/micro-habits', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        console.error('❌ Error en la respuesta:', {
          status: response.status,
          statusText: response.statusText
        });
        throw new Error(`Error en la API: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Respuesta exitosa:', {
        status: response.status,
        data: data
      });

      setPlan(data);
      setIsLoading(false);
      setShowForm(false);
    } catch (error) {
      console.error('❌ Error en la petición:', {
        error: error,
        message: (error as Error).message,
        stack: (error as Error).stack
      });
      setIsLoading(false);
      alert('Error al generar el plan: ' + (error as Error).message);
    }
  };

  const handleTestRequest = async () => {
    setIsLoading(true);
    try {
      const testPayload = {
        studentName: "Usuario de Prueba",
        currentLevel: "Intermedio",
        habitName: "Estiramientos matutinos",
        category: "Movilidad y Postura",
        frequency: "Diario",
        duration: "5 minutos (establecimiento)",
        trigger: "Al despertar",
        reminders: ["Mensaje de WhatsApp"],
        potentialObstacles: ["Falta de tiempo"],
        adaptations: ["Reducir duración inicial"],
        progressMetrics: ["Check diario en app"],
        supportStrategy: "Seguimiento semanal"
      };

      console.log('🧪 Enviando petición de prueba:', {
        method: 'POST',
        endpoint: 'https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/chats/micro-habits',
        payload: testPayload
      });

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No se encontró el token de autenticación');
      }

      const response = await fetch('https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/chats/micro-habits', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(testPayload),
      });

      if (!response.ok) {
        console.error('❌ Error en la respuesta de prueba:', {
          status: response.status,
          statusText: response.statusText
        });
        throw new Error(`Error en la API: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Respuesta de prueba exitosa:', {
        status: response.status,
        data: data
      });

      setPlan(data);
      setIsLoading(false);
      setShowForm(false);
    } catch (error) {
      console.error('❌ Error en la petición de prueba:', {
        error: error,
        message: (error as Error).message,
        stack: (error as Error).stack
      });
      setIsLoading(false);
      alert('Error en la prueba: ' + (error as Error).message);
    }
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4 z-50"
        >
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                  <span className="text-blue-600">🧠</span>
                  Constructor de Micro-Hábitos
                </h2>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleTestRequest}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 flex items-center gap-2"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Procesando...</span>
                      </>
                    ) : (
                      <>
                        <span>Probar API</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={onClose}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X size={24} />
                  </button>
                </div>
              </div>

              {showForm ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Información del Alumno */}
                  <div className="bg-blue-50 dark:bg-gray-700 p-4 rounded-lg space-y-4">
                    <div className="flex items-center space-x-2 text-blue-700 dark:text-blue-300">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.414l7 3a1 1 0 .788-.414V8.844a1 1 0 1 0-1.788 0l-7 3a1 1 0 000 1.414l7 3A1 1 0 0010 17.938V5a1 1 0 00.293-.707z" />
                      </svg>
                      <h3 className="font-medium">Información del Alumno</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Nombre del alumno
                        </label>
                        <input
                          type="text"
                          value={form.studentName}
                          onChange={(e) => handleInputChange('studentName', e.target.value)}
                          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600"
                          placeholder="Nombre completo"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Nivel actual
                        </label>
                        <select
                          value={form.currentLevel}
                          onChange={(e) => handleInputChange('currentLevel', e.target.value)}
                          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600"
                        >
                          <option value="">Seleccionar nivel</option>
                          {levelOptions.map(option => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Detalles del Hábito */}
                  <div className="bg-blue-50 dark:bg-gray-700 p-4 rounded-lg space-y-4">
                    <div className="flex items-center space-x-2 text-blue-700 dark:text-blue-300">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.414l7 3a1 1 0 .788-.414V8.844a1 1 0 1 0-1.788 0l-7 3a1 1 0 000 1.414l7 3A1 1 0 0010 17.938V5a1 1 0 00.293-.707z" />
                      </svg>
                      <h3 className="font-medium">Detalles del Hábito</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Nombre del hábito
                        </label>
                        <input
                          type="text"
                          value={form.habitName}
                          onChange={(e) => handleInputChange('habitName', e.target.value)}
                          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600"
                          placeholder="Ej: Estiramientos post-entrenamiento"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Categoría
                        </label>
                        <select
                          value={form.category}
                          onChange={(e) => handleInputChange('category', e.target.value)}
                          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600"
                        >
                          <option value="">Seleccionar categoría</option>
                          {categoryOptions.map(option => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Frecuencia
                        </label>
                        <select
                          value={form.frequency}
                          onChange={(e) => handleInputChange('frequency', e.target.value)}
                          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600"
                        >
                          <option value="">Seleccionar frecuencia</option>
                          {frequencyOptions.map(option => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Duración inicial
                        </label>
                        <select
                          value={form.duration}
                          onChange={(e) => handleInputChange('duration', e.target.value)}
                          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600"
                        >
                          <option value="">Seleccionar duración</option>
                          {durationOptions.map(option => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Sistema de Seguimiento */}
                  <div className="bg-blue-50 dark:bg-gray-700 p-4 rounded-lg space-y-4">
                    <div className="flex items-center space-x-2 text-blue-700 dark:text-blue-300">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M15 8a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path d="M8 10a2 2 0 002 2v5a2 2 0 00-2 2H6a2 2 0 00-2-2v-5a2 2 0 002-2h2Z" />
                      </svg>
                      <h3 className="font-medium">Sistema de Seguimiento</h3>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Desencadenante
                      </label>
                      <input
                        type="text"
                        value={form.trigger}
                        onChange={(e) => handleInputChange('trigger', e.target.value)}
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600"
                        placeholder="Ej: Después de terminar el entrenamiento"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Métodos de recordatorio
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {reminderOptions.map(option => (
                          <label key={option} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={form.reminders.includes(option)}
                              onChange={() => handleArrayToggle('reminders', option)}
                              className="rounded text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-700 dark:text-gray-300">{option}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Métricas de progreso
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {progressMetricOptions.map(option => (
                          <label key={option} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={form.progressMetrics.includes(option)}
                              onChange={() => handleArrayToggle('progressMetrics', option)}
                              className="rounded text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-700 dark:text-gray-300">{option}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Estrategia de Apoyo */}
                  <div className="bg-blue-50 dark:bg-gray-700 p-4 rounded-lg space-y-4">
                    <div className="flex items-center space-x-2 text-blue-700 dark:text-blue-300">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M15 8a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path d="M8 10a2 2 0 002 2v5a2 2 0 00-2 2H6a2 2 0 00-2-2v-5a2 2 0 002-2h2Z" />
                      </svg>
                      <h3 className="font-medium">Estrategia de Apoyo</h3>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        ¿Cómo apoyarás al alumno?
                      </label>
                      <textarea
                        value={form.supportStrategy}
                        onChange={(e) => handleInputChange('supportStrategy', e.target.value)}
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600"
                        rows={3}
                        placeholder="Describe tu estrategia de apoyo y seguimiento"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end space-x-4">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                    >
                      <Check className="w-5 h-5" />
                      <span>Generar Plan</span>
                    </button>
                  </div>
                </form>
              ) : (
                <div className="mt-6">
                  <MicroHabitsBuilderResponse data={plan} />
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MicroHabitsBuilder;
