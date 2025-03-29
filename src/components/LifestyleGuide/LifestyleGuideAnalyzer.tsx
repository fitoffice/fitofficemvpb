import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, TreeDeciduous, Check, Clock, Sun, Moon } from 'lucide-react';

interface LifestyleGuideAnalyzerProps {
  isVisible: boolean;
  onClose: () => void;
}

interface LifestyleForm {
  wakeUpTime: string;
  bedTime: string;
  mealsPerDay: number;
  workSchedule: string;
  stressLevel: number;
  exerciseFrequency: string;
  goals: string[];
  challenges: string[];
}

const initialForm: LifestyleForm = {
  wakeUpTime: '',
  bedTime: '',
  mealsPerDay: 3,
  workSchedule: '',
  stressLevel: 5,
  exerciseFrequency: '',
  goals: [],
  challenges: []
};

const workScheduleOptions = [
  'Horario flexible',
  'Mañanas (6-14h)',
  'Tardes (14-22h)',
  'Noches (22-6h)',
  'Horario partido',
  'Fines de semana'
];

const exerciseFrequencyOptions = [
  '1-2 veces por semana',
  '3-4 veces por semana',
  '5+ veces por semana',
  'Ocasionalmente',
  'Nunca'
];

const goalOptions = [
  'Mejorar calidad del sueño',
  'Aumentar energía diaria',
  'Reducir estrés',
  'Mejorar alimentación',
  'Aumentar actividad física',
  'Mejor balance vida-trabajo'
];

const challengeOptions = [
  'Falta de tiempo',
  'Estrés laboral',
  'Horarios irregulares',
  'Malos hábitos alimenticios',
  'Falta de motivación',
  'Problemas de sueño'
];

