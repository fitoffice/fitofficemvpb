import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar, LayoutGrid, List, Clock, CalendarDays, Trophy, Plus } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { useTheme } from '../../contexts/ThemeContext';

type ViewMode = 'grid' | 'list' | 'compact' | 'timeline';

interface Week {
  idSemana: number;
  fechaInicio: string;
  dias: Array<any>;
}

interface WeekSelectorProps {
  semanas: Week[];
  onWeekChange: (weekNumber: number) => void;
  onAddWeek: () => void;
  onViewModeChange: (mode: ViewMode) => void;
  viewMode: ViewMode;
}

export default function WeekSelector({ 
  semanas, 
  onWeekChange, 
  onAddWeek, 
  onViewModeChange,
  viewMode 
}: WeekSelectorProps) {
  const [selectedWeek, setSelectedWeek] = useState<number>(1);
  const { theme } = useTheme();

  useEffect(() => {
    if (semanas.length > 0 && !semanas.find(s => s.idSemana === selectedWeek)) {
      setSelectedWeek(semanas[0].idSemana);
    }
  }, [semanas]);

  const handleWeekChange = (weekId: number) => {
    setSelectedWeek(weekId);
    onWeekChange(weekId);
  };

  const handleAddWeek = async () => {
    await onAddWeek();
  };

  const formatWeekRange = (week: Week) => {
    const startDate = parseISO(week.fechaInicio);
    const endDate = parseISO(week.dias[week.dias.length - 1].fecha);
    return `${format(startDate, 'd MMM', { locale: es })} - ${format(endDate, 'd MMM', { locale: es })}`;
  };

  const weeks = semanas.map(semana => {
    const firstDay = new Date(semana.fechaInicio);
    const lastDay = new Date(semana.dias[semana.dias.length - 1].fecha);
    
    const totalMeals = semana.dias.reduce((total, dia) => total + dia.comidas.length, 0);
    // Por ahora asumimos que todas las comidas están completadas
    const completedMeals = totalMeals;

    return {
      number: semana.idSemana,
      range: formatWeekRange(semana),
      meals: totalMeals,
      completed: completedMeals
    };
  });

  const currentWeek = weeks.find(w => w.number === selectedWeek) || weeks[0];
  const completionRate = currentWeek ? Math.round((currentWeek.completed / currentWeek.meals) * 100) : 0;

  if (!weeks.length) {
    return <div>No hay semanas disponibles</div>;
  }

  return (
    <div className={`w-full rounded-2xl shadow-sm p-6 ${
      theme === 'dark' 
        ? 'bg-gray-800 border border-gray-700 text-white' 
        : 'bg-white border border-gray-100'
    }`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button 
            className={`p-2.5 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:hover:bg-transparent disabled:cursor-not-allowed group ${
              theme === 'dark'
                ? 'hover:bg-blue-900 text-blue-400'
                : 'hover:bg-blue-50 text-blue-600'
            }`}
            disabled={selectedWeek === Math.min(...weeks.map(w => w.number))}
            onClick={() => handleWeekChange(selectedWeek - 1)}
          >
            <ChevronLeft className="w-5 h-5 group-hover:scale-110 transition-transform" />
          </button>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-xl shadow-sm">
              <Calendar className="w-5 h-5" />
              <span className="font-semibold">Semana {currentWeek.number}</span>
            </div>
            <span className={`text-sm px-3 py-1.5 rounded-lg ${
              theme === 'dark' 
                ? 'text-gray-300 bg-gray-700' 
                : 'text-gray-600 bg-gray-50'
            }`}>
              {currentWeek.range}
            </span>
          </div>

          <button 
            className={`p-2.5 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:hover:bg-transparent disabled:cursor-not-allowed group ${
              theme === 'dark'
                ? 'hover:bg-blue-900 text-blue-400'
                : 'hover:bg-blue-50 text-blue-600'
            }`}
            disabled={selectedWeek === Math.max(...weeks.map(w => w.number))}
            onClick={() => handleWeekChange(selectedWeek + 1)}
          >
            <ChevronRight className="w-5 h-5 group-hover:scale-110 transition-transform" />
          </button>

          {onAddWeek && (
            <button 
              onClick={handleAddWeek}
              className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl shadow-sm transition-all duration-200"
            >
              <Plus className="w-4 h-4" />
              <span className="font-medium">Añadir Semana</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-8">
          <div className="flex items-center gap-6">
            <div className={`flex items-center gap-3 px-4 py-2 rounded-xl ${
              theme === 'dark' 
                ? 'bg-amber-900/30 text-amber-300' 
                : 'bg-amber-50'
            }`}>
              <Trophy className={`w-5 h-5 ${theme === 'dark' ? 'text-amber-400' : 'text-amber-600'}`} />
              <div>
                <span className={`text-sm font-medium ${theme === 'dark' ? 'text-amber-400' : 'text-amber-600'}`}>Progreso</span>
                <div className={`font-semibold ${theme === 'dark' ? 'text-amber-300' : 'text-amber-700'}`}>
                  {currentWeek.completed}/{currentWeek.meals} comidas
                </div>
              </div>
            </div>
          </div>


          <div className={`flex items-center space-x-2 rounded-xl p-1 shadow-sm ${
            theme === 'dark' ? 'bg-gray-700' : 'bg-white'
          }`}>
            <button
              onClick={() => onViewModeChange('grid')}
              className={`p-2 rounded-lg transition-all duration-200 ${
                viewMode === 'grid'
                  ? theme === 'dark' 
                    ? 'bg-blue-900 text-blue-300' 
                    : 'bg-blue-100 text-blue-600'
                  : theme === 'dark'
                    ? 'text-gray-300 hover:bg-gray-600'
                    : 'text-gray-500 hover:bg-gray-100'
              }`}
              title="Vista Cuadrícula"
            >
              <LayoutGrid className="w-5 h-5" />
            </button>
            <button
              onClick={() => onViewModeChange('list')}
              className={`p-2 rounded-lg transition-all duration-200 ${
                viewMode === 'list'
                  ? theme === 'dark' 
                    ? 'bg-blue-900 text-blue-300' 
                    : 'bg-blue-100 text-blue-600'
                  : theme === 'dark'
                    ? 'text-gray-300 hover:bg-gray-600'
                    : 'text-gray-500 hover:bg-gray-100'
              }`}
              title="Vista Lista"
            >
              <List className="w-5 h-5" />
            </button>
            <button
              onClick={() => onViewModeChange('compact')}
              className={`p-2 rounded-lg transition-all duration-200 ${
                viewMode === 'compact'
                  ? 'bg-blue-100 text-blue-600'
                  : 'text-gray-500 hover:bg-gray-100'
              }`}
              title="Vista Compacta"
            >
              <Calendar className="w-5 h-5" />
            </button>
            <button
              onClick={() => onViewModeChange('timeline')}
              className={`p-2 rounded-lg transition-all duration-200 ${
                viewMode === 'timeline'
                  ? 'bg-blue-100 text-blue-600'
                  : 'text-gray-500 hover:bg-gray-100'
              }`}
              title="Vista Línea de Tiempo"
            >
              <Clock className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="relative pt-2">
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-300 relative"
            style={{ width: `${completionRate}%` }}
          >
            <div className="absolute inset-0 bg-white/20 background-shine"></div>
          </div>
        </div>
        <style jsx>{`
          @keyframes shine {
            to {
              background-position: 200% center;
            }
          }
          .background-shine {
            background: linear-gradient(
              90deg,
              rgba(255,255,255,0) 0%,
              rgba(255,255,255,0.4) 50%,
              rgba(255,255,255,0) 100%
            );
            background-size: 200% 100%;
            animation: shine 2s infinite linear;
          }
        `}</style>
      </div>
    </div>
  );
}