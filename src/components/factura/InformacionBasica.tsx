import React from 'react';

interface InformacionBasicaProps {
  formData: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  theme: string;
}

const InformacionBasica: React.FC<InformacionBasicaProps> = ({ formData, handleChange, theme }) => {
  return (
    <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
      <h3 className="text-lg font-semibold mb-4">Información Básica</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block mb-1">Número de Factura</label>
          <input
            type="text"
            name="numeroFactura"
            value={formData.numeroFactura}
            onChange={handleChange}
            className={`w-full p-2 rounded border ${
              theme === 'dark' ? 'bg-gray-600 border-gray-500' : 'bg-white border-gray-300'
            }`}
            required
          />
        </div>
        <div>
          <label className="block mb-1">Fecha de Emisión</label>
          <input
            type="date"
            name="fecha"
            value={formData.fecha}
            onChange={handleChange}
            className={`w-full p-2 rounded border ${
              theme === 'dark' ? 'bg-gray-600 border-gray-500' : 'bg-white border-gray-300'
            }`}
            required
          />
        </div>
        <div>
          <label className="block mb-1">Fecha de Vencimiento</label>
          <input
            type="date"
            name="fechaVencimiento"
            value={formData.fechaVencimiento}
            onChange={handleChange}
            className={`w-full p-2 rounded border ${
              theme === 'dark' ? 'bg-gray-600 border-gray-500' : 'bg-white border-gray-300'
            }`}
            required
          />
        </div>
        <div>
          <label className="block mb-1">Método de Pago</label>
          <select
            name="metodoPago"
            value={formData.metodoPago}
            onChange={handleChange}
            className={`w-full p-2 rounded border ${
              theme === 'dark' ? 'bg-gray-600 border-gray-500' : 'bg-white border-gray-300'
            }`}
            required
          >
            <option value="">Seleccionar...</option>
            <option value="Transferencia">Transferencia Bancaria</option>
            <option value="Efectivo">Efectivo</option>
            <option value="Tarjeta">Tarjeta de Crédito/Débito</option>
            <option value="PayPal">PayPal</option>
            <option value="Otro">Otro</option>
          </select>
        </div>
        <div>
          <label className="block mb-1">Tipo de Factura</label>
          <select
            name="tipoFactura"
            value={formData.tipoFactura}
            onChange={handleChange}
            className={`w-full p-2 rounded border ${
              theme === 'dark' ? 'bg-gray-600 border-gray-500' : 'bg-white border-gray-300'
            }`}
            required
          >
            <option value="completa">Factura Completa</option>
            <option value="proforma">Factura Proforma</option>
            <option value="simple">Factura Simplificada</option>
          </select>
        </div>
        <div>
          <label className="block mb-1">Moneda</label>
          <select
            name="currency"
            value={formData.currency}
            onChange={handleChange}
            className={`w-full p-2 rounded border ${
              theme === 'dark' ? 'bg-gray-600 border-gray-500' : 'bg-white border-gray-300'
            }`}
            required
          >
            <option value="EUR">EUR (€)</option>
            <option value="USD">USD ($)</option>
            <option value="GBP">GBP (£)</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default InformacionBasica;