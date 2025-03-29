import React from 'react';
import { Bell } from 'lucide-react';

const NotificacionesSettings: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        <Bell className="mr-2" /> Notificaciones
      </h2>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span>Correo Electrónico</span>
          <label className="switch">
            <input type="checkbox" defaultChecked />
            <span className="slider round"></span>
          </label>
        </div>
        <div className="flex items-center justify-between">
          <span>SMS</span>
          <label className="switch">
            <input type="checkbox" />
            <span className="slider round"></span>
          </label>
        </div>
        <div className="flex items-center justify-between">
          <span>Push</span>
          <label className="switch">
            <input type="checkbox" />
            <span className="slider round"></span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default NotificacionesSettings;