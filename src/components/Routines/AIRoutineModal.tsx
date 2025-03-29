import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import Button from '../Common/Button';
import { 
  Dumbbell, 
  Weight, 
  Zap, 
  Activity, 
  Clock, 
  User, 
  Users, 
  Heart, 
  X, 
  BarChart, 
  Flame, 
  Trophy, 
  Repeat,
  Layers,
  ArrowUp,
  ArrowDown,
  AlertCircle,
  Check,
  Hash,
  ListOrdered,
  Loader
} from 'lucide-react';
import { useAIRoutineModal } from '../../contexts/AIRoutineModalContext';

interface AIRoutineModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme?: 'light' | 'dark';
}

const AIRoutineModal: React.FC<AIRoutineModalProps> = ({ isOpen, onClose, theme = 'light' }) => {
  // Extraemos la función para actualizar el estado de la rutina pendiente
  const { setPendingAIRoutine } = useAIRoutineModal();

  const [objective, setObjective] = useState('ganar_masa');
  const [fitnessLevel, setFitnessLevel] = useState('intermedio');
  const [duration, setDuration] = useState('45');
  const [equipment, setEquipment] = useState<string[]>(['peso_corporal']);
  const [bodyArea, setBodyArea] = useState('cuerpo_completo');
  const [hasInjuries, setHasInjuries] = useState('no');
  const [injuries, setInjuries] = useState('');
  const [numExercises, setNumExercises] = useState('6');
  const [numSets, setNumSets] = useState('3');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleEquipmentChange = (value: string) => {
    if (equipment.includes(value)) {
      setEquipment(equipment.filter(item => item !== value));
    } else {
      setEquipment([...equipment, value]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const routineData = {
      objective,
      fitnessLevel,
      duration,
      equipment,
      bodyArea,
      injuries: hasInjuries === 'si' ? injuries : null,
      numExercises,
      numSets
    };
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No authentication token found');
        setIsLoading(false);
        return;
      }
      
      const response = await fetch('https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/routines/generate-with-ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(routineData)
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Routine created successfully:', data);
      
      // Actualizamos el contexto con la nueva rutina generada por IA.
      // Se asume que la rutina viene en data.data; ajústalo según corresponda.
      setPendingAIRoutine(data.data);
      
      // Cerramos el modal
      onClose();
    } catch (error) {
      console.error('Error creating routine:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const modalContent = (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-75 flex items-center justify-center p-4">
      <div className={`relative w-full max-w-2xl rounded-lg shadow-lg ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} max-h-[90vh] flex flex-col`}>
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 p-2 rounded-full hover:bg-opacity-10 z-10 ${theme === 'dark' ? 'hover:bg-white' : 'hover:bg-black'}`}
          disabled={isLoading}
        >
          <X className="h-6 w-6" />
        </button>

        {isLoading && (
          <div className="absolute inset-0 bg-black bg-opacity-30 flex flex-col items-center justify-center z-20 rounded-lg">
            <Loader className="w-12 h-12 text-purple-500 animate-spin mb-4" />
            <p className="text-white text-lg font-medium">Generando rutina con IA...</p>
            <p className="text-white text-sm mt-2">Esto puede tardar unos segundos</p>
          </div>
        )}

        <div className="p-8 overflow-y-auto flex-1">
          <h2 className="text-3xl font-bold mb-6 text-center">Crear Rutina con IA</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Sección de objetivo */}
            <div>
              <label className="block mb-2 font-medium">
                ¿Cuál es el objetivo del cliente para esta sesión?
                <span className="block text-sm text-gray-500 mt-1">
                  (Selecciona una opción rápida para personalizar la rutina)
                </span>
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <label className={`border rounded-lg p-3 flex items-center cursor-pointer transition-all ${objective === 'ganar_masa' ? 'bg-purple-100 border-purple-500 shadow-sm' : 'hover:bg-gray-50'}`}>
                  <input
                    type="radio"
                    name="objective"
                    value="ganar_masa"
                    checked={objective === 'ganar_masa'}
                    onChange={(e) => setObjective(e.target.value)}
                    className="mr-2"
                  />
                  <Dumbbell className="w-5 h-5 mr-2 text-purple-600" /> Ganar masa muscular
                </label>
                <label className={`border rounded-lg p-3 flex items-center cursor-pointer transition-all ${objective === 'perdida_grasa' ? 'bg-purple-100 border-purple-500 shadow-sm' : 'hover:bg-gray-50'}`}>
                  <input
                    type="radio"
                    name="objective"
                    value="perdida_grasa"
                    checked={objective === 'perdida_grasa'}
                    onChange={(e) => setObjective(e.target.value)}
                    className="mr-2"
                  />
                  <Flame className="w-5 h-5 mr-2 text-purple-600" /> Pérdida de grasa
                </label>
                <label className={`border rounded-lg p-3 flex items-center cursor-pointer transition-all ${objective === 'mejora_rendimiento' ? 'bg-purple-100 border-purple-500 shadow-sm' : 'hover:bg-gray-50'}`}>
                  <input
                    type="radio"
                    name="objective"
                    value="mejora_rendimiento"
                    checked={objective === 'mejora_rendimiento'}
                    onChange={(e) => setObjective(e.target.value)}
                    className="mr-2"
                  />
                  <Trophy className="w-5 h-5 mr-2 text-purple-600" /> Mejora del rendimiento
                </label>
                <label className={`border rounded-lg p-3 flex items-center cursor-pointer transition-all ${objective === 'mantenimiento' ? 'bg-purple-100 border-purple-500 shadow-sm' : 'hover:bg-gray-50'}`}>
                  <input
                    type="radio"
                    name="objective"
                    value="mantenimiento"
                    checked={objective === 'mantenimiento'}
                    onChange={(e) => setObjective(e.target.value)}
                    className="mr-2"
                  />
                  <Repeat className="w-5 h-5 mr-2 text-purple-600" /> Mantenimiento físico
                </label>
              </div>
            </div>

            {/* Sección de número de ejercicios y series */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-2 font-medium">
                  Número de ejercicios
                  <span className="block text-sm text-gray-500 mt-1">
                    (Cantidad de ejercicios en la rutina)
                  </span>
                </label>
                <div className="flex items-center">
                  <ListOrdered className="w-5 h-5 mr-2 text-purple-600" />
                  <select
                    value={numExercises}
                    onChange={(e) => setNumExercises(e.target.value)}
                    className="w-full p-3 border rounded-lg bg-white border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200 transition-all"
                  >
                    {[3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                      <option key={num} value={num.toString()}>{num}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block mb-2 font-medium">
                  Número de series
                  <span className="block text-sm text-gray-500 mt-1">
                    (Series por rutina)
                  </span>
                </label>
                <div className="flex items-center">
                  <Hash className="w-5 h-5 mr-2 text-purple-600" />
                  <input
                    type="number"
                    value={numSets}
                    onChange={(e) => setNumSets(e.target.value)}
                    min="1"
                    placeholder="Número de series"
                    className="w-full p-3 border rounded-lg bg-white border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Sección de nivel de entrenamiento */}
            <div>
              <label className="block mb-2 font-medium">
                ¿Cuál es su nivel de entrenamiento actual?
                <span className="block text-sm text-gray-500 mt-1">
                  (Para ajustar la intensidad y la carga de trabajo)
                </span>
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <label className={`border rounded-lg p-3 flex items-center cursor-pointer transition-all ${fitnessLevel === 'principiante' ? 'bg-purple-100 border-purple-500 shadow-sm' : 'hover:bg-gray-50'}`}>
                  <input
                    type="radio"
                    name="fitnessLevel"
                    value="principiante"
                    checked={fitnessLevel === 'principiante'}
                    onChange={(e) => setFitnessLevel(e.target.value)}
                    className="mr-2"
                  />
                  <User className="w-5 h-5 mr-2 text-purple-600" /> Principiante
                </label>
                <label className={`border rounded-lg p-3 flex items-center cursor-pointer transition-all ${fitnessLevel === 'intermedio' ? 'bg-purple-100 border-purple-500 shadow-sm' : 'hover:bg-gray-50'}`}>
                  <input
                    type="radio"
                    name="fitnessLevel"
                    value="intermedio"
                    checked={fitnessLevel === 'intermedio'}
                    onChange={(e) => setFitnessLevel(e.target.value)}
                    className="mr-2"
                  />
                  <Users className="w-5 h-5 mr-2 text-purple-600" /> Intermedio
                </label>
                <label className={`border rounded-lg p-3 flex items-center cursor-pointer transition-all ${fitnessLevel === 'avanzado' ? 'bg-purple-100 border-purple-500 shadow-sm' : 'hover:bg-gray-50'}`}>
                  <input
                    type="radio"
                    name="fitnessLevel"
                    value="avanzado"
                    checked={fitnessLevel === 'avanzado'}
                    onChange={(e) => setFitnessLevel(e.target.value)}
                    className="mr-2"
                  />
                  <Zap className="w-5 h-5 mr-2 text-purple-600" /> Avanzado
                </label>
              </div>
            </div>

            {/* Sección de duración */}
            <div>
              <label className="block mb-2 font-medium">
                ¿Cuánto tiempo tiene disponible hoy?
                <span className="block text-sm text-gray-500 mt-1">
                  (Para estructurar la rutina en base a su disponibilidad)
                </span>
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <label className={`border rounded-lg p-3 flex items-center cursor-pointer transition-all ${duration === '30' ? 'bg-purple-100 border-purple-500 shadow-sm' : 'hover:bg-gray-50'}`}>
                  <input
                    type="radio"
                    name="duration"
                    value="30"
                    checked={duration === '30'}
                    onChange={(e) => setDuration(e.target.value)}
                    className="mr-2"
                  />
                  <Clock className="w-5 h-5 mr-2 text-purple-600" /> 30 minutos
                </label>
                <label className={`border rounded-lg p-3 flex items-center cursor-pointer transition-all ${duration === '45' ? 'bg-purple-100 border-purple-500 shadow-sm' : 'hover:bg-gray-50'}`}>
                  <input
                    type="radio"
                    name="duration"
                    value="45"
                    checked={duration === '45'}
                    onChange={(e) => setDuration(e.target.value)}
                    className="mr-2"
                  />
                  <Clock className="w-5 h-5 mr-2 text-purple-600" /> 45 minutos
                </label>
                <label className={`border rounded-lg p-3 flex items-center cursor-pointer transition-all ${duration === '60' ? 'bg-purple-100 border-purple-500 shadow-sm' : 'hover:bg-gray-50'}`}>
                  <input
                    type="radio"
                    name="duration"
                    value="60"
                    checked={duration === '60'}
                    onChange={(e) => setDuration(e.target.value)}
                    className="mr-2"
                  />
                  <Clock className="w-5 h-5 mr-2 text-purple-600" /> 60 minutos o más
                </label>
              </div>
            </div>

            {/* Sección de equipamiento */}
            <div>
              <label className="block mb-2 font-medium">
                ¿Qué equipamiento puede usar en esta sesión?
                <span className="block text-sm text-gray-500 mt-1">
                  (Selecciona todos los que apliquen)
                </span>
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <label className={`border rounded-lg p-3 flex items-center cursor-pointer transition-all ${equipment.includes('peso_corporal') ? 'bg-purple-100 border-purple-500 shadow-sm' : 'hover:bg-gray-50'}`}>
                  <input
                    type="checkbox"
                    name="equipment"
                    value="peso_corporal"
                    checked={equipment.includes('peso_corporal')}
                    onChange={() => handleEquipmentChange('peso_corporal')}
                    className="mr-2"
                  />
                  <User className="w-5 h-5 mr-2 text-purple-600" /> Solo peso corporal
                </label>
                <label className={`border rounded-lg p-3 flex items-center cursor-pointer transition-all ${equipment.includes('mancuernas') ? 'bg-purple-100 border-purple-500 shadow-sm' : 'hover:bg-gray-50'}`}>
                  <input
                    type="checkbox"
                    name="equipment"
                    value="mancuernas"
                    checked={equipment.includes('mancuernas')}
                    onChange={() => handleEquipmentChange('mancuernas')}
                    className="mr-2"
                  />
                  <Dumbbell className="w-5 h-5 mr-2 text-purple-600" /> Mancuernas
                </label>
                <label className={`border rounded-lg p-3 flex items-center cursor-pointer transition-all ${equipment.includes('bandas') ? 'bg-purple-100 border-purple-500 shadow-sm' : 'hover:bg-gray-50'}`}>
                  <input
                    type="checkbox"
                    name="equipment"
                    value="bandas"
                    checked={equipment.includes('bandas')}
                    onChange={() => handleEquipmentChange('bandas')}
                    className="mr-2"
                  />
                  <Activity className="w-5 h-5 mr-2 text-purple-600" /> Bandas elásticas
                </label>
                <label className={`border rounded-lg p-3 flex items-center cursor-pointer transition-all ${equipment.includes('gimnasio') ? 'bg-purple-100 border-purple-500 shadow-sm' : 'hover:bg-gray-50'}`}>
                  <input
                    type="checkbox"
                    name="equipment"
                    value="gimnasio"
                    checked={equipment.includes('gimnasio')}
                    onChange={() => handleEquipmentChange('gimnasio')}
                    className="mr-2"
                  />
                  <BarChart className="w-5 h-5 mr-2 text-purple-600" /> Acceso a gimnasio completo
                </label>
              </div>
            </div>

            {/* Sección de zona del cuerpo */}
            <div>
              <label className="block mb-2 font-medium">
                ¿Qué zona del cuerpo quieres trabajar hoy?
                <span className="block text-sm text-gray-500 mt-1">
                  (Para enfocar la rutina según el plan de entrenamiento del cliente)
                </span>
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <label className={`border rounded-lg p-3 flex items-center cursor-pointer transition-all ${bodyArea === 'cuerpo_completo' ? 'bg-purple-100 border-purple-500 shadow-sm' : 'hover:bg-gray-50'}`}>
                  <input
                    type="radio"
                    name="bodyArea"
                    value="cuerpo_completo"
                    checked={bodyArea === 'cuerpo_completo'}
                    onChange={(e) => setBodyArea(e.target.value)}
                    className="mr-2"
                  />
                  <Layers className="w-5 h-5 mr-2 text-purple-600" /> Cuerpo completo
                </label>
                <label className={`border rounded-lg p-3 flex items-center cursor-pointer transition-all ${bodyArea === 'push' ? 'bg-purple-100 border-purple-500 shadow-sm' : 'hover:bg-gray-50'}`}>
                  <input
                    type="radio"
                    name="bodyArea"
                    value="push"
                    checked={bodyArea === 'push'}
                    onChange={(e) => setBodyArea(e.target.value)}
                    className="mr-2"
                  />
                  <ArrowUp className="w-5 h-5 mr-2 text-purple-600" /> Push (Empuje)
                </label>
                <label className={`border rounded-lg p-3 flex items-center cursor-pointer transition-all ${bodyArea === 'pull' ? 'bg-purple-100 border-purple-500 shadow-sm' : 'hover:bg-gray-50'}`}>
                  <input
                    type="radio"
                    name="bodyArea"
                    value="pull"
                    checked={bodyArea === 'pull'}
                    onChange={(e) => setBodyArea(e.target.value)}
                    className="mr-2"
                  />
                  <ArrowDown className="w-5 h-5 mr-2 text-purple-600" /> Pull (Jalón)
                </label>
                <label className={`border rounded-lg p-3 flex items-center cursor-pointer transition-all ${bodyArea === 'legs' ? 'bg-purple-100 border-purple-500 shadow-sm' : 'hover:bg-gray-50'}`}>
                  <input
                    type="radio"
                    name="bodyArea"
                    value="legs"
                    checked={bodyArea === 'legs'}
                    onChange={(e) => setBodyArea(e.target.value)}
                    className="mr-2"
                  />
                  <ArrowDown className="w-5 h-5 mr-2 text-purple-600" /> Legs (Piernas)
                </label>
                <label className={`border rounded-lg p-3 flex items-center cursor-pointer transition-all ${bodyArea === 'tren_superior' ? 'bg-purple-100 border-purple-500 shadow-sm' : 'hover:bg-gray-50'}`}>
                  <input
                    type="radio"
                    name="bodyArea"
                    value="tren_superior"
                    checked={bodyArea === 'tren_superior'}
                    onChange={(e) => setBodyArea(e.target.value)}
                    className="mr-2"
                  />
                  <ArrowUp className="w-5 h-5 mr-2 text-purple-600" /> Tren superior
                </label>
                <label className={`border rounded-lg p-3 flex items-center cursor-pointer transition-all ${bodyArea === 'tren_inferior' ? 'bg-purple-100 border-purple-500 shadow-sm' : 'hover:bg-gray-50'}`}>
                  <input
                    type="radio"
                    name="bodyArea"
                    value="tren_inferior"
                    checked={bodyArea === 'tren_inferior'}
                    onChange={(e) => setBodyArea(e.target.value)}
                    className="mr-2"
                  />
                  <ArrowDown className="w-5 h-5 mr-2 text-purple-600" /> Tren inferior
                </label>
                <label className={`border rounded-lg p-3 flex items-center cursor-pointer transition-all ${bodyArea === 'cardio' ? 'bg-purple-100 border-purple-500 shadow-sm' : 'hover:bg-gray-50'}`}>
                  <input
                    type="radio"
                    name="bodyArea"
                    value="cardio"
                    checked={bodyArea === 'cardio'}
                    onChange={(e) => setBodyArea(e.target.value)}
                    className="mr-2"
                  />
                  <Heart className="w-5 h-5 mr-2 text-purple-600" /> Cardio / Resistencia
                </label>
              </div>
            </div>

            {/* Sección de lesiones */}
            <div>
              <label className="block mb-2 font-medium">
                ¿Existen lesiones o restricciones que deba considerar?
                <span className="block text-sm text-gray-500 mt-1">
                  (Para evitar ejercicios que puedan causar molestias o lesiones)
                </span>
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                <label className={`border rounded-lg p-3 flex items-center cursor-pointer transition-all ${hasInjuries === 'no' ? 'bg-purple-100 border-purple-500 shadow-sm' : 'hover:bg-gray-50'}`}>
                  <input
                    type="radio"
                    name="hasInjuries"
                    value="no"
                    checked={hasInjuries === 'no'}
                    onChange={(e) => setHasInjuries(e.target.value)}
                    className="mr-2"
                  />
                  <Check className="w-5 h-5 mr-2 text-purple-600" /> No
                </label>
                <label className={`border rounded-lg p-3 flex items-center cursor-pointer transition-all ${hasInjuries === 'si' ? 'bg-purple-100 border-purple-500 shadow-sm' : 'hover:bg-gray-50'}`}>
                  <input
                    type="radio"
                    name="hasInjuries"
                    value="si"
                    checked={hasInjuries === 'si'}
                    onChange={(e) => setHasInjuries(e.target.value)}
                    className="mr-2"
                  />
                  <AlertCircle className="w-5 h-5 mr-2 text-purple-600" /> Sí (especificar)
                </label>
              </div>
              
              {hasInjuries === 'si' && (
                <textarea
                  value={injuries}
                  onChange={(e) => setInjuries(e.target.value)}
                  placeholder="Describe las lesiones o restricciones que debemos considerar..."
                  className="w-full p-3 border rounded-lg h-24 resize-none bg-white border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200 transition-all"
                />
              )}
            </div>

            {/* Botones */}
            <div className="flex justify-end gap-4 pt-2">
              <Button
                onClick={onClose}
                className={`px-6 py-3 rounded-lg text-lg transition-colors ${theme === 'dark' ? 'bg-gray-600 hover:bg-gray-700' : 'bg-gray-200 hover:bg-gray-300'}`}
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className={`px-6 py-3 rounded-lg text-lg transition-colors ${theme === 'dark' ? 'bg-purple-600 hover:bg-purple-700' : 'bg-purple-500 hover:bg-purple-600'} text-white flex items-center justify-center`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader className="w-5 h-5 mr-2 animate-spin" />
                    Generando rutina...
                  </>
                ) : (
                  'Generar Rutina'
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  return ReactDOM.createPortal(modalContent, document.body);
};

export default AIRoutineModal;