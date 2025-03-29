import React, { useEffect, useState } from 'react';
import { BarChart2, DollarSign, Target, Settings, Video, Calendar, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface PersonalMarketingGeneratorResponseProps {
  strategy: string;
}

interface BrandingStrategy {
  keyMetrics: {
    YouTube: {
      subscribers: string;
      engagement: string;
      views: string;
    };
  };
  monetizationPlan: {
    description: string;
  };
  nicheAnalysis: {
    description: string;
  };
  optimizationStrategy: {
    description: string;
  };
  contentStrategy: {
    YouTube: {
      description: string;
      frequency: string;
    };
  };
  editorialCalendar: {
    YouTube: {
      suggestedSchedule: string;
      contentPlan: string;
    };
  };
  engagementTactics: {
    YouTube: {
      interaction: string;
    };
  };
}

const PersonalMarketingGeneratorResponse: React.FC<PersonalMarketingGeneratorResponseProps> = ({
  strategy
}) => {
  const [brandingData, setBrandingData] = useState<BrandingStrategy | null>(null);

  useEffect(() => {
    try {
      const data = JSON.parse(strategy);
      console.log('Respuesta completa de la API:', data);

      if (data.brandingStrategy) {
        console.log('Métricas Clave:', data.brandingStrategy.keyMetrics);
        console.log('Plan de Monetización:', data.brandingStrategy.monetizationPlan);
        console.log('Análisis de Nicho:', data.brandingStrategy.nicheAnalysis);
        console.log('Estrategia de Optimización:', data.brandingStrategy.optimizationStrategy);
        console.log('Estrategia de Contenido:', data.brandingStrategy.contentStrategy);
        console.log('Calendario Editorial:', data.brandingStrategy.editorialCalendar);
        console.log('Tácticas de Engagement:', data.brandingStrategy.engagementTactics);
        setBrandingData(data.brandingStrategy);
      }
    } catch (error) {
      console.error('Error al parsear la estrategia:', error);
    }
  }, [strategy]);

  if (!brandingData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-600"></div>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  const CardWrapper: React.FC<{
    icon: React.ReactNode;
    title: string;
    children: React.ReactNode;
    gradient?: string;
  }> = ({ icon, title, children, gradient = "from-violet-500 to-purple-600" }) => (
    <motion.div
      variants={itemVariants}
      className="relative overflow-hidden group"
    >
      <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
        <div className={`absolute inset-0 bg-gradient-to-r ${gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-violet-50 group-hover:bg-violet-100 transition-colors duration-300">
              {icon}
            </div>
            <h2 className="text-xl font-bold text-gray-800 group-hover:text-violet-700 transition-colors duration-300">
              {title}
            </h2>
          </div>
          <div className="bg-violet-50 rounded-xl p-5 group-hover:bg-violet-100 transition-all duration-300">
            {children}
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <motion.div
      className="strategy-container p-6 space-y-6 max-w-7xl mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <CardWrapper
        icon={<Target className="w-6 h-6 text-violet-600" />}
        title="Análisis de Nicho"
        gradient="from-violet-500 to-fuchsia-500"
      >
        <p className="text-gray-700 leading-relaxed">
          {brandingData.nicheAnalysis.description}
        </p>
      </CardWrapper>

      <CardWrapper
        icon={<Video className="w-6 h-6 text-violet-600" />}
        title="Estrategia de Contenido - YouTube"
        gradient="from-violet-500 to-indigo-500"
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <h3 className="font-semibold text-gray-700">Descripción</h3>
            <p className="text-gray-700 leading-relaxed">
              {brandingData.contentStrategy.YouTube.description}
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold text-gray-700">Frecuencia</h3>
            <p className="text-gray-700 leading-relaxed">
              {brandingData.contentStrategy.YouTube.frequency}
            </p>
          </div>
        </div>
      </CardWrapper>

      <CardWrapper
        icon={<Calendar className="w-6 h-6 text-violet-600" />}
        title="Calendario Editorial - YouTube"
        gradient="from-violet-500 to-blue-500"
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <h3 className="font-semibold text-gray-700">Horario Sugerido</h3>
            <p className="text-gray-700 leading-relaxed">
              {brandingData.editorialCalendar.YouTube.suggestedSchedule}
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold text-gray-700">Plan de Contenido</h3>
            <p className="text-gray-700 leading-relaxed">
              {brandingData.editorialCalendar.YouTube.contentPlan}
            </p>
          </div>
        </div>
      </CardWrapper>

      <CardWrapper
        icon={<MessageCircle className="w-6 h-6 text-violet-600" />}
        title="Tácticas de Engagement - YouTube"
        gradient="from-violet-500 to-cyan-500"
      >
        <p className="text-gray-700 leading-relaxed">
          {brandingData.engagementTactics.YouTube.interaction}
        </p>
      </CardWrapper>

      <CardWrapper
        icon={<BarChart2 className="w-6 h-6 text-violet-600" />}
        title="Métricas Clave - YouTube"
        gradient="from-violet-500 to-emerald-500"
      >
        <div className="space-y-4">
          <div className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
            <h3 className="font-semibold text-gray-700 mb-2">Suscriptores</h3>
            <p className="text-gray-700 leading-relaxed">
              {brandingData.keyMetrics.YouTube.subscribers}
            </p>
          </div>
          <div className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
            <h3 className="font-semibold text-gray-700 mb-2">Engagement</h3>
            <p className="text-gray-700 leading-relaxed">
              {brandingData.keyMetrics.YouTube.engagement}
            </p>
          </div>
          <div className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
            <h3 className="font-semibold text-gray-700 mb-2">Vistas</h3>
            <p className="text-gray-700 leading-relaxed">
              {brandingData.keyMetrics.YouTube.views}
            </p>
          </div>
        </div>
      </CardWrapper>

      <CardWrapper
        icon={<DollarSign className="w-6 h-6 text-violet-600" />}
        title="Plan de Monetización"
        gradient="from-violet-500 to-green-500"
      >
        <p className="text-gray-700 leading-relaxed">
          {brandingData.monetizationPlan.description}
        </p>
      </CardWrapper>

      <CardWrapper
        icon={<Settings className="w-6 h-6 text-violet-600" />}
        title="Estrategia de Optimización"
        gradient="from-violet-500 to-yellow-500"
      >
        <p className="text-gray-700 leading-relaxed">
          {brandingData.optimizationStrategy.description}
        </p>
      </CardWrapper>
    </motion.div>
  );
};

export default PersonalMarketingGeneratorResponse;
