import React, { useState, useEffect } from 'react';
import { X, File, Video, Image, Plus, Minus, Calendar, InfoIcon, FileIcon, CalendarDaysIcon, ClockIcon, LayoutIcon, CalendarPlusIcon } from 'lucide-react';
import KanbanBoard from './KanbanBoard';

interface FileWithPreview extends File {
  preview?: string;
  scheduledDate?: Date;
  type: string;
  name: string;
  size: number;
}

interface UploadedFilesPopupProps {
  isOpen: boolean;
  onClose: () => void;
  files: FileWithPreview[];
  onSchedule: (files: FileWithPreview[]) => void;
}

interface TimeSlot {
  hour: string;
  minute: string;
}

interface ScheduleConfig {
  startDate: string;
  frequency: string;
  postsPerDay: number;
  timeSlots: TimeSlot[];
}

const UploadedFilesPopup: React.FC<UploadedFilesPopupProps> = ({ isOpen, onClose, files: initialFiles, onSchedule }) => {
  const [files, setFiles] = useState<FileWithPreview[]>(initialFiles);
  const [scheduleConfig, setScheduleConfig] = useState<ScheduleConfig>({
    startDate: new Date().toISOString().split('T')[0],
    frequency: 'daily',
    postsPerDay: 1,
    timeSlots: [{ hour: '09', minute: '00' }]
  });

  useEffect(() => {
    setFiles(initialFiles);
  }, [initialFiles]);

  if (!isOpen) return null;

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return <Image className="w-6 h-6 text-blue-500" />;
    if (fileType.startsWith('video/')) return <Video className="w-6 h-6 text-purple-500" />;
    return <File className="w-6 h-6 text-gray-500" />;
  };

  const calculateScheduleInfo = () => {
    const totalFiles = files.length;
    const postsPerDay = scheduleConfig.postsPerDay;
    let daysNeeded = Math.ceil(totalFiles / postsPerDay);
    let endDate = new Date(scheduleConfig.startDate);
    
    // Calcular la fecha final según la frecuencia
    switch (scheduleConfig.frequency) {
      case 'daily':
        endDate.setDate(endDate.getDate() + daysNeeded - 1);
        break;
      case 'alternate':
        endDate.setDate(endDate.getDate() + (daysNeeded - 1) * 2);
        break;
      case 'weekly':
        endDate.setDate(endDate.getDate() + (daysNeeded - 1) * 7);
        break;
      case 'biweekly':
        endDate.setDate(endDate.getDate() + (daysNeeded - 1) * 14);
        break;
      case 'monthly':
        endDate.setMonth(endDate.getMonth() + daysNeeded - 1);
        break;
    }

    const formatDate = (date: Date) => {
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    };

    const startDateFormatted = formatDate(new Date(scheduleConfig.startDate));
    const endDateFormatted = formatDate(endDate);

    let message = '';
    if (daysNeeded <= 1) {
      message = `Todas las publicaciones se programarán para el ${startDateFormatted}`;
    } else {
      message = `Las publicaciones se distribuirán desde el ${startDateFormatted} hasta el ${endDateFormatted}`;
    }

    const timeSlotInfo = scheduleConfig.timeSlots.map((slot, index) => 
      `${slot.hour}:${slot.minute}`
    ).join(', ');

    return {
      message,
      timeSlotInfo,
      daysNeeded,
      isValid: true
    };
  };

  const handlePostsPerDayChange = (value: number) => {
    const maxPostsPerDay = Math.min(5, files.length); // Limitar al número de archivos o 5, lo que sea menor
    const newValue = Math.max(1, Math.min(maxPostsPerDay, value));
    const currentTimeSlots = [...scheduleConfig.timeSlots];
    
    if (newValue > currentTimeSlots.length) {
      while (currentTimeSlots.length < newValue) {
        const lastSlot = currentTimeSlots[currentTimeSlots.length - 1];
        let newHour = lastSlot ? parseInt(lastSlot.hour) + 2 : 9;
        if (newHour > 23) newHour = 9; // Reiniciar a 9 AM si pasa de las 23
        currentTimeSlots.push({ 
          hour: newHour.toString().padStart(2, '0'), 
          minute: '00' 
        });
      }
    } else {
      currentTimeSlots.splice(newValue);
    }

    setScheduleConfig({
      ...scheduleConfig,
      postsPerDay: newValue,
      timeSlots: currentTimeSlots
    });
  };

  const handleTimeSlotChange = (index: number, type: 'hour' | 'minute', value: string) => {
    const newTimeSlots = [...scheduleConfig.timeSlots];
    newTimeSlots[index] = {
      ...newTimeSlots[index],
      [type]: value
    };
    setScheduleConfig({
      ...scheduleConfig,
      timeSlots: newTimeSlots
    });
  };

  const handleMoveFile = (file: FileWithPreview, fromDate: string, toDate: string) => {
    const updatedFiles = [...files];
    const fileIndex = updatedFiles.findIndex(f => 
      f.name === file.name && 
      f.size === file.size && 
      f.type === file.type
    );
    
    if (fileIndex !== -1) {
      const targetDateFiles = groupFilesByDate()[toDate] || [];
      
      // Crear un mapa de horarios ocupados
      const occupiedTimeSlots = new Set(
        targetDateFiles.map(f => `${f.scheduledTime?.hour}:${f.scheduledTime?.minute}`)
      );

      // Encontrar un horario disponible
      let availableSlot = null;
      
      // Primero intentar mantener la misma hora si está disponible
      if (file.scheduledTime && 
          !occupiedTimeSlots.has(`${file.scheduledTime.hour}:${file.scheduledTime.minute}`)) {
        availableSlot = file.scheduledTime;
      }
      
      // Si no está disponible la misma hora, buscar el primer horario libre
      if (!availableSlot) {
        for (const slot of scheduleConfig.timeSlots) {
          if (!occupiedTimeSlots.has(`${slot.hour}:${slot.minute}`)) {
            availableSlot = slot;
            break;
          }
        }
      }
      
      // Si aún no hay horario disponible, crear uno nuevo
      if (!availableSlot) {
        const lastSlot = scheduleConfig.timeSlots[scheduleConfig.timeSlots.length - 1];
        let hour = parseInt(lastSlot.hour);
        let minute = parseInt(lastSlot.minute) + 15;
        
        if (minute >= 60) {
          minute = 0;
          hour = (hour + 1) % 24;
        }
        
        availableSlot = {
          hour: hour.toString().padStart(2, '0'),
          minute: minute.toString().padStart(2, '0')
        };
        
        // Actualizar los horarios disponibles
        setScheduleConfig(prev => ({
          ...prev,
          timeSlots: [...prev.timeSlots, availableSlot]
        }));
      }

      // Actualizar el archivo con el nuevo horario
      updatedFiles[fileIndex] = {
        ...file,
        scheduledTime: {
          ...availableSlot,
          date: toDate
        }
      };

      console.log(`Moviendo archivo de ${fromDate} a ${toDate} con horario ${availableSlot.hour}:${availableSlot.minute}`);
      setFiles(updatedFiles);
    }
  };

  const groupFilesByDate = () => {
    const groups: { [key: string]: typeof files } = {};
    const startDate = new Date(scheduleConfig.startDate);
    let currentDate = new Date(startDate);
    let fileIndex = 0;

    // Calcular el número total de días necesarios
    const totalDays = Math.ceil(files.length / scheduleConfig.postsPerDay);
    
    // Crear grupos para cada día
    for (let day = 0; day < totalDays && fileIndex < files.length; day++) {
      const dateKey = currentDate.toISOString().split('T')[0];
      groups[dateKey] = [];
      
      // Asignar archivos al día actual
      for (let post = 0; post < scheduleConfig.postsPerDay && fileIndex < files.length; post++) {
        groups[dateKey].push({
          ...files[fileIndex],
          scheduledTime: scheduleConfig.timeSlots[post] || scheduleConfig.timeSlots[0]
        });
        fileIndex++;
      }

      // Avanzar al siguiente día según la frecuencia
      switch (scheduleConfig.frequency) {
        case 'alternate':
          currentDate.setDate(currentDate.getDate() + 2);
          break;
        case 'weekly':
          currentDate.setDate(currentDate.getDate() + 7);
          break;
        case 'biweekly':
          currentDate.setDate(currentDate.getDate() + 14);
          break;
        case 'monthly':
          currentDate.setMonth(currentDate.getMonth() + 1);
          break;
        default: // daily
          currentDate.setDate(currentDate.getDate() + 1);
      }
    }

    return groups;
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    return `${days[date.getDay()]}, ${date.getDate()} de ${months[date.getMonth()]}`;
  };

  const handleSchedule = () => {
    onSchedule(files);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
      <div className="bg-white rounded-xl shadow-2xl w-[800px] max-h-[90vh] overflow-hidden animate-slideIn">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-blue-600 via-blue-500 to-purple-500">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Programar Publicaciones 
              <span className="text-sm font-normal bg-white/20 px-2 py-0.5 rounded-full">
                {files.length} archivos
              </span>
            </h2>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-white/10 rounded-lg transition-all duration-200 hover:rotate-90"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        <div className="flex flex-col">
          {/* Panel de Configuración */}
          <div className="p-6 space-y-6 bg-gradient-to-b from-gray-50/50 to-white">
            {/* Primera fila */}
            <div className="grid grid-cols-3 gap-6">
              {/* Fecha de inicio */}
              <div className="group">
                <label className="block text-sm text-gray-600 mb-1.5 group-hover:text-blue-600 transition-colors">
                  Fecha de inicio
                </label>
                <input
                  type="date"
                  value={scheduleConfig.startDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setScheduleConfig({
                    ...scheduleConfig,
                    startDate: e.target.value
                  })}
                  className="w-full px-3 py-1.5 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-300 transition-all duration-200"
                />
              </div>

              {/* Frecuencia */}
              <div className="group">
                <label className="block text-sm text-gray-600 mb-1.5 group-hover:text-blue-600 transition-colors">
                  Frecuencia de publicación
                </label>
                <select
                  value={scheduleConfig.frequency}
                  onChange={(e) => setScheduleConfig({
                    ...scheduleConfig,
                    frequency: e.target.value
                  })}
                  className="w-full px-3 py-1.5 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-300 transition-all duration-200 bg-white"
                >
                  <option value="daily">Diaria</option>
                  <option value="alternate">Días alternos</option>
                  <option value="weekly">Semanal</option>
                  <option value="biweekly">Quincenal</option>
                  <option value="monthly">Mensual</option>
                </select>
              </div>

              {/* Publicaciones por día */}
              <div className="group">
                <label className="block text-sm text-gray-600 mb-1.5 group-hover:text-blue-600 transition-colors">
                  Publicaciones por día (máx. {Math.min(5, files.length)})
                </label>
                <div className="flex items-center">
                  <button
                    onClick={() => handlePostsPerDayChange(scheduleConfig.postsPerDay - 1)}
                    className="p-1.5 border border-gray-300 rounded-l hover:bg-gray-50 hover:border-blue-300 transition-all duration-200 disabled:opacity-50"
                    disabled={scheduleConfig.postsPerDay <= 1}
                  >
                    <Minus className={`w-4 h-4 ${scheduleConfig.postsPerDay <= 1 ? 'text-gray-300' : 'text-gray-600'}`} />
                  </button>
                  <div className="px-4 py-1.5 border-t border-b border-gray-300 text-center min-w-[40px] bg-white">
                    {scheduleConfig.postsPerDay}
                  </div>
                  <button
                    onClick={() => handlePostsPerDayChange(scheduleConfig.postsPerDay + 1)}
                    className="p-1.5 border border-gray-300 rounded-r hover:bg-gray-50 hover:border-blue-300 transition-all duration-200 disabled:opacity-50"
                    disabled={scheduleConfig.postsPerDay >= Math.min(5, files.length)}
                  >
                    <Plus className={`w-4 h-4 ${scheduleConfig.postsPerDay >= Math.min(5, files.length) ? 'text-gray-300' : 'text-gray-600'}`} />
                  </button>
                </div>
              </div>
            </div>

            {/* Horarios */}
            <div className="group">
              <label className="block text-sm text-gray-600 mb-1.5 group-hover:text-blue-600 transition-colors">
                Horarios de publicación
              </label>
              <div className="flex flex-wrap gap-2">
                {scheduleConfig.timeSlots.map((slot, index) => (
                  <div key={index} className="flex items-center space-x-1 bg-white rounded shadow-sm hover:shadow transition-all duration-200">
                    <select
                      value={slot.hour}
                      onChange={(e) => handleTimeSlotChange(index, 'hour', e.target.value)}
                      className="px-2 py-1.5 border border-gray-300 rounded-l focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-300 transition-all duration-200"
                    >
                      {Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0')).map(hour => (
                        <option key={hour} value={hour}>{hour}</option>
                      ))}
                    </select>
                    <span className="text-gray-400">:</span>
                    <select
                      value={slot.minute}
                      onChange={(e) => handleTimeSlotChange(index, 'minute', e.target.value)}
                      className="px-2 py-1.5 border border-gray-300 rounded-r focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-300 transition-all duration-200"
                    >
                      {['00', '15', '30', '45'].map(minute => (
                        <option key={minute} value={minute}>{minute}</option>
                      ))}
                    </select>
                    <span className="text-xs text-gray-500 ml-1 px-1.5">#{index + 1}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Resumen */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-4 space-y-2 border border-blue-100">
              <h4 className="text-sm font-medium text-blue-900 flex items-center gap-2">
                <InfoIcon className="w-4 h-4" />
                Resumen de programación
              </h4>
              <p className="text-sm text-blue-800">{calculateScheduleInfo().message}</p>
              <div className="flex gap-2 text-xs">
                <span className="px-2 py-1 bg-blue-100/80 text-blue-800 rounded-full flex items-center gap-1">
                  <FileIcon className="w-3 h-3" />
                  {files.length} archivos
                </span>
                <span className="px-2 py-1 bg-purple-100/80 text-purple-800 rounded-full flex items-center gap-1">
                  <CalendarDaysIcon className="w-3 h-3" />
                  {calculateScheduleInfo().daysNeeded} {calculateScheduleInfo().daysNeeded === 1 ? 'día' : 'días'}
                </span>
                <span className="px-2 py-1 bg-indigo-100/80 text-indigo-800 rounded-full flex items-center gap-1">
                  <ClockIcon className="w-3 h-3" />
                  {scheduleConfig.postsPerDay} {scheduleConfig.postsPerDay === 1 ? 'publicación' : 'publicaciones'}/día
                </span>
              </div>
            </div>
          </div>

          {/* Separador */}
          <div className="border-t border-gray-200"></div>

          {/* Título de sección y botón */}
          <div className="px-6 py-4 flex justify-between items-center bg-white">
            <h3 className="text-base font-medium text-gray-800 flex items-center gap-2">
              <LayoutIcon className="w-4 h-4" />
              Programación por Días
            </h3>
            <button
              onClick={handleSchedule}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center gap-2 shadow-sm hover:shadow"
            >
              <CalendarPlusIcon className="w-4 h-4" />
              Programar Publicaciones
            </button>
          </div>

          {/* Vista Kanban */}
          <KanbanBoard
            groupedFiles={groupFilesByDate()}
            formatDate={formatDate}
            formatFileSize={formatFileSize}
            getFileIcon={getFileIcon}
            onMoveFile={handleMoveFile}
          />
        </div>

        {/* Estilos personalizados para animaciones */}
        <style jsx>{`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes slideIn {
            from { transform: translateY(-10px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
          .animate-fadeIn {
            animation: fadeIn 0.3s ease-out;
          }
          .animate-slideIn {
            animation: slideIn 0.3s ease-out;
          }
        `}</style>
      </div>
    </div>
  );
};

export default UploadedFilesPopup;
