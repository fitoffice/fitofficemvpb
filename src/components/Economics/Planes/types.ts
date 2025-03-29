export type ServiceType = 'all' | 'citas' | 'suscripciones' | 'asesorias' | 'clases';

export interface Cliente {
  _id: string;
  nombre: string;
  email: string;
  telefono: string;
  fechaInicio: string;
  estado: 'Activo' | 'Pendiente' | 'Inactivo';
  pagosRealizados: number;
  ultimoPago: string;
}

export interface PlanDePago {
  _id: string;
  nombre: string;
  precio: number;
  moneda: string;
  frecuencia: string;
  detalles: string;
  stripeProductId: string;
  stripePriceId: string;
  servicio: Servicio;
  clientes: Cliente[];
  fechaCreacion: string;
}

export interface Servicio {
  _id: string;
  nombre: string;
  tipo: string;
  descripcion: string;
  entrenador: string;
  planDePago: string | string[];
  clientes: Cliente[];
  serviciosAdicionales: string[];
  sesiones: any[];
  ingresos: any[];
  planificaciones: any[];
  dietas: any[];
  fechaCreacion: string;
}

export interface FilterOptions {
  tipo: string;
  cantidadPlanes: string;
  cantidadClientes: string;
  fechaCreacion: string;
  ordenarPor: string;
}
