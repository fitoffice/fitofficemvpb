import React, { useState } from 'react';
import { Clock, Coffee, X, Brain, Activity, Dumbbell, Check, Info } from 'lucide-react';
import OfficeBreaksResponse from './OfficeBreaksResponse';

interface OfficeBreaksDesignerProps {
  isVisible: boolean;
  onClose: () => void;
}

interface FormData {
  workSchedule: {
    startTime: string;
    endTime: string;
    workingHours: number;
    lunchBreak: {
      start: string;
      duration: string;
    };
    workStyle: string;
    environment: string;
  };
  breakFrequency: {
    morning: {
      times: string[];
      type: string;
    };
    afternoon: {
      times: string[];
      type: string;
    };
    flexibility: string;
  };
  breakDuration: {
    microBreaks: string;
    fullBreaks: string;
    customization: {
      extendable: boolean;
      minimumDuration: string;
      maximumDuration: string;
    };
  };
  breakActivities: Array<{
    category: string;
    exercises: Array<{
      name: string;
      duration: string;
      intensity: string;
      focus: string;
    }>;
  }>;
  additionalPreferences: {
    environment: {
      space: string;
      equipment: string[];
      restrictions: string;
    };
    healthConsiderations: {
      conditions: string[];
      adaptations: string;
    };
    goals: {
      primary: string[];
      secondary: string[];
    };
    reminders: {
      type: string;
      sound: boolean;
      visualAlert: boolean;
    };
    tracking: {
      method: string;
      metrics: string[];
    };
  };
}

