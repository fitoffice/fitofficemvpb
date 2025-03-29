import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, CheckSquare, User, ChevronLeft, ChevronRight } from 'lucide-react';
import { Cliente } from '../../services/clientService';
import CheckinContenedores from './CheckinContenedores';
import CheckinDetailPopup from './CheckinDetailPopup';

interface CheckinClientDetailProps {
  theme: string;
  selectedClient: Cliente | null;
  checkIns: Array<{id: number, name: string, date: string, time: string, notes: string}>;
  containerVariants: any;
  itemVariants: any;
  getAvatarBgColor: (clientId: string) => string;
  getInitials: (name: string, apellido: string) => string;
}

const CheckinClientDetail: React.FC<CheckinClientDetailProps> = ({
  theme,
  selectedClient,
  checkIns,
  containerVariants,
  itemVariants,
  getAvatarBgColor,
  getInitials
}) => {
  // Add state for date selection
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  // Add state for popup
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedCheckIn, setSelectedCheckIn] = useState<any>(null);
  
  // Format date for display
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  // Navigate to previous day
  const goToPreviousDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 1);
    setSelectedDate(newDate);
  };
  
  // Navigate to next day
  const goToNextDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 1);
    setSelectedDate(newDate);
  };
  // Go to today
  const goToToday = () => {
    setSelectedDate(new Date());
  };
  // Example check-ins for March 1, 2025
   // Example check-ins for March 1, 2025
   const exampleCheckIns = [
    {
      id: 3,
      name: "Check-in de Entrenamiento Cardiovascular",
      date: "01/03/2025",
      time: "17:15",
      notes: "No completó el tiempo objetivo. Fatiga excesiva. Revisar plan de recuperación y descanso.",
      type: "Entrenamiento",
      status: "danger",
      // Datos estructurados para el popup
      dayPlan: {
        _id: "dayplan123456",
        day: "Miércoles",
        fecha: "2025-03-01T08:00:00.000Z",
        sessions: [
          {
            _id: "session123456",
            name: "Entrenamiento Cardiovascular",
            tipo: "HIIT",
            rondas: 4,
            exercises: [
              {
                _id: "planningexercise123",
                exercise: {
                  _id: "exercise123",
                  nombre: "Carrera en cinta",
                  descripcion: "Cardio de alta intensidad",
                  categoria: "Cardio"
                },
                sets: [
                  {
                    _id: "set123",
                    distance: 1000,
                    speed: 12,
                    time: 5,
                    rest: 90,
                    completed: false,
                    renderConfig: {
                      campo1: "distance",
                      campo2: "speed",
                      campo3: "time"
                    },
                    checkIns: [
                      {
                        _id: "checkin123",
                        color: "#FF0000",
                        comentario: "No completó el tiempo objetivo. Fatiga excesiva.",
                        fecha: "2025-03-01T17:15:00.000Z"
                      }
                    ]
                  },
                  {
                    _id: "set124",
                    distance: 800,
                    speed: 14,
                    time: 4,
                    rest: 120,
                    completed: true,
                    renderConfig: {
                      campo1: "distance",
                      campo2: "speed",
                      campo3: "time"
                    },
                    checkIns: [
                      {
                        _id: "checkin124",
                        color: "#FFFF00",
                        comentario: "Completó con dificultad",
                        fecha: "2025-03-01T17:25:00.000Z"
                      }
                    ]
                  }
                ]
              },
              {
                _id: "planningexercise124",
                exercise: {
                  _id: "exercise124",
                  nombre: "Bicicleta estática",
                  descripcion: "Cardio de baja intensidad",
                  categoria: "Cardio"
                },
                sets: [
                  {
                    _id: "set126",
                    distance: 5000,
                    speed: 25,
                    time: 15,
                    completed: true,
                    renderConfig: {
                      campo1: "distance",
                      campo2: "speed",
                      campo3: "time"
                    },
                    checkIns: [
                      {
                        _id: "checkin126",
                        color: "#00FF00",
                        comentario: "Completado sin problemas",
                        fecha: "2025-03-01T17:40:00.000Z"
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      },
      notasPlanning: [
        {
          _id: "nota123",
          titulo: "Observación del entrenamiento",
          contenido: "El cliente muestra signos de sobreentrenamiento. Revisar plan de recuperación y descanso."
        }
      ]
    },
    {
      id: 4,
      name: "Check-in de Suplementación",
      date: "01/03/2025",
      time: "08:00",
      notes: "Toma correcta de todos los suplementos. Reporta mejor digestión con la nueva proteína.",
      type: "Dieta",
      status: "success",
      // Datos estructurados para el popup
      dayPlan: {
        _id: "dayplan123457",
        day: "Miércoles",
        fecha: "2025-03-01T08:00:00.000Z",
        sessions: [
          {
            _id: "session123457",
            name: "Plan de Alimentación",
            tipo: "Dieta",
            rondas: 1,
            exercises: [
              {
                _id: "planningexercise125",
                exercise: {
                  _id: "exercise125",
                  nombre: "Suplementación",
                  descripcion: "Toma de suplementos diarios",
                  categoria: "Nutrición"
                },
                sets: [
                  {
                    _id: "set128",
                    completed: true,
                    renderConfig: {
                      campo1: "completed",
                    },
                    checkIns: [
                      {
                        _id: "checkin128",
                        color: "#00FF00",
                        comentario: "Toma correcta de todos los suplementos",
                        fecha: "2025-03-01T08:00:00.000Z"
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      },
      notasPlanning: [
        {
          _id: "nota124",
          titulo: "Observación de suplementación",
          contenido: "El cliente reporta mejor digestión con la nueva proteína. Mantener el plan actual."
        }
      ]
    }
  ];
  
  // Filter check-ins based on selected date
  const getFilteredCheckIns = () => {
    // Check if selected date is March 1, 2025
    const isMarch1st2025 = selectedDate.getDate() === 1 && 
                           selectedDate.getMonth() === 2 && // 0-indexed, so 2 is March
                           selectedDate.getFullYear() === 2025;
    
    if (isMarch1st2025) {
      return exampleCheckIns;
    }
    
    // Otherwise return the actual check-ins (which might be filtered by date in a real implementation)
    return checkIns;
  };
  
  // Get the appropriate badge color based on check-in type
  const getCheckInTypeBadgeStyle = (type: string) => {
    if (type === "Entrenamiento") {
      return theme === 'dark'
        ? 'bg-blue-500/20 text-blue-300'
        : 'bg-blue-100 text-blue-800';
    } else if (type === "Dieta") {
      return theme === 'dark'
        ? 'bg-green-500/20 text-green-300'
        : 'bg-green-100 text-green-800';
    } else {
      return theme === 'dark'
        ? 'bg-teal-500/20 text-teal-300'
        : 'bg-teal-100 text-teal-800';
    }
  };

  // Handle opening the popup with the selected check-in
  const handleOpenCheckInDetail = (checkIn: any) => {
    setSelectedCheckIn(checkIn);
    setIsPopupOpen(true);
  };

  // Get filtered check-ins based on selected date
  const filteredCheckIns = getFilteredCheckIns();

  return (
    <div className="w-2/3 p-6">
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        {selectedClient ? (
          <>
            {/* Client info header */}
            <div className={`p-4 rounded-xl ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            } shadow-md`}>
              <div className="flex items-center">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-bold ${getAvatarBgColor(selectedClient._id)}`}>
                  {getInitials(selectedClient.nombre, selectedClient.apellido)}
                </div>
                <div className="ml-4">
                  <h2 className={`text-2xl font-bold ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    {selectedClient.nombre} {selectedClient.apellido}
                  </h2>
                  <div className="flex items-center mt-1">
                    <span className={`text-sm ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      {selectedClient.email} • {selectedClient.telefono}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Enhanced Date selector */}
            <motion.div
              variants={itemVariants}
              className={`p-5 rounded-xl ${
                theme === 'dark' 
                  ? 'bg-gray-800/90 border-gray-700/50' 
                  : 'bg-white/90 border-gray-200/50'
              } shadow-md border backdrop-blur-xl`}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-3 rounded-xl ${
                  theme === 'dark'
                    ? 'bg-purple-500/20'
                    : 'bg-purple-100'
                }`}>
                  <Calendar className={`w-6 h-6 ${
                    theme === 'dark' ? 'text-purple-300' : 'text-purple-600'
                  }`} />
                </div>
                <h2 className={`text-xl font-bold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-800'
                }`}>
                  Seleccionar Fecha
                </h2>
              </div>
              
              <div className="flex items-center justify-between mt-2">
                <button 
                  onClick={goToPreviousDay}
                  className={`p-3 rounded-xl transition-all duration-200 ${
                    theme === 'dark'
                      ? 'hover:bg-gray-700 text-gray-300 hover:text-white hover:shadow-inner'
                      : 'hover:bg-gray-100 text-gray-600 hover:shadow-md'
                  }`}
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                
                <div className="flex flex-col items-center">
                  <h3 className={`text-xl font-medium ${
                    theme === 'dark' ? 'text-white' : 'text-gray-800'
                  }`}>
                    {formatDate(selectedDate)}
                  </h3>
                  <button
                    onClick={goToToday}
                    className={`mt-2 text-xs px-4 py-1.5 rounded-full transition-all duration-200 ${
                      theme === 'dark'
                        ? 'bg-purple-600/30 text-purple-300 hover:bg-purple-600/50 hover:shadow-lg hover:shadow-purple-500/20'
                        : 'bg-purple-100 text-purple-700 hover:bg-purple-200 hover:shadow-md'
                    }`}
                  >
                    Hoy
                  </button>
                </div>
                
                <button 
                  onClick={goToNextDay}
                  className={`p-3 rounded-xl transition-all duration-200 ${
                    theme === 'dark'
                      ? 'hover:bg-gray-700 text-gray-300 hover:text-white hover:shadow-inner'
                      : 'hover:bg-gray-100 text-gray-600 hover:shadow-md'
                  }`}
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
              
              <div className="mt-4 relative">
                <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  <Calendar className="w-5 h-5" />
                </div>
                <input
                  type="date"
                  value={selectedDate.toISOString().split('T')[0]}
                  onChange={(e) => setSelectedDate(new Date(e.target.value))}
                  className={`w-full pl-10 p-3 rounded-xl border transition-all duration-200 ${
                    theme === 'dark'
                      ? 'bg-gray-700/70 border-gray-600 text-white focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500'
                      : 'bg-gray-50/70 border-gray-200 text-gray-900 focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500'
                  }`}
                />
              </div>
              
              {/* Week day selector */}
              <div className="grid grid-cols-7 gap-1 mt-4">
                {['D', 'L', 'M', 'X', 'J', 'V', 'S'].map((day, index) => {
                  const currentDay = new Date().getDay();
                  const isToday = currentDay === index;
                  const isSelected = selectedDate.getDay() === index;
                  
                  return (
                    <button
                      key={day}
                      onClick={() => {
                        const newDate = new Date();
                        const diff = index - newDate.getDay();
                        newDate.setDate(newDate.getDate() + diff);
                        setSelectedDate(newDate);
                      }}
                      className={`py-2 rounded-lg text-center transition-all duration-200 ${
                        isSelected
                          ? theme === 'dark'
                            ? 'bg-purple-600/50 text-white font-medium'
                            : 'bg-purple-500 text-white font-medium'
                          : isToday
                            ? theme === 'dark'
                              ? 'bg-gray-700 text-purple-300 font-medium'
                              : 'bg-gray-100 text-purple-700 font-medium'
                            : theme === 'dark'
                              ? 'hover:bg-gray-700 text-gray-300'
                              : 'hover:bg-gray-100 text-gray-600'
                      }`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </motion.div>

            {/* Check-in History */}
            <CheckinContenedores
              theme={theme}
              itemVariants={itemVariants}
              filteredCheckIns={filteredCheckIns}
              getCheckInTypeBadgeStyle={getCheckInTypeBadgeStyle}
              onCheckInClick={handleOpenCheckInDetail}
            />

            {/* Check-in Detail Popup */}
            <CheckinDetailPopup
              isOpen={isPopupOpen}
              onClose={() => setIsPopupOpen(false)}
              checkIn={selectedCheckIn}
              theme={theme}
            />
          </>
        ) : (
          <div className="flex items-center justify-center h-[70vh]">
            <div className="text-center">
              <User className={`w-16 h-16 mx-auto mb-4 ${
                theme === 'dark' ? 'text-gray-600' : 'text-gray-300'
              }`} />
              <h3 className={`text-xl font-medium ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Selecciona un cliente
              </h3>
              <p className={`mt-2 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`}>
                Elige un cliente de la lista para ver su historial de check-ins
              </p>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default CheckinClientDetail;