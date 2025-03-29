import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Edit2, Trash2 } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface Producto {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  categoria: string;
}

interface TablaProductosProps {
  productos?: any[]; // Add this prop
  onEditProducto?: (productoId: string) => void;
}

const TablaProductos: React.FC<TablaProductosProps> = ({ productos: productosProps, onEditProducto }) => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';

  useEffect(() => {
    console.log('Productos recibidos como props:', productosProps);
    if (productosProps) {
      setProductos(productosProps);
    }
  }, [productosProps]);

  const handleDelete = (productoId: string) => {
    console.log('Intentando eliminar producto:', productoId);
    if (!window.confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      return;
    }
    setProductos(productos.filter(producto => producto.id !== productoId));
  };

  console.log('Estado actual de productos:', productos);

  if (loading) {
    return <div>Cargando productos...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}
    >
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className={`${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
              <th className="px-4 py-2">Nombre</th>
              <th className="px-4 py-2">Descripción</th>
              <th className="px-4 py-2">Precio</th>
              <th className="px-4 py-2">Stock</th>
              <th className="px-4 py-2">Categoría</th>
              <th className="px-4 py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((producto) => (
              <tr
                key={producto.id}
                className={`border-t ${
                  isDarkMode ? 'border-gray-700 text-gray-300' : 'border-gray-200 text-gray-600'
                }`}
              >
                <td className="px-4 py-2">{producto.nombre}</td>
                <td className="px-4 py-2">{producto.descripcion}</td>
                <td className="px-4 py-2">${producto.precio}</td>
                <td className="px-4 py-2">{producto.stock}</td>
                <td className="px-4 py-2">{producto.categoria}</td>
                <td className="px-4 py-2">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => onEditProducto && onEditProducto(producto.id)}
                      className="p-1 text-blue-500 hover:text-blue-700"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(producto.id)}
                      className="p-1 text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default TablaProductos;
