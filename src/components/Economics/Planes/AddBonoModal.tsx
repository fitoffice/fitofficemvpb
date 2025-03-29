import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X } from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';

interface AddBonoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBonoAdded: () => void;
}

interface Client {
  _id: string;
  nombre: string;
  email: string;
  trainer: string;
}

const AddBonoModal: React.FC<AddBonoModalProps> = ({ isOpen, onClose, onBonoAdded }) => {
  const { theme } = useTheme();
  const [clientes, setClientes] = useState<Client[]>([]);
  const [formData, setFormData] = useState({
    nombre: '',
    clienteId: '',
    tipo: 'mensual',
    descripcion: '',
    primeraFecha: '',
    segundaFecha: '',
    terceraFecha: '',
    servicio: '',
    sesiones: 0,
    precio: 0
  });
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const clientesRes = await axios.get('https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/clientes');
        setClientes(clientesRes.data);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Error al cargar los datos necesarios');
      }
    };

    if (isOpen) {
      fetchData();
    }
  }, [isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/bonos', formData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      onBonoAdded();
      onClose();
      setFormData({
        nombre: '',
        clienteId: '',
        tipo: 'mensual',
        descripcion: '',
        primeraFecha: '',
        segundaFecha: '',
        terceraFecha: '',
        servicio: '',
        sesiones: 0,
        precio: 0
      });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al crear el bono');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} p-6 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Añadir Nuevo Bono</h2>
          <button
            onClick={onClose}
            className={`p-1 rounded-full ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1">Nombre del Bono</label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                className={`w-full p-2 rounded border ${
                  theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                }`}
                required
              />
            </div>

            <div>
              <label className="block mb-1">Cliente</label>
              <select
                name="clienteId"
                value={formData.clienteId}
                onChange={handleInputChange}
                className={`w-full p-2 rounded border ${
                  theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                }`}
                required
              >
                <option value="">Seleccionar Cliente</option>
                {clientes.map(cliente => (
                  <option key={cliente._id} value={cliente._id}>
                    {cliente.nombre} - {cliente.email}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-1">Tipo de Bono</label>
              <select
                name="tipo"
                value={formData.tipo}
                onChange={handleInputChange}
                className={`w-full p-2 rounded border ${
                  theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                }`}
                required
              >
                <option value="mensual">Mensual</option>
                <option value="trimestral">Trimestral</option>
                <option value="anual">Anual</option>
                <option value="sesiones">Sesiones</option>
              </select>
            </div>

            <div>
              <label className="block mb-1">Servicio</label>
              <input
                type="text"
                name="servicio"
                value={formData.servicio}
                onChange={handleInputChange}
                className={`w-full p-2 rounded border ${
                  theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                }`}
                required
              />
            </div>

            <div>
              <label className="block mb-1">Primera Fecha</label>
              <input
                type="date"
                name="primeraFecha"
                value={formData.primeraFecha}
                onChange={handleInputChange}
                className={`w-full p-2 rounded border ${
                  theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                }`}
                required
              />
            </div>

            <div>
              <label className="block mb-1">Segunda Fecha</label>
              <input
                type="date"
                name="segundaFecha"
                value={formData.segundaFecha}
                onChange={handleInputChange}
                className={`w-full p-2 rounded border ${
                  theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                }`}
                required
              />
            </div>

            <div>
              <label className="block mb-1">Tercera Fecha</label>
              <input
                type="date"
                name="terceraFecha"
                value={formData.terceraFecha}
                onChange={handleInputChange}
                className={`w-full p-2 rounded border ${
                  theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                }`}
                required
              />
            </div>

            <div>
              <label className="block mb-1">Número de Sesiones</label>
              <input
                type="number"
                name="sesiones"
                value={formData.sesiones}
                onChange={handleInputChange}
                min="0"
                className={`w-full p-2 rounded border ${
                  theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                }`}
                required
              />
            </div>

            <div>
              <label className="block mb-1">Precio</label>
              <input
                type="number"
                name="precio"
                value={formData.precio}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                className={`w-full p-2 rounded border ${
                  theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                }`}
                required
              />
            </div>
          </div>

          <div>
            <label className="block mb-1">Descripción</label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleInputChange}
              rows={3}
              className={`w-full p-2 rounded border ${
                theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
              }`}
              required
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 rounded ${
                theme === 'dark'
                  ? 'bg-gray-700 hover:bg-gray-600'
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
            >
              Crear Bono
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBonoModal;
