import React from 'react';
import { Users, UserCircle, Ticket, Calendar } from 'lucide-react';
import type { CategoriaServicio } from '../types/servicios';

export const categoriasServicios: CategoriaServicio[] = [
  {
    id: 'clases-grupales',
    titulo: 'Clases Grupales',
    icono: React.createElement(Users, { className: "w-5 h-5" }),
    tipo: 'clase',
    datos: [
      {
        id: 1,
        nombre: 'Yoga Matutino',
        descripcion: 'Clase de yoga para comenzar el día con energía',
        horario: '07:00 - 08:30',
        instructor: 'Ana García',
        capacidad: 20,
        participantes: 15
      },
      {
        id: 2,
        nombre: 'Pilates Intermedio',
        descripcion: 'Fortalecimiento corporal y flexibilidad',
        horario: '09:00 - 10:30',
        instructor: 'Carlos Ruiz',
        capacidad: 15,
        participantes: 12
      }
    ]
  },
  {
    id: 'asesorias',
    titulo: 'Asesorías',
    icono: React.createElement(UserCircle, { className: "w-5 h-5" }),
    tipo: 'asesoria',
    datos: [
      {
        id: 1,
        nombre: 'Nutrición Deportiva',
        descripcion: 'Asesoría personalizada en nutrición para deportistas',
        duracion: '45 minutos',
        detalles: 'Incluye plan alimenticio personalizado',
        planes: [
          {
            id: 1,
            nombre: 'Plan Básico',
            precio: '$50/mes',
            duracion: '3 meses',
            descripcion: 'Una sesión mensual',
            clientes: [
              {
                id: 1,
                nombre: 'María López',
                email: 'maria@email.com',
                telefono: '555-0123',
                fechaInicio: '2024-01-15',
                estado: 'Activo'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'suscripciones',
    titulo: 'Suscripciones',
    icono: React.createElement(Ticket, { className: "w-5 h-5" }),
    tipo: 'suscripcion',
    datos: [
      {
        id: 1,
        nombre: 'Membresía Premium',
        descripcion: 'Acceso ilimitado a todas las instalaciones',
        duracion: 'Mensual',
        detalles: 'Incluye acceso a todas las clases',
        planes: [
          {
            id: 1,
            nombre: 'Premium Anual',
            precio: '$600/año',
            duracion: '12 meses',
            descripcion: 'Ahorra 20% con el plan anual',
            clientes: [
              {
                id: 1,
                nombre: 'Juan Pérez',
                email: 'juan@email.com',
                telefono: '555-0124',
                fechaInicio: '2024-01-01',
                estado: 'Activo'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'citas',
    titulo: 'Citas',
    icono: React.createElement(Calendar, { className: "w-5 h-5" }),
    tipo: 'cita',
    datos: [
      {
        id: 1,
        nombre: 'Evaluación Física',
        descripcion: 'Evaluación inicial de condición física',
        fecha: '2024-03-15',
        hora: '10:00',
        cliente: 'Pedro Sánchez',
        estado: 'Confirmada'
      },
      {
        id: 2,
        nombre: 'Masaje Terapéutico',
        descripcion: 'Sesión de masaje deportivo',
        fecha: '2024-03-15',
        hora: '11:30',
        cliente: 'Laura Torres',
        estado: 'Pendiente'
      },
      {
        id: 3,
        nombre: 'Consulta Nutricional',
        descripcion: 'Seguimiento mensual',
        fecha: '2024-03-15',
        hora: '15:00',
        cliente: 'Ana Martínez',
        estado: 'Cancelada'
      }
    ]
  }
];