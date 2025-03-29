import React from 'react';
import { Eye, Pencil, Trash2, Info, Download } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface Column {
  header: string;
  key: string;
  width?: string;
}

interface TableWithActionButtonsProps {
  columns: Column[];
  data: any[];
  onView?: (item: any) => void;
  onDetails?: (item: any) => void;
  onEdit?: (item: any) => void;
  onDelete?: (item: any) => void;
  onDownload?: (item: any) => void;
  onSelect?: (id: string) => void;
  selectedIds?: string[];
  showCheckbox?: boolean;
  showActions?: boolean;
  idField?: string;
  renderCell?: (key: string, value: any) => React.ReactNode;
}

const TableWithActionButtons: React.FC<TableWithActionButtonsProps> = ({
  columns,
  data,
  onView,
  onDetails,
  onEdit,
  onDelete,
  onDownload,
  onSelect,
  selectedIds = [],
  showCheckbox = true,
  showActions = true,
  idField = '_id',
  renderCell,
}) => {
  const { theme } = useTheme();

  const renderHeader = () => {
    return (
      <thead className={`${
        theme === 'dark' ? 'bg-gray-800 text-gray-200' : 'bg-gray-50 text-gray-600'
      }`}>
        <tr>
          {showCheckbox && (
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider w-[80px]">
              Seleccionar
            </th>
          )}
          {columns.map((column, index) => (
            <th
              key={index}
              className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider"
              style={column.width ? { width: column.width } : {}}
            >
              {column.header}
            </th>
          ))}
          {showActions && (
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider w-[150px]">
              Acciones
            </th>
          )}
        </tr>
      </thead>
    );
  };

  const renderBody = () => {
    return (
      <tbody className={`${
        theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
      } divide-y ${
        theme === 'dark' ? 'divide-gray-700' : 'divide-gray-200'
      }`}>
        {data.map((item, rowIndex) => (
          <tr
            key={item[idField] || rowIndex}
            className={`${
              theme === 'dark'
                ? 'hover:bg-gray-700/50'
                : 'hover:bg-gray-50'
            } transition-colors duration-150`}
          >
            {showCheckbox && (
              <td className="px-4 py-3 whitespace-nowrap">
                <input
                  type="checkbox"
                  checked={selectedIds.includes(item[idField])}
                  onChange={() => onSelect?.(item[idField])}
                  className={`form-checkbox h-5 w-5 rounded ${
                    theme === 'dark'
                      ? 'text-blue-500 border-gray-600 bg-gray-700'
                      : 'text-blue-600 border-gray-300 bg-white'
                  }`}
                />
              </td>
            )}
            {columns.map((column, index) => (
              <td key={index} className="px-4 py-3 whitespace-nowrap">
                {renderCell ? renderCell(column.key, item[column.key]) : item[column.key]}
              </td>
            ))}
            {showActions && (
              <td className="px-4 py-3 whitespace-nowrap">
                <div className="flex items-center justify-end space-x-2">
                  {onDetails && (
                    <button
                      onClick={() => onDetails(item)}
                      className={`p-2 rounded-lg ${
                        theme === 'dark'
                          ? 'hover:bg-gray-700 text-purple-400'
                          : 'hover:bg-gray-100 text-purple-600'
                      } transition-colors duration-150`}
                      title="Detalles"
                    >
                      <Info className="w-5 h-5" />
                    </button>
                  )}
                  {onView && (
                    <button
                      onClick={() => onView(item)}
                      className={`p-2 rounded-lg ${
                        theme === 'dark'
                          ? 'hover:bg-gray-700 text-blue-400'
                          : 'hover:bg-gray-100 text-blue-600'
                      } transition-colors duration-150`}
                      title="Ver"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                  )}
                  {onDownload && (
                    <button
                      onClick={() => onDownload(item)}
                      className={`p-2 rounded-lg ${
                        theme === 'dark'
                          ? 'hover:bg-gray-700 text-cyan-400'
                          : 'hover:bg-gray-100 text-cyan-600'
                      } transition-colors duration-150`}
                      title="Descargar"
                    >
                      <Download className="w-5 h-5" />
                    </button>
                  )}
                  {onEdit && (
                    <button
                      onClick={() => onEdit(item)}
                      className={`p-2 rounded-lg ${
                        theme === 'dark'
                          ? 'hover:bg-gray-700 text-green-400'
                          : 'hover:bg-gray-100 text-green-600'
                      } transition-colors duration-150`}
                      title="Editar"
                    >
                      <Pencil className="w-5 h-5" />
                    </button>
                  )}
                  {onDelete && (
                    <button
                      onClick={() => onDelete(item)}
                      className={`p-2 rounded-lg ${
                        theme === 'dark'
                          ? 'hover:bg-gray-700 text-red-400'
                          : 'hover:bg-gray-100 text-red-600'
                      } transition-colors duration-150`}
                      title="Eliminar"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    );
  };

  return (
    <div className={`relative overflow-x-auto ${
      theme === 'dark' ? 'bg-gray-800' : 'bg-white'
    } shadow-md sm:rounded-lg border ${
      theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
    }`}>
      <table className="w-full text-sm text-left">
        {renderHeader()}
        {renderBody()}
      </table>
    </div>
  );
};

export default TableWithActionButtons;
