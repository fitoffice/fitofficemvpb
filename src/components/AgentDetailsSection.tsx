import React from 'react';
import { Settings, Link, Trophy, Activity } from 'lucide-react';
import { Agent } from '../types/Agent';

interface AgentDetailsSectionProps {
  agent: Agent;
}

const AgentDetailsSection: React.FC<AgentDetailsSectionProps> = ({ agent }) => {
  return (
    <div className="mt-6 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg animate-fade-in space-y-8 border border-gray-100 dark:border-gray-700">
      {/* Características Detalladas */}
      <div>
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
          <Settings className="w-5 h-5 mr-2 text-blue-500" />
          Características Detalladas
        </h3>
        <div className="grid gap-4">
          {agent.detailedFeatures.map((feature, index) => {
            const FeatureIcon = feature.icon;
            return (
              <div
                key={index}
                className="flex items-start gap-4 p-4 rounded-lg bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700/50 dark:to-gray-800/50 hover:shadow-md transition-all duration-300"
              >
                <div className={`flex-shrink-0 p-2 rounded-lg bg-gradient-to-r ${agent.gradient}`}>
                  <FeatureIcon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 dark:text-white mb-1">
                    {feature.title}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Integraciones */}
      <div>
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
          <Link className="w-5 h-5 mr-2 text-blue-500" />
          Integraciones
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {agent.integrations.map((integration, index) => (
            <div
              key={index}
              className="flex items-center gap-4 p-4 rounded-lg bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700/50 dark:to-gray-800/50 hover:shadow-md transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-lg bg-white dark:bg-gray-700 p-2 shadow-sm">
                <img
                  src={integration.icon}
                  alt={integration.name}
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 dark:text-white mb-1">
                  {integration.name}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {integration.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Casos de Éxito */}
      <div>
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
          <Trophy className="w-5 h-5 mr-2 text-blue-500" />
          Casos de Éxito
        </h3>
        <div className="grid gap-4">
          {agent.caseStudies.map((study, index) => {
            const StudyIcon = study.icon;
            return (
              <div
                key={index}
                className="p-4 rounded-lg bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700/50 dark:to-gray-800/50 hover:shadow-md transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className={`p-2 rounded-lg bg-gradient-to-r ${agent.gradient}`}>
                    <StudyIcon className="w-5 h-5 text-white" />
                  </div>
                  <h4 className="font-semibold text-gray-800 dark:text-white">
                    {study.title}
                  </h4>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                  {study.description}
                </p>
                <div className={`text-lg font-bold bg-gradient-to-r ${agent.gradient} bg-clip-text text-transparent`}>
                  {study.metric}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Demostración Visual */}
      <div>
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
          <Activity className="w-5 h-5 mr-2 text-blue-500" />
          Demostración Visual
        </h3>
        <div className="grid grid-cols-2 gap-4">
          {agent.demoImages.map((image, index) => (
            <div key={index} className="group relative overflow-hidden rounded-lg">
              <img
                src={image}
                alt={`Demo ${index + 1}`}
                className="w-full h-48 object-cover transform transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                <span className="text-white text-sm font-medium">Vista previa {index + 1}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AgentDetailsSection;