const OfficeBreaksDesigner: React.FC<OfficeBreaksDesignerProps> = ({
  isVisible,
  onClose,
}) => {
  const [step, setStep] = useState(1);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [form, setForm] = useState<FormData>({
    workSchedule: {
      startTime: "09:00",
      endTime: "18:00",
      workingHours: 8,
      lunchBreak: {
        start: "13:00",
        duration: "60 min"
      },
      workStyle: "Sentado frente al ordenador",
      environment: "Home office"
    },
    breakFrequency: {
      morning: {
        times: ["10:30", "12:00"],
        type: "Micro pausas activas"
      },
      afternoon: {
        times: ["15:30", "17:00"],
        type: "Micro pausas activas"
      },
      flexibility: "Ajustable según reuniones"
    },
    breakDuration: {
      microBreaks: "5-7 minutos",
      fullBreaks: "10-15 minutos",
      customization: {
        extendable: true,
        minimumDuration: "3 minutos",
        maximumDuration: "15 minutos"
      }
    },
    breakActivities: [
      {
        category: "Movilidad articular",
        exercises: [
          {
            name: "Rotación de cuello",
            duration: "30 segundos",
            intensity: "Suave",
            focus: "Cervical"
          }
        ]
      }
    ],
    additionalPreferences: {
      environment: {
        space: "2x2 metros disponibles",
        equipment: ["Silla de oficina"],
        restrictions: "Espacio limitado"
      },
      healthConsiderations: {
        conditions: ["Tensión cervical ocasional"],
        adaptations: "Ejercicios de bajo impacto"
      },
      goals: {
        primary: ["Reducir fatiga visual"],
        secondary: ["Mejorar postura"]
      },
      reminders: {
        type: "Notificaciones en el ordenador",
        sound: true,
        visualAlert: true
      },
      tracking: {
        method: "App de seguimiento",
        metrics: ["Breaks completados"]
      }
    }
  });

  const [breakPlanData, setBreakPlanData] = useState(null);

  const [selectedSchedule, setSelectedSchedule] = useState<string | null>(null);

  const [showResponse, setShowResponse] = useState(false);

  const scheduleOptions = [
    { label: 'Jornada completa (8h)', value: '08:00-18:00' },
    { label: 'Media jornada (4h)', value: '08:00-12:00' },
    { label: 'Jornada flexible', value: 'Flexible' },
    { label: 'Turnos rotativos', value: 'Rotativos' },
  ];

  const frequencyOptions = [
    { label: 'Cada hora', value: 'Cada hora' },
    { label: 'Cada 2 horas', value: 'Cada 2 horas' },
    { label: 'Cada 3 horas', value: 'Cada 3 horas' },
    { label: 'Según necesidad', value: 'Según necesidad' },
  ];

  const durationOptions = [
    { label: '5 minutos', value: '5 minutos' },
    { label: '10 minutos', value: '10 minutos' },
    { label: '15 minutos', value: '15 minutos' },
    { label: '20 minutos', value: '20 minutos' },
  ];

  const activityOptions = [
    { label: 'Estiramientos', value: 'Estiramientos' },
    { label: 'Ejercicios de respiración', value: 'Ejercicios de respiración' },
    { label: 'Caminata corta', value: 'Caminata corta' },
    { label: 'Ejercicios de ojos', value: 'Ejercicios de ojos' },
    { label: 'Meditación', value: 'Meditación' },
    { label: 'Hidratación', value: 'Hidratación' },
  ];

  const preferenceOptions = [
    { label: 'Recordatorios automáticos', value: 'Recordatorios automáticos' },
    { label: 'Ejercicios guiados', value: 'Ejercicios guiados' },
    { label: 'Música relajante', value: 'Música relajante' },
    { label: 'Tracking de descansos', value: 'Tracking de descansos' },
    { label: 'Modo silencioso', value: 'Modo silencioso' },
    { label: 'Sincronización calendario', value: 'Sincronización calendario' },
  ];

  const handleScheduleChange = (value: string) => {
    // Si se hace clic en la opción ya seleccionada, la deseleccionamos
    if (selectedSchedule === value) {
      setSelectedSchedule(null);
      setForm(prev => ({
        ...prev,
        workSchedule: {
          ...prev.workSchedule,
          startTime: "09:00",
          endTime: "18:00",
          workingHours: 8
        }
      }));
      return;
    }

    // Seleccionamos la nueva opción
    setSelectedSchedule(value);
    const [startTime, endTime] = value.split('-');
    console.log('Schedule Change - Input:', { value, startTime, endTime });
    
    setForm(prev => {
      const newForm = {
        ...prev,
        workSchedule: {
          ...prev.workSchedule,
          startTime: startTime || "09:00",
          endTime: endTime || "18:00",
          workingHours: endTime ? parseInt(endTime) - parseInt(startTime) : 8
        }
      };
      console.log('Schedule Change - Updated State:', newForm.workSchedule);
      return newForm;
    });
  };

  const handleFrequencyChange = (value: string) => {
    console.log('Frequency Change - Input:', value);
    
    setForm(prev => {
      const newForm = {
        ...prev,
        breakFrequency: {
          ...prev.breakFrequency,
          morning: {
            ...prev.breakFrequency.morning,
            type: value
          },
          afternoon: {
            ...prev.breakFrequency.afternoon,
            type: value
          }
        }
      };
      console.log('Frequency Change - Updated State:', newForm.breakFrequency);
      return newForm;
    });
  };

  const handleDurationChange = (value: string) => {
    console.log('Duration Change - Input:', value);
    
    setForm(prev => {
      const newForm = {
        ...prev,
        breakDuration: {
          ...prev.breakDuration,
          microBreaks: value,
          fullBreaks: value === '5 minutos' ? '10 minutos' : '15 minutos'
        }
      };
      console.log('Duration Change - Updated State:', newForm.breakDuration);
      return newForm;
    });
  };

  const handleActivityToggle = (value: string) => {
    console.log('Activity Toggle - Input:', value);
    
    setForm(prev => {
      const activities = [...prev.breakActivities];
      const activityIndex = activities.findIndex(a => a.category === value);
      
      if (activityIndex >= 0) {
        activities.splice(activityIndex, 1);
        console.log('Activity Toggle - Removing activity:', value);
      } else {
        activities.push({
          category: value,
          exercises: [{
            name: value,
            duration: "30 segundos",
            intensity: "Suave",
            focus: "General"
          }]
        });
        console.log('Activity Toggle - Adding activity:', value);
      }

      const newForm = {
        ...prev,
        breakActivities: activities
      };
      console.log('Activity Toggle - Updated State:', newForm.breakActivities);
      return newForm;
    });
  };

  const handlePreferenceToggle = (value: string) => {
    console.log('Preference Toggle - Input:', value);
    
    setForm(prev => {
      const newForm = {
        ...prev,
        additionalPreferences: {
          ...prev.additionalPreferences,
          goals: {
            ...prev.additionalPreferences.goals,
            primary: prev.additionalPreferences.goals.primary.includes(value)
              ? prev.additionalPreferences.goals.primary.filter(p => p !== value)
              : [...prev.additionalPreferences.goals.primary, value]
          }
        }
      };
      console.log('Preference Toggle - Updated State:', newForm.additionalPreferences.goals);
      return newForm;
    });
  };

  const generateRecommendations = async () => {
    try {
      console.log('Generating Recommendations - Current Form State:', form);
      
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found in localStorage');
        throw new Error('No se encontró el token de autenticación');
      }

      console.log('Making API Request to /api/chats/home-breaker');
      const response = await fetch('https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/chats/home-breaker', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });

      if (!response.ok) {
        console.error('API Response Error:', response.status, response.statusText);
        throw new Error('Error al obtener recomendaciones');
      }

      const data = await response.json();
      console.log('API Response Data:', data);
      
      setBreakPlanData(data);
      setShowResponse(true);
    } catch (error) {
      console.error('Error in generateRecommendations:', error);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-6 rounded-t-xl relative">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-white/80 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-3">
            <Coffee className="w-8 h-8 text-white" />
            <div>
              <h2 className="text-2xl font-bold text-white">Diseñador de Pausas Activas</h2>
              <p className="text-indigo-100">Optimiza tus descansos para mayor productividad</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          {!showResponse ? (
            <div className="space-y-6">
              {/* Horario laboral */}
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-lg font-medium text-gray-700 dark:text-gray-300">
                  <Clock className="w-5 h-5 text-indigo-500" />
                  Horario laboral
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {scheduleOptions.map(option => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleScheduleChange(option.value)}
                      className={`p-3 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2
                        ${selectedSchedule === option.value
                          ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-100 ring-2 ring-indigo-500'
                          : 'bg-gray-50 text-gray-700 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                        }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Frecuencia de pausas */}
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-lg font-medium text-gray-700 dark:text-gray-300">
                  <Activity className="w-5 h-5 text-indigo-500" />
                  Frecuencia de pausas
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {frequencyOptions.map(option => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleFrequencyChange(option.value)}
                      className={`p-3 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2
                        ${form.breakFrequency.morning.type === option.value
                          ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-100 ring-2 ring-indigo-500'
                          : 'bg-gray-50 text-gray-700 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                        }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Duración de pausas */}
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-lg font-medium text-gray-700 dark:text-gray-300">
                  <Clock className="w-5 h-5 text-indigo-500" />
                  Duración de pausas
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {durationOptions.map(option => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleDurationChange(option.value)}
                      className={`p-3 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2
                        ${form.breakDuration.microBreaks === option.value
                          ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-100 ring-2 ring-indigo-500'
                          : 'bg-gray-50 text-gray-700 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                        }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Actividades preferidas */}
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-lg font-medium text-gray-700 dark:text-gray-300">
                  <Dumbbell className="w-5 h-5 text-indigo-500" />
                  Actividades preferidas
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {activityOptions.map(option => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleActivityToggle(option.value)}
                      className={`p-3 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 text-center
                        ${form.breakActivities.some(a => a.category === option.value)
                          ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-100 ring-2 ring-indigo-500'
                          : 'bg-gray-50 text-gray-700 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                        }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Preferencias adicionales */}
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-lg font-medium text-gray-700 dark:text-gray-300">
                  <Brain className="w-5 h-5 text-indigo-500" />
                  Preferencias adicionales
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {preferenceOptions.map(option => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handlePreferenceToggle(option.value)}
                      className={`p-3 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 text-center
                        ${form.additionalPreferences.goals.primary.includes(option.value)
                          ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-100 ring-2 ring-indigo-500'
                          : 'bg-gray-50 text-gray-700 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                        }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={generateRecommendations}
                className="w-full mt-6 py-3 px-6 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2"
                disabled={!form.workSchedule.startTime || !form.breakFrequency.morning.type || !form.breakDuration.microBreaks}
              >
                <Coffee className="w-5 h-5" />
                Generar Plan de Pausas
              </button>
            </div>
          ) : (
            <OfficeBreaksResponse
              breakPlanData={breakPlanData}
              isVisible={true}
              onClose={() => {
                setShowResponse(false);
                setBreakPlanData(null);
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default OfficeBreaksDesigner;
