import React from 'react';
import { Clock, Coffee, Brain, Activity, Dumbbell, X } from 'lucide-react';

interface OfficeBreaksResponseProps {
  breakPlanData: {
    timestamp?: string;
    status?: string;
    version?: string;
    breakPlan?: {
      activities: {
        [key: string]: {
          nombre: string;
          nivel: string;
          descripcion: string;
          beneficios: string[];
        };
      };
      dailySchedule: {
        mañana: string;
        tarde: string;
      };
      implementationTips: string[];
      motivationStrategies: string[];
      trackingSystem: string;
      variations: {
        [key: string]: {
          Principiantes: string;
          Avanzados: string;
        };
      };
    };
  } | null;
  isVisible: boolean;
  onClose: () => void;
}

const OfficeBreaksResponse: React.FC<OfficeBreaksResponseProps> = ({
  breakPlanData,
  isVisible,
  onClose,
}) => {
  if (!isVisible || !breakPlanData) return null;

  // Logs para cada sección de datos
  console.log('OfficeBreaksResponse - Datos completos:', breakPlanData);
  
  if (breakPlanData.breakPlan) {
    console.log('OfficeBreaksResponse - Actividades:', breakPlanData.breakPlan.activities);
    console.log('OfficeBreaksResponse - Horario diario:', breakPlanData.breakPlan.dailySchedule);
    console.log('OfficeBreaksResponse - Tips de implementación:', breakPlanData.breakPlan.implementationTips);
    console.log('OfficeBreaksResponse - Estrategias de motivación:', breakPlanData.breakPlan.motivationStrategies);
    console.log('OfficeBreaksResponse - Sistema de seguimiento:', breakPlanData.breakPlan.trackingSystem);
    console.log('OfficeBreaksResponse - Variaciones:', breakPlanData.breakPlan.variations);
  }

  return (
    <div className="space-y-6">
      {/* Actividades */}
      {breakPlanData.breakPlan?.activities && (
        <section className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
            <Activity className="w-5 h-5 text-indigo-500" />
            Actividades Recomendadas
          </h3>
          <div className="grid gap-4">
            {Object.values(breakPlanData.breakPlan.activities).map((actividad, index) => (
              <div key={index} className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-lg font-medium text-indigo-600 dark:text-indigo-400">
                    {actividad.nombre}
                  </h4>
                  <span className="px-2 py-1 text-sm bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200 rounded">
                    {actividad.nivel}
                  </span>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-3">
                  {actividad.descripcion}
                </p>
                <div className="space-y-1">
                  <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300">Beneficios:</h5>
                  <ul className="list-disc list-inside space-y-1">
                    {actividad.beneficios.map((beneficio, idx) => (
                      <li key={idx} className="text-sm text-gray-600 dark:text-gray-400">
                        {beneficio}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Horario Diario */}
      {breakPlanData.breakPlan?.dailySchedule && (
        <section className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
            <Clock className="w-5 h-5 text-indigo-500" />
            Horario Diario
          </h3>
          <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow space-y-6">
            {/* Mañana */}
            <div>
              <h4 className="text-xl font-medium text-indigo-600 dark:text-indigo-400 mb-3">
                Mañana
              </h4>
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <p className="text-gray-700 dark:text-gray-300">
                  {breakPlanData.breakPlan.dailySchedule.mañana}
                </p>
              </div>
            </div>

            {/* Tarde */}
            <div>
              <h4 className="text-xl font-medium text-indigo-600 dark:text-indigo-400 mb-3">
                Tarde
              </h4>
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <p className="text-gray-700 dark:text-gray-300">
                  {breakPlanData.breakPlan.dailySchedule.tarde}
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Tips y Estrategias */}
      {breakPlanData.breakPlan?.implementationTips && (
        <section className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
            <Brain className="w-5 h-5 text-indigo-500" />
            Tips y Estrategias
          </h3>
          <div className="space-y-4">
            <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow">
              <h4 className="text-lg font-medium text-indigo-600 dark:text-indigo-400 mb-3">Tips de Implementación</h4>
              <ul className="list-disc list-inside space-y-2">
                {breakPlanData.breakPlan.implementationTips.map((tip, index) => (
                  <li key={index} className="text-gray-600 dark:text-gray-300">
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
            {breakPlanData.breakPlan.motivationStrategies && (
              <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow">
                <h4 className="text-lg font-medium text-indigo-600 dark:text-indigo-400 mb-3">Estrategias de Motivación</h4>
                <ul className="list-disc list-inside space-y-2">
                  {breakPlanData.breakPlan.motivationStrategies.map((strategy, index) => (
                    <li key={index} className="text-gray-600 dark:text-gray-300">
                      {strategy}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {breakPlanData.breakPlan.trackingSystem && (
              <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow">
                <h4 className="text-lg font-medium text-indigo-600 dark:text-indigo-400 mb-3">Sistema de Seguimiento</h4>
                <p className="text-gray-600 dark:text-gray-300">
                  {breakPlanData.breakPlan.trackingSystem}
                </p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Botón para volver al formulario */}
      <div className="flex justify-end mt-6">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Volver al Formulario
        </button>
      </div>
    </div>
  );
};

export default OfficeBreaksResponse;
