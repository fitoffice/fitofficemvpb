import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X } from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';
import { useContratos } from '../../../contexts/ContratosContext';

interface Contrato {
  _id: string;
  nombre: string;
  fechaInicio: string;
  fechaFin: string;
  estado: 'Activo' | 'Finalizado' | 'Cancelado' | 'Pendiente';
  trainer?: string;
  cliente?: string;
  notas?: string;
  createdAt: string;
  updatedAt: string;
}

interface EditContratoModalProps {
  isOpen: boolean;
  onClose: () => void;
  contrato: Contrato;
  onContratoUpdated: () => void;
}

const EditContratoModal: React.FC<EditContratoModalProps> = ({
  isOpen,
  onClose,
  contrato,
  onContratoUpdated
}) => {
  const { updateContrato } = useContratos();
  const { theme } = useTheme();
  
  const [nombre, setNombre] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [estado, setEstado] = useState<'Activo' | 'Pendiente' | 'Finalizado' | 'Cancelado'>('Activo');
  const [trainer, setTrainer] = useState('');
  const [cliente, setCliente] = useState('');
  const [notas, setNotas] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    if (contrato) {
      setNombre(contrato.nombre || '');
      setFechaInicio(contrato.fechaInicio ? new Date(contrato.fechaInicio).toISOString().split('T')[0] : '');
      setFechaFin(contrato.fechaFin ? new Date(contrato.fechaFin).toISOString().split('T')[0] : '');
      setEstado(contrato.estado || 'Activo');
      setTrainer(contrato.trainer || '');
      setCliente(contrato.cliente || '');
      setNotas(contrato.notas || '');
    }
  }, [contrato]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nombre || !fechaInicio || !fechaFin || !estado) {
      setError('Por favor, complete todos los campos obligatorios');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      
      const updatedContrato = {
        nombre,
        fechaInicio,
        fechaFin,
        estado,
        trainer: trainer || undefined,
        cliente: cliente || undefined,
        notas: notas || undefined
      };

      // Use the context function to update the contract
      await updateContrato(contrato._id, updatedContrato);
      
      // Notify parent component
      onContratoUpdated();
      // Close modal
      onClose();
      
    } catch (error: any) {
      console.error('Error al actualizar contrato:', error);
      setError(error.message || 'Error al actualizar el contrato');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className={`relative w-full max-w-md p-6 rounded-lg shadow-lg ${
        theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
      }`}>
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 p-1 rounded-full ${
            theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
          }`}
        >
          <X size={20} />
        </button>
        
        <h2 className="text-xl font-semibold mb-4">Editar Contrato</h2>
        
        {error && (
          <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block mb-1 font-medium">
                Nombre <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className={`w-full p-2 border rounded ${
                  theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-800'
                }`}
                placeholder="Nombre del contrato"
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 font-medium">
                  Fecha de Inicio <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={fechaInicio}
                  onChange={(e) => setFechaInicio(e.target.value)}
                  className={`w-full p-2 border rounded ${
                    theme === 'dark' 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-800'
                  }`}
                  required
                />
              </div>
              
              <div>
                <label className="block mb-1 font-medium">
                  Fecha de Fin <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={fechaFin}
                  onChange={(e) => setFechaFin(e.target.value)}
                  className={`w-full p-2 border rounded ${
                    theme === 'dark' 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-800'
                  }`}
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="block mb-1 font-medium">
                Estado <span className="text-red-500">*</span>
              </label>
              <select
                value={estado}
                onChange={(e) => setEstado(e.target.value as any)}
                className={`w-full p-2 border rounded ${
                  theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-800'
                }`}
                required
              >
                <option value="Activo">Activo</option>
                <option value="Pendiente">Pendiente</option>
                <option value="Finalizado">Finalizado</option>
                <option value="Cancelado">Cancelado</option>
              </select>
            </div>
            
            <div>
              <label className="block mb-1 font-medium">
                Trainer
              </label>
              <input
                type="text"
                value={trainer}
                onChange={(e) => setTrainer(e.target.value)}
                className={`w-full p-2 border rounded ${
                  theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-800'
                }`}
                placeholder="Nombre del trainer"
              />
            </div>
            
            <div>
              <label className="block mb-1 font-medium">
                Cliente
              </label>
              <input
                type="text"
                value={cliente}
                onChange={(e) => setCliente(e.target.value)}
                className={`w-full p-2 border rounded ${
                  theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-800'
                }`}
                placeholder="Nombre del cliente"
              />
            </div>
            
            <div>
              <label className="block mb-1 font-medium">
                Notas
              </label>
              <textarea
                value={notas}
                onChange={(e) => setNotas(e.target.value)}
                className={`w-full p-2 border rounded ${
                  theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-800'
                }`}
                placeholder="Notas adicionales"
                rows={3}
              />
            </div>
            
            <div>
              <label className="block mb-1 font-medium">
                Actualizar Documento (opcional)
              </label>
              <input
                type="file"
                onChange={handleFileChange}
                className={`w-full p-2 border rounded ${
                  theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-800'
                }`}
              />
              <p className={`mt-1 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                Formatos aceptados: PDF, DOC, DOCX
              </p>
            </div>
            
            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={onClose}
                className={`px-4 py-2 mr-2 rounded ${
                  theme === 'dark' 
                    ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                }`}
                disabled={isSubmitting}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditContratoModal;
