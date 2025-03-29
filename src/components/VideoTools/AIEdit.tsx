import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Video, Upload, Play, Settings, Palette } from 'lucide-react';

interface AIEditProps {
  isOpen: boolean;
  onClose: () => void;
  theme: string;
}

const videoStyles = {
  paper: { name: 'Paper', description: 'Estilo artístico con textura de papel' },
  cinematic: { name: 'Cinematic', description: 'Look cinematográfico profesional' },
  impact: { name: 'Impact', description: 'Estilo dinámico y de alto impacto' },
  scrapbook: { name: 'Scrapbook', description: 'Estilo collage y recortes' },
  vinyl: { name: 'Vinyl', description: 'Efecto retro con textura de vinilo' },
  recess: { name: 'Recess', description: 'Estilo juguetón y divertido' },
  minimalist: { name: 'Minimalist', description: 'Diseño limpio y minimalista' },
  modern: { name: 'Modern', description: 'Estética moderna y contemporánea' }
};

const AIEdit: React.FC<AIEditProps> = ({ isOpen, onClose, theme }) => {
  const [selectedStyle, setSelectedStyle] = useState<string>('');
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [processedVideo, setProcessedVideo] = useState<string>('');

  const handleVideoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadingVideo(true);
      // Simular carga de video
      setTimeout(() => {
        setVideoUrl(URL.createObjectURL(file));
        setUploadingVideo(false);
      }, 1500);
    }
  };

  const handleProcessVideo = () => {
    if (!videoUrl || !selectedStyle) {
      alert('Por favor, sube un video y selecciona un estilo');
      return;
    }

    setProcessing(true);
    // Simular procesamiento del video
    setTimeout(() => {
      setProcessedVideo(videoUrl); // En un caso real, esto sería la URL del video procesado
      setProcessing(false);
    }, 3000);
  };

  const styles = {
    container: `fixed inset-0 flex items-center justify-center z-50 ${
      theme === 'dark' ? 'bg-opacity-75 bg-gray-900' : 'bg-opacity-75 bg-gray-200'
    }`,
    modal: `relative w-11/12 max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-xl ${
      theme === 'dark' 
        ? 'bg-gray-800 text-white' 
        : 'bg-white text-gray-800'
    }`,
    header: `flex items-center justify-between p-6 border-b ${
      theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
    }`,
    closeButton: `p-2 rounded-full transition-colors ${
      theme === 'dark'
        ? 'hover:bg-gray-700 text-gray-400 hover:text-white'
        : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
    }`,
    select: `w-full p-3 rounded-lg ${
      theme === 'dark'
        ? 'bg-gray-700 text-white border-gray-600'
        : 'bg-gray-100 text-gray-900 border-gray-300'
    }`,
    uploadArea: `border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
      theme === 'dark'
        ? 'border-gray-700 hover:border-gray-600'
        : 'border-gray-300 hover:border-gray-400'
    }`,
    button: `px-6 py-3 rounded-lg transition-colors ${
      theme === 'dark'
        ? 'bg-blue-600 hover:bg-blue-700 text-white'
        : 'bg-blue-500 hover:bg-blue-600 text-white'
    }`,
    styleCard: (isSelected: boolean) => `
      p-4 rounded-lg cursor-pointer transition-all transform hover:scale-105 ${
        isSelected
          ? theme === 'dark'
            ? 'bg-blue-600 text-white'
            : 'bg-blue-500 text-white'
          : theme === 'dark'
          ? 'bg-gray-700 hover:bg-gray-600'
          : 'bg-gray-100 hover:bg-gray-200'
      }
    `
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={styles.container}
        >
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.95 }}
            className={styles.modal}
          >
            {/* Header */}
            <div className={styles.header}>
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Palette className="w-6 h-6" />
                AI Edit
              </h2>
              <button onClick={onClose} className={styles.closeButton}>
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Style Selection */}
              <div>
                <label className="block font-medium mb-4">
                  Selecciona un Estilo
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(videoStyles).map(([key, style]) => (
                    <div
                      key={key}
                      className={styles.styleCard(selectedStyle === key)}
                      onClick={() => setSelectedStyle(key)}
                    >
                      <h3 className="font-medium mb-1">{style.name}</h3>
                      <p className="text-sm opacity-75">{style.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Video Upload */}
              <div>
                <label className="block font-medium mb-2">
                  Sube tu Video
                </label>
                <div className={styles.uploadArea}>
                  <input
                    type="file"
                    accept="video/mp4,video/mov"
                    onChange={handleVideoUpload}
                    className="hidden"
                    id="video-upload"
                  />
                  <label htmlFor="video-upload" className="cursor-pointer">
                    {uploadingVideo ? (
                      <Settings className="w-12 h-12 mx-auto mb-2 animate-spin text-gray-400" />
                    ) : videoUrl ? (
                      <Video className="w-12 h-12 mx-auto mb-2 text-green-500" />
                    ) : (
                      <Upload className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                    )}
                    <p className="mb-1">
                      {uploadingVideo
                        ? 'Subiendo video...'
                        : videoUrl
                        ? 'Video cargado correctamente'
                        : 'Arrastra y suelta un video o haz clic para seleccionar'}
                    </p>
                    <p className="text-sm text-gray-500">
                      Formatos soportados: MP4, MOV
                    </p>
                  </label>
                </div>
              </div>

              {/* Process Button */}
              <div className="flex justify-center">
                <button
                  className={`${styles.button} flex items-center gap-2`}
                  onClick={handleProcessVideo}
                  disabled={!videoUrl || !selectedStyle || processing}
                >
                  {processing ? (
                    <>
                      <Settings className="w-5 h-5 animate-spin" />
                      Procesando...
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5" />
                      Procesar Video
                    </>
                  )}
                </button>
              </div>

              {/* Processed Video */}
              {processedVideo && (
                <div className="mt-6">
                  <h3 className="text-xl font-semibold mb-4">Video Procesado</h3>
                  <div className="aspect-video bg-gray-800 rounded-lg flex items-center justify-center">
                    <video
                      src={processedVideo}
                      controls
                      className="w-full h-full rounded-lg"
                    />
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AIEdit;
