import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

interface AudienceAnalyzerResponseProps {
  data: {
    audienceAnalysis: {
      behaviorAnalysis: {
        mainInterests: string[];
        peakSocialMediaTimes: {
          weekdays?: string[];
          weekends?: string[];
        };
        knowledgeLevelFitness: string;
        averageFitnessBudget: string;
      };
      contentPatterns: {
        preferredContentFormat: {
          video: string;
          image: string;
          text: string;
          audio: string;
        };
        engagementWithContent: string[];
      };
      contentRecommendations: {
        TailoredWorkoutPlans: string;
        MotivationalContentSeries: string;
        HealthyRecipeGuides: string;
        ConsistencyChallenges: string;
      };
      demographicProfile: {
        genderDistribution: {
          female?: string;
          male?: string;
        };
        ageRange: string;
        location: {
          urban?: string;
          suburban?: string;
        };
        educationLevel: string;
      };
      engagementStrategies: {
        InteractiveContent: string;
        LiveWorkoutSessions: string;
        CommunityBuilding: string;
        InfluencerCollaborations: string;
      };
      marketOpportunities: {
        unmetNeeds: string[];
        growthPotential: string;
        targetedApproach: string;
      };
      needsAnalysis: {
        mainConcerns: string[];
        transformationGoals: string[];
      };
    };
    status: string;
    timestamp: string;
    version: string;
  };
}

