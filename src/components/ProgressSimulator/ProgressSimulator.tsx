import React, { useState } from 'react';
import { X } from 'lucide-react';

interface ProgressSimulatorProps {
  isVisible: boolean;
  onClose: () => void;
}

interface MainLifts {
  benchPress: string;
  squat: string;
  deadlift: string;
}

interface PerformanceGoals extends MainLifts {
  cardio: string;
}

interface MacroDistribution {
  protein: string;
  carbs: string;
  fats: string;
}

interface Nutrition {
  currentCalories: number;
  macroDistribution: MacroDistribution;
  mealsPerDay: number;
}

interface Recovery {
  restDays: number;
  activeRecovery: boolean;
  sleepQuality: string;
}

interface FormData {
  startingPoint: {
    weight: string;
    bodyFat: string;
    musclePercentage: string;
    mainLifts: MainLifts;
    cardiovascularCapacity: string;
  };
  goal: {
    primaryGoal: string;
    targetWeight: string;
    targetBodyFat: string;
    targetMusclePercentage: string;
    performanceGoals: PerformanceGoals;
  };
  timeframe: string;
  trainingFrequency: {
    daysPerWeek: number;
    sessionsPerDay: number;
    sessionDuration: string;
    splitType: string;
  };
  intensityLevel: {
    strength: string;
    cardio: string;
    overallIntensity: string;
  };
  variables: {
    sleep: string;
    stress: string;
    nutrition: Nutrition;
    recovery: Recovery;
  };
  limitations: string[];
  optimizationStrategies: string[];
}

interface ApiResponse {
  timestamp: string;
  progressSimulation: {
    adaptationGuidelines: string;
    nutritionPlan: string;
    obstacleStrategies: string;
    overallProgress: string;
    trackingMetrics: string;
    trainingRecommendations: string;
    weeklyMilestones: {
      [key: string]: string;
    };
  };
  status: string;
  version: string;
}

