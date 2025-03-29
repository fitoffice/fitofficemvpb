import React, { useState, useEffect } from 'react';
import { ServicioAsesoriaSubscripcion } from '../../types/servicios';
import { useTheme } from '../../contexts/ThemeContext';

interface EditPanelAsesoriaProps {
  isOpen: boolean;
  onClose: () => void;
  asesoria: ServicioAsesoriaSubscripcion | null;
  onUpdate: (updatedAsesoria: ServicioAsesoriaSubscripcion) => void;
}

const EditPanelAsesoria: React.FC<EditPanelAsesoriaProps> = ({
  isOpen,
  onClose,
  asesoria,
  onUpdate,
}) => {
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';

  const [formData, setFormData] = useState<Partial<ServicioAsesoriaSubscripcion>>({
    nombre: '',
    descripcion: '',
    precio: 0,
    duracion: '',
    tipo: 'asesoria',
  });

  useEffect(() => {
    if (asesoria) {
      setFormData({
        nombre: asesoria.nombre,
        descripcion: asesoria.descripcion,
        precio: asesoria.precio,
        duracion: asesoria.duracion,
        tipo: asesoria.tipo,
      });
    }
  }, [asesoria]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'precio' ? parseFloat(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (asesoria && formData) {
      onUpdate({
        ...asesoria,
        ...formData,
      });
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className={`relative p-6 rounded-lg shadow-lg w-full max-w-md ${
        isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
      }`}>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          ×
        </button>
        <h2 className="text-2xl font-bold mb-4">Editar Asesoría Individual</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1">Nombre:</label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              className={`w-full p-2 border rounded ${
                isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
              }`}
              required
            />
          </div>
          <div>
            <label className="block mb-1">Descripción:</label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              className={`w-full p-2 border rounded ${
                isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
              }`}
              rows={3}
              required
            />
          </div>
          <div>
            <label className="block mb-1">Precio:</label>
            <input
              type="number"
              name="precio"
              value={formData.precio}
              onChange={handleChange}
              className={`w-full p-2 border rounded ${
                isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
              }`}
              required
            />
          </div>
          <div>
            <label className="block mb-1">Duración:</label>
            <input
              type="text"
              name="duracion"
              value={formData.duracion}
              onChange={handleChange}
              className={`w-full p-2 border rounded ${
                isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
              }`}
              required
            />
          </div>
          <div className="flex justify-end space-x-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 rounded ${
                isDarkMode
                  ? 'bg-gray-600 hover:bg-gray-700'
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPanelAsesoria;
