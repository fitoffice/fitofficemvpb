import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { motion } from 'framer-motion';
import { Users, Clock, FileText, UserPlus } from 'react-feather';
import MetricCard from '../../components/Economics/Planes/MetricCard';
import ClientesServicioWidget from '../../components/Economics/Planes/ClientesServicioWidget';

const PlanesPage: React.FC = () => {
  const { theme } = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`p-6 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-800'}`}
    >
      <h2 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text">
        Gestión de Servicios
      </h2>

      {/* MetricCards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard title="Clientes Actuales" value="200" icon={<Users className="w-6 h-6 text-blue-500" />} />
        <MetricCard title="Nuevos Clientes (este mes) " value="40" icon={<Clock className="w-6 h-6 text-yellow-500" />} />
        <MetricCard title="Planes Vendidos" value="150" icon={<FileText className="w-6 h-6 text-green-500" />} />
        <MetricCard title="Nuevos Planes (este mes)" value="25" icon={<UserPlus className="w-6 h-6 text-purple-500" />} />
      </div>

      {/* ClientesServicioWidget - Ocupa todo el ancho de la pantalla */}
      <motion.div
        className="w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <ClientesServicioWidget />
      </motion.div>
    </motion.div>
  );
};

export default PlanesPage;
