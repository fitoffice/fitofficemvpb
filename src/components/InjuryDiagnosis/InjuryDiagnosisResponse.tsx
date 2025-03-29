import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, Activity, Dumbbell, Shield, X, Clock } from 'lucide-react';

interface DiagnosisData {
  condición?: string;
  recomendaciones?: string;
  ejercicios?: string;
  precauciones?: string;
}

interface DiagnosisResponse {
  timestamp?: string;
  diagnosis?: DiagnosisData;
  status?: string;
  version?: string;
}

interface InjuryDiagnosisResponseProps {
  diagnosis: DiagnosisResponse;
  onClose: () => void;
}

const InjuryDiagnosisResponse: React.FC<InjuryDiagnosisResponseProps> = ({ diagnosis, onClose }) => {
  console.log('InjuryDiagnosisResponse - Props recibidos:', {
    diagnosis: diagnosis,
    tieneData: !!diagnosis,
    tieneDiagnosis: !!diagnosis?.diagnosis,
  });

  const diagnosisData = diagnosis?.diagnosis || {};
  const timestamp = diagnosis?.timestamp || new Date().toISOString();
  const version = diagnosis?.version || '1.0';

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3 }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Header con gradiente y botón de cerrar */}
        <div className="sticky top-0 z-10 bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-t-2xl">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/10 rounded-xl">
                <AlertCircle className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Diagnóstico Médico</h2>
                <p className="text-blue-100 text-sm flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {new Date(timestamp).toLocaleString()}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Condición */}
          {diagnosisData.condición && (
            <motion.div
              variants={itemVariants}
              className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/50 dark:to-blue-800/50 p-6 rounded-2xl border border-blue-200 dark:border-blue-700"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-500 text-white rounded-xl shadow-lg shadow-blue-500/20">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-blue-900 dark:text-blue-100 mb-2">Diagnóstico</h3>
                  <p className="text-blue-800 dark:text-blue-200 leading-relaxed">
                    {diagnosisData.condición}
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Recomendaciones */}
          {diagnosisData.recomendaciones && (
            <motion.div
              variants={itemVariants}
              className="bg-white dark:bg-gray-700 p-6 rounded-2xl border border-gray-200 dark:border-gray-600 shadow-lg"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-indigo-500 text-white rounded-xl shadow-lg shadow-indigo-500/20">
                  <Activity className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Recomendaciones</h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {diagnosisData.recomendaciones}
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Ejercicios */}
          {diagnosisData.ejercicios && (
            <motion.div
              variants={itemVariants}
              className="bg-white dark:bg-gray-700 p-6 rounded-2xl border border-gray-200 dark:border-gray-600 shadow-lg"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-green-500 text-white rounded-xl shadow-lg shadow-green-500/20">
                  <Dumbbell className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Ejercicios Recomendados</h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {diagnosisData.ejercicios}
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Precauciones */}
          {diagnosisData.precauciones && (
            <motion.div
              variants={itemVariants}
              className="bg-white dark:bg-gray-700 p-6 rounded-2xl border border-gray-200 dark:border-gray-600 shadow-lg"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-red-500 text-white rounded-xl shadow-lg shadow-red-500/20">
                  <Shield className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Precauciones</h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {diagnosisData.precauciones}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Footer con versión */}
        <div className="border-t border-gray-200 dark:border-gray-700 p-4 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Versión {version}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default InjuryDiagnosisResponse;
