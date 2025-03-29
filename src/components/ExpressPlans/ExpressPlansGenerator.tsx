import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Zap, Check } from 'lucide-react';

interface ExpressPlansGeneratorProps {
  isVisible: boolean;
  onClose: () => void;
}

interface Step {
  id: number;
  question: string;
  options: string[];
  answer: string[];
  multiSelect: boolean;
  required: boolean;
}

const initialSteps: Step[] = [
  {
    id: 1,
    question: "¿Cuál es tu objetivo principal de entrenamiento?",
    options: [
      "Pérdida de peso",
      "Ganancia muscular",
      "Mejora de resistencia",
      "Tonificación general"
    ],
    answer: [],
    multiSelect: false,
    required: true
  },
  {
    id: 2,
    question: "¿Cuánto tiempo puedes dedicar a cada sesión?",
    options: [
      "15-20 minutos",
      "30-45 minutos",
      "45-60 minutos",
      "Más de 60 minutos"
    ],
    answer: [],
    multiSelect: false,
    required: true
  },
  {
    id: 3,
    question: "¿Qué equipamiento tienes disponible?",
    options: [
      "Solo peso corporal",
      "Pesas y mancuernas",
      "Bandas elásticas",
      "Equipo completo de gimnasio",
      "TRX/Suspensión"
    ],
    answer: [],
    multiSelect: true,
    required: true
  },
  {
    id: 4,
    question: "¿Cuál es tu nivel de experiencia?",
    options: [
      "Principiante",
      "Intermedio",
      "Avanzado"
    ],
    answer: [],
    multiSelect: false,
    required: true
  }
];

export const ExpressPlansGenerator: React.FC<ExpressPlansGeneratorProps> = ({ onClose, isVisible }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [stepsData, setStepsData] = useState<Step[]>(initialSteps);
  const [generatedContent, setGeneratedContent] = useState<string>('');
  const [showQuestionnaire, setShowQuestionnaire] = useState(true);

  const generatePlan = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No se encontró el token de autenticación');
      }

      const payload = {
        timestamp: new Date().toISOString(),
        trainingPlan: {
          objective: stepsData[0].answer[0],
          duration: stepsData[1].answer[0],
          equipment: stepsData[2].answer,
          level: stepsData[3].answer[0]
        }
      };

      const response = await fetch('https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/chat/express-plans', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error('Error al generar el plan de entrenamiento');
      }

      const data = await response.json();
      if (data.trainingPlan) {
        setGeneratedContent(data.trainingPlan);
        setShowQuestionnaire(false);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = () => {
    if (currentStep === stepsData.length - 1) {
      generatePlan();
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (!showQuestionnaire) {
      setShowQuestionnaire(true);
      return;
    }
    setCurrentStep(prev => Math.max(0, prev - 1));
  };

  const handleOptionSelect = (option: string) => {
    const currentStepData = stepsData[currentStep];
    let newAnswer: string[];

    if (currentStepData.multiSelect) {
      newAnswer = currentStepData.answer.includes(option)
        ? currentStepData.answer.filter(a => a !== option)
        : [...currentStepData.answer, option];
    } else {
      newAnswer = [option];
    }

    const updatedSteps = stepsData.map((step, index) =>
      index === currentStep ? { ...step, answer: newAnswer } : step
    );
    setStepsData(updatedSteps);

    if (!currentStepData.multiSelect) {
      setTimeout(() => {
        if (currentStep === stepsData.length - 1) {
          generatePlan();
        } else {
          setCurrentStep(prev => prev + 1);
        }
      }, 300);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="h-full flex items-center justify-center p-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="mb-6 p-4 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg">
          <h2 className="text-2xl font-bold mb-2">Generador de Planes Exprés</h2>
          <p className="text-green-100">Crea tu plan de entrenamiento personalizado</p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600" />
          </div>
        ) : showQuestionnaire ? (
          <>
            <div className="mb-6">
              <div className="mt-2 h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                <div
                  className="h-full bg-green-600 rounded-full transition-all duration-300"
                  style={{ width: `${((currentStep + 1) / stepsData.length) * 100}%` }}
                />
              </div>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Paso {currentStep + 1} de {stepsData.length}
              </p>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                {stepsData[currentStep].question}
              </h3>
              <div className="space-y-2">
                {stepsData[currentStep].options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleOptionSelect(option)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                      stepsData[currentStep].answer.includes(option)
                        ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-between">
              <button
                onClick={handleBack}
                disabled={currentStep === 0}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  currentStep === 0
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                Anterior
              </button>
              {stepsData[currentStep].multiSelect && (
                <button
                  onClick={handleNext}
                  className="flex items-center px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700"
                >
                  {currentStep === stepsData.length - 1 ? 'Generar Plan' : 'Siguiente'}
                  <Zap className="w-4 h-4 ml-2" />
                </button>
              )}
            </div>
          </>
        ) : (
          <div className="prose dark:prose-invert max-w-none">
            <div className="mb-4 p-4 rounded-lg bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 flex items-center">
              <Check className="w-5 h-5 mr-2" />
              ¡Plan de entrenamiento generado exitosamente!
            </div>
            <div className="mt-4 max-h-[60vh] overflow-y-auto pr-4 custom-scrollbar">
              <div className="space-y-6">
                {generatedContent.split('###').map((section, index) => {
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
                                <span className="text-green-500 mr-2">•</span>
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
                onClick={handleBack}
                className="px-6 py-2.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-300 shadow-md hover:shadow-lg flex items-center space-x-2"
              >
                <X className="w-4 h-4" />
                <span>Cerrar</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpressPlansGenerator;
