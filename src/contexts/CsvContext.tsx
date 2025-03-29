import React, { createContext, useState, useContext, ReactNode } from 'react';
import { CsvPreview } from '../components/Marketing/CsvPreview';
import axios from 'axios';
import { toast } from 'react-hot-toast';

interface CsvContextType {
  csvData: Array<any>;
  showCsvPreview: boolean;
  handleCsvImport: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleCsvButtonClick: () => void;
  handleCsvConfirm: (mappedData: Array<any>) => void;
  handleCsvCancel: () => void;
}

const CsvContext = createContext<CsvContextType | undefined>(undefined);

export const useCsv = () => {
  const context = useContext(CsvContext);
  if (!context) {
    throw new Error('useCsv must be used within a CsvProvider');
  }
  return context;
};

interface CsvProviderProps {
  children: ReactNode;
}

export const CsvProvider: React.FC<CsvProviderProps> = ({ children }) => {
  const [csvData, setCsvData] = useState<Array<any>>([]);
  const [showCsvPreview, setShowCsvPreview] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const getAuthToken = () => {
    return localStorage.getItem('token');
  };

  const handleCsvImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        const rows = text.split('\n');
        const headers = rows[0].split(',').map(header => header.trim());
        const data = rows.slice(1)
          .filter(row => row.trim()) // Filtrar filas vacías
          .map(row => {
            const values = row.split(',').map(value => value.trim());
            return headers.reduce((obj: any, header, index) => {
              obj[header] = values[index];
              return obj;
            }, {});
          });
        setCsvData(data);
        setShowCsvPreview(true);
      };
      reader.readAsText(file);
    } catch (err) {
      console.error('Error reading CSV:', err);
      toast.error('Error al leer el archivo CSV');
    }

    // Limpiar el input file
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleCsvConfirm = async (mappedData: Array<any>) => {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('No se encontró el token de autenticación');
      }

      const response = await axios.post(
        'https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/leads/import-csv',
        { leads: mappedData },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        toast.success('Leads importados exitosamente');
        // Aquí podríamos emitir un evento para que los componentes que muestran leads se actualicen
        window.dispatchEvent(new CustomEvent('leads-imported'));
      } else {
        toast.error('Error al importar los leads');
      }
    } catch (err) {
      console.error('Error importing CSV:', err);
      toast.error('Error al importar el archivo CSV');
    }
    setShowCsvPreview(false);
    setCsvData([]);
  };

  const handleCsvCancel = () => {
    setShowCsvPreview(false);
    setCsvData([]);
  };

  const handleCsvButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <CsvContext.Provider
      value={{
        csvData,
        showCsvPreview,
        handleCsvImport,
        handleCsvButtonClick,
        handleCsvConfirm,
        handleCsvCancel
      }}
    >
      {children}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleCsvImport}
        accept=".csv"
        style={{ display: 'none' }}
      />
      {showCsvPreview && (
        <CsvPreview
          csvData={csvData}
          onConfirm={handleCsvConfirm}
          onCancel={handleCsvCancel}
        />
      )}
    </CsvContext.Provider>
  );
};