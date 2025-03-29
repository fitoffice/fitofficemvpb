import { useState } from 'react';
import { X, Heart, Coffee, Sun, Moon, Utensils, Brain, Battery, ChevronRight } from 'lucide-react';
import LifestyleResponse from './LifestyleResponse';

interface LifestyleGuideProps {
  isVisible: boolean;
  onClose: () => void;
}

interface FormData {
  dailyRoutine: string;
  sleepSchedule: string;
  stressLevel: number;
  dietaryPreferences: string[];
  goals: string;
  challenges: string;
}

interface LifestyleRecommendations {
  morningRoutine: string[];
  eveningRoutine: string[];
  nutritionPlan: {
    meals: Array<{
      time: string;
      suggestions: string[];
      tips: string;
    }>;
  };
  sleepOptimization: string[];
  stressManagement: string[];
  habits: {
    toAdd: string[];
    toReduce: string[];
  };
}

const LifestyleGuide: React.FC<LifestyleGuideProps> = ({
  isVisible,
  onClose,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState<FormData>({
    dailyRoutine: '',
    sleepSchedule: '',
    stressLevel: 5,
    dietaryPreferences: [],
    goals: '',
    challenges: ''
  });

  const [recommendations, setRecommendations] = useState<LifestyleRecommendations | null>(null);

  const dietaryOptions = [
    'Vegetariano',
    'Vegano',
    'Sin gluten',
    'Sin lácteos',
    'Mediterránea',
    'Paleo',
    'Flexible'
  ];

  const handleInputChange = (field: keyof FormData, value: any) => {
    setForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const toggleDietaryPreference = (preference: string) => {
    setForm(prev => ({
      ...prev,
      dietaryPreferences: prev.dietaryPreferences.includes(preference)
        ? prev.dietaryPreferences.filter(p => p !== preference)
        : [...prev.dietaryPreferences, preference]
    }));
  };

  const handleAutoFill = () => {
    setForm({
      dailyRoutine: 'Trabajo de 9:00 a 18:00, entrenamiento por las tardes de 19:00 a 20:30, tiempo libre limitado',
      sleepSchedule: '23:30 - 7:30',
      stressLevel: 7,
      dietaryPreferences: ['Mediterránea', 'Flexible'],
      goals: 'Mejorar calidad del sueño, reducir estrés, optimizar rutina diaria',
      challenges: 'Dificultad para mantener horarios consistentes, insomnio ocasional por estrés'
    });
  };

  const generateRecommendations = async () => {
    setIsLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      console.log('Token retrieved from localStorage:', token ? 'Token exists' : 'No token found');

      if (!token) {
        throw new Error('No se encontró el token de autenticación');
      }

      const lifestyleAdvicePayload = {
        dailyRoutine: form.dailyRoutine,
        sleepSchedule: {
          weekdays: {
            bedtime: form.sleepSchedule.split('-')[0].trim(),
            wakeup: form.sleepSchedule.split('-')[1].trim()
          }
        },
        stressLevel: {
          rating: form.stressLevel
        },
        dietaryPreferences: {
          diet: form.dietaryPreferences.length > 0 ? form.dietaryPreferences[0] : "",
          restrictions: form.dietaryPreferences.slice(1)
        },
        goals: form.goals,
        challenges: form.challenges
      };

      console.log('Sending lifestyle advice payload:', lifestyleAdvicePayload);

      const response = await fetch('https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/chats/lifestyle-advice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(lifestyleAdvicePayload)
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        throw new Error('Error al generar las recomendaciones de estilo de vida');
      }

      const data = await response.json();
      console.log('Response data:', data);

      if (data.status === 'completed' && data.lifestyleAdvice) {
        setRecommendations(data);
      } else {
        throw new Error('Respuesta incompleta del servidor');
      }
    } catch (error) {
      console.error('Error:', error);
      // Mostrar mensaje de error al usuario
      alert('Error al generar las recomendaciones. Por favor, inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await generateRecommendations();
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto transform transition-all duration-300 ease-in-out">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800 z-10">
          <div className="flex justify-between items-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <Heart className="w-7 h-7 text-pink-500 animate-pulse" />
              Guía de Estilo de Vida
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors duration-200"
            >
              <X className="w-6 h-6 text-gray-500 dark:text-gray-400" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {isLoading ? (
            <div className="flex justify-center items-center p-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : recommendations ? (
            <LifestyleResponse recommendations={recommendations} />
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex justify-end mb-4">
                <button
                  type="button"
                  onClick={handleAutoFill}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors duration-200 flex items-center gap-2"
                >
                  <ChevronRight className="w-4 h-4" />
                  Auto-rellenar
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Rutina Diaria
                  </label>
                  <textarea
                    value={form.dailyRoutine}
                    onChange={(e) => handleInputChange('dailyRoutine', e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
                    rows={4}
                    placeholder="Describe tu rutina diaria actual..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Horario de Sueño
                  </label>
                  <input
                    type="text"
                    value={form.sleepSchedule}
                    onChange={(e) => handleInputChange('sleepSchedule', e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
                    placeholder="Ej: 23:00 - 07:00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Nivel de Estrés
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={form.stressLevel}
                      onChange={(e) => handleInputChange('stressLevel', parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-pink-500"
                    />
                    <span className="text-sm text-gray-600 dark:text-gray-400 min-w-[2rem] text-center">
                      {form.stressLevel}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Preferencias Dietéticas
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {dietaryOptions.map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => toggleDietaryPreference(option)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                          form.dietaryPreferences.includes(option)
                            ? 'bg-pink-500 text-white'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Objetivos
                    </label>
                    <textarea
                      value={form.goals}
                      onChange={(e) => handleInputChange('goals', e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
                      rows={3}
                      placeholder="¿Qué objetivos te gustaría alcanzar?"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Desafíos
                    </label>
                    <textarea
                      value={form.challenges}
                      onChange={(e) => handleInputChange('challenges', e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
                      rows={3}
                      placeholder="¿Qué obstáculos encuentras actualmente?"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-6 bg-pink-500 hover:bg-pink-600 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Generando recomendaciones...
                  </>
                ) : (
                  'Generar Recomendaciones'
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default LifestyleGuide;
