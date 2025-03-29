import React, { useState } from 'react';
import { Calendar, Clock, Bell, X, Users } from 'lucide-react';

interface Props {
  onClose: () => void;
}

export function RemindersPanel({ onClose }: Props) {
  const [reminderConfig, setReminderConfig] = useState({
    eventType: 'appointment',
    reminderTime: '24',
    message: '',
    clientGroup: 'all'
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-2xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Calendar className="h-6 w-6 text-blue-500" />
            <h2 className="text-xl font-semibold text-gray-900">
              Configuración de Recordatorios
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Configuración Principal */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <h3 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
              <Bell className="h-5 w-5 text-blue-500" />
              Configuración del Recordatorio
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Evento
                </label>
                <select 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={reminderConfig.eventType}
                  onChange={(e) => setReminderConfig({...reminderConfig, eventType: e.target.value})}
                >
                  <option value="appointment">Cita</option>
                  <option value="class">Clase</option>
                  <option value="assessment">Evaluación</option>
                  <option value="payment">Pago</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tiempo de Anticipación
                </label>
                <div className="flex gap-3">
                  <select 
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={reminderConfig.reminderTime}
                    onChange={(e) => setReminderConfig({...reminderConfig, reminderTime: e.target.value})}
                  >
                    <option value="1">1 hora</option>
                    <option value="2">2 horas</option>
                    <option value="4">4 horas</option>
                    <option value="24">24 horas</option>
                    <option value="48">48 horas</option>
                  </select>
                  <div className="flex items-center px-3 bg-blue-100 rounded-md">
                    <Clock className="h-5 w-5 text-blue-500" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mensaje del Recordatorio
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={4}
                  placeholder="Ej: No olvides tu cita programada para {fecha} a las {hora}."
                  value={reminderConfig.message}
                  onChange={(e) => setReminderConfig({...reminderConfig, message: e.target.value})}
                />
                <p className="mt-1 text-sm text-gray-500">
                  Usa {'{fecha}'} y {'{hora}'} como marcadores para la información del evento
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Grupo de Clientes
                </label>
                <div className="flex gap-3 items-center">
                  <select 
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={reminderConfig.clientGroup}
                    onChange={(e) => setReminderConfig({...reminderConfig, clientGroup: e.target.value})}
                  >
                    <option value="all">Todos los clientes</option>
                    <option value="active">Clientes activos</option>
                    <option value="new">Nuevos clientes</option>
                    <option value="vip">Clientes VIP</option>
                  </select>
                  <div className="flex items-center px-3 bg-blue-100 rounded-md">
                    <Users className="h-5 w-5 text-blue-500" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Estadísticas */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-4">Estadísticas de Recordatorios</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-semibold text-blue-600">0</div>
                <div className="text-sm text-gray-500">Enviados</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-semibold text-blue-600">0</div>
                <div className="text-sm text-gray-500">Confirmados</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-semibold text-blue-600">0</div>
                <div className="text-sm text-gray-500">Reprogramados</div>
              </div>
            </div>
          </div>

          {/* Botones de Acción */}
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
            >
              Cancelar
            </button>
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2"
            >
              <Bell className="h-4 w-4" />
              Activar Recordatorios
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
