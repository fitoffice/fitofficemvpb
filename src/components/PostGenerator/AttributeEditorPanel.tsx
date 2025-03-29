import React, { useState, useEffect } from 'react';
import { ArrowLeft, Image, Palette, Sliders, Camera, Sparkles, Info } from 'lucide-react';
import Button from '../Common/Button';
import { PulseLoader } from 'react-spinners';

// Interfaces remain the same

// Example presets for quick selection
const stylePresets = [
  {
    name: "Fitness Studio",
    style: "Photorealistic",
    mood: "Energetic",
    colorScheme: "Vibrant",
    lighting: "Studio",
    composition: "Rule of Thirds",
    perspective: "Eye Level",
    visualElements: "Fitness equipment, athletic person, modern gym environment"
  },
  {
    name: "Outdoor Yoga",
    style: "Cinematic",
    mood: "Peaceful",
    colorScheme: "Warm",
    lighting: "Natural",
    composition: "Centered",
    perspective: "Low Angle",
    visualElements: "Yoga mat, person in yoga pose, nature background, sunrise/sunset"
  },
  {
    name: "Nutrition Close-up",
    style: "Minimalist",
    mood: "Calm",
    colorScheme: "Neutral",
    lighting: "Soft",
    composition: "Symmetrical",
    perspective: "Overhead",
    visualElements: "Healthy food, wooden table, minimal props, clean background"
  }
];

