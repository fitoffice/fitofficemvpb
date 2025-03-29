import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { motion } from 'framer-motion';
import ToolCard from '../../components/ToolCard';

const AIToolsPage: React.FC = () => {
  const { theme } = useTheme();

  const tools = [
    {
      title: "Generador de Planes Exprés",
      description: "Crea planes de entrenamiento rápidos y efectivos",
      features: ["Personalización", "Objetivos específicos", "Rutinas rápidas"],
      color: "emerald" as const,
      icon: (
        <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      onOpen: () => console.log("Opening Generador de Planes")
    },
    {
      title: "Diagnóstico de Lesiones y Adaptaciones",
      description: "Analiza y adapta entrenamientos según lesiones",
      features: ["Evaluación", "Recomendaciones", "Ejercicios alternativos"],
      color: "red" as const,
      icon: (
        <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      onOpen: () => console.log("Opening Diagnóstico")
    },
    {
      title: "Guía de Estilo de Vida y Hábitos Diarios",
      description: "Optimiza tus hábitos diarios para mejor rendimiento",
      features: ["Rutinas diarias", "Nutrición", "Descanso"],
      color: "teal" as const,
      icon: (
        <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
      onOpen: () => console.log("Opening Guía de Estilo")
    },
    {
      title: "Planificador de Estrategias para Superar Estancamientos",
      description: "Supera mesetas en tu rendimiento",
      features: ["Análisis", "Soluciones", "Seguimiento"],
      color: "blue" as const,
      icon: (
        <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      onOpen: () => console.log("Opening Planificador")
    },
    {
      title: "Constructor de Metas SMART",
      description: "Define objetivos específicos y alcanzables",
      features: ["Específico", "Medible", "Alcanzable"],
      color: "purple" as const,
      icon: (
        <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
      onOpen: () => console.log("Opening Constructor SMART")
    },
    {
      title: "Creador de Contenido en Redes Sociales",
      description: "Genera contenido atractivo para redes sociales",
      features: ["Posts", "Stories", "Reels"],
      color: "pink" as const,
      icon: (
        <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      onOpen: () => console.log("Opening Creador de Contenido")
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`min-h-screen p-8 ${
        theme === 'dark' 
          ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white' 
          : 'bg-gradient-to-br from-gray-50 via-white to-gray-50 text-gray-800'
      } shadow-lg`}
    >
      <div className="max-w-7xl mx-auto">
        <motion.h2 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-4xl font-bold mb-8 text-center relative">
          <span className={`absolute -z-10 blur-2xl opacity-20 animate-pulse ${
            theme === 'dark' ? 'bg-blue-500' : 'bg-blue-200'
          } w-full h-full rounded-full`}></span>
          Herramientas de IA
        </motion.h2>
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-4">
          {tools.map((tool, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 * index, duration: 0.5 }}
            >
              <ToolCard {...tool} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AIToolsPage;
