import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, FileImage } from 'lucide-react';
import SocialContentCreatorResponse from './SocialContentCreatorResponse';

interface SocialContentCreatorProps {
  isVisible: boolean;
  onClose: () => void;
}

interface ContentData {
  contentType: string;
  contentFormat: {
    primary: string;
    secondary: string;
    duration: string;
    orientation: string;
  };
  platform: {
    main: string;
    crossPosting: string[];
    specificFeatures: string[];
  };
  topic: {
    mainTopic: string;
    subtopics: string[];
  };
  objective: {
    primary: string;
    secondary: string[];
    metrics: {
      views: string;
      saves: string;
      shares: string;
    };
  };
  targetAudience: {
    demographics: {
      ageRange: string;
      fitnessLevel: string;
      interests: string[];
    };
    painPoints: string[];
  };
  tone: {
    primary: string;
    characteristics: string[];
    language: string;
  };
  keyPoints: Array<{
    title: string;
    points: string[];
  }>;
  keywords: {
    primary: string[];
    secondary: string[];
    trending: string[];
  };
  callToAction: {
    primary: string;
    secondary: string;
    engagement: string[];
  };
  visualResources: {
    required: Array<{
      type: string;
      specs?: {
        duration?: string;
        format?: string;
        resolution?: string;
      };
      quantity?: number;
      purpose?: string;
      elements?: string[];
    }>;
    optional: string[];
  };
}

interface ApiResponse {
  timestamp: string;
  contentData: ContentData;
  contentPlan: {
    contentIdeas: string[];
    contentStructure: {
      'Concurso de Comentarios': string;
      'Encuesta Interactiva': string;
      'Infografía': string;
      'Publicaciones Carrusel': string;
      'Video Tutorial': string;
    };
    contentVariations: {
      'Cambiar Formato': string;
      'Incluir Testimonios': string;
      'Live Streaming': string;
      'Personalización': string;
    };
    engagementPlan: {
      'Compartir Contenido de Seguidores': string;
      'Realizar Encuestas': string;
      'Realizar Retos o Desafíos': string;
      'Responder Comentarios': string;
    };
    hashtagStrategy: {
      Facebook: string[];
      Instagram: string[];
      Twitter: string[];
    };
    metrics: {
      'Alcance Orgánico': string;
      'CTR (Click Through Rate)': string;
      'Crecimiento de Seguidores': string;
      'Interacciones por Publicación': string;
    };
    platformOptimization: {
      Facebook: string;
      Instagram: string;
      Twitter: string;
    };
    publishingSchedule: {
      Domingo: string;
      Lunes: string;
      Miércoles: string;
      Sábado: string;
      Viernes: string;
    };
  };
  status: string;
  version: string;
}

