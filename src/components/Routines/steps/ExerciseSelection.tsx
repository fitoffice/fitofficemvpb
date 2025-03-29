import React, { useState } from 'react';
import { Dumbbell, Search, Settings, X, Plus, Info } from 'lucide-react';
import { Period, Exercise } from '../FormulasPopup';
import Card from '../ui/Card';
import Button from '../ui/Button';

interface ExerciseSelectionProps {
  selectedPeriods: Period[];
  exercises: Record<number, Exercise[]>;
  setExercises: React.Dispatch<React.SetStateAction<Record<number, Exercise[]>>>;
}

const defaultExercises = [
  'Press de Banca',
  'Sentadillas',
  'Peso Muerto',
  'Press Militar',
  'Dominadas',
  'Remo con Barra',
  'Curl de Bíceps',
  'Extensiones de Tríceps',
  'Hip Thrust',
  'Zancadas',
  'Remo en T',
  'Press Inclinado'
];

const ExerciseSelection: React.FC<ExerciseSelectionProps> = ({
  selectedPeriods,
  exercises,
  setExercises
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedExercises, setSelectedExercises] = useState<string[]>([]);

  const filteredExercises = defaultExercises.filter(exercise =>
    exercise.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {selectedPeriods.map((period, index) => (
          <Card key={index}>
            <div className="space-y-6">
              <div className="flex items-start justify-between">
                <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center gap-2">
                  <div className="bg-indigo-50 p-2 rounded-lg">
                    <Dumbbell className="w-5 h-5 text-indigo-600" />
                  </div>
                  Semana {period.start} - {period.end}
                </h3>
                <div className="group relative">
                  <Info className="w-5 h-5 text-indigo-400 hover:text-indigo-600 transition-colors cursor-help" />
                  <div className="absolute right-0 w-64 p-3 bg-white rounded-lg shadow-xl border border-indigo-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10 text-sm text-gray-600">
                    Configure los ejercicios para este período específico.
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Buscar ejercicios..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition-all hover:border-indigo-400"
                />
              </div>

              <div className="space-y-3">
                {filteredExercises.map((exercise, i) => (
                  <div
                    key={i}
                    className="group flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-gray-50 to-gray-100 hover:from-indigo-50 hover:to-purple-50 transition-all hover:shadow-md"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center">
                        <Dumbbell className="w-4 h-4 text-indigo-600" />
                      </div>
                      <span className="text-gray-700 font-medium">{exercise}</span>
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 rounded-lg bg-white shadow-sm hover:shadow-md transition-all text-indigo-600 hover:text-indigo-700">
                        <Settings className="w-4 h-4" />
                      </button>
                      <button className="p-2 rounded-lg bg-white shadow-sm hover:shadow-md transition-all text-red-500 hover:text-red-600">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <Button
                variant="secondary"
                className="w-full justify-center gap-2 mt-4"
              >
                <Plus className="w-4 h-4" />
                Añadir Ejercicio Personalizado
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ExerciseSelection;