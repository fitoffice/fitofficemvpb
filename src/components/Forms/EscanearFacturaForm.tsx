import React, { useState, useRef } from 'react';
import { Upload, X } from 'lucide-react';

interface FormData {
  files: File[];
}

interface EscanearFacturaFormProps {
  onSubmit: (formData: FormData) => void;
}

const MAX_SIZE_MB = 15;
const BYTES_TO_MB = 1024 * 1024;

const EscanearFacturaForm: React.FC<EscanearFacturaFormProps> = ({ onSubmit }) => {
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const totalSize = files.reduce((acc, file) => acc + file.size, 0) / BYTES_TO_MB;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      const totalNewSize = (totalSize + newFiles.reduce((acc, file) => acc + file.size / BYTES_TO_MB, 0));
      
      if (totalNewSize > MAX_SIZE_MB) {
        alert(`El tamaño total de los archivos no puede superar ${MAX_SIZE_MB}MB`);
        return;
      }
      
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (files.length === 0) {
      alert('Por favor, seleccione al menos un archivo');
      return;
    }
    onSubmit({ files });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    const totalNewSize = (totalSize + droppedFiles.reduce((acc, file) => acc + file.size / BYTES_TO_MB, 0));
    
    if (totalNewSize > MAX_SIZE_MB) {
      alert(`El tamaño total de los archivos no puede superar ${MAX_SIZE_MB}MB`);
      return;
    }
    
    setFiles(prev => [...prev, ...droppedFiles]);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Área de subida de archivos */}
      <div
        className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <Upload className="mx-auto h-12 w-12 text-gray-400" />
        <div className="mt-4">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="text-blue-600 hover:text-blue-700 font-medium focus:outline-none focus:underline"
          >
            Seleccionar archivos
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            multiple
            accept=".pdf,.png,.jpg,.jpeg"
          />
          <p className="mt-1 text-sm text-gray-500">
            o arrastra y suelta aquí tus archivos
          </p>
          <p className="text-xs text-gray-500 mt-2">
            PDF, PNG, JPG hasta {MAX_SIZE_MB}MB
          </p>
        </div>
      </div>

      {/* Lista de archivos */}
      <div className="space-y-4">
        <div className="flex justify-between items-center text-sm text-gray-600">
          <span>Archivos subidos ({files.length})</span>
          <span>
            {totalSize.toFixed(2)} / {MAX_SIZE_MB} MB
          </span>
        </div>
        
        {files.length > 0 ? (
          <div className="space-y-2">
            {files.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-medium text-gray-900">
                    {file.name}
                  </span>
                  <span className="text-sm text-gray-500">
                    ({(file.size / BYTES_TO_MB).toFixed(2)} MB)
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={20} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4 text-gray-500">
            Ningún archivo seleccionado
          </div>
        )}
      </div>

      {/* Botones de acción */}
      <div className="flex gap-4">
        <button
          type="submit"
          className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Comenzar Escaneo de Facturas
        </button>
      </div>
    </form>
  );
};

export default EscanearFacturaForm;