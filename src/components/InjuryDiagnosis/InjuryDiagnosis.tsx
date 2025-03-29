import { useState } from 'react';
import { X, Activity, AlertCircle, Stethoscope, Heart, Clock, FileText, History } from 'lucide-react';
import InjuryDiagnosisResponse from './InjuryDiagnosisResponse';

interface InjuryDiagnosisProps {
  isVisible: boolean;
  onClose: () => void;
}

interface FormData {
  injuryType: string;
  symptoms: string;
  painLevel: number;
  duration: string;
  activityContext: string;
  previousInjuries: string;
}

const InjuryDiagnosis: React.FC<InjuryDiagnosisProps> = ({
  isVisible,
  onClose,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState<FormData>({
    injuryType: '',
    symptoms: '',
    painLevel: 5,
    duration: '',
    activityContext: '',
    previousInjuries: ''
  });

  const [diagnosis, setDiagnosis] = useState<{
    timestamp: string;
    diagnosis: {
      condición: string;
      recomendaciones: string;
      ejercicios: string;
      precauciones: string;
    };
    status: string;
    version: string;
  } | null>(null);

  const handleInputChange = (field: keyof FormData, value: any) => {
    setForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const generateDiagnosis = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      console.log('Token retrieved from localStorage:', token ? 'Token exists' : 'No token found');

      if (!token) {
        throw new Error('No se encontró el token de autenticación');
      }

      const injuryDiagnosisPayload = {
        injuryType: form.injuryType,
        symptoms: [form.symptoms],
        painLevel: form.painLevel,
        duration: form.duration,
        activityContext: {
          whenOccurred: "Durante entrenamiento",
          activity: form.activityContext,
          weight: "",
          form: "",
          recentChanges: []
        }
      };

      console.log('Sending injury diagnosis payload:', injuryDiagnosisPayload);

      const response = await fetch('https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/chats/injury-diagnosis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(injuryDiagnosisPayload)
      });

      if (!response.ok) {
        throw new Error('Error al generar el diagnóstico');
      }

      const data = await response.json();
      console.log('Response data:', data);
      
      // Simplemente establecemos los datos sin validación
      setDiagnosis(data);
    } catch (error) {
      console.error('Error:', error);
      // Incluso en caso de error, intentamos establecer los datos si existen
      if (error instanceof Error) {
        setDiagnosis({
          timestamp: new Date().toISOString(),
          diagnosis: {
            condición: 'Error al generar diagnóstico',
            recomendaciones: error.message,
            ejercicios: 'No disponible debido a un error',
            precauciones: 'Por favor, intente nuevamente'
          },
          status: 'error',
          version: '1.0'
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await generateDiagnosis();
  };

  if (!isVisible) return null;

  const getPainLevelColor = (level: number) => {
    if (level <= 3) return 'bg-green-500';
    if (level <= 6) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {diagnosis ? (
          <div className="p-6">
            <InjuryDiagnosisResponse diagnosis={diagnosis} onClose={onClose} />
          </div>
        ) : (
          <>
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-500/10 to-purple-500/10">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Stethoscope className="w-6 h-6 text-blue-500" />
                  Diagnóstico de Lesiones
                </h2>
                <button
                  onClick={onClose}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-200"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Tipo de lesión */}
                <div className="transition-all duration-200 hover:transform hover:scale-[1.01]">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-blue-500" />
                    Tipo de lesión
                  </label>
                  <input
                    type="text"
                    value={form.injuryType}
                    onChange={(e) => handleInputChange('injuryType', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700/50 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Ej: Esguince de tobillo, dolor lumbar..."
                    required
                  />
                </div>

                {/* Síntomas */}
                <div className="transition-all duration-200 hover:transform hover:scale-[1.01]">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-blue-500" />
                    Síntomas
                  </label>
                  <textarea
                    value={form.symptoms}
                    onChange={(e) => handleInputChange('symptoms', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700/50 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    rows={3}
                    placeholder="Describe los síntomas detalladamente..."
                    required
                  />
                </div>

                {/* Nivel de dolor */}
                <div className="transition-all duration-200 hover:transform hover:scale-[1.01]">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                    <Heart className="w-4 h-4 text-blue-500" />
                    Nivel de dolor (1-10)
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={form.painLevel}
                      onChange={(e) => handleInputChange('painLevel', parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                    />
                    <span className={`px-3 py-1 rounded-full text-white font-medium ${getPainLevelColor(form.painLevel)}`}>
                      {form.painLevel}
                    </span>
                  </div>
                </div>

                {/* Duración */}
                <div className="transition-all duration-200 hover:transform hover:scale-[1.01]">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-500" />
                    Duración de los síntomas
                  </label>
                  <input
                    type="text"
                    value={form.duration}
                    onChange={(e) => handleInputChange('duration', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700/50 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Ej: 2 días, 1 semana..."
                    required
                  />
                </div>

                {/* Contexto de la actividad */}
                <div className="transition-all duration-200 hover:transform hover:scale-[1.01]">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-500" />
                    Contexto de la lesión
                  </label>
                  <textarea
                    value={form.activityContext}
                    onChange={(e) => handleInputChange('activityContext', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700/50 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    rows={2}
                    placeholder="¿Qué actividad realizabas cuando ocurrió?"
                    required
                  />
                </div>

                {/* Lesiones previas */}
                <div className="transition-all duration-200 hover:transform hover:scale-[1.01]">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                    <History className="w-4 h-4 text-blue-500" />
                    Lesiones previas relacionadas
                  </label>
                  <textarea
                    value={form.previousInjuries}
                    onChange={(e) => handleInputChange('previousInjuries', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700/50 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    rows={2}
                    placeholder="¿Has tenido lesiones similares anteriormente?"
                  />
                </div>

                <div className="flex justify-end space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 dark:text-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 transition-all duration-200"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Analizando...
                      </>
                    ) : (
                      <>
                        <Stethoscope className="w-5 h-5" />
                        Generar Diagnóstico
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default InjuryDiagnosis;
