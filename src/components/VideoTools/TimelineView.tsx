import React from 'react';
import { Clock, Calendar, ChevronRight } from 'lucide-react';

interface TimelineViewProps {
  files: Array<{
    name: string;
    scheduledDate?: Date;
    preview?: string;
    platforms?: Array<{ platformId: string }>;
    type: string;
    status?: 'pending' | 'scheduled' | 'error';
  }>;
}

const TimelineView: React.FC<TimelineViewProps> = ({ files }) => {
  const sortedFiles = [...files]
    .filter(f => f.scheduledDate)
    .sort((a, b) => {
      if (!a.scheduledDate || !b.scheduledDate) return 0;
      return new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime();
    });

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-gradient-to-r from-green-400 to-green-500';
      case 'error':
        return 'bg-gradient-to-r from-red-400 to-red-500';
      default:
        return 'bg-gradient-to-r from-yellow-400 to-yellow-500';
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('default', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('default', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen py-12 bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      <div className="max-w-5xl mx-auto px-6">
        {sortedFiles.map((file, index) => (
          <div key={file.name} className="relative group">
            {/* Línea vertical conectora con animación */}
            {index !== sortedFiles.length - 1 && (
              <div className="absolute left-[1.625rem] top-12 w-0.5 h-full 
                           bg-gradient-to-b from-blue-300 via-indigo-200 to-purple-200
                           group-hover:from-blue-400 group-hover:via-indigo-300 group-hover:to-purple-300
                           transition-all duration-500" />
            )}

            <div className="flex items-start space-x-8 mb-16 relative">
              {/* Marcador de tiempo con efecto de brillo */}
              <div className={`w-12 h-12 rounded-full ${getStatusColor(file.status)} 
                             flex items-center justify-center shadow-lg 
                             ring-4 ring-white relative z-10 transform 
                             hover:scale-110 hover:rotate-12
                             transition-all duration-300 ease-in-out
                             before:content-[''] before:absolute before:inset-0 
                             before:bg-white before:rounded-full before:opacity-0 
                             hover:before:opacity-20 before:transition-opacity`}>
                <Clock className="w-6 h-6 text-white drop-shadow-md" />
              </div>

              {/* Contenido con efecto de profundidad */}
              <div className="flex-grow bg-white rounded-2xl shadow-md overflow-hidden
                            transform transition-all duration-300 hover:scale-[1.02]
                            hover:shadow-2xl border border-gray-100 hover:border-blue-300
                            relative backdrop-blur-sm bg-white/95">
                {/* Barra superior decorativa */}
                <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
                
                <div className="p-8">
                  {/* Header con fecha y hora */}
                  <div className="flex items-center text-sm text-gray-600 mb-6 
                                bg-gradient-to-r from-gray-50 to-blue-50 
                                rounded-xl p-3 border border-gray-100
                                shadow-inner group-hover:from-blue-50 group-hover:to-indigo-50
                                transition-all duration-300">
                    <Calendar className="w-5 h-5 mr-3 text-blue-600" />
                    <span className="font-medium text-gray-800">
                      {file.scheduledDate && formatDate(file.scheduledDate)}
                    </span>
                    <ChevronRight className="w-5 h-5 mx-3 text-gray-400" />
                    <Clock className="w-5 h-5 mr-3 text-blue-600" />
                    <span className="text-gray-800">
                      {file.scheduledDate && formatTime(file.scheduledDate)}
                    </span>
                  </div>

                  {/* Contenido principal */}
                  <div className="flex items-start space-x-8">
                    {file.preview && (
                      <div className="w-40 h-40 rounded-xl overflow-hidden flex-shrink-0
                                    shadow-lg border border-gray-200 
                                    transform transition-all duration-500 
                                    hover:scale-105 hover:rotate-2
                                    group-hover:shadow-xl relative">
                        <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent z-10"></div>
                        {file.type.startsWith('image/') ? (
                          <img
                            src={file.preview}
                            alt={file.name}
                            className="w-full h-full object-cover transform transition-transform duration-500
                                     hover:scale-110"
                          />
                        ) : (
                          <video
                            src={file.preview}
                            className="w-full h-full object-cover transform transition-transform duration-500
                                     hover:scale-110"
                          />
                        )}
                      </div>
                    )}
                    <div className="flex-grow min-w-0">
                      <h3 className="text-2xl font-bold text-gray-900 mb-4 
                                   hover:text-blue-600 transition-colors duration-200
                                   leading-tight">
                        {file.name}
                      </h3>
                      {file.platforms && file.platforms.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {file.platforms.map(platform => (
                            <span
                              key={platform.platformId}
                              className="inline-flex items-center px-4 py-1.5 rounded-full
                                       text-sm font-medium bg-blue-50/80 text-blue-700
                                       border border-blue-200 hover:bg-blue-100/80
                                       transition-all duration-300 shadow-sm hover:shadow-md
                                       backdrop-blur-sm hover:scale-105"
                            >
                              {platform.platformId}
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="mt-4">
                        <span className={`inline-flex items-center px-5 py-2 rounded-full 
                                       text-sm font-semibold transition-all duration-300
                                       shadow-sm hover:shadow-md transform hover:scale-105 ${
                                         file.status === 'scheduled' 
                                           ? 'bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 border border-green-200 hover:from-green-100 hover:to-emerald-100'
                                           : file.status === 'error'
                                           ? 'bg-gradient-to-r from-red-50 to-rose-50 text-red-700 border border-red-200 hover:from-red-100 hover:to-rose-100'
                                           : 'bg-gradient-to-r from-yellow-50 to-amber-50 text-yellow-700 border border-yellow-200 hover:from-yellow-100 hover:to-amber-100'
                                       }`}>
                          {file.status || 'pending'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TimelineView;
