// Interfaces básicas para el manejo de facturas

export interface Servicio {
  codigo: string;
  nombre: string;
  iva: number;
  exentoIva: boolean;
  cantidad: number;
  precioUnitario: number;
  descuento: number;
  total: number;
}

export interface Direccion {
  calle: string;
  numero: string;
  ciudad: string;
  codigoPostal: string;
  provincia: string;
  pais: string;
}

export interface FormData {
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

  // Datos del Destinatario
  tipoDestinatario: 'fisica' | 'juridica';
  nombre: string;
  apellidos: string;
  telefono: string;
  email: string;
  direccion: Direccion;
  nif: string;

  // Servicios
  servicios: Servicio[];

  // Totales
  baseImponible: number;
  totalIVA: number;
  totalFactura: number;
}

export interface Cliente {
  _id: string;
  nombre: string;
  email: string;
}

export interface TokenPayload {
  id: string;
  rol: string;
  iat: number;
  exp: number;
}

export interface FacturaFormProps {
  onSubmit: (data: FormData) => void;
}
