import React from 'react';
import clsx from 'clsx';

interface Day {
  id: string;
  dayNumber: number;
}

interface Week {
  weekNumber: number;
  days: Day[];
}

interface WeekRange {
  start: number;
  end: number;
  name: string;
}

// WeekGrid Component
function WeekGrid({ 
  weekDays, 
  selectedWeeks, 
  onWeekSelect, 
  selectionStart,
  hoveredWeek,
  onHover,
  getPreviewRange 
}: {
  weekDays: Week[];
  selectedWeeks: WeekRange[];
  onWeekSelect: (weekNumber: number) => void;
  selectionStart: number | null;
  hoveredWeek: number | null;
  onHover: (weekNumber: number | null) => void;
  getPreviewRange: () => WeekRange | null;
}) {
  const isNumberSelected = (number: number) => {
    return selectedWeeks.some(range => 
      number >= range.start && number <= range.end
    );
  };

  const isNumberInPreview = (number: number) => {
    if (!selectionStart || !hoveredWeek) return false;
    const previewRange = getPreviewRange();
    if (!previewRange) return false;
    return number >= previewRange.start && number <= previewRange.end;
  };

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="p-3 text-left bg-gray-50 border">Semana</th>
            <th className="p-3 text-center bg-gray-50 border">Día 1</th>
            <th className="p-3 text-center bg-gray-50 border">Día 2</th>
            <th className="p-3 text-center bg-gray-50 border">Día 3</th>
            <th className="p-3 text-center bg-gray-50 border">Día 4</th>
            <th className="p-3 text-center bg-gray-50 border">Día 5</th>
            <th className="p-3 text-center bg-gray-50 border">Día 6</th>
            <th className="p-3 text-center bg-gray-50 border">Día 7</th>
          </tr>
        </thead>
        <tbody>
          {weekDays.map((week) => (
            <tr key={week.weekNumber}>
              <td className="p-3 border bg-gray-50 whitespace-nowrap">
                Semana {week.weekNumber}
              </td>
              {week.days.map((day) => (
                <td 
                  key={day.id}
                  className="p-1 border text-center"
                >
                  <button
                    className={clsx(
                      "w-full p-2 rounded transition-all duration-200",
                      isNumberSelected(day.dayNumber) && "bg-green-500 text-white",
                      isNumberInPreview(day.dayNumber) && !isNumberSelected(day.dayNumber) && "bg-green-200",
                      !isNumberSelected(day.dayNumber) && !isNumberInPreview(day.dayNumber) && "hover:bg-gray-100"
                    )}
                    onClick={() => onWeekSelect(day.dayNumber)}
                    onMouseEnter={() => onHover(day.dayNumber)}
                    onMouseLeave={() => onHover(null)}
                  >
                    {day.dayNumber}
                  </button>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// SelectedPeriods Component
function SelectedPeriods({ 
  selectedWeeks, 
  onRemovePeriod,
  onUpdatePeriodName 
}: {
  selectedWeeks: WeekRange[];
  onRemovePeriod: (index: number) => void;
  onUpdatePeriodName: (index: number, name: string) => void;
}) {
  const formatDateRange = (start: number, end: number) => {
    // Calcular semana y día para el inicio
    const startWeek = Math.ceil(start / 7);
    const startDay = start % 7 === 0 ? 7 : start % 7;

    // Calcular semana y día para el fin
    const endWeek = Math.ceil(end / 7);
    const endDay = end % 7 === 0 ? 7 : end % 7;

    return `Semana ${startWeek} (día ${startDay}) - Semana ${endWeek} (día ${endDay})`;
  };

  return (
    <div className="mt-4 bg-blue-50 p-4 rounded-lg">
      <h3 className="text-sm font-medium text-gray-700 mb-2">
        Períodos seleccionados:
      </h3>
      <div className="space-y-2">
        {selectedWeeks.map((range, index) => (
          <div 
            key={index}
            className="flex flex-col bg-white p-2 rounded"
          >
            <div className="flex items-center justify-between mb-2">
              <input
                type="text"
                value={range.name}
                onChange={(e) => onUpdatePeriodName(index, e.target.value)}
                placeholder="Nombre del período"
                className="text-sm text-gray-700 border rounded px-2 py-1 flex-grow mr-2"
              />
              <button 
                className="text-gray-400 hover:text-gray-600"
                onClick={() => onRemovePeriod(index)}
              >
                ×
              </button>
            </div>
            <span className="text-sm text-gray-500">
              {formatDateRange(range.start, range.end)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Main WeekSelector Component
interface WeekSelectorProps {
  selectedWeeks: WeekRange[];
  onWeekSelect: (weekNumber: number) => void;
  onNext: () => void;
  selectionStart: number | null;
  hoveredWeek: number | null;
  setHoveredWeek: (weekNumber: number | null) => void;
  onRemovePeriod: (index: number) => void;
  onUpdatePeriodName: (index: number, name: string) => void;
  getPreviewRange: () => WeekRange | null;
}

export function WeekSelector({ 
  selectedWeeks, 
  onWeekSelect, 
  onNext,
  selectionStart,
  hoveredWeek,
  setHoveredWeek,
  onRemovePeriod,
  onUpdatePeriodName,
  getPreviewRange 
}: WeekSelectorProps) {
  // Helper function to generate week days
  const getWeekDays = (numberOfWeeks: number): Week[] => {
    const weeks: Week[] = [];
    let dayCounter = 1;
    
    for (let weekNum = 1; weekNum <= numberOfWeeks; weekNum++) {
      const days: Day[] = [];
      for (let dayNum = 1; dayNum <= 7; dayNum++) {
        days.push({
          id: `week${weekNum}-day${dayNum}`,
          dayNumber: dayCounter++
        });
      }
      weeks.push({
        weekNumber: weekNum,
        days
      });
    }
    
    return weeks;
  };

  const weekDays = getWeekDays(6); // 6 semanas por defecto

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center gap-2 mb-6">
        <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <h2 className="text-xl font-semibold text-indigo-600">
          Seleccionar Períodos
        </h2>
      </div>
      
      <WeekGrid 
        weekDays={weekDays}
        selectedWeeks={selectedWeeks}
        onWeekSelect={onWeekSelect}
        selectionStart={selectionStart}
        hoveredWeek={hoveredWeek}
        onHover={setHoveredWeek}
        getPreviewRange={getPreviewRange}
      />
      
      <div className="mt-4 flex items-center justify-between">
        <p className="text-sm text-gray-600">
          {selectionStart 
            ? 'Selecciona el día final' 
            : 'Selecciona el día inicial'}
        </p>
      </div>
      
      <SelectedPeriods 
        selectedWeeks={selectedWeeks}
        onRemovePeriod={onRemovePeriod}
        onUpdatePeriodName={onUpdatePeriodName}
      />

      <button
        onClick={onNext}
        className="mt-4 w-full bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition-colors"
        disabled={selectedWeeks.length === 0}
      >
        Siguiente
      </button>
    </div>
  );
}