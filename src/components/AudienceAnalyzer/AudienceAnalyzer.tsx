import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';
import { Save, Loader2, Users, X, AlertCircle, ChevronRight } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import AudienceAnalyzerResponse from './AudienceAnalyzerResponse';

interface AudienceAnalyzerProps {
  onClose: () => void;
}

interface Question {
  id: number;
  question: string;
  defaultAnswer: string;
  answer: string;
}

interface AudienceData {
  targetGender: string;
  primaryInterest: string;
  specificInterests: string[];
  activeHours: string[];
  painPoints: string[];
  goals: string[];
  communicationStyle: string;
}

const AudienceAnalyzer: React.FC<AudienceAnalyzerProps> = ({ onClose }) => {
  const { theme } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: 1,
      question: "¿Cuál es la distribución demográfica de tu audiencia?",
      defaultAnswer: "60% mujeres, 40% hombres, principalmente 25-45 años",
      answer: ""
    },
    {
      id: 2,
      question: "¿Cuáles son los principales intereses de tu audiencia en redes sociales?",
      defaultAnswer: "Fitness, nutrición saludable, bienestar mental, lifestyle",
      answer: ""
    },
    {
      id: 3,
      question: "¿En qué horarios tu audiencia está más activa en redes sociales?",
      defaultAnswer: "Mañanas (7-9am) y noches (8-11pm)",
      answer: ""
    },
    {
      id: 4,
      question: "¿Qué tipo de contenido genera mayor engagement?",
      defaultAnswer: "Videos cortos de ejercicios, antes/después, consejos rápidos",
      answer: ""
    },
    {
      id: 5,
      question: "¿Cuáles son las principales preocupaciones o pain points de tu audiencia?",
      defaultAnswer: "Falta de tiempo, resultados lentos, motivación inconsistente",
      answer: ""
    },
    {
      id: 6,
      question: "¿Qué nivel de conocimiento tiene tu audiencia sobre fitness?",
      defaultAnswer: "Principiante a intermedio, buscan guía profesional",
      answer: ""
    },
    {
      id: 7,
      question: "¿Qué presupuesto promedio destina tu audiencia al fitness?",
      defaultAnswer: "50-150€ mensuales en servicios fitness y suplementos",
      answer: ""
    },
    {
      id: 8,
      question: "¿Qué objetivos de transformación busca tu audiencia?",
      defaultAnswer: "Pérdida de peso, tonificación, hábitos saludables",
      answer: ""
    },
    {
      id: 9,
      question: "¿Qué tipo de formato de contenido prefiere tu audiencia?",
      defaultAnswer: "Reels/Stories (40%), Posts (30%), Lives (20%), Carruseles (10%)",
      answer: ""
    },
    {
      id: 10,
      question: "¿Qué competidores siguen tus seguidores?",
      defaultAnswer: "Otros entrenadores personales, influencers fitness, marcas deportivas",
      answer: ""
    }
  ]);

  const [hoveredQuestion, setHoveredQuestion] = useState<number | null>(null);

  const handleAnswerChange = (id: number, value: string) => {
    setQuestions(questions.map(q => 
      q.id === id ? { ...q, answer: value } : q
    ));
  };

  const handleSave = () => {
    // Aquí puedes implementar la lógica para guardar las respuestas
    console.log('Análisis de audiencia guardado:', questions);
    onClose();
  };

  const progressPercentage = (questions.filter(q => q.answer.trim() !== '').length / questions.length) * 100;

  const generateApiPayload = (formData: AudienceData) => {
    console.log('🎯 Generando payload para análisis de audiencia...');
    console.log('📝 Datos del formulario:', formData);
    
    // Valores por defecto para evitar undefined
    const defaultFormData = {
      targetGender: formData?.targetGender || 'Todos',
      primaryInterest: formData?.primaryInterest || 'Fitness',
      specificInterests: formData?.specificInterests || ['Entrenamiento general'],
      activeHours: formData?.activeHours || ['09:00', '18:00'],
      painPoints: formData?.painPoints || ['Falta de tiempo'],
      goals: formData?.goals || ['Mejorar salud general'],
      communicationStyle: formData?.communicationStyle || 'Profesional'
    };
    
    const payload = {
      distributionDemographic: `Distribución por género: ${defaultFormData.targetGender}, principalmente entre 25-44 años, ubicados en zonas urbanas (65%) y suburbanas (25%), con educación universitaria (60%)`,
      interests: [
        defaultFormData.primaryInterest,
        ...defaultFormData.specificInterests,
        "Bienestar",
        "Desarrollo personal"
      ],
      activeHours: "Mayor actividad entre semana: 6-8am y 7-10pm. Fines de semana: 8-11am y 8-11pm. Zona horaria: UTC+1",
      contentEngagement: [
        "Videos cortos de ejercicios",
        "Tutoriales paso a paso",
        "Contenido motivacional",
        "Consejos prácticos"
      ],
      painPoints: [
        ...defaultFormData.painPoints,
        "Falta de motivación",
        "Dificultad para mantener consistencia"
      ],
      knowledgeLevel: "Intermedio",
      budget: "50-150€ mensuales",
      transformationGoals: [
        ...defaultFormData.goals,
        "Mejorar condición física",
        "Desarrollar hábitos saludables"
      ],
      contentFormat: {
        "video": "45%",
        "imagen": "30%",
        "texto": "15%",
        "audio": "10%"
      },
      competitors: [
        "Entrenadores personales locales",
        "Influencers fitness",
        "Apps de fitness"
      ]
    };

    console.log('📦 Payload generado:', payload);
    return payload;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No se encontró el token de autenticación');
      }

      const formData = {
        targetGender: questions[0].answer,
        primaryInterest: questions[1].answer,
        specificInterests: questions[2].answer.split(',').map(s => s.trim()),
        activeHours: questions[3].answer.split(',').map(s => s.trim()),
        painPoints: questions[4].answer.split(',').map(s => s.trim()),
        goals: questions[7].answer.split(',').map(s => s.trim()),
        communicationStyle: questions[8].answer
      };

      const payload = generateApiPayload(formData);
      console.log('🚀 Enviando análisis a la API:', payload);

      const response = await fetch('https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/chats/audience-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        console.error('❌ Error en la respuesta:', {
          status: response.status,
          statusText: response.statusText
        });
        throw new Error(`Error en la API: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Respuesta exitosa del análisis:', {
        status: response.status,
        data: data
      });

      setAnalysis(data);
      setIsLoading(false);
      setIsSuccess(true);
    } catch (error) {
      console.error('❌ Error en el análisis:', {
        error: error,
        message: (error as Error).message,
        stack: (error as Error).stack
      });
      setError((error as Error).message);
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${
        theme === 'dark' ? 'bg-black/50' : 'bg-gray-500/50'
      }`}
    >
      <div className={`relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-xl ${
        theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
      }`}>
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-inherit">
          <div className="flex items-center space-x-3">
            <Users className="w-8 h-8 text-blue-500" />
            <div>
              <h2 className="text-2xl font-bold">Análisis Detallado de Audiencia</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Completa el análisis para entender mejor a tu audiencia
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Progress bar */}
        <div className="sticky top-[88px] z-10 px-6 py-2 bg-inherit border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Progreso del análisis
            </span>
            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
              {Math.round(progressPercentage)}%
            </span>
          </div>
          <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-600 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Questions */}
        <div className="p-6 space-y-6">
          {!isSuccess ? (
            questions.map((q) => (
              <motion.div 
                key={q.id}
                initial={false}
                animate={{ 
                  scale: hoveredQuestion === q.id ? 1.01 : 1,
                  backgroundColor: hoveredQuestion === q.id 
                    ? theme === 'dark' ? 'rgb(31, 41, 55)' : 'rgb(249, 250, 251)'
                    : 'transparent'
                }}
                onHoverStart={() => setHoveredQuestion(q.id)}
                onHoverEnd={() => setHoveredQuestion(null)}
                className="p-4 rounded-xl space-y-2 transition-colors"
              >
                <div className="flex items-start space-x-2">
                  <ChevronRight className={`w-5 h-5 mt-1 transition-colors ${
                    hoveredQuestion === q.id ? 'text-blue-500' : 'text-gray-400'
                  }`} />
                  <div className="flex-1">
                    <label className="block text-lg font-medium mb-2">
                      {q.question}
                    </label>
                    <textarea
                      value={q.answer}
                      onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                      placeholder={q.defaultAnswer}
                      className={`w-full p-4 rounded-lg border transition-all ${
                        theme === 'dark'
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                      } focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400`}
                      rows={3}
                    />
                    {!q.answer && (
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 italic">
                        <AlertCircle className="inline-block w-4 h-4 mr-1" />
                        Sugerencia: {q.defaultAnswer}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <AudienceAnalyzerResponse data={analysis} />
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 flex justify-end gap-4 p-6 border-t border-gray-200 dark:border-gray-700 bg-inherit">
          <button
            onClick={onClose}
            className={`px-6 py-2.5 rounded-lg font-medium transition-colors ${
              theme === 'dark'
                ? 'bg-gray-700 hover:bg-gray-600 text-gray-200'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading || progressPercentage < 100}
            className={`px-6 py-2.5 text-white rounded-lg font-medium transition-colors flex items-center space-x-2 ${
              isLoading || progressPercentage < 100
                ? 'bg-blue-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Analizando...</span>
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                <span>Analizar</span>
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default AudienceAnalyzer;
