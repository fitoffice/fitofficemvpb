import React, { useState } from 'react';
import axios from 'axios';
import { X } from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';
import { useDocumentoModal } from '../../../contexts/DocumentoModalContext';

interface AddDocumentoModalProps {
}

const AddDocumentoModal: React.FC<AddDocumentoModalProps> = () => {
  const { theme } = useTheme();
  const { isOpen, closeModal, refreshDocumentos } = useDocumentoModal();
  const [formData, setFormData] = useState({
    nombre: '',
    tipo: '',
    fechaFinalizacion: '',
    notas: '',
    crearAlerta: false,
    fechaAlerta: ''
  });
  const [error, setError] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validate that fechaAlerta is after fechaFinalizacion
    if (formData.crearAlerta && formData.fechaAlerta && formData.fechaFinalizacion) {
      if (new Date(formData.fechaAlerta) <= new Date(formData.fechaFinalizacion)) {
        setError('La fecha de finalización de la alerta debe ser posterior a la fecha de expiración');
        return;
      }
    }
    
    try {
      const token = localStorage.getItem('token');
      
      // Convertir la fecha al formato ISO y ajustar a medianoche UTC
      let dataToSend = { ...formData };
      if (formData.fechaFinalizacion) {
        const fechaFinalizacion = new Date(formData.fechaFinalizacion);
        fechaFinalizacion.setUTCHours(0, 0, 0, 0);
        dataToSend.fechaFinalizacion = fechaFinalizacion.toISOString();
      }
      
      // Convertir la fecha de alerta si existe
      if (formData.crearAlerta && formData.fechaAlerta) {
        const fechaAlerta = new Date(formData.fechaAlerta);
        fechaAlerta.setUTCHours(0, 0, 0, 0);
        dataToSend.fechaAlerta = fechaAlerta.toISOString();
      }

      const response = await axios.post(
        'https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/otros-documentos',
        dataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        }
      );

      if (response.status === 201 || response.status === 200) {
        refreshDocumentos();
        closeModal();
      } else {
        setError('Error al crear el documento');
      }
    } catch (error: any) {
      console.error('Error al crear documento:', error);
      setError(error.response?.data?.message || 'Error al crear el documento');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  if (!isOpen) return null;

  const tiposDocumento = [
    'Legal',
    'RRHH',
    'Financiero',
    'Técnico',
    'Administrativo',
    'Otro'
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`relative w-full max-w-md p-6 rounded-lg shadow-lg ${
        theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
      }`}>
        <button
          onClick={closeModal}
          className={`absolute top-4 right-4 p-1 rounded-full hover:bg-opacity-80 ${
            theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
          }`}
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className={`text-xl font-semibold mb-4 ${
          theme === 'dark' ? 'text-orange-400' : 'text-orange-600'
        }`}>
          Añadir Nuevo Documento
        </h2>

        {error && (
          <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1">Nombre *</label>
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
            <label className="block mb-1">Tipo *</label>
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
              {tiposDocumento.map(tipo => (
                <option key={tipo} value={tipo}>{tipo}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1">Fecha de expiración </label>
            <input
              type="date"
              name="fechaFinalizacion"
              value={formData.fechaFinalizacion}
              onChange={handleChange}
              className={`w-full p-2 rounded border ${
                theme === 'dark'
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300'
              }`}
            />
          </div>
          
          {/* Checkbox para Crear Alerta */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="crearAlerta"
              name="crearAlerta"
              checked={formData.crearAlerta}
              onChange={handleChange}
              className={`w-5 h-5 rounded border ${
                theme === 'dark'
                  ? 'bg-gray-700 border-gray-600 text-orange-500'
                  : 'bg-white border-gray-300 text-orange-600'
              }`}
            />
            <label
              htmlFor="crearAlerta"
              className={`ml-2 ${
                theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
              }`}
            >
              Crear alerta de documento
            </label>
          </div>
          
          {/* Fecha de Alerta (condicional) */}
          {formData.crearAlerta && (
            <div>
              <label className="block mb-1">Fecha de finalización de la alerta *</label>
              <input
                type="date"
                name="fechaAlerta"
                value={formData.fechaAlerta}
                onChange={handleChange}
                min={formData.fechaFinalizacion || new Date().toISOString().split('T')[0]}
                className={`w-full p-2 rounded border ${
                  theme === 'dark'
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300'
                }`}
                required={formData.crearAlerta}
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                La fecha debe ser posterior a la fecha de expiración del documento
              </p>
            </div>
          )}

          <div>
            <label className="block mb-1">Notas</label>
            <textarea
              name="notas"
              value={formData.notas}
              onChange={handleChange}
              className={`w-full p-2 rounded border ${
                theme === 'dark'
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300'
              }`}
              rows={3}
            />
          </div>

          <button
            type="submit"
            className={`w-full py-2 px-4 rounded font-semibold ${
              theme === 'dark'
                ? 'bg-orange-600 hover:bg-orange-700 text-white'
                : 'bg-orange-500 hover:bg-orange-600 text-white'
            }`}
          >
            Crear Documento
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddDocumentoModal;