const AudienceAnalyzerResponse: React.FC<AudienceAnalyzerResponseProps> = ({ data }) => {
  useEffect(() => {
    console.log('📊 Datos recibidos en AudienceAnalyzerResponse:', data);
  }, [data]);

  if (!data || !data.audienceAnalysis) {
    console.error('❌ Datos inválidos recibidos:', data);
    return (
      <div className="p-8 text-center">
        <p className="text-red-500">Error: No se pudieron cargar los datos del análisis.</p>
      </div>
    );
  }

  const { audienceAnalysis } = data;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8 p-8 bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl max-w-4xl mx-auto"
    >
      <div className="text-center mb-10">
        <motion.h1
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent pb-2"
        >
          📊 Análisis de Audiencia
        </motion.h1>
      </div>

      {/* Perfil Demográfico */}
      <section className="transform transition-all duration-300 hover:scale-[1.02]">
        <h2 className="text-2xl font-semibold mb-4 text-blue-600 flex items-center gap-2 border-b-2 border-blue-100 pb-2">
          <span className="bg-blue-100 p-2 rounded-lg">👥</span>
          Perfil Demográfico
        </h2>
        <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
          <p className="mb-2"><span className="font-medium">Rango de edad:</span> {audienceAnalysis.demographicProfile.ageRange}</p>
          <p className="mb-2"><span className="font-medium">Nivel educativo:</span> {audienceAnalysis.demographicProfile.educationLevel}</p>
          {audienceAnalysis.demographicProfile.genderDistribution && (
            <p className="mb-2">
              <span className="font-medium">Distribución por género:</span> {' '}
              {audienceAnalysis.demographicProfile.genderDistribution.female && `${audienceAnalysis.demographicProfile.genderDistribution.female} mujeres`}
              {audienceAnalysis.demographicProfile.genderDistribution.male && `, ${audienceAnalysis.demographicProfile.genderDistribution.male} hombres`}
            </p>
          )}
          {audienceAnalysis.demographicProfile.location && (
            <p className="mb-2">
              <span className="font-medium">Ubicación:</span> {' '}
              {audienceAnalysis.demographicProfile.location.urban && `${audienceAnalysis.demographicProfile.location.urban} urbana`}
              {audienceAnalysis.demographicProfile.location.suburban && `, ${audienceAnalysis.demographicProfile.location.suburban} suburbana`}
            </p>
          )}
        </div>
      </section>

      {/* Intereses */}
      <section className="transform transition-all duration-300 hover:scale-[1.02]">
        <h2 className="text-2xl font-semibold mb-4 text-purple-600 flex items-center gap-2 border-b-2 border-purple-100 pb-2">
          <span className="bg-purple-100 p-2 rounded-lg">🎯</span>
          Intereses Principales
        </h2>
        <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {audienceAnalysis.behaviorAnalysis.mainInterests?.map((interest, index) => (
              <div key={index} className="flex items-center gap-2 group">
                <span className="text-purple-500 text-xl transform group-hover:scale-110 transition-transform">•</span>
                <p className="text-lg">{interest}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Horarios Activos */}
      <section className="transform transition-all duration-300 hover:scale-[1.02]">
        <h2 className="text-2xl font-semibold mb-4 text-green-600 flex items-center gap-2 border-b-2 border-green-100 pb-2">
          <span className="bg-green-100 p-2 rounded-lg">⏰</span>
          Horarios de Actividad
        </h2>
        <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
          {audienceAnalysis.behaviorAnalysis.peakSocialMediaTimes?.weekdays && (
            <p className="mb-3"><span className="font-medium">Entre semana:</span> {audienceAnalysis.behaviorAnalysis.peakSocialMediaTimes.weekdays.join(', ')}</p>
          )}
          {audienceAnalysis.behaviorAnalysis.peakSocialMediaTimes?.weekends && (
            <p className="mb-3"><span className="font-medium">Fines de semana:</span> {audienceAnalysis.behaviorAnalysis.peakSocialMediaTimes.weekends.join(', ')}</p>
          )}
          <p className="mb-3"><span className="font-medium">Nivel de conocimiento:</span> {audienceAnalysis.behaviorAnalysis.knowledgeLevelFitness}</p>
          <p><span className="font-medium">Presupuesto promedio:</span> {audienceAnalysis.behaviorAnalysis.averageFitnessBudget}</p>
        </div>
      </section>

      {/* Engagement Preferido */}
      <section className="transform transition-all duration-300 hover:scale-[1.02]">
        <h2 className="text-2xl font-semibold mb-4 text-yellow-600 flex items-center gap-2 border-b-2 border-yellow-100 pb-2">
          <span className="bg-yellow-100 p-2 rounded-lg">📈</span>
          Contenido con Mayor Engagement
        </h2>
        <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
          <div className="space-y-3">
            {audienceAnalysis.contentPatterns.engagementWithContent?.map((content, index) => (
              <div key={index} className="flex items-center gap-2 group">
                <span className="text-yellow-500 text-xl transform group-hover:scale-110 transition-transform">•</span>
                <p className="text-lg">{content}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Formato de Contenido */}
      <section className="transform transition-all duration-300 hover:scale-[1.02]">
        <h2 className="text-2xl font-semibold mb-4 text-indigo-600 flex items-center gap-2 border-b-2 border-indigo-100 pb-2">
          <span className="bg-indigo-100 p-2 rounded-lg">🎥</span>
          Formato de Contenido Preferido
        </h2>
        <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-indigo-50 rounded-lg">
              <p className="font-medium text-indigo-600">Video</p>
              <p className="text-2xl font-bold text-indigo-700">{audienceAnalysis.contentPatterns.preferredContentFormat.video}</p>
            </div>
            <div className="text-center p-4 bg-pink-50 rounded-lg">
              <p className="font-medium text-pink-600">Imagen</p>
              <p className="text-2xl font-bold text-pink-700">{audienceAnalysis.contentPatterns.preferredContentFormat.image}</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="font-medium text-green-600">Texto</p>
              <p className="text-2xl font-bold text-green-700">{audienceAnalysis.contentPatterns.preferredContentFormat.text}</p>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <p className="font-medium text-yellow-600">Audio</p>
              <p className="text-2xl font-bold text-yellow-700">{audienceAnalysis.contentPatterns.preferredContentFormat.audio}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Recomendaciones de Contenido */}
      <section className="transform transition-all duration-300 hover:scale-[1.02]">
        <h2 className="text-2xl font-semibold mb-4 text-pink-600 flex items-center gap-2 border-b-2 border-pink-100 pb-2">
          <span className="bg-pink-100 p-2 rounded-lg">💡</span>
          Recomendaciones de Contenido
        </h2>
        <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 bg-gradient-to-br from-pink-50 to-purple-50 rounded-lg">
              <h3 className="font-semibold text-pink-700 mb-2">Planes de Entrenamiento</h3>
              <p>{audienceAnalysis.contentRecommendations.TailoredWorkoutPlans}</p>
            </div>
            <div className="p-4 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg">
              <h3 className="font-semibold text-purple-700 mb-2">Series Motivacionales</h3>
              <p>{audienceAnalysis.contentRecommendations.MotivationalContentSeries}</p>
            </div>
            <div className="p-4 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-lg">
              <h3 className="font-semibold text-indigo-700 mb-2">Guías Nutricionales</h3>
              <p>{audienceAnalysis.contentRecommendations.HealthyRecipeGuides}</p>
            </div>
            <div className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg">
              <h3 className="font-semibold text-blue-700 mb-2">Retos de Consistencia</h3>
              <p>{audienceAnalysis.contentRecommendations.ConsistencyChallenges}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Estrategias de Engagement */}
      <section className="transform transition-all duration-300 hover:scale-[1.02]">
        <h2 className="text-2xl font-semibold mb-4 text-cyan-600 flex items-center gap-2 border-b-2 border-cyan-100 pb-2">
          <span className="bg-cyan-100 p-2 rounded-lg">🤝</span>
          Estrategias de Engagement
        </h2>
        <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-cyan-50 rounded-lg">
              <h3 className="font-semibold text-cyan-700 mb-2">Contenido Interactivo</h3>
              <p>{audienceAnalysis.engagementStrategies.InteractiveContent}</p>
            </div>
            <div className="p-4 bg-teal-50 rounded-lg">
              <h3 className="font-semibold text-teal-700 mb-2">Sesiones en Vivo</h3>
              <p>{audienceAnalysis.engagementStrategies.LiveWorkoutSessions}</p>
            </div>
            <div className="p-4 bg-emerald-50 rounded-lg">
              <h3 className="font-semibold text-emerald-700 mb-2">Construcción de Comunidad</h3>
              <p>{audienceAnalysis.engagementStrategies.CommunityBuilding}</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <h3 className="font-semibold text-green-700 mb-2">Colaboraciones</h3>
              <p>{audienceAnalysis.engagementStrategies.InfluencerCollaborations}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Información Adicional */}
      <section className="transform transition-all duration-300 hover:scale-[1.02]">
        <h2 className="text-2xl font-semibold mb-4 text-gray-600 flex items-center gap-2 border-b-2 border-gray-100 pb-2">
          <span className="bg-gray-100 p-2 rounded-lg">ℹ️</span>
          Información Adicional
        </h2>
        <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Oportunidades de Mercado</h3>
              <p className="mb-2"><span className="font-medium">Potencial de crecimiento:</span> {audienceAnalysis.marketOpportunities.growthPotential}</p>
              <p><span className="font-medium">Enfoque objetivo:</span> {audienceAnalysis.marketOpportunities.targetedApproach}</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Necesidades no Cubiertas</h3>
              <div className="space-y-2">
                {audienceAnalysis.marketOpportunities.unmetNeeds?.map((need, index) => (
                  <p key={index} className="flex items-center gap-2">
                    <span className="text-gray-500">•</span>
                    {need}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Metadata */}
      <div className="text-center text-sm text-gray-500 mt-8">
        <p>Versión: {data.version} | Generado: {new Date(data.timestamp).toLocaleString()}</p>
      </div>
    </motion.div>
  );
};

export default AudienceAnalyzerResponse;
