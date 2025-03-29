import React, { useState } from 'react';
import { Upload } from 'lucide-react';
import ContratoForm from './tipos-documento/ContratoForm';
import LicenciaForm from './tipos-documento/LicenciaForm';
import DocumentoGenericoForm from './tipos-documento/DocumentoGenericoForm';

type TipoDocumento = 'contrato' | 'licencia' | 'documento' | '';

interface DocumentoFormProps {
  onSubmit: (formData: any) => void;
  onCancel: () => void;
}

const DocumentoForm: React.FC<DocumentoFormProps> = ({ onSubmit, onCancel }) => {
  const [tipoDocumento, setTipoDocumento] = useState<TipoDocumento>('');
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  const handleTipoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tipoDocumento) {
      setMostrarFormulario(true);
    }
  };

  const handleFormSubmit = (data: any) => {
    onSubmit({
      tipo: tipoDocumento,
      ...data
    });
  };

  const renderFormulario = () => {
    switch (tipoDocumento) {
      case 'contrato':
        return <ContratoForm onSubmit={handleFormSubmit} onCancel={onCancel} />;
      case 'licencia':
        return <LicenciaForm onSubmit={handleFormSubmit} onCancel={onCancel} />;
      case 'documento':
        return <DocumentoGenericoForm onSubmit={handleFormSubmit} onCancel={onCancel} />;
      default:
        return null;
    }
  };

  if (mostrarFormulario) {
    return renderFormulario();
  }

  return (
    <form onSubmit={handleTipoSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Tipo de Documento
        </label>
        <select
          value={tipoDocumento}
          onChange={(e) => setTipoDocumento(e.target.value as TipoDocumento)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          required
        >
          <option value="">Seleccionar tipo de documento</option>
          <option value="contrato">Contrato</option>
          <option value="licencia">Licencia</option>
          <option value="documento">Documento</option>
        </select>
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        >
          Añadir
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
};

export default DocumentoForm;