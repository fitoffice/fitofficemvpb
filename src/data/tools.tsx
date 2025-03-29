import { 
  Sparkles, Image as ImageIcon, Brain, Zap, Target, Home,
  Rocket, Instagram, TrendingUp, Briefcase, Users, Globe,
  BarChart, Video, Copy, Edit, Languages
} from 'lucide-react';

export const mainTools = [
  { 
    id: 'posts', 
    chatId: 1,
    name: 'Generador de publicaciones con IA', 
    icon: Sparkles,
    description: 'Genera posts virales para tus redes sociales con IA avanzada',
    gradient: 'from-purple-500 to-pink-500',
    features: ['Optimización SEO', 'Análisis de tendencias', 'Personalización automática']
  },
  { 
    id: 'stories', 
    chatId: 2,
    name: 'Generador de HISTORIAS CON IA', 
    icon: ImageIcon,
    description: 'Diseña historias cautivadoras que conecten con tu audiencia',
    gradient: 'from-blue-500 to-cyan-500',
    features: ['Plantillas dinámicas', 'Efectos visuales', 'Programación automática']
  },
  { 
    id: 'content-strategy', 
    chatId: 3,
    name: 'Content Strategy', 
    icon: Brain,
    description: 'Desarrolla estrategias efectivas de contenido',
    gradient: 'from-violet-500 to-purple-500',
    features: ['Planificación', 'Calendario editorial', 'Optimización']
  }
];

export const fitnessTools = [
  {
    id: 'express-plans',
    chatId: 4,
    name: 'Generador de Planes Exprés',
    icon: Zap,
    description: 'Crea planes de entrenamiento rápidos y efectivos',
    gradient: 'from-green-500 to-emerald-500',
    features: ['Personalización', 'Objetivos específicos', 'Rutinas rápidas']
  },
  {
    id: 'injury-diagnosis',
    chatId: 5,
    name: 'Diagnóstico de Lesiones y Adaptaciones',
    icon: Target,
    description: 'Analiza y adapta entrenamientos según lesiones',
    gradient: 'from-red-500 to-orange-500',
    features: ['Evaluación', 'Recomendaciones', 'Ejercicios alternativos']
  },
  {
    id: 'lifestyle-guide',
    chatId: 6,
    name: 'Guía de Estilo de Vida y Hábitos Diarios',
    icon: Home,
    description: 'Optimiza tus hábitos diarios para mejor rendimiento',
    gradient: 'from-teal-500 to-cyan-500',
    features: ['Rutinas diarias', 'Nutrición', 'Descanso']
  }
];

export const performanceTools = [
  {
    id: 'plateau-strategies',
    chatId: 7,
    name: 'Planificador de Estrategias para Superar Estancamientos',
    icon: Rocket,
    description: 'Supera mesetas en tu rendimiento',
    gradient: 'from-indigo-500 to-blue-500',
    features: ['Análisis', 'Soluciones', 'Seguimiento']
  },
  {
    id: 'smart-goals',
    chatId: 8,
    name: 'Constructor de Metas SMART',
    icon: Target,
    description: 'Define objetivos específicos y alcanzables',
    gradient: 'from-purple-500 to-indigo-500',
    features: ['Específico', 'Medible', 'Alcanzable']
  },
  {
    id: 'social-content',
    chatId: 9,
    name: 'Creador de Contenido en Redes Sociales',
    icon: Instagram,
    description: 'Genera contenido atractivo para redes sociales',
    gradient: 'from-pink-500 to-rose-500',
    features: ['Posts', 'Stories', 'Reels']
  }
];

export const engagementTools = [
  {
    id: 'challenges',
    chatId: 10,
    name: 'Creador de Retos y Competencias',
    icon: Target,
    description: 'Diseña retos motivadores para tus clientes',
    gradient: 'from-yellow-500 to-orange-500',
    features: ['Gamificación', 'Premios', 'Seguimiento']
  },
  {
    id: 'progress-simulator',
    chatId: 11,
    name: 'Simulador de Escenarios de Avance',
    icon: TrendingUp,
    description: 'Visualiza diferentes escenarios de progreso',
    gradient: 'from-green-500 to-teal-500',
    features: ['Proyecciones', 'Variables', 'Análisis']
  },
  {
    id: 'home-equipment',
    chatId: 12,
    name: 'Orientador de Equipamiento Casero',
    icon: Home,
    description: 'Optimiza tu entrenamiento en casa',
    gradient: 'from-blue-500 to-purple-500',
    features: ['Recomendaciones', 'Alternativas', 'Presupuesto']
  }
];

