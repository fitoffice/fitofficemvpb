import React, { useState, useEffect } from 'react'; 
import { motion } from 'framer-motion';
import { FileText, Download, Search, Filter, Plus } from 'lucide-react';
import Button from '../../components/Common/Button';
import TableWithActionButtons from '../../components/Common/TableWithActionButtons';
import { useTheme } from '../../contexts/ThemeContext';
import FacturaPopup from '../../components/modals/FacturaPopup';
import EscanearFacturaPopup from '../../components/modals/EscanearFacturaPopup';
import FacturasFilter, { FilterValues } from '../../components/Economics/Facturas/FacturasFilter';
import { Viewer, Worker } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import FacturasPopup2 from '../../components/modals/FacturasPopup2';
import FacturaEditPopup from '../../components/modals/FacturaEditPopup';
import JSZip from 'jszip';
import { Factura, InvoiceFormData, TabType } from '../../types/facturas';
import FacturasHeader from '../../components/Economics/Facturas/FacturasHeader';
import FacturasPdfView from '../../components/Economics/Facturas/FacturasPdfView';
import FacturaDetallePopup from '../../components/Economics/Facturas/FacturaDetallePopup';
interface FacturasPageProps {
  isFacturaPopupOpen: boolean;
  setIsFacturaPopupOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleFacturaSubmit: (formData: any) => void;
  isEscanearFacturaPopupOpen: boolean;
  setIsEscanearFacturaPopupOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleEscanearFacturaSubmit: (formData: any) => void;
}

type TabType = 'emitidas' | 'recibidas' | 'todas';

