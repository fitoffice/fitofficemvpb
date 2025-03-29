import React, { useState, useEffect } from 'react';
import { FileText, Search, Filter } from 'lucide-react';
import Table from '../Common/Table';
import Button from '../Common/Button';
import { useTheme } from '../../contexts/ThemeContext';

interface Factura {
  id: string;
  numero: string;
  monto: number;
  estado: string;
  tipo: string;
  fecha: string;
  currency: string;
}

interface FacturasWidgetProps {
  isEditMode?: boolean;
  onRemove?: () => void;
  setIsEscanearFacturaPopupOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  isFilterOpen?: boolean;
  setIsFilterOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  filterOptions?: {
    estado: string;
    tipo: string;
    fechaInicio: string;
    fechaFin: string;
  };
}


interface FilterOptions {
  estado: string;
  tipo: string;
  fechaInicio: string;
  fechaFin: string;
}

const FacturasWidget: React.FC<FacturasWidgetProps> = ({ 
  isEditMode, 
  onRemove, 
  setIsEscanearFacturaPopupOpen,
  isFilterOpen,
  setIsFilterOpen,
  filterOptions = { estado: '', tipo: '', fechaInicio: '', fechaFin: '' }
}) => {
  const [facturas, setFacturas] = useState<Factura[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const fetchFacturas = async () => {
      try {
        console.log('Iniciando fetchFacturas...');
        // Obtener el token del localStorage
        const token = localStorage.getItem('token');
        console.log('Token obtenido:', token ? 'Token encontrado' : 'Token no encontrado');

        if (!token) {
          setError('No se encontró el token de autenticación');
          setLoading(false);
          return;
        }

        console.log('Realizando petición a la API...');
        // Realizar la petición GET al backend incluyendo el token en los encabezados
        const response = await fetch('https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/invoice', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
        console.log('Respuesta recibida:', response.status, response.statusText);

        // Verificar si la respuesta es exitosa
        if (!response.ok) {
          console.error('Error en la respuesta:', response.status, response.statusText);
          throw new Error(`Error en la petición: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Datos recibidos:', data);
        const invoices = data.invoices;
        console.log('Número de facturas recibidas:', invoices?.length || 0);

        const mappedFacturas = invoices.map((invoice: any) => {
          // Calcular el monto total basado en los servicios
          let montoTotal = 0;
          if (invoice.servicios && Array.isArray(invoice.servicios)) {
            montoTotal = invoice.servicios.reduce((total: number, servicio: any) => {
              const cantidad = servicio.cantidad || 0;
              const precioUnitario = servicio.precioUnitario || 0;
              const descuento = servicio.descuento || 0;
              
              // Calcular precio con descuento
              const precioConDescuento = precioUnitario * (1 - descuento / 100);
              return total + (precioConDescuento * cantidad);
            }, 0);
            console.log(`Monto calculado para factura ${invoice.numeroFactura}:`, montoTotal);
          }

          return {
            id: invoice._id,
            numero: invoice.numeroFactura || invoice.number || 'Sin número',
            monto: montoTotal,
            estado: invoice.estado || 'Desconocido',
            tipo: mapTipo(invoice.tipoFactura),
            fecha: formatFecha(invoice.fecha),
            currency: invoice.currency || 'EUR',
          };
        });
        console.log('Facturas procesadas:', mappedFacturas);

        setFacturas(mappedFacturas);
        setLoading(false);
        console.log('Carga de facturas completada con éxito');
      } catch (error) {
        console.error('Error completo al cargar facturas:', error);
        setError('Error al cargar las facturas');
        setLoading(false);
      }
    };

    fetchFacturas();
  }, []);

  // Función para mapear el estado de la factura
  const mapEstado = (status: string): string => {
    switch (status) {
      case 'paid':
      case 'pagada':
        return 'Pagada';
      case 'pending':
      case 'pendiente':
      case 'overdue':
      case 'partial':
      case 'Pendiente':
        return 'Pendiente';
      default:
        return 'Desconocido';
    }
  };

  // Función para mapear el tipo de factura
  const mapTipo = (tipoFactura: string): string => {
    switch (tipoFactura?.toLowerCase()) {
      case 'completa':
      case 'proforma':
        return 'Emitida';
      case 'simple':
        return 'Escaneada';
      default:
        return 'Otro';
    }
  };

  // Función para formatear la fecha
  const formatFecha = (fecha: string): string => {
    if (!fecha) return 'Fecha no disponible'

    const date = new Date(fecha);
    const options: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    };

    return date.toLocaleDateString('es-ES', options);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const toggleFilter = () => {
    if (setIsFilterOpen) {
      console.log('FacturasWidget: Toggle filter button clicked');
      console.log('FacturasWidget: Current isFilterOpen state:', isFilterOpen);
      setIsFilterOpen(!isFilterOpen);
      console.log('FacturasWidget: New isFilterOpen state will be:', !isFilterOpen);
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    console.log('FacturasWidget: Filter changed:', name, value);
    setFilterOptions(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const applyFilters = (facturas: Factura[]) => {
    console.log('FacturasWidget: Applying filters with options:', filterOptions);
    console.log('FacturasWidget: Search term:', searchTerm);
    
    return facturas.filter(factura => {
      const matchesSearch =
        factura.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
        factura.estado.toLowerCase().includes(searchTerm.toLowerCase()) ||
        factura.tipo.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesEstado = !filterOptions.estado || factura.estado === filterOptions.estado;
      const matchesTipo = !filterOptions.tipo || factura.tipo === filterOptions.tipo;

      const facturaDate = new Date(factura.fecha);
      const matchesFechaInicio = !filterOptions.fechaInicio ||
        facturaDate >= new Date(filterOptions.fechaInicio);
      const matchesFechaFin = !filterOptions.fechaFin ||
        facturaDate <= new Date(filterOptions.fechaFin);

      return matchesSearch && matchesEstado && matchesTipo && matchesFechaInicio && matchesFechaFin;
    });
  };


  if (loading) {
    return (
      <div className={`rounded-lg p-6 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}>
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-300 rounded w-1/4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-300 rounded"></div>
            <div className="h-4 bg-gray-300 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`rounded-lg p-6 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}>
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <div
      className={`p-4 h-full flex flex-col justify-between ${
        theme === 'dark'
          ? 'bg-gray-800 text-white'
          : 'bg-white text-gray-800'
      } rounded-lg`}
    >
      {isEditMode && (
        <button
          onClick={onRemove}
          className={`absolute top-2 right-2 ${
            theme === 'dark'
              ? 'text-purple-400 hover:text-purple-300'
              : 'text-purple-500 hover:text-purple-700'
          } bg-white rounded-full p-1 shadow-md`}
        >
          <FileText className="w-4 h-4" />
        </button>
      )}
      <div className="flex items-center justify-between mb-4">
        <h3
          className={`text-lg font-semibold ${
            theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
          }`}
        >
          Facturas Recientes
        </h3>
      </div>
      <div className="flex gap-2 mb-4">
        <div className="flex-grow relative">
          <input
            type="text"
            placeholder="Buscar facturas..."
            value={searchTerm}
            onChange={handleSearchChange}
            className={`w-full pl-10 pr-4 py-2 rounded-lg ${
              theme === 'dark'
                ? 'bg-gray-700 text-white placeholder-gray-400'
                : 'bg-gray-100 text-gray-800 placeholder-gray-500'
            }`}
          />
          <Search
            className={`absolute left-3 top-2.5 w-4 h-4 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            }`}
          />
        </div>
        <Button variant="filter" onClick={toggleFilter}>
          <Filter className="w-4 h-4" />
        </Button>
      </div>

      {/* Remove the filter dropdown from here - it should be in PanelDeControl.tsx */}

      <div className="flex-grow overflow-auto custom-scrollbar">
        <Table
          headers={['Número', 'Importe', 'Estado', 'Tipo', 'Fecha']}
          data={applyFilters(facturas).map((factura) => ({
            Número: factura.numero,
            Importe: `${factura.monto} ${factura.currency}`,
            Estado: factura.estado,
            Tipo: factura.tipo,
            Fecha: factura.fecha,
          }))}
          variant={theme === 'dark' ? 'dark' : 'white'}
        />
      </div>
    </div>
  );
};

export default FacturasWidget;
