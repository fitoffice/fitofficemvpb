import { ReactNode } from 'react';

export interface ServicioBase {
  _id: string;
  nombre: string;
  descripcion: string;
  tipo: string;
  estado: 'activo' | 'inactivo';
  createdAt: string;
  updatedAt: string;
}

export interface ClaseGrupal extends ServicioBase {
  entrenador?: {
    _id: string;
    nombre: string;
    email: string;
    rol: string;
  };
  planesDePago: PlanPago[];
  clientes: any[];
  serviciosAdicionales: string[];
  sesiones: any[];
  planificaciones: any[];
  dietas: any[];
  ingresos: any[];
  fechaCreacion?: string;
}

export interface Cita extends ServicioBase {
  fecha?: string;
  hora?: string;
  cliente?: string;
  estado: 'Pendiente' | 'Confirmada' | 'Cancelada';
}

export interface Cliente {
  id: number;
  nombre: string;
  email: string;
  telefono: string;
  fechaInicio: string;
  estado: 'Activo' | 'Inactivo';
}

export interface PlanPago {
  _id: string;
  nombre: string;
  precio: number;
  duracion: string;
  descripcion: string;
  createdAt: string;
  updatedAt: string;
}

export interface ServicioAsesoriaSubscripcion extends ServicioBase {
  duracion?: string;
  planDePago?: PlanPago[];
  serviciosAdicionales?: string[];
}

export interface CategoriaServicio {
  id: string;
  titulo: string;
  icono: ReactNode;
  tipo: string;
  datos: (ClaseGrupal | ServicioAsesoriaSubscripcion | Cita)[];
}