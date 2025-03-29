import React, { useState, useEffect } from 'react';
import { Lightbulb, Sparkles, TrendingUp, Target } from 'lucide-react';
import Button from '../Common/Button';
import { PulseLoader } from 'react-spinners';

interface PostIdea {
  title: string;
  description: string;
  hashtags: string;
  contentType: string;
}

interface IdeaGenerationPanelProps {
  onGenerateIdeas: (keywords: string, context?: string) => Promise<void>;
  onSelectIdea: (idea: PostIdea) => void;
  ideas: PostIdea[];
  isLoading: boolean;
  loadingIdeaIndex: number | null;
  theme: 'dark' | 'light';
}

// Example ideas for inspiration
const exampleIdeas: PostIdea[] = [
  {
    title: "5 Ejercicios para fortalecer tu core en casa",
    description: "Una rutina rápida de 15 minutos para fortalecer los músculos abdominales y lumbares sin necesidad de equipamiento.",
    hashtags: "#fitness #entrenamiento #ejerciciosencasa #core #abdominales",
    contentType: "Tutorial de ejercicios"
  },
  {
    title: "La importancia de la hidratación durante el entrenamiento",
    description: "Descubre por qué mantenerse hidratado es crucial para el rendimiento y la recuperación muscular.",
    hashtags: "#hidratación #fitness #saluddeportiva #rendimiento #nutricióndeportiva",
    contentType: "Artículo informativo"
  },
  {
    title: "Transforma tu cuerpo en 30 días: Reto de consistencia",
    description: "Un plan de 30 días para crear el hábito del ejercicio diario y ver resultados reales en tu condición física.",
    hashtags: "#reto30dias #transformación #hábitos #disciplina #fitness",
    contentType: "Reto fitness"
  }
];