export const LifestyleGuideAnalyzer: React.FC<LifestyleGuideAnalyzerProps> = ({ isVisible, onClose }) => {
  const [form, setForm] = useState<LifestyleForm>(initialForm);
  const [isLoading, setIsLoading] = useState(false);
  const [guide, setGuide] = useState<string>('');
  const [showForm, setShowForm] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No se encontró el token de autenticación');
      }

      const response = await fetch('https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/chat/lifestyle-guide', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          timestamp: new Date().toISOString(),
          lifestyleData: form
        })
      });

      if (!response.ok) {
        throw new Error('Error al generar la guía de estilo de vida');
      }

      const data = await response.json();
      if (data.guide) {
        setGuide(data.guide);
        setShowForm(false);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (
    field: keyof LifestyleForm,
    value: string | number | string[]
  ) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayToggle = (field: 'goals' | 'challenges', value: string) => {
    setForm(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }));
  };

  if (!isVisible) return null;

  return (
    <div className="h-full w-full overflow-y-auto custom-scrollbar">
      <div className="p-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 z-10"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="sticky top-0 z-10">
            <div className="p-4 rounded-t-lg bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-lg">
              <h2 className="text-2xl font-bold mb-2">Guía de Estilo de Vida</h2>
              <p className="text-teal-100">Optimiza tus hábitos diarios para mejor rendimiento</p>
            </div>
          </div>

          <div className="p-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600" />
              </div>
            ) : showForm ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Horarios de sueño */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <div className="flex items-center">
                        <Sun className="w-4 h-4 mr-2" />
                        Hora de despertar
                      </div>
                    </label>
                    <input
                      type="time"
                      value={form.wakeUpTime}
                      onChange={(e) => handleInputChange('wakeUpTime', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <div className="flex items-center">
                        <Moon className="w-4 h-4 mr-2" />
                        Hora de dormir
                      </div>
                    </label>
                    <input
                      type="time"
                      value={form.bedTime}
                      onChange={(e) => handleInputChange('bedTime', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>

                {/* Comidas por día */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Número de comidas al día
                  </label>
                  <input
                    type="range"
                    min="2"
                    max="6"
                    value={form.mealsPerDay}
                    onChange={(e) => handleInputChange('mealsPerDay', parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                  />
                  <div className="text-center text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {form.mealsPerDay} comidas
                  </div>
                </div>

                {/* Horario de trabajo */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2" />
                      Horario de trabajo
                    </div>
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {workScheduleOptions.map(option => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => handleInputChange('workSchedule', option)}
                        className={`p-2 rounded-lg text-sm transition-colors ${
                          form.workSchedule === option
                            ? 'bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-300'
                            : 'bg-gray-50 text-gray-700 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Nivel de estrés */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Nivel de estrés (1-10)
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={form.stressLevel}
                    onChange={(e) => handleInputChange('stressLevel', parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                  />
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                    <span>Bajo</span>
                    <span>Alto</span>
                  </div>
                </div>

                {/* Frecuencia de ejercicio */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Frecuencia de ejercicio
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {exerciseFrequencyOptions.map(option => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => handleInputChange('exerciseFrequency', option)}
                        className={`p-2 rounded-lg text-sm transition-colors ${
                          form.exerciseFrequency === option
                            ? 'bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-300'
                            : 'bg-gray-50 text-gray-700 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Objetivos */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Objetivos (selecciona todos los que apliquen)
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {goalOptions.map(goal => (
                      <button
                        key={goal}
                        type="button"
                        onClick={() => handleArrayToggle('goals', goal)}
                        className={`p-2 rounded-lg text-sm transition-colors ${
                          form.goals.includes(goal)
                            ? 'bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-300'
                            : 'bg-gray-50 text-gray-700 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                        }`}
                      >
                        {goal}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Desafíos */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Desafíos actuales
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {challengeOptions.map(challenge => (
                      <button
                        key={challenge}
                        type="button"
                        onClick={() => handleArrayToggle('challenges', challenge)}
                        className={`p-2 rounded-lg text-sm transition-colors ${
                          form.challenges.includes(challenge)
                            ? 'bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-300'
                            : 'bg-gray-50 text-gray-700 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                        }`}
                      >
                        {challenge}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-lg hover:from-teal-600 hover:to-cyan-600 transition-all duration-300 shadow-md hover:shadow-lg flex items-center space-x-2"
                  >
                    <TreeDeciduous className="w-4 h-4" />
                    <span>Generar Guía</span>
                  </button>
                </div>
              </form>
            ) : (
              <div className="prose dark:prose-invert max-w-none">
                <div className="mb-4 p-4 rounded-lg bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-300 flex items-center">
                  <Check className="w-5 h-5 mr-2" />
                  ¡Guía de estilo de vida generada exitosamente!
                </div>
                <div className="mt-4 space-y-6">
                  {guide.split('###').map((section, index) => {
                    if (!section.trim()) return null;
                    
                    const [title, ...content] = section.split('\n');
                    return (
                      <div key={index} className="bg-white dark:bg-gray-700 rounded-lg p-6 shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                          {title.trim().replace(/^#+\s*/, '')}
                        </h3>
                        <div className="space-y-2">
                          {content.map((line, lineIndex) => {
                            const trimmedLine = line.trim();
                            if (!trimmedLine) return null;
                            
                            if (trimmedLine.startsWith('-')) {
                              return (
                                <div key={lineIndex} className="flex items-start">
                                  <span className="text-teal-500 mr-2">•</span>
                                  <p className="text-gray-600 dark:text-gray-300">
                                    {trimmedLine.replace(/^-\s*/, '')}
                                  </p>
                                </div>
                              );
                            }
                            
                            return (
                              <p key={lineIndex} className="text-gray-600 dark:text-gray-300">
                                {trimmedLine}
                              </p>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-6 flex justify-between sticky bottom-0 bg-white dark:bg-gray-800 pt-4 border-t dark:border-gray-700">
                  <button
                    onClick={() => setShowForm(true)}
                    className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-all duration-300"
                  >
                    Nueva guía
                  </button>
                  <button
                    onClick={onClose}
                    className="px-6 py-2.5 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-lg hover:from-teal-600 hover:to-cyan-600 transition-all duration-300 shadow-md hover:shadow-lg"
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LifestyleGuideAnalyzer;
