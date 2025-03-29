import React, { useState } from 'react';
import { Wand2, Hash, RefreshCw, Sparkles } from 'lucide-react';

interface AIContentAnalyzerProps {
  file: File;
  onAnalysisComplete: (analysis: {
    description: string;
    hashtags: string[];
    platformSpecificContent: {
      [key: string]: {
        text: string;
        hashtags: string[];
      };
    };
  }) => void;
}

const AIContentAnalyzer: React.FC<AIContentAnalyzerProps> = ({ file, onAnalysisComplete }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentStep, setCurrentStep] = useState<string>('');

  const analyzeContent = async () => {
    setIsAnalyzing(true);
    
    try {
      // Simular análisis de IA con timeouts
      setCurrentStep('Analizando contenido visual...');
      await new Promise(resolve => setTimeout(resolve, 1500));

      setCurrentStep('Generando descripción...');
      await new Promise(resolve => setTimeout(resolve, 1000));

      setCurrentStep('Optimizando hashtags...');
      await new Promise(resolve => setTimeout(resolve, 1000));

      setCurrentStep('Adaptando contenido por plataforma...');
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Aquí iría la llamada real a la API de IA
      const mockAnalysis = {
        description: "Una imagen vibrante que muestra el último entrenamiento fitness con técnicas innovadoras",
        hashtags: ["#FitnessLife", "#EntrenamientoPersonal", "#SaludYBienestar", "#FitOffice", "#VidasSaludable"],
        platformSpecificContent: {
          instagram: {
            text: "💪 ¡Nuevo entrenamiento disponible! Descubre cómo mejorar tu técnica y resultados 🎯",
            hashtags: ["#Fitness", "#GymLife", "#Training"]
          },
          facebook: {
            text: "Presentamos nuestro nuevo programa de entrenamiento personalizado. ¡Alcanza tus objetivos con nosotros!",
            hashtags: ["#FitnessMotivation", "#HealthyLifestyle"]
          },
          twitter: {
            text: "¡Nuevo #entrenamiento! Optimiza tus resultados con nuestra guía experta 💪",
            hashtags: ["#Fitness", "#Training"]
          }
        }
      };

      onAnalysisComplete(mockAnalysis);
    } catch (error) {
      console.error('Error en el análisis:', error);
    } finally {
      setIsAnalyzing(false);
      setCurrentStep('');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold flex items-center gap-2">
          <Wand2 className="w-5 h-5 text-purple-500" />
          Asistente de IA
        </h3>
        <button
          onClick={analyzeContent}
          disabled={isAnalyzing}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all duration-200 disabled:opacity-50"
        >
          {isAnalyzing ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              Analizando...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Analizar Contenido
            </>
          )}
        </button>
      </div>

      {isAnalyzing && (
        <div className="space-y-2">
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-purple-500 to-blue-500 animate-pulse rounded-full" 
                 style={{ width: '60%' }}></div>
          </div>
          <p className="text-sm text-gray-600">{currentStep}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Wand2 className="w-4 h-4 text-purple-500" />
            <h4 className="font-medium">Descripción Sugerida</h4>
          </div>
          <p className="text-sm text-gray-600">La IA generará una descripción optimizada basada en el contenido visual.</p>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Hash className="w-4 h-4 text-blue-500" />
            <h4 className="font-medium">Hashtags Optimizados</h4>
          </div>
          <p className="text-sm text-gray-600">Sugerencias de hashtags relevantes y tendencias actuales.</p>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-indigo-500" />
            <h4 className="font-medium">Adaptación por Plataforma</h4>
          </div>
          <p className="text-sm text-gray-600">Contenido optimizado para cada red social.</p>
        </div>
      </div>
    </div>
  );
};

export default AIContentAnalyzer;
