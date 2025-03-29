import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Utensils, Calendar, Target, AlertTriangle, Ban, Heart, Clock, Pill, Activity, X, Loader2 } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface CrearDietasPopupProps {
  onClose: () => void;
  onDietCreated: () => void;
}

interface ClienteBasico {
  _id: string;
  nombre: string;
}

const CrearDietasPopup: React.FC<CrearDietasPopupProps> = ({ onClose, onDietCreated }) => {
  const { theme } = useTheme();
  const [currentSection, setCurrentSection] = useState(0);
  const [nombre, setNombre] = useState('');
  const [clienteId, setClienteId] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [objetivo, setObjetivo] = useState('');
  const [alergiasIntolerancias, setAlergiasIntolerancias] = useState('');
  const [alimentosProhibidos, setAlimentosProhibidos] = useState('');
  const [alimentosPreferidos, setAlimentosPreferidos] = useState('');
  const [horariosComidas, setHorariosComidas] = useState('');
  const [suplementosRecomendados, setSuplementosRecomendados] = useState('');
  
  const [clients, setClients] = useState<ClienteBasico[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const objetivos = [
    "Pérdida de peso",
    "Ganancia muscular",
    "Mantenimiento de peso",
    "Mejora del rendimiento deportivo",
    "Mejora de la salud general",
    "Aumento de la energía",
    "Control de enfermedades",
    "Mejora de la digestión",
    "Reducción de la grasa corporal",
    "Detoxificación",
    "Aumento de la masa corporal",
    "Preparación para competencias",
    "Rehabilitación y recuperación",
    "Otro"
  ];

  const formulasMetabolicas = [
    {
      nombre: "Harris-Benedict (1919)",
      descripcion: "Fácil de usar, ampliamente utilizada en la población general",
      formula: "formula-harris-benedict"
    },
    {
      nombre: "Mifflin-St Jeor (1990)",
      descripcion: "Más precisa que Harris-Benedict, usada en estudios actuales",
      formula: "formula-mifflin"
    },
    {
      nombre: "Katch-McArdle (1983)",
      descripcion: "Considera la masa magra, más precisa para personas con mayor musculatura",
      formula: "formula-katch"
    },
    {
      nombre: "Cunningham (1980)",
      descripcion: "Ideal para deportistas de alto rendimiento",
      formula: "formula-cunningham"
    },
    {
      nombre: "Owen (1986)",
      descripcion: "Simple y rápida de calcular",
      formula: "formula-owen"
    }
  ];

  const [formulaSeleccionada, setFormulaSeleccionada] = useState('');

  const sections = [
    {
      title: "Información Básica",
      icon: Utensils,
      fields: [
        {
          label: "Nombre de la dieta",
          value: nombre,
          onChange: setNombre,
          type: "text",
          required: true,
          placeholder: "Ej: Dieta Mediterránea Personalizada"
        },
        {
          label: "Cliente",
          value: clienteId,
          onChange: setClienteId,
          type: "select",
          options: clients,
          required: true
        },
        {
          label: "Fecha de inicio",
          value: fechaInicio,
          onChange: setFechaInicio,
          type: "date",
          required: true
        }
      ]
    },
    {
      title: "Objetivos y Restricciones",
      icon: Target,
      fields: [
        {
          label: "Objetivo principal",
          value: objetivo,
          onChange: setObjetivo,
          type: "select",
          options: objetivos,
          required: true,
          isObjectiveSelect: true
        },
        {
          label: "Alergias e intolerancias",
          value: alergiasIntolerancias,
          onChange: setAlergiasIntolerancias,
          type: "text",
          placeholder: "Ej: lactosa, gluten, frutos secos"
        }
      ]
    },
    {
      title: "Preferencias Alimentarias",
      icon: Heart,
      fields: [
        {
          label: "Alimentos prohibidos",
          value: alimentosProhibidos,
          onChange: setAlimentosProhibidos,
          type: "text",
          placeholder: "Ej: azúcar refinado, carne roja"
        },
        {
          label: "Alimentos preferidos",
          value: alimentosPreferidos,
          onChange: setAlimentosPreferidos,
          type: "text",
          placeholder: "Ej: pescado, legumbres, quinoa"
        }
      ]
    },
    {
      title: "Planificación y Suplementación",
      icon: Clock,
      fields: [
        {
          label: "Horarios de comidas",
          value: horariosComidas,
          onChange: setHorariosComidas,
          type: "text",
          placeholder: "Ej: ayuno intermitente 16/8, 5 comidas al día"
        },
        {
          label: "Suplementos recomendados",
          value: suplementosRecomendados,
          onChange: setSuplementosRecomendados,
          type: "text",
          placeholder: "Ej: proteína en polvo, creatina, vitamina D"
        }
        // Removing Fórmula Metabolismo Basal field
      ]
    }
  ];

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No se encontró el token de autenticación');
        }
        console.log('Fetching clients...');
        const response = await fetch('https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/clientes/basico', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error('Error al obtener los clientes');
        }
        const data = await response.json();
        console.log('Clients data received:', data);
        setClients(data);
      } catch (err: any) {
        console.error('Error fetching clients:', err);
        setError(err.message);
      }
    };
    fetchClients();
  }, []);

  // Add console log when clients state changes
  useEffect(() => {
    console.log('Clients state updated:', clients);
  }, [clients]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('Submitting diet with data:', {
        nombre,
        clienteId,
        fechaInicio,
        objetivo,
        alergiasIntolerancias,
        alimentosProhibidos,
        alimentosPreferidos,
        horariosComidas,
        suplementosRecomendados
      });
      
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No se encontró el token de autenticación');
      }
      const response = await fetch('https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/dietas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          nombre,
          clienteId,
          fechaInicio,
          objetivo,
          alergiasIntolerancias,
          alimentosProhibidos,
          alimentosPreferidos,
          horariosComidas,
          suplementosRecomendados
          // Removing metabolismoBasal from request body
        }),
      });
      
      if (!response.ok) {
        throw new Error('Error al crear la dieta');
      }
      
      onDietCreated();
      onClose(); // Close the popup after successful creation
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Add this before the return statement
  console.log('Rendering with clients:', clients);
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 overflow-y-auto"
    >
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose} />

        <div className="inline-block w-full max-w-4xl my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
          <div className={`p-6 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <Utensils className="w-8 h-8 text-blue-500" />
                <h2 className="text-2xl font-bold">Crear Nueva Dieta</h2>
              </div>
              <button
                onClick={onClose}
                className={`p-2 rounded-full hover:bg-opacity-80 transition-colors ${
                  theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                }`}
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {error && (
              <div className="p-4 mb-6 rounded-lg bg-red-100 border border-red-400 text-red-700">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5" />
                  <span>{error}</span>
                </div>
              </div>
            )}

        <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
{/* Progress Steps */}
              <div className="flex justify-between mb-8">
                {sections.map((section, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setCurrentSection(index)}
                    className={`flex flex-col items-center space-y-2 ${
                      index === currentSection
                        ? 'text-blue-500'
                        : theme === 'dark'
                        ? 'text-gray-400'
                        : 'text-gray-500'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      index === currentSection
                        ? 'bg-blue-500 text-white'
                        : theme === 'dark'
                        ? 'bg-gray-700'
                        : 'bg-gray-200'
                    }`}>
                      {React.createElement(section.icon, { className: "w-5 h-5" })}
                    </div>
                    <span className="text-sm font-medium">{section.title}</span>
                  </button>
                ))}
              </div>

              {/* Current Section */}
              <motion.div
                key={currentSection}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {sections[currentSection].fields.map((field, index) => (
                    <div key={index} className="space-y-2">
                      <label className={`block text-sm font-medium ${
                        theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                      }`}>
                        {field.label}
                        {field.required && <span className="text-red-500 ml-1">*</span>}
                      </label>
                      
                      {field.type === 'select' && field.label === "Cliente" ? (
                        <>
                          {/* Original select that might have issues */}
                          <select
                            value={field.value}
                            onChange={(e) => field.onChange(e.target.value)}
                            className={`w-full px-4 py-2 rounded-lg border ${
                              theme === 'dark'
                                ? 'bg-gray-700 border-gray-600 text-white'
                                : 'bg-white border-gray-300 text-gray-900'
                            } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                            required={field.required}
                          >
                            <option value="">Seleccionar cliente</option>
                            {clients.map((client) => (
                              <option key={client._id} value={client._id}>
                                {client.nombre}
                              </option>
                            ))}
                          </select>
                        </>
                      ) : field.type === 'select' ? (
                        <select
                          value={field.value}
                          onChange={(e) => field.onChange(e.target.value)}
                          className={`w-full px-4 py-2 rounded-lg border ${
                            theme === 'dark'
                              ? 'bg-gray-700 border-gray-600 text-white'
                              : 'bg-white border-gray-300 text-gray-900'
                          } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                          required={field.required}
                        >
                          <option value="">
                            {field.isObjectiveSelect ? "Seleccionar objetivo" : "Seleccionar cliente"}
                          </option>
                          {field.isObjectiveSelect 
                            ? objetivos.map((obj, i) => (
                                <option key={i} value={obj}>
                                  {obj}
                                </option>
                              ))
                            : null}
                        </select>
                      ) : (
                        <input
                          type={field.type}
                          value={field.value}
                          onChange={(e) => field.onChange(e.target.value)}
                          placeholder={field.placeholder}
                          className={`w-full px-4 py-2 rounded-lg border ${
                            theme === 'dark'
                              ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                              : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                          } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                          required={field.required}
                          readOnly={field.readOnly}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setCurrentSection(Math.max(0, currentSection - 1))}
                  className={`px-4 py-2 text-sm font-medium rounded-lg ${
                    currentSection === 0
                      ? 'opacity-50 cursor-not-allowed'
                      : theme === 'dark'
                      ? 'bg-gray-700 text-white hover:bg-gray-600'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                  disabled={currentSection === 0}
                >
                  Anterior
                </button>
                
                {currentSection === sections.length - 1 ? (
                  <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="px-6 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  {loading ? (
                    <div className="flex items-center space-x-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Creando...</span>
                    </div>
                  ) : (
                    'Crear Dieta'
                  )}
                </button>
              ) : (
                  <button
                    type="button"
                    onClick={() => setCurrentSection(Math.min(sections.length - 1, currentSection + 1))}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600"
                  >
                    Siguiente
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CrearDietasPopup;