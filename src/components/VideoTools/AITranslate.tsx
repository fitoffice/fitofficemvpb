import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Video, Upload, Play, Settings, Languages } from 'lucide-react';

interface AITranslateProps {
  isOpen: boolean;
  onClose: () => void;
  theme: string;
}

const languages = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' },
  { code: 'it', name: 'Italiano' },
  { code: 'pt', name: 'Português' },
  { code: 'zh', name: 'Chinese (中文)' },
  { code: 'ja', name: 'Japanese (日本語)' },
  { code: 'ko', name: 'Korean (한국어)' },
  { code: 'hi', name: 'Hindi (हिन्दी)' },
  { code: 'ar', name: 'Arabic (العربية)' },
  { code: 'ru', name: 'Russian (Русский)' }
];

const AITranslate: React.FC<AITranslateProps> = ({ isOpen, onClose, theme }) => {
  const [videoUrl, setVideoUrl] = useState('');
  const [sourceLanguage, setSourceLanguage] = useState('');
  const [targetLanguage, setTargetLanguage] = useState('');
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [translating, setTranslating] = useState(false);
  const [translatedVideoUrl, setTranslatedVideoUrl] = useState('');

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

  const handleTranslate = () => {
    if (!videoUrl || !sourceLanguage || !targetLanguage) {
      alert('Por favor, completa todos los campos requeridos');
      return;
    }

    setTranslating(true);
    // Simular traducción del video
    setTimeout(() => {
      setTranslatedVideoUrl(videoUrl); // En un caso real, esto sería la URL del video traducido
      setTranslating(false);
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
    }`
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
                <Languages className="w-6 h-6" />
                AI Translate
              </h2>
              <button onClick={onClose} className={styles.closeButton}>
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Video Upload */}
              <div>
                <label className="block font-medium mb-2">
                  Video a Traducir *
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

              {/* Language Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Source Language */}
                <div>
                  <label className="block font-medium mb-2">
                    Idioma Original *
                  </label>
                  <select
                    className={styles.select}
                    value={sourceLanguage}
                    onChange={(e) => setSourceLanguage(e.target.value)}
                  >
                    <option value="">Selecciona un idioma</option>
                    {languages.map((lang) => (
                      <option key={`source-${lang.code}`} value={lang.code}>
                        {lang.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Target Language */}
                <div>
                  <label className="block font-medium mb-2">
                    Idioma Destino *
                  </label>
                  <select
                    className={styles.select}
                    value={targetLanguage}
                    onChange={(e) => setTargetLanguage(e.target.value)}
                  >
                    <option value="">Selecciona un idioma</option>
                    {languages.map((lang) => (
                      <option key={`target-${lang.code}`} value={lang.code}>
                        {lang.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Translate Button */}
              <div className="flex justify-center">
                <button
                  className={`${styles.button} flex items-center gap-2`}
                  onClick={handleTranslate}
                  disabled={!videoUrl || !sourceLanguage || !targetLanguage || translating}
                >
                  {translating ? (
                    <>
                      <Settings className="w-5 h-5 animate-spin" />
                      Traduciendo...
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5" />
                      Traducir Video
                    </>
                  )}
                </button>
              </div>

              {/* Translated Video Preview */}
              {translatedVideoUrl && (
                <div className="mt-6">
                  <h3 className="text-xl font-semibold mb-4">Video Traducido</h3>
                  <div className="aspect-video bg-gray-800 rounded-lg flex items-center justify-center">
                    <video
                      src={translatedVideoUrl}
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

export default AITranslate;
