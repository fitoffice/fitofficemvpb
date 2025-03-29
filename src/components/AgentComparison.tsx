import React from 'react';
import { X } from 'lucide-react';
import { Agent } from '../types/Agent';

interface AgentComparisonProps {
  agents: Agent[];
  onClose: () => void;
  onRemoveAgent: (agentId: string) => void;
}

const AgentComparison: React.FC<AgentComparisonProps> = ({
  agents,
  onClose,
  onRemoveAgent,
}) => {
  console.log('AgentComparison rendered with agents:', agents); // Debug

  // Verificar que tengamos agentes válidos
  if (!agents || agents.length < 2) {
    console.log('Not enough agents for comparison'); // Debug
    return null;
  }

  // Obtener todas las características únicas de todos los agentes
  const allFeatures = Array.from(
    new Set(agents.flatMap(agent => agent.features || []))
  );

  console.log('All features:', allFeatures); // Debug

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-auto">
        <div className="sticky top-0 bg-white dark:bg-gray-800 p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            Comparación de Agentes ({agents.length})
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid" style={{ gridTemplateColumns: `200px repeat(${agents.length}, 1fr)` }}>
            {/* Headers */}
            <div className="col-span-1">
              <div className="h-24"></div> {/* Espacio para alinear con las tarjetas */}
              <div className="space-y-4">
                <div className="font-semibold text-gray-800 dark:text-white p-4">Precio</div>
                <div className="font-semibold text-gray-800 dark:text-white p-4">Características</div>
                {allFeatures.map((feature, index) => (
                  <div key={index} className="p-4 text-gray-600 dark:text-gray-300">
                    {feature}
                  </div>
                ))}
              </div>
            </div>

            {/* Agent Columns */}
            {agents.map((agent) => (
              <div key={agent.id} className="col-span-1">
                <div className="relative">
                  <button
                    onClick={() => onRemoveAgent(agent.id)}
                    className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <div className={`p-4 rounded-xl bg-gradient-to-r ${agent.gradient}`}>
                    <div className="flex items-center justify-center mb-2">
                      <agent.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-white text-center">
                      {agent.title}
                    </h3>
                  </div>
                </div>

                <div className="space-y-4 mt-4">
                  <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <span className="text-2xl font-bold text-gray-800 dark:text-white">
                      {agent.price}€
                    </span>
                    <span className="text-gray-500 dark:text-gray-400">/mes</span>
                  </div>
                  
                  <div className="p-4"></div> {/* Espacio para "Características" */}
                  
                  {/* Features Comparison */}
                  {allFeatures.map((feature, index) => (
                    <div
                      key={index}
                      className="p-4 text-center"
                    >
                      {agent.features.includes(feature) ? (
                        <span className="inline-flex items-center justify-center w-6 h-6 bg-green-500 rounded-full">
                          <svg
                            className="w-4 h-4 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </span>
                      ) : (
                        <span className="inline-flex items-center justify-center w-6 h-6 bg-gray-300 dark:bg-gray-600 rounded-full">
                          <svg
                            className="w-4 h-4 text-gray-500 dark:text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentComparison;
