import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Video, Play, Settings, Download, User } from 'lucide-react';

interface Creator {
  id: string;
  name: string;
  avatar: string;
  description: string;
}

interface AICreatorProps {
  isOpen: boolean;
  onClose: () => void;
  theme: string;
}

const creators: Creator[] = [
  {
    id: 'creator1',
    name: 'Emma Thompson',
    avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
    description: 'Especialista en videos motivacionales y desarrollo personal'
  },
  {
    id: 'creator2',
    name: 'John Davis',
    avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
    description: 'Experto en contenido educativo y tutoriales técnicos'
  },
  {
    id: 'creator3',
    name: 'Sarah Wilson',
    avatar: 'https://randomuser.me/api/portraits/women/3.jpg',
    description: 'Creadora de contenido de estilo de vida y bienestar'
  },
  {
    id: 'creator4',
    name: 'Michael Chen',
    avatar: 'https://randomuser.me/api/portraits/men/4.jpg',
    description: 'Especialista en videos corporativos y presentaciones profesionales'
  }
];

const AICreator: React.FC<AICreatorProps> = ({ isOpen, onClose, theme }) => {
  const [generating, setGenerating] = useState(false);
  const [generatedVideos, setGeneratedVideos] = useState<string[]>([]);
  const [selectedCreator, setSelectedCreator] = useState<string>('');
  const [scriptContent, setScriptContent] = useState('');

  const handleGenerate = () => {
    if (!selectedCreator || !scriptContent.trim()) {
      alert('Por favor selecciona un creador y escribe el contenido del video');
      return;
    }

    setGenerating(true);
    // Simulación de generación de videos
    setTimeout(() => {
      setGeneratedVideos([
        'Video_1.mp4',
        'Video_2.mp4',
        'Video_3.mp4',
      ]);
      setGenerating(false);
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
    button: `px-4 py-2 rounded-lg transition-colors ${
      theme === 'dark'
        ? 'bg-blue-600 hover:bg-blue-700 text-white'
        : 'bg-blue-500 hover:bg-blue-600 text-white'
    }`,
    creatorCard: (selected: boolean) => `
      p-4 rounded-lg cursor-pointer transition-all transform hover:scale-105 ${
        selected
          ? theme === 'dark'
            ? 'bg-blue-600 text-white'
            : 'bg-blue-500 text-white'
          : theme === 'dark'
          ? 'bg-gray-700 hover:bg-gray-600'
          : 'bg-gray-100 hover:bg-gray-200'
      }
    `,
    textarea: `w-full p-4 rounded-lg resize-none transition-colors ${
      theme === 'dark'
        ? 'bg-gray-700 text-white placeholder-gray-400'
        : 'bg-gray-100 text-gray-900 placeholder-gray-500'
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
                <Video className="w-6 h-6" />
                AI Creator
              </h2>
              <button onClick={onClose} className={styles.closeButton}>
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Creator Selection */}
              <div>
                <h3 className="text-xl font-semibold mb-4">Selecciona un Creador</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {creators.map((creator) => (
                    <div
                      key={creator.id}
                      className={styles.creatorCard(selectedCreator === creator.id)}
                      onClick={() => setSelectedCreator(creator.id)}
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={creator.avatar}
                          alt={creator.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div>
                          <h4 className="font-semibold">{creator.name}</h4>
                          <p className="text-sm opacity-80">{creator.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Script Content */}
              <div>
                <h3 className="text-xl font-semibold mb-4">Contenido del Video</h3>
                <textarea
                  className={styles.textarea}
                  rows={6}
                  placeholder="Escribe aquí el contenido que quieres que el creador presente en el video..."
                  value={scriptContent}
                  onChange={(e) => setScriptContent(e.target.value)}
                />
              </div>

              {/* Generation Controls */}
              <div className="flex justify-center">
                <button
                  className={`${styles.button} flex items-center gap-2 px-8 py-3 text-lg`}
                  onClick={handleGenerate}
                  disabled={!selectedCreator || !scriptContent.trim() || generating}
                >
                  {generating ? (
                    <>
                      <Settings className="w-5 h-5 animate-spin" />
                      Generando...
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5" />
                      Generar Video
                    </>
                  )}
                </button>
              </div>

              {/* Generated Videos */}
              {generatedVideos.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-xl font-semibold mb-4">Videos Generados</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {generatedVideos.map((video, index) => (
                      <div
                        key={index}
                        className={`p-4 rounded-lg ${
                          theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                        }`}
                      >
                        <div className="aspect-video bg-gray-800 rounded-lg mb-2 flex items-center justify-center">
                          <Video className="w-8 h-8 text-gray-400" />
                        </div>
                        <p className="font-medium mb-2">{video}</p>
                        <button
                          className={`${styles.button} w-full flex items-center justify-center gap-2`}
                        >
                          <Download className="w-4 h-4" />
                          Descargar
                        </button>
                      </div>
                    ))}
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

export default AICreator;
