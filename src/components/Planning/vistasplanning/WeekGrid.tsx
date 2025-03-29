import React from 'react';
import { ChevronLeft, ChevronRight, Calendar, Plus } from 'lucide-react';

interface WeekDay {
  id: string;
  dayNumber: number;
}

interface Period {
  start: number;
  end: number;
  name: string;
}

interface WeekGridProps {
  weekDays: WeekDay[];
  selectedWeeks: Period[];
  onWeekSelect: (dayNumber: number) => void;
  selectionStart: number | null;
  hoveredWeek: number | null;
  onHover: (dayNumber: number | null) => void;
  getPreviewRange: () => Period | null;
  onAddWeek?: () => void; // New prop for adding a week
}

const WeekGrid: React.FC<WeekGridProps> = ({
  weekDays,
  selectedWeeks,
  onWeekSelect,
  selectionStart,
  hoveredWeek,
  onHover,
  getPreviewRange,
  onAddWeek
}) => {
  const getWeekNumber = (dayNumber: number) => Math.ceil(dayNumber / 7);
  
  const isDaySelected = (dayNumber: number) => {
    return selectedWeeks.some(range => 
      dayNumber >= range.start && dayNumber <= range.end
    );
  };
  
  const isDayInPreview = (dayNumber: number) => {
    if (!selectionStart || !hoveredWeek) return false;
    
    const previewRange = getPreviewRange();
    if (!previewRange) return false;
    
    return dayNumber >= previewRange.start && dayNumber <= previewRange.end;
  };
  
  const getDayColor = (dayNumber: number) => {
    // Find which period this day belongs to
    const period = selectedWeeks.find(range => 
      dayNumber >= range.start && dayNumber <= range.end
    );
    
    if (!period) return '';
    
    // Generate a color based on the period index
    const periodIndex = selectedWeeks.indexOf(period);
    const colors = [
      'bg-indigo-500 text-white',
      'bg-purple-500 text-white',
      'bg-pink-500 text-white',
      'bg-blue-500 text-white',
      'bg-green-500 text-white',
      'bg-yellow-500 text-white',
      'bg-red-500 text-white',
      'bg-teal-500 text-white'
    ];
    
    return colors[periodIndex % colors.length];
  };
  
  const getPreviewColor = () => {
    return 'bg-gray-300 text-gray-800';
  };

  // Check if a day is a weekend (Saturday or Sunday)
  const isWeekend = (dayNumber: number) => {
    const dayOfWeek = ((dayNumber - 1) % 7) + 1;
    return dayOfWeek === 6 || dayOfWeek === 7; // 6 = Saturday, 7 = Sunday
  };

  // Get day of week name
  const getDayOfWeekName = (dayNumber: number) => {
    const dayOfWeek = ((dayNumber - 1) % 7) + 1;
    const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
    return days[dayOfWeek - 1];
  };

  // Generate weeks with days
  const renderCalendar = () => {
    const totalWeeks = Math.ceil(weekDays.length / 7);
    const weeks = [];
    
    // Header with day labels
    const dayLabels = ['Semana', 'Día 1', 'Día 2', 'Día 3', 'Día 4', 'Día 5', 'Día 6', 'Día 7'];
    
    const headerRow = (
      <div className="grid grid-cols-8 gap-4 mb-4" key="header-row">
        {dayLabels.map((label, index) => (
          <div 
            key={`header-${index}`}
            className="flex items-center justify-center p-3 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg shadow-sm"
          >
            {index === 0 ? (
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4 text-blue-600" />
                <span>{label}</span>
              </div>
            ) : (
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4 text-blue-600" />
                <span>{label}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    );
    
    weeks.push(headerRow);
    
    // Generate week rows
    for (let weekNum = 1; weekNum <= totalWeeks; weekNum++) {
      const weekRow = [];
      
      // Week number cell
      const weekStartDay = (weekNum - 1) * 7 + 1;
      const weekEndDay = weekNum * 7;
      const isAnyDaySelected = Array.from({ length: 7 }, (_, i) => weekStartDay + i)
        .some(day => isDaySelected(day));
      const isAnyDayInPreview = Array.from({ length: 7 }, (_, i) => weekStartDay + i)
        .some(day => isDayInPreview(day));
      const isStartWeek = selectionStart && getWeekNumber(selectionStart) === weekNum;
      
      let weekNumberClasses = "flex items-center justify-center h-16 rounded-lg transition-all duration-200 cursor-pointer border shadow-sm";
      
      if (isAnyDaySelected || isAnyDayInPreview || isStartWeek) {
        weekNumberClasses += " bg-blue-100 text-blue-800 font-medium border-blue-200";
      } else {
        weekNumberClasses += " bg-white border-gray-200 text-blue-600 hover:bg-blue-50";
      }
      
      weekRow.push(
        <div 
          key={`week-${weekNum}`}
          className={weekNumberClasses}
        >
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span className="font-medium text-lg">{weekNum}</span>
            </div>
          </div>
        </div>
      );
      
      // Day cells for this week
      for (let dayInWeek = 1; dayInWeek <= 7; dayInWeek++) {
        const dayNumber = (weekNum - 1) * 7 + dayInWeek;
        const isWeekendDay = isWeekend(dayNumber);
        
        let dayClasses = "flex flex-col items-center justify-center h-16 rounded-lg transition-all duration-200 cursor-pointer border shadow-sm";
        
        if (isDaySelected(dayNumber)) {
          dayClasses += ` ${getDayColor(dayNumber)}`;
        } else if (isDayInPreview(dayNumber)) {
          dayClasses += ` ${getPreviewColor()}`;
        } else if (selectionStart === dayNumber) {
          dayClasses += ' bg-blue-200 text-blue-900 border-blue-300';
        } else if (isWeekendDay) {
          dayClasses += ' bg-gray-100 border-gray-200 hover:bg-gray-200 text-gray-700';
        } else {
          dayClasses += ' bg-white border-gray-200 hover:bg-gray-50 text-gray-700';
        }
        
        weekRow.push(
          <div 
            key={`day-${dayNumber}`}
            className={dayClasses}
            onClick={() => onWeekSelect(dayNumber)}
            onMouseEnter={() => onHover(dayNumber)}
            onMouseLeave={() => onHover(null)}
          >
            <span className="text-xl font-semibold">{dayNumber}</span>
            <div className="flex items-center text-xs mt-2 gap-1">
              <Calendar className="w-3 h-3" />
              <span>{getDayOfWeekName(dayNumber)}</span>
            </div>
          </div>
        );
      }
      
      weeks.push(
        <div className="grid grid-cols-8 gap-4 mb-4" key={`week-row-${weekNum}`}>
          {weekRow}
        </div>
      );
    }
    
    return weeks;
  };
  
  // Get the current preview range for display
  const previewRange = getPreviewRange();
  
  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-indigo-100">
      {/* Selection status indicator */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center">
          <span className="font-medium text-indigo-700">
            {selectionStart 
              ? `Seleccionando desde día ${selectionStart}` 
              : ""}
          </span>
        </div>
        
        <div className="flex items-center gap-3">
          {previewRange && (
            <div className="bg-blue-50 px-3 py-1.5 rounded-full text-blue-700 text-sm">
              {`Periodo: Días ${previewRange.start} - ${previewRange.end}`}
            </div>
          )}
          
          {/* Add Week Button */}
          {onAddWeek && (
            <button
              onClick={onAddWeek}
              className="flex items-center gap-1 bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-3 py-1.5 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:from-indigo-600 hover:to-purple-600 transform hover:scale-105"
            >
              <Plus className="w-4 h-4" />
              <span>Añadir Semana</span>
            </button>
          )}
        </div>
      </div>
      
      {/* Calendar grid */}
      <div className="overflow-x-auto pb-2">
        {renderCalendar()}
      </div>
    </div>
  );
};

export default WeekGrid;