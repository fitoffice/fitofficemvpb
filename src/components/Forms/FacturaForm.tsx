import React, { useState, useEffect } from 'react'; 
import { PlusCircle, Upload, Trash2, Receipt, Building2, FileText, Users } from 'lucide-react';
import jwt_decode from 'jwt-decode';
import { FormData, Servicio, Direccion, Cliente, TokenPayload, FacturaFormProps } from './FacturaTypes';
import Seccion1Facturas from './Seccion1Facturas';
import Seccion2Servicios from './Seccion2Servicios';
import SeccionDestinatario from './SeccionDestinatario';
import SeccionEmpresa from './SeccionEmpresa';
import SeccionClientes from './SeccionClientes';

const FacturaForm: React.FC<FacturaFormProps> = ({ onSubmit }) => {
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

    // Datos del Destinatario
    tipoPersona: 'fisica',
    tipoDestinatario: 'fisica',
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
      pais: ''
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
    proteccionDatos: false,
    currency: 'EUR'
  });

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);

  useEffect(() => {
    const fetchLastInvoiceNumber = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/invoice/last-number', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        
        if (!response.ok) {
          throw new Error('Error al obtener el último número de factura');
        }

        const data = await response.json();
        const lastNumber = data.lastNumber || '0000';
        const currentYear = new Date().getFullYear().toString();
        const numberPart = lastNumber.slice(-4);
        const yearPart = lastNumber.slice(0, 4);
        
        let nextNumber;
        if (yearPart === currentYear) {
          nextNumber = (parseInt(numberPart) + 1).toString().padStart(4, '0');
        } else {
          nextNumber = '0001';
        }

        setFormData(prev => ({
          ...prev,
          numeroFactura: nextNumber,
        }));
      } catch (error) {
        console.error('Error:', error);
        // Si hay un error, usar el número por defecto
        setFormData(prev => ({
          ...prev,
          numeroFactura: '0001',
        }));
      }
    };

    fetchLastInvoiceNumber();
  }, []);

  useEffect(() => {
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
        const data = await response.json();
        console.log('Clientes recibidos:', data);
        setClientes(data);
      } catch (error) {
        console.error('Error al obtener los clientes:', error);
      }
    };

    fetchClientes();
  }, []);

  const calcularTotales = (servicios: Servicio[]) => {
    let baseImponible = 0;
    let totalIva = 0;

    servicios.forEach(servicio => {
      const subtotal = (servicio.precioUnitario * servicio.cantidad) * (1 - servicio.descuento / 100);
      baseImponible += subtotal;
      if (!servicio.exentoIva) {
        totalIva += subtotal * (servicio.iva / 100);
      }
      servicio.total = subtotal + (servicio.exentoIva ? 0 : subtotal * (servicio.iva / 100));
    });

    setFormData(prev => ({
      ...prev,
      baseImponible,
      totalIva,
      importeTotal: baseImponible + totalIva
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    console.log(`Campo modificado: ${name}, Nuevo valor: ${value}`);
    
    if (name === 'numeroFactura' || name === 'fecha') {
      // Asegurarse de que solo se ingresen números y máximo 4 dígitos
      const numeroLimpio = value.replace(/\D/g, '').slice(0, 4);
      console.log('Número de factura procesado:', numeroLimpio);
      
      setFormData(prevData => ({
        ...prevData,
        [name]: numeroLimpio
      }));
    } else {
      setFormData(prevData => ({
        ...prevData,
        [name]: value
      }));
    }
    
    console.log('Nuevo estado del formulario:', formData);
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

    // Recalcular totales generales
    let baseImponible = 0;
    let totalIva = 0;

    newServicios.forEach(servicio => {
      const subtotal = servicio.cantidad * servicio.precioUnitario;
      const descuento = (subtotal * servicio.descuento) / 100;
      const total = subtotal - descuento;
      baseImponible += total;
      
      if (!servicio.exentoIva) {
        totalIva += total * (servicio.iva / 100);
      }
    });

    const importeTotal = baseImponible + totalIva;

    // Actualizar el tipo de factura basado en el importe total
    const facturaSimplificada = importeTotal <= 400;

    setFormData(prev => ({
      ...prev,
      servicios: newServicios,
      baseImponible,
      totalIva,
      importeTotal,
      facturaSimplificada
    }));
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
      setFormData(prev => ({
        ...prev,
        servicios: prev.servicios.filter((_, i) => i !== index)
      }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setSelectedFiles(filesArray);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('token');
      console.log('Token:', token);
      
      if (!token) {
        throw new Error('No se encontró el token');
      }

      // Decodificar el token para obtener el trainerId
      const decodedToken = jwt_decode<TokenPayload>(token);
      const trainerId = decodedToken.id;
      console.log('TrainerId decodificado del token:', trainerId);
      
      console.log('Form Data antes de procesar:', formData);

      // Combinar el año y el número de factura
      const numeroFacturaCompleto = `${formData.fecha}${formData.numeroFactura}`;
      console.log('Número de factura generado:', numeroFacturaCompleto);
      
      const formDataToSend = {
        ...formData,
        numeroFactura: numeroFacturaCompleto,
        trainerId: trainerId,
        servicios: JSON.stringify(formData.servicios)
      };

      console.log('Datos que se enviarán al servidor:', formDataToSend);
      console.log('URL de la API:', 'https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/invoice');

      const response = await fetch('https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/invoice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formDataToSend)
      });

      console.log('Respuesta del servidor - status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error del servidor:', errorData);
        throw new Error('Error al crear la factura');
      }

      const data = await response.json();
      console.log('Respuesta exitosa del servidor:', data);
      alert('Factura creada exitosamente');
      
      // Mostrar el estado final del formulario antes de reiniciarlo
      console.log('Estado del formulario antes de reiniciar:', formData);
      
      setFormData({
        // Datos del Emisor
        nombreEmisor: '',
        direccionEmisor: '',
        nifEmisor: '',
        
        // Información Básica
        numeroFactura: '0001',
        fecha: new Date().getFullYear().toString(),
        fechaVencimiento: '',
        metodoPago: '',
        facturaSimplificada: false,

        // Datos del Destinatario
        tipoPersona: 'fisica',
        tipoDestinatario: 'fisica',
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
          pais: ''
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
        proteccionDatos: false,
        currency: 'EUR'
      });
      setSelectedFiles([]);
      onSubmit(data);
    } catch (error) {
      console.error('Error al crear la factura:', error);
      alert('Error al crear la factura');
    }
  };

  // Función para generar una factura de prueba
  const generarFacturaPrueba = () => {
    // Obtener la fecha actual en formato ISO
    const fechaActual = new Date().getFullYear().toString();

    // Seleccionar un cliente aleatorio
    const clienteSeleccionado = clientes.length > 0 ? clientes[0]._id : '';

    // Datos de prueba
    const datosPrueba: FormData = {
      // Datos del Emisor
      nombreEmisor: 'Empresa de Prueba S.A.',
      direccionEmisor: 'Calle de la Prueba, 123',
      nifEmisor: 'A12345678',
      
      // Información Básica
      numeroFactura: '0001',  
      fecha: fechaActual,
      fechaVencimiento: '',
      metodoPago: 'tarjeta',
      facturaSimplificada: false,

      // Datos del Destinatario
      tipoPersona: 'fisica',
      tipoDestinatario: 'fisica',
      nombre: 'Juan',
      apellidos: 'Pérez',
      telefono: '123456789',
      email: 'juan.perez@example.com',
      direccion: {
        calle: 'Calle de la Prueba, 123',
        numero: '123',
        ciudad: 'Madrid',
        codigoPostal: '28001',
        provincia: 'Madrid',
        pais: 'España'
      },
      nif: '12345678A',

      // Servicios
      servicios: [
        { 
          codigo: 'SVC001', 
          nombre: 'Servicio de Prueba 1', 
          iva: 21, 
          exentoIva: false, 
          cantidad: 2, 
          precioUnitario: 150.00, 
          descuento: 10, 
          total: 270 
        },
        { 
          codigo: 'SVC002', 
          nombre: 'Servicio de Prueba 2', 
          iva: 21, 
          exentoIva: false, 
          cantidad: 1, 
          precioUnitario: 300.00, 
          descuento: 0, 
          total: 300 
        }
      ],

      // Totales
      baseImponible: 450,
      totalIva: 94.5,
      importeTotal: 544.5,

      // Información Adicional
      comentarios: 'Esta es una factura de prueba.',
      condiciones: 'Condiciones de la factura de prueba.',
      proteccionDatos: true,
      currency: 'EUR'
    };

    setFormData(datosPrueba);
  };

  const handleClienteSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedClienteId = e.target.value;
    const selectedCliente = clientes.find(c => c._id === selectedClienteId);
    
    if (selectedCliente) {
      setFormData(prev => ({
        ...prev,
        nombre: selectedCliente.nombre,
        email: selectedCliente.email || ''
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        nombre: '',
        email: ''
      }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Botón para generar factura de prueba */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={generarFacturaPrueba}
          className="mb-4 px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
        >
          Generar Factura de Prueba
        </button>
      </div>

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
          <span className="text-sm font-medium text-gray-700">Base Imponible:</span>
          <span className="text-lg font-semibold">{formData.baseImponible.toFixed(2)} €</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-700">Total IVA:</span>
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
          <label className="block text-sm font-medium text-gray-700">
            Condiciones
          </label>
          <textarea
            name="condiciones"
            value={formData.condiciones}
            onChange={handleChange}
            rows={3}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            placeholder="Condiciones de pago y otras observaciones..."
          />
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Fecha de Vencimiento
          </label>
          <input
            type="date"
            name="fechaVencimiento"
            value={formData.fechaVencimiento}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
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
          <label className="text-sm text-gray-700">
            He leído y acepto la política de protección de datos
          </label>
        </div>
      </div>

      {/* Botón de Envío */}
      <div className="flex justify-end">
        <button
          type="submit"
          className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          Crear Factura
        </button>
      </div>
    </form>
  );
};

export default FacturaForm;
