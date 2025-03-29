import React, { useState } from 'react';
import { X } from 'lucide-react';

interface CsvPreviewProps {
  csvData: Array<any>;
  onConfirm: (mappedData: Array<any>) => void;
  onCancel: () => void;
}

interface ColumnMapping {
  csvHeader: string;
  leadField: string;
}

export function CsvPreview({ csvData, onConfirm, onCancel }: CsvPreviewProps) {
  const [columnMapping, setColumnMapping] = useState<ColumnMapping[]>([]);
  const leadFields = [
    'name', 
    'email', 
    'phone', 
    'status',
    'trainer',
    'origen',
    'address',
    'birthDate',
    'gender',
    'interests',
    'shortDescription'
  ];

  const handleMappingChange = (csvHeader: string, leadField: string) => {
    setColumnMapping(prev => {
      const existing = prev.find(m => m.csvHeader === csvHeader);
      if (existing) {
        return prev.map(m => m.csvHeader === csvHeader ? { ...m, leadField } : m);
      }
      return [...prev, { csvHeader, leadField }];
    });
  };

  const handleConfirm = () => {
    const mappedData = csvData.map(row => {
      const mappedRow: any = {};
      columnMapping.forEach(mapping => {
        mappedRow[mapping.leadField] = row[mapping.csvHeader];
      });
      return mappedRow;
    });
    onConfirm(mappedData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[80vh] overflow-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Previsualización del CSV</h2>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Mapeo de Columnas</h3>
          <div className="grid grid-cols-2 gap-4">
            {Object.keys(csvData[0] || {}).map((header) => (
              <div key={header} className="flex items-center gap-2">
                <span className="font-medium">{header}:</span>
                <select
                  className="border rounded p-1"
                  onChange={(e) => handleMappingChange(header, e.target.value)}
                  value={columnMapping.find(m => m.csvHeader === header)?.leadField || ''}
                >
                  <option value="">Seleccionar campo</option>
                  {leadFields.map(field => (
                    <option key={field} value={field}>
                      {field}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Vista Previa</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  {Object.keys(csvData[0] || {}).map((header) => (
                    <th
                      key={header}
                      className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {csvData.slice(0, 5).map((row, index) => (
                  <tr key={index}>
                    {Object.values(row).map((value: any, i) => (
                      <td
                        key={i}
                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                      >
                        {value}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 border rounded-md hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            disabled={columnMapping.length === 0}
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}
