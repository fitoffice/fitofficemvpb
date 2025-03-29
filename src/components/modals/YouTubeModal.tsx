import React, { useState, useCallback } from 'react';
import { X, Upload } from 'lucide-react';
import { youtubeService } from '../../services/youtubeService';
import toast from 'react-hot-toast';

interface YouTubeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const YouTubeModal: React.FC<YouTubeModalProps> = ({ isOpen, onClose }) => {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [privacy, setPrivacy] = useState<'private' | 'unlisted' | 'public'>('private');
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > 100 * 1024 * 1024) { // 100MB limit
        toast.error('El archivo es demasiado grande. El límite es 100MB.');
        return;
      }
      if (!selectedFile.type.startsWith('video/')) {
        toast.error('Por favor, selecciona un archivo de video válido.');
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast.error('Por favor, selecciona un video para subir.');
      return;
    }

    try {
      setIsUploading(true);
      await youtubeService.uploadVideo(file, {
        title,
        description,
        tags: tags.split(',').map(tag => tag.trim()),
        privacyStatus: privacy
      });
      
      toast.success('Video subido exitosamente');
      onClose();
      // Limpiar el formulario
      setFile(null);
      setTitle('');
      setDescription('');
      setTags('');
      setPrivacy('private');
    } catch (error) {
      toast.error('Error al subir el video. Por favor, intenta nuevamente.');
      console.error('Error uploading video:', error);
    } finally {
      setIsUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-red-500 dark:text-red-400">Subir Video a YouTube</h2>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Seleccionar Video
            </label>
            <div className="flex items-center justify-center w-full">
              <label className="w-full flex flex-col items-center px-4 py-6 bg-white dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-lg border-2 border-dashed cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600">
                <Upload size={24} />
                <span className="mt-2 text-sm">
                  {file ? file.name : 'Arrastra un archivo o haz clic para seleccionar'}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Máximo 100MB
                </span>
                <input
                  type="file"
                  className="hidden"
                  accept="video/*"
                  onChange={handleFileChange}
                  disabled={isUploading}
                />
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Título del Video (max. 100 caracteres)
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={100}
              required
              disabled={isUploading}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Descripción del Video
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              required
              disabled={isUploading}
              placeholder="Describe el contenido del video..."
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Etiquetas (separadas por comas)
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="fitness, entrenamiento, salud..."
              disabled={isUploading}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Privacidad
            </label>
            <select
              value={privacy}
              onChange={(e) => setPrivacy(e.target.value as 'private' | 'unlisted' | 'public')}
              disabled={isUploading}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="private">Privado</option>
              <option value="unlisted">No listado</option>
              <option value="public">Público</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={isUploading}
            className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUploading ? 'Subiendo...' : 'Subir Video'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default YouTubeModal;