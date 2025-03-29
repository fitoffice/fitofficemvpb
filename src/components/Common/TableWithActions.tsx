import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';
import { ChevronLeft, ChevronRight, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';

interface TableColumn {
  header: string;
  key: string;
}

interface TableProps {
  headers: (string | TableColumn)[];
  data: any[];
  renderCell?: (key: string, value: any, item: any) => React.ReactNode;
  onRowClick?: (item: any) => void;
  selectedRows?: string[];
  onRowSelect?: (id: string) => void;
  showCheckboxes?: boolean;
}

type SortDirection = 'none' | 'asc' | 'desc';

interface SortState {
  key: string | null;
  direction: SortDirection;
}

const ITEMS_PER_PAGE = 6;

const TableWithActions: React.FC<TableProps> = ({
  headers,
  data,
  renderCell,
  onRowClick,
  selectedRows = [],
  onRowSelect,
  showCheckboxes = false,
}) => {
  const { theme } = useTheme();
  const [currentPage, setCurrentPage] = useState(1);
  const [sortState, setSortState] = useState<SortState>({
    key: null,
    direction: 'none'
  });

  // Convert string headers to TableColumn objects
  const normalizedHeaders = headers.map(header => 
    typeof header === 'string' ? { header, key: header.toLowerCase() } : header
  );

  // Handle column sort
  const handleSort = (column: TableColumn) => {
    setSortState(prevState => {
      if (prevState.key !== column.key) {
        return { key: column.key, direction: 'asc' };
      }
      
      const nextDirection: { [key in SortDirection]: SortDirection } = {
        'none': 'asc',
        'asc': 'desc',
        'desc': 'none'
      };
      
      return {
        key: nextDirection[prevState.direction] === 'none' ? null : column.key,
        direction: nextDirection[prevState.direction]
      };
    });
    // Reset to first page when sorting changes
    setCurrentPage(1);
  };

  // Sort data
  const sortedData = [...data].sort((a, b) => {
    if (sortState.key === null || sortState.direction === 'none') {
      return 0;
    }

    // Skip sorting for certain columns
    if (sortState.key === 'acciones' || sortState.key === 'progreso') {
      return 0;
    }

    // Get raw values for comparison
    let aValue = a[sortState.key];
    let bValue = b[sortState.key];

    // Special handling for rendered cells
    if (renderCell && (sortState.key === 'tipo' || sortState.key === 'estado')) {
      // For these fields, we want to sort by the raw value, not the rendered component
      aValue = a[sortState.key];
      bValue = b[sortState.key];
    }

    // Handle null/undefined values
    if (aValue == null) return sortState.direction === 'asc' ? 1 : -1;
    if (bValue == null) return sortState.direction === 'asc' ? -1 : 1;

    // Handle different types of values
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortState.direction === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortState.direction === 'asc' 
        ? aValue - bValue
        : bValue - aValue;
    }

    // Handle dates
    const aDate = new Date(aValue);
    const bDate = new Date(bValue);
    if (!isNaN(aDate.getTime()) && !isNaN(bDate.getTime())) {
      return sortState.direction === 'asc'
        ? aDate.getTime() - bDate.getTime()
        : bDate.getTime() - aDate.getTime();
    }

    // Convert to strings for comparison if types don't match
    const strA = String(aValue);
    const strB = String(bValue);
    return sortState.direction === 'asc'
      ? strA.localeCompare(strB)
      : strB.localeCompare(strA);
  });

  // Calculate pagination values
  const totalPages = Math.ceil(sortedData.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentData = sortedData.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const getSortIcon = (column: TableColumn) => {
    if (sortState.key !== column.key) {
      return <ArrowUpDown size={16} className="opacity-50" />;
    }
    if (sortState.direction === 'asc') {
      return <ArrowUp size={16} className="text-blue-500" />;
    }
    if (sortState.direction === 'desc') {
      return <ArrowDown size={16} className="text-blue-500" />;
    }
    return <ArrowUpDown size={16} className="opacity-50" />;
  };

  return (
    <div className="space-y-4">
      <div className={`overflow-x-auto rounded-xl ${
        theme === 'dark' 
          ? 'bg-gray-800/50 backdrop-blur-sm border border-gray-700' 
          : 'bg-white/50 backdrop-blur-sm border border-gray-200'
      } shadow-lg`}>
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className={`${
            theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50/50'
          }`}>
            <tr>
              {showCheckboxes && (
                <th scope="col" className="relative px-6 py-4">
                  <span className="sr-only">Select</span>
                </th>
              )}
              {normalizedHeaders.map((column) => (
                <th
                  key={column.header}
                  scope="col"
                  onClick={() => handleSort(column)}
                  className={`px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider cursor-pointer select-none ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                  } hover:bg-opacity-50 ${
                    theme === 'dark' ? 'hover:bg-gray-600' : 'hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {column.header}
                    {getSortIcon(column)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {currentData.map((item, index) => (
              <motion.tr
                key={item._id || index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => onRowClick?.(item)}
                className={`cursor-pointer transition-all duration-200 ${
                  theme === 'dark'
                    ? 'hover:bg-gray-700/50'
                    : 'hover:bg-blue-50/50'
                } ${
                  selectedRows.includes(item._id)
                    ? theme === 'dark'
                      ? 'bg-gray-700/30'
                      : 'bg-blue-50/70'
                    : ''
                }`}
              >
                {showCheckboxes && (
                  <td className="relative px-6 py-4">
                    <input
                      type="checkbox"
                      className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      checked={selectedRows.includes(item._id)}
                      onChange={(e) => {
                        e.stopPropagation();
                        onRowSelect?.(item._id);
                      }}
                    />
                  </td>
                )}
                {normalizedHeaders.map((column) => {
                  const value = item[column.key];
                  return (
                    <td
                      key={column.key}
                      className={`px-6 py-4 whitespace-nowrap ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-900'
                      } ${
                        column.key === 'nombre' ? 'font-medium' : 'text-sm'
                      }`}
                    >
                      {renderCell ? renderCell(column.key, value, item) : value}
                    </td>
                  );
                })}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className={`flex items-center justify-between px-4 py-3 ${
          theme === 'dark' ? 'bg-gray-800/50 text-gray-300' : 'bg-white/50 text-gray-700'
        } rounded-xl border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex items-center gap-2">
            <span className="text-sm">
              Mostrando {startIndex + 1} a {Math.min(endIndex, data.length)} de {data.length} elementos
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`p-2 rounded-lg transition-colors ${
                currentPage === 1
                  ? 'opacity-50 cursor-not-allowed'
                  : theme === 'dark'
                  ? 'hover:bg-gray-700'
                  : 'hover:bg-gray-100'
              }`}
            >
              <ChevronLeft size={20} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-3 py-1 rounded-lg transition-colors ${
                  currentPage === page
                    ? theme === 'dark'
                      ? 'bg-gray-700 text-white'
                      : 'bg-blue-500 text-white'
                    : theme === 'dark'
                    ? 'hover:bg-gray-700'
                    : 'hover:bg-gray-100'
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`p-2 rounded-lg transition-colors ${
                currentPage === totalPages
                  ? 'opacity-50 cursor-not-allowed'
                  : theme === 'dark'
                  ? 'hover:bg-gray-700'
                  : 'hover:bg-gray-100'
              }`}
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TableWithActions;
