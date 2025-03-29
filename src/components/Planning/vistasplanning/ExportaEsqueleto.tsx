import React, { useState, useEffect } from 'react';
import { X, FileText, Download } from 'lucide-react';
import Button from './Button';
import { useLocation } from 'react-router-dom';

interface ExportaEsqueletoProps {
  open: boolean;
  onClose: () => void;
  onExport: (format: string) => void;
}

// Interfaz para los datos que recibiremos de la API
interface PlanningData {
  _id: string;
  nombre: string;
  descripcion: string;
}

const ExportaEsqueleto: React.FC<ExportaEsqueletoProps> = ({
  open,
  onClose,
  onExport
}) => {
  const [planningData, setPlanningData] = useState<PlanningData[]>([]);
  const [selectedPlanning, setSelectedPlanning] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Get current URL to extract the planning ID
  const location = useLocation();
  
  // Extract planning ID from URL
  const getCurrentPlanningId = (): string => {
    const path = location.pathname;
    const matches = path.match(/\/edit-planning\/([^\/]+)/);
    return matches ? matches[1] : '';
  };
  
  const planningOrigenId = getCurrentPlanningId();
  
  useEffect(() => {
    const fetchPlanningData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/plannings/simplified', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        const data = await response.json();
        
        // Filter out the current planning from the list
        const filteredData = data.filter((planning: PlanningData) => planning._id !== planningOrigenId);
        setPlanningData(filteredData);
        console.log('Datos recibidos de la API:', filteredData);
      } catch (error) {
        console.error('Error al obtener los datos de planificación:', error);
        setError('Error al cargar los plannings disponibles');
      }
    };

    if (open) {
      fetchPlanningData();
    }
  }, [open, planningOrigenId]);
  
  const handleExport = async () => {
    if (!selectedPlanning || !planningOrigenId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/plannings/copiar-esqueleto/${planningOrigenId}/${selectedPlanning}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al exportar el esqueleto');
      }
      
      const data = await response.json();
      console.log('Esqueleto exportado con éxito:', data);
      
      // Call the onExport callback with the selected planning ID
      onExport(selectedPlanning);
      onClose();
    } catch (error) {
      console.error('Error al exportar el esqueleto:', error);
      setError(error instanceof Error ? error.message : 'Error al exportar el esqueleto');
    } finally {
      setLoading(false);
    }
  };
  
  if (!open) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 relative animate-fadeIn">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X className="w-5 h-5" />
        </button>
        
        <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
          <FileText className="w-6 h-6 text-indigo-600" />
          Exportar Esqueleto a Planning
        </h2>
        
        <div className="mb-6">
          <p className="text-gray-600 mb-4">
            Selecciona el planning al que deseas exportar este esqueleto de entrenamiento. 
            El esqueleto se copiará manteniendo la estructura de periodos y ejercicios.
          </p>
          
          {error && (
            <div className="p-3 mb-4 bg-red-50 text-red-600 rounded-lg border border-red-200">
              {error}
            </div>
          )}
          
          <div className="space-y-3 max-h-60 overflow-y-auto">
            {planningData.length > 0 ? (
              planningData.map((planning) => (
                <label 
                  key={planning._id}
                  className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <input
                    type="radio"
                    name="planning"
                    value={planning._id}
                    checked={selectedPlanning === planning._id}
                    onChange={() => setSelectedPlanning(planning._id)}
                    className="mr-3"
                  />
                  <div>
                    <p className="font-medium text-gray-800">{planning.nombre}</p>
                    {planning.descripcion && (
                      <p className="text-sm text-gray-500">{planning.descripcion}</p>
                    )}
                  </div>
                </label>
              ))
            ) : (
              <p className="text-center text-gray-500">No hay plannings disponibles para exportar</p>
            )}
          </div>
        </div>
        
        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={onClose}
          >
            Cancelar
          </Button>
          <Button
            variant="primary"
            onClick={handleExport}
            disabled={!selectedPlanning || loading}
            className="flex items-center gap-2"
          >
            {loading ? (
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <Download className="w-4 h-4" />
            )}
            {loading ? 'Exportando...' : 'Exportar Esqueleto'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ExportaEsqueleto;