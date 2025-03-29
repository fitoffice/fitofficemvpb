import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, AlertCircle, ArrowRight, ArrowLeft, FileText, Target, Clock, Share2 } from 'lucide-react';
import '../../styles/scrollbar.css';

interface ContentStrategyProps {
  onClose: () => void;
  isVisible: boolean;
}

interface Step {
  id: number;
  question: string;
  options: string[];
  answer: string[];
  multiSelect: boolean;
  required: boolean;
  icon: React.ReactNode;
}

interface StatusMessage {
  type: 'success' | 'error' | null;
  message: string;
}

const initialSteps: Step[] = [
  {
    id: 1,
    question: "¿Cuál es el principal objetivo de tu estrategia de contenidos?",
    options: [
      "Aumentar la visibilidad de mi marca",
      "Generar leads y captar nuevos clientes",
      "Retener y fidelizar a mis clientes actuales",
      "Educar a mi audiencia sobre fitness y bienestar"
    ],
    answer: [],
    multiSelect: false,
    required: true,
    icon: <Target className="w-5 h-5 text-blue-500" />
  },
  {
    id: 2,
    question: "¿Qué tipos de contenido prefieres crear?",
    options: [
      "Artículos de blog",
      "Videos instructivos",
      "Infografías",
      "Publicaciones en redes sociales",
      "Testimonios de clientes"
    ],
    answer: [],
    multiSelect: true,
    required: true,
    icon: <FileText className="w-5 h-5 text-blue-500" />
  },
  {
    id: 3,
    question: "¿Con qué frecuencia planeas publicar contenido?",
    options: [
      "Diariamente",
      "Varias veces a la semana",
      "Semanalmente",
      "Mensualmente"
    ],
    answer: [],
    multiSelect: false,
    required: true,
    icon: <Clock className="w-5 h-5 text-blue-500" />
  },
  {
    id: 4,
    question: "¿Qué plataformas de distribución utilizas principalmente?",
    options: [
      "Instagram",
      "YouTube",
      "Facebook",
      "Blog propio",
      "Email marketing"
    ],
    answer: [],
    multiSelect: true,
    required: true,
    icon: <Share2 className="w-5 h-5 text-blue-500" />
  }
];

