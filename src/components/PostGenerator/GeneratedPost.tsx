import React, { useState } from 'react';
import Button from '../Common/Button';
import { ArrowLeft, Image } from 'lucide-react';
import { PulseLoader } from 'react-spinners';
import { PostContent } from '../../types/post';

interface GeneratedPostProps {
  postContent: PostContent;
  theme: string;
  onGenerateImage: (selectedStyle: typeof imageStyles[0]) => void;
  isLoading: boolean;
}

const imageStyles = [
  { id: 'realista', style: 'Realista', mood: 'Profesional y auténtico' },
  { id: 'minimalista', style: 'Minimalista', mood: 'Limpio y simple' },
  { id: 'artistico', style: 'Artístico', mood: 'Creativo y expresivo' },
  { id: 'diseno_plano', style: 'Diseño Plano', mood: 'Moderno y elegante' },
  { id: 'render_3d', style: 'Render 3D', mood: 'Dinámico y dimensional' },
  { id: 'acuarela', style: 'Acuarela', mood: 'Suave y soñador' },
  { id: 'vintage', style: 'Vintage', mood: 'Nostálgico y clásico' },
  { id: 'caricatura', style: 'Caricatura', mood: 'Divertido y juguetón' },
  { id: 'cinematografico', style: 'Cinematográfico', mood: 'Dramático e impactante' },
  { id: 'pop_art', style: 'Pop Art', mood: 'Audaz y vibrante' },
  { id: 'cyberpunk', style: 'Cyberpunk', mood: 'Futurista y vanguardista' },
  { id: 'abstracto', style: 'Abstracto', mood: 'Conceptual y reflexivo' },
  { id: 'anime', style: 'Anime', mood: 'Estilizado y expresivo' },
  { id: 'oleo', style: 'Óleo', mood: 'Rico en texturas y profundo' },
  { id: 'arte_digital', style: 'Arte Digital', mood: 'Moderno y pulido' }
];

export const GeneratedPost: React.FC<GeneratedPostProps> = ({
  postContent,
  theme,
  onGenerateImage,
  isLoading
}) => {
  const [selectedVariants, setSelectedVariants] = useState({
    text: 1,
    footer: 1,
    image: 1
  });

  const [editedContent, setEditedContent] = useState<PostContent | null>(null);
  const [selectedImageStyle, setSelectedImageStyle] = useState(imageStyles[0].id);
  const [isClicked, setIsClicked] = useState(false);

  const toggleVariant = (field: 'text' | 'footer' | 'image') => {
    setSelectedVariants(prev => ({
      ...prev,
      [field]: prev[field] === 1 ? 2 : 1
    }));
  };

  const handleContentEdit = (field: keyof PostContent, value: string) => {
    if (!editedContent) {
      setEditedContent(postContent);
    }
    setEditedContent(prev => prev ? {
      ...prev,
      [field]: value
    } : null);
  };

  const getCurrentContent = () => {
    return editedContent || postContent;
  };

  const renderContentSection = (
    title: string,
    type: 'text' | 'footer' | 'image',
    fieldName1: keyof PostContent,
    fieldName2: keyof PostContent
  ) => {
    const currentVariant = selectedVariants[type];
    const currentContent = getCurrentContent();
    const displayContent = currentVariant === 1 ? currentContent?.[fieldName1] : currentContent?.[fieldName2];
    const fieldName = currentVariant === 1 ? fieldName1 : fieldName2;

    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            {title}
          </h3>
          {type !== 'image' && (
            <button
              onClick={() => toggleVariant(type)}
              className={`px-3 py-1 rounded-full text-sm ${
                theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
              } hover:opacity-80 transition-opacity`}
            >
              Variante {currentVariant}
            </button>
          )}
        </div>
        <textarea
          value={displayContent || ''}
          onChange={(e) => handleContentEdit(fieldName, e.target.value)}
          className={`w-full p-3 rounded-lg resize-none min-h-[100px] ${
            theme === 'dark'
              ? 'bg-gray-700 text-white placeholder-gray-400'
              : 'bg-gray-50 text-gray-900 placeholder-gray-500'
          }`}
          placeholder={`Escribe el ${title.toLowerCase()}...`}
        />
      </div>
    );
  };

  const renderImageStyleSelector = () => (
    <div className="mt-4">
      <label className="block text-sm font-medium mb-2">Estilo de Imagen</label>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
        {imageStyles.map((style) => (
          <div
            key={style.id}
            onClick={() => setSelectedImageStyle(style.id)}
            className={`p-3 rounded-lg cursor-pointer transition-all ${
              selectedImageStyle === style.id
                ? theme === 'dark'
                  ? 'bg-purple-600 text-white'
                  : 'bg-purple-100 text-purple-900'
                : theme === 'dark'
                ? 'bg-gray-700 hover:bg-gray-600'
                : 'bg-gray-50 hover:bg-gray-100'
            }`}
          >
            <div className="font-medium">{style.style}</div>
            <div className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              {style.mood}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const handleGenerateImage = () => {
    const selectedStyle = imageStyles.find(style => style.id === selectedImageStyle);
    if (selectedStyle) {
      console.log('Button clicked - Starting animation');
      setIsClicked(true);
      onGenerateImage(selectedStyle);
      setTimeout(() => {
        console.log('Resetting animation');
        setIsClicked(false);
      }, 1000);
    }
  };

  const renderButton = () => (
    <Button
      onClick={handleGenerateImage}
      className={`w-full mt-4 flex items-center justify-center gap-2 transition-all duration-200 ${
        isClicked ? 'scale-95 bg-opacity-90' : ''
      } relative overflow-hidden`}
      variant="primary"
      disabled={isLoading || !selectedImageStyle}
    >
      <div className="relative z-10 flex items-center justify-center gap-2">
        {isLoading ? (
          <PulseLoader color="#ffffff" size={10} />
        ) : (
          <>
            <Image size={20} />
            <span>Generar Imagen</span>
          </>
        )}
      </div>
      {isClicked && (
        <div 
          className="absolute inset-0 bg-white/40 animate-ripple rounded-lg z-0"
          style={{
            transformOrigin: 'center',
            pointerEvents: 'none'
          }}
          onAnimationStart={() => console.log('Ripple animation started')}
          onAnimationEnd={() => console.log('Ripple animation ended')}
        />
      )}
    </Button>
  );

  return (
    <div className={`p-6 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-lg space-y-6`}>
      {renderContentSection(
        'Texto del Post',
        'text',
        'text',
        'text2'
      )}
      {renderContentSection(
        'Pie de página',
        'footer',
        'footerText',
        'footerText2'
      )}
      {renderContentSection(
        'Descripción de la imagen',
        'image',
        'imageDescription',
        'imageDescription2'
      )}
      {renderImageStyleSelector()}
      {renderButton()}
    </div>
  );
};

export { imageStyles };
