import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Video, Camera, Upload, Play, Settings, Wand2 } from 'lucide-react';

interface AITwinProps {
  isOpen: boolean;
  onClose: () => void;
  theme: string;
}

interface CalibrationImage {
  url: string;
  pose: string;
}

const calibrationPoses = [
  { id: 1, name: 'Cara Neutra', description: 'Haz una cara neutra mirando directamente a la cámara' },
  { id: 2, name: 'Sonido "ooh"', description: 'Forma tu boca para hacer un sonido "ooh"' },
  { id: 3, name: 'Mostrar Dientes', description: 'Muestra tus dientes superiores e inferiores' },
  { id: 4, name: 'Sonido "aah"', description: 'Forma tu boca para hacer un sonido "aah"' },
  { id: 5, name: 'Fruncir Labios', description: 'Frunce los labios completamente' },
];

const AITwin: React.FC<AITwinProps> = ({ isOpen, onClose, theme }) => {
  const [name, setName] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [language, setLanguage] = useState('English');
  const [calibrationImages, setCalibrationImages] = useState<CalibrationImage[]>([]);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [generatingScript, setGeneratingScript] = useState(false);
  const [script, setScript] = useState('');

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

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>, poseId: number) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadingImage(true);
      // Simular carga de imagen
      setTimeout(() => {
        const imageUrl = URL.createObjectURL(file);
        setCalibrationImages(prev => {
          const newImages = [...prev];
          const index = newImages.findIndex(img => img.pose === poseId.toString());
          if (index !== -1) {
            newImages[index] = { url: imageUrl, pose: poseId.toString() };
          } else {
            newImages.push({ url: imageUrl, pose: poseId.toString() });
          }
          return newImages;
        });
        setUploadingImage(false);
      }, 1000);
    }
  };

  const handleSubmit = () => {
    if (!name || !videoUrl || calibrationImages.length < calibrationPoses.length) {
      alert('Por favor completa todos los campos requeridos');
      return;
    }
    // Aquí iría la lógica para enviar los datos al servidor
    console.log({
      name,
      videoUrl,
      language,
      calibrationImages
    });
  };

  const handleGenerateScript = () => {
    if (!name) {
      alert('Por favor, ingresa un nombre para tu IA gemela antes de generar el script');
      return;
    }
    
    setGeneratingScript(true);
    // Simulación de generación de script
    setTimeout(() => {
      const generatedScript = `Hola, soy ${name}. 
Para calibrar mi gemelo digital, realizaré las siguientes expresiones:

1. Primero, mostraré una expresión neutral
2. Luego, formaré mi boca para hacer un sonido "ooh"
3. Después, mostraré mis dientes superiores e inferiores
4. Continuaré formando mi boca para hacer un sonido "aah"
5. Finalmente, frunciré mis labios completamente

Estas expresiones ayudarán a capturar mi rango completo de movimientos faciales.`;
      
      setScript(generatedScript);
      setGeneratingScript(false);
    }, 2000);
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
    input: `w-full p-3 rounded-lg transition-colors ${
      theme === 'dark'
        ? 'bg-gray-700 text-white placeholder-gray-400'
        : 'bg-gray-100 text-gray-900 placeholder-gray-500'
    }`,
    select: `w-full p-3 rounded-lg ${
      theme === 'dark'
        ? 'bg-gray-700 text-white'
        : 'bg-gray-100 text-gray-900'
    }`,
    uploadArea: `border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
      theme === 'dark'
        ? 'border-gray-700 hover:border-gray-600'
        : 'border-gray-300 hover:border-gray-400'
    }`,
    button: `px-6 py-3 rounded-lg transition-colors ${
      theme === 'dark'
        ? 'bg-blue-600 hover:bg-blue-700 text-white'
        : 'bg-blue-500 hover:bg-blue-600 text-white'
    }`,
    scriptArea: `w-full p-4 rounded-lg ${
      theme === 'dark'
        ? 'bg-gray-700 text-white'
        : 'bg-gray-100 text-gray-900'
    }`,
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
                <Video className="w-6 h-6" />
                AI Twin
              </h2>
              <button onClick={onClose} className={styles.closeButton}>
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Nombre */}
              <div>
                <label className="block font-medium mb-2">
                  Nombre de tu IA gemela *
                </label>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="Ej: Emma Assistant"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              {/* Script Generation */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block font-medium">
                    Script de Calibración
                  </label>
                  <button
                    className={`${styles.button} flex items-center gap-2 text-sm px-4 py-2`}
                    onClick={handleGenerateScript}
                    disabled={!name || generatingScript}
                  >
                    {generatingScript ? (
                      <>
                        <Settings className="w-4 h-4 animate-spin" />
                        Generando...
                      </>
                    ) : (
                      <>
                        <Wand2 className="w-4 h-4" />
                        Generar Script
                      </>
                    )}
                  </button>
                </div>
                {script && (
                  <div className={`${styles.scriptArea} mb-4`}>
                    <p className="whitespace-pre-line">{script}</p>
                  </div>
                )}
              </div>

              {/* Video Upload */}
              <div>
                <label className="block font-medium mb-2">
                  Video de Calibración *
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
                        : 'Sube un video vertical (MP4 o MOV)'}
                    </p>
                    <p className="text-sm text-gray-500">
                      El video debe mostrar tu rostro claramente mientras hablas
                    </p>
                  </label>
                </div>
              </div>

              {/* Language */}
              <div>
                <label className="block font-medium mb-2">
                  Idioma
                </label>
                <select
                  className={styles.select}
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                >
                  <option value="English">English</option>
                  <option value="Spanish">Español</option>
                  <option value="French">Français</option>
                  <option value="German">Deutsch</option>
                </select>
              </div>

              {/* Calibration Images */}
              <div>
                <label className="block font-medium mb-4">
                  Imágenes de Calibración *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {calibrationPoses.map((pose) => (
                    <div
                      key={pose.id}
                      className={`p-4 rounded-lg ${
                        theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                      }`}
                    >
                      <h4 className="font-medium mb-2">{pose.name}</h4>
                      <p className="text-sm mb-3 opacity-75">{pose.description}</p>
                      <div className={styles.uploadArea}>
                        <input
                          type="file"
                          accept="image/png,image/jpeg"
                          onChange={(e) => handleImageUpload(e, pose.id)}
                          className="hidden"
                          id={`image-upload-${pose.id}`}
                        />
                        <label
                          htmlFor={`image-upload-${pose.id}`}
                          className="cursor-pointer"
                        >
                          {calibrationImages.find(img => img.pose === pose.id.toString()) ? (
                            <Camera className="w-8 h-8 mx-auto mb-2 text-green-500" />
                          ) : (
                            <Camera className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                          )}
                          <p className="text-sm">
                            {calibrationImages.find(img => img.pose === pose.id.toString())
                              ? 'Imagen cargada'
                              : 'Subir imagen'}
                          </p>
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-center pt-4">
                <button
                  className={`${styles.button} flex items-center gap-2`}
                  onClick={handleSubmit}
                  disabled={!name || !videoUrl || calibrationImages.length < calibrationPoses.length}
                >
                  <Play className="w-5 h-5" />
                  Crear AI Twin
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AITwin;
