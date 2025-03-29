import React, { useState } from 'react';
import { Dumbbell, Home, DollarSign, Target, X, CheckCircle2, Info, ShoppingBag } from 'lucide-react';
import HomeEquipmentResponse from './HomeEquipmentResponse';

interface HomeEquipmentAdvisorProps {
  isVisible: boolean;
  onClose: () => void;
}

interface RoomDimensions {
  length: string;
  width: string;
  height: string;
}

interface AvailableSpace {
  roomDimensions: RoomDimensions;
  type: string;
  floorType: string;
  ventilation: string;
  powerOutlets: number;
  restrictions: string[];
}

interface Budget {
  total: number;
  currency: string;
  paymentPreference: string;
  flexibility: string;
  priorityItems: string[];
}

interface FitnessGoal {
  primary: string;
  secondary: string;
  timeframe: string;
  focusAreas: string[];
}

interface Experience {
  weightTraining: string;
  cardioEquipment: string;
  functionalTraining: string;
}

interface PreferredEquipment {
  mustHave: string[];
  interested: string[];
  avoid: string[];
  experience: Experience;
}

interface FormData {
  availableSpace: AvailableSpace;
  budget: Budget;
  fitnessGoals: FitnessGoal[];
  preferredEquipment: PreferredEquipment;
}

interface Equipment {
  item: string;
  description: string;
  estimatedPrice: string;
}

interface RecommendationsResponse {
  recommendedEquipment: Equipment[];
  justifications: {
    cardio?: string;
    flexibility?: string;
    strength?: string;
  };
  spaceLayout: string;
  budgetAlternatives: string;
  maintenanceTips: string;
  accessories?: Equipment[];
}