const AttributeEditorPanel: React.FC<AttributeEditorPanelProps> = ({
  selectedIdea,
  onBack,
  onGenerateImage,
  isLoading,
  theme
}) => {
  const [activeTab, setActiveTab] = useState<'style' | 'composition' | 'visual' | 'advanced'>('style');
  const [attributes, setAttributes] = useState<ImageAttributes>({
    style: 'Photorealistic',
    mood: 'Calm',
    colorScheme: 'Neutral',
    lighting: 'Natural',
    composition: 'Centered',
    perspective: 'Eye Level',
    aspectRatio: 'Widescreen (16:9)',
    visualElements: '',
    detailLevel: 75
  });
  const [showPresetApplied, setShowPresetApplied] = useState(false);

  const handleAttributeChange = (key: keyof ImageAttributes, value: string | number) => {
    setAttributes(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleGenerateImage = () => {
    onGenerateImage(attributes);
  };

  const applyPreset = (preset: typeof stylePresets[0]) => {
    setAttributes(prev => ({
      ...prev,
      style: preset.style,
      mood: preset.mood,
      colorScheme: preset.colorScheme,
      lighting: preset.lighting,
      composition: preset.composition,
      perspective: preset.perspective,
      visualElements: preset.visualElements
    }));
    
    // Show notification
    setShowPresetApplied(true);
    setTimeout(() => setShowPresetApplied(false), 3000);
  };

  // Auto-populate visual elements based on selected idea
  useEffect(() => {
    if (selectedIdea && !attributes.visualElements) {
      // Extract keywords from the idea description
      const keywords = selectedIdea.description
        .split(' ')
        .filter(word => word.length > 5)
        .slice(0, 3)
        .join(', ');
      
      const suggestedElements = `${selectedIdea.contentType === 'Tutorial de ejercicios' ? 'Person exercising, ' : ''}${keywords}, fitness environment`;
      
      handleAttributeChange('visualElements', suggestedElements);
    }
  }, [selectedIdea]);

  return (
    <div className={`p-6 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-lg relative`}>
      {/* Preset Applied Notification */}
      {showPresetApplied && (
        <div className="absolute top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-md shadow-lg animate-fade-in-out flex items-center gap-2">
          <Sparkles size={16} />
          <span>Preset applied!</span>
        </div>
      )}
      
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-full ${theme === 'dark' ? 'bg-purple-900' : 'bg-purple-100'}`}>
            <Palette size={24} className="text-purple-500" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Personalizar Atributos de Imagen</h2>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Refina cómo se verá tu imagen basada en la idea seleccionada
            </p>
          </div>
        </div>
        <Button
          onClick={onBack}
          variant="outline"
          className="flex items-center gap-2"
        >
          <ArrowLeft size={16} />
          Volver a Ideas
        </Button>
      </div>

      {/* Selected Idea Box */}
      <div className={`p-4 rounded-lg mb-6 ${theme === 'dark' ? 'bg-gray-700/50 border border-purple-800' : 'bg-purple-50 border border-purple-200'}`}>
        <div className="flex items-center gap-2 mb-2">
          <Info size={16} className="text-purple-500" />
          <h3 className="font-medium">Idea Seleccionada</h3>
        </div>
        <h4 className="text-lg font-semibold">{selectedIdea.title}</h4>
        <p className={`text-sm mt-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
          {selectedIdea.description}
        </p>
        {selectedIdea.hashtags && (
          <div className="mt-2">
            <p className={`text-xs ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`}>
              {selectedIdea.hashtags}
            </p>
          </div>
        )}
        <div className={`mt-2 inline-block px-2 py-1 text-xs rounded-full ${theme === 'dark' ? 'bg-gray-600 text-gray-300' : 'bg-gray-200 text-gray-700'}`}>
          {selectedIdea.contentType}
        </div>
      </div>

      {/* Style Presets */}
      <div className="mb-6">
        <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
          <Sparkles size={16} className="text-purple-500" />
          Presets Recomendados
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {stylePresets.map((preset, index) => (
            <button
              key={index}
              onClick={() => applyPreset(preset)}
              className={`p-3 rounded-lg text-left transition-all ${
                theme === 'dark'
                  ? 'bg-gray-700 hover:bg-gray-600 border border-gray-600'
                  : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
              } hover:shadow-md`}
            >
              <div className="font-medium text-sm mb-1">{preset.name}</div>
              <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                {preset.style}, {preset.mood}, {preset.lighting}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex mb-6 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
        <button
          className={`flex items-center justify-center gap-2 py-2 px-4 rounded-md flex-1 text-sm font-medium transition-colors ${
            activeTab === 'style'
              ? 'bg-white dark:bg-gray-600 shadow-sm text-purple-600 dark:text-purple-400'
              : 'hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
          onClick={() => setActiveTab('style')}
        >
          <Palette size={16} />
          Estilo y Ambiente
        </button>
        <button
          className={`flex items-center justify-center gap-2 py-2 px-4 rounded-md flex-1 text-sm font-medium transition-colors ${
            activeTab === 'composition'
              ? 'bg-white dark:bg-gray-600 shadow-sm text-purple-600 dark:text-purple-400'
              : 'hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
          onClick={() => setActiveTab('composition')}
        >
          <Camera size={16} />
          Composición
        </button>
        <button
          className={`flex items-center justify-center gap-2 py-2 px-4 rounded-md flex-1 text-sm font-medium transition-colors ${
            activeTab === 'visual'
              ? 'bg-white dark:bg-gray-600 shadow-sm text-purple-600 dark:text-purple-400'
              : 'hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
          onClick={() => setActiveTab('visual')}
        >
          <Image size={16} />
          Elementos Visuales
        </button>
        <button
          className={`flex items-center justify-center gap-2 py-2 px-4 rounded-md flex-1 text-sm font-medium transition-colors ${
            activeTab === 'advanced'
              ? 'bg-white dark:bg-gray-600 shadow-sm text-purple-600 dark:text-purple-400'
              : 'hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
          onClick={() => setActiveTab('advanced')}
        >
          <Sliders size={16} />
          Avanzado
        </button>
      </div>

      {/* Tab Content */}
      <div className={`mb-6 p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
        {activeTab === 'style' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-purple-500"></span>
                  Estilo de Imagen
                </label>
                <select
                  value={attributes.style}
                  onChange={(e) => handleAttributeChange('style', e.target.value)}
                  className={`w-full p-3 rounded-lg ${
                    theme === 'dark'
                      ? 'bg-gray-700 text-white border-gray-600'
                      : 'bg-white text-gray-900 border-gray-200'
                  } focus:ring-2 focus:ring-purple-500 outline-none border`}
                >
                  <option value="Photorealistic">Fotorrealista</option>
                  <option value="Cinematic">Cinematográfico</option>
                  <option value="Minimalist">Minimalista</option>
                  <option value="Artistic">Artístico</option>
                  <option value="Vintage">Vintage</option>
                  <option value="3D Render">Renderizado 3D</option>
                  <option value="Illustration">Ilustración</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                  Ambiente
                </label>
                <select
                  value={attributes.mood}
                  onChange={(e) => handleAttributeChange('mood', e.target.value)}
                  className={`w-full p-3 rounded-lg ${
                    theme === 'dark'
                      ? 'bg-gray-700 text-white border-gray-600'
                      : 'bg-white text-gray-900 border-gray-200'
                  } focus:ring-2 focus:ring-purple-500 outline-none border`}
                >
                  <option value="Calm">Tranquilo</option>
                  <option value="Energetic">Energético</option>
                  <option value="Inspirational">Inspirador</option>
                  <option value="Dramatic">Dramático</option>
                  <option value="Peaceful">Pacífico</option>
                  <option value="Motivational">Motivador</option>
                  <option value="Intense">Intenso</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-green-500"></span>
                  Esquema de Color
                </label>
                <select
                  value={attributes.colorScheme}
                  onChange={(e) => handleAttributeChange('colorScheme', e.target.value)}
                  className={`w-full p-3 rounded-lg ${
                    theme === 'dark'
                      ? 'bg-gray-700 text-white border-gray-600'
                      : 'bg-white text-gray-900 border-gray-200'
                  } focus:ring-2 focus:ring-purple-500 outline-none border`}
                >
                  <option value="Neutral">Neutral</option>
                  <option value="Vibrant">Vibrante</option>
                  <option value="Monochrome">Monocromático</option>
                  <option value="Warm">Cálido</option>
                  <option value="Cool">Frío</option>
                  <option value="Pastel">Pastel</option>
                  <option value="High Contrast">Alto Contraste</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
                  Iluminación
                </label>
                <select
                  value={attributes.lighting}
                  onChange={(e) => handleAttributeChange('lighting', e.target.value)}
                  className={`w-full p-3 rounded-lg ${
                    theme === 'dark'
                      ? 'bg-gray-700 text-white border-gray-600'
                      : 'bg-white text-gray-900 border-gray-200'
                  } focus:ring-2 focus:ring-purple-500 outline-none border`}
                >
                  <option value="Natural">Natural</option>
                  <option value="Soft">Suave</option>
                  <option value="Dramatic">Dramática</option>
                  <option value="Backlit">Contraluz</option>
                  <option value="Studio">Estudio</option>
                  <option value="Golden Hour">Hora dorada</option>
                  <option value="Low Light">Poca luz</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'composition' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-500"></span>
                  Composición
                </label>
                <select
                  value={attributes.composition}
                  onChange={(e) => handleAttributeChange('composition', e.target.value)}
                  className={`w-full p-3 rounded-lg ${
                    theme === 'dark'
                      ? 'bg-gray-700 text-white border-gray-600'
                      : 'bg-white text-gray-900 border-gray-200'
                  } focus:ring-2 focus:ring-purple-500 outline-none border`}
                >
                  <option value="Centered">Centrada</option>
                  <option value="Rule of Thirds">Regla de Tercios</option>
                  <option value="Symmetrical">Simétrica</option>
                  <option value="Diagonal">Diagonal</option>
                  <option value="Leading Lines">Líneas Guía</option>
                  <option value="Frame within Frame">Marco dentro de Marco</option>
                  <option value="Minimalist">Minimalista</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-indigo-500"></span>
                  Perspectiva
                </label>
                <select
                  value={attributes.perspective}
                  onChange={(e) => handleAttributeChange('perspective', e.target.value)}
                  className={`w-full p-3 rounded-lg ${
                    theme === 'dark'
                      ? 'bg-gray-700 text-white border-gray-600'
                      : 'bg-white text-gray-900 border-gray-200'
                  } focus:ring-2 focus:ring-purple-500 outline-none border`}
                >
                  <option value="Eye Level">Nivel de los Ojos</option>
                  <option value="Bird's Eye">Vista de Pájaro</option>
                  <option value="Low Angle">Ángulo Bajo</option>
                  <option value="Dutch Angle">Ángulo Holandés</option>
                  <option value="Overhead">Vista Superior</option>
                  <option value="Worm's Eye">Vista de Gusano</option>
                  <option value="First Person">Primera Persona</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-orange-500"></span>
                Relación de Aspecto
              </label>
              <select
                value={attributes.aspectRatio}
                onChange={(e) => handleAttributeChange('aspectRatio', e.target.value)}
                className={`w-full p-3 rounded-lg ${
                  theme === 'dark'
                    ? 'bg-gray-700 text-white border-gray-600'
                    : 'bg-white text-gray-900 border-gray-200'
                } focus:ring-2 focus:ring-purple-500 outline-none border`}
              >
                <option value="Widescreen (16:9)">Panorámica (16:9)</option>
                <option value="Square (1:1)">Cuadrada (1:1)</option>
                <option value="Portrait (3:4)">Retrato (3:4)</option>
                <option value="Landscape (4:3)">Paisaje (4:3)</option>
                <option value="Cinematic (21:9)">Cinematográfica (21:9)</option>
                <option value="Instagram Story (9:16)">Instagram Story (9:16)</option>
                <option value="Facebook Cover (2.7:1)">Facebook Cover (2.7:1)</option>
              </select>
              
              <div className="mt-4 grid grid-cols-3 gap-2">
                {['Widescreen (16:9)', 'Square (1:1)', 'Portrait (3:4)'].map(ratio => (
                  <button
                    key={ratio}
                    onClick={() => handleAttributeChange('aspectRatio', ratio)}
                    className={`p-2 border rounded-md flex items-center justify-center transition-all ${
                      attributes.aspectRatio === ratio
                        ? 'bg-purple-100 dark:bg-purple-900 border-purple-500'
                        : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600'
                    }`}
                  >
                    <div className={`
                      ${ratio === 'Widescreen (16:9)' ? 'w-16 h-9' : 
                        ratio === 'Square (1:1)' ? 'w-12 h-12' : 
                        'w-9 h-12'}
                      bg-gray-300 dark:bg-gray-500 rounded
                    `}></div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'visual' && (
          <div>
            <label className="block text-sm font-medium mb-2 flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-pink-500"></span>
              Elementos Visuales
            </label>
            <p className={`text-sm mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Describe elementos específicos que quieres incluir en la imagen
            </p>
            <textarea
              value={attributes.visualElements}
              onChange={(e) => handleAttributeChange('visualElements', e.target.value)}
              placeholder="Ej: persona haciendo ejercicio, pesas, esterilla de yoga, luz natural, fondo minimalista"
              className={`w-full p-3 rounded-lg resize-none ${
                theme === 'dark'
                  ? 'bg-gray-700 text-white border-gray-600'
                  : 'bg-white text-gray-900 border-gray-200'
              } focus:ring-2 focus:ring-purple-500 outline-none border`}
              rows={6}
            />
            
            <div className="mt-4">
              <h4 className="text-sm font-medium mb-2">Sugerencias rápidas</h4>
              <div className="flex flex-wrap gap-2">
                {['persona atlética', 'pesas', 'esterilla de yoga', 'comida saludable', 'paisaje natural', 'gimnasio moderno', 'luz natural'].map(element => (
                  <button
                    key={element}
                    onClick={() => handleAttributeChange('visualElements', 
                      attributes.visualElements ? `${attributes.visualElements}, ${element}` : element
                    )}
                    className={`text-xs px-3 py-1 rounded-full ${
                      theme === 'dark' 
                        ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    }`}
                  >
                    + {element}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'advanced' && (
          <div>
            <div className="mb-6">
              <div className="flex justify-between mb-2">
                <label className="block text-sm font-medium flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-teal-500"></span>
                  Nivel de Detalle
                </label>
                <span className="text-sm text-gray-500">{attributes.detailLevel}%</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs">Simple</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={attributes.detailLevel}
                  onChange={(e) => handleAttributeChange('detailLevel', parseInt(e.target.value))}
                  className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                />
                <span className="text-xs">Detallado</span>
              </div>
              <p className={`text-xs mt-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                Un nivel de detalle más alto generará imágenes con más elementos y texturas.
              </p>
            </div>
            
            <div className="p-4 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800">
              <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                <Info size={14} className="text-purple-500" />
                Consejos para mejores resultados
              </h4>
              <ul className={`text-xs space-y-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                <li>• Sé específico con los elementos visuales para obtener resultados más precisos</li>
                <li>• Combina estilos como "Cinematic" con iluminación "Dramatic" para efectos impactantes</li>
                <li>• Para imágenes de fitness, la perspectiva "Low Angle" suele dar resultados más dinámicos</li>
                <li>• Usa "Rule of Thirds" para composiciones más interesantes visualmente</li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Preview */}
      <div className={`p-4 rounded-lg mb-6 ${theme === 'dark' ? 'bg-gray-700/30' : 'bg-gray-100'}`}>
        <h3 className="text-sm font-medium mb-3">Vista previa de configuración</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
          <div className={`p-2 rounded ${theme === 'dark' ? 'bg-gray-700' : 'bg-white'}`}>
            <span className="font-medium">Estilo:</span> {attributes.style}
          </div>
          <div className={`p-2 rounded ${theme === 'dark' ? 'bg-gray-700' : 'bg-white'}`}>
            <span className="font-medium">Ambiente:</span> {attributes.mood}
          </div>
          <div className={`p-2 rounded ${theme === 'dark' ? 'bg-gray-700' : 'bg-white'}`}>
            <span className="font-medium">Color:</span> {attributes.colorScheme}
          </div>
          <div className={`p-2 rounded ${theme === 'dark' ? 'bg-gray-700' : 'bg-white'}`}>
            <span className="font-medium">Iluminación:</span> {attributes.lighting}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
        <Button
          onClick={onBack}
          variant="outline"
          className="px-6"
        >
          Volver
        </Button>
        <Button
          onClick={handleGenerateImage}
          disabled={isLoading}
          variant="primary"
          className="px-6 flex items-center gap-2"
        >
          {isLoading ? (
            <PulseLoader color="#ffffff" size={8} />
          ) : (
            <>
              <Image size={16} />
              Generar Imagen
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default AttributeEditorPanel;