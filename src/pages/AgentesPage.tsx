import React, { useState } from 'react';
import { 
  Activity, 
  BarChart2, 
  Book,
  Brain,
  Calendar, 
  Camera,
  CheckCircle,
  ChevronDown,
  CloudLightning,
  DollarSign, 
  FileText,
  Group,
  Heart, 
  Link,
  Map,
  MessageCircle,
  MessageSquare, 
  PieChart, 
  Rocket,
  Search,
  Shield,
  Share2,
  Smartphone,
  Star,
  Store,
  Target,
  Trophy,
  TrendingUp,
  Users,
  Utensils,
  Video,
  Watch,
  Zap,
  Box,
  Timer,
  RefreshCw,
  Bell
} from 'lucide-react';
import AgentDetailsSection from '../components/AgentDetailsSection';
import AgentComparison from '../components/AgentComparison';
import { Agent } from '../types/Agent';

// Datos de los agentes
const agentsData: Agent[] = [
  {
    id: "1",
    title: "Agente de Programación de Sesiones",
    description: "Optimiza y automatiza la programación de sesiones de entrenamiento, considerando la disponibilidad tanto de entrenadores como de clientes. Incluye gestión de cancelaciones y reprogramaciones.",
    price: 29.99,
    features: [
      "Calendario inteligente con sincronización automática",
      "Sistema de recordatorios personalizables",
      "Gestión de conflictos de horarios"
    ],
    icon: Calendar,
    gradient: "from-blue-400 via-blue-500 to-indigo-600",
    category: "gestion",
    detailedFeatures: [
      {
        title: "Programación Inteligente",
        description: "Algoritmo que optimiza automáticamente los horarios basándose en preferencias y disponibilidad",
        icon: Calendar
      },
      {
        title: "Gestión de Conflictos",
        description: "Resuelve automáticamente superposiciones y sugiere alternativas óptimas",
        icon: Shield
      },
      {
        title: "Recordatorios Personalizados",
        description: "Sistema de notificaciones multicanal con mensajes personalizables",
        icon: MessageSquare
      }
    ],
    integrations: [
      {
        name: "Google Calendar",
        icon: "google-calendar.svg",
        description: "Sincronización bidireccional con Google Calendar"
      },
      {
        name: "Outlook",
        icon: "outlook.svg",
        description: "Integración completa con Microsoft Outlook"
      },
      {
        name: "WhatsApp",
        icon: "whatsapp.svg",
        description: "Envío de recordatorios vía WhatsApp"
      }
    ],
    caseStudies: [
      {
        title: "Ahorro de Tiempo",
        description: "Reduce el tiempo de programación en un 75%",
        metric: "2 horas ahorradas al día",
        icon: Calendar
      },
      {
        title: "Satisfacción del Cliente",
        description: "Mejora en la experiencia de reserva",
        metric: "98% de satisfacción",
        icon: CheckCircle
      }
    ],
    demoImages: [
      "/images/agents/calendar-view.png",
      "/images/agents/scheduling-demo.png",
      "/images/agents/mobile-app.png"
    ]
  },
  {
    id: "2",
    title: "Agente de Nutrición & Dietas",
    description: "Asistente especializado en la creación y seguimiento de planes nutricionales personalizados. Genera recomendaciones basadas en objetivos, preferencias y restricciones dietéticas.",
    price: 34.99,
    features: [
      "Generación de planes nutricionales personalizados",
      "Calculadora de macronutrientes",
      "Sugerencias de recetas saludables"
    ],
    icon: MessageSquare,
    gradient: "from-green-400 via-green-500 to-emerald-600",
    category: "nutricion",
    detailedFeatures: [
      {
        title: "Análisis de Macronutrientes",
        description: "Calcula las necesidades calóricas y macronutrientes según objetivos y preferencias",
        icon: PieChart
      },
      {
        title: "Recomendaciones Personalizadas",
        description: "Sugiere planes nutricionales y recetas basadas en restricciones dietéticas y preferencias",
        icon: Heart
      },
      {
        title: "Seguimiento de Progreso",
        description: "Monitorea el progreso y ajusta los planes nutricionales según sea necesario",
        icon: Activity
      }
    ],
    integrations: [
      {
        name: "MyFitnessPal",
        icon: "myfitnesspal.svg",
        description: "Integración con la base de datos de alimentos de MyFitnessPal"
      },
      {
        name: "Apple Health",
        icon: "apple-health.svg",
        description: "Sincronización con Apple Health para seguimiento de actividad física"
      }
    ],
    caseStudies: [
      {
        title: "Mejora en la Salud",
        description: "Mejora en la salud general y reducción de riesgos de enfermedades crónicas",
        metric: "90% de mejora en la salud",
        icon: Heart
      }
    ],
    demoImages: [
      "/images/agents/nutrition-plan.png",
      "/images/agents/recipe-suggestions.png",
      "/images/agents/macronutrient-calculator.png"
    ]
  },
  {
    id: "3",
    title: "Agente de Marketing en Redes",
    description: "Optimiza la presencia en redes sociales generando contenido relevante y programando publicaciones. Analiza tendencias y engagement para maximizar el alcance.",
    price: 39.99,
    features: [
      "Programación automática de contenido",
      "Análisis de métricas y engagement",
      "Sugerencias de hashtags optimizados"
    ],
    icon: Share2,
    gradient: "from-purple-400 via-purple-500 to-pink-600",
    category: "marketing",
    detailedFeatures: [
      {
        title: "Contenido Relevante",
        description: "Genera contenido relevante y atractivo para las redes sociales",
        icon: MessageSquare
      },
      {
        title: "Programación Automática",
        description: "Programa publicaciones en redes sociales para maximizar el alcance",
        icon: Calendar
      },
      {
        title: "Análisis de Métricas",
        description: "Analiza métricas y engagement para ajustar la estrategia de marketing",
        icon: PieChart
      }
    ],
    integrations: [
      {
        name: "Facebook",
        icon: "facebook.svg",
        description: "Integración con Facebook para publicaciones y análisis de métricas"
      },
      {
        name: "Instagram",
        icon: "instagram.svg",
        description: "Integración con Instagram para publicaciones y análisis de métricas"
      }
    ],
    caseStudies: [
      {
        title: "Aumento de Alcance",
        description: "Aumento en el alcance y engagement en redes sociales",
        metric: "500% de aumento en el alcance",
        icon: TrendingUp
      }
    ],
    demoImages: [
      "/images/agents/social-media-posts.png",
      "/images/agents/engagement-analytics.png",
      "/images/agents/hashtag-suggestions.png"
    ]
  },
  {
    id: "4",
    title: "Agente de Lead Generation y Ventas",
    description: "Automatiza la captación y seguimiento de potenciales clientes, implementando estrategias de nurturing y conversión efectivas.",
    price: 44.99,
    features: [
      "Automatización de campañas de captación",
      "Seguimiento personalizado de leads",
      "Análisis de tasas de conversión"
    ],
    icon: Users,
    gradient: "from-orange-400 via-orange-500 to-red-600",
    category: "ventas",
    detailedFeatures: [
      {
        title: "Campañas de Captación",
        description: "Automatiza campañas de captación de leads y seguimiento personalizado",
        icon: MessageSquare
      },
      {
        title: "Nurturing de Leads",
        description: "Implementa estrategias de nurturing para aumentar la conversión",
        icon: Heart
      },
      {
        title: "Análisis de Conversión",
        description: "Analiza tasas de conversión y ajusta la estrategia de ventas",
        icon: PieChart
      }
    ],
    integrations: [
      {
        name: "HubSpot",
        icon: "hubspot.svg",
        description: "Integración con HubSpot para automatización de campañas y seguimiento de leads"
      }
    ],
    caseStudies: [
      {
        title: "Aumento de Ventas",
        description: "Aumento en las ventas y conversión de leads",
        metric: "25% de aumento en las ventas",
        icon: TrendingUp
      }
    ],
    demoImages: [
      "/images/agents/lead-generation.png",
      "/images/agents/nurturing-emails.png",
      "/images/agents/conversion-analytics.png"
    ]
  },
  {
    id: "5",
    title: "Agente de Retos y Gamificación",
    description: "Crea y gestiona desafíos motivadores para los clientes, implementando elementos de gamificación para aumentar el compromiso y la retención.",
    price: 24.99,
    features: [
      "Creación de retos personalizados",
      "Sistema de recompensas y logros",
      "Seguimiento de participación"
    ],
    icon: Trophy,
    gradient: "from-yellow-400 via-yellow-500 to-orange-600",
    category: "gamificacion",
    detailedFeatures: [
      {
        title: "Retos Personalizados",
        description: "Crea retos personalizados y desafíos para aumentar el compromiso",
        icon: Target
      },
      {
        title: "Sistema de Recompensas",
        description: "Implementa un sistema de recompensas y logros para motivar a los clientes",
        icon: CheckCircle
      },
      {
        title: "Seguimiento de Participación",
        description: "Monitorea la participación y ajusta la estrategia de gamificación",
        icon: Activity
      }
    ],
    integrations: [
      {
        name: "Google Fit",
        icon: "google-fit.svg",
        description: "Integración con Google Fit para seguimiento de actividad física"
      }
    ],
    caseStudies: [
      {
        title: "Aumento de Compromiso",
        description: "Aumento en el compromiso y retención de los clientes",
        metric: "50% de aumento en el compromiso",
        icon: Heart
      }
    ],
    demoImages: [
      "/images/agents/challenges.png",
      "/images/agents/rewards-system.png",
      "/images/agents/participation-tracking.png"
    ]
  },
  {
    id: "6",
    title: "Agente de Facturación y Cobros",
    description: "Gestiona automáticamente los procesos de facturación, cobros y recordatorios de pago, asegurando un flujo financiero eficiente.",
    price: 29.99,
    features: [
      "Facturación automática recurrente",
      "Gestión de recordatorios de pago",
      "Informes financieros detallados"
    ],
    icon: DollarSign,
    gradient: "from-teal-400 via-teal-500 to-cyan-600",
    category: "finanzas",
    detailedFeatures: [
      {
        title: "Facturación Automática",
        description: "Genera facturas automáticas y recurrentes para asegurar un flujo financiero eficiente",
        icon: Calendar
      },
      {
        title: "Recordatorios de Pago",
        description: "Envía recordatorios de pago personalizados para asegurar el cobro oportuno",
        icon: MessageSquare
      },
      {
        title: "Informes Financieros",
        description: "Genera informes financieros detallados para monitorear el desempeño",
        icon: PieChart
      }
    ],
    integrations: [
      {
        name: "Stripe",
        icon: "stripe.svg",
        description: "Integración con Stripe para procesamiento de pagos"
      }
    ],
    caseStudies: [
      {
        title: "Ahorro de Tiempo",
        description: "Reduce el tiempo dedicado a la facturación y cobros",
        metric: "75% de ahorro de tiempo",
        icon: Calendar
      }
    ],
    demoImages: [
      "/images/agents/invoice-generation.png",
      "/images/agents/payment-reminders.png",
      "/images/agents/financial-reports.png"
    ]
  },
  {
    id: "7",
    title: "Agente de Seguimiento de Progreso",
    description: "Monitorea y analiza el progreso de los clientes, generando informes detallados y recomendaciones personalizadas para optimizar resultados.",
    price: 32.99,
    features: [
      "Tracking de métricas personalizadas",
      "Generación de informes visuales",
      "Alertas de hitos alcanzados"
    ],
    icon: Activity,
    gradient: "from-blue-500 via-blue-600 to-violet-600",
    category: "analisis",
    detailedFeatures: [
      {
        title: "Métricas Personalizadas",
        description: "Monitorea métricas personalizadas para cada cliente",
        icon: PieChart
      },
      {
        title: "Informes Visuales",
        description: "Genera informes visuales para una fácil comprensión del progreso",
        icon: MessageSquare
      },
      {
        title: "Alertas de Hitos",
        description: "Envía alertas de hitos alcanzados para asegurar el progreso",
        icon: CheckCircle
      }
    ],
    integrations: [
      {
        name: "Google Analytics",
        icon: "google-analytics.svg",
        description: "Integración con Google Analytics para seguimiento de métricas"
      }
    ],
    caseStudies: [
      {
        title: "Mejora en el Progreso",
        description: "Mejora en el progreso y resultados de los clientes",
        metric: "90% de mejora en el progreso",
        icon: TrendingUp
      }
    ],
    demoImages: [
      "/images/agents/metric-tracking.png",
      "/images/agents/visual-reports.png",
      "/images/agents/milestone-alerts.png"
    ]
  },
  {
    id: "8",
    title: "Agente de Asesoría para Lesiones Menores",
    description: "Proporciona orientación inicial sobre lesiones menores, sugiere modificaciones en los entrenamientos y deriva a especialistas cuando es necesario.",
    price: 27.99,
    features: [
      "Evaluación inicial de lesiones",
      "Recomendaciones de ejercicios alternativos",
      "Sistema de derivación a especialistas"
    ],
    icon: Heart,
    gradient: "from-red-400 via-red-500 to-rose-600",
    category: "salud",
    detailedFeatures: [
      {
        title: "Evaluación de Lesiones",
        description: "Evaluación inicial de lesiones menores para proporcionar orientación",
        icon: Shield
      },
      {
        title: "Recomendaciones de Ejercicios",
        description: "Sugiere modificaciones en los entrenamientos para evitar lesiones",
        icon: Target
      },
      {
        title: "Derivación a Especialistas",
        description: "Deriva a especialistas cuando es necesario para asegurar la atención adecuada",
        icon: Link
      }
    ],
    integrations: [
      {
        name: "American Red Cross",
        icon: "american-red-cross.svg",
        description: "Integración con la American Red Cross para acceso a recursos de primeros auxilios"
      }
    ],
    caseStudies: [
      {
        title: "Mejora en la Salud",
        description: "Mejora en la salud y reducción de lesiones menores",
        metric: "80% de mejora en la salud",
        icon: Heart
      }
    ],
    demoImages: [
      "/images/agents/injury-assessment.png",
      "/images/agents/exercise-modifications.png",
      "/images/agents/specialist-referral.png"
    ]
  },
  {
    id: "9",
    title: "Agente de CRM y Segmentación de Clientes",
    description: "Analiza y segmenta la base de clientes para ofrecer experiencias personalizadas y optimizar las estrategias de retención.",
    price: 37.99,
    features: [
      "Segmentación automática de clientes",
      "Análisis de comportamiento y preferencias",
      "Recomendaciones personalizadas"
    ],
    icon: PieChart,
    gradient: "from-indigo-400 via-indigo-500 to-purple-600",
    category: "crm",
    detailedFeatures: [
      {
        title: "Segmentación de Clientes",
        description: "Segmenta la base de clientes para ofrecer experiencias personalizadas",
        icon: Users
      },
      {
        title: "Análisis de Comportamiento",
        description: "Analiza el comportamiento y preferencias de los clientes",
        icon: PieChart
      },
      {
        title: "Recomendaciones Personalizadas",
        description: "Sugiere recomendaciones personalizadas para aumentar la retención",
        icon: Heart
      }
    ],
    integrations: [
      {
        name: "Salesforce",
        icon: "salesforce.svg",
        description: "Integración con Salesforce para acceso a herramientas de CRM"
      }
    ],
    caseStudies: [
      {
        title: "Aumento de Retención",
        description: "Aumento en la retención de clientes y reducción de la rotación",
        metric: "60% de aumento en la retención",
        icon: TrendingUp
      }
    ],
    demoImages: [
      "/images/agents/customer-segmentation.png",
      "/images/agents/behavioral-analysis.png",
      "/images/agents/personalized-recommendations.png"
    ]
  },
  {
    id: "10",
    title: "Agente de Coaching Mental & Manejo de Estrés",
    description: "Asistente especializado en técnicas de relajación, manejo del estrés y bienestar mental para tus clientes.",
    price: 34.99,
    features: [
      "Ejercicios de relajación personalizados",
      "Seguimiento del nivel de estrés",
      "Notificaciones de pausas activas"
    ],
    icon: Brain,
    gradient: "from-indigo-400 via-purple-500 to-pink-600",
    category: "mental",
    detailedFeatures: [
      {
        title: "Técnicas de Relajación",
        description: "Ejercicios de respiración, meditación y mindfulness adaptados",
        icon: CloudLightning
      },
      {
        title: "Monitoreo de Estrés",
        description: "Seguimiento continuo mediante cuestionarios y evaluaciones",
        icon: Activity
      },
      {
        title: "Pausas Activas",
        description: "Recordatorios y ejercicios para mantener el equilibrio mental",
        icon: Timer
      }
    ],
    integrations: [
      {
        name: "Headspace",
        icon: "headspace.svg",
        description: "Integración con Headspace para meditaciones guiadas"
      }
    ],
    caseStudies: [
      {
        title: "Mejora del Bienestar",
        description: "Reducción significativa en niveles de estrés",
        metric: "65% de reducción de estrés",
        icon: Heart
      }
    ]
  },
  {
    id: "11",
    title: "Agente de Micro-Hábitos y Retos Diarios",
    description: "Crea y gestiona mini-desafíos diarios para fomentar hábitos saludables y mantener la motivación de tus clientes.",
    price: 29.99,
    features: [
      "Mini-desafíos personalizados",
      "Sistema de rachas y logros",
      "Recompensas y gamificación"
    ],
    icon: Star,
    gradient: "from-yellow-400 via-orange-500 to-red-600",
    category: "habitos",
    detailedFeatures: [
      {
        title: "Desafíos Diarios",
        description: "Retos adaptados al nivel y objetivos del cliente",
        icon: Target
      },
      {
        title: "Sistema de Rachas",
        description: "Seguimiento de constancia y logros conseguidos",
        icon: Trophy
      },
      {
        title: "Recompensas",
        description: "Sistema de insignias y reconocimientos",
        icon: Star
      }
    ]
  },
  {
    id: "12",
    title: "Agente de Análisis de KPIs y Finanzas",
    description: "Análisis detallado de métricas de negocio y finanzas para optimizar la rentabilidad de tu negocio.",
    price: 44.99,
    features: [
      "Análisis de métricas clave",
      "Informes financieros detallados",
      "Proyecciones y recomendaciones"
    ],
    icon: PieChart,
    gradient: "from-emerald-400 via-teal-500 to-cyan-600",
    category: "finanzas",
    detailedFeatures: [
      {
        title: "Métricas de Negocio",
        description: "Seguimiento de KPIs fundamentales",
        icon: BarChart2
      },
      {
        title: "Informes Financieros",
        description: "Reportes detallados y comparativas",
        icon: FileText
      },
      {
        title: "Recomendaciones",
        description: "Sugerencias basadas en datos para mejorar rentabilidad",
        icon: TrendingUp
      }
    ]
  },
  {
    id: "13",
    title: "Agente de Postura & Ergonomía",
    description: "Evaluación y corrección postural para mejorar la calidad de vida de tus clientes.",
    price: 32.99,
    features: [
      "Evaluación postural",
      "Ejercicios correctivos",
      "Recordatorios ergonómicos"
    ],
    icon: Activity,
    gradient: "from-blue-400 via-indigo-500 to-purple-600",
    category: "salud",
    detailedFeatures: [
      {
        title: "Análisis Postural",
        description: "Evaluación mediante cuestionarios y fotos",
        icon: Camera
      },
      {
        title: "Corrección",
        description: "Ejercicios específicos para mejorar la postura",
        icon: Shield
      },
      {
        title: "Recordatorios",
        description: "Alertas para mantener una buena postura",
        icon: Bell
      }
    ]
  },
  {
    id: "14",
    title: "Agente de Integración con Wearables",
    description: "Sincronización y análisis de datos de dispositivos inteligentes para un seguimiento preciso.",
    price: 39.99,
    features: [
      "Sincronización con wearables",
      "Alertas personalizadas",
      "Ajuste dinámico de planes"
    ],
    icon: Watch,
    gradient: "from-purple-400 via-pink-500 to-red-600",
    category: "tecnologia",
    detailedFeatures: [
      {
        title: "Sincronización",
        description: "Conexión con múltiples dispositivos",
        icon: Smartphone
      },
      {
        title: "Monitoreo",
        description: "Seguimiento de actividad y métricas vitales",
        icon: Activity
      },
      {
        title: "Adaptación",
        description: "Ajuste automático de planes según datos",
        icon: RefreshCw
      }
    ]
  },
  {
    id: "15",
    title: "Agente de Retención y Fidelización",
    description: "Estrategias y herramientas para mantener y fidelizar a tus clientes.",
    price: 37.99,
    features: [
      "Detección de abandono",
      "Campañas de re-engagement",
      "Programas de fidelización"
    ],
    icon: Users,
    gradient: "from-green-400 via-emerald-500 to-teal-600",
    category: "marketing",
    detailedFeatures: [
      {
        title: "Prevención",
        description: "Detección temprana de posible abandono",
        icon: Shield
      },
      {
        title: "Re-engagement",
        description: "Estrategias para recuperar clientes",
        icon: RefreshCw
      },
      {
        title: "Fidelización",
        description: "Programas de recompensas y beneficios",
        icon: Heart
      }
    ]
  },
  {
    id: "16",
    title: "Agente de Diagnóstico Rápido de Lesiones",
    description: "Evaluación inicial y recomendaciones para el manejo de lesiones deportivas.",
    price: 34.99,
    features: [
      "Evaluación inicial",
      "Recomendaciones de seguridad",
      "Derivación profesional"
    ],
    icon: Heart,
    gradient: "from-red-400 via-rose-500 to-pink-600",
    category: "salud",
    detailedFeatures: [
      {
        title: "Diagnóstico",
        description: "Evaluación rápida de lesiones",
        icon: Search
      },
      {
        title: "Recomendaciones",
        description: "Consejos de seguridad y recuperación",
        icon: Shield
      },
      {
        title: "Derivación",
        description: "Conexión con profesionales especializados",
        icon: Link
      }
    ]
  },
  {
    id: "17",
    title: "Agente de Agrupación de Clientes y Bootcamps",
    description: "Organización y gestión de entrenamientos grupales y bootcamps.",
    price: 35.99,
    features: [
      "Creación de grupos",
      "Gestión de bootcamps",
      "Rankings y competencias"
    ],
    icon: Group,
    gradient: "from-orange-400 via-amber-500 to-yellow-600",
    category: "gestion",
    detailedFeatures: [
      {
        title: "Grupos",
        description: "Organización de grupos por objetivos",
        icon: Users
      },
      {
        title: "Bootcamps",
        description: "Planificación y gestión de eventos",
        icon: Calendar
      },
      {
        title: "Competencia",
        description: "Sistema de rankings y logros grupales",
        icon: Trophy
      }
    ]
  },
  {
    id: "18",
    title: "Agente de Viajes y Rutinas Móviles",
    description: "Planes de entrenamiento adaptados para personas que viajan frecuentemente.",
    price: 29.99,
    features: [
      "Rutinas sin equipamiento",
      "Adaptación a espacios reducidos",
      "Alertas de continuidad"
    ],
    icon: Map,
    gradient: "from-sky-400 via-blue-500 to-indigo-600",
    category: "entrenamiento",
    detailedFeatures: [
      {
        title: "Movilidad",
        description: "Rutinas adaptadas a cualquier espacio",
        icon: Map
      },
      {
        title: "Equipamiento",
        description: "Ejercicios con objetos cotidianos",
        icon: Box
      },
      {
        title: "Continuidad",
        description: "Seguimiento durante viajes",
        icon: Calendar
      }
    ]
  },
  {
    id: "19",
    title: "Agente de Eventos y Talleres Online",
    description: "Planificación y gestión de eventos educativos y talleres virtuales.",
    price: 32.99,
    features: [
      "Planificación de webinars",
      "Gestión de inscripciones",
      "Seguimiento post-evento"
    ],
    icon: Video,
    gradient: "from-violet-400 via-purple-500 to-fuchsia-600",
    category: "educacion",
    detailedFeatures: [
      {
        title: "Eventos",
        description: "Organización de webinars y talleres",
        icon: Video
      },
      {
        title: "Inscripciones",
        description: "Gestión automatizada de participantes",
        icon: Users
      },
      {
        title: "Seguimiento",
        description: "Análisis y feedback post-evento",
        icon: MessageSquare
      }
    ]
  },
  {
    id: "20",
    title: "Agente de Comunicación y Chat Centralizado",
    description: "Gestión centralizada de comunicaciones con clientes en múltiples plataformas.",
    price: 36.99,
    features: [
      "Chat unificado",
      "Respuestas automáticas",
      "Historial de conversaciones"
    ],
    icon: MessageCircle,
    gradient: "from-cyan-400 via-blue-500 to-indigo-600",
    category: "comunicacion",
    detailedFeatures: [
      {
        title: "Centralización",
        description: "Gestión unificada de mensajes",
        icon: MessageSquare
      },
      {
        title: "Automatización",
        description: "Respuestas rápidas y plantillas",
        icon: Zap
      },
      {
        title: "Historial",
        description: "Registro completo de interacciones",
        icon: FileText
      }
    ]
  },
  {
    id: "21",
    title: "Agente de Biblioteca de Contenido Interno",
    description: "Organización y gestión de recursos educativos y materiales de entrenamiento.",
    price: 31.99,
    features: [
      "Biblioteca digital",
      "Organización de contenido",
      "Compartir recursos"
    ],
    icon: Book,
    gradient: "from-emerald-400 via-green-500 to-lime-600",
    category: "educacion",
    detailedFeatures: [
      {
        title: "Organización",
        description: "Gestión de recursos digitales",
        icon: Book
      },
      {
        title: "Acceso",
        description: "Búsqueda y compartir contenido",
        icon: Search
      },
      {
        title: "Personalización",
        description: "Adaptación de materiales",
        icon: FileText
      }
    ]
  }
];

