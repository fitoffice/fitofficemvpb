import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Button } from '../ui/button';
import { Edit2, Trash2, Users, ChevronRight, Target } from 'lucide-react';

interface Segment {
  id: string;
  nombre: string;
  descripcion: string;
  criterios: string;
  numContactos: number;
  fechaCreacion: string;
}

const segmentosEjemplo: Segment[] = [
  {
    id: '1',
    nombre: 'Clientes Premium',
    descripcion: 'Clientes con alto valor de compra',
    criterios: 'Compras > $1000',
    numContactos: 150,
    fechaCreacion: '2024-01-05',
  },
  {
    id: '2',
    nombre: 'Leads Calificados',
    descripcion: 'Prospectos que han mostrado interés',
    criterios: 'Interacción > 5',
    numContactos: 300,
    fechaCreacion: '2024-01-04',
  },
  {
    id: '3',
    nombre: 'Inactivos',
    descripcion: 'Clientes sin actividad reciente',
    criterios: 'Sin compras 90 días',
    numContactos: 200,
    fechaCreacion: '2024-01-03',
  },
];

export function SegmentTable() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white flex items-center gap-2">
            <Target className="h-5 w-5 text-blue-600" />
            Segmentos
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Gestiona tus segmentos de audiencia
          </p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
          Nuevo Segmento
        </Button>
      </div>
      
      <div className="overflow-hidden border border-gray-200 dark:border-gray-700 rounded-lg">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 dark:bg-gray-800">
              <TableHead className="font-semibold text-gray-700 dark:text-gray-300">Nombre</TableHead>
              <TableHead className="font-semibold text-gray-700 dark:text-gray-300">Descripción</TableHead>
              <TableHead className="font-semibold text-gray-700 dark:text-gray-300">Criterios</TableHead>
              <TableHead className="font-semibold text-gray-700 dark:text-gray-300 text-center">Contactos</TableHead>
              <TableHead className="font-semibold text-gray-700 dark:text-gray-300">Fecha Creación</TableHead>
              <TableHead className="font-semibold text-gray-700 dark:text-gray-300 text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {segmentosEjemplo.map((segmento) => (
              <TableRow 
                key={segmento.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <TableCell className="font-medium text-gray-900 dark:text-white">
                  {segmento.nombre}
                </TableCell>
                <TableCell className="text-gray-600 dark:text-gray-300">
                  {segmento.descripcion}
                </TableCell>
                <TableCell className="text-gray-600 dark:text-gray-300">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    {segmento.criterios}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-center gap-1 text-gray-600 dark:text-gray-300">
                    <Users className="h-4 w-4" />
                    <span>{segmento.numContactos}</span>
                  </div>
                </TableCell>
                <TableCell className="text-gray-600 dark:text-gray-300">
                  {new Date(segmento.fechaCreacion).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="text-gray-600 hover:text-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
