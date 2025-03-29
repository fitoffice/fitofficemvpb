import React from 'react';
import { Table, Filter } from 'lucide-react';

interface Sale {
  id: string;
  estado: string;
  correoElectronico: string;
  dinero: number;
}

const RecentSalesTable: React.FC = () => {
  const salesData: Sale[] = [
    { id: '1', estado: 'Completado', correoElectronico: 'cliente1@example.com', dinero: 100 },
    { id: '2', estado: 'Pendiente', correoElectronico: 'cliente2@example.com', dinero: 150 },
    { id: '3', estado: 'Completado', correoElectronico: 'cliente3@example.com', dinero: 200 },
    // Añade más datos de ejemplo aquí
  ];

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold flex items-center">
          <Table className="w-5 h-5 mr-2" />
          Ventas Recientes
        </h3>
        <div className="flex items-center">
          <input
            type="text"
            placeholder="Buscar..."
            className="px-3 py-1 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button className="bg-blue-500 text-white px-3 py-1 rounded-r-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Correo Electrónico</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dinero</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {salesData.map((sale) => (
              <tr key={sale.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    sale.estado === 'Completado' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {sale.estado}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{sale.correoElectronico}</td>
                <td className="px-6 py-4 whitespace-nowrap">{sale.dinero.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <a href="#" className="text-indigo-600 hover:text-indigo-900">Editar</a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-gray-700">
          Mostrando <span className="font-medium">1</span> a <span className="font-medium">3</span> de <span className="font-medium">3</span> resultados
        </div>
        <div className="flex-1 flex justify-end">
          <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
            <a href="#" className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
              Anterior
            </a>
            <a href="#" className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
              1
            </a>
            <a href="#" className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
              Siguiente
            </a>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default RecentSalesTable;