import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X } from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';
import { useLicenciaModal } from '../../../contexts/LicenciaModalContext';
import { useLicenciaEditModal } from '../../../contexts/LicenciaEditModalContext';
import { useLicencias } from '../../../contexts/LicenciasContext';
import { useAddLicenciaModal } from '../../../contexts/AddLicenciaModalContext';

const AddLicenciaModal: React.FC = () => {
  const { theme } = useTheme();
  const { isOpen, closeModal, onLicenciaAdded } = useLicenciaModal();
  const { isEditOpen, selectedLicencia, closeEditModal, onLicenciaEdited } = useLicenciaEditModal();
  const { addLicencia, updateLicencia } = useLicencias();
  // Add this line to use the new context
  const { isModalOpen, closeModal: closeAddModal } = useAddLicenciaModal();
  
  const [formData, setFormData] = useState({
    nombre: '',
    fechaExpiracion: '',
    estado: 'Activa',
    descripcion: '',
    campo: '',
    crearAlerta: false,
    fechaAlerta: ''
  });
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (selectedLicencia) {
      setFormData({
        nombre: selectedLicencia.nombre,
        fechaExpiracion: new Date(selectedLicencia.fechaExpiracion).toISOString().split('T')[0],
        estado: selectedLicencia.estado,
        descripcion: selectedLicencia.descripcion,
        campo: selectedLicencia.campo,
        crearAlerta: selectedLicencia.crearAlerta || false,
        fechaAlerta: selectedLicencia.fechaAlerta ? new Date(selectedLicencia.fechaAlerta).toISOString().split('T')[0] : ''
      });
    }
  }, [selectedLicencia]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      // Validate that fechaAlerta is after fechaExpiracion if crearAlerta is true
      if (formData.crearAlerta) {
        const expDate = new Date(formData.fechaExpiracion);
        const alertDate = new Date(formData.fechaAlerta);
        
        if (alertDate <= expDate) {
          setError('La fecha de finalización de la alerta debe ser posterior a la fecha de expiración');
          return;
        }
      }
      
      const token = localStorage.getItem('token');
      
      // Convertir la fecha al formato ISO y ajustar a medianoche UTC
      const fechaExpiracion = new Date(formData.fechaExpiracion);
      fechaExpiracion.setUTCHours(0, 0, 0, 0);

      const dataToSend = {
        ...formData,
        fechaExpiracion: fechaExpiracion.toISOString()
      };

      if (selectedLicencia) {
        // Modo edición - usar updateLicencia del contexto
        await updateLicencia(selectedLicencia._id, dataToSend);
        closeEditModal();
      } else {
        // Modo creación - usar addLicencia del contexto
        await addLicencia(dataToSend);
        // Close the appropriate modal
        if (isOpen) {
          closeModal();
        } else if (isModalOpen) {
          closeAddModal();
        }
      }
      
      // Resetear el formulario
      setFormData({
        nombre: '',
        fechaExpiracion: '',
        estado: 'Activa',
        descripcion: '',
        campo: ''
      });
      
    } catch (error: any) {
      console.error('Error:', error);
      setError(error.response?.data?.message || 'Error al procesar la licencia');
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

  const handleClose = () => {
    if (selectedLicencia) {
      closeEditModal();
    } else if (isOpen) {
      closeModal();
    } else if (isModalOpen) {
      closeAddModal();
    }
    
    setFormData({
      nombre: '',
      fechaExpiracion: '',
      estado: 'Activa',
      descripcion: '',
      campo: ''
    });
    setError('');
  };

  // Add console log to debug
  console.log('AddLicenciaModal render - isOpen:', isOpen, 'isEditOpen:', isEditOpen, 'isModalOpen:', isModalOpen);

  // Update this condition to include the new context
  if (!isOpen && !isEditOpen && !isModalOpen) {
    console.log('AddLicenciaModal not rendering - all modals closed');
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`w-full h-full md:h-auto md:max-h-[90vh] md:w-[95%] lg:w-[80%] xl:w-[70%] ${
        theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
      } rounded-lg shadow-2xl overflow-hidden transform transition-all duration-300 ease-in-out`}>
        {/* Header */}
        <div className={`px-6 py-4 border-b ${
          theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <div className="flex justify-between items-center">
            <h2 className={`text-2xl font-semibold ${
              theme === 'dark' ? 'text-purple-400' : 'text-purple-600'
            }`}>
              {selectedLicencia ? 'Editar Licencia' : 'Añadir Nueva Licencia'}
            </h2>
            <button
              onClick={handleClose}
              className={`p-2 rounded-full transition-colors duration-200 ${
                theme === 'dark' 
                  ? 'hover:bg-gray-700 text-gray-400 hover:text-white' 
                  : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
              }`}
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-4 max-h-[calc(90vh-10rem)] overflow-y-auto">
          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-100 border-l-4 border-red-500 text-red-700">
              <div className="flex items-center">
                <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Nombre */}
              <div>
                <label className={`block mb-2 font-medium ${
                  theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                }`}>
                  Nombre *
                </label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-purple-500 transition-colors duration-200 ${
                    theme === 'dark'
                      ? 'bg-gray-700 border-gray-600 text-white focus:border-purple-500'
                      : 'bg-white border-gray-300 focus:border-purple-500'
                  }`}
                  required
                />
              </div>

              {/* Fecha de Expiración */}
              <div>
                <label className={`block mb-2 font-medium ${
                  theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                }`}>
                  Fecha de Expiración *
                </label>
                <input
                  type="date"
                  name="fechaExpiracion"
                  value={formData.fechaExpiracion}
                  onChange={handleChange}
                  min={new Date().toISOString().split('T')[0]}
                  className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-purple-500 transition-colors duration-200 ${
                    theme === 'dark'
                      ? 'bg-gray-700 border-gray-600 text-white focus:border-purple-500'
                      : 'bg-white border-gray-300 focus:border-purple-500'
                  }`}
                  required
                />
              </div>

              {/* Estado */}
              <div>
                <label className={`block mb-2 font-medium ${
                  theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                }`}>
                  Estado
                </label>
                <select
                  name="estado"
                  value={formData.estado}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-purple-500 transition-colors duration-200 ${
                    theme === 'dark'
                      ? 'bg-gray-700 border-gray-600 text-white focus:border-purple-500'
                      : 'bg-white border-gray-300 focus:border-purple-500'
                  }`}
                >
                  <option value="Activa">Activa</option>
                  <option value="En Proceso">En Proceso</option>
                  <option value="Suspendida">Suspendida</option>
                  <option value="Expirada">Expirada</option>
                </select>
              </div>

              {/* Campo */}
              <div>
                <label className={`block mb-2 font-medium ${
                  theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                }`}>
                  Campo *
                </label>
                <input
                  type="text"
                  name="campo"
                  value={formData.campo}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-purple-500 transition-colors duration-200 ${
                    theme === 'dark'
                      ? 'bg-gray-700 border-gray-600 text-white focus:border-purple-500'
                      : 'bg-white border-gray-300 focus:border-purple-500'
                  }`}
                  required
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
                  className={`w-5 h-5 rounded border focus:ring-2 focus:ring-purple-500 transition-colors duration-200 ${
                    theme === 'dark'
                      ? 'bg-gray-700 border-gray-600 text-purple-500 focus:border-purple-500'
                      : 'bg-white border-gray-300 text-purple-600 focus:border-purple-500'
                  }`}
                />
                <label
                  htmlFor="crearAlerta"
                  className={`ml-2 font-medium ${
                    theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                  }`}
                >
                  Crear alerta de licencia
                </label>
              </div>
              
              {/* Fecha de Alerta (condicional) */}
              {formData.crearAlerta && (
                <div>
                  <label className={`block mb-2 font-medium ${
                    theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                  }`}>
                    Fecha de finalización de la alerta *
                  </label>
                  <input
                    type="date"
                    name="fechaAlerta"
                    value={formData.fechaAlerta}
                    onChange={handleChange}
                    min={formData.fechaExpiracion} // Changed from current date to expiration date
                    // Removed max constraint to allow dates after expiration
                    className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-purple-500 transition-colors duration-200 ${
                      theme === 'dark'
                        ? 'bg-gray-700 border-gray-600 text-white focus:border-purple-500'
                        : 'bg-white border-gray-300 focus:border-purple-500'
                    }`}
                    required={formData.crearAlerta}
                  />
                  <p className={`mt-1 text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>
                    La fecha debe ser posterior a la fecha de expiración
                  </p>
                </div>
              )}
            </div>

            {/* Descripción */}
            <div>
              <label className={`block mb-2 font-medium ${
                theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
              }`}>
                Descripción
              </label>
              <textarea
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                rows={4}
                className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-purple-500 transition-colors duration-200 ${
                  theme === 'dark'
                    ? 'bg-gray-700 border-gray-600 text-white focus:border-purple-500'
                    : 'bg-white border-gray-300 focus:border-purple-500'
                }`}
              />
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className={`px-6 py-4 border-t ${
          theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <div className="flex justify-end space-x-4">
            <button
              onClick={handleClose}
              className={`px-6 py-2 rounded-lg font-medium transition-colors duration-200 ${
                theme === 'dark'
                  ? 'bg-gray-700 hover:bg-gray-600 text-gray-200'
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              }`}
            >
              Cancelar
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              className={`px-6 py-2 rounded-lg font-medium transition-colors duration-200 ${
                theme === 'dark'
                  ? 'bg-purple-600 hover:bg-purple-700 text-white'
                  : 'bg-purple-600 hover:bg-purple-700 text-white'
              }`}
            >
              {selectedLicencia ? 'Guardar Cambios' : 'Crear Licencia'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddLicenciaModal;
