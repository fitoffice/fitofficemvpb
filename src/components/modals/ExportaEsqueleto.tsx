import React, { useState, useEffect } from 'react';
import Modal from '../Common/Modal';
import Button from '../Common/Button';
import { useTheme } from '../../contexts/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Calendar, Dumbbell, Target } from 'lucide-react';

interface PlanningSchema {
  _id: string;
  nombre: string;
  descripcion: string;
  meta: string;
  tipo: string;
  fechaInicio: string;
}

interface ExportaEsqueletoProps {
  open: boolean;
  onClose: () => void;
  onExport: (selectedPlannings: string[]) => void;
}

const ExportaEsqueleto: React.FC<ExportaEsqueletoProps> = ({
  open,
  onClose,
  onExport,
}) => {
  const { theme } = useTheme();
  const [plannings, setPlannings] = useState<PlanningSchema[]>([]);
  const [selectedPlannings, setSelectedPlannings] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlannings = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No se encontró el token de autenticación');
        }

        const response = await fetch('https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/plannings/schemas', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Error al cargar las planificaciones');
        }

        const data = await response.json();
        setPlannings(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    if (open) {
      fetchPlannings();
    }
  }, [open]);

  const handleExport = () => {
    onExport(selectedPlannings);
    onClose();
  };

  const handleSelectPlanning = (id: string) => {
    setSelectedPlannings(prev => 
      prev.includes(id) 
        ? prev.filter(planningId => planningId !== id)
        : [...prev, id]
    );
  };

  return (
    <Modal
      isOpen={open}
      onClose={onClose}
      title="Seleccionar Planificaciones"
      size="2xl"
    >
      <div className="space-y-6 min-h-[600px] p-6">
        {loading ? (
          <div className="flex items-center justify-center h-[500px]">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className={`w-12 h-12 border-4 border-t-transparent rounded-full ${
                theme === 'dark' ? 'border-blue-400 shadow-lg shadow-blue-500/20' : 'border-blue-600 shadow-lg shadow-blue-500/10'
              }`}
            />
          </div>
        ) : error ? (
          <div className={`flex items-center justify-center h-[500px] p-8 ${
            theme === 'dark' ? 'bg-red-900/20' : 'bg-red-50'
          } rounded-2xl border-2 ${theme === 'dark' ? 'border-red-800' : 'border-red-200'}`}>
            <p className="text-red-500 text-xl font-medium">{error}</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-6 max-h-[560px] overflow-y-auto px-3 py-4">
            <AnimatePresence>
              {plannings.map((planning) => (
                <motion.div
                  key={planning._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  onClick={() => handleSelectPlanning(planning._id)}
                  className={`relative p-6 rounded-2xl cursor-pointer transition-all duration-300 border-2 hover:shadow-xl transform hover:-translate-y-1 ${
                    selectedPlannings.includes(planning._id)
                      ? theme === 'dark'
                        ? 'border-blue-500 bg-blue-500/10 shadow-blue-500/30'
                        : 'border-blue-500 bg-blue-50 shadow-blue-300/30'
                      : theme === 'dark'
                      ? 'border-gray-700 hover:border-gray-600 bg-gray-800/50 hover:bg-gray-800/70'
                      : 'border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50'
                  }`}
                >
                  {selectedPlannings.includes(planning._id) && (
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-4 right-4"
                    >
                      <div className="bg-blue-500 rounded-full p-1">
                        <Check className="w-5 h-5 text-white" />
                      </div>
                    </motion.div>
                  )}
                  
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className={`p-3.5 rounded-2xl ${
                        theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                      } ${selectedPlannings.includes(planning._id) ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-gray-900' : ''}`}>
                        {planning.tipo === 'Planificacion' ? (
                          <Calendar className={`w-7 h-7 ${
                            theme === 'dark' ? 'text-blue-400' : 'text-blue-500'
                          }`} />
                        ) : (
                          <Dumbbell className={`w-7 h-7 ${
                            theme === 'dark' ? 'text-purple-400' : 'text-purple-500'
                          }`} />
                        )}
                      </div>
                      <div className="flex-1 space-y-2">
                        <h4 className={`font-semibold text-xl ${
                          theme === 'dark' ? 'text-gray-200' : 'text-gray-900'
                        }`}>
                          {planning.nombre}
                        </h4>
                        <p className={`text-sm leading-relaxed ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          {planning.descripcion || 'Sin descripción'}
                        </p>
                      </div>
                    </div>
                    
                    <div className={`flex items-center gap-3 text-sm p-3 rounded-xl ${
                      theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'
                    } backdrop-blur-sm`}>
                      <Target className={`w-5 h-5 ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                      }`} />
                      <span className={`font-medium ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                      }`}>
                        {planning.meta || 'Sin meta definida'}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        <div className="flex justify-end gap-4 pt-6 mt-4 border-t border-gray-200 dark:border-gray-700">
          <Button
            variant="secondary"
            onClick={onClose}
            className="px-8 py-2.5 text-base"
          >
            Cancelar
          </Button>
          <Button
            variant="primary"
            onClick={handleExport}
            disabled={selectedPlannings.length === 0}
            className="px-8 py-2.5 text-base"
          >
            Exportar {selectedPlannings.length > 0 && `(${selectedPlannings.length})`}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ExportaEsqueleto;
