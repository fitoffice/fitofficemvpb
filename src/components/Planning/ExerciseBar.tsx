import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import Button from '../Common/Button';
import { useTheme } from '../../contexts/ThemeContext';

interface Exercise {
  id: string;
  name: string;
  series: number;
}

interface ExerciseBarProps {
  onAddExercise: (exercise: Exercise) => void;
  onClose: () => void;
}

const ExerciseBar: React.FC<ExerciseBarProps> = ({ onAddExercise, onClose }) => {
  const { theme } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');

  const exercises: Exercise[] = [
    { id: '1', name: 'Press de Banca', series: 4 },
    { id: '2', name: 'Sentadillas', series: 4 },
    { id: '3', name: 'Peso Muerto', series: 3 },
    { id: '4', name: 'Press Militar', series: 3 },
    { id: '5', name: 'Dominadas', series: 3 },
  ];

  const filteredExercises = exercises.filter(exercise =>
    exercise.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={`fixed inset-y-0 right-0 w-64 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-lg p-4 overflow-y-auto`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Añadir Ejercicio</h3>
        <Button variant="normal" onClick={onClose}>
          <X className="w-5 h-5" />
        </Button>
      </div>
      <input
        type="text"
        placeholder="Buscar ejercicio..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className={`w-full p-2 mb-4 rounded-md ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-800'}`}
      />
      <div className="space-y-2">
        {filteredExercises.map((exercise) => (
          <div key={exercise.id} className={`flex justify-between items-center p-2 rounded-md ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}>
            <div>
              <p className="font-semibold">{exercise.name}</p>
              <p className="text-sm text-gray-500">{exercise.series} series</p>
            </div>
            <Button variant="create" onClick={() => onAddExercise(exercise)}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExerciseBar;