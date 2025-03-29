import { useState } from 'react';
import { X, Check, Rocket, AlertCircle } from 'lucide-react';

interface PlateauStrategiesPlannerProps {
  isVisible: boolean;
  onClose: () => void;
}

interface FormData {
  currentPlateau: string;
  plateauDuration: string;
  previousStrategies: string[];
  currentLevel: string;
  targetLevel: string;
  limitations: string[];
  motivation: number;
}

interface PlateauStrategy {
  analysis: string;
  adjustmentTriggers: string[];
  shortTermStrategies: string[];
  longTermStrategies: string[];
  motivationalStrategies: string[];
  progressMetrics: string[];
  timeline: string;
}

interface ApiResponse {
  timestamp: string;
  plateauStrategy: PlateauStrategy;
  status: string;
  version: string;
}

const PlateauStrategiesPlanner: React.FC<PlateauStrategiesPlannerProps> = ({
  isVisible,
  onClose,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(true);
  const [apiResponse, setApiResponse] = useState<ApiResponse | null>(null);

  const [form, setForm] = useState<FormData>({
    currentPlateau: '',
    plateauDuration: '',
    previousStrategies: [],
    currentLevel: '',
    targetLevel: '',
    limitations: [],
    motivation: 5,
  });

  const plateauDurations = [
    '1-2 semanas',
    '2-4 semanas',
    '1-2 meses',
    'Más de 2 meses'
  ];

  const previousStrategiesOptions = [
    'Aumentar intensidad',
    'Cambiar rutina',
    'Descanso activo',
    'Nutrición específica',
    'Nuevo entrenador',
    'Cambio de horario'
  ];

  const limitationsOptions = [
    'Tiempo limitado',
    'Lesiones previas',
    'Equipo limitado',
    'Presupuesto',
    'Energía/Fatiga',
    'Técnica'
  ];

  const handleInputChange = (field: keyof FormData, value: any) => {
    setForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayToggle = (field: 'previousStrategies' | 'limitations', value: string) => {
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

      const plateauStrategiesPayload = {
        currentPlateau: form.currentPlateau || "Estancamiento en progresión de peso muerto, sin mejoras en las últimas 6 semanas",
        plateauDuration: form.plateauDuration || "6 semanas",
        currentLevel: {
          exercise: "Peso muerto",
          currentWeight: "120 kg",
          reps: "5",
          sets: "3",
          frequency: "2 veces por semana",
          technique: "Convencional",
          performanceMetrics: {
            formQuality: "8/10",
            consistency: "9/10",
            recovery: "7/10"
          }
        },
        targetLevel: {
          desiredWeight: "140 kg",
          targetReps: "5",
          targetSets: "3",
          timeframe: "3 meses"
        },
        previousStrategies: form.previousStrategies.length > 0 ? form.previousStrategies : [
          "Aumentar volumen de entrenamiento",
          "Modificar la técnica",
          "Añadir bandas elásticas",
          "Cambiar día de entrenamiento"
        ],
        limitations: form.limitations.length > 0 ? form.limitations : [
          "Dolor ocasional en la zona lumbar",
          "Tiempo limitado para entrenar (máximo 1 hora)",
          "Acceso limitado a equipamiento especializado"
        ],
        motivation: form.motivation
      };

      console.log('Sending plateau strategies payload:', plateauStrategiesPayload);

      const response = await fetch('https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/chats/plateau-strategies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(plateauStrategiesPayload)
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        throw new Error('Error al generar las estrategias');
      }

      const data = await response.json();
      console.log('Response data:', data);
      setApiResponse(data);
      setShowForm(false);
    } catch (error) {
      console.error('Error:', error);
      alert('Hubo un error al generar las estrategias. Por favor, intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto transform transition-all duration-300 ease-in-out">
        <div className="sticky top-0 z-10 bg-white dark:bg-gray-800">
          <div className="p-6 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-t-2xl">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <Rocket className="w-8 h-8 text-white animate-bounce" />
                <div>
                  <h2 className="text-2xl font-bold text-white">Planificador de Estrategias</h2>
                  <p className="text-blue-100 mt-1">Supera tus mesetas y alcanza nuevos niveles</p>
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

        {showForm ? (
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-6">
                {/* Descripción del estancamiento */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Describe tu estancamiento actual
                  </label>
                  <textarea
                    value={form.currentPlateau}
                    onChange={(e) => handleInputChange('currentPlateau', e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    rows={3}
                    placeholder="Describe en qué aspecto te sientes estancado..."
                  />
                </div>

                {/* Duración del estancamiento */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    ¿Cuánto tiempo llevas estancado?
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {plateauDurations.map(duration => (
                      <button
                        key={duration}
                        type="button"
                        onClick={() => handleInputChange('plateauDuration', duration)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                          form.plateauDuration === duration
                            ? 'bg-blue-500 text-white shadow-lg'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                      >
                        {duration}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Nivel actual y objetivo */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Nivel actual
                    </label>
                    <input
                      type="text"
                      value={form.currentLevel}
                      onChange={(e) => handleInputChange('currentLevel', e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Ej: 80kg en press banca"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Nivel objetivo
                    </label>
                    <input
                      type="text"
                      value={form.targetLevel}
                      onChange={(e) => handleInputChange('targetLevel', e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Ej: 100kg en press banca"
                    />
                  </div>
                </div>

                {/* Estrategias previas */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Estrategias previas utilizadas
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {previousStrategiesOptions.map(strategy => (
                      <button
                        key={strategy}
                        type="button"
                        onClick={() => handleArrayToggle('previousStrategies', strategy)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                          form.previousStrategies.includes(strategy)
                            ? 'bg-blue-500 text-white shadow-lg'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                      >
                        {strategy}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Limitaciones */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Limitaciones actuales
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {limitationsOptions.map(limitation => (
                      <button
                        key={limitation}
                        type="button"
                        onClick={() => handleArrayToggle('limitations', limitation)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                          form.limitations.includes(limitation)
                            ? 'bg-blue-500 text-white shadow-lg'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                      >
                        {limitation}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Nivel de motivación */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Nivel de motivación
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={form.motivation}
                      onChange={(e) => handleInputChange('motivation', parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    />
                    <span className="text-sm text-gray-600 dark:text-gray-400 min-w-[2rem] text-center">
                      {form.motivation}
                    </span>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2"
              >
                <Rocket className="w-5 h-5" />
                Generar Plan Estratégico
              </button>
            </form>
          </div>
        ) : (
          <div className="p-6 space-y-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : apiResponse ? (
              <div className="space-y-6">
                <section className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                  <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Análisis del Estancamiento</h3>
                  <p className="text-gray-600 dark:text-gray-300">{apiResponse.plateauStrategy.analysis}</p>
                </section>

                <section className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                  <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Disparadores de Ajuste</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    {apiResponse.plateauStrategy.adjustmentTriggers.map((trigger: string, index: number) => (
                      <li key={index} className="text-gray-600 dark:text-gray-300">{trigger}</li>
                    ))}
                  </ul>
                </section>

                <section className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                  <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Estrategias a Corto Plazo</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    {apiResponse.plateauStrategy.shortTermStrategies.map((strategy: string, index: number) => (
                      <li key={index} className="text-gray-600 dark:text-gray-300">{strategy}</li>
                    ))}
                  </ul>
                </section>

                <section className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                  <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Estrategias a Largo Plazo</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    {apiResponse.plateauStrategy.longTermStrategies.map((strategy: string, index: number) => (
                      <li key={index} className="text-gray-600 dark:text-gray-300">{strategy}</li>
                    ))}
                  </ul>
                </section>

                <section className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                  <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Estrategias Motivacionales</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    {apiResponse.plateauStrategy.motivationalStrategies.map((strategy: string, index: number) => (
                      <li key={index} className="text-gray-600 dark:text-gray-300">{strategy}</li>
                    ))}
                  </ul>
                </section>

                <section className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                  <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Métricas de Progreso</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    {apiResponse.plateauStrategy.progressMetrics.map((metric: string, index: number) => (
                      <li key={index} className="text-gray-600 dark:text-gray-300">{metric}</li>
                    ))}
                  </ul>
                </section>

                <section className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                  <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Línea de Tiempo</h3>
                  <p className="text-gray-600 dark:text-gray-300">{apiResponse.plateauStrategy.timeline}</p>
                </section>

                <div className="flex gap-4 mt-6">
                  <button
                    onClick={() => {
                      setShowForm(true);
                      setApiResponse(null);
                    }}
                    className="flex-1 py-3 px-6 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg transition-colors duration-200"
                  >
                    Crear Nuevo Plan
                  </button>
                  <button
                    onClick={onClose}
                    className="flex-1 py-3 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    Finalizar
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
};

export default PlateauStrategiesPlanner;
