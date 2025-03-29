import React, { useState } from 'react';
import { UserPlus, Mail, Clock, Settings } from 'lucide-react';

interface Props {
  onClose: () => void;
}

interface EmailTemplate {
  id: string;
  nombre: string;
  descripcion: string;
  asunto: string;
  mensaje: string;
}

export function WelcomePanel({ onClose }: Props) {
  const [config, setConfig] = useState({
    asunto: '¡Bienvenido/a a nuestra familia! 🎉',
    mensaje: '',
    retrasoHoras: '0',
    plantillaSeleccionada: '',
    trackearApertura: true,
    trackearClicks: true,
    enlace: '' // Add this new field
  });

  // Ejemplo de plantillas - En producción vendrían de una API
  const plantillasEmail: EmailTemplate[] = [
    {
      id: '1',
      nombre: 'Bienvenida Básica',
      descripcion: 'Mensaje simple de bienvenida con información esencial',
      asunto: '¡Bienvenido/a a nuestra comunidad! 👋',
      mensaje: 'Hola,\n\nNos alegra mucho darte la bienvenida a nuestra familia. Estamos aquí para ayudarte en lo que necesites.\n\nSaludos cordiales,\nEl equipo de FitOffice'
    },
    {
      id: '2',
      nombre: 'Bienvenida + Guía',
      descripcion: 'Incluye una guía de primeros pasos y recursos útiles',
      asunto: '¡Bienvenido/a! Aquí está tu guía de inicio 📚',
      mensaje: 'Hola,\n\nBienvenido/a a bordo. Para ayudarte a comenzar, hemos preparado una guía con los primeros pasos:\n\n1. Completa tu perfil\n2. Explora nuestros servicios\n3. Agenda tu primera sesión\n\nSi tienes alguna pregunta, estamos aquí para ayudarte.\n\nSaludos,\nEl equipo de FitOffice'
    },
    {
      id: '3',
      nombre: 'Bienvenida Premium',
      descripcion: 'Mensaje personalizado con ofertas especiales para nuevos miembros',
      asunto: '¡Bienvenido/a! Tu experiencia premium comienza aquí ✨',
      mensaje: 'Hola,\n\nBienvenido/a a tu experiencia premium. Como miembro especial, tienes acceso a beneficios exclusivos:\n\n• Atención prioritaria\n• Descuentos especiales\n• Acceso anticipado a nuevos servicios\n\nNo dudes en contactarnos para aprovechar al máximo tu membresía.\n\nSaludos exclusivos,\nEl equipo de FitOffice'
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
        tipo: 'bienvenida_nuevos_clientes',
        configuracion: {
          email: {
            asunto: config.asunto,
            mensaje: config.mensaje,
            plantillaId: config.plantillaSeleccionada,
            retrasoHoras: parseInt(config.retrasoHoras),
            enlace: config.trackearClicks ? config.enlace : null
          },
          tracking: {
            apertura: config.trackearApertura,
            clicks: config.trackearClicks
          }
        }
      };

      const response = await fetch('https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/automations/welcome', {
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
            <UserPlus className="h-6 w-6 text-amber-500" />
            <h2 className="text-xl font-semibold text-gray-900">
              Automatización de Bienvenida
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
                <Mail className="h-5 w-5 text-amber-500" />
                Configuración del Email
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Asunto del Email
                  </label>
                  <input
                    type="text"
                    value={config.asunto}
                    onChange={(e) => setConfig({...config, asunto: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="Ej: ¡Bienvenido/a a nuestra familia! 🎉"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mensaje Personalizado
                  </label>
                  <textarea
                    value={config.mensaje}
                    onChange={(e) => setConfig({...config, mensaje: e.target.value})}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="Escribe aquí tu mensaje de bienvenida..."
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Usa {'{enlace}'} en el mensaje para insertar el enlace de seguimiento
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                <Clock className="h-5 w-5 text-amber-500" />
                Configuración de Envío
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Retraso de Envío
                  </label>
                  <select
                    value={config.retrasoHoras}
                    onChange={(e) => setConfig({...config, retrasoHoras: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="0">Inmediatamente</option>
                    <option value="1">1 hora después</option>
                    <option value="24">24 horas después</option>
                    <option value="48">48 horas después</option>
                    <option value="72">72 horas después</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                <Settings className="h-5 w-5 text-amber-500" />
                Plantillas de Email
              </h3>
              <div className="space-y-3">
                {plantillasEmail.map((plantilla) => (
                  <div
                    key={plantilla.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-all ${
                      config.plantillaSeleccionada === plantilla.id
                        ? 'border-amber-500 bg-amber-50'
                        : 'border-gray-200 hover:border-amber-200'
                    }`}
                    onClick={() => setConfig({
                      ...config,
                      plantillaSeleccionada: plantilla.id,
                      asunto: plantilla.asunto,
                      mensaje: plantilla.mensaje
                    })}
                  >
                    <h4 className="font-medium text-gray-900">{plantilla.nombre}</h4>
                    <p className="text-sm text-gray-500 mt-1">{plantilla.descripcion}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-4">Seguimiento</h3>
              <div className="space-y-3">
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={config.trackearApertura}
                    onChange={(e) => setConfig({...config, trackearApertura: e.target.checked})}
                    className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700">Trackear apertura del email</span>
                </label>
                <div className="space-y-2">
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={config.trackearClicks}
                      onChange={(e) => setConfig({...config, trackearClicks: e.target.checked})}
                      className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-700">Trackear clicks en enlaces</span>
                  </label>
                  {config.trackearClicks && (
                    <div className="ml-7">
                      <input
                        type="text"
                        value={config.enlace}
                        onChange={(e) => setConfig({...config, enlace: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                        placeholder="Introduce el enlace a trackear"
                      />
                    </div>
                  )}
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
