import React, { useState } from 'react';
import Table from '../Common/Table';
import { Edit, Trash2, FileText, Download, ChevronDown, ChevronUp } from 'lucide-react';

interface Planning {
  _id: string;
  nombre: string;
  descripcion: string;
  fechaInicio: string;
  meta?: string;
  semanas: number;
  tipo: 'Planificacion' | 'Plantilla';
  estado?: string;
  progreso?: number;
  cliente?: {
    nombre: string;
  };
}

interface TablePlanningProps {
  data: Planning[];
  templates: Planning[];
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  selectMode?: boolean;
  selectedPlannings: string[];
  onSelectedChange: (id: string) => void;
  renderCell: (field: string, value: any, item: any) => React.ReactNode;
}

const TablePlanning: React.FC<TablePlanningProps> = ({
  data = [],
  templates = [],
  onEdit,
  onDelete,
  selectMode = false,
  selectedPlannings = [],
  onSelectedChange,
  renderCell
}) => {
  const [openRowId, setOpenRowId] = useState<string | null>(null);

  // Definir los headers de la tabla
  const headers = [
    ...(selectMode ? [''] : []),
    'Nombre',
    'Descripción',
    'Fecha de Inicio',
    'Duración',
    'Meta',
    'Tipo',
    'Cliente',
    'Estado',
    'Progreso',
    'Acciones'
  ];

  // Transformar los datos al formato que espera la tabla
  const transformedData = data.map(item => ({
    ...(selectMode ? {
      checkbox: (
        <input
          type="checkbox"
          checked={selectedPlannings.includes(item._id)}
          onChange={() => onSelectedChange(item._id)}
          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
        />
      )
    } : {}),
    nombre: item.nombre,
    descripcion: item.descripcion,
    fechaInicio: new Date(item.fechaInicio).toLocaleDateString(),
    duracion: `${item.semanas} semanas`,
    meta: item.meta,
    tipo: renderCell('tipo', item.tipo, item),
    cliente: item.cliente?.nombre || 'Sin cliente',
    estado: renderCell('estado', item.estado || 'En progreso', item),
    progreso: renderCell('completado', '65%', item),
    acciones: (
      <div className="flex items-center gap-2">
        <button
          onClick={() => setOpenRowId(openRowId === item._id ? null : item._id)}
          className="p-1.5 hover:bg-gray-100 rounded-full text-gray-600 tooltip flex items-center gap-1"
          title="Ver plantillas disponibles"
        >
          {openRowId === item._id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
        {onEdit && (
          <button
            onClick={() => onEdit(item._id)}
            className="p-1.5 hover:bg-blue-50 rounded-full text-blue-600 tooltip"
            title="Editar planificación"
          >
            <Edit size={16} />
          </button>
        )}
        <button
          onClick={() => {
            // Aquí puedes agregar la lógica para ver detalles
          }}
          className="p-1.5 hover:bg-purple-50 rounded-full text-purple-600 tooltip"
          title="Ver detalles"
        >
          <FileText size={16} />
        </button>
        <button
          onClick={() => {
            // Aquí puedes agregar la lógica para descargar
          }}
          className="p-1.5 hover:bg-green-50 rounded-full text-green-600 tooltip"
          title="Descargar planificación"
        >
          <Download size={16} />
        </button>
        {onDelete && (
          <button
            onClick={() => onDelete(item._id)}
            className="p-1.5 hover:bg-red-50 rounded-full text-red-600 tooltip"
            title="Eliminar planificación"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>
    ),
  }));

  return (
    <div className="w-full">
      <Table
        headers={headers}
        data={transformedData}
        variant="white"
      />
      {openRowId && (
        <div className="mt-2 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold mb-3">Plantillas Disponibles</h3>
          {templates.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {templates.map((template) => (
                <div
                  key={template._id}
                  className="p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
                >
                  <h4 className="font-medium text-gray-900">{template.nombre}</h4>
                  <p className="text-sm text-gray-600 mt-1">{template.descripcion}</p>
                  <div className="mt-2 text-sm text-gray-500">
                    <div>Duración: {template.semanas} semanas</div>
                    <div>Meta: {template.meta || 'No especificada'}</div>
                    <div>Tipo: {template.tipo}</div>
                  </div>
                  <button
                    onClick={() => {
                      // Aquí puedes agregar la lógica para usar la plantilla
                      console.log('Usar plantilla:', template._id);
                    }}
                    className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors w-full"
                  >
                    Usar esta plantilla
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-gray-600">No hay plantillas disponibles</div>
          )}
        </div>
      )}
    </div>
  );
};

export default TablePlanning;
