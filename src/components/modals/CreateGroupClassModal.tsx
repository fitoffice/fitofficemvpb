import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import Button from '../Common/Button';

interface CreateGroupClassModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateGroupClassModal: React.FC<CreateGroupClassModalProps> = ({ isOpen, onClose }) => {
  const { theme } = useTheme();
  const [className, setClassName] = useState('');
  const [description, setDescription] = useState('');
  const [maxParticipants, setMaxParticipants] = useState('');
  const [status, setStatus] = useState('Activa');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí iría la lógica para crear la clase grupal
    console.log('Creando clase grupal:', { className, description, maxParticipants, status });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} p-6 rounded-lg shadow-xl w-full max-w-md`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Crear Clase Grupal</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="className" className="block mb-2 font-medium">Nombre de la Clase:</label>
            <input
              type="text"
              id="className"
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              className={`w-full p-2 border rounded ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
              placeholder="Ingresa el nombre de la clase"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="description" className="block mb-2 font-medium">Descripción:</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`w-full p-2 border rounded ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
              placeholder="Ingresa una descripción de la clase"
              rows={4}
              required
            ></textarea>
          </div>
          <div className="mb-4">
            <label htmlFor="maxParticipants" className="block mb-2 font-medium">Número Máximo de Participantes:</label>
            <input
              type="number"
              id="maxParticipants"
              value={maxParticipants}
              onChange={(e) => setMaxParticipants(e.target.value)}
              className={`w-full p-2 border rounded ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
              placeholder="Máximo número de participantes"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="status" className="block mb-2 font-medium">Estatus:</label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className={`w-full p-2 border rounded ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
              required
            >
              <option value="Activa">Activa</option>
              <option value="Inactiva">Inactiva</option>
            </select>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="danger" onClick={onClose}>
              Cancelar
            </Button>
            <Button variant="success" type="submit">
              Crear Clase Grupal
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateGroupClassModal;