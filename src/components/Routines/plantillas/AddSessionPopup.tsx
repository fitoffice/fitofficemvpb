import React, { useState } from 'react';
import { useTheme } from '../../../contexts/ThemeContext';
import Button from '../../Common/Button';
import { X } from 'lucide-react';

interface Exercise {
  _id: string;
  nombre: string;
  tipo: string;
  grupoMuscular: string[];
}

interface ExerciseWithSets {
  exercise: Exercise;
  sets: {
    reps: number;
    weight: number;
    rest: number;
    tempo: string;
    rpe: number;
    _id: string;
  }[];
  _id: string;
}

interface Session {
  name: string;
  tipo: 'Normal' | 'Superset';
  rondas: number;
  exercises: ExerciseWithSets[];
}

interface AddSessionPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onAddSession: (session: Session) => Promise<void>;
  templateId: string;
  weekNumber: number;
  dayNumber: number;
}

const AddSessionPopup: React.FC<AddSessionPopupProps> = ({
  isOpen,
  onClose,
  onAddSession,
  templateId,
  weekNumber,
  dayNumber
}) => {
  const { theme } = useTheme();
  const [session, setSession] = useState<Session>({
    name: '',
    tipo: 'Normal',
    rondas: 1,
    exercises: []
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onAddSession(session);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`relative w-full max-w-md p-6 rounded-lg shadow-lg ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-white'
      }`}>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-2xl font-bold mb-4">Añadir Sesión</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Nombre de la Sesión
            </label>
            <input
              type="text"
              value={session.name}
              onChange={(e) => setSession({ ...session, name: e.target.value })}
              className={`w-full p-2 rounded border ${
                theme === 'dark'
                  ? 'bg-gray-700 border-gray-600'
                  : 'bg-white border-gray-300'
              }`}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Tipo de Sesión
            </label>
            <select
              value={session.tipo}
              onChange={(e) => setSession({ ...session, tipo: e.target.value as 'Normal' | 'Superset' })}
              className={`w-full p-2 rounded border ${
                theme === 'dark'
                  ? 'bg-gray-700 border-gray-600'
                  : 'bg-white border-gray-300'
              }`}
            >
              <option value="Normal">Normal</option>
              <option value="Superset">Superset</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Número de Rondas
            </label>
            <input
              type="number"
              min="1"
              value={session.rondas}
              onChange={(e) => setSession({ ...session, rondas: parseInt(e.target.value) })}
              className={`w-full p-2 rounded border ${
                theme === 'dark'
                  ? 'bg-gray-700 border-gray-600'
                  : 'bg-white border-gray-300'
              }`}
              required
            />
          </div>

          <div className="flex justify-end space-x-3">
            <Button
              onClick={onClose}
              className={`px-4 py-2 rounded ${
                theme === 'dark'
                  ? 'bg-gray-700 hover:bg-gray-600'
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Añadir
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSessionPopup;