const ProgressSimulator: React.FC<ProgressSimulatorProps> = ({ isVisible, onClose }) => {
  const [form, setForm] = useState<FormData>({
    startingPoint: {
      weight: '',
      bodyFat: '',
      musclePercentage: '',
      mainLifts: {
        benchPress: '',
        squat: '',
        deadlift: ''
      },
      cardiovascularCapacity: ''
    },
    goal: {
      primaryGoal: '',
      targetWeight: '',
      targetBodyFat: '',
      targetMusclePercentage: '',
      performanceGoals: {
        benchPress: '',
        squat: '',
        deadlift: '',
        cardio: ''
      }
    },
    timeframe: '',
    trainingFrequency: {
      daysPerWeek: 4,
      sessionsPerDay: 1,
      sessionDuration: '60 minutos',
      splitType: 'Upper/Lower split'
    },
    intensityLevel: {
      strength: '75% de 1RM',
      cardio: '70-80% FCM',
      overallIntensity: 'Moderado-Alto'
    },
    variables: {
      sleep: '7-8 horas por noche',
      stress: 'Nivel moderado',
      nutrition: {
        currentCalories: 2500,
        macroDistribution: {
          protein: '25%',
          carbs: '45%',
          fats: '30%'
        },
        mealsPerDay: 4
      },
      recovery: {
        restDays: 3,
        activeRecovery: true,
        sleepQuality: 'Buena'
      }
    },
    limitations: [],
    optimizationStrategies: []
  });

  const [apiResponse, setApiResponse] = useState<ApiResponse | null>(null);

  const timeframeOptions = ['4 semanas', '8 semanas', '12 semanas', '16 semanas'];
  const frequencyOptions = ['2-3 veces/semana', '3-4 veces/semana', '4-5 veces/semana', '6-7 veces/semana'];
  const intensityOptions = ['Baja', 'Moderada', 'Alta', 'Variable'];
  const limitationOptions = [
    'Lesión previa',
    'Horario laboral extenso',
    'Presupuesto limitado',
    'Viajes frecuentes',
    'Restricciones dietéticas',
    'Equipo limitado'
  ];
  const optimizationOptions = [
    'Periodización ondulante',
    'Nutrición cíclica',
    'Entrenamiento en ayunas',
    'Suplementación básica',
    'Seguimiento mediante app'
  ];

  const handleInputChange = (field: string, value: any) => {
    console.log('📝 Actualizando campo:', field, 'con valor:', value);
    setForm(prev => {
      const newForm = { ...prev };
      const fields = field.split('.');
      let current: any = newForm;
      
      for (let i = 0; i < fields.length - 1; i++) {
        current = current[fields[i]];
      }
      current[fields[fields.length - 1]] = value;
      
      console.log('✨ Formulario actualizado:', newForm);
      return newForm;
    });
  };

  const handleArrayToggle = (field: 'limitations' | 'optimizationStrategies', value: string) => {
    console.log('🔄 Toggle array:', field, 'valor:', value);
    setForm(prev => {
      const newValue = prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value];
      console.log('📊 Nuevo array:', newValue);
      return {
        ...prev,
        [field]: newValue
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('🚀 Iniciando envío del formulario...');
    console.log('📋 Datos a enviar:', form);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('❌ Error: No se encontró el token de autenticación');
        throw new Error('No se encontró el token de autenticación');
      }
      console.log('🔑 Token encontrado');

      console.log('📡 Realizando petición a la API...');
      const response = await fetch('https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/chats/progress-simulator', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });

      if (!response.ok) {
        console.error('❌ Error en la respuesta de la API:', response.status);
        throw new Error('Error al enviar los datos');
      }

      const data = await response.json();
      console.log('✅ Respuesta exitosa de la API:', data);
      setApiResponse(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  if (!isVisible) return null;

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center ${isVisible ? '' : 'hidden'}`}>
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Simulador de Progreso</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Punto de inicio */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Punto de inicio</h3>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                value={form.startingPoint.weight}
                onChange={(e) => handleInputChange('startingPoint.weight', e.target.value)}
                placeholder="Peso (ej: 85 kg)"
                className="input-field"
              />
              <input
                type="text"
                value={form.startingPoint.bodyFat}
                onChange={(e) => handleInputChange('startingPoint.bodyFat', e.target.value)}
                placeholder="Grasa corporal (ej: 22%)"
                className="input-field"
              />
            </div>
          </div>

          {/* Objetivo */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Objetivo</h3>
            <input
              type="text"
              value={form.goal.primaryGoal}
              onChange={(e) => handleInputChange('goal.primaryGoal', e.target.value)}
              placeholder="Objetivo principal"
              className="input-field w-full"
            />
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                value={form.goal.targetWeight}
                onChange={(e) => handleInputChange('goal.targetWeight', e.target.value)}
                placeholder="Peso objetivo"
                className="input-field"
              />
              <input
                type="text"
                value={form.goal.targetBodyFat}
                onChange={(e) => handleInputChange('goal.targetBodyFat', e.target.value)}
                placeholder="% grasa objetivo"
                className="input-field"
              />
            </div>
          </div>

          {/* Plazo y frecuencia */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Plazo y frecuencia</h3>
            <div className="grid grid-cols-2 gap-4">
              <select
                value={form.timeframe}
                onChange={(e) => handleInputChange('timeframe', e.target.value)}
                className="input-field"
              >
                <option value="">Selecciona el plazo</option>
                {timeframeOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
              <select
                value={form.trainingFrequency.daysPerWeek}
                onChange={(e) => handleInputChange('trainingFrequency.daysPerWeek', parseInt(e.target.value))}
                className="input-field"
              >
                <option value="">Días por semana</option>
                {[2, 3, 4, 5, 6].map(days => (
                  <option key={days} value={days}>{days} días</option>
                ))}
              </select>
            </div>
          </div>

          {/* Limitaciones */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Limitaciones</h3>
            <div className="grid grid-cols-2 gap-2">
              {limitationOptions.map(option => (
                <button
                  key={option}
                  type="button"
                  onClick={() => handleArrayToggle('limitations', option)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                    ${form.limitations.includes(option)
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-100'
                      : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'}`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          {/* Estrategias de optimización */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Estrategias de optimización</h3>
            <div className="grid grid-cols-2 gap-2">
              {optimizationOptions.map(option => (
                <button
                  key={option}
                  type="button"
                  onClick={() => handleArrayToggle('optimizationStrategies', option)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                    ${form.optimizationStrategies.includes(option)
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-100'
                      : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'}`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-500 text-white py-3 rounded-lg font-medium hover:bg-emerald-600 transition-colors"
          >
            Simular Progreso
          </button>
        </form>

        {/* Renderización de la respuesta de la API */}
        {apiResponse && (
          <div className="mt-8 space-y-6 bg-gray-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">📊 Resultados de la Simulación</h3>
            
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-lg shadow">
                <h4 className="font-semibold text-lg mb-2">🎯 Progreso General</h4>
                <p className="text-gray-700">{apiResponse.progressSimulation.overallProgress}</p>
              </div>

              <div className="bg-white p-4 rounded-lg shadow">
                <h4 className="font-semibold text-lg mb-2">💪 Recomendaciones de Entrenamiento</h4>
                <p className="text-gray-700">{apiResponse.progressSimulation.trainingRecommendations}</p>
              </div>

              <div className="bg-white p-4 rounded-lg shadow">
                <h4 className="font-semibold text-lg mb-2">🥗 Plan Nutricional</h4>
                <p className="text-gray-700">{apiResponse.progressSimulation.nutritionPlan}</p>
              </div>

              <div className="bg-white p-4 rounded-lg shadow">
                <h4 className="font-semibold text-lg mb-2">📈 Métricas de Seguimiento</h4>
                <p className="text-gray-700">{apiResponse.progressSimulation.trackingMetrics}</p>
              </div>

              <div className="bg-white p-4 rounded-lg shadow">
                <h4 className="font-semibold text-lg mb-2">🎯 Hitos Semanales</h4>
                {Object.entries(apiResponse.progressSimulation.weeklyMilestones).map(([periodo, descripcion]) => (
                  <div key={periodo} className="mb-3">
                    <h5 className="font-medium text-indigo-600">{periodo}</h5>
                    <p className="text-gray-700">{descripcion}</p>
                  </div>
                ))}
              </div>

              <div className="bg-white p-4 rounded-lg shadow">
                <h4 className="font-semibold text-lg mb-2">🔄 Pautas de Adaptación</h4>
                <p className="text-gray-700">{apiResponse.progressSimulation.adaptationGuidelines}</p>
              </div>

              <div className="bg-white p-4 rounded-lg shadow">
                <h4 className="font-semibold text-lg mb-2">🚧 Estrategias para Obstáculos</h4>
                <p className="text-gray-700">{apiResponse.progressSimulation.obstacleStrategies}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgressSimulator;
