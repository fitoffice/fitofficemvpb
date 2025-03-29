import React, { useState } from 'react';
import { RefreshCcw, Settings, Share, Download, ArrowLeft, Camera, Sliders, Eye, Palette, Layers, Info } from 'lucide-react';
import Button from '../Common/Button';
import { PulseLoader } from 'react-spinners';

interface ImageAttributes {
  style: string;
  mood: string;
  colorScheme: string;
  lighting: string;
  composition: string;
  perspective: string;
  aspectRatio: string;
  visualElements: string;
  detailLevel: number;
}

interface ImagePreviewPanelProps {
  imageUrl: string;
  attributes: ImageAttributes;
  onBack: () => void;
  onRegenerateImage: () => Promise<void>;
  onAdjustAttributes: () => void;
  isLoading: boolean;
  theme: 'dark' | 'light';
}

// Example image URL for when no real image is available yet
const exampleImageUrl = 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80';

const ImagePreviewPanel: React.FC<ImagePreviewPanelProps> = ({
  imageUrl,
  attributes,
  onBack,
  onRegenerateImage,
  onAdjustAttributes,
  isLoading,
  theme
}) => {
  const [zoomLevel, setZoomLevel] = useState(100);
  const [activeTab, setActiveTab] = useState<'preview' | 'details'>('preview');
  const [showTooltip, setShowTooltip] = useState(false);

  // Use example image if no real image is provided
  const displayImageUrl = imageUrl || exampleImageUrl;

  const handleZoomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setZoomLevel(parseInt(e.target.value));
  };

  const handleSaveImage = () => {
    // Create a temporary link element
    const link = document.createElement('a');
    link.href = displayImageUrl;
    link.download = `fitness-post-image-${new Date().getTime()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Show tooltip
    setShowTooltip(true);
    setTimeout(() => setShowTooltip(false), 3000);
  };

  const handleShare = () => {
    // Implement sharing functionality
    if (navigator.share) {
      navigator.share({
        title: 'Mi Imagen de Fitness Generada con IA',
        text: '¡Mira esta imagen que creé con IA para mi post de fitness!',
        url: displayImageUrl,
      })
      .catch((error) => console.log('Error sharing', error));
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard.writeText(displayImageUrl)
        .then(() => {
          setShowTooltip(true);
          setTimeout(() => setShowTooltip(false), 3000);
        })
        .catch((err) => console.error('Could not copy text: ', err));
    }
  };

  return (
    <div className={`p-6 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-lg relative`}>
      {/* Success tooltip */}
      {showTooltip && (
        <div className="absolute top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-md shadow-lg animate-fade-in-out flex items-center gap-2 z-50">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          <span>¡Imagen guardada correctamente!</span>
        </div>
      )}
      
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-full ${theme === 'dark' ? 'bg-purple-900' : 'bg-purple-100'}`}>
            <Camera size={24} className="text-purple-500" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Vista Previa de Imagen</h2>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Visualiza y descarga tu imagen generada
            </p>
          </div>
        </div>
        <Button
          onClick={onBack}
          variant="outline"
          className="flex items-center gap-2"
        >
          <ArrowLeft size={16} />
          Volver a Atributos
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex mb-6 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
        <button
          className={`flex items-center justify-center gap-2 py-2 px-4 rounded-md flex-1 text-sm font-medium transition-colors ${
            activeTab === 'preview'
              ? 'bg-white dark:bg-gray-600 shadow-sm text-purple-600 dark:text-purple-400'
              : 'hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
          onClick={() => setActiveTab('preview')}
        >
          <Eye size={16} />
          Vista Previa
        </button>
        <button
          className={`flex items-center justify-center gap-2 py-2 px-4 rounded-md flex-1 text-sm font-medium transition-colors ${
            activeTab === 'details'
              ? 'bg-white dark:bg-gray-600 shadow-sm text-purple-600 dark:text-purple-400'
              : 'hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
          onClick={() => setActiveTab('details')}
        >
          <Layers size={16} />
          Detalles
        </button>
      </div>

      {activeTab === 'preview' && (
        <>
          {/* Image Preview Container */}
          <div className="relative rounded-lg overflow-hidden mb-6">
            {isLoading ? (
              <div className="aspect-video bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                <div className="flex flex-col items-center">
                  <PulseLoader color={theme === 'dark' ? '#ffffff' : '#000000'} size={12} />
                  <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">Generando imagen de alta calidad...</p>
                </div>
              </div>
            ) : (
              <div 
                className="relative overflow-hidden rounded-lg"
                style={{ 
                  background: 'linear-gradient(45deg, #ff6b6b, #feca57, #48dbfb, #1dd1a1, #5f27cd)',
                  backgroundSize: '400% 400%',
                  animation: 'gradient 15s ease infinite'
                }}
              >
                <img 
                  src={displayImageUrl} 
                  alt="Vista previa generada" 
                  className="w-full h-auto object-contain"
                  style={{ 
                    transform: `scale(${zoomLevel / 100})`,
                    transformOrigin: 'center',
                    transition: 'transform 0.3s ease'
                  }}
                />
                
                {/* Zoom control */}
                <div className="absolute bottom-4 left-4 right-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full px-4 py-2 flex items-center gap-2">
                  <span className="text-xs whitespace-nowrap">Zoom:</span>
                  <input
                    type="range"
                    min="50"
                    max="200"
                    value={zoomLevel}
                    onChange={handleZoomChange}
                    className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                  />
                  <span className="text-xs whitespace-nowrap">{zoomLevel}%</span>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2 mb-6">
            <Button
              onClick={onRegenerateImage}
              disabled={isLoading}
              variant="outline"
              className="flex items-center gap-2"
            >
              <RefreshCcw size={16} />
              Regenerar
            </Button>
            
            <Button
              onClick={onAdjustAttributes}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Settings size={16} />
              Ajustar Atributos
            </Button>
            
            <Button
              onClick={() => {}}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Sliders size={16} />
              Ajustes de Imagen
            </Button>
            
            <div className="flex-grow"></div>
            
            <Button
              onClick={handleShare}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Share size={16} />
              Compartir
            </Button>
            
            <Button
              onClick={handleSaveImage}
              variant="primary"
              className="flex items-center gap-2"
            >
              <Download size={16} />
              Guardar Imagen
            </Button>
          </div>
        </>
      )}

      {activeTab === 'details' && (
        <div className="space-y-6">
          {/* Image Attributes Summary */}
          <div className={`p-5 rounded-lg ${theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'} border ${theme === 'dark' ? 'border-gray-600' : 'border-gray-200'}`}>
            <h3 className="font-medium mb-4 flex items-center gap-2">
              <Palette size={18} className="text-purple-500" />
              Atributos de Imagen
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-white'} border ${theme === 'dark' ? 'border-gray-600' : 'border-gray-200'}`}>
                <h4 className="text-sm font-medium mb-1 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                  Estilo
                </h4>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                  {attributes.style}
                </p>
              </div>
              
              <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-white'} border ${theme === 'dark' ? 'border-gray-600' : 'border-gray-200'}`}>
                <h4 className="text-sm font-medium mb-1 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                  Ambiente
                </h4>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                  {attributes.mood}
                </p>
              </div>
              
              <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-white'} border ${theme === 'dark' ? 'border-gray-600' : 'border-gray-200'}`}>
                <h4 className="text-sm font-medium mb-1 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                  Esquema de Color
                </h4>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                  {attributes.colorScheme}
                </p>
              </div>
              
              <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-white'} border ${theme === 'dark' ? 'border-gray-600' : 'border-gray-200'}`}>
                <h4 className="text-sm font-medium mb-1 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                  Iluminación
                </h4>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                  {attributes.lighting}
                </p>
              </div>
              
              <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-white'} border ${theme === 'dark' ? 'border-gray-600' : 'border-gray-200'}`}>
                <h4 className="text-sm font-medium mb-1 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500"></span>
                  Composición
                </h4>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                  {attributes.composition}
                </p>
              </div>
              
              <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-white'} border ${theme === 'dark' ? 'border-gray-600' : 'border-gray-200'}`}>
                <h4 className="text-sm font-medium mb-1 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                  Perspectiva
                </h4>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                  {attributes.perspective}
                </p>
              </div>
              
              <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-white'} border ${theme === 'dark' ? 'border-gray-600' : 'border-gray-200'}`}>
                <h4 className="text-sm font-medium mb-1 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                  Relación de Aspecto
                </h4>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                  {attributes.aspectRatio}
                </p>
              </div>
            </div>
            
            <div className="mt-4">
              <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-pink-500"></span>
                Elementos Visuales
              </h4>
              <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-white'} border ${theme === 'dark' ? 'border-gray-600' : 'border-gray-200'}`}>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                  {attributes.visualElements || "No se especificaron elementos visuales"}
                </p>
              </div>
            </div>
            
            <div className="mt-4">
              <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-teal-500"></span>
                Nivel de Detalle
              </h4>
              <div className="flex items-center gap-3">
                <span className="text-xs">Simple</span>
                <div className="flex-1 h-2 bg-gray-200 rounded-lg overflow-hidden dark:bg-gray-700">
                  <div 
                    className="h-full bg-purple-500" 
                    style={{ width: `${attributes.detailLevel}%` }}
                  ></div>
                </div>
                <span className="text-xs">Detallado</span>
                <span className="text-xs font-medium">{attributes.detailLevel}%</span>
              </div>
            </div>
          </div>
          
          {/* Technical Information */}
          <div className={`p-5 rounded-lg ${theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'} border ${theme === 'dark' ? 'border-gray-600' : 'border-gray-200'}`}>
            <h3 className="font-medium mb-4 flex items-center gap-2">
              <Info size={18} className="text-purple-500" />
              Información Técnica
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-xs font-medium mb-1 text-gray-500 dark:text-gray-400">Formato</h4>
                <p className="text-sm">PNG</p>
              </div>
              <div>
                <h4 className="text-xs font-medium mb-1 text-gray-500 dark:text-gray-400">Resolución</h4>
                <p className="text-sm">1024 x 1024 px</p>
              </div>
              <div>
                <h4 className="text-xs font-medium mb-1 text-gray-500 dark:text-gray-400">Modelo</h4>
                <p className="text-sm">Stable Diffusion XL</p>
              </div>
              <div>
                <h4 className="text-xs font-medium mb-1 text-gray-500 dark:text-gray-400">Fecha de Creación</h4>
                <p className="text-sm">{new Date().toLocaleDateString()}</p>
              </div>
            </div>
            
            <div className="mt-4">
              <h4 className="text-xs font-medium mb-1 text-gray-500 dark:text-gray-400">Prompt Utilizado</h4>
              <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-white'} border ${theme === 'dark' ? 'border-gray-600' : 'border-gray-200'} text-xs font-mono`}>
                {`${attributes.style} image of ${attributes.visualElements}, with ${attributes.mood} mood, ${attributes.colorScheme} color scheme, ${attributes.lighting} lighting, ${attributes.composition} composition, from ${attributes.perspective} perspective`}
              </div>
            </div>
          </div>
          
          {/* Usage Tips */}
          <div className={`p-5 rounded-lg ${theme === 'dark' ? 'bg-purple-900/20' : 'bg-purple-50'} border ${theme === 'dark' ? 'border-purple-800' : 'border-purple-200'}`}>
            <h3 className="font-medium mb-3 flex items-center gap-2 text-purple-600 dark:text-purple-400">
              <Lightbulb size={18} />
              Consejos de Uso
            </h3>
            
            <ul className={`text-sm space-y-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              <li className="flex items-start gap-2">
                <span className="text-purple-500 mt-1">•</span>
                <span>Esta imagen es perfecta para publicaciones en Instagram y Facebook</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-500 mt-1">•</span>
                <span>Combina esta imagen con texto que resalte los beneficios del fitness</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-500 mt-1">•</span>
                <span>Programa tu publicación para las horas de mayor actividad (7-9am o 5-7pm)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-500 mt-1">•</span>
                <span>Utiliza los hashtags generados para aumentar el alcance de tu publicación</span>
              </li>
            </ul>
          </div>
        </div>
      )}
      
      {/* Footer Action Buttons */}
      <div className="flex justify-between pt-4 border-t border-gray-200 dark:border-gray-700 mt-6">
        <Button
          onClick={onBack}
          variant="outline"
          className="px-6"
        >
          Volver
        </Button>
        <Button
          onClick={handleSaveImage}
          variant="primary"
          className="px-6 flex items-center gap-2"
        >
          <Download size={16} />
          Guardar Imagen
        </Button>
      </div>
    </div>
  );
};

export default ImagePreviewPanel;