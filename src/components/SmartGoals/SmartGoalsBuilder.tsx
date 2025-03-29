import { useState } from 'react';
import { X, Check, Target, AlertCircle } from 'lucide-react';
import SmartGoalBuilderResponse from './SmartGoalBuilderResponse';

interface SmartGoalsBuilderProps {
  isVisible: boolean;
  onClose: () => void;
}

interface FormData {
  goalDescription: string;
  timeframe: string;
  measurementMethod: string;
  currentValue: string;
  targetValue: string;
  relevance: string;
  obstacles: string[];
  resources: string[];
}

const SmartGoalsBuilder: React.FC<SmartGoalsBuilderProps> = ({
  isVisible,
  onClose,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(true);
  const [smartGoal, setSmartGoal] = useState('');
  const [smartGoalPlan, setSmartGoalPlan] = useState<any>(null);

  const [form, setForm] = useState<FormData>({
    goalDescription: '',
    timeframe: '',
    measurementMethod: '',
    currentValue: '',
    targetValue: '',
    relevance: '',
    obstacles: [],
    resources: [],
  });

  const timeframeOptions = [
    '1 mes',
    '3 meses',
    '6 meses',
    '1 año'
  ];

  const obstacleOptions = [
    'Tiempo limitado',
    'Recursos económicos',
    'Conocimientos técnicos',
    'Apoyo social',
    'Motivación inconsistente',
    'Compromisos existentes'
  ];

  const resourceOptions = [
    'Entrenador personal',
    'Material educativo',
    'Equipamiento',
    'Grupo de apoyo',
    'Apps/Software',
    'Mentor'
  ];

  const handleInputChange = (field: keyof FormData, value: any) => {
    setForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayToggle = (field: 'obstacles' | 'resources', value: string) => {
    setForm(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      console.log('Token retrieved from localStorage:', token ? 'Token exists' : 'No token found');

      if (!token) {
        throw new Error('No se encontró el token de autenticación');
      }

      const today = new Date();
      const endDate = new Date(today);
      endDate.setDate(endDate.getDate() + 90); // 12 semanas

      const checkpoint1 = new Date(today);
      checkpoint1.setDate(checkpoint1.getDate() + 28); // 4 semanas

      const checkpoint2 = new Date(today);
      checkpoint2.setDate(checkpoint2.getDate() + 56); // 8 semanas

      const smartGoalsPayload = {
        goalDescription: form.goalDescription || "Aumentar fuerza en press de banca",
        timeframe: {
          startDate: today.toISOString().split('T')[0],
          endDate: endDate.toISOString().split('T')[0],
          duration: "12 semanas",
          checkpoints: [
            {
              week: 4,
              date: checkpoint1.toISOString().split('T')[0],
              expectedProgress: "33%"
            },
            {
              week: 8,
              date: checkpoint2.toISOString().split('T')[0],
              expectedProgress: "66%"
            },
            {
              week: 12,
              date: endDate.toISOString().split('T')[0],
              expectedProgress: "100%"
            }
          ]
        },
        measurementMethod: {
          primary: form.measurementMethod || "1RM en press de banca",
          secondary: [
            "RPE en series de trabajo",
            "Volumen total semanal",
            "Calidad técnica (1-10)"
          ],
          frequency: "Evaluación cada 2 semanas",
          tools: [
            "Planilla de registro",
            "App de tracking",
            "Vídeo para técnica"
          ]
        },
        currentValue: {
          oneRepMax: form.currentValue || "80 kg",
          workingSets: "65 kg x 5 reps",
          weeklyVolume: "5000 kg",
          technicalProficiency: 7
        },
        targetValue: {
          oneRepMax: form.targetValue || "100 kg",
          workingSets: "80 kg x 5 reps",
          weeklyVolume: "6000 kg",
          technicalProficiency: 9
        },
        relevance: {
          personalImportance: "Alta",
          motivation: form.relevance || "Competición powerlifting en 6 meses",
          impact: [
            "Mejora en rendimiento general",
            "Aumento de confianza",
            "Preparación para competición"
          ],
          alignment: "Alineado con objetivo de competición"
        },
        obstacles: form.obstacles.map(obstacle => ({
          type: "Técnico",
          description: obstacle,
          solution: "Trabajo específico y seguimiento personalizado"
        })) || [
          {
            type: "Técnico",
            description: "Punto débil en la fase de lockout",
            solution: "Trabajo específico con bandas y blocks"
          }
        ],
        resources: {
          equipment: form.resources || [
            "Barra olímpica",
            "Banco de competición",
            "Discos calibrados",
            "Bandas elásticas",
            "Blocks"
          ],
          support: {
            coach: "2 sesiones semanales",
            trainingPartner: "3 sesiones semanales",
            physiotherapist: "Disponible si necesario"
          },
          knowledge: [
            "Programa de entrenamiento específico",
            "Videos técnicos",
            "Diario de entrenamiento"
          ],
          recovery: [
            "Foam roller",
            "Banda de compresión",
            "Suplementación básica"
          ]
        }
      };

      console.log('Sending smart goals payload:', smartGoalsPayload);

      const response = await fetch('https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/chats/smart-goals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(smartGoalsPayload)
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        throw new Error('Error al generar el objetivo SMART');
      }

      const data = await response.json();
      console.log('Response data:', data);
      setSmartGoalPlan(data.smartGoalPlan);
      
      setShowForm(false);
    } catch (error) {
      console.error('Error:', error);
      alert('Hubo un error al generar el objetivo SMART. Por favor, intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAutoFill = () => {
    setForm({
      goalDescription: "Aumentar fuerza en press de banca",
      timeframe: "3 meses",
      measurementMethod: "1RM en press de banca",
      currentValue: "80 kg",
      targetValue: "100 kg",
      relevance: "Competición powerlifting en 6 meses",
      obstacles: ["Tiempo limitado", "Recursos económicos"],
      resources: ["Entrenador personal", "Equipamiento"]
    });
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto transform transition-all duration-300 ease-in-out">
        <div className="sticky top-0 z-10 bg-white dark:bg-gray-800">
          <div className="p-6 bg-gradient-to-r from-violet-500 to-purple-500 rounded-t-2xl">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <Target className="w-8 h-8 text-white animate-pulse" />
                <div>
                  <h2 className="text-2xl font-bold text-white">Constructor de Metas SMART</h2>
                  <p className="text-purple-100 mt-1">Define objetivos específicos y alcanzables</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-full transition-colors duration-200"
              >
                <X className="w-6 h-6 text-white" />
              </button>
            </div>
          </div>
        </div>

        <div className="p-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-gray-600 dark:text-gray-400 animate-pulse">Generando tu objetivo SMART...</p>
            </div>
          ) : showForm ? (
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleAutoFill}
                  className="px-4 py-2 text-sm font-medium text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 transition-colors duration-200"
                >
                  Autorrellenar ejemplo
                </button>
              </div>
              {/* Descripción del objetivo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Describe tu objetivo
                </label>
                <textarea
                  value={form.goalDescription}
                  onChange={(e) => handleInputChange('goalDescription', e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  rows={3}
                  placeholder="¿Qué quieres lograr específicamente?"
                />
              </div>

              {/* Plazo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  ¿En cuánto tiempo quieres lograrlo?
                </label>
                <div className="flex flex-wrap gap-2">
                  {timeframeOptions.map(timeframe => (
                    <button
                      key={timeframe}
                      type="button"
                      onClick={() => handleInputChange('timeframe', timeframe)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                        form.timeframe === timeframe
                          ? 'bg-purple-500 text-white shadow-lg'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      {timeframe}
                    </button>
                  ))}
                </div>
              </div>

              {/* Método de medición */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  ¿Cómo medirás el progreso?
                </label>
                <input
                  type="text"
                  value={form.measurementMethod}
                  onChange={(e) => handleInputChange('measurementMethod', e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  placeholder="Ej: Peso, repeticiones, tiempo, etc."
                />
              </div>

              {/* Valores actual y objetivo */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Valor actual
                  </label>
                  <input
                    type="text"
                    value={form.currentValue}
                    onChange={(e) => handleInputChange('currentValue', e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    placeholder="¿Dónde estás ahora?"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Valor objetivo
                  </label>
                  <input
                    type="text"
                    value={form.targetValue}
                    onChange={(e) => handleInputChange('targetValue', e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    placeholder="¿Dónde quieres llegar?"
                  />
                </div>
              </div>

              {/* Relevancia */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  ¿Por qué es importante este objetivo?
                </label>
                <textarea
                  value={form.relevance}
                  onChange={(e) => handleInputChange('relevance', e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  rows={3}
                  placeholder="Explica por qué este objetivo es relevante para ti"
                />
              </div>

              {/* Obstáculos */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Posibles obstáculos
                </label>
                <div className="flex flex-wrap gap-2">
                  {obstacleOptions.map(obstacle => (
                    <button
                      key={obstacle}
                      type="button"
                      onClick={() => handleArrayToggle('obstacles', obstacle)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                        form.obstacles.includes(obstacle)
                          ? 'bg-purple-500 text-white shadow-lg'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      {obstacle}
                    </button>
                  ))}
                </div>
              </div>

              {/* Recursos */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Recursos necesarios
                </label>
                <div className="flex flex-wrap gap-2">
                  {resourceOptions.map(resource => (
                    <button
                      key={resource}
                      type="button"
                      onClick={() => handleArrayToggle('resources', resource)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                        form.resources.includes(resource)
                          ? 'bg-purple-500 text-white shadow-lg'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      {resource}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 px-6 bg-gradient-to-r from-violet-500 to-purple-500 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2"
              >
                <Target className="w-5 h-5" />
                Generar Objetivo SMART
              </button>
            </form>
          ) : (
            <SmartGoalBuilderResponse smartGoalPlan={smartGoalPlan} />
          )}
        </div>
      </div>
    </div>
  );
};

export default SmartGoalsBuilder;