export const ContentStrategy: React.FC<ContentStrategyProps> = ({ onClose, isVisible }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [stepsData, setStepsData] = useState<Step[]>(initialSteps);
  const [generatedContent, setGeneratedContent] = useState<string>('');
  const [statusMessage, setStatusMessage] = useState<StatusMessage>({ type: null, message: '' });

  const formatMarkdown = (content: string) => {
    // Remove all hash symbols and dashes that are not part of headers
    content = content.replace(/---\s###/g, '');
    content = content.replace(/####/g, '');
    content = content.replace(/(?<!#)###(?!#)/g, '');
    content = content.replace(/(?<!#)##(?!#)/g, '');
    content = content.replace(/(?<!#)#(?!#)/g, '');
    
    // Format main title with animated gradient background
    content = content.replace(/^([^#\n].+?)(?=\n)/s, '<div class="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white rounded-xl p-8 mb-8 shadow-lg transform hover:scale-[1.02] transition-all duration-300 group"><div class="absolute inset-0 bg-gradient-to-r from-blue-600/50 via-purple-600/50 to-pink-600/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div><h1 class="text-4xl font-bold relative z-10 text-center">$1</h1><div class="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300"></div></div>');
    
    // Format section titles with animated left border and gradient
    content = content.replace(/Objetivo de la Estrategia[^\n]+/g, '<div class="relative overflow-hidden"><h2 class="text-2xl font-semibold mt-8 mb-6 pl-6 border-l-4 border-purple-500 bg-gradient-to-r from-purple-50 to-transparent py-4 rounded-r-lg transform hover:translate-x-2 transition-transform duration-300 hover:shadow-md"><span class="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">Objetivo de la Estrategia</span></h2></div>');
    content = content.replace(/Tipos de Contenido[^\n]+/g, '<div class="relative overflow-hidden"><h2 class="text-2xl font-semibold mt-8 mb-6 pl-6 border-l-4 border-blue-500 bg-gradient-to-r from-blue-50 to-transparent py-4 rounded-r-lg transform hover:translate-x-2 transition-transform duration-300 hover:shadow-md"><span class="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">Tipos de Contenido Preferidos</span></h2></div>');
    content = content.replace(/Frecuencia de Publicación[^\n]+/g, '<div class="relative overflow-hidden"><h2 class="text-2xl font-semibold mt-8 mb-6 pl-6 border-l-4 border-green-500 bg-gradient-to-r from-green-50 to-transparent py-4 rounded-r-lg transform hover:translate-x-2 transition-transform duration-300 hover:shadow-md"><span class="bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-teal-600">Frecuencia de Publicación</span></h2></div>');
    content = content.replace(/Plataformas de Distribución[^\n]+/g, '<div class="relative overflow-hidden"><h2 class="text-2xl font-semibold mt-8 mb-6 pl-6 border-l-4 border-indigo-500 bg-gradient-to-r from-indigo-50 to-transparent py-4 rounded-r-lg transform hover:translate-x-2 transition-transform duration-300 hover:shadow-md"><span class="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-600">Plataformas de Distribución</span></h2></div>');
    
    // Format subsection titles with animated icons
    content = content.replace(/Artículos de Blog/g, '<h3 class="text-xl font-medium mt-8 mb-6 flex items-center p-4 bg-gradient-to-r from-blue-50 to-transparent rounded-lg transform hover:translate-x-2 transition-all duration-300 hover:shadow-md group"><svg class="w-8 h-8 mr-3 text-blue-600 transform group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 20 20"><path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z"></path></svg><span class="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 font-bold">Artículos de Blog</span></h3>');
    content = content.replace(/Videos de Ejercicios/g, '<h3 class="text-xl font-medium mt-8 mb-6 flex items-center p-4 bg-gradient-to-r from-red-50 to-transparent rounded-lg transform hover:translate-x-2 transition-all duration-300 hover:shadow-md group"><svg class="w-8 h-8 mr-3 text-red-600 transform group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 20 20"><path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z"></path></svg><span class="bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-pink-600 font-bold">Videos de Ejercicios</span></h3>');
    content = content.replace(/Consejos de Nutrición/g, '<h3 class="text-xl font-medium mt-8 mb-6 flex items-center p-4 bg-gradient-to-r from-green-50 to-transparent rounded-lg transform hover:translate-x-2 transition-all duration-300 hover:shadow-md group"><svg class="w-8 h-8 mr-3 text-green-600 transform group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 20 20"><path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"></path></svg><span class="bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-emerald-600 font-bold">Consejos de Nutrición</span></h3>');
    content = content.replace(/Testimonios de Clientes/g, '<h3 class="text-xl font-medium mt-8 mb-6 flex items-center p-4 bg-gradient-to-r from-yellow-50 to-transparent rounded-lg transform hover:translate-x-2 transition-all duration-300 hover:shadow-md group"><svg class="w-8 h-8 mr-3 text-yellow-600 transform group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg><span class="bg-clip-text text-transparent bg-gradient-to-r from-yellow-600 to-amber-600 font-bold">Testimonios de Clientes</span></h3>');
    
    // Format numbered lists with animated gradient badges and cards
    content = content.replace(/(\d+)\.\s"([^"]+)"/g, '<div class="flex items-start mb-6 group hover:bg-gradient-to-r hover:from-gray-50 hover:to-transparent p-4 rounded-xl transition-all duration-300 hover:shadow-lg transform hover:translate-x-2"><div class="flex-shrink-0"><span class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold mr-4 group-hover:scale-110 transition-transform duration-300 shadow-md group-hover:shadow-lg">$1</span></div><div class="flex-1 bg-white p-4 rounded-lg shadow-sm group-hover:shadow-md transition-shadow"><span class="text-gray-700 text-lg font-medium">$2</span></div></div>');
    
    // Format regular numbered lists with the same style
    content = content.replace(/(\d+)\.\s([^\n"]+)/g, '<div class="flex items-start mb-6 group hover:bg-gradient-to-r hover:from-gray-50 hover:to-transparent p-4 rounded-xl transition-all duration-300 hover:shadow-lg transform hover:translate-x-2"><div class="flex-shrink-0"><span class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold mr-4 group-hover:scale-110 transition-transform duration-300 shadow-md group-hover:shadow-lg">$1</span></div><div class="flex-1 bg-white p-4 rounded-lg shadow-sm group-hover:shadow-md transition-shadow"><span class="text-gray-700 text-lg font-medium">$2</span></div></div>');
    
    // Format bullet points with animated gradient dots
    content = content.replace(/\s-\s([^\n]+)/g, '<div class="flex items-center mb-4 group hover:bg-gradient-to-r hover:from-gray-50 hover:to-transparent p-3 rounded-lg transition-all duration-300 hover:shadow-md transform hover:translate-x-2"><span class="w-4 h-4 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 mr-4 group-hover:scale-125 transition-transform duration-300 shadow-sm group-hover:shadow-md"></span><span class="text-gray-700 text-lg">$1</span></div>');
    
    // Add glass-morphism effect to sections
    content = content.replace(/(Principal -[^\n]+)/g, '<div class="relative overflow-hidden bg-gradient-to-r from-white/40 to-white/20 backdrop-blur-sm p-6 mb-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border border-white/20"><div class="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div><div class="relative z-10">$1</div></div>');
    
    // Wrap content in a container with animated gradient border
    content = '<div class="relative p-0.5 rounded-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 shadow-xl hover:shadow-2xl transition-shadow duration-300"><div class="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 opacity-30 rounded-2xl animate-pulse"></div><div class="relative bg-white rounded-2xl p-8">' + content + '</div></div>';
    
    return content;
  };

  const generateContentStrategy = async () => {
    setIsLoading(true);
    setStatusMessage({ type: null, message: '' });
    try {
      const token = localStorage.getItem('token');
      console.log('Token retrieved from localStorage:', token ? 'Token exists' : 'No token found');
      
      if (!token) {
        throw new Error('No se encontró el token de autenticación');
      }

      // Extract answers from steps data
      const objective = stepsData[0].answer[0] || "Aumentar visibilidad y captación de clientes online";
      const contentTypes = stepsData[1].answer.length > 0 ? stepsData[1].answer : ["Artículos de blog", "Videos instructivos"];
      const frequency = stepsData[2].answer[0] || "Semanalmente";
      const platforms = stepsData[3].answer.length > 0 ? stepsData[3].answer : ["Instagram", "Facebook"];

      // Create payload with the user's actual selections
      const contentStrategyPayload = {
        contentStrategy: {
          objective: objective,
          contentTypes: contentTypes,
          frequency: frequency,
          platforms: platforms
        }
      };

      console.log('Sending content strategy payload:', contentStrategyPayload);

      const response = await fetch('https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/chats/content-strategy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(contentStrategyPayload)
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Error response:', errorData);
        throw new Error(errorData.error || 'Error al generar el plan de contenido');
      }

      const data = await response.json();
      console.log('Response data:', data);
      
      // Check if data.contentPlan exists
      if (!data.contentPlan) {
        console.error('No content plan in response:', data);
        throw new Error('La respuesta no contiene un plan de contenido');
      }
      
      // If contentPlan is an object, convert it to a string for formatting
      const contentPlanStr = typeof data.contentPlan === 'object' 
        ? JSON.stringify(data.contentPlan, null, 2) 
        : data.contentPlan;
      
      const formattedContent = formatMarkdown(contentPlanStr);
      setGeneratedContent(formattedContent);
      setCurrentStep(stepsData.length);
      setStatusMessage({
        type: 'success',
        message: 'Plan de contenido generado exitosamente'
      });
    } catch (error) {
      console.error('Error:', error);
      setStatusMessage({
        type: 'error',
        message: 'Hubo un error al generar el plan. Por favor, intenta de nuevo.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = () => {
    if (currentStep === stepsData.length - 1) {
      generateContentStrategy();
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
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
          generateContentStrategy();
        } else {
          setCurrentStep(prev => prev + 1);
        }
      }, 300);
    }
  };

  const isOptionSelected = (option: string) => {
    return stepsData[currentStep]?.answer.includes(option);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-2xl p-8 max-w-6xl w-[98%] max-h-[95vh] overflow-y-auto relative border border-gray-200/30"
      >
        {/* Header */}
        <div className="relative mb-6">
          <div className="absolute top-0 right-0">
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors duration-200 p-2 hover:bg-gray-100 rounded-full"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Estrategia de Contenido
          </h2>
          <p className="text-gray-600 mt-2">Define tu estrategia paso a paso</p>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-gray-100 h-2 rounded-full mb-8">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${((currentStep + 1) / stepsData.length) * 100}%` }}
          />
        </div>

        {/* Content */}
        <div className="space-y-6">
          {currentStep < stepsData.length ? (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                {stepsData[currentStep].icon}
                <h3 className="text-xl font-semibold text-gray-800">
                  {stepsData[currentStep].question}
                </h3>
              </div>
              <div className="grid gap-3">
                {stepsData[currentStep].options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleOptionSelect(option)}
                    className={`p-4 rounded-lg text-left transition-all duration-200 ${
                      stepsData[currentStep].answer.includes(option)
                        ? 'bg-blue-50 border-2 border-blue-500 text-blue-700 shadow-sm'
                        : 'bg-gray-50 border-2 border-gray-200 text-gray-700 hover:bg-gray-100 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{option}</span>
                      {stepsData[currentStep].answer.includes(option) && (
                        <Check className="w-5 h-5 text-blue-500" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="prose max-w-none">
                {generatedContent ? (
                  <div className="whitespace-pre-wrap">{generatedContent}</div>
                ) : (
                  <div className="flex items-center justify-center p-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <button
            onClick={handleBack}
            disabled={currentStep === 0}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all duration-200 ${
              currentStep === 0
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <ArrowLeft className="w-5 h-5" />
            Anterior
          </button>
          <button
            onClick={handleNext}
            disabled={isLoading}
            className="flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {currentStep < stepsData.length - 1 ? (
              <>
                Siguiente
                <ArrowRight className="w-5 h-5" />
              </>
            ) : (
              <>
                Generar Estrategia
                {isLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                ) : (
                  <FileText className="w-5 h-5" />
                )}
              </>
            )}
          </button>
        </div>

        {/* Status Message */}
        {statusMessage.type && (
          <div
            className={`mt-4 p-4 rounded-lg flex items-center gap-2 ${
              statusMessage.type === 'success'
                ? 'bg-green-50 text-green-700'
                : 'bg-red-50 text-red-700'
            }`}
          >
            {statusMessage.type === 'success' ? (
              <Check className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            {statusMessage.message}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ContentStrategy;