export const specializedTools = [
  {
    id: 'office-breaks',
    chatId: 13,
    name: 'Diseño de Pausas Activas en la Oficina',
    icon: Briefcase,
    description: 'Ejercicios y rutinas para el trabajo',
    gradient: 'from-cyan-500 to-blue-500',
    features: ['Ejercicios cortos', 'Ergonomía', 'Productividad']
  },
  {
    id: 'personal-marketing',
    chatId: 14,
    name: 'Generador de Estrategias de Marketing Personal',
    icon: Users,
    description: 'Mejora tu presencia profesional',
    gradient: 'from-violet-500 to-purple-500',
    features: ['Branding', 'Redes', 'Posicionamiento']
  },
  {
    id: 'travel-training',
    chatId: 15,
    name: 'Chat de Entrenamiento para Viajeros',
    icon: Globe,
    description: 'Mantén tu rutina mientras viajas',
    gradient: 'from-amber-500 to-orange-500',
    features: ['Adaptabilidad', 'Equipamiento mínimo', 'Nutrición']
  }
];

export const groupTools = [
  {
    id: 'group-classes',
    chatId: 16,
    name: 'Gestor de Clases Grupales o Bootcamps',
    icon: Users,
    description: 'Organiza y gestiona sesiones grupales',
    gradient: 'from-pink-500 to-rose-500',
    features: ['Planificación', 'Niveles', 'Progresión']
  },
  {
    id: 'micro-habits',
    chatId: 17,
    name: 'Constructor de Micro-Hábitos Saludables',
    icon: Brain,
    description: 'Desarrolla hábitos sostenibles',
    gradient: 'from-emerald-500 to-green-500',
    features: ['Paso a paso', 'Seguimiento', 'Recordatorios']
  },
  {
    id: 'audience-analyzer',
    chatId: 18,
    name: 'Audience Analyzer',
    icon: BarChart,
    description: 'Analiza y comprende tu audiencia',
    gradient: 'from-blue-500 to-indigo-500',
    features: ['Demografía', 'Intereses', 'Comportamiento']
  }
];

export const videoTools = [
  {
    id: 'ai-creator',
    chatId: 19,
    name: 'AI Creator',
    icon: Video,
    description: 'Crea videos profesionales con IA',
    gradient: 'from-red-500 to-orange-500',
    features: ['Edición automática', 'Efectos especiales', 'Optimización de contenido']
  },
  {
    id: 'ai-edit',
    chatId: 20,
    name: 'AI Edit',
    icon: Edit,
    description: 'Edita videos con inteligencia artificial',
    gradient: 'from-blue-500 to-indigo-500',
    features: ['Cortes automáticos', 'Mejora de calidad', 'Transiciones']
  },
  {
    id: 'ai-translate',
    chatId: 21,
    name: 'AI Translate',
    icon: Languages,
    description: 'Traduce videos a múltiples idiomas',
    gradient: 'from-green-500 to-teal-500',
    features: ['Doblaje automático', 'Subtítulos', 'Sincronización']
  },
  {
    id: 'ai-twin',
    chatId: 22,
    name: 'AI Twin',
    icon: Copy,
    description: 'Crea tu gemelo digital para videos',
    gradient: 'from-purple-500 to-pink-500',
    features: ['Avatar personalizado', 'Síntesis de voz', 'Gestos naturales']
  },
  {
    id: 'content-planner',
    chatId: 23,
    name: 'Planificador de Contenido',
    icon: Video,
    description: 'Organiza y planifica tu contenido de video',
    gradient: 'from-yellow-500 to-orange-500',
    features: ['Calendario editorial', 'Gestión de ideas', 'Programación de publicaciones']
  }
];
