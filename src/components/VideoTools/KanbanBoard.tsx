import React, { useState } from 'react';
import { File as FileIcon, Clock as ClockIcon, ArrowLeft, ArrowRight, Check } from 'lucide-react';

interface FileWithPreview extends File {
  preview?: string;
  scheduledTime?: {
    hour: string;
    minute: string;
  };
}

interface KanbanBoardProps {
  groupedFiles: { [key: string]: FileWithPreview[] };
  formatDate: (date: string) => string;
  formatFileSize: (size: number) => string;
  getFileIcon: (type: string) => JSX.Element;
  onMoveFile?: (file: FileWithPreview, fromDate: string, toDate: string) => void;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({
  groupedFiles,
  formatDate,
  formatFileSize,
  getFileIcon,
  onMoveFile
}) => {
  const [selectedFile, setSelectedFile] = useState<{
    file: FileWithPreview;
    date: string;
  } | null>(null);

  const dates = Object.keys(groupedFiles).sort();

  const handleMoveFile = (direction: 'left' | 'right') => {
    if (!selectedFile) return;

    const currentIndex = dates.indexOf(selectedFile.date);
    let targetIndex;

    if (direction === 'left') {
      targetIndex = currentIndex - 1;
    } else {
      targetIndex = currentIndex + 1;
    }

    if (targetIndex >= 0 && targetIndex < dates.length) {
      const targetDate = dates[targetIndex];
      console.log(`Intentando mover archivo de ${selectedFile.date} a ${targetDate}`);
      onMoveFile?.(selectedFile.file, selectedFile.date, targetDate);
    }
  };

  return (
    <div className="px-6 pb-6 overflow-x-auto custom-scrollbar">
      <div className="inline-flex gap-4 py-2">
        {dates.map((date) => {
          const dateFiles = groupedFiles[date] || [];
          return (
            <div key={date} className="flex-none w-[280px] animate-fadeIn">
              <div className="bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-200 transition-all duration-200 shadow-sm hover:shadow">
                <div className="p-3 border-b border-gray-200 bg-gradient-to-br from-gray-50 to-white">
                  <h4 className="font-medium text-gray-800">
                    {formatDate(date)}
                  </h4>
                  <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                    <FileIcon className="w-3 h-3" />
                    {dateFiles.length} {dateFiles.length === 1 ? 'publicación' : 'publicaciones'}
                  </p>
                </div>
                <div className="p-2 space-y-2">
                  {dateFiles.map((file: FileWithPreview, index: number) => (
                    <div
                      key={`${file.name}-${index}`}
                      className={`relative bg-white rounded-lg border ${
                        selectedFile?.file === file
                          ? 'border-blue-400 ring-2 ring-blue-200'
                          : 'border-gray-200 hover:border-blue-300'
                      } p-2.5 transition-all duration-200 group hover:shadow-sm cursor-pointer`}
                      onClick={() => {
                        if (selectedFile?.file === file) {
                          setSelectedFile(null);
                        } else {
                          setSelectedFile({ file, date });
                        }
                      }}
                    >
                      <div className="flex gap-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-50 border border-gray-200 flex items-center justify-center flex-shrink-0 group-hover:border-blue-200 transition-all duration-200">
                          {file.preview && file.type.startsWith('image/') ? (
                            <img
                              src={file.preview}
                              alt={file.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            getFileIcon(file.type)
                          )}
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-sm font-medium text-gray-800 truncate group-hover:text-blue-600 transition-colors">
                            {file.name}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-gray-500">
                              {formatFileSize(file.size)}
                            </span>
                            <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full flex items-center gap-1">
                              <ClockIcon className="w-3 h-3" />
                              {file.scheduledTime?.hour}:{file.scheduledTime?.minute}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Botones de movimiento */}
                      {selectedFile?.file === file && (
                        <div 
                          className="absolute -top-3 left-1/2 transform -translate-x-1/2 flex items-center gap-1 bg-white rounded-full shadow-lg border border-gray-200 p-1"
                          onClick={e => e.stopPropagation()}
                        >
                          <button
                            onClick={() => handleMoveFile('left')}
                            disabled={dates.indexOf(date) === 0}
                            className="p-1 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Mover a día anterior"
                          >
                            <ArrowLeft className="w-4 h-4 text-gray-600" />
                          </button>
                          <button
                            onClick={() => setSelectedFile(null)}
                            className="p-1 rounded-full hover:bg-green-100 text-green-600"
                            title="Confirmar"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleMoveFile('right')}
                            disabled={dates.indexOf(date) === dates.length - 1}
                            className="p-1 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Mover a día siguiente"
                          >
                            <ArrowRight className="w-4 h-4 text-gray-600" />
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default KanbanBoard;
