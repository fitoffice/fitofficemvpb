import React from 'react';

interface InformacionAdicionalProps {
  formData: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  theme: string;
}

const InformacionAdicional: React.FC<InformacionAdicionalProps> = ({ formData, handleChange, theme }) => {
  return (
    <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
      <h3 className="text-lg font-semibold mb-4">Información Adicional</h3>
      
      <div className="mb-4">
        <label className="block mb-1">Comentarios</label>
        <textarea
          name="comentarios"
          value={formData.comentarios}
          onChange={handleChange}
          rows={3}
          className={`w-full p-2 rounded border ${
            theme === 'dark' ? 'bg-gray-600 border-gray-500' : 'bg-white border-gray-300'
          }`}
        ></textarea>
      </div>
      
      <div className="mb-4">
        <label className="block mb-1">Condiciones de Pago</label>
        <textarea
          name="condiciones"
          value={formData.condiciones}
          onChange={handleChange}
          rows={3}
          className={`w-full p-2 rounded border ${
            theme === 'dark' ? 'bg-gray-600 border-gray-500' : 'bg-white border-gray-300'
          }`}
        ></textarea>
      </div>
      
      <div className="flex items-center mb-4">
        <input
          type="checkbox"
          id="proteccionDatos"
          name="proteccionDatos"
          checked={formData.proteccionDatos}
          onChange={handleChange}
          className="mr-2"
        />
        <label htmlFor="proteccionDatos">
          Incluir cláusula de protección de datos
        </label>
      </div>
    </div>
  );
};

export default InformacionAdicional;