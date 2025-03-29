import React, { useState, useEffect } from 'react';
import { Mail, Plus, Trash2 } from 'lucide-react';
import { ModalEtapa } from './ModalEtapa';

interface Servicio {
  _id: string;
  nombre: string;
  precio: number;
}

interface Email {
  asunto: string;
  contenido: string;
  variantes?: Array<{ nombre: string; valor: string }>;
}

interface Etapa {
  nombre: string;
  emails: Email[];
  servicioId?: string;
  requiereCompra: boolean;
}

interface Segmento {
  _id: string;
  name: string;
  variables?: { [key: string]: any };
}

interface EmailConfigurationPanelProps {
  etapas: Etapa[];
  onEtapasChange: (etapas: Etapa[]) => void;
  numeroProductos: number;
  segmentosSeleccionados: Segmento[];
}

export function EmailConfigurationPanel({ 
  etapas, 
  onEtapasChange, 
  numeroProductos,
  segmentosSeleccionados 
}: EmailConfigurationPanelProps) {
  const [modalEtapaAbierto, setModalEtapaAbierto] = useState(false);
  const [etapaActual, setEtapaActual] = useState<number>(0);
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchServicios();
  }, []);

  const fetchServicios = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/servicios/services', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Error al cargar los servicios');
      }

      const data = await response.json();
      console.log('Servicios cargados:', data);
      setServicios(data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching servicios:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
      setLoading(false);
    }
  };

  // Asegurarse de que haya una etapa por producto
  React.useEffect(() => {
    if (etapas.length < numeroProductos) {
      const nuevasEtapas = [...etapas];
      for (let i = etapas.length; i < numeroProductos; i++) {
        nuevasEtapas.push({
          nombre: `Etapa ${i + 1}`,
          emails: [],
          requiereCompra: false
        });
      }
      onEtapasChange(nuevasEtapas);
    }
  }, [numeroProductos, etapas.length]);

  const handleAddEmail = (etapaIndex: number) => {
    setEtapaActual(etapaIndex);
    setModalEtapaAbierto(true);
  };

  const handleSaveEmail = (etapaIndex: number, emailData: {
    asunto: string;
    contenido: string;
    variantes: Array<{ nombre: string; valor: string }>;
  }) => {
    const nuevasEtapas = [...etapas];
    nuevasEtapas[etapaIndex].emails.push({
      asunto: emailData.asunto,
      contenido: emailData.contenido,
      variantes: emailData.variantes
    });
    onEtapasChange(nuevasEtapas);
  };

  const handleRemoveEmail = (etapaIndex: number, emailIndex: number) => {
    const nuevasEtapas = [...etapas];
    nuevasEtapas[etapaIndex].emails.splice(emailIndex, 1);
    onEtapasChange(nuevasEtapas);
  };

  const handleEtapaNombreChange = (etapaIndex: number, nuevoNombre: string) => {
    const nuevasEtapas = [...etapas];
    nuevasEtapas[etapaIndex].nombre = nuevoNombre;
    onEtapasChange(nuevasEtapas);
  };

  const handleServiceChange = (etapaIndex: number, servicioId: string) => {
    const nuevasEtapas = [...etapas];
    nuevasEtapas[etapaIndex].servicioId = servicioId === "none" ? undefined : servicioId;
    onEtapasChange(nuevasEtapas);
  };

  const handleRequiereCompraChange = (etapaIndex: number, requiereCompra: boolean) => {
    const nuevasEtapas = [...etapas];
    nuevasEtapas[etapaIndex].requiereCompra = requiereCompra;
    onEtapasChange(nuevasEtapas);
  };

  return (
    <div className="space-y-6">
        <div className="flex items-center gap-3">
        <div className="p-3 bg-blue-500/10 rounded-xl">
            <Mail className="w-6 h-6 text-blue-600" />
          </div>
        <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Configurar Correos por Etapa
          </h3>      </div>

          {loading ? (
        <div className="flex items-center justify-center h-[600px] bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200">
          <div className="animate-pulse flex flex-col items-center gap-4">
            <div className="w-12 h-12 rounded-full border-4 border-blue-500/30 border-t-blue-500 animate-spin"></div>
            <p className="text-gray-500 font-medium">Cargando servicios...</p>
          </div>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center h-[600px] bg-red-50 rounded-2xl border border-red-100">
          <div className="text-red-500 text-center">
            <div className="text-xl font-semibold mb-2">Error</div>
            <p>{error}</p>
          </div>
        </div>
      ) : (
        <div className="h-[800px] overflow-y-auto pr-4 space-y-8 custom-scrollbar">
        {etapas.map((etapa, etapaIndex) => (
              <div key={etapaIndex} className="p-8 border border-gray-200 rounded-2xl bg-gradient-to-br from-white to-blue-50/30 shadow-lg hover:shadow-xl transition-all duration-300 relative group">
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="relative group">
                    <input
                      type="text"
                      value={etapa.nombre}
                      onChange={(e) => handleEtapaNombreChange(etapaIndex, e.target.value)}
                      className="text-2xl font-bold bg-transparent border-b-2 border-transparent group-hover:border-blue-300 focus:border-blue-500 focus:outline-none px-3 py-2 transition-all duration-300"
                      placeholder={`Etapa ${etapaIndex + 1}`}
                    />
                    <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 group-hover:w-full transition-all duration-300"></div>
                  </div>
                  <button
                    onClick={() => handleAddEmail(etapaIndex)}
                    className="flex items-center gap-2 px-6 py-3 text-sm font-medium bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transform hover:scale-105 transition-all duration-300 shadow-md hover:shadow-lg"
                  >
                    <Plus className="w-5 h-5" />
                    Agregar Correo
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                      <div className="w-1 h-4 bg-blue-500 rounded-full"></div>
                      Servicio asociado
                    </label>
                    <select
                      value={etapa.servicioId || "none"}
                      onChange={(e) => handleServiceChange(etapaIndex, e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-blue-300 transition-all duration-300 cursor-pointer text-gray-700"
                    >
                      <option value="none" className="text-gray-500">Sin servicio asociado</option>
                      {servicios.map((servicio) => (
                        <option key={servicio._id} value={servicio._id} className="text-gray-700">
                          {servicio.nombre}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
                    <label className="flex items-center gap-4 text-sm text-gray-700 cursor-pointer group">
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={etapa.requiereCompra}
                          onChange={(e) => handleRequiereCompraChange(etapaIndex, e.target.checked)}
                          className="w-5 h-5 rounded-md border-2 border-gray-300 text-blue-600 focus:ring-blue-500 transition-colors duration-200 cursor-pointer"
                        />
                      </div>
                      <span className="flex-1 font-medium group-hover:text-blue-600 transition-colors duration-200">
                        No enviar correos de la siguiente etapa hasta que el cliente compre este servicio
                      </span>
                    </label>
                  </div>
                </div>

                <div className="space-y-6">
                  {etapa.emails.map((email, emailIndex) => (
                    <div key={emailIndex} className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
                      <div className="flex justify-between items-center mb-6">
                        <h4 className="text-lg font-bold text-gray-800 flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                          Correo #{emailIndex + 1}
                        </h4>
                        <button
                          onClick={() => handleRemoveEmail(etapaIndex, emailIndex)}
                          className="p-2 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="space-y-6">
                        <div className="group">
                          <label className="block text-sm font-semibold text-gray-700 mb-2 group-hover:text-blue-600 transition-colors duration-200">
                            Asunto
                          </label>
                          <div className="px-4 py-3 border border-gray-200 rounded-lg bg-white/80 backdrop-blur-sm group-hover:border-blue-200 transition-all duration-300">
                            {email.asunto}
                          </div>
                        </div>

                        <div className="group">
                          <label className="block text-sm font-semibold text-gray-700 mb-2 group-hover:text-blue-600 transition-colors duration-200">
                            Contenido
                          </label>
                          <div className="px-4 py-3 border border-gray-200 rounded-lg bg-white/80 backdrop-blur-sm min-h-[120px] whitespace-pre-wrap group-hover:border-blue-200 transition-all duration-300">
                            {email.contenido}
                          </div>
                        </div>

                        {email.variantes && email.variantes.length > 0 && (
                          <div className="group">
                            <label className="block text-sm font-semibold text-gray-700 mb-2 group-hover:text-blue-600 transition-colors duration-200">
                              Variables Utilizadas
                            </label>
                            <div className="flex flex-wrap gap-2">
                              {email.variantes.map((variante, index) => (
                                <span
                                  key={index}
                                  className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors duration-200 cursor-default"
                                >
                                  {variante.nombre}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <ModalEtapa
        isOpen={modalEtapaAbierto}
        onClose={() => setModalEtapaAbierto(false)}
        onSave={(emailData) => {
          handleSaveEmail(etapaActual, emailData);
          setModalEtapaAbierto(false);
        }}
        segmentosSeleccionados={segmentosSeleccionados}
      />
    </div>
  );
}
