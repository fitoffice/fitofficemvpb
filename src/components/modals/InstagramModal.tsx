import React, { useState } from 'react';
import { X, Image, MapPin, Smile, Upload } from 'lucide-react';
import { instagramService } from '../../services/instagramService';
import toast from 'react-hot-toast';

interface InstagramModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const InstagramModal: React.FC<InstagramModalProps> = ({ isOpen, onClose }) => {
  const [contentType, setContentType] = useState<'post' | 'story'>('post');
  const [file, setFile] = useState<File | null>(null);
  const [caption, setCaption] = useState('');
  const [location, setLocation] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > 100 * 1024 * 1024) { // 100MB limit
        toast.error('El archivo es demasiado grande. El límite es 100MB.');
        return;
      }
      
      const validTypes = contentType === 'story' 
        ? ['image/jpeg', 'image/png', 'video/mp4']
        : ['image/jpeg', 'image/png', 'video/mp4', 'video/quicktime'];
        
      if (!validTypes.includes(selectedFile.type)) {
        toast.error('Formato de archivo no soportado.');
        return;
      }
      
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast.error('Por favor, selecciona un archivo para publicar.');
      return;
    }

    try {
      setIsUploading(true);
      
      if (contentType === 'post') {
        await instagramService.createPost({
          ...(file.type.startsWith('image/') ? { image: file } : { video: file }),
          caption,
          location
        });
        toast.success('Publicación creada exitosamente');
      } else {
        await instagramService.createStory({
          media: file,
          stickers: []
        });
        toast.success('Historia creada exitosamente');
      }
      
      onClose();
      // Limpiar el formulario
      setFile(null);
      setCaption('');
      setLocation('');
    } catch (error) {
      toast.error('Error al crear la publicación. Por favor, intenta nuevamente.');
      console.error('Error creating post:', error);
    } finally {
      setIsUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-[#E1306C] dark:text-pink-400">
            {contentType === 'post' ? 'Crear Publicación' : 'Crear Historia'}
          </h2>
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
              Tipo de Contenido
            </label>
            <select
              value={contentType}
              onChange={(e) => setContentType(e.target.value as 'post' | 'story')}
              disabled={isUploading}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="post">Publicación</option>
              <option value="story">Historia</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Subir Archivo
            </label>
            <div className="flex items-center justify-center w-full">
              <label className="w-full flex flex-col items-center px-4 py-6 bg-white dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-lg border-2 border-dashed cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600">
                <Upload size={24} className="mb-2" />
                <span className="mt-2 text-sm">
                  {file ? file.name : 'Arrastra un archivo o haz clic para seleccionar'}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Máximo 100MB
                </span>
                <input
                  type="file"
                  className="hidden"
                  accept={contentType === 'story' ? "image/*,video/mp4" : "image/*,video/*"}
                  onChange={handleFileChange}
                  disabled={isUploading}
                />
              </label>
            </div>
          </div>

          {contentType === 'post' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Descripción
                </label>
                <textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  rows={4}
                  placeholder="Escribe una descripción..."
                  disabled={isUploading}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Ubicación
                </label>
                <div className="relative">
                  <MapPin className="absolute left-2 top-2.5 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Agregar ubicación"
                    disabled={isUploading}
                    className="w-full pl-10 p-2 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={isUploading}
            className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-semibold py-2 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUploading ? 'Publicando...' : `Crear ${contentType === 'post' ? 'Publicación' : 'Historia'}`}
          </button>
        </form>
      </div>
    </div>
  );
};

export default InstagramModal;