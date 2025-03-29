import React, { useState, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { X } from 'lucide-react';
import { createPortal } from 'react-dom';

interface PopupUploadRMProps {
  onClose: () => void;
  planningId: string;
}

const PopupUploadRM: React.FC<PopupUploadRMProps> = ({ onClose, planningId }) => {
  const { theme } = useTheme();
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setMessage(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage({ text: 'Por favor selecciona un archivo', type: 'error' });
      return;
    }

    setIsUploading(true);
    setMessage({ text: 'Subiendo archivo...', type: 'info' });

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('planningId', planningId);

      const token = localStorage.getItem('token');
      const response = await fetch('https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/rms/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ text: 'Archivo subido correctamente', type: 'success' });
        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        setMessage({ text: data.message || 'Error al subir el archivo', type: 'error' });
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      setMessage({ text: 'Error al subir el archivo', type: 'error' });
    } finally {
      setIsUploading(false);
    }
  };

  const modalContent = (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`relative w-full max-w-md p-6 rounded-lg shadow-lg ${
        theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
      }`}>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <X size={24} />
        </button>

        <h2 className="text-xl font-bold mb-6">Subir Archivo de RMs</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Selecciona un archivo CSV o Excel
            </label>
            <input
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={handleFileChange}
              className={`w-full px-3 py-2 border rounded-md ${
                theme === 'dark' 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            />
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Formatos aceptados: CSV, Excel (.xlsx, .xls)
            </p>
          </div>

          {message && (
            <div className={`p-3 rounded-md ${
              message.type === 'success' ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' :
              message.type === 'error' ? 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100' :
              'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100'
            }`}>
              {message.text}
            </div>
          )}

          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={onClose}
              className={`px-4 py-2 rounded-md ${
                theme === 'dark'
                  ? 'bg-gray-700 hover:bg-gray-600 text-white'
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
              }`}
            >
              Cancelar
            </button>
            <button
              onClick={handleUpload}
              disabled={isUploading || !file}
              className={`px-4 py-2 rounded-md text-white ${
                isUploading || !file
                  ? 'bg-blue-400 cursor-not-allowed'
                  : 'bg-blue-500 hover:bg-blue-600'
              }`}
            >
              {isUploading ? 'Subiendo...' : 'Subir'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return mounted ? createPortal(modalContent, document.body) : null;
};

export default PopupUploadRM;