const FacturasPage: React.FC<FacturasPageProps> = ({
  isFacturaPopupOpen,
  setIsFacturaPopupOpen,
  handleFacturaSubmit,
  isEscanearFacturaPopupOpen,
  setIsEscanearFacturaPopupOpen,
  handleEscanearFacturaSubmit,
}) => {
  const { theme } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [isExportMode, setIsExportMode] = useState(false);
  const [exportFormat, setExportFormat] = useState<'CSV' | 'PDF'>('CSV');
  const [selectedInvoices, setSelectedInvoices] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [viewingFacturaId, setViewingFacturaId] = useState<string | null>(null);

  const [activeFilters, setActiveFilters] = useState<FilterValues>({
    estado: [],
    tipo: [],
    fechaDesde: '',
    fechaHasta: '',
    montoMin: '',
    montoMax: '',
  });
  const [activeTab, setActiveTab] = useState<TabType>('todas');
  const [isFacturasPopup2Open, setIsFacturasPopup2Open] = useState(false);
  const [isFacturaEditPopupOpen, setIsFacturaEditPopupOpen] = useState(false);
  const [isFacturaDetallePopupOpen, setIsFacturaDetallePopupOpen] = useState(false);

  const [facturas, setFacturas] = useState<Factura[]>([]);
  const [selectedFacturaId, setSelectedFacturaId] = useState<string | null>(null);
  const [editingFactura, setEditingFactura] = useState<Factura | null>(null);
  const handleFacturaFormSubmit = async (formData: InvoiceFormData) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No se encontró el token de autenticación.');
        return;
      }

      const url = formData._id 
        ? `https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/invoice/${formData._id}`
        : 'https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/invoice';

      const method = formData._id ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`Error al ${formData._id ? 'actualizar' : 'crear'} la factura`);
      }

      // Refresh the list of invoices
      await fetchFacturas();
      
      // Close the popup and reset editing state
      setIsFacturasPopup2Open(false);
      setEditingFactura(null);

      // Show success message
      alert(`Factura ${formData._id ? 'actualizada' : 'creada'} exitosamente`);
    } catch (error) {
      console.error('Error:', error);
      alert(`Error al ${formData._id ? 'actualizar' : 'crear'} la factura`);
    }
  };

  // Extract the fetchFacturas function to be reusable
  const fetchFacturas = async () => {
    try {
      // Obtener el token del localStorage
      const token = localStorage.getItem('token');

      if (!token) {
        console.error('No se encontró el token de autenticación.');
        return;
      }

      console.log('Fetching invoices with token:', token.substring(0, 10) + '...');

      // Realizar la petición GET al backend incluyendo el token en los encabezados
      const response = await fetch('https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/invoice', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      console.log('Response status:', response.status, response.statusText);

      if (!response.ok) {
        throw new Error(`Error en la petición: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Received data:', data);
      console.log('Number of invoices:', data.invoices?.length || 0);
      
      const invoices = data.invoices;

      const mappedFacturas = invoices.map((invoice: any) => {
        console.log('Processing invoice:', invoice._id, invoice.numeroFactura);
        
        // Calculate total amount from servicios if it exists
        let totalAmount = 0;
        if (invoice.servicios && invoice.servicios.length > 0) {
          totalAmount = invoice.servicios.reduce((sum: number, servicio: any) => {
            const cantidad = servicio.cantidad || 0;
            const precioUnitario = servicio.precioUnitario || 0;
            const descuento = servicio.descuento || 0;
            const subtotal = cantidad * precioUnitario * (1 - descuento / 100);
            return sum + subtotal;
          }, 0);
        }
        
        // Get client name from clienteSimplificado or cliente
        let clienteName = '';
        if (invoice.clienteSimplificado) {
          clienteName = `${invoice.clienteSimplificado.nombre} ${invoice.clienteSimplificado.apellidos || ''}`.trim();
        } else if (invoice.cliente) {
          clienteName = invoice.cliente;
        }
        
        return {
          id: invoice._id,
          numero: invoice.numeroFactura || invoice.number || '',
          monto: totalAmount || invoice.importeTotal || invoice.totalAmount || 0,
          estado: mapEstado(invoice.status || invoice.estado || ''),
          tipo: invoice.tipo || mapTipo(invoice.tipoFactura || ''),
          fecha: formatFecha(invoice.fecha),
          currency: invoice.currency || 'EUR',
          fechaCobro: invoice.fechaCobro,
          cliente: clienteName,
          fechaMaxPago: invoice.fechaVencimiento || invoice.fechaMaxPago,
          emisor: invoice.nombreEmpresa || invoice.nombreEmisor || invoice.emisor,
        };
      });

      console.log('Mapped facturas:', mappedFacturas);
      setFacturas(mappedFacturas);
    } catch (error) {
      console.error('Error fetching invoices:', error);
    }
  };

  useEffect(() => {
    fetchFacturas();
  }, []);
  
  // Función para mapear el estado de la factura
  const mapEstado = (status: string): string => {
    switch (status.toLowerCase()) {
      case 'paid':
      case 'pagada':
        return 'Pagada';
      case 'pending':
      case 'pendiente':
      case 'overdue':
      case 'partial':
        return 'Pendiente';
      default:
        return status || 'Desconocido';
    }
  };
    // Función para mapear el tipo de factura
    const mapTipo = (tipoFactura: string): string => {
      // First check if we already have the final type
      if (tipoFactura === 'Emitida' || tipoFactura === 'Recibida') {
        return tipoFactura;
      }
      // If not, map from tipoFactura
      switch (tipoFactura) {
        case 'completa':
        case 'proforma':
        case 'simple':
          return 'Emitida';
        default:
          return 'Otro';
      }
    };

    const handleEditFactura = async (facturaId: string) => {
      try {
        console.log('Editando factura con ID:', facturaId);
        
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('No se encontró el token de autenticación.');
          return;
        }
  
        // Fetch the complete invoice data
        const response = await fetch(`https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/invoice/${facturaId}`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
  
        if (!response.ok) {
          throw new Error(`Error al obtener la factura: ${response.status} ${response.statusText}`);
        }
  
        const data = await response.json();
        console.log('Datos de la factura a editar:', data.invoice);
        
        setEditingFactura(data.invoice);
        // Guardar también el ID de la factura que se está editando
        setSelectedFacturaId(facturaId);
        setIsFacturaEditPopupOpen(true);
      } catch (error) {
        console.error('Error al obtener la factura para editar:', error);
        alert('Error al obtener la factura para editar');
      }
    };  // Función para formatear la fecha
  const formatFecha = (fecha: string): string => {
    const date = new Date(fecha);
    return date.toLocaleDateString('es-ES');
  };

  const handleViewFactura = (facturaId: string) => {
    setViewingFacturaId(facturaId);
  };
  const handleViewDetalleFactura = (facturaId: string) => {
    setSelectedFacturaId(facturaId);
    setIsFacturaDetallePopupOpen(true);
  };

  const handleDownloadFactura = async (facturaId: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/invoice/${facturaId}/pdf`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Error al descargar la factura');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `factura-${facturaId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error al descargar la factura:', error);
      // Aquí podrías mostrar un mensaje de error al usuario
    }
  };

  const handleDeleteFactura = async (facturaId: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta factura?')) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/invoice/${facturaId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Error al eliminar la factura');
        }

        // Actualizar la lista de facturas después de eliminar
        setFacturas(facturas.filter(factura => factura.id !== facturaId));
      } catch (error) {
        console.error('Error al eliminar la factura:', error);
        // Aquí podrías mostrar un mensaje de error al usuario
      }
    }
  };

  const getTableColumns = () => {
    const baseColumns = activeTab === 'emitidas' 
      ? {
          headers: ['Número', 'Fecha de emisión', 'Fecha de cobro', 'Importe neto', 'Cliente', 'Acciones'],
          accessors: ['numero', 'fecha', 'fechaCobro', 'monto', 'cliente', 'acciones']
        }
      : activeTab === 'recibidas'
      ? {
          headers: ['Fecha de emisión', 'Fecha máx. de pago', 'Importe', 'Emisor', 'Estado', 'Acciones'],
          accessors: ['fecha', 'fechaMaxPago', 'monto', 'emisor', 'estado', 'acciones']
        }
      : {
          headers: ['Número', 'Fecha', 'Importe', 'Estado', 'Tipo', 'Acciones'],
          accessors: ['numero', 'fecha', 'monto', 'estado', 'tipo', 'acciones']
        };

    return baseColumns;
  };

  // ... código existente ...
  const formatTableData = (factura: Factura, accessors: string[]) => {
    return accessors.map(accessor => {
      if (accessor === 'acciones') {
        return (
          <div className="flex space-x-2">
            <Button
              variant="normal"
              onClick={() => handleViewDetalleFactura(factura.id)}
              className="px-2 py-1 text-sm"
            >
              <Info className="w-4 h-4" />
              Detalles
            </Button>
            <Button
              variant="normal"
              onClick={() => handleViewFactura(factura.id)}
              className="px-2 py-1 text-sm"
            >
              <FileText className="w-4 h-4" />
              Ver PDF
            </Button>
            <Button
              variant="normal"
              onClick={() => handleDownloadFactura(factura.id)}
              className="px-2 py-1 text-sm"
            >
              <Download className="w-4 h-4" />
              Descargar
            </Button>
            <Button
              variant="danger"
              onClick={() => handleDeleteFactura(factura.id)}
              className="px-2 py-1 text-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Borrar
            </Button>
          </div>
        );
      }
      if (accessor === 'monto') {
        return `${factura.currency === 'USD' ? '$' : '€'}${factura.monto.toLocaleString()}`;
      }
      if (accessor === 'estado') {
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
            factura.estado === 'Pagada' 
              ? 'bg-green-200 text-green-800' 
              : 'bg-red-200 text-red-800'
          }`}>
            {factura.estado}
          </span>
        );
      }
      if (accessor === 'tipo') {
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
            factura.tipo === 'Emitida' 
              ? 'bg-blue-200 text-blue-800' 
              : 'bg-purple-200 text-purple-800'
          }`}>
            {factura.tipo}
          </span>
        );
      }
      return factura[accessor] || '-';
    });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };



  const handleExportSelected = async () => {
    if (selectedInvoices.length === 0) return;

    try {
      const token = localStorage.getItem('token');
      
      if (exportFormat === 'PDF') {
        // Existing PDF export code...
      } else {
        // For CSV export, fetch detailed information for each invoice
        const detailedFacturas: Factura[] = [];
        
        for (const facturaId of selectedInvoices) {
          try {
            const response = await fetch(`https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/invoice/${facturaId}`, {
              headers: {
                'Authorization': `Bearer ${token}`,
              },
            });
            
            if (response.ok) {
              const data = await response.json();
              // Map the detailed invoice data to your Factura type
              const detailedFactura = {
                ...facturas.find(f => f.id === facturaId),
                clienteNIF: data.invoice.clienteNIF || data.invoice.nif || '',
                clienteDireccion: data.invoice.clienteDireccion || data.invoice.direccion || '',
                descripcion: data.invoice.descripcion || '',
                ivaRate: data.invoice.ivaRate || data.invoice.tipoIVA || 21,
                metodoPago: data.invoice.metodoPago || ''
              };
              detailedFacturas.push(detailedFactura as Factura);
            }
          } catch (error) {
            console.error(`Error fetching details for invoice ${facturaId}:`, error);
            // If we can't get details, use the basic invoice data
            const basicFactura = facturas.find(f => f.id === facturaId);
            if (basicFactura) detailedFacturas.push(basicFactura);
          }
        }
        
        const csvContent = generateCSV(detailedFacturas);
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `facturas_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(link);
        link.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(link);
      }
      
      setIsExportMode(false);
      setSelectedInvoices([]);
    } catch (error) {
      console.error('Error al exportar las facturas:', error);
    }
  };
  const generateCSV = (selectedFacturas: Factura[]): string => {
    // Updated headers with all required columns
    const headers = [
      'Número de Factura',
      'Fecha de Factura',
      'Nombre del Cliente',
      'NIF/CIF del Cliente',
      'Dirección del Cliente',
      'Servicio',
      'Cantidad',
      'Precio Unitario',
      'Base Imponible',
      'Tipo de IVA',
      'Importe de IVA',
      'Importe Total',
      'Fecha de Pago',
      'Método de Pago',
      'Estado de la Factura'
    ].join(',');
    
    const rows = selectedFacturas.map(factura => {
      // For each invoice, we need to fetch more detailed information
      // This might require additional API calls or data restructuring
      
      // Default values for fields that might not be available
      const nifCif = factura.clienteNIF || '-';
      const direccion = factura.clienteDireccion || '-';
      const servicio = factura.descripcion || 'Servicios varios';
      const cantidad = '1'; // Default if not specified
      const precioUnitario = factura.monto.toString();
      const baseImponible = (factura.monto / (1 + (factura.ivaRate || 21) / 100)).toFixed(2);
      const tipoIVA = `${factura.ivaRate || 21}%`;
      const importeIVA = (factura.monto - parseFloat(baseImponible)).toFixed(2);
      const fechaPago = factura.fechaCobro ? formatFecha(factura.fechaCobro) : '-';
      const metodoPago = factura.metodoPago || 'No especificado';
      
      return [
        factura.numero,
        factura.fecha,
        factura.cliente || '',
        nifCif,
        direccion,
        servicio,
        cantidad,
        precioUnitario,
        baseImponible,
        tipoIVA,
        importeIVA,
        factura.monto.toString(),
        fechaPago,
        metodoPago,
        factura.estado
      ].join(',');
    });
    
    return [headers, ...rows].join('\n');
  };

  const handleToggleInvoiceSelection = (facturaId: string) => {
    setSelectedInvoices(prev => 
      prev.includes(facturaId) 
        ? prev.filter(id => id !== facturaId)
        : [...prev, facturaId]
    );
  };

  const handleApplyFilters = (filters: FilterValues) => {
    setActiveFilters(filters);
    console.log('Filtros aplicados:', filters);
  };

  const filteredFacturas = facturas.filter(factura => {
    const matchesSearch = factura.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
      factura.estado.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTab = activeTab === 'todas' ? true :
      activeTab === 'emitidas' ? factura.tipo === 'Emitida' :
      factura.tipo === 'Recibida';

    const matchesEstado = activeFilters.estado.length === 0 || activeFilters.estado.includes(factura.estado);
    const matchesTipo = activeFilters.tipo.length === 0 || activeFilters.tipo.includes(factura.tipo);
    const matchesFechaDesde = !activeFilters.fechaDesde || factura.fecha >= activeFilters.fechaDesde;
    const matchesFechaHasta = !activeFilters.fechaHasta || factura.fecha <= activeFilters.fechaHasta;
    const matchesMontoMin = !activeFilters.montoMin || factura.monto >= Number(activeFilters.montoMin);
    const matchesMontoMax = !activeFilters.montoMax || factura.monto <= Number(activeFilters.montoMax);

    return matchesSearch && matchesTab && matchesEstado && matchesTipo && matchesFechaDesde && 
           matchesFechaHasta && matchesMontoMin && matchesMontoMax;
  });

  const handleCloseViewer = () => {
    setViewingFacturaId(null);
  };

  

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`p-6 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-800'}`}
    >
            <FacturasHeader 
        theme={theme}
        searchTerm={searchTerm}
        handleSearchChange={handleSearchChange}
        isExportMode={isExportMode}
        selectedInvoices={selectedInvoices}
        exportFormat={exportFormat}
        setExportFormat={setExportFormat}
        handleExportSelected={handleExportSelected}
        setIsExportMode={setIsExportMode}
        setSelectedInvoices={setSelectedInvoices}
        isFilterOpen={isFilterOpen}
        setIsFilterOpen={setIsFilterOpen}
        onApplyFilters={handleApplyFilters}
        setIsFacturasPopup2Open={setIsFacturasPopup2Open}
        setIsEscanearFacturaPopupOpen={setIsEscanearFacturaPopupOpen}
      />


      <div className="mb-6">
        
        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-4">
          <button
            className={`px-4 py-2 mr-2 ${activeTab === 'todas' ? 
              'border-b-2 border-blue-500 text-blue-500' : 
              'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('todas')}
          >
            Todas
          </button>
          <button
            className={`px-4 py-2 mr-2 ${activeTab === 'emitidas' ? 
              'border-b-2 border-blue-500 text-blue-500' : 
              'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('emitidas')}
          >
            Emitidas
          </button>
          <button
            className={`px-4 py-2 ${activeTab === 'recibidas' ? 
              'border-b-2 border-blue-500 text-blue-500' : 
              'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('recibidas')}
          >
            Recibidas
          </button>
        </div>

                <div className={`bg-${theme === 'dark' ? 'gray-800' : 'white'} rounded-lg shadow-md overflow-hidden`}>

<TableWithActionButtons
  columns={[
    ...(isExportMode ? [] : []),
    { header: 'Número', key: 'numero' },
    { header: 'Fecha', key: 'fecha' },
    { header: 'Importe', key: 'monto' },
    { header: 'Estado', key: 'estado' },
    { header: 'Tipo', key: 'tipo' }
  ]}
  data={filteredFacturas.map(factura => ({
    _id: factura.id,
    numero: factura.numero,
    fecha: factura.fecha,
    monto: `${factura.currency === 'USD' ? '$' : '€'}${(factura.monto || 0).toLocaleString()}`,
    estado: (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
        factura.estado === 'Pagada' 
          ? 'bg-green-200 text-green-800' 
          : 'bg-red-200 text-red-800'
      }`}>
        {factura.estado}
      </span>
    ),
    tipo: (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
        factura.tipo === 'Emitida' 
          ? 'bg-blue-200 text-blue-800' 
          : 'bg-purple-200 text-purple-800'
      }`}>
        {factura.tipo}
      </span>
    )
  }))}
            onView={(item) => handleViewFactura(item._id)}
            onDetails={(item) => handleViewDetalleFactura(item._id)}
            onEdit={(item) => handleEditFactura(item._id)}
            onDownload={(item) => handleDownloadFactura(item._id)}
            onDelete={(item) => handleDeleteFactura(item._id)}
            showCheckbox={isExportMode}
            selectedIds={selectedInvoices}
            onSelect={handleToggleInvoiceSelection}
            idField="_id"
            showActions={true}
          />
        </div>

        <div className="mt-6 flex justify-between items-center">
          <div className="text-sm">
            Mostrando {filteredFacturas.length} de {facturas.length} facturas
          </div>
          <div className="space-x-2">
            <Button variant="normal" disabled>Anterior</Button>
            <Button variant="normal" disabled>Siguiente</Button>
          </div>
        </div>

        {/* Popups */}
        <FacturaPopup
          isOpen={isFacturaPopupOpen}
          onClose={() => setIsFacturaPopupOpen(false)}
          onSubmit={handleFacturaSubmit}
        />
        <FacturasPopup2
        isOpen={isFacturasPopup2Open}
        onClose={() => {
          setIsFacturasPopup2Open(false);
          setEditingFactura(null);
        }}
        onSubmit={handleFacturaFormSubmit}
        facturaToEdit={editingFactura}
      />
     <FacturaEditPopup
        isOpen={isFacturaEditPopupOpen}
        onClose={() => {
          setIsFacturaEditPopupOpen(false);
          setEditingFactura(null);
          setSelectedFacturaId(null); // Also clear the selected ID when closing
        }}
        onSubmit={handleFacturaFormSubmit}
        facturaToEdit={editingFactura}
        facturaId={selectedFacturaId || ''} // Pass the selected ID
      />        <EscanearFacturaPopup
          isOpen={isEscanearFacturaPopupOpen}
          onClose={() => setIsEscanearFacturaPopupOpen(false)}
          onSubmit={handleEscanearFacturaSubmit}
        />
        {viewingFacturaId && (
               <FacturasPdfView
            facturaId={viewingFacturaId}
            onClose={handleCloseViewer}
          />
        )}
        <FacturaDetallePopup
          isOpen={isFacturaDetallePopupOpen}
          onClose={() => {
            setIsFacturaDetallePopupOpen(false);
            setSelectedFacturaId(null);
          }}
          facturaId={selectedFacturaId || ''}
          onEdit={handleEditFactura}
          onDownload={handleDownloadFactura}
          onDelete={handleDeleteFactura}
        />
      </div>
    </motion.div>

  );
};

export default FacturasPage;
