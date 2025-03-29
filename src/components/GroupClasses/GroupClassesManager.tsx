import { useState } from 'react';
import { X, Check, Users, AlertCircle, Calendar, Clock, Target, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface GroupClassesManagerProps {
  isVisible: boolean;
  onClose: () => void;
}

interface ClassSession {
  id: string;
  name: string;
  type: string;
  level: string;
  capacity: number;
  schedule: string;
  duration: string;
  equipment: string[];
  objectives: string[];
}

interface FormData {
  className: string;
  classType: string;
  level: string;
  capacity: string;
  schedule: string;
  duration: string;
  equipment: string[];
  objectives: string[];
}

const GroupClassesManager: React.FC<GroupClassesManagerProps> = ({
  isVisible,
  onClose,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(true);
  const [sessions, setSessions] = useState<ClassSession[]>([]);

  const [form, setForm] = useState<FormData>({
    className: '',
    classType: '',
    level: '',
    capacity: '',
    schedule: '',
    duration: '',
    equipment: [],
    objectives: [],
  });

  const classTypes = [
    'Bootcamp',
    'HIIT',
    'Funcional',
    'Fuerza',
    'Cardio',
    'Mixto'
  ];

  const levelOptions = [
    'Principiante',
    'Intermedio',
    'Avanzado',
    'Multinivel'
  ];

  const capacityOptions = [
    '5-10',
    '10-15',
    '15-20',
    '20+'
  ];

  const durationOptions = [
    '30 min',
    '45 min',
    '60 min',
    '90 min'
  ];

  const equipmentOptions = [
    'Pesas',
    'Bandas',
    'Steps',
    'Colchonetas',
    'TRX',
    'Kettlebells'
  ];

  const objectiveOptions = [
    'Pérdida de peso',
    'Tonificación',
    'Resistencia',
    'Fuerza',
    'Agilidad',
    'Flexibilidad'
  ];

  const handleInputChange = (field: keyof FormData, value: any) => {
    setForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayToggle = (field: 'equipment' | 'objectives', value: string) => {
    setForm(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }));
  };

  const generateApiPayload = () => {
    const payload = {
      className: form.className,
      classType: {
        primary: form.classType,
        format: "Presencial",
        style: "Circuito",
        focus: form.objectives.slice(0, 3)
      },
      level: {
        minimum: form.level,
        recommended: form.level === "Principiante" ? "Intermedio" : "Avanzado",
        scalability: {
          beginnerOptions: true,
          advancedVariations: true
        }
      },
      capacity: {
        minimum: parseInt(form.capacity.split('-')[0]),
        maximum: parseInt(form.capacity.split('-')[1] || form.capacity.replace('+', '')),
        optimal: Math.floor((parseInt(form.capacity.split('-')[0]) + parseInt(form.capacity.split('-')[1] || form.capacity.replace('+', ''))) / 2),
        waitlistLimit: 5
      },
      schedule: {
        weekdays: ["Lunes", "Miércoles", "Viernes"],
        timeSlots: [
          {
            start: "07:00",
            end: "08:00",
            timezone: "UTC+1"
          },
          {
            start: "18:30",
            end: "19:30",
            timezone: "UTC+1"
          }
        ],
        frequency: "3 veces por semana"
      },
      duration: {
        total: parseInt(form.duration),
        breakdown: {
          warmup: Math.floor(parseInt(form.duration) * 0.15),
          mainContent: Math.floor(parseInt(form.duration) * 0.7),
          cooldown: Math.floor(parseInt(form.duration) * 0.15)
        },
        intervals: {
          work: "40 segundos",
          rest: "20 segundos",
          transition: "1 minuto"
        }
      },
      equipment: {
        perPerson: form.equipment.map(item => ({
          item,
          options: item === "Pesas" ? ["3kg", "5kg", "8kg"] : 
                  item === "Kettlebells" ? ["8kg", "12kg", "16kg"] : [],
          quantity: 1
        })),
        shared: [
          {
            item: "TRX",
            quantity: 8
          },
          {
            item: "Bandas elásticas",
            quantity: 15
          }
        ],
        optional: ["Foam roller", "Pelota de masaje"]
      },
      objectives: {
        primary: form.objectives.slice(0, 2).map(goal => ({
          goal,
          metrics: ["Progresión en ejercicios", "Mejora de técnica"]
        })),
        secondary: form.objectives.slice(2),
        expectations: {
          shortTerm: "Mejora de la técnica y resistencia",
          longTerm: "Incremento de fuerza y capacidad aeróbica"
        }
      },
      prerequisites: {
        fitness: [
          "Capacidad para realizar ejercicios básicos",
          "Sin lesiones actuales"
        ],
        health: {
          required: [
            "Certificado médico",
            "Formulario de salud completado"
          ],
          recommended: [
            "Experiencia previa en ejercicio",
            "Buena movilidad básica"
          ]
        }
      }
    };

    console.log('🚀 Datos del formulario:', form);
    console.log('📦 Payload generado:', payload);
    
    return payload;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('❌ Error: Token no encontrado');
        throw new Error('No se encontró el token de autenticación');
      }

      console.log('🔑 Token encontrado:', token.substring(0, 20) + '...');
      
      const payload = generateApiPayload();
      console.log('📤 Enviando solicitud a la API...');

      const response = await fetch('https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/chats/group-class', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        console.error('❌ Error en la respuesta:', response.status, response.statusText);
        throw new Error('Error al generar la clase grupal');
      }

      const data = await response.json();
      console.log('📥 Respuesta de la API:', data);

      const newSession: ClassSession = {
        id: Date.now().toString(),
        name: form.className,
        type: form.classType,
        level: form.level,
        capacity: parseInt(form.capacity),
        schedule: form.schedule,
        duration: form.duration,
        equipment: form.equipment,
        objectives: form.objectives,
      };

      setSessions(prev => [...prev, newSession]);
      setShowForm(false);
    } catch (error) {
      console.error('❌ Error:', error);
      // Aquí podrías mostrar un mensaje de error al usuario
    } finally {
      setIsLoading(false);
    }
  };

  const formatLocalSessionDetails = (session: ClassSession) => {
    return `# ${session.name} 🏋️‍♂️

## ✨ Detalles Básicos
${formatDetailItem('🎯', 'Tipo', session.type)}
${formatDetailItem('📊', 'Nivel', session.level)}
${formatDetailItem('👥', 'Capacidad', `${session.capacity} participantes`)}
${formatDetailItem('⏱️', 'Duración', session.duration)}
${formatDetailItem('🕒', 'Horario', session.schedule)}

## 🎒 Equipamiento Necesario
${session.equipment.map(eq => `• ${eq}`).join('\n')}

## 🎯 Objetivos
${session.objectives.map(obj => `• ${obj}`).join('\n')}

## 📝 Estructura de la Clase

### 1️⃣ Calentamiento (${Math.floor(parseInt(session.duration) * 0.15)} min)
• 🔄 Movilidad articular
• 💪 Activación muscular
• 🏃‍♂️ Ejercicios de preparación

### 2️⃣ Parte Principal (${Math.floor(parseInt(session.duration) * 0.7)} min)
• 🔥 Circuitos de alta intensidad
• 💪 Ejercicios funcionales
• 🔄 Trabajo por estaciones

### 3️⃣ Vuelta a la calma (${Math.floor(parseInt(session.duration) * 0.15)} min)
• 🧘‍♂️ Estiramientos
• 🫁 Ejercicios de respiración
• ⚡ Cool down

## ⚠️ Consideraciones Importantes
• 👥 Mantener ratio instructor/alumno adecuado
• 📈 Adaptar ejercicios según nivel
• 🎯 Monitorear intensidad y técnica

> 💡 **Nota**: Esta clase está diseñada para optimizar resultados mientras se mantiene la seguridad y el progreso de cada participante.`;
  };

  const formatDetailItem = (emoji: string, label: string, value: string) => {
    return `• ${emoji} **${label}:** ${value}`;
  };

  const formatSessionDetails = (sessionData: ClassSession | any) => {
    // Si los datos vienen de la API
    if (sessionData.classData && sessionData.classPlan) {
      try {
        const { classData, classPlan } = sessionData;
        return `# ${classData.className} 🏋️‍♂️

## 📋 Descripción de la Clase
> ${classPlan.classDescription}

## ✨ Detalles Básicos
${formatDetailItem('🎯', 'Tipo', `${classData.classType.primary}${classData.classType.secondary ? ` + ${classData.classType.secondary}` : ''}`)}
${formatDetailItem('📊', 'Formato', classData.classType.format)}
${formatDetailItem('🔥', 'Intensidad', classData.classType.intensity)}
${formatDetailItem('📈', 'Nivel', classData.level.recommended)}
${formatDetailItem('👥', 'Capacidad', `${classData.capacity.minimum}-${classData.capacity.maximum} participantes`)}
${formatDetailItem('⏱️', 'Duración', classData.duration.total)}

## ⏰ Horario
${formatDetailItem('📅', 'Días', classData.schedule.dayOfWeek.join(', '))}
${formatDetailItem('🕒', 'Hora', classData.schedule.timeSlot)}
${formatDetailItem('🔄', 'Frecuencia', classData.schedule.frequency)}

## 🎒 Equipamiento Necesario

### 👤 Por Participante:
${classData.equipment.perParticipant.map(eq => 
  `• ${eq.item} (${eq.quantity}x)
   ${eq.options ? `  ↳ Opciones: ${eq.options.join(', ')}` : ''}
   ${eq.resistance ? `  ↳ Resistencia: ${eq.resistance.join(', ')}` : ''}`
).join('\n')}

### 🤝 Compartido:
${classData.equipment.shared.map(eq => `• ${eq.item} (${eq.quantity}x)`).join('\n')}

### ✨ Opcional:
${classData.equipment.optional.map(item => `• ${item}`).join('\n')}

## 🎯 Objetivos

### 📍 Principales:
${classData.objectives.primary.map(obj => `• ${obj}`).join('\n')}

### 📌 Secundarios:
${classData.objectives.secondary.map(obj => `• ${obj}`).join('\n')}

### 📊 Métricas de Seguimiento:
${formatDetailItem('❤️', 'Cardiovascular', classData.objectives.metrics.cardiovascular)}
${formatDetailItem('💪', 'Fuerza', classData.objectives.metrics.strength)}
${formatDetailItem('🎯', 'Técnica', classData.objectives.metrics.technique)}

## 📝 Estructura de la Clase

### 1️⃣ Calentamiento (${classData.duration.breakdown.warmup})
${classPlan.sessionStructure['Warm-Up']}

### 2️⃣ Circuitos HIIT
${classPlan.sessionStructure['HIIT Circuits']}

### 3️⃣ Entrenamiento de Fuerza
${classPlan.sessionStructure['Strength Training']}

### 4️⃣ Vuelta a la Calma (${classData.duration.breakdown.cooldown})
${classPlan.sessionStructure['Cool Down']}

## 🔄 Variaciones de Ejercicios

### 📈 Progresiones:
> ${classPlan.exerciseVariations.Progresiones}

### 📉 Regresiones:
> ${classPlan.exerciseVariations.Regresiones}

## ⚠️ Medidas de Seguridad
${classPlan.safetyMeasures}

## 📊 Sistema de Evaluación
${classPlan.evaluationSystem}

## 👥 Gestión de Participantes
${classPlan.participantManagement}

## 📌 Plan de Implementación
${classPlan.implementationPlan}

---
> 💡 **Nota**: Esta clase ha sido diseñada siguiendo las mejores prácticas de entrenamiento y adaptada para maximizar resultados mientras se mantiene la seguridad de los participantes.`;
      } catch (error) {
        console.error('Error formateando los datos de la API:', error);
        return formatLocalSessionDetails(sessionData);
      }
    } else {
      // Si son datos locales
      return formatLocalSessionDetails(sessionData);
    }
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-black/40">
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 z-10"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="sticky top-0 z-10">
              <div className="p-4 rounded-t-2xl bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg">
                <h2 className="text-2xl font-bold mb-2">Gestor de Clases Grupales</h2>
                <p className="text-pink-100">Diseña y organiza sesiones efectivas</p>
              </div>
            </div>

            <div className="p-6">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600" />
                </div>
              ) : showForm ? (
                <form onSubmit={handleSubmit} className="space-y-6 p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Nombre de la Clase
                      </label>
                      <input
                        type="text"
                        value={form.className}
                        onChange={(e) => handleInputChange('className', e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder="Ej: Bootcamp Intensivo"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Tipo de Clase
                      </label>
                      <select
                        value={form.classType}
                        onChange={(e) => handleInputChange('classType', e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      >
                        <option value="">Seleccionar tipo</option>
                        {classTypes.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Nivel
                      </label>
                      <select
                        value={form.level}
                        onChange={(e) => handleInputChange('level', e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      >
                        <option value="">Seleccionar nivel</option>
                        {levelOptions.map((level) => (
                          <option key={level} value={level}>
                            {level}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Capacidad
                      </label>
                      <select
                        value={form.capacity}
                        onChange={(e) => handleInputChange('capacity', e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      >
                        <option value="">Seleccionar capacidad</option>
                        {capacityOptions.map((capacity) => (
                          <option key={capacity} value={capacity}>
                            {capacity} personas
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Horario
                      </label>
                      <input
                        type="time"
                        value={form.schedule}
                        onChange={(e) => handleInputChange('schedule', e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Duración
                      </label>
                      <select
                        value={form.duration}
                        onChange={(e) => handleInputChange('duration', e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      >
                        <option value="">Seleccionar duración</option>
                        {durationOptions.map((duration) => (
                          <option key={duration} value={duration}>
                            {duration}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Equipamiento Necesario
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {equipmentOptions.map((equipment) => (
                        <button
                          key={equipment}
                          type="button"
                          onClick={() => handleArrayToggle('equipment', equipment)}
                          className={`p-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                            form.equipment.includes(equipment)
                              ? 'bg-blue-500 text-white'
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                          }`}
                        >
                          {equipment}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Objetivos de la Clase
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {objectiveOptions.map((objective) => (
                        <button
                          key={objective}
                          type="button"
                          onClick={() => handleArrayToggle('objectives', objective)}
                          className={`p-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                            form.objectives.includes(objective)
                              ? 'bg-green-500 text-white'
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                          }`}
                        >
                          {objective}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end space-x-4 pt-6">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-6 py-2.5 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="px-6 py-2.5 rounded-lg bg-blue-500 text-white hover:bg-blue-600 focus:ring-4 focus:ring-blue-500/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <span className="flex items-center space-x-2">
                          <motion.span
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          >
                            <Activity className="w-4 h-4" />
                          </motion.span>
                          <span>Guardando...</span>
                        </span>
                      ) : (
                        'Guardar Clase'
                      )}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="prose dark:prose-invert max-w-none">
                  <div className="mb-4 p-4 rounded-lg bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300 flex items-center">
                    <Check className="w-5 h-5 mr-2" />
                    ¡Clase creada exitosamente!
                  </div>
                  <div className="mt-4 space-y-6">
                    {sessions.map((session) => {
                      const details = formatSessionDetails(session);
                      return details.split('\n').map((line, index) => {
                        if (!line.trim()) return null;
                        
                        if (line.startsWith('###')) {
                          return (
                            <h3 key={index} className="text-xl font-bold text-gray-900 dark:text-white mt-6 mb-4">
                              {line.replace(/^### /, '')}
                            </h3>
                          );
                        }
                        
                        if (line.startsWith('####')) {
                          return (
                            <h4 key={index} className="text-lg font-semibold text-gray-800 dark:text-gray-200 mt-4 mb-2">
                              {line.replace(/^#### /, '')}
                            </h4>
                          );
                        }
                        
                        if (line.startsWith('!')) {
                          return (
                            <div key={index} className="flex items-start p-3 bg-pink-50 dark:bg-pink-900/30 rounded-lg my-2">
                              <AlertCircle className="w-5 h-5 text-pink-500 mr-2 flex-shrink-0 mt-0.5" />
                              <p className="text-pink-700 dark:text-pink-300 m-0">
                                {line.replace(/^! /, '')}
                              </p>
                            </div>
                          );
                        }
                        
                        if (line.startsWith('-')) {
                          return (
                            <div key={index} className="flex items-start my-1">
                              <span className="text-pink-500 mr-2">•</span>
                              <p className="text-gray-600 dark:text-gray-300 m-0">
                                {line.replace(/^- /, '')}
                              </p>
                            </div>
                          );
                        }
                        
                        if (line.match(/^\d\./)) {
                          return (
                            <div key={index} className="ml-4 my-2">
                              <p className="text-gray-700 dark:text-gray-300 m-0 font-medium">
                                {line}
                              </p>
                            </div>
                          );
                        }
                        
                        return (
                          <p key={index} className="text-gray-600 dark:text-gray-300 my-1">
                            {line}
                          </p>
                        );
                      });
                    })}
                  </div>
                  <div className="mt-6 flex justify-between sticky bottom-0 bg-white dark:bg-gray-800 pt-4 border-t dark:border-gray-700">
                    <button
                      onClick={() => setShowForm(true)}
                      className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-all duration-200"
                    >
                      Nueva clase
                    </button>
                    <button
                      onClick={onClose}
                      className="px-6 py-2.5 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-lg hover:from-pink-600 hover:to-rose-600 transition-all duration-200 shadow-md hover:shadow-lg"
                    >
                      Cerrar
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default GroupClassesManager;
