import React, { useState, useEffect } from 'react';
import { useTheme } from '../../../contexts/ThemeContext';
import { motion } from 'framer-motion';
import { AlertTriangle, Plus, X } from 'lucide-react';

interface Nota {
  _id: string;
  titulo: string;
  contenido: string;
  importante: boolean;
  planning: string;
  fecha: string;
  createdAt: string;
  updatedAt: string;
}

interface VistaNotasProps {
  planningId: string;
}

const VistaNotas: React.FC<VistaNotasProps> = ({ planningId }) => {
  const { theme } = useTheme();
  const [notas, setNotas] = useState<Nota[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [newNota, setNewNota] = useState({
    titulo: '',
    contenido: '',
    importante: false
  });
  const [error, setError] = useState<string | null>(null);

  const fetchNotas = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No se encontró el token de autenticación');
      }

      const response = await fetch(`https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/notas-planning/planning/${planningId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Error al cargar las notas');
      }

      const data = await response.json();
      setNotas(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar las notas');
    }
  };

  useEffect(() => {
    if (planningId) {
      fetchNotas();
    }
  }, [planningId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No se encontró el token de autenticación');
      }

      const response = await fetch('https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/notas-planning', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          planningId,
          ...newNota
        })
      });

      if (!response.ok) {
        throw new Error('Error al crear la nota');
      }

      await fetchNotas();
      setShowForm(false);
      setNewNota({
        titulo: '',
        contenido: '',
        importante: false
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear la nota');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className={`${
        theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'
      } rounded-xl p-6 shadow-lg`}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
          Notas del Plan
        </h2>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Nueva Nota
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg flex items-center">
          <AlertTriangle className="w-5 h-5 mr-2" />
          {error}
        </div>
      )}

      {showForm && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-6 p-4 bg-white dark:bg-gray-800 rounded-lg shadow"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Nueva Nota</h3>
            <button
              onClick={() => setShowForm(false)}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                placeholder="Título"
                value={newNota.titulo}
                onChange={(e) => setNewNota({ ...newNota, titulo: e.target.value })}
                className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                required
              />
            </div>
            <div>
              <textarea
                placeholder="Contenido"
                value={newNota.contenido}
                onChange={(e) => setNewNota({ ...newNota, contenido: e.target.value })}
                className="w-full p-2 border rounded-lg min-h-[100px] dark:bg-gray-700 dark:border-gray-600"
                required
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="importante"
                checked={newNota.importante}
                onChange={(e) => setNewNota({ ...newNota, importante: e.target.checked })}
                className="mr-2"
              />
              <label htmlFor="importante">Marcar como importante</label>
            </div>
            <button
              type="submit"
              className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Guardar Nota
            </button>
          </form>
        </motion.div>
      )}

      <div className="space-y-4">
        {notas.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400">
            No hay notas disponibles
          </p>
        ) : (
          notas.map((nota) => (
            <motion.div
              key={nota._id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`p-4 rounded-lg shadow ${
                nota.importante
                  ? 'bg-yellow-50 dark:bg-yellow-900/30 border-l-4 border-yellow-500'
                  : 'bg-white dark:bg-gray-800'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-lg mb-2">{nota.titulo}</h3>
                  <p className="text-gray-600 dark:text-gray-300">{nota.contenido}</p>
                </div>
                {nota.importante && (
                  <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0" />
                )}
              </div>
              <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                {new Date(nota.fecha).toLocaleDateString()}
              </div>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
};

export default VistaNotas;