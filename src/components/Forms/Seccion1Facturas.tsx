import React from 'react';

interface Seccion1FacturasProps {
  formData: {
    fecha: string;
    numeroFactura: string;
    facturaSimplificada: boolean;
    metodoPago: string;
    currency: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
}

const Seccion1Facturas: React.FC<Seccion1FacturasProps> = ({ formData, handleChange, setFormData }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h2 className="text-xl font-semibold text-gray-800">Información Básica</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Número de Factura
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              name="fecha"
              value={formData.fecha}
              onChange={handleChange}
              pattern="[0-9]{4}"
              maxLength={4}
              placeholder="YYYY"
              className="w-24 px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
            <span className="text-xl font-medium text-gray-700">-</span>
            <input
              type="text"
              name="numeroFactura"
              value={formData.numeroFactura}
              onChange={handleChange}
              pattern="[0-9]{4}"
              maxLength={4}
              placeholder="0000"
              className="w-24 px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Tipo de Factura
          </label>
          <div className="flex items-center space-x-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="facturaSimplificada"
                checked={!formData.facturaSimplificada}
                onChange={() => setFormData(prev => ({ ...prev, facturaSimplificada: false }))}
                className="form-radio h-4 w-4 text-blue-600"
              />
              <span className="ml-2">Compuesta</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="facturaSimplificada"
                checked={formData.facturaSimplificada}
                onChange={() => setFormData(prev => ({ ...prev, facturaSimplificada: true }))}
                className="form-radio h-4 w-4 text-blue-600"
              />
              <span className="ml-2">Simplificada</span>
            </label>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Método de Pago
          </label>
          <select
            name="metodoPago"
            value={formData.metodoPago}
            onChange={handleChange}
            className="w-40 px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            required
          >
            <option value="">Seleccionar</option>
            <option value="efectivo">Efectivo</option>
            <option value="tarjeta">Tarjeta</option>
            <option value="transferencia">Transferencia</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Moneda
          </label>
          <select
            name="currency"
            value={formData.currency}
            onChange={handleChange}
            className="w-32 px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            required
          >
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="GBP">GBP</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default Seccion1Facturas;
