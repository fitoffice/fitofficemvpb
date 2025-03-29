import React, { useState } from 'react';
import { Upload, X } from 'lucide-react';
import Button from '../Common/Button';
import Table from '../Common/Table';

interface ArchivosplanificacionesProps {
  onClose: () => void;
  planningId?: string;
}

interface Archivo {
  id: string;
  nombre: string;
  tipo: string;
  fecha: string;
  tamaño: string;
}

const ArchivosplanificacionesComponent: React.FC<ArchivosplanificacionesProps> = ({ onClose, planningId }) => {
  const [archivos, setArchivos] = useState<Archivo[]>([
    // Datos de ejemplo - reemplazar con datos reales de la API
    {
      id: '1',
      nombre: 'planificacion1.pdf',
      tipo: 'PDF',
      fecha: '2024-01-14',
      tamaño: '2.5 MB'
    }
  ]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Aquí implementar la lógica para subir el archivo al servidor
      console.log('Archivo seleccionado:', file);
      
      // Ejemplo de añadir el archivo a la lista (en producción, esto vendría del servidor)
      const newArchivo: Archivo = {
        id: Date.now().toString(),
        nombre: file.name,
        tipo: file.type,
        fecha: new Date().toISOString().split('T')[0],
        tamaño: `${(file.size / (1024 * 1024)).toFixed(2)} MB`
      };
      
      setArchivos([...archivos, newArchivo]);
    }
  };

  const headers = ['Nombre', 'Tipo', 'Fecha', 'Tamaño'];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-4xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold dark:text-white">Archivos de la Planificación</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
          >
            <X className="h-6 w-6 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        <div className="mb-6">
          <div className="flex gap-4">
            <input
              type="file"
              id="file-upload"
              className="hidden"
              onChange={handleFileUpload}
            />
            <label htmlFor="file-upload">
              <Button
                variant="primary"
                className="flex items-center gap-2"
              >
                <Upload size={20} />
                Subir Archivo
              </Button>
            </label>
          </div>
        </div>

        <Table
          headers={headers}
          data={archivos.map(archivo => ({
            nombre: archivo.nombre,
            tipo: archivo.tipo,
            fecha: archivo.fecha,
            tamaño: archivo.tamaño
          }))}
          variant="white"
        />
      </div>
    </div>
  );
};

export default ArchivosplanificacionesComponent;
