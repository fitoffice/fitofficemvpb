import React from 'react';
import ReactDOM from 'react-dom';
import { X } from 'lucide-react';

interface Alert {
  _id: string;
  nombre: string;
  tipo: string;
  fechaExpiracion: string;
  estado: string;
}

interface NotificationsPortalProps {
  alerts: Alert[];
  onClose: () => void;
  formatDate: (date: string) => string;
  buttonRef: React.RefObject<HTMLButtonElement>;
}

const NotificationsPortal: React.FC<NotificationsPortalProps> = ({
  alerts,
  onClose,
  formatDate,
  buttonRef,
}) => {
  const [position, setPosition] = React.useState({ top: 0, right: 0 });

  React.useEffect(() => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + 8,
        right: window.innerWidth - rect.right,
      });
    }
  }, [buttonRef]);

  return ReactDOM.createPortal(
    <div
      className="fixed z-50"
      style={{
        top: `${position.top}px`,
        right: `${position.right}px`,
      }}
    >
      <div className="w-80 rounded-xl shadow-lg bg-white">
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-3 text-gray-800 flex items-center justify-between">
            Notificaciones
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={20} className="text-gray-500" />
            </button>
          </h3>
          <div className="space-y-3 max-h-[calc(100vh-200px)] overflow-y-auto">
            {alerts.length > 0 ? (
              alerts.map((alert) => (
                <div 
                  key={alert._id}
                  className="p-3 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer"
                >
                  <h4 className="font-medium text-gray-800">
                    {alert.nombre}
                  </h4>
                  <p className="text-sm text-gray-600">
                    Tipo: {alert.tipo}
                  </p>
                  <p className="text-sm text-gray-600">
                    Vence: {formatDate(alert.fechaExpiracion)}
                  </p>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    alert.estado === 'Finalizada' 
                      ? 'bg-green-500 text-white' 
                      : 'bg-yellow-500 text-white'
                  }`}>
                    {alert.estado}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-center py-3 text-gray-600">
                No hay notificaciones
              </p>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default NotificationsPortal;
