import React, { useState, useCallback } from 'react';
import { Upload, Calendar, ChevronLeft, ChevronRight, Facebook, Instagram, Twitter, Linkedin, Youtube, Clock, Trash2, AlertCircle, Check, X, Settings, Globe, TrendingUp, LayoutGrid, AlignStartVertical, Minimize2, Maximize2, CalendarDays, CalendarCheck, Info } from 'lucide-react';
import CalendarView from './CalendarView';
import TimelineView from './TimelineView';
import { FileDetails } from './FileDetails';
import { BrandTiktok } from './icons/BrandTiktok';
import AIContentAnalyzer from './AIContentAnalyzer';

interface FileWithPreview extends File {
  preview?: string;
  scheduledDate?: Date;
  platforms?: PlatformConfig[];
  type: string;
  name: string;
  description?: string;
  hashtags?: string[];
  status?: 'pending' | 'scheduled' | 'error';
  scheduledTime?: { hour: string; minute: string; };
  additionalTimes?: { hour: string; minute: string; }[];
}

interface Platform {
  id: string;
  name: string;
  color: string;
  icon: React.ElementType;
  enabled: boolean;
  recommendedFormats: string[];
  maxFileSize: number;
  maxDuration: number;
}

interface PlatformConfig {
  platformId: string;
  customText?: string;
  customHashtags?: string[];
  bestTimeToPost?: string;
}

interface ScheduleConfig {
  startDate: string;
  frequency: string;
  postsPerDay: number;
  timeSlots: { hour: string; minute: string; }[];
}

interface MultiPostSchedule {
  enabled: boolean;
  times: { hour: string; minute: string; }[];
}

type ViewType = 'list' | 'calendar' | 'timeline';

