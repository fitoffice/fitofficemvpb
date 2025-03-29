import React, { useState } from 'react';
import { Dumbbell, ArrowRight, X, Calendar, Info } from 'lucide-react';
import { Period } from '../FormulasPopup';
import Button from '../ui/Button';
import Card from '../ui/Card';

interface PeriodSelectionProps {
  selectedPeriods: Period[];
  setSelectedPeriods: React.Dispatch<React.SetStateAction<Period[]>>;
  onNext: () => void;
}

const PeriodSelection: React.FC<PeriodSelectionProps> = ({
  selectedPeriods,
  setSelectedPeriods,
  onNext
}) => {
  const [selectionStart, setSelectionStart] = useState<number | null>(null);

  const handleWeekClick = (week: number) => {
    if (selectionStart === null) {
      setSelectionStart(week);
    } else {
      const start = Math.min(selectionStart, week);
      const end = Math.max(selectionStart, week);
      setSelectedPeriods(prev => [...prev, { start, end }]);
      setSelectionStart(null);
    }
  };

  const handlePeriodRemoval = (index: number) => {
    setSelectedPeriods(prev => prev.filter((_, i) => i !== index));
  };

  const isWeekSelected = (week: number) => 
    selectedPeriods.some(p => week >= p.start && week <= p.end);

  const isWeekInCurrentSelection = (week: number) =>
    selectionStart !== null && 
    week >= Math.min(selectionStart, week) && 
    week <= Math.max(selectionStart, week);

  return (
    <div className="p-8 space-y-8">
      <Card>
        <div className="space-y-8">
          <div className="flex items-start justify-between">
            <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center gap-2">
              <Calendar className="w-7 h-7 text-indigo-600" />
              Seleccionar Períodos
            </h2>
            <div className="group relative">
              <Info className="w-5 h-5 text-indigo-400 hover:text-indigo-600 transition-colors cursor-help" />
              <div className="absolute right-0 w-64 p-3 bg-white rounded-lg shadow-xl border border-indigo-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10 text-sm text-gray-600">
                Seleccione las semanas haciendo clic para elegir el inicio y fin de cada período.
              </div>
            </div>
          </div>

          <div className="grid grid-cols-13 gap-2">
            {Array.from({ length: 52 }, (_, i) => i + 1).map(week => (
              <button
                key={week}
                onClick={() => handleWeekClick(week)}
                className={`
                  p-2.5 text-center rounded-lg transition-all transform hover:scale-105
                  ${isWeekSelected(week)
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg scale-105'
                    : isWeekInCurrentSelection(week)
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'bg-gray-50 hover:bg-gray-100 text-gray-700 hover:shadow-md'
                  }
                `}
              >
                <span className="font-medium">{week}</span>
              </button>
            ))}
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-gray-700 flex items-center gap-2">
              <Dumbbell className="w-5 h-5 text-indigo-600" />
              Períodos seleccionados
            </h3>
            <div className="flex flex-wrap gap-2">
              {selectedPeriods.map((period, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 px-4 py-2 rounded-lg group hover:shadow-md transition-all"
                >
                  <span className="text-indigo-700 font-medium">
                    Semana {period.start} a Semana {period.end}
                  </span>
                  <button
                    onClick={() => handlePeriodRemoval(index)}
                    className="text-red-400 hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {selectedPeriods.length === 0 && (
                <div className="text-gray-500 italic">
                  No hay períodos seleccionados
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>

      <div className="flex justify-end">
        <Button onClick={onNext} className="px-6 py-2.5">
          Siguiente
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default PeriodSelection;