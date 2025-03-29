import React, { useState, useEffect } from 'react';
import { X, FileText, Download, Edit, Trash2, CheckCircle, AlertCircle, Building2, Users } from 'lucide-react';
import Button from '../../Common/Button';
import { useTheme } from '../../../contexts/ThemeContext';

interface FacturaDetallePopupProps {
  isOpen: boolean;
  onClose: () => void;
  facturaId: string;
  onEdit: (facturaId: string) => void;
  onDownload: (facturaId: string) => void;
  onDelete: (facturaId: string) => void;
}

interface FacturaDetalle {
    _id: string;
    numeroFactura?: string;
    number?: string;
    fecha: string;
    fechaVencimiento?: string;
    estado?: string;
    status?: string;
    tipo?: string;
    tipoFactura?: string;
    importeTotal?: number;
    baseImponible?: number;
    totalIva?: number;
    currency: string;
    metodoPago: string;
    nombreEmisor?: string;
    nombreEmpresa?: string;
    nifEmpresa?: string;
    direccionEmisor?: string;
    nifEmisor?: string;
    nombre?: string;
    apellidos?: string;
    clienteSimplificado?: {
      nombre: string;
      apellidos: string;
      nif: string;
      email?: string;
      _id?: string;
    };
    direccion?: {
      calle: string;
      numero: string;
      ciudad: string;
      codigoPostal: string;
      provincia: string;
      pais: string;
    };
    nif?: string;
    servicios?: Array<{
      codigo?: string;
      nombre?: string;
      cantidad?: number;
      precioUnitario?: number;
      iva?: number;
      descuento?: number;
      total?: number;
      _id?: string;
    }>;
    comentarios?: string;
    comentario?: string;
    condiciones?: string;
  }