const ContentPlanner: React.FC = () => {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [selectedFileForDetails, setSelectedFileForDetails] = useState<string | null>(null);
  const [selectedFileForAI, setSelectedFileForAI] = useState<FileWithPreview | null>(null);

  const handleCheckboxChange = (fileName: string) => {
    setSelectedFiles(prev => {
      if (prev.includes(fileName)) {
        return prev.filter(f => f !== fileName);
      } else {
        return [...prev, fileName];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedFiles.length === files.length) {
      setSelectedFiles([]);
    } else {
      setSelectedFiles(files.map(f => f.name));
    }
  };

  const handleFileSelect = (file: string) => {
    if (selectedFileForDetails === file) {
      setSelectedFileForDetails(null);
      setSelectedFileForAI(null);
    } else {
      setSelectedFileForDetails(file);
      const selectedFile = files.find(f => f.name === file);
      if (selectedFile) {
        setSelectedFileForAI(selectedFile);
      }
    }
  };

  const handleAIAnalysisComplete = (analysis: any) => {
    setFiles(prevFiles => 
      prevFiles.map(file => {
        if (file.name === selectedFileForDetails) {
          return {
            ...file,
            description: analysis.description,
            hashtags: analysis.hashtags,
            platforms: file.platforms?.map(platform => ({
              ...platform,
              customText: analysis.platformSpecificContent[platform.platformId]?.text,
              customHashtags: analysis.platformSpecificContent[platform.platformId]?.hashtags,
            }))
          };
        }
        return file;
      })
    );
  };

  const [viewType, setViewType] = useState<ViewType>('list');
  const [selectedFrequency, setSelectedFrequency] = useState('daily');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('morning');
  const [showCalendarView, setShowCalendarView] = useState(false);
  const [isUploadMinimized, setIsUploadMinimized] = useState(false);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [selectedDateTime, setSelectedDateTime] = useState<Date | null>(null);
  const [isBulkScheduling, setIsBulkScheduling] = useState(false);
  const [bulkScheduleInterval, setBulkScheduleInterval] = useState(30); // minutos entre publicaciones
  const [publishFrequency, setPublishFrequency] = useState(1); // días entre publicaciones
  const [publishTime, setPublishTime] = useState('09:00'); // hora de publicación por defecto
  const [multiPostSchedule, setMultiPostSchedule] = useState<MultiPostSchedule>({
    enabled: false,
    times: [
      { hour: '09', minute: '00' },
      { hour: '12', minute: '00' },
      { hour: '15', minute: '00' }
    ]
  });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const filesWithPreview = acceptedFiles.map(file => ({
      ...file,
      preview: URL.createObjectURL(file),
      platforms: [],
      type: file.type || '',
      name: file.name || 'Archivo sin nombre',
      scheduledTime: { hour: '09', minute: '00' }
    }));
    setFiles(prev => [...prev, ...filesWithPreview]);
  }, []);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    onDrop(droppedFiles);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      onDrop(selectedFiles);
    }
  };

  const handleDateChange = (date: Date, fileIndex: number) => {
    setFiles(prev => prev.map((file, idx) => 
      idx === fileIndex ? { ...file, scheduledDate: date } : file
    ));
  };

  const handlePlatformToggle = (platformId: string, fileIndex: number) => {
    setFiles(prev => prev.map((file, idx) => {
      if (idx === fileIndex) {
        const platforms = file.platforms || [];
        const newPlatforms = platforms.includes(p => p.platformId === platformId)
          ? platforms.filter(p => p.platformId !== platformId)
          : [...platforms, { platformId }];
        return { ...file, platforms: newPlatforms };
      }
      return file;
    }));
  };

  const handleDescriptionChange = (description: string, fileIndex: number) => {
    setFiles(prev => prev.map((file, idx) => 
      idx === fileIndex ? { ...file, description } : file
    ));
  };

  const handleHashtagsChange = (hashtags: string, fileIndex: number) => {
    setFiles(prev => prev.map((file, idx) => 
      idx === fileIndex ? { ...file, hashtags: hashtags.split(' ').filter(tag => tag.startsWith('#')) } : file
    ));
  };

  const handleDeleteFile = (fileIndex: number) => {
    setFiles(prev => prev.filter((_, idx) => idx !== fileIndex));
  };

  const handleScheduleContent = (fileIndex: number) => {
    setFiles(prev => prev.map((file, idx) => 
      idx === fileIndex ? { ...file, status: 'scheduled' } : file
    ));
  };

  const generateSuggestedDates = () => {
    const dates = [];
    const startDate = new Date();
    
    // Establecer la hora según el horario seleccionado
    let hour = 9; // Por defecto mañana
    switch (selectedTimeSlot) {
      case 'morning':
        hour = 9;
        break;
      case 'noon':
        hour = 13;
        break;
      case 'afternoon':
        hour = 17;
        break;
      case 'evening':
        hour = 20;
        break;
    }

    for (let i = 0; i < files.length; i++) {
      const date = new Date(startDate);
      // Establecer la hora seleccionada
      date.setHours(hour, 0, 0, 0);

      // Calcular el incremento de días según la frecuencia
      switch (selectedFrequency) {
        case 'daily':
          date.setDate(date.getDate() + i);
          break;
        case 'alternate':
          date.setDate(date.getDate() + (i * 2));
          break;
        case 'weekly':
          date.setDate(date.getDate() + (i * 7));
          break;
        case 'biweekly':
          date.setDate(date.getDate() + (i * 14));
          break;
        case 'monthly':
          date.setMonth(date.getMonth() + i);
          break;
      }
      
      dates.push(date);
    }
    
    setFiles(prev => prev.map((file, idx) => ({
      ...file,
      scheduledDate: dates[idx]
    })));
  };

  const handleStatusChange = (fileId: string, newStatus: 'pending' | 'scheduled' | 'error') => {
    setFiles(prevFiles => 
      prevFiles.map(file => 
        file.name === fileId ? { ...file, status: newStatus } : file
      )
    );
  };

  const handleDateAssignment = (fileName: string, date: Date) => {
    setFiles(prevFiles => 
      prevFiles.map(file => 
        file.name === fileName 
          ? { ...file, scheduledDate: date }
          : file
      )
    );
  };

  // Esta función se usaba para asignar fecha única o incremental, pero no respeta el multiPostSchedule:
  // const handleBulkDateAssignment = (startDate: Date) => {
  //   const unscheduledFiles = selectedFiles.length > 0 
  //     ? files.filter(file => selectedFiles.includes(file.name))
  //     : files.filter(file => !file.scheduledDate);
    
  //   setFiles(prevFiles => 
  //     prevFiles.map(file => {
  //       if (!selectedFiles.includes(file.name)) return file;
  //       
  //       // Calcular la fecha para este archivo
  //       const fileDate = new Date(startDate);
  //       // Añadir días según la frecuencia y el índice
  //       const index = unscheduledFiles.findIndex(f => f.name === file.name);
  //       fileDate.setDate(fileDate.getDate() + (index * publishFrequency));
  //       
  //       // Establecer la hora específica
  //       const [hours, minutes] = publishTime.split(':');
  //       fileDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
  //       
  //       return {
  //         ...file,
  //         scheduledDate: fileDate
  //       };
  //     })
  //   );
  //   
  //   setSelectedFiles([]);
  // };

  // Reemplazamos la programación con la función que sí respeta multiPostSchedule:

  const handleSchedulePost = () => {
    distributeFiles();
  };

  // Este método usa multiPostSchedule para asignar múltiples publicaciones en el mismo día.
  const distributeFiles = () => {
    if (!selectedDateTime || !selectedFiles.length) return;

    console.log('🚀 Iniciando distribución de archivos');
    console.log('📅 Fecha inicial:', selectedDateTime);
    console.log('📂 Archivos seleccionados:', selectedFiles.length);

    const postsPerDay = multiPostSchedule.enabled ? multiPostSchedule.times.length : 1;
    console.log('📊 Publicaciones por día:', postsPerDay);
    console.log('⏰ Horarios configurados:', multiPostSchedule.enabled ? multiPostSchedule.times : [publishTime]);

    const selectedFilesList = files.filter(f => selectedFiles.includes(f.name));
    console.log('📑 Lista de archivos a programar:', selectedFilesList.map(f => f.name));
    
    // Crear un array de fechas y horarios
    const schedule = [];
    let currentDate = new Date(selectedDateTime);
    let fileIndex = 0;
    let dayCount = 0;

    console.log('🎯 Comenzando distribución por días');

    while (fileIndex < selectedFilesList.length) {
      console.log(`\n📅 Día ${dayCount + 1}:`, currentDate.toLocaleDateString());
      
      const dayFiles = selectedFilesList.slice(fileIndex, fileIndex + postsPerDay);
      console.log('   📂 Archivos para este día:', dayFiles.map(f => f.name));
      
      // Distribuir los archivos del día entre los horarios disponibles
      dayFiles.forEach((file, index) => {
        const timeSlot = multiPostSchedule.enabled
          ? multiPostSchedule.times[index % multiPostSchedule.times.length]
          : { hour: publishTime.split(':')[0], minute: publishTime.split(':')[1] };

        console.log(`   ⏰ Asignando horario para ${file.name}:`, timeSlot);

        const scheduleDate = new Date(currentDate);
        scheduleDate.setHours(
          parseInt(timeSlot.hour),
          parseInt(timeSlot.minute),
          0,
          0
        );

        console.log(`   📌 Fecha y hora programada: ${scheduleDate.toLocaleString()}`);

        schedule.push({
          file,
          date: scheduleDate,
          timeSlot
        });
      });

      fileIndex += postsPerDay;
      if (fileIndex < selectedFilesList.length) {
        dayCount++;
        currentDate = new Date(selectedDateTime);
        currentDate.setDate(currentDate.getDate() + (dayCount * publishFrequency));
        console.log(`   ⏭️ Avanzando al siguiente día. Nueva fecha: ${currentDate.toLocaleDateString()}`);
      }
    }

    console.log('\n✅ Distribución completada');
    console.log('📊 Resumen de programación:', schedule.map(s => ({
      archivo: s.file.name,
      fecha: s.date.toLocaleString(),
      horario: `${s.timeSlot.hour}:${s.timeSlot.minute}`
    })));

    // Actualizar los archivos con las fechas programadas
    const updatedFiles = files.map(file => {
      const scheduledPost = schedule.find(s => s.file.name === file.name);
      if (scheduledPost) {
        console.log(`🔄 Actualizando archivo ${file.name} con fecha: ${scheduledPost.date.toLocaleString()}`);
        return {
          ...file,
          scheduledDate: scheduledPost.date,
          scheduledTime: scheduledPost.timeSlot,
          status: 'scheduled'
        };
      }
      return file;
    });

    setFiles(updatedFiles);
    setSelectedDateTime(null);
    setSelectedFiles([]);
    console.log('✨ Proceso de programación completado');
  };

  const formatScheduleDate = (date: Date, timeSlot: { hour: string, minute: string }) => {
    const formattedDate = new Date(date);
    formattedDate.setHours(parseInt(timeSlot.hour), parseInt(timeSlot.minute), 0, 0);
    return formattedDate;
  };

  const getSchedulePreview = () => {
    if (!selectedDateTime || !selectedFiles.length) return [];

    console.log('🔍 Generando vista previa de programación');
    console.log('📅 Fecha inicial:', selectedDateTime);
    
    const postsPerDay = multiPostSchedule.enabled ? multiPostSchedule.times.length : 1;
    const selectedFilesList = files.filter(f => selectedFiles.includes(f.name));
    
    console.log('📊 Configuración:', {
      archivosSeleccionados: selectedFilesList.length,
      publicacionesPorDia: postsPerDay,
      horarios: multiPostSchedule.enabled ? multiPostSchedule.times : [publishTime]
    });

    const preview = [];
    let currentDate = new Date(selectedDateTime);
    let fileIndex = 0;
    let dayCount = 0;

    console.log('🎯 Comenzando distribución por días');

    while (fileIndex < selectedFilesList.length) {
      console.log(`\n📅 Previsualización Día ${dayCount + 1}:`, currentDate.toLocaleDateString());
      
      const dayFiles = selectedFilesList.slice(fileIndex, fileIndex + postsPerDay);
      console.log('   📂 Archivos:', dayFiles.map(f => f.name));
      
      dayFiles.forEach((file, index) => {
        const timeSlot = multiPostSchedule.enabled
          ? multiPostSchedule.times[index % multiPostSchedule.times.length]
          : { hour: publishTime.split(':')[0], minute: publishTime.split(':')[1] };

        const scheduleDate = formatScheduleDate(currentDate, timeSlot);
        console.log(`   ⏰ ${file.name} -> ${scheduleDate.toLocaleString()}`);

        preview.push({
          fileName: file.name,
          scheduledDate: scheduleDate
        });
      });

      fileIndex += postsPerDay;
      if (fileIndex < selectedFilesList.length) {
        dayCount++;
        currentDate = new Date(selectedDateTime);
        currentDate.setDate(currentDate.getDate() + (dayCount * publishFrequency));
        console.log(`   ⏭️ Siguiente día: ${currentDate.toLocaleDateString()}`);
      }
    }

    console.log('\n📋 Vista previa generada:', preview);
    return preview;
  };

  const calculatePublicationDays = () => {
    if (!selectedFiles.length) return null;
    
    const postsPerDay = multiPostSchedule.enabled ? multiPostSchedule.times.length : 1;
    const totalPosts = selectedFiles.length;
    const daysNeeded = Math.ceil(totalPosts / postsPerDay);
    
    return (daysNeeded - 1) * publishFrequency + 1;
  };

  const addTimeSlot = () => {
    if (multiPostSchedule.times.length < 5) {
      const defaultHours = ['09', '12', '15', '17', '19'];
      const nextIndex = multiPostSchedule.times.length;
      setMultiPostSchedule(prev => ({
        ...prev,
        times: [...prev.times, { hour: defaultHours[nextIndex], minute: '00' }]
      }));
    }
  };

  const removeTimeSlot = (index: number) => {
    setMultiPostSchedule(prev => ({
      ...prev,
      times: prev.times.filter((_, i) => i !== index)
    }));
  };

  const updateTimeSlot = (index: number, hour: string, minute: string) => {
    setMultiPostSchedule(prev => ({
      ...prev,
      times: prev.times.map((time, i) => 
        i === index ? { hour, minute } : time
      )
    }));
  };

  const renderFilePreview = (file: FileWithPreview) => {
    if (!file) return null;

    if (file.type?.startsWith('image/')) {
      return (
        <img
          src={file.preview}
          alt={file.name}
          className="w-full h-full object-cover"
        />
      );
    }

    return (
      <div className="flex items-center justify-center h-full">
        <span className="text-sm text-gray-500">
          {file.name}
        </span>
      </div>
    );
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDuration = (seconds: number): string => {
    if (seconds < 60) return `${seconds} segundos`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutos`;
    return `${Math.floor(seconds / 3600)} horas`;
  };

  const getBestTimeToPost = (platformId: string): string => {
    const times: { [key: string]: string } = {
      'facebook': '12:00 - 15:00',
      'instagram': '11:00 - 13:00, 19:00 - 21:00',
      'twitter': '09:00 - 11:00',
      'linkedin': '10:00 - 12:00',
      'youtube': '14:00 - 16:00'
    };
    return times[platformId] || 'No disponible';
  };

  const isFileCompatible = (file: FileWithPreview, platform: Platform): boolean => {
    const extension = file.name.split('.').pop()?.toLowerCase() || '';
    const isFormatValid = platform.recommendedFormats.includes(extension);
    const isSizeValid = file.size <= platform.maxFileSize;
    return isFormatValid && isSizeValid;
  };

  const togglePlatform = (fileName: string, platformId: string) => {
    setFiles(prevFiles => 
      prevFiles.map(file => {
        if (file.name !== fileName) return file;
        
        const platforms = file.platforms || [];
        const platformIndex = platforms.findIndex(p => p.platformId === platformId);
        
        if (platformIndex >= 0) {
          // Remover la plataforma si ya existe
          return {
            ...file,
            platforms: platforms.filter(p => p.platformId !== platformId)
          };
        } else {
          // Añadir la plataforma si no existe
          return {
            ...file,
            platforms: [...platforms, { platformId }]
          };
        }
      })
    );
  };

  const handleSchedule = (config: ScheduleConfig) => {
    const startDate = new Date(config.startDate);
    let currentDate = new Date(startDate);
    let fileIndex = 0;

    const updatedFiles = [...files];
    
    // Calcular fechas para cada archivo
    while (fileIndex < files.length) {
      // Por cada día, programar el número de posts especificado
      for (let i = 0; i < config.postsPerDay && fileIndex < files.length; i++) {
        const timeSlot = config.timeSlots[i];
        const scheduleDate = new Date(currentDate);
        scheduleDate.setHours(parseInt(timeSlot.hour), parseInt(timeSlot.minute), 0, 0);
        
        updatedFiles[fileIndex] = {
          ...updatedFiles[fileIndex],
          scheduledDate: scheduleDate
        };
        
        fileIndex++;
      }

      // Avanzar a la siguiente fecha según la frecuencia
      switch (config.frequency) {
        case 'daily':
          currentDate.setDate(currentDate.getDate() + 1);
          break;
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
      }
    }

    setFiles(updatedFiles);
  };

  const [platforms] = useState<Platform[]>([
    { 
      id: 'instagram',
      name: 'Instagram',
      icon: Instagram,
      enabled: false,
      color: '#E4405F',
      recommendedFormats: ['jpg', 'png', 'mp4'],
      maxFileSize: 1024 * 1024 * 50, // 50MB
      maxDuration: 60 // 1 minute
    },
    { 
      id: 'facebook',
      name: 'Facebook',
      icon: Facebook,
      enabled: false,
      color: '#1877F2',
      recommendedFormats: ['jpg', 'png', 'mp4'],
      maxFileSize: 1024 * 1024 * 4096, // 4GB
      maxDuration: 240 // 4 minutes
    },
    { 
      id: 'tiktok',
      name: 'TikTok',
      icon: BrandTiktok,
      enabled: false,
      color: '#000000',
      recommendedFormats: ['mp4'],
      maxFileSize: 1024 * 1024 * 287, // 287MB
      maxDuration: 180 // 3 minutes
    },
    { 
      id: 'youtube',
      name: 'YouTube',
      icon: Youtube,
      enabled: false,
      color: '#FF0000',
      recommendedFormats: ['mp4', 'mov', 'avi'],
      maxFileSize: 1024 * 1024 * 1024 * 128, // 128GB
      maxDuration: 43200 // 12 hours
    }
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-white to-blue-50/30 rounded-xl shadow-lg p-8 relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-purple-500/10 to-blue-500/10 rounded-full blur-2xl transform -translate-x-1/2 translate-y-1/2"></div>
          
          {/* Content */}
          <div className="relative">
            <h1 className="text-4xl font-extrabold">
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Planificador de Contenido
              </span>
              <div className="h-1 w-24 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mt-2"></div>
            </h1>
            <p className="text-gray-600 mt-4 text-lg max-w-2xl leading-relaxed">
              Planifica y programa tu contenido en múltiples plataformas de manera eficiente y profesional
            </p>
          </div>
          
         
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        <div className={`transition-all duration-300
                          ${isUploadMinimized ? 'lg:col-span-1' : 'lg:col-span-3'}
                          ${isUploadMinimized ? 'lg:max-w-[60px]' : 'lg:max-w-full'}`}>
            <div className={`bg-gradient-to-br from-white to-blue-50 rounded-xl shadow-lg 
              transition-all duration-300 h-full backdrop-blur-sm border border-gray-100
              ${isDragging ? 'ring-4 ring-blue-400 bg-blue-50/80 scale-[1.02]' : 'hover:shadow-xl'}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="p-6">
              <div className="flex items-center justify-between">
              <div className={`flex items-center space-x-3 transition-opacity duration-300
                    ${isUploadMinimized ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100 w-auto'}`}>
                    <h2 className="text-xl font-semibold text-gray-800 whitespace-nowrap">
                      Subir Medios
                    </h2>
                    <Upload className="w-6 h-6 text-blue-500 animate-bounce" />
                  </div>
                  <button
                    onClick={() => setIsUploadMinimized(!isUploadMinimized)}
                    className={`p-2.5 bg-white/80 hover:bg-blue-50 rounded-lg transition-all duration-300 
                      shadow-sm hover:shadow border border-gray-100 hover:border-blue-200
                      ${isUploadMinimized ? 'ml-0' : 'ml-2'}`}
                    title={isUploadMinimized ? "Expandir" : "Minimizar"}
                  >
                    {isUploadMinimized ? (
                      <Maximize2 className="w-5 h-5" />
                    ) : (
                      <Minimize2 className="w-5 h-5" />
                    )}
                  </button>
                </div>

                <div className={`transition-all duration-300 
                  ${isUploadMinimized ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100 h-auto mt-6'}`}>
                  <input
                    type="file"
                    multiple
                    onChange={handleFileInput}
                    className="hidden"
                    id="file-upload"
                    accept="image/*,video/*"
                  />
                                    <label
                    htmlFor="file-upload"
                    className="group flex flex-col items-center justify-center p-8 border-2 border-dashed 
                             border-blue-200 rounded-xl hover:border-blue-400 bg-white/50 hover:bg-blue-50/50 
                             transition-all duration-300 cursor-pointer relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-100/0 via-blue-100/30 to-blue-100/0 
                                  translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                    <Upload className="w-16 h-16 text-blue-400 mb-4 group-hover:scale-110 transition-transform duration-300" />
                    <p className="text-sm text-gray-600 text-center font-medium">
                      Arrastra y suelta tus archivos aquí
                      <span className="block text-blue-500 mt-1">o haz clic para explorar</span>
                    </p>
                  </label>


                  
                  {files.length > 0 && !isUploadMinimized && (
                    <div className="mt-6">
                      <div className="flex items-center justify-between mb-3">
                        <div className="text-sm font-medium text-gray-700">
                          Subidas recientes ({files.length})
                        </div>
                        <div className="text-xs text-blue-500 font-medium">
                          {files.length} archivos
                        </div>
                      </div>
                      <div className="space-y-3">
                        {files.slice(-3).map((file, index) => (
                          <div
                            key={index}
                            className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-gray-100
                                     hover:border-blue-200 hover:shadow-sm transition-all duration-200"
                          >
                            <div className="w-10 h-10 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 
                                          border border-gray-200">
                              {file.preview && (
                                file.type.startsWith('image/') ? (
                                  <img
                                    src={file.preview}
                                    alt={file.name}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <video
                                    src={file.preview}
                                    className="w-full h-full object-cover"
                                  />
                                )
                              )}
                            </div>
                            <span className="text-sm text-gray-600 truncate flex-grow">
                              {file.name}
                            </span>
                            <span className="text-xs text-gray-500">
                              {formatFileSize(file.size)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Content View Area */}
          <div className={`transition-all duration-300
                          ${isUploadMinimized ? 'lg:col-span-11' : 'lg:col-span-9'}`}>
            <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
                <div className="relative">
                  <h2 className="text-2xl font-bold text-gray-800">
                    Vista de Contenido
                    <div className="absolute -bottom-1 left-0 w-1/3 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500"></div>
                  </h2>
                </div>

                <div className="flex items-center">
                  <div className="bg-gradient-to-r from-gray-50 to-blue-50/30 rounded-xl p-1.5 shadow-sm 
                                border border-gray-200/80 backdrop-blur-sm">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setViewType('list')}
                        className={`px-4 py-2 rounded-lg transition-all duration-300 flex items-center gap-2
                          ${viewType === 'list'
                            ? 'bg-white text-blue-600 shadow-md transform scale-[1.02] font-medium'
                            : 'text-gray-600 hover:text-gray-800 hover:bg-white/50'
                          }`}
                      >
                        <LayoutGrid className={`w-4 h-4 ${viewType === 'list' ? 'animate-pulse' : ''}`} />
                        <span>Lista</span>
                      </button>
                      <button
                        onClick={() => setViewType('calendar')}
                        className={`px-4 py-2 rounded-lg transition-all duration-300 flex items-center gap-2
                          ${viewType === 'calendar'
                            ? 'bg-white text-blue-600 shadow-md transform scale-[1.02] font-medium'
                            : 'text-gray-600 hover:text-gray-800 hover:bg-white/50'
                          }`}
                      >
                        <Calendar className={`w-4 h-4 ${viewType === 'calendar' ? 'animate-pulse' : ''}`} />
                        <span>Calendario</span>
                      </button>
                      <button
                        onClick={() => setViewType('timeline')}
                        className={`px-4 py-2 rounded-lg transition-all duration-300 flex items-center gap-2
                          ${viewType === 'timeline'
                            ? 'bg-white text-blue-600 shadow-md transform scale-[1.02] font-medium'
                            : 'text-gray-600 hover:text-gray-800 hover:bg-white/50'
                          }`}
                      >
                        <AlignStartVertical className={`w-4 h-4 ${viewType === 'timeline' ? 'animate-pulse' : ''}`} />
                        <span>Línea de tiempo</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Scheduling Controls */}
              <div className="mb-6 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-all duration-300">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fecha de inicio
                    </label>
                    <input
                      type="date"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      onChange={(e) => {
                        const date = new Date(e.target.value);
                        const [hours, minutes] = publishTime.split(':');
                        date.setHours(parseInt(hours), parseInt(minutes), 0, 0);
                        setSelectedDateTime(date);
                      }}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>

                  <div className="transform hover:scale-[1.01] transition-all duration-300">
                  <label className="flex items-center space-x-2 text-gray-700 mb-2">
                  Hora de publicación
                    </label>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <select
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-blue-300 transition-colors duration-200"
                          value={publishTime}
                          onChange={(e) => {
                            setPublishTime(e.target.value);
                            if (selectedDateTime) {
                              const newDate = new Date(selectedDateTime);
                              const [hours, minutes] = e.target.value.split(':');
                              newDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
                              setSelectedDateTime(newDate);
                            }
                          }}
                        >
                          <option value="09:00">09:00 AM</option>
                          <option value="10:00">10:00 AM</option>
                          <option value="11:00">11:00 AM</option>
                          <option value="12:00">12:00 PM</option>
                          <option value="13:00">01:00 PM</option>
                          <option value="14:00">02:00 PM</option>
                          <option value="15:00">03:00 PM</option>
                          <option value="16:00">04:00 PM</option>
                          <option value="17:00">05:00 PM</option>
                          <option value="18:00">06:00 PM</option>
                          <option value="19:00">07:00 PM</option>
                          <option value="20:00">08:00 PM</option>
                        </select>
                        <button
                          type="button"
                          onClick={() => setMultiPostSchedule(prev => ({ ...prev, enabled: !prev.enabled }))}
                          className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                            multiPostSchedule.enabled
                              ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {multiPostSchedule.enabled ? 'Múltiples horarios' : '+ Añadir horarios'}
                        </button>
                      </div>

                      {multiPostSchedule.enabled && (
                        <div className="space-y-4">
                          <div className="pl-2 space-y-2">
                            {multiPostSchedule.times.slice(1).map((time, index) => (
                              <div key={index} className="flex items-center gap-2">
                                <select
                                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-blue-300 transition-colors duration-200"
                                  value={`${time.hour}:${time.minute}`}
                                  onChange={(e) => {
                                    const [hour, minute] = e.target.value.split(':');
                                    updateTimeSlot(index + 1, hour, minute);
                                  }}
                                >
                                  <option value="09:00">09:00 AM</option>
                                  <option value="10:00">10:00 AM</option>
                                  <option value="11:00">11:00 AM</option>
                                  <option value="12:00">12:00 PM</option>
                                  <option value="13:00">01:00 PM</option>
                                  <option value="14:00">02:00 PM</option>
                                  <option value="15:00">03:00 PM</option>
                                  <option value="16:00">04:00 PM</option>
                                  <option value="17:00">05:00 PM</option>
                                  <option value="18:00">06:00 PM</option>
                                  <option value="19:00">07:00 PM</option>
                                  <option value="20:00">08:00 PM</option>
                                </select>
                                <button
                                  onClick={() => removeTimeSlot(index + 1)}
                                  className="p-2 text-red-500 hover:bg-red-50 rounded-md transition-colors"
                                  title="Eliminar horario"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            ))}
                            
                            {multiPostSchedule.times.length < 5 && (
                              <button
                                onClick={addTimeSlot}
                                className="w-full px-3 py-2 text-sm text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors flex items-center justify-center gap-2"
                              >
                                <Clock className="w-4 h-4" />
                                Añadir otro horario
                              </button>
                            )}
                          </div>
                          
                          {/* Información de distribución */}
                          {selectedFiles.length > 0 && (
                            <div className="mt-2 p-3 bg-blue-50 rounded-md space-y-2">
                              <p className="text-sm text-blue-700">
                                {selectedFiles.length} archivos seleccionados
                                {multiPostSchedule.enabled && (
                                  <>
                                    <br />
                                    {multiPostSchedule.times.length} publicaciones por día
                                    <br />
                                    Duración total: {calculatePublicationDays()} días
                                    <br />
                                    <span className="text-xs text-blue-600">
                                      (Frecuencia: cada {publishFrequency} día{publishFrequency > 1 ? 's' : ''})
                                    </span>
                                  </>
                                )}
                              </p>
                              
                              {/* Vista previa de programación */}
                              <div className="mt-2 space-y-1">
                                <p className="text-xs font-medium text-blue-800">Vista previa de programación:</p>
                                {getSchedulePreview().map((preview, index) => (
                                  <div key={index} className="text-xs text-blue-600 flex justify-between">
                                    <span>{preview.fileName}</span>
                                    <span>
                                      {preview.scheduledDate.toLocaleDateString()} {preview.scheduledDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Frecuencia de publicación
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-blue-300 transition-colors duration-200"
                      value={publishFrequency}
                      onChange={(e) => setPublishFrequency(parseInt(e.target.value))}
                    >
                      <option value="1">Cada día</option>
                      <option value="2">Cada 2 días</option>
                      <option value="3">Cada 3 días</option>
                      <option value="7">Cada semana</option>
                      <option value="14">Cada 2 semanas</option>
                      <option value="30">Cada mes</option>
                    </select>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <p className="text-sm text-gray-600">
                    Selecciona los archivos y programa su publicación
                  </p>
                  <button
                    onClick={() => {
                      // En lugar de la anterior handleBulkDateAssignment, ahora invocamos handleSchedulePost
                      handleSchedulePost();
                    }}
                    disabled={!selectedDateTime || selectedFiles.length === 0}
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-200
                      ${selectedDateTime && selectedFiles.length > 0
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                  >
                    Programar Contenido
                  </button>
                </div>
              </div>
              <div className="mt-6">
                {viewType === 'list' && (

                  <div className="grid grid-cols-1 gap-6">
                    <div className="flex items-center justify-between mb-4 bg-white rounded-xl p-4 shadow-sm">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-600">
                          {files.length} {files.length === 1 ? 'archivo' : 'archivos'} en total
                        </span>
                      </div>
                      <button
                        onClick={handleSelectAll}
                        className="text-sm font-medium text-blue-600 hover:text-blue-700 
                                 px-4 py-2 rounded-lg hover:bg-blue-50 transition-all duration-200"
                      >
                        {selectedFiles.length === files.length ? 'Deseleccionar todo' : 'Seleccionar todo'}
                      </button>
                    </div>
                    {files.map((file) => (
                      <div
                        key={file.name}
                        className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 
                                 border border-gray-100 hover:border-blue-200 group overflow-hidden"
                      >
                        <div className="flex items-start p-6">
                          <div className="flex items-center h-5 mr-6">
                            <input
                              type="checkbox"
                              checked={selectedFiles.includes(file.name)}
                              onChange={() => handleCheckboxChange(file.name)}
                              className="h-5 w-5 text-blue-600 rounded-md border-gray-300 
                                       focus:ring-blue-500 transition-all duration-200
                                       hover:border-blue-400"
                            />
                          </div>
                          
                          {/* Preview con efectos mejorados */}
                          <div className="w-48 h-32 rounded-xl overflow-hidden flex-shrink-0 
                                        shadow-md group-hover:shadow-lg transition-all duration-300
                                        transform group-hover:scale-[1.02] relative">
                            <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent z-10"></div>
                            {file.preview && (
                              file.type.startsWith('image/') ? (
                                <img
                                  src={file.preview}
                                  alt={file.name}
                                  className="w-full h-full object-cover transform transition-transform 
                                           duration-500 group-hover:scale-110"
                                />
                              ) : (
                                <video
                                  src={file.preview}
                                  className="w-full h-full object-cover transform transition-transform 
                                           duration-500 group-hover:scale-110"
                                />
                              )
                            )}
                          </div>

                          {/* Contenido principal */}
                          <div className="flex-grow ml-6">
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 
                                             transition-colors duration-200 mb-2">
                                  {file.name}
                                </h3>
                                <p className="text-sm text-gray-500 mb-4">
                                  {formatFileSize(file.size)} • Subido {new Date().toLocaleDateString()}
                                </p>
                              </div>
                              
                              <div className="flex items-center space-x-3">
                                <button
                                  onClick={() => handleFileSelect(file.name)}
                                  className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 
                                           rounded-lg transition-all duration-200"
                                  title="Ver detalles"
                                >
                                  <Info className="w-5 h-5" />
                                </button>
                                {file.scheduledDate ? (
                                  <div className="flex items-center space-x-2 bg-gradient-to-r from-green-50 to-emerald-50 
                                               text-green-700 px-4 py-2 rounded-lg border border-green-200
                                               shadow-sm">
                                    <CalendarCheck className="w-4 h-4" />
                                    <span className="text-sm font-medium whitespace-nowrap">
                                      {new Date(file.scheduledDate).toLocaleDateString()} 
                                      {new Date(file.scheduledDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                  </div>
                                ) : (
                                  <button
                                    onClick={() => setSelectedFile(file.name)}
                                    className="flex items-center space-x-2 text-blue-600 bg-blue-50 hover:bg-blue-100 
                                             px-4 py-2 rounded-lg transition-all duration-200 border border-blue-200
                                             hover:border-blue-300 shadow-sm hover:shadow group"
                                  >
                                    <CalendarDays className="w-4 h-4" />
                                    <span className="text-sm font-medium">Programar</span>
                                  </button>
                                )}
                              </div>
                            </div>

                            {/* Plataformas */}
                            <div className="mt-4 flex flex-wrap items-center gap-3">
                              {platforms.map((platform) => {
                                const isSelected = file.platforms?.some(p => p.platformId === platform.id);
                                const IconComponent = platform.icon;
                                
                                return (
                                  <button
                                    key={platform.id}
                                    onClick={() => togglePlatform(file.name, platform.id)}
                                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg 
                                             transition-all duration-300 ${
                                      isSelected 
                                        ? 'text-white shadow-sm transform hover:scale-[1.02]' 
                                        : 'text-gray-600 hover:text-gray-800 bg-gray-50 hover:bg-gray-100'
                                    }`}
                                    style={{
                                      backgroundColor: isSelected ? platform.color : undefined
                                    }}
                                    title={platform.name}
                                  >
                                    <IconComponent className="w-5 h-5" />
                                    <span className="text-sm font-medium">{platform.name}</span>
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {viewType === 'calendar' && (
                  <CalendarView
                    files={files}
                    currentDate={currentDate}
                    onDateChange={handleDateAssignment}
                  />
                )}
                {viewType === 'timeline' && (
                  <TimelineView
                    files={files}
                    onDateChange={handleDateAssignment}
                  />
                )}
              </div>
            </div>
          </div>
        </div>


        {/* File Details Modal */}
        {selectedFileForDetails && selectedFileForAI && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Detalles del archivo
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-1">
                    Nombre del archivo
                  </h3>
                  <p className="text-sm text-gray-600">
                    {selectedFileForDetails}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-1">
                    Tamaño del archivo
                  </h3>
                  <p className="text-sm text-gray-600">
                    {formatFileSize(selectedFileForAI.size)}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-1">
                    Tipo de archivo
                  </h3>
                  <p className="text-sm text-gray-600">
                    {selectedFileForAI.type}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-1">
                    Fecha de subida
                  </h3>
                  <p className="text-sm text-gray-600">
                    {new Date().toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="mt-6">
                <AIContentAnalyzer
                  file={selectedFileForAI}
                  onAnalysisComplete={handleAIAnalysisComplete}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentPlanner;