const SocialContentCreator: React.FC<SocialContentCreatorProps> = ({
  isVisible,
  onClose,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [apiResponse, setApiResponse] = useState<ApiResponse | null>(null);
  const [form, setForm] = useState<ContentData>({
    contentType: '',
    contentFormat: {
      primary: '',
      secondary: '',
      duration: '60 segundos',
      orientation: 'Vertical'
    },
    platform: {
      main: '',
      crossPosting: [],
      specificFeatures: []
    },
    topic: {
      mainTopic: '',
      subtopics: []
    },
    objective: {
      primary: '',
      secondary: [],
      metrics: {
        views: '>1000',
        saves: '>100',
        shares: '>50'
      }
    },
    targetAudience: {
      demographics: {
        ageRange: '25-40',
        fitnessLevel: 'Principiante-Intermedio',
        interests: []
      },
      painPoints: []
    },
    tone: {
      primary: '',
      characteristics: [],
      language: 'Técnico con explicaciones simples'
    },
    keyPoints: [],
    keywords: {
      primary: [],
      secondary: [],
      trending: []
    },
    callToAction: {
      primary: '',
      secondary: '',
      engagement: []
    },
    visualResources: {
      required: [
        {
          type: 'Video principal',
          specs: {
            duration: '60s',
            format: '9:16',
            resolution: '1080x1920'
          }
        }
      ],
      optional: []
    }
  });

  // Definir los formatos de contenido disponibles para cada tipo
  const contentFormats = {
    'Tutorial de ejercicio': ['Video', 'Carrusel de imágenes', 'Infografía'],
    'Rutina de entrenamiento': ['Video', 'Carrusel de imágenes', 'Guía PDF'],
    'Consejos de nutrición': ['Imagen', 'Carrusel de imágenes', 'Infografía'],
    'Motivación': ['Imagen', 'Video corto', 'Historia'],
    'Antes y después': ['Imagen', 'Carrusel de imágenes', 'Video'],
    'Recetas saludables': ['Imagen', 'Carrusel de imágenes', 'Video'],
    'Reto fitness': ['Video', 'Imagen', 'Historia'],
    'Educación fitness': ['Infografía', 'Carrusel de imágenes', 'Video']
  };

  // Definir los tipos de contenido disponibles
  const contentTypes = [
    'Tutorial de ejercicio',
    'Rutina de entrenamiento',
    'Consejos de nutrición',
    'Motivación',
    'Antes y después',
    'Recetas saludables',
    'Reto fitness',
    'Educación fitness'
  ];

  const platforms = ['Instagram', 'Facebook', 'TikTok', 'LinkedIn', 'Twitter'];
  
  const tones = ['Profesional', 'Casual', 'Motivador', 'Educativo', 'Divertido', 'Inspirador'];
  
  const ctaOptions = ['Seguir la cuenta', 'Comentar', 'Compartir', 'Visitar sitio web', 'Enviar DM'];
  
  const visualResourceOptions = ['Gráficos', 'Imágenes de stock', 'Animaciones', 'Videos', 'Ninguno'];

  const handleInputChange = (field: keyof ContentData, value: any) => {
    setForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAutoFill = () => {
    setForm({
      contentType: 'Tutorial de ejercicio',
      contentFormat: {
        primary: 'Video',
        secondary: 'Carrusel de imágenes',
        duration: '60 segundos',
        orientation: 'Vertical'
      },
      platform: {
        main: 'Instagram',
        crossPosting: ['TikTok', 'YouTube Shorts'],
        specificFeatures: ['Reels', 'Stories']
      },
      topic: {
        mainTopic: 'Técnica correcta de sentadilla',
        subtopics: [
          'Posición de pies',
          'Activación del core',
          'Profundidad adecuada',
          'Errores comunes'
        ]
      },
      objective: {
        primary: 'Educativo',
        secondary: [
          'Generar engagement',
          'Establecer autoridad',
          'Aumentar seguidores'
        ],
        metrics: {
          views: '>1000',
          saves: '>100',
          shares: '>50'
        }
      },
      targetAudience: {
        demographics: {
          ageRange: '25-40',
          fitnessLevel: 'Principiante-Intermedio',
          interests: ['Fitness', 'Salud', 'Entrenamiento de fuerza']
        },
        painPoints: [
          'Miedo a lesiones',
          'Confusión técnica',
          'Falta de progreso'
        ]
      },
      tone: {
        primary: 'Profesional pero accesible',
        characteristics: [
          'Educativo',
          'Motivador',
          'Confiable'
        ],
        language: 'Técnico con explicaciones simples'
      },
      keyPoints: [
        {
          title: 'Preparación',
          points: ['Calentamiento necesario', 'Equipo requerido', 'Consideraciones de seguridad']
        },
        {
          title: 'Ejecución',
          points: ['Postura inicial', 'Movimiento descendente', 'Posición profunda', 'Movimiento ascendente']
        },
        {
          title: 'Tips clave',
          points: ['Mantener pecho arriba', 'Rodillas alineadas', 'Respiración correcta']
        }
      ],
      keywords: {
        primary: ['técnica sentadilla', 'form check', 'entrenamiento pierna'],
        secondary: ['fitness tips', 'ejercicios básicos', 'fuerza'],
        trending: ['squatchallenge', 'fitnesstutorial']
      },
      callToAction: {
        primary: 'Guarda este post para tu próximo entrenamiento 💪',
        secondary: '¿Tienes dudas? Déjalas en comentarios 👇',
        engagement: [
          'Etiqueta a un amigo que necesite esto',
          'Comparte en tus stories si te ayudó'
        ]
      },
      visualResources: {
        required: [
          {
            type: 'Video',
            specs: {
              duration: '60 segundos',
              format: 'Vertical 9:16',
              resolution: '1080x1920'
            },
            quantity: 1,
            purpose: 'Demostración de técnica',
            elements: ['Vista frontal', 'Vista lateral', 'Puntos clave resaltados']
          }
        ],
        optional: ['Thumbnails', 'GIFs de movimientos específicos']
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setApiResponse(null);

    try {
      const socialContentPayload = {
        contentType: form.contentType,
        contentFormat: form.contentFormat,
        platform: form.platform,
        topic: form.topic,
        objective: form.objective,
        targetAudience: form.targetAudience,
        tone: form.tone,
        keyPoints: form.keyPoints,
        keywords: form.keywords,
        callToAction: form.callToAction,
        visualResources: form.visualResources,
      };

      console.log('Sending social content payload:', socialContentPayload);

      const token = localStorage.getItem('token');
      console.log('Token retrieved from localStorage:', token ? 'Token exists' : 'No token found');

      if (!token) {
        throw new Error('No se encontró el token de autenticación');
      }

      const response = await fetch('https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/chats/social-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(socialContentPayload),
      });

      console.log('Response status:', response.status);
      
      const data = await response.json();
      console.log('Response data:', data);

      if (!response.ok) {
        throw new Error(data.message || `Error del servidor: ${response.status}`);
      }

      setApiResponse(data);
    } catch (err) {
      console.error('Error:', err);
      alert(`Error: ${err instanceof Error ? err.message : 'Error al generar el contenido social'}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-black/40">
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700"
      >
        {/* Botón de cierre (arriba a la derecha) */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Encabezado */}
        <div className="sticky top-0 z-10">
          <div className="p-6 rounded-t-2xl bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                Generador de ideas de contenido
              </h2>
              <div className="flex gap-4">
                <button
                  onClick={handleAutoFill}
                  className="px-4 py-2 bg-indigo-100 text-indigo-600 rounded-lg hover:bg-indigo-200 transition-colors duration-200"
                >
                  Autorrellenar
                </button>
                <button
                  onClick={onClose}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            <p className="text-purple-100">Diseña contenido impactante para tus redes sociales</p>
          </div>
        </div>

        {/* Aquí controlamos qué se muestra:
            1. Si está isLoading y aún no hay respuesta => Animación de carga
            2. Si llegó la respuesta (apiResponse != null) => Mostrar SocialContentCreatorResponse
            3. Si no está cargando ni hay respuesta => Mostrar formulario */}
        <div className="p-8">
          {isLoading && !apiResponse && (
            <div className="flex flex-col items-center justify-center py-16">
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              >
                <FileImage className="w-8 h-8 text-gray-700 dark:text-gray-300" />
              </motion.span>
              <p className="mt-4 text-gray-700 dark:text-gray-300">Generando contenido...</p>
            </div>
          )}

          {!isLoading && apiResponse && (
            <SocialContentCreatorResponse
              response={apiResponse}
              onClose={() => setApiResponse(null)}
            />
          )}

          {!isLoading && !apiResponse && (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* -- Inicio del formulario -- */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Tipo de Contenido
                  </label>
                  <select
                    value={form.contentType}
                    onChange={(e) => handleInputChange('contentType', e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="">Seleccionar tipo</option>
                    {contentTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Formato de Contenido
                  </label>
                  <select
                    value={form.contentFormat.primary}
                    onChange={(e) =>
                      handleInputChange('contentFormat', { 
                        ...form.contentFormat,
                        primary: e.target.value 
                      })
                    }
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="">Seleccionar formato</option>
                    {form.contentType &&
                      contentFormats[form.contentType as keyof typeof contentFormats]?.map((format) => (
                        <option key={format} value={format}>
                          {format}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Plataforma
                  </label>
                  <select
                    value={form.platform.main}
                    onChange={(e) =>
                      handleInputChange('platform', {
                        main: e.target.value,
                        crossPosting: form.platform.crossPosting,
                        specificFeatures: form.platform.specificFeatures
                      })
                    }
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="">Seleccionar plataforma</option>
                    {platforms.map((platform) => (
                      <option key={platform} value={platform}>
                        {platform}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Tema del Contenido
                  </label>
                  <input
                    type="text"
                    value={form.topic.mainTopic}
                    onChange={(e) =>
                      handleInputChange('topic', {
                        mainTopic: e.target.value,
                        subtopics: form.topic.subtopics
                      })
                    }
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    placeholder="Ej: Nutrición Deportiva"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Objetivo del Contenido
                </label>
                <textarea
                  value={form.objective.primary}
                  onChange={(e) =>
                    handleInputChange('objective', {
                      primary: e.target.value,
                      secondary: form.objective.secondary,
                      metrics: form.objective.metrics
                    })
                  }
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  placeholder="Ej: Educar a la audiencia sobre la importancia de la nutrición..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Audiencia Objetivo
                </label>
                <input
                  type="text"
                  value={form.targetAudience.demographics.ageRange}
                  onChange={(e) =>
                    handleInputChange('targetAudience', {
                      demographics: {
                        ageRange: e.target.value,
                        fitnessLevel: form.targetAudience.demographics.fitnessLevel,
                        interests: form.targetAudience.demographics.interests
                      },
                      painPoints: form.targetAudience.painPoints
                    })
                  }
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  placeholder="Ej: Atletas amateur, Entusiastas del fitness"
                />
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Tono de Comunicación
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {tones.map((tone) => (
                    <button
                      key={tone}
                      type="button"
                      onClick={() =>
                        handleInputChange('tone', {
                          primary: tone,
                          characteristics: form.tone.characteristics,
                          language: form.tone.language
                        })
                      }
                      className={`p-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                        form.tone.primary === tone
                          ? 'bg-purple-500 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      {tone}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-100">
                  Puntos Clave
                </label>
                <div className="space-y-4">
                  {form.keyPoints.map((keyPoint, index) => (
                    <div
                      key={index}
                      className="p-4 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600"
                    >
                      <div className="mb-2">
                        <label className="block mb-1 text-sm font-medium text-gray-900 dark:text-gray-100">
                          Título
                        </label>
                        <input
                          type="text"
                          value={keyPoint.title}
                          onChange={(e) => {
                            const newKeyPoints = [...form.keyPoints];
                            newKeyPoints[index] = {
                              ...newKeyPoints[index],
                              title: e.target.value
                            };
                            handleInputChange('keyPoints', newKeyPoints);
                          }}
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        />
                      </div>
                      <div>
                        <label className="block mb-1 text-sm font-medium text-gray-900 dark:text-gray-100">
                          Puntos (separados por coma)
                        </label>
                        <input
                          type="text"
                          value={keyPoint.points.join(', ')}
                          onChange={(e) => {
                            const newKeyPoints = [...form.keyPoints];
                            newKeyPoints[index] = {
                              ...newKeyPoints[index],
                              points: e.target.value
                                .split(',')
                                .map((point) => point.trim())
                            };
                            handleInputChange('keyPoints', newKeyPoints);
                          }}
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const newKeyPoints = form.keyPoints.filter(
                            (_, i) => i !== index
                          );
                          handleInputChange('keyPoints', newKeyPoints);
                        }}
                        className="mt-2 px-3 py-1 text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                      >
                        Eliminar
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      const newKeyPoints = [
                        ...form.keyPoints,
                        { title: '', points: [] }
                      ];
                      handleInputChange('keyPoints', newKeyPoints);
                    }}
                    className="w-full px-4 py-2 text-sm font-medium text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 border border-purple-200 dark:border-purple-800 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/30 transition-colors duration-200"
                  >
                    + Agregar Punto Clave
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Palabras Clave Primarias
                </label>
                <div className="flex flex-wrap gap-2">
                  <input
                    type="text"
                    placeholder="Añadir palabra clave primaria y presionar Enter"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        const value = e.currentTarget.value.trim();
                        if (value) {
                          handleInputChange('keywords', {
                            ...form.keywords,
                            primary: [...(form.keywords.primary || []), value]
                          });
                          e.currentTarget.value = '';
                        }
                      }
                    }}
                    className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  {form.keywords.primary.map((keyword) => (
                    <span
                      key={keyword}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 font-medium"
                    >
                      #{keyword}
                      <button
                        type="button"
                        onClick={() =>
                          handleInputChange('keywords', {
                            ...form.keywords,
                            primary: form.keywords.primary.filter(
                              (k) => k !== keyword
                            )
                          })
                        }
                        className="ml-2 hover:text-indigo-900 dark:hover:text-indigo-100"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Palabras Clave Secundarias
                </label>
                <div className="flex flex-wrap gap-2">
                  <input
                    type="text"
                    placeholder="Añadir palabra clave secundaria y presionar Enter"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        const value = e.currentTarget.value.trim();
                        if (value) {
                          handleInputChange('keywords', {
                            ...form.keywords,
                            secondary: [...(form.keywords.secondary || []), value]
                          });
                          e.currentTarget.value = '';
                        }
                      }
                    }}
                    className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  {form.keywords.secondary.map((keyword) => (
                    <span
                      key={keyword}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 font-medium"
                    >
                      #{keyword}
                      <button
                        type="button"
                        onClick={() =>
                          handleInputChange('keywords', {
                            ...form.keywords,
                            secondary: form.keywords.secondary.filter(
                              (k) => k !== keyword
                            )
                          })
                        }
                        className="ml-2 hover:text-purple-900 dark:hover:text-purple-100"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Palabras Clave Tendencia
                </label>
                <div className="flex flex-wrap gap-2">
                  <input
                    type="text"
                    placeholder="Añadir palabra clave tendencia y presionar Enter"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        const value = e.currentTarget.value.trim();
                        if (value) {
                          handleInputChange('keywords', {
                            ...form.keywords,
                            trending: [...(form.keywords.trending || []), value]
                          });
                          e.currentTarget.value = '';
                        }
                      }
                    }}
                    className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  {form.keywords.trending.map((keyword) => (
                    <span
                      key={keyword}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 font-medium"
                    >
                      #{keyword}
                      <button
                        type="button"
                        onClick={() =>
                          handleInputChange('keywords', {
                            ...form.keywords,
                            trending: form.keywords.trending.filter(
                              (k) => k !== keyword
                            )
                          })
                        }
                        className="ml-2 hover:text-green-900 dark:hover:text-green-100"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Call to Action (CTA)
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {ctaOptions.map((cta) => (
                    <button
                      key={cta}
                      type="button"
                      onClick={() =>
                        handleInputChange('callToAction', {
                          primary: cta,
                          secondary: form.callToAction.secondary,
                          engagement: form.callToAction.engagement
                        })
                      }
                      className={`p-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                        form.callToAction.primary === cta
                          ? 'bg-indigo-500 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      {cta}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Recursos Visuales Requeridos
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {visualResourceOptions.map((resource) => (
                    <button
                      key={resource}
                      type="button"
                      onClick={() => {
                        const newRequired = form.visualResources.required.some(
                          (r) => r.type === resource
                        )
                          ? form.visualResources.required.filter(
                              (r) => r.type !== resource
                            )
                          : [
                              ...form.visualResources.required,
                              {
                                type: resource,
                                specs: {
                                  duration: '60s',
                                  format: '9:16',
                                  resolution: '1080x1920'
                                }
                              }
                            ];
                        handleInputChange('visualResources', {
                          ...form.visualResources,
                          required: newRequired
                        });
                      }}
                      className={`p-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                        form.visualResources.required.some(
                          (r) => r.type === resource
                        )
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      {resource}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Recursos Visuales Opcionales
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {visualResourceOptions.map((resource) => (
                    <button
                      key={resource}
                      type="button"
                      onClick={() => {
                        const newOptional = form.visualResources.optional.includes(resource)
                          ? form.visualResources.optional.filter((r) => r !== resource)
                          : [...form.visualResources.optional, resource];
                        handleInputChange('visualResources', {
                          ...form.visualResources,
                          optional: newOptional
                        });
                      }}
                      className={`p-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                        form.visualResources.optional.includes(resource)
                          ? 'bg-purple-500 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      {resource}
                    </button>
                  ))}
                </div>
              </div>

              {/* Botones de acción */}
              <div className="flex justify-end space-x-4 pt-6">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-purple-500 to-indigo-500 text-white hover:from-purple-600 hover:to-indigo-600 focus:ring-4 focus:ring-purple-500/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <span className="flex items-center space-x-2">
                      <motion.span
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <FileImage className="w-4 h-4" />
                      </motion.span>
                      <span>Creando...</span>
                    </span>
                  ) : (
                    'Crear Contenido'
                  )}
                </button>
              </div>
              {/* -- Fin del formulario -- */}
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default SocialContentCreator;
