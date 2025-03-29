import React from 'react';
import { ChevronLeft, ChevronRight, Calendar, Plus, Clock } from 'lucide-react';
import Button from '../../Common/Button';
import { useTheme } from '../../../contexts/ThemeContext';
import { format, startOfWeek, addDays } from 'date-fns';
import { es } from 'date-fns/locale';

interface CalendarioHeaderProps {
  currentDate: Date;
  onNavigate: (action: 'PREV' | 'NEXT' | 'TODAY') => void;
  onViewChange: (view: string) => void;
  onNewEvent: () => void;
  onShowEntrenador: () => void;
  view: string;
}

const views = [
  { label: 'Mes', value: 'month' },
  { label: 'Semana', value: 'week' },
  { label: 'Día', value: 'day' },
  { label: 'Agenda', value: 'agenda' }
];

export default function CalendarioHeader({ 
  currentDate, 
  onNavigate, 
  onViewChange, 
  onNewEvent,
  onShowEntrenador,
  view 
}: CalendarioHeaderProps) {
  const { theme } = useTheme();

  // Función para determinar el texto del botón según la vista actual
  const getNavigationButtonText = (direction: 'PREV' | 'NEXT') => {
    switch (view) {
      case 'day':
        return direction === 'PREV' ? 'Día anterior' : 'Día siguiente';
      case 'week':
        return direction === 'PREV' ? 'Semana anterior' : 'Semana siguiente';
      case 'month':
        return direction === 'PREV' ? 'Mes anterior' : 'Mes siguiente';
      default:
        return direction === 'PREV' ? 'Anterior' : 'Siguiente';
    }
  };

  // Función para formatear la etiqueta según la vista actual
  const formatDateLabel = () => {
    switch (view) {
      case 'month':
        return format(currentDate, 'MMMM yyyy', { locale: es });
      case 'week': {
        // En react-big-calendar, la semana comienza en domingo por defecto
        // Necesitamos ajustar para que coincida con la vista del calendario
        const weekStart = startOfWeek(currentDate, { weekStartsOn: 0, locale: es });
        const weekEnd = addDays(weekStart, 6);
        return `${format(weekStart, 'd', { locale: es })} - ${format(weekEnd, 'd')} ${format(weekEnd, 'MMMM yyyy', { locale: es })}`;
      }
      case 'day':
        return format(currentDate, "EEEE, d 'de' MMMM yyyy", { locale: es });
      default:
        return format(currentDate, 'MMMM yyyy', { locale: es });
    }
  };

  // Eliminar esta función que no se usa y causa confusión
  // const formatLabel = () => {
  //   const options = { locale: es };
  //   
  //   switch (view) {
  //     case 'month':
  //       return label; // Ya está formateado como "Mes Año"
  //     case 'week':
  //       // Obtener la fecha de inicio y fin de la semana actual
  //       const currentDate = new Date(label.split(' ')[1]);
  //       const startOfWeekDate = startOfWeek(currentDate, { locale: es });
  //       const endOfWeekDate = addDays(startOfWeekDate, 6);
  //       return `${format(startOfWeekDate, 'd', options)} - ${format(endOfWeekDate, 'd')} ${format(endOfWeekDate, 'MMMM yyyy', options)}`;
  //     case 'day':
  //       // Para la vista diaria, mostrar el día completo
  //       const dayDate = new Date(label.split(' ')[1]);
  //       return format(dayDate, "EEEE, d 'de' MMMM yyyy", options);
  //     default:
  //       return label;
  //   }
  // };

  return (
    <div className={`flex items-center justify-between px-8 py-5 ${
      theme === 'dark' 
        ? 'bg-gray-800 border-gray-700/80' 
        : 'bg-white border-gray-200/80'
    } border-b shadow-sm`}>
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-3">
          <div className={`p-2 ${
            theme === 'dark' ? 'bg-indigo-500/20' : 'bg-indigo-50'
          } rounded-xl`}>
            <Calendar className={`w-6 h-6 ${
              theme === 'dark' ? 'text-indigo-300' : 'text-indigo-600'
            }`} />
          </div>
          <h1 className={`text-2xl font-semibold ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>Calendario</h1>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => onNavigate('TODAY')}
            className={`px-4 py-2 text-sm font-medium ${
              theme === 'dark'
                ? 'text-gray-300 bg-gray-700 border-gray-600 hover:bg-gray-600'
                : 'text-gray-700 bg-white border-gray-300 hover:bg-gray-50'
            } border rounded-lg transition-all duration-200 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20`}
          >
            Hoy
          </button>
          <div className={`flex items-center gap-1.5 ${
            theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
          } rounded-lg p-1.5`}>
            <button
              onClick={() => onNavigate('PREV')}
              className={`p-1.5 ${
                theme === 'dark'
                  ? 'text-gray-300 hover:bg-gray-600'
                  : 'text-gray-600 hover:bg-white'
              } hover:shadow-sm rounded-md transition-all duration-200`}
              title={getNavigationButtonText('PREV')}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => onNavigate('NEXT')}
              className={`p-1.5 ${
                theme === 'dark'
                  ? 'text-gray-300 hover:bg-gray-600'
                  : 'text-gray-600 hover:bg-white'
              } hover:shadow-sm rounded-md transition-all duration-200`}
              title={getNavigationButtonText('NEXT')}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          <span className={`text-lg font-semibold min-w-[180px] ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>{formatDateLabel()}</span>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className={`flex gap-1 ${
          theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
        } p-1 rounded-lg`}>
          {views.map((viewOption) => (
            <button
              key={viewOption.value}
              onClick={() => onViewChange(viewOption.value)}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                view === viewOption.value
                  ? theme === 'dark'
                    ? 'bg-gray-600 text-white shadow-sm'
                    : 'bg-white text-gray-900 shadow-sm'
                  : theme === 'dark'
                    ? 'text-gray-300 hover:bg-gray-600 hover:shadow-sm'
                    : 'text-gray-600 hover:bg-white hover:shadow-sm'
              }`}
            >
              {viewOption.label}
            </button>
          ))}
        </div>
        <button
          onClick={onShowEntrenador}
          className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium ${
            theme === 'dark'
              ? 'text-gray-300 bg-gray-700 border-gray-600 hover:bg-gray-600'
              : 'text-gray-700 bg-white border-gray-300 hover:bg-gray-50'
          } border rounded-lg transition-all duration-200`}
        >
          <Clock className="w-4 h-4" />
          Horario Entrenador
        </button>
        <Button 
          onClick={onNewEvent}
          variant="create"
          className="inline-flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Nuevo Evento
        </Button>
      </div>
    </div>
  );
}