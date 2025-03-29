import React, { useState } from 'react';
import { useTheme } from '../../../contexts/ThemeContext';
import { X } from 'lucide-react';
import Button from '../../Common/Button';

interface Session {
  _id: string;
  name: string;
  tipo: 'Normal' | 'Superset';
  exercises: any[];
  rondas?: number;
  createdAt: string;
  updatedAt: string;
}

interface EditSessionPopupProps {
  session: Session;
  onSave: (updatedSession: Session) => void;
  onClose: () => void;
}

const EditSessionPopup: React.FC<EditSessionPopupProps> = ({
  session,
  onSave,
  onClose,
}) => {
  const { theme } = useTheme();
  const [name, setName] = useState(session.name);
  const [tipo, setTipo] = useState(session.tipo);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...session,
      name,
      tipo,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        className={`w-full max-w-md p-6 rounded-lg shadow-lg ${
          theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
        }`}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Editar Sesión</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Nombre de la sesión
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`w-full p-2 rounded border ${
                theme === 'dark'
                  ? 'bg-gray-700 border-gray-600'
                  : 'bg-white border-gray-300'
              }`}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Tipo de sesión
            </label>
            <select
              value={tipo}
              onChange={(e) => setTipo(e.target.value as 'Normal' | 'Superset')}
              className={`w-full p-2 rounded border ${
                theme === 'dark'
                  ? 'bg-gray-700 border-gray-600'
                  : 'bg-white border-gray-300'
              }`}
            >
              <option value="Normal">Normal</option>
              <option value="Superset">Superset</option>
            </select>
          </div>

          <div className="flex justify-end space-x-2 mt-4">
            <Button variant="danger" onClick={onClose}>
              Cancelar
            </Button>
            <Button variant="success" type="submit">
              Guardar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditSessionPopup;
