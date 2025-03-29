import React, { useState } from 'react';
import { X } from 'lucide-react';
import Button from '../components/Common/Button';

const AIRoutinePage: React.FC = () => {
  const [objective, setObjective] = useState('');
  const [fitnessLevel, setFitnessLevel] = useState('intermedio');
  const [duration, setDuration] = useState('45');
  const [preferences, setPreferences] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí puedes manejar la generación de la rutina
    const routineData = {
      objective,
      fitnessLevel,
      duration,
      preferences
    };
    console.log('Generating routine with:', routineData);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6">Crear Rutina con IA</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-2 font-medium">
              Objetivo Principal
            </label>
            <input
              type="text"
              value={objective}
              onChange={(e) => setObjective(e.target.value)}
              placeholder="Ej: Ganar masa muscular, perder peso, mejorar resistencia..."
              className="w-full p-2 border rounded-lg bg-white border-gray-300"
              required
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Nivel de Condición Física
            </label>
            <select
              value={fitnessLevel}
              onChange={(e) => setFitnessLevel(e.target.value)}
              className="w-full p-2 border rounded-lg bg-white border-gray-300"
            >
              <option value="principiante">Principiante</option>
              <option value="intermedio">Intermedio</option>
              <option value="avanzado">Avanzado</option>
            </select>
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Duración Aproximada (minutos)
            </label>
            <input
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              min="15"
              max="180"
              className="w-full p-2 border rounded-lg bg-white border-gray-300"
              required
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Preferencias Adicionales
            </label>
            <textarea
              value={preferences}
              onChange={(e) => setPreferences(e.target.value)}
              placeholder="Ej: Preferencia por ejercicios en casa, lesiones a considerar, equipamiento disponible..."
              className="w-full p-2 border rounded-lg h-32 resize-none bg-white border-gray-300"
            />
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              className="px-4 py-2 rounded-lg bg-purple-500 hover:bg-purple-600 text-white"
            >
              Generar Rutina
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AIRoutinePage;
