import React from 'react';
import { FileText, Download, Search, Filter } from 'lucide-react';
import Button from '../../Common/Button';
import FacturasFilter from './FacturasFilter';
import { FilterValues } from './FacturasFilter';

interface FacturasHeaderProps {
  theme: string;
  searchTerm: string;
  handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isExportMode: boolean;
  selectedInvoices: string[];
  exportFormat: 'CSV' | 'PDF';
  setExportFormat: React.Dispatch<React.SetStateAction<'CSV' | 'PDF'>>;
  handleExportSelected: () => void;
  setIsExportMode: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedInvoices: React.Dispatch<React.SetStateAction<string[]>>;
  isFilterOpen: boolean;
  setIsFilterOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onApplyFilters: (filters: FilterValues) => void;
  setIsFacturasPopup2Open: React.Dispatch<React.SetStateAction<boolean>>;
  setIsEscanearFacturaPopupOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const FacturasHeader: React.FC<FacturasHeaderProps> = ({
  theme,
  searchTerm,
  handleSearchChange,
  isExportMode,
  selectedInvoices,
  exportFormat,
  setExportFormat,
  handleExportSelected,
  setIsExportMode,
  setSelectedInvoices,
  isFilterOpen,
  setIsFilterOpen,
  onApplyFilters,
  setIsFacturasPopup2Open,
  setIsEscanearFacturaPopupOpen,
}) => {
  return (
    <>
      <h2 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-transparent bg-clip-text animate-gradient">
        Gestión de Facturas
      </h2>
      {/* Container with flex-col to stack rows */}
      <div className="flex flex-col space-y-4 mb-8">
        {/* Top row - Buttons */}
        <div className="flex justify-end space-x-4">
          <Button variant="create" onClick={() => setIsFacturasPopup2Open(true)}>
            <FileText className="w-4 h-4 mr-2" />
            Nueva Factura 
          </Button>
          <Button variant="create" onClick={() => setIsEscanearFacturaPopupOpen(true)}>
            <FileText className="w-4 h-4 mr-2" />
            Escanear Factura
          </Button>
          <div className="flex items-center">
            <Button
              variant="csv"
              onClick={() => {
                if (isExportMode && selectedInvoices.length > 0) {
                  handleExportSelected();
                } else {
                  setIsExportMode(!isExportMode);
                  setSelectedInvoices([]);
                }
              }}
              className="flex items-center space-x-2"
            >
              <Download className="w-4 h-4 mr-2" />
              <span>{isExportMode ? `Exportar ${selectedInvoices.length} seleccionadas` : 'Exportar'}</span>
              {isExportMode && (
                <div className="flex items-center ml-4 bg-white/10 rounded-full p-1">
                  <button
                    className={`px-3 py-1 rounded-full text-sm transition-colors ${
                      exportFormat === 'CSV' 
                        ? 'bg-white text-blue-600' 
                        : 'text-white hover:bg-white/20'
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setExportFormat('CSV');
                    }}
                  >
                    CSV
                  </button>
                  <button
                    className={`px-3 py-1 rounded-full text-sm transition-colors ${
                      exportFormat === 'PDF' 
                        ? 'bg-white text-blue-600' 
                        : 'text-white hover:bg-white/20'
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setExportFormat('PDF');
                    }}
                  >
                    PDF
                  </button>
                </div>
              )}
            </Button>
          </div>
        </div>

        {/* Bottom row - Search and Filter */}
        <div className="flex items-center space-x-2">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Buscar facturas..."
              value={searchTerm}
              onChange={handleSearchChange}
              className={`w-full px-4 py-2 rounded-full ${
                theme === 'dark' 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-800'
              } border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300`}
            />
            <Search className={`absolute right-3 top-2.5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
          </div>
          <div className="relative">
            <Button 
              variant="filter" 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={isFilterOpen ? 'ring-2 ring-blue-500' : ''}
            >
              <Filter className="w-4 h-4" />
            </Button>
            <FacturasFilter
              isOpen={isFilterOpen}
              onClose={() => setIsFilterOpen(false)}
              onApplyFilters={onApplyFilters}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default FacturasHeader;