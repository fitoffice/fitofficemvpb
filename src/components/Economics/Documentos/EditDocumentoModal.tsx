import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X } from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';
import Button from '../../Common/Button';

interface EditDocumentoModalProps {
  isOpen: boolean;
  onClose: () => void;
  documento: any | null;
  onDocumentoUpdated: () => void;
}

const EditDocumentoModal: React.FC<EditDocumentoModalProps> = ({
  isOpen,
  onClose,
  documento,
  onDocumentoUpdated,
}) => {
  const [nombre, setNombre] = useState('');
  const [tipo, setTipo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [notas, setNotas] = useState('');
  const [error, setError] = useState('');
  const { theme } = useTheme();

  useEffect(() => {
    if (documento) {
      setNombre(documento.nombre || '');
      setTipo(documento.tipo || '');
      setDescripcion(documento.descripcion || '');
      setNotas(documento.notas || '');
    }
  }, [documento]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/otros-documentos/${documento?._id}`,
        {
          nombre,
          tipo,
          descripcion,
          notas,
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      onDocumentoUpdated();
      onClose();
    } catch (err) {
      console.error('Error al actualizar el documento:', err);
      setError('Error al actualizar el documento');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`${
        theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
      } rounded-lg p-6 w-full max-w-md relative`}>
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 p-1 rounded-full ${
            theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
          }`}
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-semibold mb-4">Editar Documento</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nombre</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className={`w-full p-2 rounded border ${
                theme === 'dark'
                  ? 'bg-gray-700 border-gray-600'
                  : 'bg-white border-gray-300'
              }`}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Tipo</label>
            <input
              type="text"
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
              className={`w-full p-2 rounded border ${
                theme === 'dark'
                  ? 'bg-gray-700 border-gray-600'
                  : 'bg-white border-gray-300'
              }`}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Descripción</label>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className={`w-full p-2 rounded border ${
                theme === 'dark'
                  ? 'bg-gray-700 border-gray-600'
                  : 'bg-white border-gray-300'
              }`}
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Notas</label>
            <textarea
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
              className={`w-full p-2 rounded border ${
                theme === 'dark'
                  ? 'bg-gray-700 border-gray-600'
                  : 'bg-white border-gray-300'
              }`}
              rows={3}
            />
          </div>

          {error && (
            <div className="text-red-500 text-sm mt-2">{error}</div>
          )}

          <div className="flex justify-end space-x-2 mt-4">
            <Button
              type="button"
              onClick={onClose}
              variant={theme === 'dark' ? 'dark' : 'white'}
              className="px-4 py-2"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="px-4 py-2"
            >
              Guardar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditDocumentoModal;
