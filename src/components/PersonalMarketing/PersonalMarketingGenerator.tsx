import { useState } from 'react';
import { X, Check, Users, AlertCircle, Target, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import PersonalMarketingGeneratorResponse from './PersonalMarketingGeneratorResponse';

interface PersonalMarketingGeneratorProps {
  isVisible: boolean;
  onClose: () => void;
}

interface FormData {
  niche: {
    primary: string;
    secondary: string[];
    uniqueValue: {
      approach: string;
      specialization: string;
      differentiator: string;
    };
  };
  platforms: Array<{
    name: string;
    priority: string;
    currentStats: {
      followers?: number;
      engagement?: string;
      postsPerWeek?: number;
      subscribers?: number;
      averageViews?: number;
      uploadFrequency?: string;
      connections?: number;
      articles?: number;
    };
    contentTypes: string[];
  }>;
  objectives: {
    shortTerm: Array<{
      goal: string;
      target: string;
      strategy: string;
    }>;
    longTerm: Array<{
      goal: string;
      timeframe: string;
      milestones?: string[];
      streams?: string[];
    }>;
  };
  expertise: {
    certifications: Array<{
      name: string;
      issuer: string;
      year: number;
    }>;
    specialties: string[];
    experience: {
      years: number;
      highlights: string[];
    };
  };
  targetAudience: {
    demographics: {
      gender: string;
      ageRange: string;
      location: string;
      interests: string[];
    };
    psychographics: {
      painPoints: string[];
      goals: string[];
      values: string[];
    };
  };
  currentPresence: {
    instagram?: {
      handle: string;
      followers: number;
      posts: number;
      engagement: string;
      content: {
        topPerforming: string[];
        schedule: string;
      };
    };
    youtube?: {
      channel: string;
      subscribers: number;
      videos: number;
      averageViews: number;
      content: {
        topPerforming: string[];
        schedule: string;
      };
    };
    website?: {
      url: string;
      traffic: string;
      conversion: string;
      content: {
        blog: string;
        leads: string;
      };
    };
  };
}

const PersonalMarketingGenerator: React.FC<PersonalMarketingGeneratorProps> = ({
  isVisible,
  onClose,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(true);
  const [strategy, setStrategy] = useState('');

  const [form, setForm] = useState<FormData>({
    niche: {
      primary: '',
      secondary: [],
      uniqueValue: {
        approach: '',
        specialization: '',
        differentiator: ''
      }
    },
    platforms: [],
    objectives: {
      shortTerm: [],
      longTerm: []
    },
    expertise: {
      certifications: [],
      specialties: [],
      experience: {
        years: 0,
        highlights: []
      }
    },
    targetAudience: {
      demographics: {
        gender: '',
        ageRange: '',
        location: '',
        interests: []
      },
      psychographics: {
        painPoints: [],
        goals: [],
        values: []
      }
    },
    currentPresence: {}
  });

  const handleInputChange = (field: string, value: any) => {
    setForm(prev => {
      const newForm = { ...prev };
      let current = newForm;
      const fields = field.split('.');
      
      for (let i = 0; i < fields.length - 1; i++) {
        current = current[fields[i]];
      }
      
      current[fields[fields.length - 1]] = value;
      console.log('Form updated:', newForm);
      return newForm;
    });
  };

  const handleArrayToggle = (field: string, value: string) => {
    setForm(prev => {
      const newForm = { ...prev };
      let current = newForm;
      const fields = field.split('.');
      
      for (let i = 0; i < fields.length - 1; i++) {
        current = current[fields[i]];
      }
      
      const array = current[fields[fields.length - 1]];
      if (Array.isArray(array)) {
        current[fields[fields.length - 1]] = array.includes(value)
          ? array.filter(item => item !== value)
          : [...array, value];
      }
      
      console.log('Array toggled:', newForm);
      return newForm;
    });
  };

  const handleObjectiveToggle = (value: string) => {
    setForm(prev => {
      // Crear una copia profunda del estado anterior
      const newForm = JSON.parse(JSON.stringify(prev));
      
      // Asegurarse de que shortTerm existe
      if (!newForm.objectives.shortTerm) {
        newForm.objectives.shortTerm = [];
      }
      
      const existingIndex = newForm.objectives.shortTerm.findIndex(
        (obj: { goal: string }) => obj.goal === value
      );
      
      if (existingIndex >= 0) {
        // Eliminar el objetivo si ya existe
        newForm.objectives.shortTerm = [
          ...newForm.objectives.shortTerm.slice(0, existingIndex),
          ...newForm.objectives.shortTerm.slice(existingIndex + 1)
        ];
      } else {
        // Agregar nuevo objetivo
        newForm.objectives.shortTerm = [
          ...newForm.objectives.shortTerm,
          {
            goal: value,
            target: '',
            strategy: ''
          }
        ];
      }
      
      console.log('Objectives updated:', newForm);
      return newForm;
    });
  };

  const handleAudienceToggle = (value: string) => {
    setForm(prev => {
      // Crear una copia profunda del estado anterior
      const newForm = JSON.parse(JSON.stringify(prev));
      
      // Asegurarse de que interests existe
      if (!newForm.targetAudience.demographics.interests) {
        newForm.targetAudience.demographics.interests = [];
      }
      
      const interests = [...newForm.targetAudience.demographics.interests];
      const index = interests.indexOf(value);
      
      if (index >= 0) {
        // Eliminar el interés si ya existe
        newForm.targetAudience.demographics.interests = [
          ...interests.slice(0, index),
          ...interests.slice(index + 1)
        ];
      } else {
        // Agregar nuevo interés
        newForm.targetAudience.demographics.interests = [...interests, value];
      }
      
      console.log('Target audience updated:', newForm);
      return newForm;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      console.log('Submitting form data:', form);
      
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No se encontró el token de autenticación');
      }

      const response = await fetch('https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/chats/personal-branding', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });

      if (!response.ok) {
        throw new Error('Error al generar la estrategia');
      }

      const data = await response.json();
      console.log('API response:', data);
      
      if (data.brandingStrategy) {
        // Pasar los datos directamente sin formatear
        setStrategy(JSON.stringify(data));
      } else {
        setStrategy(generateDefaultStrategy());
      }
      setShowForm(false);
    } catch (error) {
      console.error('Error:', error);
      setStrategy(generateDefaultStrategy());
    } finally {
      setIsLoading(false);
    }
  };

  const formatBrandingStrategy = (strategy: any) => {
    try {
      const { nicheAnalysis, contentStrategy, editorialCalendar, engagementTactics, keyMetrics, monetizationPlan, optimizationStrategy } = strategy;

      // Format content strategy for each platform
      const formattedContentStrategy = Object.entries(contentStrategy || {}).map(([platform, details]: [string, any]) => {
        if (platform === 'description') return '';
        
        const platformData = details as {
          contentTypes?: string[];
          hashtags?: string[];
          strategy?: string;
        };

        return `
          <div class="platform-card">
            <h3 class="platform-title">${platform}</h3>
            ${platformData.strategy ? `
              <div class="strategy-section">
                <h4>Estrategia:</h4>
                <p>${platformData.strategy.replace(/\[object Object\]/g, '')}</p>
              </div>
            ` : ''}
            ${platformData.contentTypes?.length ? `
              <div class="content-types-section">
                <h4>Tipos de Contenido:</h4>
                <ul>
                  ${platformData.contentTypes.map(type => `<li>${type}</li>`).join('')}
                </ul>
              </div>
            ` : ''}
            ${platformData.hashtags?.length ? `
              <div class="hashtags-section">
                <h4>Hashtags Recomendados:</h4>
                <div class="hashtag-list">
                  ${platformData.hashtags.map(tag => `
                    <span class="hashtag">${tag.replace(/\[object Object\]/g, '')}</span>
                  `).join('')}
                </div>
              </div>
            ` : ''}
          </div>
        `;
      }).filter(Boolean).join('');

      const html = `
        <div class="strategy-wrapper">
          <h1 class="main-title">Estrategia de Marketing Personal</h1>
          
          <section class="content-strategy-section">
            <h2 class="content-strategy-title">Estrategia de Contenido</h2>
            <p class="content-strategy-description">
              ${contentStrategy?.description || 'Plan de contenido específico por plataforma'}
            </p>
            <div class="platforms-grid">
              ${formattedContentStrategy}
            </div>
          </section>
        </div>

        <style>
          .strategy-wrapper {
            padding: 2rem;
            max-width: 1200px;
            margin: 0 auto;
          }

          .main-title {
            text-align: center;
            color: #333;
            margin-bottom: 2rem;
            font-size: 2.5rem;
          }

          .content-strategy-section {
            margin: 2rem 0;
          }

          .content-strategy-title {
            font-size: 2.5rem;
            text-align: center;
            margin: 2rem 0;
            padding: 1rem;
            background: linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%);
            color: white;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }

          .content-strategy-description {
            text-align: center;
            color: #666;
            margin-bottom: 2rem;
            font-size: 1.1rem;
          }

          .platforms-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
          }

          .platform-card {
            background: white;
            padding: 1.5rem;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }

          .platform-title {
            color: #7c3aed;
            margin-bottom: 1rem;
            font-size: 1.5rem;
            font-weight: bold;
          }

          .strategy-section,
          .content-types-section,
          .hashtags-section {
            margin-bottom: 1.5rem;
          }

          h4 {
            color: #4b5563;
            margin-bottom: 0.5rem;
            font-size: 1.1rem;
            font-weight: bold;
          }

          ul {
            list-style: none;
            padding-left: 1rem;
          }

          li {
            margin-bottom: 0.5rem;
            position: relative;
            padding-left: 1.5rem;
          }

          li:before {
            content: "•";
            color: #7c3aed;
            position: absolute;
            left: 0;
          }

          .hashtag-list {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
          }

          .hashtag {
            background: #f3f4f6;
            padding: 0.25rem 0.75rem;
            border-radius: 9999px;
            font-size: 0.875rem;
            color: #4b5563;
          }
        </style>
      `;

      return html;
    } catch (error) {
      console.error('Error formatting branding strategy:', error);
      return generateDefaultStrategy();
    }
  };

  // Add styles
  const styles = `
    .strategy-container {
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .main-title {
      text-align: center;
      color: #333;
      margin-bottom: 2rem;
    }

    .content-strategy-title {
      font-size: 2.5rem;
      color: #7c3aed;
      text-align: center;
      margin: 2rem 0;
      padding: 1rem;
      background: linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%);
      color: white;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .content-strategy-description {
      text-align: center;
      color: #666;
      margin-bottom: 2rem;
      font-size: 1.1rem;
    }

    .platforms-container {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
    }

    .platform-section {
      background: white;
      padding: 1.5rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .platform-section h3 {
      color: #7c3aed;
      margin-bottom: 1rem;
      font-size: 1.5rem;
    }

    .strategy-item, .content-types, .hashtags {
      margin-bottom: 1.5rem;
    }

    .strategy-item h4, .content-types h4, .hashtags h4 {
      color: #4b5563;
      margin-bottom: 0.5rem;
      font-size: 1.1rem;
    }

    .content-types ul {
      list-style-type: none;
      padding-left: 1rem;
    }

    .content-types li {
      margin-bottom: 0.5rem;
      position: relative;
      padding-left: 1.5rem;
    }

    .content-types li:before {
      content: "•";
      color: #7c3aed;
      position: absolute;
      left: 0;
    }

    .hashtag-list {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .hashtag {
      background: #f3f4f6;
      padding: 0.25rem 0.75rem;
      border-radius: 9999px;
      font-size: 0.875rem;
      color: #4b5563;
    }
  `;

  const generateDefaultStrategy = () => {
    return `### Estrategia de Marketing Personal

### Nicho y Posicionamiento
- Especialización: ${form.niche?.primary || 'No especificado'}
- Público objetivo: ${form.targetAudience?.demographics?.gender || 'No especificado'}, ${form.targetAudience?.demographics?.ageRange || 'No especificado'}
- Propuesta de valor única: ${form.niche?.uniqueValue?.approach || 'No especificado'}

### Plan de Contenidos por Plataforma
${Array.isArray(form.platforms) ? form.platforms.map(platform => 
  typeof platform === 'string' ? 
  `##### ${platform}
- Contenido: Contenido personalizado para ${platform}
- Estadísticas: Por definir` :
  `##### ${platform.name || 'Plataforma'}
- Contenido: ${(platform.contentTypes || []).join(', ') || 'Por definir'}
- Estadísticas: ${formatStats(platform.currentStats)}`
).join('\n\n') : ''}

### Objetivos
#### Corto Plazo
${form.objectives?.shortTerm?.map(obj => `- ${obj.goal}: ${obj.target || 'Por definir'}`).join('\n') || 'No hay objetivos a corto plazo definidos'}

#### Largo Plazo
${form.objectives?.longTerm?.map(obj => `- ${obj.goal} (${obj.timeframe || 'Plazo por definir'})`).join('\n') || 'No hay objetivos a largo plazo definidos'}

### Experiencia y Credenciales
- Especialidades: ${form.expertise?.specialties?.join(', ') || 'No especificado'}
- Años de experiencia: ${form.expertise?.experience?.years || 0}
- Logros destacados: ${form.expertise?.experience?.highlights?.join(', ') || 'No especificado'}

### Próximos Pasos
1. Optimizar perfiles en plataformas principales
2. Crear calendario de contenidos
3. Implementar estrategias por plataforma
4. Monitorear y ajustar según resultados`;
  };

  const formatStats = (stats: any) => {
    if (!stats) return 'No disponible';
    return Object.entries(stats)
      .filter(([_, value]) => value !== undefined && value !== null)
      .map(([key, value]) => `${key}: ${value}`)
      .join(', ') || 'No disponible';
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
        >
          <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-lg shadow-xl p-6">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>

            {showForm ? (
              <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                  {/* Nicho */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                      <Target className="w-4 h-4 mr-2 text-violet-500" />
                      Nicho
                    </label>
                    <select
                      value={form.niche.primary}
                      onChange={(e) => handleInputChange('niche.primary', e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-violet-500 focus:ring-opacity-50 transition-all duration-200"
                    >
                      <option value="">Selecciona un nicho</option>
                      <option value="Fitness general">Fitness general</option>
                      <option value="Pérdida de peso">Pérdida de peso</option>
                      <option value="Entrenamiento funcional">Entrenamiento funcional</option>
                      <option value="Yoga y bienestar">Yoga y bienestar</option>
                      <option value="Nutrición deportiva">Nutrición deportiva</option>
                      <option value="Rendimiento atlético">Rendimiento atlético</option>
                    </select>
                  </div>

                  {/* Plataformas */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
                      <TrendingUp className="w-4 h-4 mr-2 text-violet-500" />
                      Plataformas
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      <button
                        type="button"
                        onClick={() => handleArrayToggle('platforms', 'Instagram')}
                        className={`px-4 py-2 rounded-lg border ${
                          form.platforms.includes('Instagram')
                            ? 'bg-violet-500 text-white border-violet-600'
                            : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600'
                        } hover:shadow-md transition-all duration-200`}
                      >
                        Instagram
                      </button>
                      <button
                        type="button"
                        onClick={() => handleArrayToggle('platforms', 'YouTube')}
                        className={`px-4 py-2 rounded-lg border ${
                          form.platforms.includes('YouTube')
                            ? 'bg-violet-500 text-white border-violet-600'
                            : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600'
                        } hover:shadow-md transition-all duration-200`}
                      >
                        YouTube
                      </button>
                      <button
                        type="button"
                        onClick={() => handleArrayToggle('platforms', 'TikTok')}
                        className={`px-4 py-2 rounded-lg border ${
                          form.platforms.includes('TikTok')
                            ? 'bg-violet-500 text-white border-violet-600'
                            : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600'
                        } hover:shadow-md transition-all duration-200`}
                      >
                        TikTok
                      </button>
                      <button
                        type="button"
                        onClick={() => handleArrayToggle('platforms', 'LinkedIn')}
                        className={`px-4 py-2 rounded-lg border ${
                          form.platforms.includes('LinkedIn')
                            ? 'bg-violet-500 text-white border-violet-600'
                            : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600'
                        } hover:shadow-md transition-all duration-200`}
                      >
                        LinkedIn
                      </button>
                      <button
                        type="button"
                        onClick={() => handleArrayToggle('platforms', 'Twitter')}
                        className={`px-4 py-2 rounded-lg border ${
                          form.platforms.includes('Twitter')
                            ? 'bg-violet-500 text-white border-violet-600'
                            : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600'
                        } hover:shadow-md transition-all duration-200`}
                      >
                        Twitter
                      </button>
                      <button
                        type="button"
                        onClick={() => handleArrayToggle('platforms', 'Blog personal')}
                        className={`px-4 py-2 rounded-lg border ${
                          form.platforms.includes('Blog personal')
                            ? 'bg-violet-500 text-white border-violet-600'
                            : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600'
                        } hover:shadow-md transition-all duration-200`}
                      >
                        Blog personal
                      </button>
                    </div>
                  </div>

                  {/* Objetivos */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-2 text-violet-500" />
                      Objetivos
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        'Aumentar clientes',
                        'Construir autoridad',
                        'Generar leads',
                        'Crear comunidad',
                        'Vender productos',
                        'Networking'
                      ].map((objective) => (
                        <button
                          key={objective}
                          type="button"
                          onClick={() => handleObjectiveToggle(objective)}
                          className={`px-4 py-2 rounded-lg border ${
                            form.objectives.shortTerm.some(obj => obj.goal === objective)
                              ? 'bg-violet-500 text-white border-violet-600'
                              : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600'
                          } hover:shadow-md transition-all duration-200`}
                        >
                          {objective}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Audiencia */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
                      <Users className="w-4 h-4 mr-2 text-violet-500" />
                      Audiencia Objetivo
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {[
                        'Principiantes',
                        'Deportistas amateur',
                        'Profesionales',
                        'Corporativos',
                        'Adultos mayores',
                        'Jóvenes activos'
                      ].map((audience) => (
                        <button
                          key={audience}
                          type="button"
                          onClick={() => handleAudienceToggle(audience)}
                          className={`px-4 py-2 rounded-lg border ${
                            form.targetAudience.demographics.interests.includes(audience)
                              ? 'bg-violet-500 text-white border-violet-600'
                              : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600'
                          } hover:shadow-md transition-all duration-200`}
                        >
                          {audience}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-6">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-lg font-medium hover:from-violet-700 hover:to-purple-700 focus:ring-4 focus:ring-violet-500 focus:ring-opacity-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin" />
                        <span>Generando estrategia...</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-5 h-5" />
                        <span>Generar Estrategia</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            ) : (
              <PersonalMarketingGeneratorResponse strategy={strategy} />
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PersonalMarketingGenerator;
