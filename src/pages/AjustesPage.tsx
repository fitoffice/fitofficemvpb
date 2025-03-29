import React from 'react';
import { useNavigate } from 'react-router-dom';
import IdiomaSettings from '../components/Ajustes/IdiomaSettings';
import NotificacionesSettings from '../components/Ajustes/NotificacionesSettings';
import FacturacionSettings from '../components/Ajustes/FacturacionSettings';
import IntegracionesSettings from '../components/Ajustes/IntegracionesSettings';
import ComunicacionSettings from '../components/Ajustes/ComunicacionSettings';
import SeguridadSettings from '../components/Ajustes/SeguridadSettings';
import SoporteSettings from '../components/Ajustes/SoporteSettings';
import NovedadesSettings from '../components/Ajustes/NovedadesSettings';
import Button from '../components/Common/Button';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';

const AjustesPage: React.FC = () => {
  const { theme } = useTheme();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className={`container mx-auto px-4 py-8 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-800'}`}>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Ajustes</h1>
        <Button variant="danger" onClick={handleLogout}>Cerrar Sesión</Button>
      </div>
      <div className="space-y-6">
        <IdiomaSettings />
        <NotificacionesSettings />
        <FacturacionSettings />
        <IntegracionesSettings />
        <ComunicacionSettings />
        <SeguridadSettings />
        <SoporteSettings />
        <NovedadesSettings />
      </div>
      <div className="mt-8 flex justify-end">
        <Button variant="create">Guardar Cambios</Button>
      </div>
    </div>
  );
};

export default AjustesPage;