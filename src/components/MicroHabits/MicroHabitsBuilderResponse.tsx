import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

interface MicroHabitsBuilderResponseProps {
  data: {
    habitPlan: {
      studentProfile: {
        name: string;
        level: string;
      };
      habitAnalysis: {
        habitName: string;
        category: string;
        frequency: string;
        initialDuration: string;
        trigger: string;
        reminderMethods: string[];
      };
      implementationPlan: any;
      adaptationStrategies: {
        strategy1: string;
        strategy2: string;
        strategy3: string;
      };
      successMetrics: any;
      trackingSystem: {
        progressApp: string;
        supportStrategy: string;
      };
      coachGuide: {
        tips: string[];
      };
      contingencyPlan: {
        plan: string;
      };
    };
  };
}

const MicroHabitsBuilderResponse: React.FC<MicroHabitsBuilderResponseProps> = ({ data }) => {
  useEffect(() => {
    console.log('📥 Datos recibidos en MicroHabitsBuilderResponse:', {
      rawData: data,
      habitPlan: data.habitPlan,
      studentProfile: data.habitPlan?.studentProfile,
      habitAnalysis: data.habitPlan?.habitAnalysis,
      implementationPlan: data.habitPlan?.implementationPlan,
      adaptationStrategies: data.habitPlan?.adaptationStrategies,
      successMetrics: data.habitPlan?.successMetrics,
      trackingSystem: data.habitPlan?.trackingSystem,
      coachGuide: data.habitPlan?.coachGuide,
      contingencyPlan: data.habitPlan?.contingencyPlan
    });
  }, [data]);

  const { habitPlan } = data;
  const {
    studentProfile,
    habitAnalysis,
    implementationPlan,
    adaptationStrategies,
    successMetrics,
    trackingSystem,
    coachGuide,
    contingencyPlan
  } = habitPlan;

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
          🎯 Plan de Micro-Hábito: {habitAnalysis.habitName || 'No especificado'}
        </motion.h1>
      </div>

      <section className="transform transition-all duration-300 hover:scale-[1.02]">
        <h2 className="text-2xl font-semibold mb-4 text-indigo-600 flex items-center gap-2 border-b-2 border-indigo-100 pb-2">
          <span className="bg-indigo-100 p-2 rounded-lg">👤</span>
          Perfil del Alumno
        </h2>
        <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
          <p className="text-lg"><span className="font-medium text-indigo-600">Nombre:</span> {studentProfile.name || 'No especificado'}</p>
          <p className="text-lg mt-2"><span className="font-medium text-indigo-600">Nivel actual:</span> {studentProfile.level || 'No especificado'}</p>
        </div>
      </section>

      <section className="transform transition-all duration-300 hover:scale-[1.02]">
        <h2 className="text-2xl font-semibold mb-4 text-blue-600 flex items-center gap-2 border-b-2 border-blue-100 pb-2">
          <span className="bg-blue-100 p-2 rounded-lg">📋</span>
          Detalles del Hábito
        </h2>
        <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <p className="text-lg"><span className="font-medium text-blue-600">Hábito:</span> {habitAnalysis.habitName || 'No especificado'}</p>
            <p className="text-lg"><span className="font-medium text-blue-600">Categoría:</span> {habitAnalysis.category || 'No especificado'}</p>
            <p className="text-lg"><span className="font-medium text-blue-600">Frecuencia:</span> {habitAnalysis.frequency || 'No especificado'}</p>
            <p className="text-lg"><span className="font-medium text-blue-600">Duración inicial:</span> {habitAnalysis.initialDuration || 'No especificado'}</p>
            <p className="text-lg col-span-2"><span className="font-medium text-blue-600">Disparador:</span> {habitAnalysis.trigger || 'No especificado'}</p>
          </div>
        </div>
      </section>

      <section className="transform transition-all duration-300 hover:scale-[1.02]">
        <h2 className="text-2xl font-semibold mb-4 text-orange-600 flex items-center gap-2 border-b-2 border-orange-100 pb-2">
          <span className="bg-orange-100 p-2 rounded-lg">🔄</span>
          Plan de Contingencia
        </h2>
        <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
          <div className="flex items-start gap-3">
            <span className="text-orange-500 text-xl mt-1">⚡</span>
            <p className="text-lg flex-1">{contingencyPlan?.plan || 'No especificado'}</p>
          </div>
        </div>
      </section>

      <section className="transform transition-all duration-300 hover:scale-[1.02]">
        <h2 className="text-2xl font-semibold mb-4 text-red-600 flex items-center gap-2 border-b-2 border-red-100 pb-2">
          <span className="bg-red-100 p-2 rounded-lg">💪</span>
          Estrategias de Adaptación
        </h2>
        <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 space-y-4">
          {adaptationStrategies && (
            <>
              <div className="flex items-start gap-3 group">
                <span className="text-red-500 font-semibold text-lg px-3 py-1 bg-red-50 rounded-full group-hover:bg-red-100 transition-colors">1</span>
                <p className="text-lg flex-1">{adaptationStrategies.strategy1 || 'No especificado'}</p>
              </div>
              <div className="flex items-start gap-3 group">
                <span className="text-red-500 font-semibold text-lg px-3 py-1 bg-red-50 rounded-full group-hover:bg-red-100 transition-colors">2</span>
                <p className="text-lg flex-1">{adaptationStrategies.strategy2 || 'No especificado'}</p>
              </div>
              <div className="flex items-start gap-3 group">
                <span className="text-red-500 font-semibold text-lg px-3 py-1 bg-red-50 rounded-full group-hover:bg-red-100 transition-colors">3</span>
                <p className="text-lg flex-1">{adaptationStrategies.strategy3 || 'No especificado'}</p>
              </div>
            </>
          )}
        </div>
      </section>

      <section className="transform transition-all duration-300 hover:scale-[1.02]">
        <h2 className="text-2xl font-semibold mb-4 text-pink-600 flex items-center gap-2 border-b-2 border-pink-100 pb-2">
          <span className="bg-pink-100 p-2 rounded-lg">👨‍🏫</span>
          Guía para el Coach
        </h2>
        <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 space-y-4">
          {coachGuide?.tips?.map((tip, index) => (
            <div key={index} className="flex items-start gap-3 group">
              <span className="text-pink-500 text-xl mt-1 transform group-hover:scale-110 transition-transform">•</span>
              <p className="text-lg flex-1">{tip}</p>
            </div>
          ))}
        </div>
      </section>
    </motion.div>
  );
};

export default MicroHabitsBuilderResponse;
