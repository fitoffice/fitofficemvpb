import React, { useState } from 'react';
import { Trophy, X, Target, Calendar, Award, Flag, User, Brain, Dumbbell, CheckCircle, AlertTriangle, Heart } from 'lucide-react';

interface ChallengesCreatorProps {
  isVisible: boolean;
  onClose: () => void;
}

interface ChallengeResponse {
  challengeDetails: any;
  challengePlan: any;
  status: string;
  timestamp: string;
  version: string;
}

interface ChallengeForm {
  challengeName: string;
  challengeDescription: string;
  objectives: string[];
  duration: string;
  difficultyLevel: string;
  category: string;
  targetAudience: {
    fitnessLevel: string;
    ageRange: string;
    requirements: string;
  };
  rewards: string[];
  prerequisites: string[];
  successCriteria: string[];
  limitations: string[];
  motivationLevel: number;
}

const ChallengesCreator: React.FC<ChallengesCreatorProps> = ({ isVisible, onClose }) => {
  const [form, setForm] = useState<ChallengeForm>({
    challengeName: '',
    challengeDescription: '',
    objectives: [],
    duration: '',
    difficultyLevel: '',
    category: '',
    targetAudience: {
      fitnessLevel: 'Principiante-Intermedio',
      ageRange: '25-45 años',
      requirements: 'Acceso a gimnasio o equipamiento básico en casa'
    },
    rewards: [],
    prerequisites: [],
    successCriteria: [],
    limitations: [],
    motivationLevel: 8
  });

  const [isLoading, setIsLoading] = useState(false);
  const [challengeResponse, setChallengeResponse] = useState<ChallengeResponse | null>(null);

  const durationOptions = ['7 días', '14 días', '30 días', '60 días', 'Personalizado'];
  const difficultyOptions = ['Principiante', 'Intermedio', 'Avanzado'];
  const categoryOptions = ['Fuerza', 'Resistencia', 'Flexibilidad', 'Nutrición', 'Mentalidad'];
  const audienceOptions = [
    'Deportistas',
    'Personas que buscan perder peso',
    'Entrenadores personales',
    'Usuarios con experiencia previa'
  ];
  const rewardOptions = [
    'Certificado de finalización',
    'Descuentos en productos/servicios',
    'Acceso a contenido exclusivo',
    'Puntos de recompensa'
  ];
  const prerequisiteOptions = [
    'Nivel mínimo de fuerza',
    'Acceso a un gimnasio',
    'Equipamiento específico',
    'Evaluación médica previa'
  ];
  const successOptions = [
    'Completar todas las sesiones',
    'Lograr los objetivos establecidos',
    'Mantener una rutina diaria',
    'Mejorar métricas específicas'
  ];
  const limitationOptions = [
    'Tiempo limitado para entrenar',
    'Lesiones previas',
    'Presupuesto restringido',
    'Equipamiento limitado'
  ];

  const handleInputChange = (field: keyof ChallengeForm, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayToggle = (field: keyof ChallengeForm, value: string) => {
    if (Array.isArray(form[field])) {
      setForm(prev => ({
        ...prev,
        [field]: (prev[field] as string[]).includes(value)
          ? (prev[field] as string[]).filter(item => item !== value)
          : [...(prev[field] as string[]), value]
      }));
    }
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

      const challengePayload = {
        challengeName: form.challengeName || 'Reto 30 días Transformación Total',
        challengeDescription: form.challengeDescription || 'Un reto integral que combina entrenamiento de fuerza, cardio y nutrición para una transformación completa en 30 días',
        objectives: form.objectives.length ? form.objectives : [
          'Perder 3-4% de grasa corporal',
          'Aumentar resistencia cardiovascular',
          'Establecer hábitos saludables sostenibles',
          'Mejorar fuerza general'
        ],
        duration: form.duration || '30 días',
        difficultyLevel: form.difficultyLevel || 'Intermedio',
        category: form.category || 'Transformación corporal',
        targetAudience: {
          fitnessLevel: form.targetAudience.fitnessLevel,
          ageRange: form.targetAudience.ageRange,
          requirements: form.targetAudience.requirements
        },
        rewards: form.rewards.length ? form.rewards : [
          'Certificado de finalización',
          'Insignia digital de logro',
          'Descuento en el siguiente programa',
          'Sesión de evaluación gratuita'
        ],
        prerequisites: form.prerequisites.length ? form.prerequisites : [
          'Evaluación médica básica',
          'Equipamiento mínimo: mancuernas, esterilla',
          'Disponibilidad de 45-60 minutos diarios',
          'Acceso a báscula y cinta métrica'
        ],
        successCriteria: form.successCriteria.length ? form.successCriteria : [
          'Completar al menos 90% de los entrenamientos',
          'Registrar medidas semanalmente',
          'Seguir el plan nutricional propuesto',
          'Participar en el grupo de apoyo'
        ],
        limitations: form.limitations.length ? form.limitations : [
          'No apto para embarazadas',
          'No recomendado para personas con lesiones recientes',
          'Requiere compromiso de tiempo diario',
          'Necesita acceso a equipamiento básico'
        ],
        motivationLevel: form.motivationLevel
      };

      console.log('Sending challenge payload:', challengePayload);

      const response = await fetch('https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/chats/challenge-creator', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(challengePayload)
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        throw new Error('Error al crear el reto');
      }

      const data = await response.json();
      console.log('Response data:', data);
      setChallengeResponse(data);
    } catch (error) {
      console.error('Error:', error);
      alert('Hubo un error al crear el reto. Por favor, intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto transform transition-all duration-300 ease-in-out">
        {challengeResponse ? (
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Reto Creado Exitosamente</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors duration-200"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="bg-orange-50 dark:bg-gray-700 p-4 rounded-lg">
                <h3 className="text-xl font-semibold mb-3">Detalles del Reto</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="font-semibold">Nombre:</p>
                    <p>{challengeResponse.challengeDetails.challengeName}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Categoría:</p>
                    <p>{challengeResponse.challengeDetails.category}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Descripción:</p>
                    <p>{challengeResponse.challengeDetails.challengeDescription}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Nivel de Dificultad:</p>
                    <p>{challengeResponse.challengeDetails.difficultyLevel}</p>
                  </div>
                </div>
              </div>

              <div className="bg-amber-50 dark:bg-gray-700 p-4 rounded-lg">
                <h3 className="text-xl font-semibold mb-3">Plan del Reto</h3>
                <div className="space-y-4">
                  <div>
                    <p className="font-semibold">Plan Diario:</p>
                    {Object.entries(challengeResponse.challengePlan.dailyPlan).map(([day, activity]) => (
                      <div key={day} className="ml-4 mb-2">
                        <p className="font-medium text-orange-600 dark:text-orange-400">{day}:</p>
                        <p className="text-gray-700 dark:text-gray-300">{activity as string}</p>
                      </div>
                    ))}
                  </div>

                  <div>
                    <p className="font-semibold text-orange-600 dark:text-orange-400 mb-2">Plan de Contingencia:</p>
                    <p className="text-gray-700 dark:text-gray-300">{challengeResponse.challengePlan.contingencyPlan}</p>
                  </div>

                  <div>
                    <p className="font-semibold text-orange-600 dark:text-orange-400 mb-2">Análisis de Viabilidad:</p>
                    <p className="text-gray-700 dark:text-gray-300">{challengeResponse.challengePlan.feasibilityAnalysis}</p>
                  </div>

                  <div>
                    <p className="font-semibold text-orange-600 dark:text-orange-400 mb-2">Modificaciones Posibles:</p>
                    <p className="text-gray-700 dark:text-gray-300">{challengeResponse.challengePlan.modifications}</p>
                  </div>

                  <div>
                    <p className="font-semibold text-orange-600 dark:text-orange-400 mb-2">Tips de Motivación:</p>
                    <p className="text-gray-700 dark:text-gray-300">{challengeResponse.challengePlan.motivationTips}</p>
                  </div>

                  <div>
                    <p className="font-semibold text-orange-600 dark:text-orange-400 mb-2">Recomendaciones de Seguridad:</p>
                    <p className="text-gray-700 dark:text-gray-300">{challengeResponse.challengePlan.safetyRecommendations}</p>
                  </div>

                  <div>
                    <p className="font-semibold text-orange-600 dark:text-orange-400 mb-2">Estrategias de Seguimiento:</p>
                    <p className="text-gray-700 dark:text-gray-300">{challengeResponse.challengePlan.trackingStrategies}</p>
                  </div>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
              >
                Cerrar
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="sticky top-0 z-10 bg-white dark:bg-gray-800">
              <div className="p-6 bg-gradient-to-r from-orange-500 to-amber-500 rounded-t-2xl">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <Trophy className="w-8 h-8 text-white animate-pulse" />
                    <div>
                      <h2 className="text-2xl font-bold text-white">Creador de Retos</h2>
                      <p className="text-amber-100 mt-1">Diseña retos motivadores y personalizados</p>
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
                  <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
                  <p className="text-gray-600 dark:text-gray-400 animate-pulse">Creando tu reto...</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Información Básica */}
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                      <Trophy className="w-5 h-5 text-amber-500" />
                      Información Básica
                    </h3>
                    
                    {/* Nombre del Reto */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Nombre del Reto
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={form.challengeName}
                          onChange={(e) => handleInputChange('challengeName', e.target.value)}
                          className="w-full px-4 py-3 pl-10 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200"
                          placeholder="Ej: Desafío de 30 Días de Fuerza"
                        />
                        <Flag className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                      </div>
                    </div>

                    {/* Descripción */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Descripción del Reto
                      </label>
                      <textarea
                        value={form.challengeDescription}
                        onChange={(e) => handleInputChange('challengeDescription', e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200"
                        rows={3}
                        placeholder="Describe el propósito y objetivos generales del reto"
                      />
                    </div>

                    {/* Duración */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Duración del Reto
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {durationOptions.map(duration => (
                          <button
                            key={duration}
                            type="button"
                            onClick={() => handleInputChange('duration', duration)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                              form.duration === duration
                                ? 'bg-amber-500 text-white shadow-lg'
                                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                            }`}
                          >
                            <Calendar className="w-4 h-4" />
                            {duration}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Objetivos */}
                  <div className="space-y-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Objetivos del Reto
                    </label>
                    <div className="flex flex-wrap gap-2">
                      <input
                        type="text"
                        placeholder="Añadir objetivo y presionar Enter"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            const value = e.currentTarget.value.trim();
                            if (value) {
                              handleInputChange('objectives', [...form.objectives, value]);
                              e.currentTarget.value = '';
                            }
                          }
                        }}
                        className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {form.objectives.map((objective) => (
                        <span
                          key={objective}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300"
                        >
                          {objective}
                          <button
                            type="button"
                            onClick={() => handleInputChange('objectives', form.objectives.filter(obj => obj !== objective))}
                            className="ml-2 hover:text-amber-900 dark:hover:text-amber-100"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Configuración del Reto */}
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                      <Target className="w-5 h-5 text-amber-500" />
                      Configuración del Reto
                    </h3>

                    {/* Nivel de Dificultad */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Nivel de Dificultad
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {difficultyOptions.map(difficulty => (
                          <button
                            key={difficulty}
                            type="button"
                            onClick={() => handleInputChange('difficultyLevel', difficulty)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                              form.difficultyLevel === difficulty
                                ? 'bg-amber-500 text-white shadow-lg'
                                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                            }`}
                          >
                            <Dumbbell className="w-4 h-4" />
                            {difficulty}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Categoría */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Categoría del Reto
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {categoryOptions.map(category => (
                          <button
                            key={category}
                            type="button"
                            onClick={() => handleInputChange('category', category)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                              form.category === category
                                ? 'bg-amber-500 text-white shadow-lg'
                                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                            }`}
                          >
                            <Heart className="w-4 h-4" />
                            {category}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Audiencia Objetivo */}
                    <div className="space-y-4">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Nivel de Aptitud Física
                      </label>
                      <select
                        value={form.targetAudience.fitnessLevel}
                        onChange={(e) => handleInputChange('targetAudience', { ...form.targetAudience, fitnessLevel: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200"
                      >
                        <option value="">Seleccionar nivel</option>
                        <option value="Principiante">Principiante</option>
                        <option value="Principiante-Intermedio">Principiante-Intermedio</option>
                        <option value="Intermedio">Intermedio</option>
                        <option value="Intermedio-Avanzado">Intermedio-Avanzado</option>
                        <option value="Avanzado">Avanzado</option>
                      </select>

                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Rango de Edad
                      </label>
                      <select
                        value={form.targetAudience.ageRange}
                        onChange={(e) => handleInputChange('targetAudience', { ...form.targetAudience, ageRange: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200"
                      >
                        <option value="">Seleccionar rango de edad</option>
                        <option value="18-24 años">18-24 años</option>
                        <option value="25-45 años">25-45 años</option>
                        <option value="46-60 años">46-60 años</option>
                        <option value="60+ años">60+ años</option>
                      </select>

                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Requisitos
                      </label>
                      <textarea
                        value={form.targetAudience.requirements}
                        onChange={(e) => handleInputChange('targetAudience', { ...form.targetAudience, requirements: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200"
                        rows={3}
                        placeholder="Describe los requisitos necesarios para participar en el reto"
                      />
                    </div>
                  </div>

                  {/* Requisitos y Criterios */}
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-amber-500" />
                      Requisitos y Criterios
                    </h3>

                    {/* Requisitos Previos */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Requisitos Previos
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {prerequisiteOptions.map(prerequisite => (
                          <button
                            key={prerequisite}
                            type="button"
                            onClick={() => handleArrayToggle('prerequisites', prerequisite)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                              form.prerequisites.includes(prerequisite)
                                ? 'bg-amber-500 text-white shadow-lg'
                                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                            }`}
                          >
                            <CheckCircle className="w-4 h-4" />
                            {prerequisite}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Criterios de Éxito */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Criterios de Éxito
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {successOptions.map(criteria => (
                          <button
                            key={criteria}
                            type="button"
                            onClick={() => handleArrayToggle('successCriteria', criteria)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                              form.successCriteria.includes(criteria)
                                ? 'bg-amber-500 text-white shadow-lg'
                                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                            }`}
                          >
                            <Flag className="w-4 h-4" />
                            {criteria}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Limitaciones */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Limitaciones o Restricciones
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {limitationOptions.map(limitation => (
                          <button
                            key={limitation}
                            type="button"
                            onClick={() => handleArrayToggle('limitations', limitation)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                              form.limitations.includes(limitation)
                                ? 'bg-amber-500 text-white shadow-lg'
                                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                            }`}
                          >
                            <AlertTriangle className="w-4 h-4" />
                            {limitation}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Motivación y Recompensas */}
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                      <Brain className="w-5 h-5 text-amber-500" />
                      Motivación y Recompensas
                    </h3>

                    {/* Nivel de Motivación */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Nivel de Motivación Requerido (1-10)
                      </label>
                      <div className="flex items-center gap-4">
                        <input
                          type="range"
                          min="1"
                          max="10"
                          value={form.motivationLevel}
                          onChange={(e) => handleInputChange('motivationLevel', parseInt(e.target.value))}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                        />
                        <span className="text-lg font-medium text-amber-500">{form.motivationLevel}</span>
                      </div>
                    </div>

                    {/* Recompensas */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Recompensas
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {rewardOptions.map(reward => (
                          <button
                            key={reward}
                            type="button"
                            onClick={() => handleArrayToggle('rewards', reward)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                              form.rewards.includes(reward)
                                ? 'bg-amber-500 text-white shadow-lg'
                                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                            }`}
                          >
                            <Award className="w-4 h-4" />
                            {reward}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 px-6 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <Trophy className="w-5 h-5" />
                    Crear Reto
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChallengesCreator;