const IdeaGenerationPanel: React.FC<IdeaGenerationPanelProps> = ({
  onGenerateIdeas,
  onSelectIdea,
  ideas,
  isLoading,
  loadingIdeaIndex,
  theme
}) => {
  const [keywords, setKeywords] = useState('');
  const [context, setContext] = useState('');
  const [isGenerateClicked, setIsGenerateClicked] = useState(false);
  const [showExamples, setShowExamples] = useState(true);

  // Hide examples when real ideas are loaded
  useEffect(() => {
    if (ideas.length > 0) {
      setShowExamples(false);
    }
  }, [ideas]);

  const handleGenerateClick = () => {
    if (!keywords.trim()) return;
    
    setIsGenerateClicked(true);
    onGenerateIdeas(keywords, context).finally(() => {
      setTimeout(() => setIsGenerateClicked(false), 1000);
    });
  };

  const handleKeywordSuggestionClick = (suggestion: string) => {
    setKeywords(suggestion);
  };

  return (
    <div className={`p-6 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
      <div className="flex items-center gap-3 mb-6">
        <div className={`p-2 rounded-full ${theme === 'dark' ? 'bg-purple-900' : 'bg-purple-100'}`}>
          <Lightbulb size={24} className="text-purple-500" />
        </div>
        <h2 className="text-2xl font-bold">Generate Post Ideas</h2>
      </div>
      
      <div className="space-y-6">
        <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700/50' : 'bg-purple-50'} border-l-4 border-purple-500`}>
          <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
            Ingresa palabras clave relacionadas con fitness, nutrición o bienestar para generar ideas de posts atractivas para tus redes sociales.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 flex items-center gap-2">
            <Target size={16} className="text-purple-500" />
            Palabras clave o temas
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              placeholder="ej: entrenamiento, nutrición, yoga, cardio"
              className={`flex-1 p-3 rounded-lg ${
                theme === 'dark'
                  ? 'bg-gray-700 text-white'
                  : 'bg-gray-50 text-gray-900'
              } focus:ring-2 focus:ring-purple-500 outline-none border ${theme === 'dark' ? 'border-gray-600' : 'border-gray-300'}`}
            />
            <Button
              onClick={handleGenerateClick}
              disabled={isLoading || !keywords.trim()}
              className={`px-4 flex items-center justify-center gap-2 transition-all duration-200 ${
                isGenerateClicked ? 'scale-95 bg-opacity-90' : ''
              }`}
              variant="primary"
            >
              {isLoading ? (
                <PulseLoader color="#ffffff" size={8} />
              ) : (
                <>
                  <Sparkles size={16} />
                  Generar Ideas
                </>
              )}
            </Button>
          </div>

          {/* Keyword suggestions */}
          <div className="mt-2 flex flex-wrap gap-2">
            {['entrenamiento de fuerza', 'nutrición deportiva', 'yoga para principiantes', 'cardio HIIT'].map(suggestion => (
              <button
                key={suggestion}
                onClick={() => handleKeywordSuggestionClick(suggestion)}
                className={`text-xs px-3 py-1 rounded-full ${
                  theme === 'dark' 
                    ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2 flex items-center gap-2">
            <TrendingUp size={16} className="text-purple-500" />
            Contexto adicional (opcional)
          </label>
          <textarea
            value={context}
            onChange={(e) => setContext(e.target.value)}
            placeholder="Añade detalles sobre tu audiencia, tono de marca o metas específicas"
            className={`w-full p-3 rounded-lg resize-none ${
              theme === 'dark'
                ? 'bg-gray-700 text-white border-gray-600'
                : 'bg-gray-50 text-gray-900 border-gray-300'
            } focus:ring-2 focus:ring-purple-500 outline-none border`}
            rows={4}
          />
        </div>
      </div>

      {/* Show example ideas when no real ideas are available */}
      {showExamples && !isLoading && (
        <div className="mt-8">
          <div className="flex items-center gap-2 mb-4">
            <h3 className="text-lg font-medium">Ideas de ejemplo</h3>
            <span className={`text-xs px-2 py-1 rounded-full ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}>
              Para inspiración
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {exampleIdeas.map((idea, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border transition-all ${
                  theme === 'dark' 
                    ? 'bg-gray-700/50 hover:bg-gray-700 border-gray-600' 
                    : 'bg-white hover:bg-gray-50 border-gray-200'
                } shadow-sm hover:shadow relative`}
              >
                <div className={`absolute top-3 right-3 text-xs px-2 py-1 rounded-full ${
                  theme === 'dark' ? 'bg-gray-600 text-gray-300' : 'bg-gray-100 text-gray-600'
                }`}>
                  {idea.contentType}
                </div>
                <h4 className="text-lg font-semibold mb-2 pr-20">{idea.title}</h4>
                <p className={`text-sm mb-3 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                  {idea.description}
                </p>
                <div className="mb-3">
                  <p className={`text-xs ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`}>
                    {idea.hashtags}
                  </p>
                </div>
                <Button
                  onClick={() => onSelectIdea(idea)}
                  className="w-full"
                  variant="secondary"
                >
                  Seleccionar esta idea
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Real generated ideas */}
      {ideas.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-medium mb-4">Ideas generadas para ti</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ideas.map((idea, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  theme === 'dark' 
                    ? 'bg-gray-700/50 hover:bg-gray-700 border-gray-600' 
                    : 'bg-white hover:bg-gray-50 border-gray-200'
                } shadow-sm hover:shadow-md relative`}
                onClick={() => onSelectIdea(idea)}
              >
                {loadingIdeaIndex === index && (
                  <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center rounded-lg z-10">
                    <PulseLoader color={theme === 'dark' ? '#ffffff' : '#000000'} size={8} />
                  </div>
                )}
                {idea.contentType && (
                  <div className={`absolute top-3 right-3 text-xs px-2 py-1 rounded-full ${
                    theme === 'dark' ? 'bg-gray-600 text-gray-300' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {idea.contentType}
                  </div>
                )}
                <h4 className="text-lg font-semibold mb-2 pr-20">{idea.title || 'Sin título'}</h4>
                {idea.description && (
                  <p className={`text-sm mb-3 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                    {idea.description}
                  </p>
                )}
                {idea.hashtags && (
                  <div className="mb-3">
                    <p className={`text-xs ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`}>
                      {idea.hashtags}
                    </p>
                  </div>
                )}
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectIdea(idea);
                  }}
                  className="w-full"
                  variant="secondary"
                >
                  Seleccionar esta idea
                </Button>
              </div>
            ))}
          </div>
          
          <div className="mt-6 flex justify-center">
            <Button
              onClick={() => handleGenerateClick()}
              disabled={isLoading}
              variant="outline"
              className="flex items-center gap-2"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 12H20M12 4V20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Generar más ideas
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default IdeaGenerationPanel;