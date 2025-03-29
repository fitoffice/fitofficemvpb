import React, { useState, useRef } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { ImageIcon, Send, ArrowLeft, Layout, Sparkles, Type, Upload, Switch } from 'lucide-react';
import Button from '../components/Common/Button';
import { useNavigate } from 'react-router-dom';
import CarouselCreator from '../components/StoryCreator/CarouselCreator';
import SimpleStory from '../components/StoryCreator/SimpleStory';
import SurveyCreator from '../components/StoryCreator/SurveyCreator';

interface StoryIdea {
  title: string;
  description: string;
  hashtags: string;
  contentType: string;
}

interface StoryContent {
  text: string;
  text2: string;
  imageDescription: string;
  imageDescription2: string;
}

interface CarouselData {
  images: File[];
}

interface SimpleStoryData {
  useGeneratedImage: boolean;
  image?: File;
  imagePrompt?: string;
}

interface PollData {
  description: string;
  numberOfQuestions: number;
}

const AIStoryCreator: React.FC = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [step, setStep] = useState<'template' | 'ideas' | 'content' | 'image'>('template');
  const [ideas, setIdeas] = useState<StoryIdea[]>([]);
  const [selectedIdea, setSelectedIdea] = useState<StoryIdea | null>(null);
  const [storyContent, setStoryContent] = useState<StoryContent | null>(null);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [selectedVariants, setSelectedVariants] = useState({
    text: 1,
    image: 1
  });

  // Template specific states
  const [carouselData, setCarouselData] = useState<CarouselData>({ images: [] });
  const [simpleStoryData, setSimpleStoryData] = useState<SimpleStoryData>({
    useGeneratedImage: true
  });
  const [pollData, setPollData] = useState<PollData>({
    description: '',
    numberOfQuestions: 2
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const templates = [
    { id: 'carousel', name: 'Carrusel', icon: Layout },
    { id: 'story', name: 'Historia Simple', icon: ImageIcon },
    { id: 'survey', name: 'Encuesta', icon: Layout },
  ];

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    if (selectedTemplate === 'carousel') {
      setCarouselData(prev => ({
        images: [...prev.images, ...Array.from(files)]
      }));
    } else if (selectedTemplate === 'story' && !simpleStoryData.useGeneratedImage) {
      setSimpleStoryData(prev => ({
        ...prev,
        image: files[0]
      }));
    }
  };

  const renderTemplateSpecificFields = () => {
    switch (selectedTemplate) {
      case 'carousel':
        return (
          <CarouselCreator
            images={carouselData.images}
            onImagesChange={(images) => setCarouselData({ images })}
            theme={theme}
            isLoading={isLoading}
          />
        );

      case 'story':
        return (
          <SimpleStory 
            onImageSelect={(image) => setSimpleStoryData(prev => ({ ...prev, image }))}
            onGenerateIdeas={() => console.log('Generate ideas')}
            loading={isLoading}
          />
        );

      case 'survey':
        return (
          <SurveyCreator
            onSave={(questions) => {
              console.log('Encuesta guardada:', questions);
              // Aquí puedes manejar el guardado de la encuesta
            }}
          />
        );

      default:
        return null;
    }
  };

  const generateImage = async () => {
    if (!storyContent?.imageDescription) return;
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No se encontró el token de autenticación');
      }

      const response = await fetch('https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/images/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          prompt: selectedVariants.image === 1 ? storyContent.imageDescription : storyContent.imageDescription2,
          style: selectedTemplate
        }),
      });

      if (!response.ok) {
        throw new Error('Error al generar la imagen');
      }

      const data = await response.json();
      setGeneratedImageUrl(data.imageUrl);
      setStep('image');
    } catch (error) {
      console.error('Error al generar imagen:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen p-8 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <div className="max-w-4xl mx-auto">
        <Button
          onClick={() => navigate('/content-publishing')}
          className="mb-6 flex items-center gap-2"
          variant="danger"
        >
          <ArrowLeft size={20} />
          Volver
        </Button>

        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-6 flex items-center justify-center gap-3">
            <ImageIcon className="text-blue-500" size={28} />
            <span className="bg-gradient-to-r from-blue-400 to-cyan-600 bg-clip-text text-transparent">
              Creador de Historias con IA
            </span>
          </h1>
          <p className={`text-xl ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
            Genera historias cautivadoras para tus redes sociales con ayuda de IA
          </p>
        </div>

        <div className="space-y-8">
          {step === 'template' && (
            <div className={`p-8 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-lg max-w-3xl mx-auto`}>
              <h3 className="text-2xl font-semibold mb-6">Selecciona una plantilla:</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {templates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => {
                      setSelectedTemplate(template.id);
                      // Reset template-specific data when changing templates
                      setCarouselData({ images: [] });
                      setSimpleStoryData({ useGeneratedImage: true });
                      setPollData({ description: '', numberOfQuestions: 2 });
                    }}
                    className={`p-6 rounded-lg border-2 transition-all ${
                      selectedTemplate === template.id
                        ? theme === 'dark'
                          ? 'border-blue-500 bg-blue-500/20'
                          : 'border-blue-500 bg-blue-50'
                        : theme === 'dark'
                        ? 'border-gray-700 hover:border-blue-400'
                        : 'border-gray-200 hover:border-blue-400'
                    }`}
                  >
                    <template.icon className={`w-10 h-10 mx-auto mb-3 ${
                      selectedTemplate === template.id ? 'text-blue-500' : 'text-gray-500'
                    }`} />
                    <span className="block text-center text-lg">{template.name}</span>
                  </button>
                ))}
              </div>
              {selectedTemplate && (
                <div className="mt-8 space-y-8">
                  {renderTemplateSpecificFields()}
                </div>
              )}
            </div>
          )}

          {step === 'content' && storyContent && (
            <div className={`p-8 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-lg max-w-3xl mx-auto`}>
              <h3 className="text-2xl font-semibold mb-6">Contenido generado:</h3>
              <div className="space-y-8">
                <div>
                  <h4 className="font-semibold text-lg mb-3">Variante de texto {selectedVariants.text}</h4>
                  <div className={`p-5 rounded-lg ${
                    theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
                  } text-lg`}>
                    {selectedVariants.text === 1 ? storyContent.text : storyContent.text2}
                  </div>
                  <Button
                    onClick={() => setSelectedVariants(prev => ({
                      ...prev,
                      text: prev.text === 1 ? 2 : 1
                    }))}
                    className="mt-3"
                    variant="outline"
                  >
                    <Type size={18} className="mr-2" />
                    Cambiar variante de texto
                  </Button>
                </div>

                <Button
                  onClick={generateImage}
                  disabled={isLoading}
                  className="w-full py-3 text-lg"
                  variant="primary"
                >
                  {isLoading ? 'Generando imagen...' : 'Generar imagen'}
                </Button>
              </div>
            </div>
          )}

          {step === 'image' && generatedImageUrl && (
            <div className={`p-8 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-lg max-w-3xl mx-auto`}>
              <h3 className="text-2xl font-semibold mb-6">Imagen generada:</h3>
              <img
                src={generatedImageUrl}
                alt="Imagen generada por IA"
                className="w-full rounded-lg"
              />
              <div className="mt-6 flex gap-4">
                <Button variant="outline" className="flex-1 py-3 text-lg">
                  Descargar
                </Button>
                <Button variant="primary" className="flex-1 py-3 text-lg">
                  Guardar
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIStoryCreator;