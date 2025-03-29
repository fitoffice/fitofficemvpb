import React from 'react';
import { Target, CheckCircle2, Clock, Lightbulb, ArrowUpRight, Shield, BookOpen, BarChart3, Star, Trophy } from 'lucide-react';

interface SmartGoalPlan {
  smartGoal: string;
  actionPlan: string;
  contingencyPlan: string;
  criteriaBreakdown: {
    Específico: string;
    Medible: string;
    Alcanzable: string;
    Relevante: string;
    Temporal: string;
  };
  milestones: string;
  obstacleStrategies: string;
  resourcePlan: string;
  trackingSystem: string;
}

interface SmartGoalBuilderResponseProps {
  smartGoalPlan: SmartGoalPlan;
}

const SmartGoalBuilderResponse: React.FC<SmartGoalBuilderResponseProps> = ({ smartGoalPlan }) => {
  return (
    <div className="space-y-12 animate-fadeIn p-8 bg-gradient-to-br from-gray-50 to-purple-50 dark:from-gray-900 dark:to-purple-900/20 min-h-screen rounded-3xl">
      {/* Encabezado principal con el objetivo SMART */}
      <div className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 rounded-3xl p-10 shadow-2xl transform hover:scale-[1.01] transition-all duration-500 group">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/10 rounded-full blur-3xl transform group-hover:scale-150 transition-transform duration-700"></div>
        <div className="relative flex items-start gap-6">
          <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-xl shadow-inner">
            <Trophy className="w-10 h-10 text-white" />
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-3xl font-bold text-white">Tu Objetivo SMART</h3>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-300 animate-pulse" />
                <p className="text-purple-100">Personalizado para tu éxito</p>
              </div>
            </div>
            <p className="text-xl text-white/90 leading-relaxed font-medium backdrop-blur-sm bg-white/5 p-4 rounded-xl border border-white/10 shadow-xl">
              {smartGoalPlan.smartGoal}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Plan de Acción */}
        <div className="group bg-white dark:bg-gray-800/50 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 backdrop-blur-xl border border-purple-100/50 dark:border-purple-500/20 transform hover:-translate-y-1">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-900/50 dark:to-indigo-900/50 rounded-2xl shadow-inner group-hover:scale-110 transition-transform duration-500">
              <CheckCircle2 className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            </div>
            <h4 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Plan de Acción
            </h4>
          </div>
          <div className="space-y-4 pl-4 border-l-2 border-purple-100 dark:border-purple-900">
            {smartGoalPlan.actionPlan.split('\n').map((action, index) => (
              <p key={index} className="text-gray-600 dark:text-gray-300 leading-relaxed transform hover:translate-x-2 transition-transform duration-300">
                {action}
              </p>
            ))}
          </div>
        </div>

        {/* Plan de Contingencia */}
        <div className="group bg-white dark:bg-gray-800/50 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 backdrop-blur-xl border border-purple-100/50 dark:border-purple-500/20 transform hover:-translate-y-1">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-900/50 dark:to-indigo-900/50 rounded-2xl shadow-inner group-hover:scale-110 transition-transform duration-500">
              <Shield className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            </div>
            <h4 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Plan de Contingencia
            </h4>
          </div>
          <div className="space-y-4 pl-4 border-l-2 border-purple-100 dark:border-purple-900">
            {smartGoalPlan.contingencyPlan.split('\n').map((plan, index) => (
              <p key={index} className="text-gray-600 dark:text-gray-300 leading-relaxed transform hover:translate-x-2 transition-transform duration-300">
                {plan}
              </p>
            ))}
          </div>
        </div>
      </div>

      {/* Criterios SMART */}
      <div className="bg-white dark:bg-gray-800/50 rounded-3xl p-10 shadow-xl backdrop-blur-xl border border-purple-100/50 dark:border-purple-500/20">
        <h4 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-8 flex items-center gap-3">
          <BookOpen className="w-8 h-8 text-purple-600 dark:text-purple-400" />
          Desglose de Criterios SMART
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Object.entries(smartGoalPlan.criteriaBreakdown).map(([criteria, description], index) => (
            <div
              key={criteria}
              className="group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-indigo-600/20 transform group-hover:scale-105 transition-transform duration-500 rounded-2xl"></div>
              <div className="relative p-6 rounded-2xl bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/30 dark:to-indigo-900/30 backdrop-blur-xl border border-purple-100/50 dark:border-purple-500/20 transform hover:scale-105 transition-all duration-500 hover:shadow-xl">
                <div className="absolute -right-8 -top-8 w-24 h-24 bg-gradient-to-br from-purple-500/10 to-indigo-500/10 rounded-full blur-2xl transform group-hover:scale-150 transition-transform duration-700"></div>
                <h5 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-3">{criteria}</h5>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed relative z-10">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Hitos */}
        <div className="group bg-white dark:bg-gray-800/50 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 backdrop-blur-xl border border-purple-100/50 dark:border-purple-500/20">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-900/50 dark:to-indigo-900/50 rounded-2xl shadow-inner group-hover:scale-110 transition-transform duration-500">
              <Clock className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            </div>
            <h4 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">Hitos</h4>
          </div>
          <div className="space-y-6">
            {smartGoalPlan.milestones.split('\n').map((milestone, index) => (
              <div key={index} className="flex items-start gap-4 group/item">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-900/50 dark:to-indigo-900/50 flex items-center justify-center flex-shrink-0 transform group-hover/item:scale-110 transition-transform duration-300">
                  <span className="text-sm font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">{index + 1}</span>
                </div>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed transform group-hover/item:translate-x-2 transition-transform duration-300">{milestone}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Estrategias para Obstáculos */}
        <div className="group bg-white dark:bg-gray-800/50 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 backdrop-blur-xl border border-purple-100/50 dark:border-purple-500/20">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-900/50 dark:to-indigo-900/50 rounded-2xl shadow-inner group-hover:scale-110 transition-transform duration-500">
              <Lightbulb className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            </div>
            <h4 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Estrategias
            </h4>
          </div>
          <div className="space-y-4">
            {smartGoalPlan.obstacleStrategies.split('\n').map((strategy, index) => (
              <div key={index} className="group/strategy relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-indigo-500/5 transform group-hover/strategy:scale-105 transition-transform duration-500 rounded-xl"></div>
                <div className="relative flex items-start gap-4 p-4 rounded-xl bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/30 dark:to-indigo-900/30 transform hover:translate-x-2 transition-transform duration-300">
                  <ArrowUpRight className="w-6 h-6 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-1" />
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{strategy}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Plan de Recursos y Sistema de Seguimiento */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="group bg-white dark:bg-gray-800/50 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 backdrop-blur-xl border border-purple-100/50 dark:border-purple-500/20">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-900/50 dark:to-indigo-900/50 rounded-2xl shadow-inner group-hover:scale-110 transition-transform duration-500">
              <BookOpen className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            </div>
            <h4 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Plan de Recursos
            </h4>
          </div>
          <div className="prose prose-purple dark:prose-invert max-w-none pl-4 border-l-2 border-purple-100 dark:border-purple-900">
            {smartGoalPlan.resourcePlan.split('\n').map((resource, index) => (
              <p key={index} className="text-gray-600 dark:text-gray-300 leading-relaxed transform hover:translate-x-2 transition-transform duration-300">
                {resource}
              </p>
            ))}
          </div>
        </div>

        <div className="group bg-white dark:bg-gray-800/50 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 backdrop-blur-xl border border-purple-100/50 dark:border-purple-500/20">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-900/50 dark:to-indigo-900/50 rounded-2xl shadow-inner group-hover:scale-110 transition-transform duration-500">
              <BarChart3 className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            </div>
            <h4 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Sistema de Seguimiento
            </h4>
          </div>
          <div className="prose prose-purple dark:prose-invert max-w-none pl-4 border-l-2 border-purple-100 dark:border-purple-900">
            {smartGoalPlan.trackingSystem.split('\n').map((tracking, index) => (
              <p key={index} className="text-gray-600 dark:text-gray-300 leading-relaxed transform hover:translate-x-2 transition-transform duration-300">
                {tracking}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmartGoalBuilderResponse;
