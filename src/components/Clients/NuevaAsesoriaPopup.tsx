// NuevaAsesoriaPopup.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface NuevaAsesoriaPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (newService: any) => void;
  isDarkMode: boolean;
}

interface FormData {
  nombre: string;
  descripcion: string;
  tipo: string;
  serviciosAdicionales: ('Pack de Citas' | 'Planificacion' | 'Dietas')[];
}

const NuevaAsesoriaPopup: React.FC<NuevaAsesoriaPopupProps> = ({ isOpen, onClose, onAdd, isDarkMode }) => {
  const [formData, setFormData] = useState<FormData>({
    nombre: '',
    descripcion: '',
    tipo: 'Asesoría Individual',
    serviciosAdicionales: []
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleServicioAdicionalChange = (servicio: 'Pack de Citas' | 'Planificacion' | 'Dietas') => {
    setFormData(prev => {
      const servicios = prev.serviciosAdicionales.includes(servicio)
        ? prev.serviciosAdicionales.filter(s => s !== servicio)
        : [...prev.serviciosAdicionales, servicio];
      return { ...prev, serviciosAdicionales: servicios };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Instead of making an API call here, just pass the form data to the parent component
      onAdd({
        ...formData,
        fechaCreacion: new Date().toISOString()
      });
      onClose();
    } catch (error) {
      console.error('Error al crear la asesoría:', error);
      setError(error instanceof Error ? error.message : 'Error al crear la asesoría');
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm">
          <div className="min-h-screen px-4 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`bg-white dark:bg-gray-800 w-full max-w-4xl rounded-2xl shadow-2xl transform transition-all`}
            >
              {/* Header */}
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center">
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                    Nueva Asesoría Individual
                  </h3>
                  <button
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    onClick={onClose}
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {error && (
                  <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
                    <p className="font-medium">Error</p>
                    <p>{error}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Nombre Field */}
                  <div>
                    <label htmlFor="nombre" className="block text-sm font-semibold mb-2">
                      Nombre
                    </label>
                    <input
                      type="text"
                      id="nombre"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleChange}
                      required
                      placeholder="Nombre de la asesoría"
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                               focus:ring-2 focus:ring-blue-500 focus:border-transparent
                               dark:bg-gray-700 dark:text-white transition-colors"
                    />
                  </div>

                  {/* Descripción Field */}
                  <div>
                    <label htmlFor="descripcion" className="block text-sm font-semibold mb-2">
                      Descripción
                    </label>
                    <textarea
                      id="descripcion"
                      name="descripcion"
                      value={formData.descripcion}
                      onChange={handleChange}
                      rows={3}
                      placeholder="Describe la asesoría"
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600
                               focus:ring-2 focus:ring-blue-500 focus:border-transparent
                               dark:bg-gray-700 dark:text-white transition-colors"
                    />
                  </div>

                  {/* Servicios Adicionales Field */}
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Servicios Adicionales
                    </label>
                    <div className="grid grid-cols-3 gap-4">
                      {(['Pack de Citas', 'Planificacion', 'Dietas'] as const).map((servicio) => (
                        <label
                          key={servicio}
                          className={`flex items-center p-3 rounded-lg border ${
                            formData.serviciosAdicionales.includes(servicio)
                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                              : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                          } cursor-pointer transition-colors`}
                        >
                          <input
                            type="checkbox"
                            checked={formData.serviciosAdicionales.includes(servicio)}
                            onChange={() => handleServicioAdicionalChange(servicio)}
                            className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <span className={`text-sm ${
                            formData.serviciosAdicionales.includes(servicio)
                              ? 'text-blue-600 dark:text-blue-400 font-medium'
                              : 'text-gray-700 dark:text-gray-300'
                          }`}>
                            {servicio}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-4">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-6 py-2 rounded-lg font-medium transition-colors
                               bg-gray-100 hover:bg-gray-200 text-gray-700
                               dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="px-6 py-2 rounded-lg font-medium text-white 
                               bg-gradient-to-r from-blue-600 to-blue-400 
                               hover:from-blue-700 hover:to-blue-500 transition-all
                               disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <span className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Creando...
                        </span>
                      ) : (
                        'Crear Asesoría'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default NuevaAsesoriaPopup;