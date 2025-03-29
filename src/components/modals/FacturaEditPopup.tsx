import React, { useState, useEffect } from 'react';
import { PlusCircle, Upload, Trash2, Receipt, Building2, FileText, Users, X } from 'lucide-react';
import jwt_decode from 'jwt-decode';
import { FormData, Servicio, Direccion, Cliente, TokenPayload } from '../Forms/FacturaTypes';
import Seccion1Facturas from '../Forms/Seccion1Facturas';
import Seccion2Servicios from '../Forms/Seccion2Servicios';
import SeccionEmpresa from '../Forms/SeccionEmpresa';
import SeccionClientes from '../Forms/SeccionClientes';
import { useTheme } from '../../contexts/ThemeContext';

interface FacturaEditPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: any) => void;
  facturaToEdit: any;
  facturaId?: string;
}

const FacturaEditPopup: React.FC<FacturaEditPopupProps> = ({
  isOpen,
  onClose,
  onSubmit,
  facturaToEdit,
  facturaId = ''
}) => {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  
  // Estado inicial del formulario
  const [formData, setFormData] = useState<FormData>({
    // Datos del Emisor
    nombreEmisor: '',
    direccionEmisor: '',
    nifEmisor: '',
    
    // Información Básica
    numeroFactura: '',
    fecha: '',
    fechaVencimiento: '',
    metodoPago: '',
    facturaSimplificada: false,
    tipoFactura: 'completa',

    // Datos del Destinatario
    tipoPersona: 'fisica',
    tipoDestinatario: 'cliente',
    nombre: '',
    apellidos: '',
    telefono: '',
    email: '',
    direccion: {
      calle: '',
      numero: '',
      ciudad: '',
      codigoPostal: '',
      provincia: '',
      pais: 'España',
    },
    nif: '',

    // Servicios
    servicios: [{
      codigo: '',
      nombre: '',
      iva: 21,
      exentoIva: false,
      cantidad: 1,
      precioUnitario: 0,
      descuento: 0,
      total: 0
    }],

    // Totales
    baseImponible: 0,
    totalIva: 0,
    importeTotal: 0,

    // Información Adicional
    comentarios: '',
    condiciones: '',
    proteccionDatos: true,
    currency: 'EUR'
  });

  // Cargar los clientes al iniciar
  useEffect(() => {
    if (isOpen) {
      fetchClientes();
    }
  }, [isOpen]);

  // Cargar datos de la factura cuando se abre el modal
  useEffect(() => {
    if (isOpen) {
      console.log('Editing factura with ID:', facturaId);
      
      if (facturaId) {
        setLoading(true);
        fetchFacturaData(facturaId);
      } else if (facturaToEdit && facturaToEdit._id) {
        console.log('Using provided factura data:', facturaToEdit);
        updateFormWithFacturaData(facturaToEdit);
      } else {
        console.warn('No factura ID or data provided for editing');
      }
    }
  }, [isOpen, facturaId, facturaToEdit]);

  const fetchClientes = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No se encontró el token de autenticación.');
        return;
      }

      const response = await fetch('https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/clientes', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`Error al obtener los clientes: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Clientes recibidos:', data);
      setClientes(data);
    } catch (error) {
      console.error('Error al obtener los clientes:', error);
    }
  };

  const fetchFacturaData = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No se encontró el token de autenticación');
      }
  
      console.log('Fetching factura details for ID:', id);
  
      const response = await fetch(`https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/invoice/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
  
      console.log('Response status:', response.status);
  
      if (!response.ok) {
        throw new Error(`Error al obtener los detalles de la factura: ${response.status}`);
      }
  
      const data = await response.json();
      console.log('Factura data received:', data);
      
      // Verificar que los datos de la factura existen
      if (!data || !data._id) {
        throw new Error('No se recibieron datos de la factura');
      }
      
      // Actualizar el formulario con los datos recibidos
      updateFormWithFacturaData(data);
    } catch (error) {
      console.error('Error al obtener la factura:', error);
      setError(error instanceof Error ? error.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };
  
  // Función para actualizar el formulario con los datos de la factura
  const updateFormWithFacturaData = (facturaData: any) => {
    console.log('Updating form with factura data:', facturaData);
    
    // Procesar servicios si es necesario
    let serviciosData = facturaData.servicios;
    if (typeof facturaData.servicios === 'string') {
      try {
        serviciosData = JSON.parse(facturaData.servicios);
      } catch (error) {
        console.error('Error parsing servicios:', error);
        serviciosData = [];
      }
    }
    
    // Si no hay servicios o es un array vacío, crear uno por defecto
    if (!serviciosData || !Array.isArray(serviciosData) || serviciosData.length === 0) {
      serviciosData = [{
        codigo: '',
        nombre: '',
        iva: 21,
        exentoIva: false,
        cantidad: 1,
        precioUnitario: 0,
        descuento: 0,
        total: 0
      }];
    }
    
    // Formatear fechas si existen
    const fechaEmision = facturaData.fecha ? new Date(facturaData.fecha).toISOString().split('T')[0] : '';
    const fechaVencimiento = facturaData.fechaVencimiento ? new Date(facturaData.fechaVencimiento).toISOString().split('T')[0] : '';
    
    // Preparar datos del cliente
    const clienteData = facturaData.clienteSimplificado || {};
    
    // Actualizar el formulario con todos los datos
    setFormData({
      // Datos del Emisor
      nombreEmisor: facturaData.nombreEmisor || facturaData.nombreEmpresa || '',
      direccionEmisor: facturaData.direccionEmisor || '',
      nifEmisor: facturaData.nifEmisor || facturaData.nifEmpresa || '',
      
      // Información Básica
      numeroFactura: facturaData.numeroFactura || facturaData.number || '',
      fecha: fechaEmision,
      fechaVencimiento: fechaVencimiento,
      metodoPago: facturaData.metodoPago || '',
      facturaSimplificada: facturaData.facturaSimplificada || facturaData.tipoFactura === 'simple' || false,
      tipoFactura: facturaData.tipoFactura || 'completa',
      
      // Datos del Destinatario
      tipoPersona: facturaData.tipoPersona || 'fisica',
      tipoDestinatario: facturaData.tipoDestinatario || 'cliente',
      nombre: facturaData.nombre || clienteData.nombre || '',
      apellidos: facturaData.apellidos || clienteData.apellidos || '',
      telefono: facturaData.telefono || '',
      email: facturaData.email || clienteData.email || '',
      nif: facturaData.nif || clienteData.nif || '',
      
      // Dirección
      direccion: facturaData.direccion || {
        calle: '',
        numero: '',
        ciudad: '',
        codigoPostal: '',
        provincia: '',
        pais: 'España',
      },
      
      // Servicios y totales
      servicios: serviciosData,
      baseImponible: facturaData.baseImponible || 0,
      totalIva: facturaData.totalIva || 0,
      importeTotal: facturaData.importeTotal || 0,
      
      // Información adicional
      comentarios: facturaData.comentarios || facturaData.comentario || '',
      condiciones: facturaData.condiciones || '',
      proteccionDatos: true,
      currency: facturaData.currency || 'EUR'
    });
    
    // Recalcular totales para asegurar que son correctos
    calculateTotals(serviciosData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (type === 'checkbox') {
      setFormData({
        ...formData,
        [name]: (e.target as HTMLInputElement).checked
      });
    } else if (name.includes('.')) {
      // Handle nested properties (e.g., direccion.calle)
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleServicioChange = (index: number, field: keyof Servicio, value: any) => {
    const newServicios = [...formData.servicios];
    newServicios[index] = {
      ...newServicios[index],
      [field]: value
    };

    // Recalcular el total para este servicio
    if (field === 'cantidad' || field === 'precioUnitario' || field === 'descuento') {
      const servicio = newServicios[index];
      const subtotal = servicio.cantidad * servicio.precioUnitario;
      const descuento = (subtotal * servicio.descuento) / 100;
      servicio.total = subtotal - descuento;
    }

    // Actualizar servicios y recalcular totales
    setFormData(prev => ({
      ...prev,
      servicios: newServicios
    }));
    
    calculateTotals(newServicios);
  };

  const handleDireccionChange = (field: keyof Direccion, value: string) => {
    setFormData(prev => ({
      ...prev,
      direccion: {
        ...prev.direccion,
        [field]: value
      }
    }));
  };

  const addServicio = () => {
    setFormData(prev => ({
      ...prev,
      servicios: [...prev.servicios, { 
        codigo: '', 
        nombre: '', 
        iva: 21, 
        exentoIva: false, 
        cantidad: 1, 
        precioUnitario: 0, 
        descuento: 0, 
        total: 0 
      }]
    }));
  };

  const removeServicio = (index: number) => {
    if (formData.servicios.length > 1) {
      const updatedServicios = formData.servicios.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        servicios: updatedServicios
      }));
      calculateTotals(updatedServicios);
    }
  };

  const calculateTotals = (servicios: Servicio[]) => {
    let baseImponible = 0;
    let totalIva = 0;

    servicios.forEach(servicio => {
      const subtotal = servicio.cantidad * servicio.precioUnitario * (1 - servicio.descuento / 100);
      baseImponible += subtotal;
      
      if (!servicio.exentoIva) {
        totalIva += subtotal * (servicio.iva / 100);
      }
    });

    const importeTotal = baseImponible + totalIva;

    setFormData(prev => ({
      ...prev,
      baseImponible: parseFloat(baseImponible.toFixed(2)),
      totalIva: parseFloat(totalIva.toFixed(2)),
      importeTotal: parseFloat(importeTotal.toFixed(2))
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setSelectedFiles(filesArray);
    }
  };

  const handleClienteSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedClienteId = e.target.value;
    const selectedCliente = clientes.find(c => c._id === selectedClienteId);
    
    if (selectedCliente) {
      setFormData(prev => ({
        ...prev,
        nombre: selectedCliente.nombre,
        apellidos: selectedCliente.apellidos || '',
        email: selectedCliente.email || '',
        nif: selectedCliente.nif || '',
        telefono: selectedCliente.telefono || '',
        direccion: selectedCliente.direccion || prev.direccion
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Preparar datos para enviar
    const dataToSubmit = {
      ...formData,
      _id: facturaId || (facturaToEdit && facturaToEdit._id) || undefined,
      servicios: JSON.stringify(formData.servicios) // Ensure servicios is stringified for API
    };
    onSubmit(dataToSubmit);
  };

  if (!isOpen) return null;

  // Show loading indicator while fetching data
  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className={`relative w-full max-w-md p-6 mx-auto rounded-lg shadow-xl ${
          theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
        }`}>
          <div className="flex flex-col items-center justify-center">
            <div className="w-12 h-12 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
            <p className="mt-4 text-lg">Cargando datos de la factura...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 overflow-y-auto">
      <div className={`relative w-full max-w-5xl mx-auto my-8 p-6 rounded-lg shadow-xl ${
        theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
      }`} style={{ maxHeight: '90vh', overflowY: 'auto' }}>
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 p-2 rounded-full ${
            theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
          }`}
        >
          <X className="w-6 h-6" />
        </button>
        
        <h2 className="text-2xl font-bold mb-6">
          {facturaId ? 'Editar Factura' : 'Nueva Factura'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Sección 1: Información Básica */}
          <Seccion1Facturas
            formData={formData}
            handleChange={handleChange}
            setFormData={setFormData}
          />
          
          {/* Sección 2: Servicios */}
          <Seccion2Servicios
            servicios={formData.servicios}
            handleServicioChange={handleServicioChange}
            addServicio={addServicio}
            removeServicio={removeServicio}
          />
          
          {/* Sección: Datos del Destinatario */}
          {!formData.facturaSimplificada && (
            <SeccionClientes
              formData={formData}
              clientes={clientes}
              handleChange={handleChange}
              handleDireccionChange={handleDireccionChange}
              handleClienteSelect={handleClienteSelect}
              handleFileChange={handleFileChange}
              setFormData={setFormData}
            />
          )}
          
          {/* Sección 3: Datos de la Empresa */}
          <SeccionEmpresa
            formData={formData}
            handleChange={handleChange}
          />
          
          {/* Totales */}
          <div className="mt-6 space-y-4">
            <div className="flex justify-between items-center">
              <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Base Imponible:</span>
              <span className="text-lg font-semibold">{formData.baseImponible.toFixed(2)} €</span>
            </div>
            <div className="flex justify-between items-center">
              <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Total IVA:</span>
              <span className="text-lg font-semibold">{formData.totalIva.toFixed(2)} €</span>
            </div>
            <div className="flex justify-between items-center text-blue-600">
              <span className="text-sm font-medium">Importe Total:</span>
              <span className="text-xl font-bold">{formData.importeTotal.toFixed(2)} €</span>
            </div>
          </div>
          
          {/* Información Adicional */}
          <div className="mt-6 space-y-4">
            <div className="space-y-2">
              <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Condiciones
              </label>
              <textarea
                name="condiciones"
                value={formData.condiciones}
                onChange={handleChange}
                rows={3}
                className={`w-full px-3 py-2 rounded-lg border ${
                  theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'border-gray-300 text-gray-900'
                } focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
                placeholder="Condiciones de pago y otras observaciones..."
              />
            </div>
            
            <div className="space-y-2">
              <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Fecha de Vencimiento
              </label>
              <input
                type="date"
                name="fechaVencimiento"
                value={formData.fechaVencimiento}
                onChange={handleChange}
                className={`w-full px-3 py-2 rounded-lg border ${
                  theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'border-gray-300 text-gray-900'
                } focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="proteccionDatos"
                checked={formData.proteccionDatos}
                onChange={(e) => setFormData(prev => ({ ...prev, proteccionDatos: e.target.checked }))}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                required
              />
              <label className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                He leído y acepto la política de protección de datos
              </label>
            </div>
          </div>
          
          <div className="flex justify-end space-x-4 mt-8">
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 rounded ${
                theme === 'dark' ? 'bg-gray-600 hover:bg-gray-700' : 'bg-gray-300 hover:bg-gray-400'
              } transition-colors`}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              {facturaId ? 'Actualizar Factura' : 'Crear Factura'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FacturaEditPopup;