// Categorías
const categories = [
  {
    id: "todos",
    name: "Todos",
    description: "Todos los agentes disponibles",
    icon: Store,
    gradient: "from-purple-500 to-pink-500"
  },
  {
    id: "gestion",
    name: "Gestión",
    description: "Agentes especializados en gestión y organización",
    icon: Calendar,
    gradient: "from-blue-500 to-cyan-500"
  },
  {
    id: "nutricion",
    name: "Nutrición",
    description: "Agentes especializados en nutrición y dietas",
    icon: MessageSquare,
    gradient: "from-green-500 to-emerald-500"
  },
  {
    id: "marketing",
    name: "Marketing",
    description: "Agentes especializados en marketing y publicidad",
    icon: Share2,
    gradient: "from-purple-500 to-pink-500"
  },
  {
    id: "ventas",
    name: "Ventas",
    description: "Agentes especializados en ventas y conversión",
    icon: Users,
    gradient: "from-orange-500 to-red-500"
  },
  {
    id: "gamificacion",
    name: "Gamificación",
    description: "Agentes especializados en gamificación y retos",
    icon: Trophy,
    gradient: "from-yellow-500 to-orange-500"
  },
  {
    id: "finanzas",
    name: "Finanzas",
    description: "Agentes especializados en finanzas y contabilidad",
    icon: DollarSign,
    gradient: "from-teal-500 to-cyan-500"
  },
  {
    id: "analisis",
    name: "Análisis",
    description: "Agentes especializados en análisis y seguimiento",
    icon: Activity,
    gradient: "from-blue-500 to-violet-500"
  },
  {
    id: "salud",
    name: "Salud",
    description: "Agentes especializados en salud y bienestar",
    icon: Heart,
    gradient: "from-red-500 to-rose-500"
  },
  {
    id: "crm",
    name: "CRM",
    description: "Agentes especializados en CRM y segmentación de clientes",
    icon: PieChart,
    gradient: "from-indigo-500 to-purple-500"
  },
  {
    id: "mental",
    name: "Salud Mental",
    description: "Agentes especializados en bienestar mental",
    icon: Brain,
    gradient: "from-indigo-500 to-purple-500"
  },
  {
    id: "habitos",
    name: "Hábitos",
    description: "Agentes para desarrollo de hábitos saludables",
    icon: Star,
    gradient: "from-yellow-500 to-orange-500"
  },
  {
    id: "tecnologia",
    name: "Tecnología",
    description: "Agentes de integración tecnológica",
    icon: Smartphone,
    gradient: "from-blue-500 to-indigo-500"
  },
  {
    id: "comunicacion",
    name: "Comunicación",
    description: "Agentes de gestión de comunicaciones",
    icon: MessageCircle,
    gradient: "from-cyan-500 to-blue-500"
  },
  {
    id: "educacion",
    name: "Educación",
    description: "Agentes de contenido educativo",
    icon: Book,
    gradient: "from-green-500 to-emerald-500"
  },
  {
    id: "entrenamiento",
    name: "Entrenamiento",
    description: "Agentes de planificación de entrenamientos",
    icon: Activity,
    gradient: "from-orange-500 to-red-500"
  }
];

