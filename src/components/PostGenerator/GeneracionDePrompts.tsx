import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { ChevronDown, ChevronUp, Wand2 } from 'lucide-react';

interface GeneracionDePromptsProps {
  onPromptSelect: (prompt: string) => void;
}

const GeneracionDePrompts: React.FC<GeneracionDePromptsProps> = ({ onPromptSelect }) => {
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [inputs, setInputs] = useState({
    pregunta1: '',
    pregunta2: '',
    pregunta3: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputs({
      ...inputs,
      [e.target.name]: e.target.value
    });
  };

  const handleGeneratePrompt = () => {
    const generatedPrompt = `Basado en lo siguiente:
1. ${inputs.pregunta1}
2. ${inputs.pregunta2}
3. ${inputs.pregunta3}
Por favor, genera un contenido creativo y atractivo.`;
    
    onPromptSelect(generatedPrompt);
  };

  return (
    <div className={`w-full rounded-xl overflow-hidden ${
      theme === 'dark' ? 'bg-gray-800/50 backdrop-blur-sm' : 'bg-white/50 backdrop-blur-sm'
    } shadow-xl transition-all duration-300 border ${
      theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
    }`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full p-5 flex items-center justify-between ${
          theme === 'dark' ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50/50'
        } transition-all duration-300`}
      >
        <div className="flex items-center gap-3">
          <Wand2 className={`w-5 h-5 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-500'}`} />
          <span className={`font-semibold ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Generador de Prompts
          </span>
        </div>
        {isOpen ? (
          <ChevronUp className={`transform transition-transform duration-300 ${
            theme === 'dark' ? 'text-white' : 'text-gray-600'
          }`} />
        ) : (
          <ChevronDown className={`transform transition-transform duration-300 ${
            theme === 'dark' ? 'text-white' : 'text-gray-600'
          }`} />
        )}
      </button>

      {isOpen && (
        <div className="p-5 space-y-5 animate-fadeIn">
          <div className="space-y-4">
            {/* Input fields container */}
            {['pregunta1', 'pregunta2', 'pregunta3'].map((field, index) => (
              <div key={field} className="space-y-2 transform transition-all duration-300 hover:translate-x-1">
                <label className={`block text-sm font-medium ${
                  theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                }`}>
                  {index === 0 && '¿Cuál es el objetivo principal del contenido?'}
                  {index === 1 && '¿Qué tipo de tono o estilo prefieres para el contenido?'}
                  {index === 2 && '¿Qué elementos específicos quieres incluir en el contenido?'}
                </label>
                <input
                  type="text"
                  name={field}
                  value={inputs[field as keyof typeof inputs]}
                  onChange={handleInputChange}
                  placeholder={[
                    'Ej: Motivar a la audiencia a comenzar su rutina de ejercicios',
                    'Ej: Motivacional y energético',
                    'Ej: Consejos prácticos, datos científicos, historias de éxito'
                  ][index]}
                  className={`w-full p-3 rounded-lg border ${
                    theme === 'dark' 
                      ? 'bg-gray-700/50 text-white placeholder-gray-400 border-gray-600 focus:border-blue-500' 
                      : 'bg-gray-50 text-gray-900 placeholder-gray-500 border-gray-200 focus:border-blue-400'
                  } transition-all duration-300 focus:ring-2 focus:ring-blue-500/20 outline-none`}
                />
              </div>
            ))}

            <button
              onClick={handleGeneratePrompt}
              className={`w-full p-3 rounded-lg font-medium flex items-center justify-center gap-2 ${
                theme === 'dark'
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white'
                  : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white'
              } transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg`}
            >
              <Wand2 className="w-5 h-5" />
              Generar Prompt
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GeneracionDePrompts;