import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { PlusCircle, X, Save, Loader } from 'react-feather';

interface Option {
  id: string;
  text: string;
}

interface Question {
  id: number;
  type: 'multiple_choice' | 'scale' | 'open';
  question: string;
  options?: string[];
}

interface SurveyResponse {
  title: string;
  description: string;
  questions: Question[];
}

interface SurveyCreatorProps {
  onSave: (surveyData: {
    topic: string;
    numberOfQuestions: number;
    questions: Question[];
  }) => void;
}

const SurveyCreator: React.FC<SurveyCreatorProps> = ({ onSave }) => {
  const { theme } = useTheme();
  const [topic, setTopic] = useState('');
  const [numberOfQuestions, setNumberOfQuestions] = useState(1);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentOption, setCurrentOption] = useState('');

  const handleTopicSubmit = async () => {
    if (!topic.trim() || numberOfQuestions < 1) return;

    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No se encontró el token de autenticación');
      }

      const response = await fetch('https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/chats/survey/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          topic,
          numberOfQuestions
        })
      });

      if (!response.ok) {
        throw new Error('Error al generar la encuesta');
      }

      const data: SurveyResponse = await response.json();
      
      // Check if data.questions exists and is an array
      if (!data.questions || !Array.isArray(data.questions)) {
        console.error('Formato de respuesta inválido:', data);
        throw new Error('El formato de la respuesta es inválido');
      }
      
      // Ensure each question has the required properties
      const formattedQuestions = data.questions.map((q, index) => ({
        id: q.id || index + 1,
        type: q.type || 'multiple_choice',
        question: q.question || '',
        options: q.options || []
      }));
      
      setQuestions(formattedQuestions);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al generar la encuesta');
      console.error('Error en la generación de encuesta:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    onSave({
      topic,
      numberOfQuestions,
      questions
    });
  };

  const addOption = (questionId: number, option: string) => {
    if (!option.trim()) return;

    setQuestions(questions.map(q => {
      if (q.id === questionId && q.options) {
        return {
          ...q,
          options: [...q.options, option]
        };
      }
      return q;
    }));
    setCurrentOption('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <h2 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
          Crear Encuesta
        </h2>

        {error && (
          <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <div className={`p-6 rounded-lg border ${
          theme === 'dark'
            ? 'bg-gray-800 border-gray-700'
            : 'bg-white border-gray-200'
        }`}>
          <div className="space-y-4">
            {/* Campo de tema de la encuesta */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
              }`}>
                ¿Sobre qué tema quieres hacer la encuesta?
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Ej: Satisfacción del cliente, Preferencias de producto..."
                className={`w-full p-3 rounded-lg border ${
                  theme === 'dark'
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              />
            </div>

            {/* Campo de número de preguntas */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
              }`}>
                Número de preguntas
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={numberOfQuestions}
                onChange={(e) => setNumberOfQuestions(Math.max(1, Math.min(10, parseInt(e.target.value) || 1)))}
                className={`w-full p-3 rounded-lg border ${
                  theme === 'dark'
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              />
              <p className={`mt-1 text-sm ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`}>
                Máximo 10 preguntas
              </p>
            </div>

            {/* Botón para generar */}
            <button
              onClick={handleTopicSubmit}
              disabled={loading || !topic.trim() || numberOfQuestions < 1}
              className={`w-full p-3 rounded-lg transition-colors flex items-center justify-center gap-2 ${
                loading || !topic.trim() || numberOfQuestions < 1
                  ? 'bg-gray-400 cursor-not-allowed text-gray-200'
                  : 'bg-purple-600 hover:bg-purple-700 text-white'
              }`}
            >
              {loading ? (
                <>
                  <Loader className="animate-spin" size={20} />
                  Generando encuesta...
                </>
              ) : (
                'Generar Encuesta'
              )}
            </button>
          </div>
        </div>

        {/* Lista de preguntas generadas */}
        {questions.length > 0 && (
          <div className="space-y-4">
            <h3 className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Preguntas Generadas
            </h3>
            {questions.map((question) => (
              <div
                key={question.id}
                className={`p-4 rounded-lg border ${
                  theme === 'dark'
                    ? 'bg-gray-800 border-gray-700'
                    : 'bg-white border-gray-200'
                }`}
              >
                <h4 className={`font-medium mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {question.question}
                </h4>
                {question.type !== 'open' && question.options && (
                  <div className="space-y-2">
                    {question.options.map((option, index) => (
                      <div
                        key={index}
                        className={`p-2 rounded-lg ${
                          theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
                        }`}
                      >
                        {option}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}

            <button
              onClick={handleSave}
              className="flex items-center justify-center gap-2 w-full p-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Save size={20} />
              Guardar Encuesta
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SurveyCreator;