const agentBundles = [
  {
    id: "bundle1",
    title: "Pack de Inicio",
    description: "Pack perfecto para entrenadores que están comenzando su negocio",
    originalPrice: 102.97, // Suma de los precios originales
    discountedPrice: 79.99, // Precio con descuento
    savings: "22%", // Porcentaje de ahorro
    agents: ["1", "2", "7"], // IDs de los agentes incluidos
    features: [
      "Gestión eficiente de sesiones",
      "Planes nutricionales personalizados",
      "Seguimiento del progreso de clientes"
    ],
    gradient: "from-blue-400 via-purple-500 to-pink-600",
    icon: Rocket
  },
  {
    id: "bundle2",
    title: "Pack Pro Marketing",
    description: "Ideal para entrenadores que quieren potenciar su presencia online y ventas",
    originalPrice: 122.97,
    discountedPrice: 89.99,
    savings: "27%",
    agents: ["3", "4", "9"],
    features: [
      "Marketing en redes sociales",
      "Generación de leads y ventas",
      "Segmentación de clientes"
    ],
    gradient: "from-green-400 via-blue-500 to-purple-600",
    icon: TrendingUp
  },
  {
    id: "bundle3",
    title: "Pack Bienestar Total",
    description: "Enfocado en el bienestar integral y la retención de clientes",
    originalPrice: 85.97,
    discountedPrice: 64.99,
    savings: "24%",
    agents: ["2", "5", "8"],
    features: [
      "Nutrición personalizada",
      "Gamificación y retos",
      "Asesoría en lesiones"
    ],
    gradient: "from-orange-400 via-red-500 to-pink-600",
    icon: Heart
  }
];

const AgentesPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("todos");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedForComparison, setSelectedForComparison] = useState<string[]>([]);
  const [showComparison, setShowComparison] = useState(false);

  const filteredAgents = agentsData.filter((agent) => {
    const matchesCategory = selectedCategory === "todos" || agent.category === selectedCategory;
    const matchesSearch = agent.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 mb-4">
            Marketplace de Agentes IA
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Potencia tu negocio con nuestros agentes inteligentes especializados en diferentes áreas
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search Bar */}
            <div className="relative flex-1 w-full">
              <input
                type="text"
                placeholder="Buscar agentes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>

            {/* Categories Dropdown */}
            <div className="relative w-full md:w-auto">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full md:w-48 pl-4 pr-8 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent appearance-none"
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
          {categories.filter(cat => cat.id !== "todos").map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center gap-3 p-4 rounded-lg transition-all duration-200 ${
                selectedCategory === category.id
                ? 'bg-gradient-to-r ' + category.gradient + ' text-white shadow-lg scale-105'
                : 'bg-white dark:bg-gray-800 hover:shadow-md'
              }`}
            >
              <category.icon className={`h-6 w-6 ${
                selectedCategory === category.id ? 'text-white' : 'text-gray-600 dark:text-gray-300'
              }`} />
              <span className={selectedCategory === category.id ? 'text-white' : 'text-gray-700 dark:text-gray-200'}>
                {category.name}
              </span>
            </button>
          ))}
        </div>

        {/* Agents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAgents.map((agent) => (
            <div
              key={agent.id}
              className="group bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              <div className={`p-6 bg-gradient-to-r ${agent.gradient} group-hover:scale-105 transition-transform duration-300`}>
                <agent.icon className="w-12 h-12 text-white mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">{agent.title}</h3>
                <p className="text-white/90 text-sm line-clamp-2">{agent.description}</p>
              </div>

              <div className="p-6">
                {/* Features */}
                <ul className="space-y-3 mb-6">
                  {agent.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                      <span className="text-gray-600 dark:text-gray-300 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Price */}
                <div className="flex items-baseline justify-center mb-6">
                  <span className="text-3xl font-bold text-gray-900 dark:text-white">${agent.price}</span>
                  <span className="text-gray-500 dark:text-gray-400 ml-2">/mes</span>
                </div>

                {/* Actions */}
                <div className="space-y-3">
                  <button
                    onClick={() => {
                      if (agent.id === '2') {
                        window.location.href = '/nutrition-agent';
                      } else {
                        window.open(`#/agent/${agent.id}`, '_blank');
                      }
                    }}
                    className="w-full py-2 px-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg font-semibold transition-all duration-200 transform hover:scale-105"
                  >
                    Ver Detalles
                  </button>
                  
                  <button
                    onClick={() => {
                      if (selectedForComparison.includes(agent.id)) {
                        setSelectedForComparison(selectedForComparison.filter(id => id !== agent.id));
                      } else if (selectedForComparison.length < 3) {
                        setSelectedForComparison([...selectedForComparison, agent.id]);
                      }
                    }}
                    className={`w-full py-2 px-4 rounded-lg font-semibold transition-all duration-200 ${
                      selectedForComparison.includes(agent.id)
                        ? 'bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {selectedForComparison.includes(agent.id) ? 'Seleccionado' : 'Comparar'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Comparison Bar */}
        {selectedForComparison.length > 0 && (
          <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 shadow-lg border-t border-gray-200 dark:border-gray-700 p-4 transform transition-transform duration-300">
            <div className="container mx-auto flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-gray-600 dark:text-gray-300">
                  {selectedForComparison.length} {selectedForComparison.length === 1 ? 'agente' : 'agentes'} seleccionado{selectedForComparison.length === 1 ? '' : 's'}
                </span>
                <button
                  onClick={() => setSelectedForComparison([])}
                  className="text-red-500 hover:text-red-600 text-sm"
                >
                  Limpiar selección
                </button>
              </div>
              <button
                onClick={() => setShowComparison(true)}
                disabled={selectedForComparison.length < 2}
                className={`py-2 px-6 rounded-lg font-semibold ${
                  selectedForComparison.length < 2
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-600 hover:to-blue-600'
                }`}
              >
                Comparar Agentes
              </button>
            </div>
          </div>
        )}

        {/* Comparison Modal */}
        {showComparison && (
          <AgentComparison
            agents={selectedForComparison.map(id => agentsData.find(a => a.id === id)!)}
            onClose={() => setShowComparison(false)}
          />
        )}
      </div>
    </div>
  );
};

export default AgentesPage;
