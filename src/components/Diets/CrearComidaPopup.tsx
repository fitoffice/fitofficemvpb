// CrearDietasPopup.tsx
import React, { useState, useEffect } from 'react';

interface CrearDietasPopupProps {
  onClose: () => void;
  onDietCreated: () => void; // Callback para refrescar la lista de dietas después de crear una
}

const CrearDietasPopup: React.FC<CrearDietasPopupProps> = ({ onClose, onDietCreated }) => {
  const [nombre, setNombre] = useState('');
  const [clienteId, setClienteId] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [objetivo, setObjetivo] = useState('');
  const [restricciones, setRestricciones] = useState('');
  const [fechaComienzo, setFechaComienzo] = useState('');

  const [clients, setClients] = useState([]); // Lista de clientes
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Obtener la lista de clientes al montar el componente
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No se encontró el token de autenticación');
        }
        const response = await fetch('https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/clientes', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.mensaje || 'Error al obtener los clientes');
        }
        const data = await response.json();
        setClients(data);
      } catch (err: any) {
        setError(err.message);
      }
    };
    fetchClients();
  }, []);

  // Manejar el envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
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
          restricciones,
          fechaComienzo,
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.mensaje || 'Error al crear la dieta');
      }
      const data = await response.json();
      onDietCreated(); // Refrescar la lista de dietas
      onClose(); // Cerrar el popup
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <p className="text-red-500">{error}</p>}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Nombre de la dieta</label>
        <input
          type="text"
          className="w-full px-4 py-2 rounded-lg border focus:outline-none"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Cliente</label>
        <select
          className="w-full px-4 py-2 rounded-lg border focus:outline-none"
          value={clienteId}
          onChange={(e) => setClienteId(e.target.value)}
          required
        >
          <option value="">Seleccione un cliente</option>
          {clients.map((client: any) => (
            <option key={client._id} value={client._id}>
              {client.nombre}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Fecha de inicio</label>
        <input
          type="date"
          className="w-full px-4 py-2 rounded-lg border focus:outline-none"
          value={fechaInicio}
          onChange={(e) => setFechaInicio(e.target.value)}
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Objetivo</label>
        <input
          type="text"
          className="w-full px-4 py-2 rounded-lg border focus:outline-none"
          value={objetivo}
          onChange={(e) => setObjetivo(e.target.value)}
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Restricciones</label>
        <input
          type="text"
          className="w-full px-4 py-2 rounded-lg border focus:outline-none"
          value={restricciones}
          onChange={(e) => setRestricciones(e.target.value)}
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Fecha de comienzo</label>
        <input
          type="date"
          className="w-full px-4 py-2 rounded-lg border focus:outline-none"
          value={fechaComienzo}
          onChange={(e) => setFechaComienzo(e.target.value)}
          required
        />
      </div>
      <div className="flex justify-end">
        <button
          type="button"
          className="mr-2 px-4 py-2 rounded-lg border focus:outline-none"
          onClick={onClose}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-4 py-2 rounded-lg bg-green-500 text-white focus:outline-none"
          disabled={loading}
        >
          {loading ? 'Creando...' : 'Crear Dieta'}
        </button>
      </div>
    </form>
  );
};

export default CrearDietasPopup;
