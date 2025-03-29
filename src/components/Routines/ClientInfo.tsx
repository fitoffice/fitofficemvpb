import React from 'react';

export function ClientInfo({ onSubmit }: { onSubmit?: () => void }) {
  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold text-indigo-700 mb-6 flex items-center gap-2">
        <span className="text-indigo-600">👤</span>
        Información del Cliente
      </h2>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rango de Altura (cm)
          </label>
          <div className="flex gap-4">
            <input
              type="number"
              min="150"
              max="200"
              defaultValue="150"
              className="w-24 px-3 py-2 border rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            <input
              type="number"
              min="150"
              max="200"
              defaultValue="200"
              className="w-24 px-3 py-2 border rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rango de Peso (kg)
          </label>
          <div className="flex gap-4">
            <input
              type="number"
              min="50"
              max="100"
              defaultValue="50"
              className="w-24 px-3 py-2 border rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            <input
              type="number"
              min="50"
              max="100"
              defaultValue="100"
              className="w-24 px-3 py-2 border rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Objetivo
          </label>
          <select className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
            <option value="">Seleccione un objetivo</option>
            <option value="strength">Fuerza</option>
            <option value="hypertrophy">Hipertrofia</option>
            <option value="endurance">Resistencia</option>
            <option value="weight-loss">Pérdida de peso</option>
          </select>
        </div>
      </div>
    </div>
  );
}