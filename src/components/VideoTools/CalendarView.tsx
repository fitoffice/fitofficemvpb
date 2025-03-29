import React, { useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock, List, Calendar } from 'lucide-react';

interface CalendarViewProps {
  files: Array<{
    name: string;
    scheduledDate?: Date;
    preview?: string;
    platforms?: Array<{ platformId: string }>;
    description?: string;
  }>;
  currentDate: Date;
  onDateChange: (date: Date) => void;
}

type ViewType = 'month' | 'week' | 'day' | 'agenda';

const CalendarView: React.FC<CalendarViewProps> = ({ files, currentDate, onDateChange }) => {
  const [viewType, setViewType] = useState<ViewType>('month');

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const navigateTime = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (viewType === 'month') {
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
    } else if (viewType === 'week') {
      const days = direction === 'prev' ? -7 : 7;
      newDate.setDate(newDate.getDate() + days);
    } else if (viewType === 'day') {
      const days = direction === 'prev' ? -1 : 1;
      newDate.setDate(newDate.getDate() + days);
    } else if (viewType === 'agenda') {
      // No navigation for agenda view
    }
    onDateChange(newDate);
  };

  const getFilesForDate = (date: Date) => {
    return files.filter(file => {
      if (!file.scheduledDate) return false;
      const fileDate = new Date(file.scheduledDate);
      return fileDate.getDate() === date.getDate() && 
             fileDate.getMonth() === date.getMonth() &&
             fileDate.getFullYear() === date.getFullYear();
    });
  };

  const getWeekDates = () => {
    const dates: Date[] = [];
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());

    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  const renderEvent = (file: typeof files[0]) => {
    if (!file.scheduledDate) return null;
    return (
      <div 
        key={file.name} 
        className="bg-gradient-to-r from-blue-50 via-blue-100 to-blue-50 text-blue-800 p-3 rounded-lg mb-2 
                   text-sm hover:from-blue-100 hover:via-blue-200 hover:to-blue-100 cursor-pointer 
                   transform hover:scale-[1.02] transition-all duration-300 ease-in-out 
                   shadow-sm hover:shadow-lg border border-blue-200 relative overflow-hidden
                   hover:border-blue-300"
        title={file.description || file.name}
      >
        <div className="font-medium truncate text-blue-900">{file.name}</div>
        <div className="flex items-center text-xs text-blue-600 mt-1">
          <Clock className="w-3.5 h-3.5 mr-1.5" />
          {formatTime(new Date(file.scheduledDate))}
        </div>
        {file.platforms && file.platforms.length > 0 && (
          <div className="flex gap-1.5 mt-2 flex-wrap">
            {file.platforms.map(platform => (
              <span 
                key={platform.platformId}
                className="px-2.5 py-0.5 bg-white/70 text-blue-700 rounded-full text-xs font-medium
                         border border-blue-200 shadow-sm hover:shadow-md hover:bg-white
                         transition-all duration-200"
              >
                {platform.platformId}
              </span>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderDayView = (date: Date) => {
    const dayFiles = getFilesForDate(date);
    const hours = Array.from({ length: 24 }, (_, i) => i);

    return (
      <div className="space-y-4 bg-white rounded-lg shadow-sm">
        <div className="grid gap-2">
          {hours.map((hour) => {
            const timeSlot = new Date(date);
            timeSlot.setHours(hour, 0, 0, 0);
            const filesForHour = dayFiles.filter(file => {
              if (!file.scheduledDate) return false;
              const fileDate = new Date(file.scheduledDate);
              return fileDate.getHours() === hour;
            });

            return (
              <div
                key={hour}
                className={`p-4 rounded-xl transition-all duration-300 border
                  ${filesForHour.length > 0 
                    ? 'bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200 shadow-md' 
                    : 'bg-gray-50 border-gray-200 hover:border-blue-200'}
                  hover:shadow-lg hover:bg-blue-50`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-gray-700 flex items-center">
                    <Clock className="w-4 h-4 mr-2 text-blue-500" />
                    {`${hour.toString().padStart(2, '0')}:00`}
                  </span>
                  {filesForHour.length > 0 && (
                    <span className="px-3 py-1 text-xs font-medium text-blue-600 bg-blue-100/80 
                                   rounded-full shadow-inner border border-blue-200">
                      {filesForHour.length} {filesForHour.length === 1 ? 'item' : 'items'}
                    </span>
                  )}
                </div>
                <div className="space-y-2">
                  {filesForHour.map(renderEvent)}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderAgendaView = () => {
    const sortedFiles = files
      .filter(file => file.scheduledDate)
      .sort((a, b) => {
        if (!a.scheduledDate || !b.scheduledDate) return 0;
        return new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime();
      });

    const groupedFiles: { [key: string]: typeof files } = {};
    sortedFiles.forEach(file => {
      if (!file.scheduledDate) return;
      const date = new Date(file.scheduledDate).toLocaleDateString();
      if (!groupedFiles[date]) {
        groupedFiles[date] = [];
      }
      groupedFiles[date].push(file);
    });

    return (
      <div className="space-y-6">
        {Object.entries(groupedFiles).map(([date, files]) => (
          <div
            key={date}
            className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200
                     hover:shadow-lg transition-all duration-300"
          >
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-5 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-blue-500" />
                {new Date(date).toLocaleDateString('default', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric'
                })}
              </h3>
            </div>
            <div className="p-4 space-y-3">
              {files.map(file => (
                <div
                  key={file.name}
                  className="flex items-center space-x-4 p-3 rounded-lg hover:bg-blue-50/50
                           transition-all duration-300 border border-transparent
                           hover:border-blue-200"
                >
                  <div className="flex-shrink-0">
                    <Clock className="w-5 h-5 text-blue-400" />
                  </div>
                  <div className="flex-grow min-w-0">
                    {renderEvent(file)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {currentDate.toLocaleString('default', { 
              month: 'long', 
              year: 'numeric',
              ...(viewType === 'day' && { day: 'numeric' })
            })}
          </h2>
          <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewType('month')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-all duration-200
                ${viewType === 'month' 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-gray-600 hover:text-blue-600'}`}
            >
              <Calendar className="w-4 h-4" />
              <span className="ml-1">Month</span>
            </button>
            <button
              onClick={() => setViewType('week')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-all duration-200
                ${viewType === 'week' 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-gray-600 hover:text-blue-600'}`}
            >
              <CalendarIcon className="w-4 h-4" />
              <span className="ml-1">Week</span>
            </button>
            <button
              onClick={() => setViewType('day')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-all duration-200
                ${viewType === 'day' 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-gray-600 hover:text-blue-600'}`}
            >
              <Clock className="w-4 h-4" />
              <span className="ml-1">Day</span>
            </button>
            <button
              onClick={() => setViewType('agenda')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-all duration-200
                ${viewType === 'agenda' 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-gray-600 hover:text-blue-600'}`}
            >
              <List className="w-4 h-4" />
              <span className="ml-1">Agenda</span>
            </button>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => navigateTime('prev')}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200
                     text-gray-600 hover:text-blue-600"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => navigateTime('next')}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200
                     text-gray-600 hover:text-blue-600"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Calendar Content */}
      <div className="mt-6">
        {viewType === 'month' && (
          <div className="grid grid-cols-7 gap-px bg-gray-200 rounded-lg overflow-hidden">
            {/* Week day headers */}
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div
                key={day}
                className="bg-gray-50 p-2 text-center text-sm font-medium text-gray-600"
              >
                {day}
              </div>
            ))}

            {/* Calendar days */}
            {Array.from({ length: 42 }, (_, i) => {
              const dayOffset = i - firstDayOfMonth;
              const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1 + dayOffset);
              const isCurrentMonth = date.getMonth() === currentDate.getMonth();
              const isToday = new Date().toDateString() === date.toDateString();
              const dayFiles = getFilesForDate(date);

              return (
                <div
                  key={i}
                  className={`min-h-[120px] bg-white p-2 transition-all duration-200
                    ${!isCurrentMonth ? 'opacity-50' : ''}
                    ${isToday ? 'ring-2 ring-blue-500 ring-inset' : ''}
                    hover:bg-blue-50`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-sm font-medium ${
                        isToday ? 'text-blue-600' : 'text-gray-700'
                      }`}
                    >
                      {date.getDate()}
                    </span>
                    {dayFiles.length > 0 && (
                      <span className="flex h-5 w-5 items-center justify-center text-xs
                                     bg-blue-100 text-blue-600 rounded-full">
                        {dayFiles.length}
                      </span>
                    )}
                  </div>
                  <div className="mt-2 space-y-1 overflow-y-auto max-h-[80px]">
                    {dayFiles.map(renderEvent)}
                  </div>
                </div>
              );
            })}
          </div>
        )}
        {viewType === 'week' && (
          <div className="space-y-4">
            {/* Week View */}
            {getWeekDates().map((date, index) => (
              <div
                key={date.toISOString()}
                className={`p-4 rounded-lg transition-all duration-200
                  ${new Date().toDateString() === date.toDateString()
                    ? 'bg-blue-50 ring-1 ring-blue-200'
                    : 'bg-gray-50 hover:bg-gray-100'}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900">
                    {date.toLocaleDateString('default', { weekday: 'long', month: 'short', day: 'numeric' })}
                  </span>
                </div>
                <div className="space-y-2">
                  {getFilesForDate(date).map(renderEvent)}
                </div>
              </div>
            ))}
          </div>
        )}
        {viewType === 'day' && renderDayView(currentDate)}
        {viewType === 'agenda' && renderAgendaView()}
      </div>
    </div>
  );
};

export default CalendarView;
