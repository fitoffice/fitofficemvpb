import React, { useState } from 'react';
import {
  X,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  Download,
} from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

interface CSVColumn {
  key: string;
  label: string;
  required: boolean;
  type: 'text' | 'email' | 'phone' | 'status' | 'date';
  aliases: string[];
}

interface CSVValidationModalProps {
  onClose: () => void;
  onConfirm: (mappings: Record<string, string>) => void;
  csvHeaders: string[];
}

const DEFAULT_COLUMNS: CSVColumn[] = [
  { 
    key: 'name',
    label: 'Nombre',
    required: true,
    type: 'text',
    aliases: ['nombre', 'name', 'nombres', 'fullname', 'full name', 'nombre completo']
  },
  { 
    key: 'email',
    label: 'Email',
    required: false,
    type: 'email',
    aliases: ['email', 'correo', 'mail', 'e-mail', 'correo electronico', 'correo electrónico']
  },
  { 
    key: 'phone',
    label: 'Teléfono',
    required: false,
    type: 'phone',
    aliases: ['telefono', 'teléfono', 'phone', 'mobile', 'movil', 'móvil', 'celular']
  },
  { 
    key: 'status',
    label: 'Estado',
    required: false,
    type: 'status',
    aliases: ['status', 'estado', 'situacion', 'situación']
  },
  { 
    key: 'source',
    label: 'Origen',
    required: false,
    type: 'text',
    aliases: ['source', 'origen', 'fuente', 'procedencia']
  },
  { 
    key: 'date',
    label: 'Fecha',
    required: false,
    type: 'date',
    aliases: ['date', 'fecha', 'fecha registro', 'registration date', 'fecha alta']
  },
  { 
    key: 'location',
    label: 'Ubicación',
    required: false,
    type: 'text',
    aliases: ['location', 'ubicacion', 'ubicación', 'ciudad', 'city', 'direccion', 'dirección']
  },
];

function normalizeString(str: string): string {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

function findBestMatch(header: string, column: CSVColumn): boolean {
  const normalizedHeader = normalizeString(header);
  return column.aliases.some(alias => normalizedHeader.includes(normalizeString(alias)));
}

export function CSVValidationModal({
  onClose,
  onConfirm,
  csvHeaders,
}: CSVValidationModalProps) {
  const [columnMappings, setColumnMappings] = useState<Record<string, string>>(
    () => {
      const initialMappings: Record<string, string> = {};
      DEFAULT_COLUMNS.forEach((col) => {
        // Buscar la mejor coincidencia entre los headers
        const matchedHeader = csvHeaders.find(header => findBestMatch(header, col));
        if (matchedHeader) {
          initialMappings[col.key] = matchedHeader;
        }
      });
      return initialMappings;
    }
  );

  const handleConfirm = () => {
    const missingRequired = DEFAULT_COLUMNS.filter(
      (col) => col.required && !columnMappings[col.key]
    );

    if (missingRequired.length > 0) {
      const missingFields = missingRequired.map((col) => col.label).join(', ');
      toast.error(`Por favor, mapea los campos requeridos: ${missingFields}`);
      return;
    }

    onConfirm(columnMappings);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-xl max-w-2xl w-full mx-4"
      >
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-900">
              Mapeo de Columnas CSV
            </h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
              <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-900">
                  Configuración de Columnas
                </h4>
                <p className="text-sm text-blue-700 mt-1">
                  Hemos intentado mapear automáticamente las columnas de tu CSV. 
                  Revisa y ajusta si es necesario. Solo el campo Nombre es obligatorio.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {DEFAULT_COLUMNS.map((column) => (
              <div key={column.key} className="flex items-center gap-4">
                <div className="w-1/3">
                  <label className="text-sm font-medium text-gray-700">
                    {column.label}
                    {column.required && (
                      <span className="text-red-500 ml-1">*</span>
                    )}
                  </label>
                  <div className="text-xs text-gray-500 mt-1">
                    También acepta: {column.aliases.slice(0, 3).join(', ')}...
                  </div>
                </div>
                <div className="w-1/3">
                  <ArrowRight className="h-5 w-5 text-gray-400" />
                </div>
                <div className="w-1/3">
                  <select
                    value={columnMappings[column.key] || ''}
                    onChange={(e) =>
                      setColumnMappings({
                        ...columnMappings,
                        [column.key]: e.target.value,
                      })
                    }
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                      column.required
                        ? 'border-indigo-300'
                        : 'border-gray-300'
                    }`}
                  >
                    <option value="">No mapear</option>
                    {csvHeaders.map((header) => (
                      <option key={header} value={header}>
                        {header}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8">
            <div className="flex items-start gap-3 p-4 bg-emerald-50 rounded-lg">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-emerald-900">
                  Validación Inteligente
                </h4>
                <p className="text-sm text-emerald-700 mt-1">
                  El sistema reconoce automáticamente:
                </p>
                <ul className="text-sm text-emerald-700 mt-2 list-disc list-inside">
                  <li>Múltiples variaciones de nombres de columnas</li>
                  <li>Mayúsculas y minúsculas indistintamente</li>
                  <li>Textos con o sin acentos</li>
                  <li>Nombres de columnas parciales</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-100">
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              onClick={handleConfirm}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2"
            >
              Confirmar Mapeo
              <CheckCircle2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}