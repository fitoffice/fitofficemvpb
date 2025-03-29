import React from 'react';
import { X, FileVideo, Calendar, Clock, HardDrive, Tag, Share2, Download, Edit3, Trash2, AlertCircle, CheckCircle2, Info } from 'lucide-react';
import { formatFileSize, getVideoDuration } from '../../utils/fileHelpers';

interface Platform {
  platformId: string;
  name?: string;
  color?: string;
}

interface FileWithPreview extends File {
  preview?: string;
  platforms?: Platform[];
  scheduledDate?: Date;
  description?: string;
  hashtags?: string[];
}

interface FileDetailsProps {
  file: FileWithPreview;
  onClose: () => void;
  platforms: Array<{
    id: string;
    name: string;
    color: string;
    recommendedFormats: string[];
    maxFileSize: number;
    maxDuration: number;
  }>;
  onDelete?: (file: FileWithPreview) => void;
  onEdit?: (file: FileWithPreview) => void;
}

export const FileDetails = ({ file, onClose, platforms, onDelete, onEdit }: FileDetailsProps) => {
  const [duration, setDuration] = React.useState<number | null>(null);
  const [dimensions, setDimensions] = React.useState<{ width: number; height: number } | null>(null);
  const [activeTab, setActiveTab] = React.useState<'info' | 'platforms'>('info');

  React.useEffect(() => {
    if (file.type.startsWith('video/') && file.preview) {
      getVideoDuration(file.preview).then(duration => setDuration(duration));
      
      const video = document.createElement('video');
      video.src = file.preview;
      video.onloadedmetadata = () => {
        setDimensions({
          width: video.videoWidth,
          height: video.videoHeight
        });
      };
    }
  }, [file]);

  const getFileExtension = (filename: string) => {
    return filename.split('.').pop()?.toLowerCase() || '';
  };

  const getPlatformCompatibility = () => {
    const extension = getFileExtension(file.name);
    const fileSize = file.size;
    
    return platforms.map(platform => {
      const isFormatValid = platform.recommendedFormats.includes(extension);
      const isSizeValid = fileSize <= platform.maxFileSize;
      const isDurationValid = !duration || duration <= platform.maxDuration;
      
      return {
        ...platform,
        isCompatible: isFormatValid && isSizeValid && isDurationValid,
        issues: [
          !isFormatValid && `Formato no soportado (${extension})`,
          !isSizeValid && `Tamaño excede el límite (${formatFileSize(platform.maxFileSize)})`,
          !isDurationValid && duration && `Duración excede el límite (${platform.maxDuration}s)`
        ].filter(Boolean)
      };
    });
  };

  const handleDownload = () => {
    if (file.preview) {
      const link = document.createElement('a');
      link.href = file.preview;
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full mx-auto max-h-[90vh] overflow-hidden">
        {/* Header con degradado */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Detalles del archivo</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <p className="mt-2 text-white/80">{file.name}</p>
        </div>

        <div className="p-6">
          <div className="flex space-x-6">
            {/* Panel izquierdo */}
            <div className="w-2/3 space-y-6">
              {/* Preview con marco mejorado */}
              <div className="relative aspect-video bg-gray-900 rounded-2xl overflow-hidden shadow-lg
                            ring-1 ring-gray-900/5">
                {file.preview && (
                  file.type.startsWith('video/') ? (
                    <video
                      src={file.preview}
                      controls
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <img
                      src={file.preview}
                      alt={file.name}
                      className="w-full h-full object-contain"
                    />
                  )
                )}
              </div>

              {/* Descripción y hashtags */}
              <div className="space-y-4 bg-gray-50 rounded-xl p-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Descripción</h3>
                  <p className="text-gray-600">
                    {file.description || 'Sin descripción'}
                  </p>
                </div>
                {file.hashtags && file.hashtags.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Hashtags</h3>
                    <div className="flex flex-wrap gap-2">
                      {file.hashtags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm
                                   border border-blue-200"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Panel derecho */}
            <div className="w-1/3 space-y-6">
              {/* Tabs de navegación */}
              <div className="flex bg-gray-100 p-1 rounded-lg">
                <button
                  onClick={() => setActiveTab('info')}
                  className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all
                            ${activeTab === 'info' 
                              ? 'bg-white text-blue-600 shadow-sm' 
                              : 'text-gray-600 hover:text-gray-900'}`}
                >
                  Información
                </button>
                <button
                  onClick={() => setActiveTab('platforms')}
                  className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all
                            ${activeTab === 'platforms' 
                              ? 'bg-white text-blue-600 shadow-sm' 
                              : 'text-gray-600 hover:text-gray-900'}`}
                >
                  Plataformas
                </button>
              </div>

              {activeTab === 'info' ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <div className="flex items-center text-gray-600 mb-1">
                        <HardDrive className="w-4 h-4 mr-2 text-gray-400" />
                        <span className="text-sm font-medium">Tamaño</span>
                      </div>
                      <p className="text-gray-900">{formatFileSize(file.size)}</p>
                    </div>
                    {duration && (
                      <div className="bg-gray-50 p-4 rounded-xl">
                        <div className="flex items-center text-gray-600 mb-1">
                          <Clock className="w-4 h-4 mr-2 text-gray-400" />
                          <span className="text-sm font-medium">Duración</span>
                        </div>
                        <p className="text-gray-900">{duration.toFixed(1)}s</p>
                      </div>
                    )}
                    {dimensions && (
                      <div className="bg-gray-50 p-4 rounded-xl">
                        <div className="flex items-center text-gray-600 mb-1">
                          <span className="w-4 h-4 mr-2 text-gray-400">📐</span>
                          <span className="text-sm font-medium">Dimensiones</span>
                        </div>
                        <p className="text-gray-900">{dimensions.width}x{dimensions.height}</p>
                      </div>
                    )}
                    {file.scheduledDate && (
                      <div className="bg-gray-50 p-4 rounded-xl">
                        <div className="flex items-center text-gray-600 mb-1">
                          <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                          <span className="text-sm font-medium">Programado</span>
                        </div>
                        <p className="text-gray-900">
                          {new Date(file.scheduledDate).toLocaleDateString()}
                          <br />
                          <span className="text-sm text-gray-500">
                            {new Date(file.scheduledDate).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Acciones */}
                  <div className="flex flex-col space-y-2">
                    {onEdit && (
                      <button
                        onClick={() => onEdit(file)}
                        className="flex items-center justify-center space-x-2 w-full px-4 py-2
                                 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg
                                 transition-colors duration-200"
                      >
                        <Edit3 className="w-4 h-4" />
                        <span>Editar</span>
                      </button>
                    )}
                    <button
                      onClick={handleDownload}
                      className="flex items-center justify-center space-x-2 w-full px-4 py-2
                               text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg
                               transition-colors duration-200"
                    >
                      <Download className="w-4 h-4" />
                      <span>Descargar</span>
                    </button>
                    {onDelete && (
                      <button
                        onClick={() => onDelete(file)}
                        className="flex items-center justify-center space-x-2 w-full px-4 py-2
                                 text-red-600 hover:bg-red-50 rounded-lg
                                 transition-colors duration-200"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Eliminar</span>
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {getPlatformCompatibility().map(platform => (
                    <div
                      key={platform.id}
                      className={`p-4 rounded-xl border transition-all duration-200
                                ${platform.isCompatible
                                  ? 'border-green-200 bg-gradient-to-r from-green-50 to-emerald-50'
                                  : 'border-red-200 bg-gradient-to-r from-red-50 to-rose-50'
                                }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          {platform.isCompatible ? (
                            <CheckCircle2 className="w-5 h-5 text-green-500" />
                          ) : (
                            <AlertCircle className="w-5 h-5 text-red-500" />
                          )}
                          <span
                            className="font-medium"
                            style={{ color: platform.color }}
                          >
                            {platform.name}
                          </span>
                        </div>
                        <span className={`text-sm px-2 py-1 rounded-full ${
                          platform.isCompatible 
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {platform.isCompatible ? 'Compatible' : 'No compatible'}
                        </span>
                      </div>
                      {!platform.isCompatible && platform.issues.length > 0 && (
                        <div className="mt-2 p-3 bg-white/50 rounded-lg">
                          <div className="flex items-center space-x-2 text-sm text-red-600 mb-2">
                            <Info className="w-4 h-4" />
                            <span className="font-medium">Problemas detectados:</span>
                          </div>
                          <ul className="space-y-1 text-sm text-red-600">
                            {platform.issues.map((issue, index) => (
                              <li key={index} className="flex items-start space-x-2">
                                <span className="mt-1">•</span>
                                <span>{issue}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
