// Types for invoices/facturas

export interface Factura {
  id: string;
  numero: string;
  monto: number;
  estado: string;
  tipo: string;
  fecha: string;
  currency: string;
  fechaCobro?: string;
  cliente?: string;
  fechaMaxPago?: string;
  emisor?: string;
  clienteNIF?: string;
  clienteDireccion?: string;
  descripcion?: string;
  ivaRate?: number;
  metodoPago?: string;
  // Add any other fields you might need

}

export interface InvoiceFormData {
  _id?: string;
  // Datos del Emisor
  nombreEmisor: string;
  direccionEmisor: string;
  nifEmisor: string;
  
  // Información Básica
  numeroFactura: string;
  fecha: string;
  fechaVencimiento: string;
  metodoPago: string;
  facturaSimplificada: boolean;
  tipoFactura: string;

  // Datos del Destinatario
  tipoPersona: string;
  tipoDestinatario: string;
  nombre: string;
  apellidos: string;
  telefono: string;
  email: string;
  direccion: {
    calle: string;
    numero: string;
    ciudad: string;
    codigoPostal: string;
    provincia: string;
    pais: string;
  };
  nif: string;

  // Servicios
  servicios: Array<{
    codigo: string;
    nombre: string;
    iva: number;
    exentoIva: boolean;
    cantidad: number;
    precioUnitario: number;
    descuento: number;
    total: number;
  }>;

  // Totales
  baseImponible: number;
  totalIva: number;
  importeTotal: number;

  // Información Adicional
  comentarios: string;
  condiciones: string;
  proteccionDatos: boolean;
  currency: string;
}

export type TabType = 'emitidas' | 'recibidas' | 'todas';