import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Target, AlertCircle, Check } from 'lucide-react';

interface InjuryDiagnosisAnalyzerProps {
  isVisible: boolean;
  onClose: () => void;
}

interface InjuryForm {
  location: string;
  painLevel: number;
  symptoms: string[];
  duration: string;
  activities: string[];
  previousInjuries: string;
}

const initialForm: InjuryForm = {
  location: '',
  painLevel: 0,
  symptoms: [],
  duration: '',
  activities: [],
  previousInjuries: ''
};

const bodyParts = [
  'Hombro', 'Codo', 'Muñeca', 'Cadera', 'Rodilla', 'Tobillo',
  'Espalda alta', 'Espalda baja', 'Cuello', 'Otro'
];

const symptomsList = [
  'Dolor agudo', 'Dolor sordo', 'Inflamación', 'Rigidez',
  'Debilidad', 'Entumecimiento', 'Chasquidos', 'Inestabilidad'
];

const durationOptions = [
  'Menos de una semana',
  '1-2 semanas',
  '2-4 semanas',
  'Más de un mes'
];

const activityOptions = [
  'Correr', 'Levantar pesas', 'Deportes de equipo',
  'Natación', 'Yoga/Pilates', 'Entrenamiento funcional'
];

export const InjuryDiagnosisAnalyzer: React.FC<InjuryDiagnosisAnalyzerProps> = ({ isVisible, onClose }) => {
  const [form, setForm] = useState<InjuryForm>(initialForm);
  const [isLoading, setIsLoading] = useState(false);
  const [diagnosis, setDiagnosis] = useState<string>('');
  const [showForm, setShowForm] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No se encontró el token de autenticación');
      }

      const response = await fetch('https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/chat/injury-diagnosis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          timestamp: new Date().toISOString(),
          injuryData: form
        })
      });

      if (!response.ok) {
        throw new Error('Error al generar el diagnóstico');
      }

      const data = await response.json();
      if (data.diagnosis) {
        setDiagnosis(data.diagnosis);
        setShowForm(false);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (
    field: keyof InjuryForm,
    value: string | number | string[]
  ) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayToggle = (field: 'symptoms' | 'activities', value: string) => {
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
            <div className="p-4 rounded-t-lg bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg">
              <h2 className="text-2xl font-bold mb-2">Diagnóstico de Lesiones</h2>
              <p className="text-red-100">Analiza y adapta tus entrenamientos según lesiones</p>
            </div>
          </div>

          <div className="p-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600" />
              </div>
            ) : showForm ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Ubicación de la lesión */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Ubicación de la lesión
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {bodyParts.map(part => (
                      <button
                        key={part}
                        type="button"
                        onClick={() => handleInputChange('location', part)}
                        className={`p-2 rounded-lg text-sm transition-colors ${
                          form.location === part
                            ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                            : 'bg-gray-50 text-gray-700 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                        }`}
                      >
                        {part}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Nivel de dolor */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Nivel de dolor (0-10)
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    value={form.painLevel}
                    onChange={(e) => handleInputChange('painLevel', parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                  />
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                    <span>Sin dolor</span>
                    <span>Dolor severo</span>
                  </div>
                </div>

                {/* Síntomas */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Síntomas (selecciona todos los que apliquen)
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {symptomsList.map(symptom => (
                      <button
                        key={symptom}
                        type="button"
                        onClick={() => handleArrayToggle('symptoms', symptom)}
                        className={`p-2 rounded-lg text-sm transition-colors ${
                          form.symptoms.includes(symptom)
                            ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                            : 'bg-gray-50 text-gray-700 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                        }`}
                      >
                        {symptom}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Duración */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Duración de los síntomas
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {durationOptions.map(option => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => handleInputChange('duration', option)}
                        className={`p-2 rounded-lg text-sm transition-colors ${
                          form.duration === option
                            ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                            : 'bg-gray-50 text-gray-700 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Actividades */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Actividades que provocan dolor
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {activityOptions.map(activity => (
                      <button
                        key={activity}
                        type="button"
                        onClick={() => handleArrayToggle('activities', activity)}
                        className={`p-2 rounded-lg text-sm transition-colors ${
                          form.activities.includes(activity)
                            ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                            : 'bg-gray-50 text-gray-700 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                        }`}
                      >
                        {activity}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Lesiones previas */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Lesiones previas en la misma zona
                  </label>
                  <textarea
                    value={form.previousInjuries}
                    onChange={(e) => handleInputChange('previousInjuries', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    rows={3}
                    placeholder="Describe cualquier lesión previa..."
                  />
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
                    className="px-6 py-2 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-lg hover:from-red-600 hover:to-orange-600 transition-all duration-300 shadow-md hover:shadow-lg flex items-center space-x-2"
                  >
                    <Target className="w-4 h-4" />
                    <span>Analizar</span>
                  </button>
                </div>
              </form>
            ) : (
              <div className="prose dark:prose-invert max-w-none">
                <div className="mb-4 p-4 rounded-lg bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300 flex items-center">
                  <Check className="w-5 h-5 mr-2" />
                  ¡Diagnóstico generado exitosamente!
                </div>
                <div className="mt-4 max-h-[60vh] overflow-y-auto pr-4 custom-scrollbar">
                  <div className="space-y-6">
                    {diagnosis.split('###').map((section, index) => {
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
                              
                              if (trimmedLine.startsWith('!')) {
                                return (
                                  <div key={lineIndex} className="flex items-start p-3 bg-red-50 dark:bg-red-900/30 rounded-lg">
                                    <AlertCircle className="w-5 h-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                                    <p className="text-red-700 dark:text-red-300">
                                      {trimmedLine.replace(/^!\s*/, '')}
                                    </p>
                                  </div>
                                );
                              }
                              
                              if (trimmedLine.startsWith('-')) {
                                return (
                                  <div key={lineIndex} className="flex items-start">
                                    <span className="text-red-500 mr-2">•</span>
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
                </div>
                <div className="mt-6 flex justify-between sticky bottom-0 bg-white dark:bg-gray-800 pt-4 border-t dark:border-gray-700">
                  <button
                    onClick={() => setShowForm(true)}
                    className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-all duration-300"
                  >
                    Nuevo diagnóstico
                  </button>
                  <button
                    onClick={onClose}
                    className="px-6 py-2.5 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-lg hover:from-red-600 hover:to-orange-600 transition-all duration-300 shadow-md hover:shadow-lg"
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

export default InjuryDiagnosisAnalyzer;
