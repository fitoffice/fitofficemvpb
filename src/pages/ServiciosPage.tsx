// src/pages/ServiciosPage.tsx
import React, { useState } from 'react';
import ServiciosLista from '../components/Clients/ServiciosLista';
import EditServicePopup from '../components/modals/EditServicePopup';
import EditPopupClaseGrupal from '../components/modals/EditPopupClaseGrupal';
import EditarClasePopup from '../components/Classes/EditarClasePopup';
import EditCitas from '../components/modals/EditCitas';
import EditPanelAsesoria from '../components/modals/EditPanelAsesoria';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import type { ServicioAsesoriaSubscripcion, ClaseGrupal, Cita } from '../types/servicios';

const ServiciosPage: React.FC = () => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  
  // Estado para edición de servicios
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<ServicioAsesoriaSubscripcion | null>(null);
  
  // Estado para edición de clases grupales (EditPopupClaseGrupal)
  const [isEditClaseModalOpen, setIsEditClaseModalOpen] = useState(false);
  const [selectedClase, setSelectedClase] = useState<ClaseGrupal | null>(null);

  // Estado para edición de clases (EditarClasePopup)
  const [isEditarClaseOpen, setIsEditarClaseOpen] = useState(false);
  const [selectedClaseId, setSelectedClaseId] = useState<string | null>(null);

  // Estado para edición de citas
  const [isEditCitaModalOpen, setIsEditCitaModalOpen] = useState(false);
  const [selectedCita, setSelectedCita] = useState<Cita | null>(null);

  // Estado para edición de asesoría individual
  const [isEditAsesoriaModalOpen, setIsEditAsesoriaModalOpen] = useState(false);
  const [selectedAsesoria, setSelectedAsesoria] = useState<ServicioAsesoriaSubscripcion | null>(null);

  const handleEditService = (servicio: ServicioAsesoriaSubscripcion) => {
    // Si es una asesoría individual, usar el EditPanelAsesoria
    if (servicio.tipo === 'Asesoría Individual') {
      setSelectedAsesoria(servicio);
      setIsEditAsesoriaModalOpen(true);
    } else {
      // Para otros tipos de servicios, usar el EditServicePopup
      setSelectedService(servicio);
      setIsEditModalOpen(true);
    }
  };

  const handleEditClase = (clase: ClaseGrupal) => {
    setSelectedClase(clase);
    setIsEditClaseModalOpen(true);
  };

  const handleEditarClase = (claseId: string) => {
    setSelectedClaseId(claseId);
    setIsEditarClaseOpen(true);
  };

  const handleEditCita = (citaId: string) => {
    setSelectedCita(citaId);
    setIsEditCitaModalOpen(true);
  };

  const handleEditAsesoria = (asesoria: ServicioAsesoriaSubscripcion) => {
    setSelectedAsesoria(asesoria);
    setIsEditAsesoriaModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedService(null);
  };

  const handleCloseEditClaseModal = () => {
    setIsEditClaseModalOpen(false);
    setSelectedClase(null);
  };

  const handleCloseEditarClase = () => {
    setIsEditarClaseOpen(false);
    setSelectedClaseId(null);
  };

  const handleCloseEditCitaModal = () => {
    setIsEditCitaModalOpen(false);
    setSelectedCita(null);
  };

  const handleCloseEditAsesoriaModal = () => {
    setIsEditAsesoriaModalOpen(false);
    setSelectedAsesoria(null);
  };

  const handleUpdateService = async (updatedService: ServicioAsesoriaSubscripcion) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No se encontró el token de autenticación');
      }

      const response = await fetch(`https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/servicios/services/${updatedService._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updatedService),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar el servicio');
      }

      console.log('Servicio actualizado exitosamente:', updatedService);
    } catch (error) {
      console.error('Error al actualizar el servicio:', error);
    }

    handleCloseEditModal();
  };

  const handleUpdateClase = async (updatedClase: ClaseGrupal) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No se encontró el token de autenticación');
      }

      const response = await fetch(`https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/servicios/classes/${updatedClase.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updatedClase),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar la clase');
      }

      console.log('Clase actualizada exitosamente:', updatedClase);
    } catch (error) {
      console.error('Error al actualizar la clase:', error);
    }

    handleCloseEditClaseModal();
  };

  const handleUpdateCita = async (updatedCita: Cita) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No se encontró el token de autenticación');
      }

      const response = await fetch(`https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/servicios/citas/${updatedCita._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updatedCita),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar la cita');
      }

      console.log('Cita actualizada exitosamente:', updatedCita);
    } catch (error) {
      console.error('Error al actualizar la cita:', error);
    }

    handleCloseEditCitaModal();
  };

  const handleClaseUpdated = () => {
    // Refresh data or update UI as needed
    handleCloseEditarClase();
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Acceso Denegado</h2>
          <p>Por favor, inicia sesión para ver los servicios.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <ServiciosLista 
        onEditService={handleEditService}
        onEditClase={handleEditarClase}
        onEditCita={handleEditCita}
        onEditAsesoria={handleEditAsesoria}
      />
      
      <EditServicePopup
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        servicio={selectedService}
        onSubmit={handleUpdateService}
        isDarkMode={isDarkMode}
      />

      <EditPopupClaseGrupal
        isOpen={isEditClaseModalOpen}
        onClose={handleCloseEditClaseModal}
        clase={selectedClase}
        onSubmit={handleUpdateClase}
        isDarkMode={isDarkMode}
      />

      {isEditarClaseOpen && selectedClaseId && (
        <EditarClasePopup
          claseId={selectedClaseId}
          onClose={handleCloseEditarClase}
          onEdit={handleClaseUpdated}
        />
      )}

      <EditCitas
        isOpen={isEditCitaModalOpen}
        onClose={handleCloseEditCitaModal}
        cita={selectedCita}
        onSubmit={handleUpdateCita}
        isDarkMode={isDarkMode}
      />

      {/* Popup para editar asesoría individual */}
      <EditPanelAsesoria
        isOpen={isEditAsesoriaModalOpen}
        onClose={handleCloseEditAsesoriaModal}
        asesoria={selectedAsesoria}
        onUpdate={handleUpdateService}
      />
    </div>
  );
};

export default ServiciosPage;