const FacturaDetallePopup: React.FC<FacturaDetallePopupProps> = ({
  isOpen,
  onClose,
  facturaId,
  onEdit,
  onDownload,
  onDelete
}) => {
  const { theme } = useTheme();
  const [factura, setFactura] = useState<FacturaDetalle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && facturaId) {
      fetchFacturaDetalle(facturaId);
    }
  }, [isOpen, facturaId]);

  const fetchFacturaDetalle = async (id: string) => {
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
      
      // The API returns the factura data directly, not inside an invoice property
      if (!data || !data._id) {
        throw new Error('No se recibieron datos de la factura');
      }
      
      // Set the factura data directly
      setFactura(data);
    } catch (error) {
      console.error('Error al obtener los detalles de la factura:', error);
      setError(error instanceof Error ? error.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const formatCurrency = (amount: number | undefined, currency: string = 'EUR') => {
    if (amount === undefined || amount === null) {
      return `${currency === 'USD' ? '$' : '€'}0.00`;
    }
    return `${currency === 'USD' ? '$' : '€'}${amount.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 overflow-y-auto">
      <div className={`relative w-11/12 max-w-4xl max-h-[90vh] overflow-y-auto rounded-lg shadow-xl ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} p-6`}>
        {/* Botón de cerrar */}
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 p-2 rounded-full ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
        >
          <X className="w-6 h-6" />
        </button>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-64">
            <AlertCircle className="w-12 h-12 text-yellow-500 mb-4" />
            <p className="text-center">No se encontraron datos para esta factura</p>
            <Button variant="normal" onClick={onClose} className="mt-4">
              Cerrar
            </Button>
          </div>
        ) : factura ? (
          <>
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl font-bold">Detalles de Factura</h2>
              <div className="flex space-x-2">
                <Button variant="normal" onClick={() => onEdit(facturaId)}>
                  <Edit className="w-4 h-4 mr-2" />
                  Editar
                </Button>
                <Button variant="normal" onClick={() => onDownload(facturaId)}>
                  <Download className="w-4 h-4 mr-2" />
                  Descargar
                </Button>
                <Button variant="danger" onClick={() => {
                  if (window.confirm('¿Estás seguro de que deseas eliminar esta factura?')) {
                    onDelete(facturaId);
                    onClose();
                  }
                }}>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Eliminar
                </Button>
              </div>
            </div>

            {/* Cabecera de la factura */}
            <div className={`p-4 rounded-lg mb-6 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm opacity-70">Número de Factura</p>
                  <p className="font-semibold">{factura.numeroFactura || factura.number || '-'}</p>
                </div>
                <div>
                  <p className="text-sm opacity-70">Fecha de Emisión</p>
                  <p className="font-semibold">{formatDate(factura.fecha)}</p>
                </div>
                <div>
                  <p className="text-sm opacity-70">Fecha de Vencimiento</p>
                  <p className="font-semibold">{formatDate(factura.fechaVencimiento || '')}</p>
                </div>
                <div>
                  <p className="text-sm opacity-70">Estado</p>
                  <div className="flex items-center">
                    {(factura.estado === 'Pagada' || factura.status === 'pagada') ? (
                      <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-yellow-500 mr-1" />
                    )}
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      (factura.estado === 'Pagada' || factura.status === 'pagada')
                        ? 'bg-green-200 text-green-800' 
                        : 'bg-yellow-200 text-yellow-800'
                    }`}>
                      {factura.estado || factura.status || 'Pendiente'}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-sm opacity-70">Tipo</p>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    (factura.tipo === 'Emitida' || factura.tipoFactura === 'simple')
                      ? 'bg-blue-200 text-blue-800' 
                      : 'bg-purple-200 text-purple-800'
                  }`}>
                    {factura.tipo || (factura.tipoFactura === 'simple' ? 'Emitida' : 'Recibida')}
                  </span>
                </div>
                <div>
                  <p className="text-sm opacity-70">Método de Pago</p>
                  <p className="font-semibold">{factura.metodoPago || '-'}</p>
                </div>
              </div>
            </div>

            {/* Información del emisor y destinatario */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Emisor */}
              <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <h3 className="text-lg font-semibold mb-3 flex items-center">
                  <Building2 className="w-5 h-5 mr-2" />
                  Datos del Emisor
                </h3>
                <div className="space-y-2">
                  <p><span className="opacity-70">Nombre:</span> {factura.nombreEmisor || factura.nombreEmpresa || '-'}</p>
                  <p><span className="opacity-70">Dirección:</span> {factura.direccionEmisor || '-'}</p>
                  <p><span className="opacity-70">NIF/CIF:</span> {factura.nifEmisor || factura.nifEmpresa || '-'}</p>
                </div>
              </div>

              {/* Destinatario */}
              <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <h3 className="text-lg font-semibold mb-3 flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  Datos del Destinatario
                </h3>
                <div className="space-y-2">
                  <p>
                    <span className="opacity-70">Nombre:</span> 
                    {factura.clienteSimplificado 
                      ? `${factura.clienteSimplificado.nombre || ''} ${factura.clienteSimplificado.apellidos || ''}`.trim() 
                      : `${factura.nombre || ''} ${factura.apellidos || ''}`.trim() || '-'}
                  </p>
                  <p>
                    <span className="opacity-70">NIF/CIF:</span> 
                    {factura.clienteSimplificado ? factura.clienteSimplificado.nif : factura.nif || '-'}
                  </p>
                  {factura.direccion && (
                    <p>
                      <span className="opacity-70">Dirección:</span> {`${factura.direccion.calle || ''} ${factura.direccion.numero || ''}, ${factura.direccion.codigoPostal || ''} ${factura.direccion.ciudad || ''}, ${factura.direccion.provincia || ''}, ${factura.direccion.pais || ''}`.replace(/,\s+,/g, ',').replace(/,\s+$/g, '') || '-'}
                    </p>
                  )}
                </div>
              </div>
            </div>
            {/* Tabla de servicios */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3 flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Detalle de Servicios
              </h3>
              <div className="overflow-x-auto">
                <table className={`min-w-full ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                  <thead className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}>
                    <tr>
                      <th className="px-4 py-2 text-left">Código</th>
                      <th className="px-4 py-2 text-left">Descripción</th>
                      <th className="px-4 py-2 text-right">Cantidad</th>
                      <th className="px-4 py-2 text-right">Precio Unitario</th>
                      <th className="px-4 py-2 text-right">IVA (%)</th>
                      <th className="px-4 py-2 text-right">Descuento (%)</th>
                      <th className="px-4 py-2 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {factura.servicios && factura.servicios.length > 0 ? (
                      factura.servicios.map((servicio, index) => (
                        <tr key={index} className={`${theme === 'dark' ? 'border-b border-gray-700' : 'border-b border-gray-200'}`}>
                          <td className="px-4 py-2">{servicio.codigo || '-'}</td>
                          <td className="px-4 py-2">{servicio.nombre || '-'}</td>
                          <td className="px-4 py-2 text-right">{servicio.cantidad}</td>
                          <td className="px-4 py-2 text-right">{formatCurrency(servicio.precioUnitario, factura.currency)}</td>
                          <td className="px-4 py-2 text-right">{servicio.iva}%</td>
                          <td className="px-4 py-2 text-right">{servicio.descuento}%</td>
                          <td className="px-4 py-2 text-right">{formatCurrency(servicio.total, factura.currency)}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="px-4 py-2 text-center">No hay servicios registrados</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Resumen de importes */}
            <div className={`p-4 rounded-lg mb-6 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
              <h3 className="text-lg font-semibold mb-3">Resumen</h3>
              <div className="flex flex-col items-end">
              <div className="grid grid-cols-2 gap-2 w-full max-w-xs">
                  <p className="text-right opacity-70">Base Imponible:</p>
                  <p className="text-right font-semibold">{formatCurrency(factura.baseImponible || 0, factura.currency)}</p>
                  
                  <p className="text-right opacity-70">Total IVA:</p>
                  <p className="text-right font-semibold">{formatCurrency(factura.totalIva || 0, factura.currency)}</p>
                  
                  <p className="text-right opacity-70 font-bold">Importe Total:</p>
                  <p className="text-right font-semibold text-lg">{formatCurrency(factura.importeTotal || 0, factura.currency)}</p>
                </div>
              </div>
            </div>

                      {/* Comentarios y condiciones */}
                      {(factura.comentarios || factura.comentario || factura.condiciones) && (
              <div className={`p-4 rounded-lg mb-6 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <h3 className="text-lg font-semibold mb-3">Información Adicional</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(factura.comentarios || factura.comentario) && (
                    <div>
                      <p className="font-medium mb-1">Comentarios:</p>
                      <p className="text-sm">{factura.comentarios || factura.comentario}</p>
                    </div>
                  )}
                  {factura.condiciones && (
                    <div>
                      <p className="font-medium mb-1">Condiciones:</p>
                      <p className="text-sm">{factura.condiciones}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
            <div className="flex justify-end mt-6">
              <Button variant="normal" onClick={onClose}>
                Cerrar
              </Button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-64">
            <AlertCircle className="w-12 h-12 text-yellow-500 mb-4" />
            <p className="text-center">No se encontraron datos para esta factura</p>
            <Button variant="normal" onClick={onClose} className="mt-4">
              Cerrar
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FacturaDetallePopup;