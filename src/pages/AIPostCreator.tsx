import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Sparkles, Send, ArrowLeft, Image, Lightbulb, Type, Heart, MessageCircle, Bookmark, MoreHorizontal, RefreshCcw, Settings, Download, Share } from 'lucide-react';
import Button from '../components/Common/Button';
import { useNavigate } from 'react-router-dom';
import { GeneratedPost, imageStyles } from '../components/PostGenerator/GeneratedPost';
import GeneracionDePrompts from '../components/PostGenerator/GeneracionDePrompts';
import { PulseLoader } from 'react-spinners';
import IdeaGenerationPanel from '../components/PostGenerator/IdeaGenerationPanel';
import AttributeEditorPanel from '../components/PostGenerator/AttributeEditorPanel';
import ImagePreviewPanel from '../components/PostGenerator/ImagePreviewPanel';
import StepIndicator from '../components/PostGenerator/StepIndicator';

interface PostIdea {
  title: string;
  description: string;
  hashtags: string;
  contentType: string;
}

interface PostContent {
  text: string;
  text2: string;
  footerText: string;
  footerText2: string;
  imageDescription: string;
  imageDescription2: string;
}

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

const AIPostCreator: React.FC = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState('');
  const [step, setStep] = useState<'ideas' | 'content' | 'image'>('ideas');
  const [ideas, setIdeas] = useState<PostIdea[]>([]);
  const [selectedIdea, setSelectedIdea] = useState<PostIdea | null>(null);
  const [postContent, setPostContent] = useState<PostContent | null>(null);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedVariants, setSelectedVariants] = useState({
    text: 1,
    footer: 1,
    image: 1
  });
  const [editedContent, setEditedContent] = useState<PostContent | null>(null);
  const [loadingIdeaIndex, setLoadingIdeaIndex] = useState<number | null>(null);
  const [isClicked, setIsClicked] = useState(false);
  const [imageAttributes, setImageAttributes] = useState<ImageAttributes>({
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

  const parseIdeasFromText = (text: string) => {
    // 1. Dividimos en bloques separados por "Idea X:"
    //    Esto asume que tu texto viene en el formato:
    //
    //    Idea 1:
    //    Título: "..."
    //    Descripción: ...
    //    Hashtags: ...
    //    Tipo de contenido: ...
    //
    const blocks = text
      // Separamos por líneas que contengan "Idea X:"
      .split(/Idea\s+\d+:\s*/)
      // Limpiamos espacios y filtramos vacíos
      .map(block => block.trim())
      .filter(block => block);
  
    // 2. Para cada bloque, extraemos título, descripción, hashtags, tipo de contenido
    return blocks.map(block => {
      // Para el título usamos el patrón con comillas
      // (Título: "Siente la fuerza interior: levántate con pesas")
      const titleMatch = block.match(/Título:\s*"([^"]+)"/);
  
      // Para la descripción, usamos [\s\S]*? con lookahead
      // para capturar varias líneas hasta que aparezca "Hashtags:" 
      // o "Tipo de contenido:" o se termine el bloque.
      const descriptionMatch = block.match(
        /Descripción:\s*([\s\S]*?)(?=Hashtags:|Tipo de contenido:|$)/,
      );
  
      // Para hashtags, capturamos la línea que sigue a "Hashtags:"
      const hashtagsMatch = block.match(/Hashtags:\s*([^\n]+)/);
  
      // Para tipo de contenido
      const contentTypeMatch = block.match(/Tipo de contenido:\s*([^\n]+)/);
  
      // Construimos el objeto Idea
      const idea = {
        title: titleMatch ? titleMatch[1].trim() : "Idea sin título",
        description: descriptionMatch ? descriptionMatch[1].trim() : "Sin descripción",
        hashtags: hashtagsMatch ? hashtagsMatch[1].trim() : "",
        contentType: contentTypeMatch ? contentTypeMatch[1].trim() : "",
      };
  
      console.log("Idea parseada:", idea);
      return idea;
    });
  };

  const generateIdeas = async () => {
    if (!prompt.trim()) return;
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No se encontró el token de autenticación');
      }
  
      const response = await fetch('https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/chats/posts/ideas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          topic: prompt
        }),
        credentials: 'include',
      });
  
      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Error del servidor: ${response.status} - ${errorData}`);
      }
  
      const data = await response.json();
      console.log('Respuesta del servidor (data completa):', data);

      // Parse the nested JSON structure
      let formattedIdeas = [];
      if (data.ideas) {
        try {
          // If ideas is a string (JSON string), parse it
          const ideasContent = typeof data.ideas === 'string' 
            ? JSON.parse(data.ideas) 
            : data.ideas;
  
          if (ideasContent.ideas && Array.isArray(ideasContent.ideas)) {
            formattedIdeas = ideasContent.ideas.map(idea => ({
              title: idea.titulo,
              description: idea.descripcion,
              hashtags: Array.isArray(idea.hashtags) 
                ? idea.hashtags.join(' ') 
                : idea.hashtags,
              contentType: idea.tipo_contenido
            }));
          }
        } catch (parseError) {
          console.error('Error parsing ideas:', parseError);
        }
      }
  
      console.log('Ideas formateadas final:', formattedIdeas);
      setIdeas(formattedIdeas);
      setStep('ideas');
    } catch (error) {
      console.error('Error detallado al generar ideas:', error);
      setIdeas([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateClick = () => {
    console.log('Button clicked - Starting animation');
    setIsClicked(true);
    console.log('isClicked set to:', true);
    generateIdeas();
    
    // Add timeout to reset the animation
    setTimeout(() => {
      console.log('Resetting animation');
      setIsClicked(false);
    }, 1000);
  };

  const generateContent = async (idea: PostIdea) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No se encontró el token de autenticación');
      }

      const response = await fetch('https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/chats/posts/content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          titulo: idea.title,
          descripcion: idea.description,
          hashtags: idea.hashtags,
          tipoContenido: idea.contentType
        }),
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Error al generar el contenido');
      }

      const data = await response.json();
      console.log('Respuesta de contenido:', data);

      // Parse the JSON content if it's a string
      let parsedContent;
      try {
        parsedContent = typeof data.content === 'string' 
          ? JSON.parse(data.content) 
          : data.content;
        
        console.log('Contenido parseado:', parsedContent);
        
        // Extract content from the structured JSON
        if (parsedContent.fitness_publicacion && parsedContent.fitness_publicacion.variantes) {
          const variantes = parsedContent.fitness_publicacion.variantes;
          
          const content: PostContent = {
            text: variantes[0]?.texto_post || '',
            text2: variantes[1]?.texto_post || '',
            footerText: variantes[0]?.texto_pie_post || '',
            footerText2: variantes[1]?.texto_pie_post || '',
            imageDescription: variantes[0]?.descripcion_imagen || '',
            imageDescription2: variantes[1]?.descripcion_imagen || ''
          };
          
          setPostContent(content);
          setStep('content');
        } else {
          // Fallback to the old extraction method if the structure is different
          const content: PostContent = {
            text: extractContent(data.content, "Texto dentro del post:"),
            text2: extractContent(data.content, "Texto dentro del post2:"),
            footerText: extractContent(data.content, "Texto del pie de pagina del Post:"),
            footerText2: extractContent(data.content, "Texto del pie de pagina del Post2:"),
            imageDescription: extractContent(data.content, "Descripción de la Imagen:"),
            imageDescription2: extractContent(data.content, "Descripción de la Imagen2:")
          };
          
          setPostContent(content);
          setStep('content');
        }
      } catch (parseError) {
        console.error('Error parsing content JSON:', parseError);
        
        // Fallback to the old extraction method
        const content: PostContent = {
          text: extractContent(data.content, "Texto dentro del post:"),
          text2: extractContent(data.content, "Texto dentro del post2:"),
          footerText: extractContent(data.content, "Texto del pie de pagina del Post:"),
          footerText2: extractContent(data.content, "Texto del pie de pagina del Post2:"),
          imageDescription: extractContent(data.content, "Descripción de la Imagen:"),
          imageDescription2: extractContent(data.content, "Descripción de la Imagen2:")
        };
        
        setPostContent(content);
        setStep('content');
      }
    } catch (error) {
      console.error('Error al generar contenido:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const extractContent = (content: string, key: string): string => {
    const regex = new RegExp(`${key}\\s*"?([^"\\n]+)"?`);
    const match = content.match(regex);
    return match ? match[1].trim() : '';
  };

  const handleGenerateImage = async (attributes: ImageAttributes) => {
    setIsLoading(true);
    setImageAttributes(attributes);
    
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
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          prompt: selectedIdea?.title,
          description: selectedIdea?.description,
          attributes: attributes
        }),
        credentials: 'include',
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setGeneratedImageUrl(data.imageUrl);
        setStep('image');
      } else {
        console.error('Error al generar la imagen:', data.message);
      }
    } catch (error) {
      console.error('Error detallado al generar la imagen:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegenerateImage = async () => {
    // Reuse the same attributes to generate a new image
    await handleGenerateImage(imageAttributes);
  };

  const generateImage = async (selectedStyle: typeof imageStyles[0]) => {
    if (!postContent?.imageDescription) return;
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No se encontró el token de autenticación');
      }

      console.log('Enviando petición a la API de imágenes:', {
        description: postContent.imageDescription,
        style: selectedStyle.style,
        mood: selectedStyle.mood
      });

      const response = await fetch('https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/chats/posts/image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          description: postContent.imageDescription,
          style: selectedStyle.style,
          mood: selectedStyle.mood
        })
      });

      if (!response.ok) {
        throw new Error('Error al generar la imagen');
      }

      const data = await response.json();
      console.log('Respuesta de la API de imágenes:', data);
      
      setGeneratedImageUrl(data.imageUrl);
      setStep('image');
    } catch (error) {
      console.error('Error al generar imagen:', error);
    } finally {
      setIsLoading(false);
    }
  };

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

  const handleSelectIdea = (idea: PostIdea) => {
    setSelectedIdea(idea);
    setStep('content');
  };

  const renderStep = () => {
    switch (step) {
      case 'ideas':
        return (
          <IdeaGenerationPanel
            onGenerateIdeas={generateIdeas}
            onSelectIdea={handleSelectIdea}
            ideas={ideas}
            isLoading={isLoading}
            loadingIdeaIndex={loadingIdeaIndex}
            theme={theme}
          />
        );

      case 'content':
        return selectedIdea && (
          <AttributeEditorPanel
            selectedIdea={selectedIdea}
            onBack={() => setStep('ideas')}
            onGenerateImage={handleGenerateImage}
            isLoading={isLoading}
            theme={theme}
          />
        );

      case 'image':
        return (
          <ImagePreviewPanel
            imageUrl={generatedImageUrl}
            attributes={imageAttributes}
            onBack={() => setStep('content')}
            onRegenerateImage={handleRegenerateImage}
            onAdjustAttributes={() => setStep('content')}
            isLoading={isLoading}
            theme={theme}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className={`min-h-screen p-8 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-800'}`}>
      <div className="max-w-4xl mx-auto">
        <Button
          onClick={() => navigate('/content-publishing')}
          className="mb-6 flex items-center gap-2"
          variant="ghost"
        >
          <ArrowLeft size={20} />
          Volver
        </Button>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
            <Sparkles className="text-purple-500" />
            <span className="bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
              Creador de Posts con IA
            </span>
          </h1>
          <p className={`text-lg ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
            Genera posts virales para tus redes sociales con ayuda de IA
          </p>
        </div>

        {/* Replace the old step indicator with the new StepIndicator component */}
        <StepIndicator currentStep={step} className="mb-8" />

        {renderStep()}
      </div>
    </div>
  );
};
export default AIPostCreator;