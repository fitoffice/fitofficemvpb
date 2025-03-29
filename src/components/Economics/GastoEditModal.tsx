import React from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useGastoEditModal } from '../../contexts/GastoEditModalContext';
import { useGastos } from '../../contexts/GastosContext';
import { useTheme } from '../../contexts/ThemeContext';

const GastoEditModal: React.FC = () => {
  const { isEditMode, selectedGasto, closeEditModal, updateSelectedGasto } = useGastoEditModal();
  const { refreshGastos } = useGastos();
  const { theme } = useTheme();

  if (!isEditMode || !selectedGasto) return null;

  // Función para obtener el token del localStorage
  const getToken = (): string | null => {
    return localStorage.getItem('token');
  };

  // Función para guardar la edición
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const token = getToken();
      if (!token) {
        throw new Error('Token no encontrado');
      }

      await axios.patch(`https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/gastos/${selectedGasto._id}`, selectedGasto, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      // Actualizar la lista de gastos
      if (refreshGastos) {
        refreshGastos();
      }

      closeEditModal();
      toast.success('Gasto actualizado correctamente');
    } catch (error) {
      console.error('Error al actualizar el gasto:', error);
      toast.error('Error al actualizar el gasto');
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
      <div className={`bg-${theme === 'dark' ? 'gray-800' : 'white'} p-4 rounded-lg shadow-lg w-1/2 max-w-2xl`}>
        <h2 className={`text-lg font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
          Editar gasto
        </h2>
        <form onSubmit={handleSaveEdit}>
          <div className="mb-4">
            <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              Descripción
            </label>
            <input
              type="text"
              value={selectedGasto.descripcion || ''}
              onChange={(e) => updateSelectedGasto({ descripcion: e.target.value })}
              className={`w-full p-2 rounded-md border ${
                theme === 'dark' 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300'
              }`}
            />
          </div>
          <div className="mb-4">
            <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              Importe
            </label>
            <input
              type="number"
              value={selectedGasto.importe}
              onChange={(e) => updateSelectedGasto({ importe: Number(e.target.value) })}
              className={`w-full p-2 rounded-md border ${
                theme === 'dark' 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300'
              }`}
            />
          </div>
          <div className="mb-4">
            <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              Categoría
            </label>
            <input
              type="text"
              value={selectedGasto.categoria || ''}
              onChange={(e) => updateSelectedGasto({ categoria: e.target.value })}
              className={`w-full p-2 rounded-md border ${
                theme === 'dark' 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300'
              }`}
            />
          </div>
          <div className="mb-4">
            <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              Tipo
            </label>
            <select
              value={selectedGasto.tipo || ''}
              onChange={(e) => updateSelectedGasto({ tipo: e.target.value })}
              className={`w-full p-2 rounded-md border ${
                theme === 'dark' 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300'
              }`}
            >
              <option value="">Seleccione un tipo</option>
              <option value="fijo">Fijo</option>
              <option value="variable">Variable</option>
            </select>
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={closeEditModal}
              className={`py-2 px-4 rounded ${
                theme === 'dark' 
                  ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
              }`}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Guardar cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GastoEditModal;