import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import Button from '../../Common/Button';
import { useTheme } from '../../../contexts/ThemeContext';
import axios from 'axios';

interface Trainer {
  _id: string;
  nombre: string;
  email: string;
}

interface Bono {
  _id: string;
  nombre: string;
  tipo: string;
  descripcion: string;
  primeraFecha: string;
  segundaFecha: string;
  terceraFecha: string;
  servicio: string;
  sesiones: number;
  precio: number;
  trainer: Trainer;
  estado: string;
  sesionesRestantes: number;
}

interface EditBonoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBonoUpdated: () => void;
  bono: Bono;
}

const EditBonoModal: React.FC<EditBonoModalProps> = ({ isOpen, onClose, onBonoUpdated, bono }) => {
  const { theme } = useTheme();
  const [formData, setFormData] = useState({
    nombre: '',
    tipo: '',
    descripcion: '',
    servicio: '',
    sesiones: 0,
    precio: 0,
    estado: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (bono) {
      setFormData({
        nombre: bono.nombre,
        tipo: bono.tipo,
        descripcion: bono.descripcion,
        servicio: bono.servicio,
        sesiones: bono.sesiones,
        precio: bono.precio,
        estado: bono.estado
      });
    }
  }, [bono]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'sesiones' || name === 'precio' ? Number(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/bonos/${bono._id}`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      onBonoUpdated();
      onClose();
    } catch (err) {
      console.error('Error al actualizar el bono:', err);
      setError('Error al actualizar el bono');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`relative w-full max-w-md p-6 rounded-lg shadow-lg ${
        theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
      }`}>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>
        
        <h2 className="text-xl font-semibold mb-4">Editar Bono</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nombre</label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              className={`w-full p-2 rounded border ${
                theme === 'dark' 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300'
              }`}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Tipo</label>
            <select
              name="tipo"
              value={formData.tipo}
              onChange={handleChange}
              className={`w-full p-2 rounded border ${
                theme === 'dark' 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300'
              }`}
              required
            >
              <option value="">Seleccionar tipo</option>
              <option value="personal">Personal</option>
              <option value="grupal">Grupal</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Descripción</label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              className={`w-full p-2 rounded border ${
                theme === 'dark' 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300'
              }`}
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Servicio</label>
            <input
              type="text"
              name="servicio"
              value={formData.servicio}
              onChange={handleChange}
              className={`w-full p-2 rounded border ${
                theme === 'dark' 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300'
              }`}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Sesiones</label>
            <input
              type="number"
              name="sesiones"
              value={formData.sesiones}
              onChange={handleChange}
              className={`w-full p-2 rounded border ${
                theme === 'dark' 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300'
              }`}
              required
              min="1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Precio</label>
            <input
              type="number"
              name="precio"
              value={formData.precio}
              onChange={handleChange}
              className={`w-full p-2 rounded border ${
                theme === 'dark' 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300'
              }`}
              required
              min="0"
              step="0.01"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Estado</label>
            <select
              name="estado"
              value={formData.estado}
              onChange={handleChange}
              className={`w-full p-2 rounded border ${
                theme === 'dark' 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300'
              }`}
              required
            >
              <option value="activo">Activo</option>
              <option value="expirado">Expirado</option>
              <option value="suspendido">Suspendido</option>
            </select>
          </div>

          {error && (
            <div className="text-red-500 text-sm mt-2">
              {error}
            </div>
          )}

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="secondary" onClick={onClose} type="button">
              Cancelar
            </Button>
            <Button variant="primary" type="submit">
              Guardar Cambios
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditBonoModal;
