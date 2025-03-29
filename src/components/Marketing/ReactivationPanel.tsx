import React, { useState } from 'react';
import { UserMinus, Clock, Mail, Settings, Target } from 'lucide-react';

interface Props {
  onClose: () => void;
}

interface OfertaTemplate {
  id: string;
  titulo: string;
  descripcion: string;
  descuento: string;
}

export function ReactivationPanel({ onClose }: Props) {
  const [config, setConfig] = useState({
    diasInactividad: '30',
    frecuenciaEnvio: 'weekly',
    horaEnvio: '10:00',
    asuntoPredeterminado: '¡Te echamos de menos! 💪 Vuelve con esta oferta especial',
    plantillaSeleccionada: '',
    ofertaEspecial: '',
    recordatorios: true,
    diasEntreRecordatorios: '7',
    maximoRecordatorios: '3',
    trackearApertura: true,
    trackearClicks: true
  });

  const ofertasTemplate: OfertaTemplate[] = [
    {
      id: '1',
      titulo: 'Descuento de Bienvenida',
      descripcion: 'Oferta especial de reactivación con 30% de descuento',
      descuento: '30%'
    },
    {
      id: '2',
      titulo: 'Plan Amigo',
      descripcion: 'Trae a un amigo y obtén 2 meses gratis',
      descuento: '2 meses'
    },
    {
      id: '3',
      titulo: 'Sesión Gratuita',
      descripcion: 'Una sesión de evaluación sin costo',
      descuento: 'Sesión gratis'
    }
  ];

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No hay token disponible');
        return;
      }

      const data = {
        tipo: 'recuperacion_inactivos',
        configuracion: {
          criterios: {
            diasInactividad: parseInt(config.diasInactividad),
            frecuenciaEnvio: config.frecuenciaEnvio,
            horaEnvio: config.horaEnvio
          },
          email: {
            asuntoPredeterminado: config.asuntoPredeterminado,
            plantillaId: config.plantillaSeleccionada,
            ofertaEspecial: config.ofertaEspecial
          },
          recordatorios: {
            activo: config.recordatorios,
            diasEntre: parseInt(config.diasEntreRecordatorios),
            maximo: parseInt(config.maximoRecordatorios)
          },
          tracking: {
            apertura: config.trackearApertura,
            clicks: config.trackearClicks
          }
        }
      };

      const response = await fetch('https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/automations/reactivation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error('Error al guardar la configuración');
      }

      onClose();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <UserMinus className="h-6 w-6 text-amber-500" />
            <h2 className="text-xl font-semibold text-gray-900">
              Recuperación de Clientes Inactivos
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                <Target className="h-5 w-5 text-amber-500" />
                Criterios de Inactividad
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Días de Inactividad
                  </label>
                  <select
                    value={config.diasInactividad}
                    onChange={(e) => setConfig({...config, diasInactividad: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="15">15 días</option>
                    <option value="30">30 días</option>
                    <option value="45">45 días</option>
                    <option value="60">60 días</option>
                    <option value="90">90 días</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Frecuencia de Revisión
                  </label>
                  <select
                    value={config.frecuenciaEnvio}
                    onChange={(e) => setConfig({...config, frecuenciaEnvio: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="daily">Diaria</option>
                    <option value="weekly">Semanal</option>
                    <option value="biweekly">Quincenal</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hora de Envío
                  </label>
                  <input
                    type="time"
                    value={config.horaEnvio}
                    onChange={(e) => setConfig({...config, horaEnvio: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                <Mail className="h-5 w-5 text-amber-500" />
                Configuración de Email
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Asunto Predeterminado
                  </label>
                  <input
                    type="text"
                    value={config.asuntoPredeterminado}
                    onChange={(e) => setConfig({...config, asuntoPredeterminado: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Oferta Especial Personalizada
                  </label>
                  <textarea
                    value={config.ofertaEspecial}
                    onChange={(e) => setConfig({...config, ofertaEspecial: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                    rows={3}
                    placeholder="Describe aquí tu oferta especial..."
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                <Settings className="h-5 w-5 text-amber-500" />
                Plantillas de Ofertas
              </h3>
              <div className="space-y-3">
                {ofertasTemplate.map((oferta) => (
                  <div
                    key={oferta.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-all ${
                      config.plantillaSeleccionada === oferta.id
                        ? 'border-amber-500 bg-amber-50'
                        : 'border-gray-200 hover:border-amber-200'
                    }`}
                    onClick={() => setConfig({...config, plantillaSeleccionada: oferta.id})}
                  >
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium text-gray-900">{oferta.titulo}</h4>
                      <span className="text-amber-600 font-medium">{oferta.descuento}</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{oferta.descripcion}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                <Clock className="h-5 w-5 text-amber-500" />
                Recordatorios
              </h3>
              <div className="space-y-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={config.recordatorios}
                    onChange={(e) => setConfig({...config, recordatorios: e.target.checked})}
                    className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700">Activar recordatorios</span>
                </label>

                {config.recordatorios && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Días entre recordatorios
                      </label>
                      <select
                        value={config.diasEntreRecordatorios}
                        onChange={(e) => setConfig({...config, diasEntreRecordatorios: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                      >
                        <option value="3">3 días</option>
                        <option value="5">5 días</option>
                        <option value="7">7 días</option>
                        <option value="10">10 días</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Máximo de recordatorios
                      </label>
                      <select
                        value={config.maximoRecordatorios}
                        onChange={(e) => setConfig({...config, maximoRecordatorios: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                      >
                        <option value="2">2 recordatorios</option>
                        <option value="3">3 recordatorios</option>
                        <option value="4">4 recordatorios</option>
                        <option value="5">5 recordatorios</option>
                      </select>
                    </div>
                  </>
                )}

                <div className="space-y-2 pt-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={config.trackearApertura}
                      onChange={(e) => setConfig({...config, trackearApertura: e.target.checked})}
                      className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-700">Trackear aperturas</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={config.trackearClicks}
                      onChange={(e) => setConfig({...config, trackearClicks: e.target.checked})}
                      className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-700">Trackear clicks</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600"
          >
            Guardar Configuración
          </button>
        </div>
      </div>
    </div>
  );
}