const HomeEquipmentAdvisor: React.FC<HomeEquipmentAdvisorProps> = ({
  isVisible,
  onClose,
}) => {
  const [step, setStep] = useState(1);
  const [recommendations, setRecommendations] = useState<RecommendationsResponse | null>(null);
  const [form, setForm] = useState<FormData>({
    availableSpace: {
      roomDimensions: {
        length: '',
        width: '',
        height: ''
      },
      type: 'Habitación dedicada',
      floorType: 'Parquet',
      ventilation: 'Ventana grande',
      powerOutlets: 3,
      restrictions: []
    },
    budget: {
      total: 1500,
      currency: 'EUR',
      paymentPreference: 'Una sola compra',
      flexibility: '±200 EUR',
      priorityItems: []
    },
    fitnessGoals: [{
      primary: '',
      secondary: '',
      timeframe: '12 meses',
      focusAreas: []
    }],
    preferredEquipment: {
      mustHave: [],
      interested: [],
      avoid: [],
      experience: {
        weightTraining: 'Intermedio',
        cardioEquipment: 'Principiante',
        functionalTraining: 'Intermedio'
      }
    }
  });

  const spaceOptions = [
    'Espacio pequeño (< 10m²)',
    'Espacio mediano (10-20m²)',
    'Espacio grande (> 20m²)',
  ];

  const budgetOptions = [
    'Bajo (< 200€)',
    'Medio (200-500€)',
    'Alto (> 500€)',
  ];

  const fitnessGoalOptions = [
    'Pérdida de peso',
    'Ganancia muscular',
    'Resistencia cardiovascular',
    'Flexibilidad',
    'Fuerza',
    'Rehabilitación',
  ];

  const equipmentOptions = [
    'Pesas y mancuernas',
    'Bandas elásticas',
    'Máquina multifuncional',
    'Bicicleta estática',
    'Cinta de correr',
    'Banco de ejercicios',
    'Esterilla y accesorios',
    'TRX/Suspensión',
  ];

  const handleInputChange = (field: string, value: any) => {
    setForm(prev => {
      const newForm = { ...prev };
      const fields = field.split('.');
      let current: any = newForm;
      
      for (let i = 0; i < fields.length - 1; i++) {
        current = current[fields[i]];
      }
      current[fields[fields.length - 1]] = value;
      
      return newForm;
    });
  };

  const handleArrayToggle = (field: 'fitnessGoals' | 'equipment', value: string) => {
    setForm(prev => {
      const newForm = { ...prev };
      
      if (field === 'fitnessGoals') {
        const currentGoals = [...prev.fitnessGoals[0].focusAreas];
        const newGoals = currentGoals.includes(value)
          ? currentGoals.filter(item => item !== value)
          : [...currentGoals, value];
        
        return {
          ...prev,
          fitnessGoals: [{
            ...prev.fitnessGoals[0],
            focusAreas: newGoals,
            primary: newGoals[0] || '',
            secondary: newGoals[1] || ''
          }]
        };
      }
      
      if (field === 'equipment') {
        const currentEquipment = [...prev.preferredEquipment.mustHave];
        return {
          ...prev,
          preferredEquipment: {
            ...prev.preferredEquipment,
            mustHave: currentEquipment.includes(value)
              ? currentEquipment.filter(item => item !== value)
              : [...currentEquipment, value]
          }
        };
      }

      return prev;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted with data:', form);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No se encontró el token de autenticación');
      }

      const response = await fetch('https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/chats/home-equipment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });

      console.log('API Response status:', response.status);

      if (!response.ok) {
        throw new Error('Error al enviar los datos');
      }

      const data = await response.json();
      console.log('API Response data:', data);
      console.log('Recommendations from API:', data.recommendations);
      
      setRecommendations(data.recommendations);
      console.log('Updated recommendations state:', data.recommendations);
      
      setStep(2);
      
    } catch (error) {
      console.error('Error in handleSubmit:', error);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-6 rounded-t-xl relative">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-white/80 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-3">
            <Dumbbell className="w-8 h-8 text-white" />
            <div>
              <h2 className="text-2xl font-bold text-white">Asesor de Equipamiento</h2>
              <p className="text-blue-100">Encuentra el equipo perfecto para tu gimnasio en casa</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          {step === 1 ? (
            <div className="space-y-6">
              {/* Espacio disponible */}
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-lg font-medium text-gray-700 dark:text-gray-300">
                  <Home className="w-5 h-5 text-blue-500" />
                  Espacio disponible
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {spaceOptions.map(option => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => {
                        const size = option.includes('pequeño') ? '10' : option.includes('mediano') ? '15' : '20';
                        handleInputChange('availableSpace.roomDimensions', {
                          length: size,
                          width: size,
                          height: '2.5'
                        });
                      }}
                      className={`p-3 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2
                        ${form.availableSpace.roomDimensions.length === (option.includes('pequeño') ? '10' : option.includes('mediano') ? '15' : '20')
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-100 ring-2 ring-blue-500'
                          : 'bg-gray-50 text-gray-700 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                        }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              {/* Presupuesto */}
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-lg font-medium text-gray-700 dark:text-gray-300">
                  <DollarSign className="w-5 h-5 text-blue-500" />
                  Presupuesto disponible
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {budgetOptions.map(option => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => {
                        const amount = option.includes('Bajo') ? 200 : option.includes('Medio') ? 500 : 1000;
                        handleInputChange('budget.total', amount);
                      }}
                      className={`p-3 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2
                        ${(form.budget.total === 200 && option.includes('Bajo')) ||
                          (form.budget.total === 500 && option.includes('Medio')) ||
                          (form.budget.total === 1000 && option.includes('Alto'))
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-100 ring-2 ring-blue-500'
                          : 'bg-gray-50 text-gray-700 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                        }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              {/* Objetivos de fitness */}
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-lg font-medium text-gray-700 dark:text-gray-300">
                  <Target className="w-5 h-5 text-blue-500" />
                  Objetivos de fitness
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {fitnessGoalOptions.map(option => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => handleArrayToggle('fitnessGoals', option)}
                      className={`p-3 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2
                        ${form.fitnessGoals[0].focusAreas.includes(option)
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-100 ring-2 ring-blue-500'
                          : 'bg-gray-50 text-gray-700 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                        }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              {/* Equipamiento preferido */}
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-lg font-medium text-gray-700 dark:text-gray-300">
                  <ShoppingBag className="w-5 h-5 text-blue-500" />
                  Equipamiento preferido
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {equipmentOptions.map(option => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => handleArrayToggle('equipment', option)}
                      className={`p-3 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 text-center
                        ${form.preferredEquipment.mustHave.includes(option)
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-100 ring-2 ring-blue-500'
                          : 'bg-gray-50 text-gray-700 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                        }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleSubmit}
                className="w-full mt-6 py-3 px-6 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2"
                disabled={!form.availableSpace.roomDimensions.length || !form.budget.total || form.fitnessGoals[0].focusAreas.length === 0}
              >
                <Dumbbell className="w-5 h-5" />
                Generar Recomendaciones
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-4 flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium text-blue-700 dark:text-blue-300">
                    Recomendaciones personalizadas
                  </h3>
                  <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                    Basado en tus preferencias y necesidades
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {step === 2 && recommendations && (
                  <div className="w-full max-w-4xl mx-auto">
                    <HomeEquipmentResponse recommendations={recommendations} />
                  </div>
                )}
              </div>

              <div className="flex justify-between pt-4">
                <button
                  onClick={() => setStep(1)}
                  className="px-6 py-2.5 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors duration-200"
                >
                  Volver a empezar
                </button>
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:shadow-lg transition-all duration-200"
                >
                  Finalizar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomeEquipmentAdvisor;
