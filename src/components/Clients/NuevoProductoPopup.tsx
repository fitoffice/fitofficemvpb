import React, { useState } from 'react';
import { X } from 'lucide-react';
import Button from '../Common/Button';

interface NuevoProductoPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (nuevoProducto: any) => void;
}

const NuevoProductoPopup: React.FC<NuevoProductoPopupProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    stock: '',
    categoria: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/servicios/producto', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Error al crear el producto');
      }

      const nuevoProducto = await response.json();
      onSuccess(nuevoProducto);
      onClose();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 w-full max-w-md relative shadow-2xl transform transition-all duration-300 ease-in-out animate-slideUp">
        <div className="absolute -top-2 -right-2">
          <button
            onClick={onClose}
            className="p-2 bg-white dark:bg-gray-700 rounded-full shadow-lg hover:scale-110 transition-transform duration-200 group"
          >
            <X size={20} className="text-gray-500 dark:text-gray-400 group-hover:text-red-500" />
          </button>
        </div>
        
        <h2 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white border-b pb-3 dark:border-gray-700">
          <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
            Nuevo Producto
          </span>
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-5">
            <div className="group">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2 group-hover:text-blue-500 transition-colors">
                Nombre
              </label>
              <input
                type="text"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all duration-200 hover:border-blue-400"
                required
                placeholder="Ingrese el nombre del producto"
              />
            </div>

            <div className="group">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2 group-hover:text-blue-500 transition-colors">
                Descripción
              </label>
              <textarea
                value={formData.descripcion}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all duration-200 hover:border-blue-400 resize-none"
                rows={3}
                placeholder="Describa el producto"
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2 group-hover:text-blue-500 transition-colors">
                  Precio
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    value={formData.precio}
                    onChange={(e) => setFormData({ ...formData, precio: e.target.value })}
                    className="w-full pl-8 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all duration-200 hover:border-blue-400"
                    required
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2 group-hover:text-blue-500 transition-colors">
                  Stock
                </label>
                <input
                  type="number"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all duration-200 hover:border-blue-400"
                  required
                  placeholder="0"
                />
              </div>
            </div>

            <div className="group">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2 group-hover:text-blue-500 transition-colors">
                Categoría
              </label>
              <input
                type="text"
                value={formData.categoria}
                onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all duration-200 hover:border-blue-400"
                placeholder="Seleccione una categoría"
              />
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-6 border-t dark:border-gray-700">
            <Button 
              variant="plain" 
              onClick={onClose}
              className="px-6 py-2.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all duration-200 hover:scale-105"
            >
              Cancelar
            </Button>
            <Button 
              variant="create" 
              type="submit"
              className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25"
            >
              Crear Producto
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NuevoProductoPopup;