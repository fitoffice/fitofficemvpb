import React, { useState } from 'react';
import { useTheme } from '../../../contexts/ThemeContext';
import {
  Settings,
  Bell,
  Shield,
  Calendar,
  Clock,
  BarChart2,
  Save,
  Trash2,
  Moon,
  Sun,
  Globe,
  Lock,
  Volume2,
  BellOff,
  CheckCircle,
} from 'lucide-react';
import Button from '../../Common/Button';
import { motion } from 'framer-motion';

interface Planning {
  id: string;
  nombre: string;
  descripcion: string;
  semanas: number;
  plan: any[];
}

interface VistaConfiguracionProps {
  planning: Planning;
  setPlanning: (planning: Planning) => void;
}

const VistaConfiguracion: React.FC<VistaConfiguracionProps> = ({
  planning,
  setPlanning,
}) => {
  const { theme, toggleTheme } = useTheme();
  const [checkingsEnabled, setCheckingsEnabled] = useState(true);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setPlanning({
      ...planning,
      [name]: value,
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
          Configuración
        </h1>
        <Button
          variant="normal"
          onClick={toggleTheme}
          className="flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white"
        >
          {theme === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          <span>{theme === 'dark' ? 'Modo Oscuro' : 'Modo Claro'}</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-6 rounded-xl shadow-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}
        >
          <div className="flex items-center space-x-3 mb-6">
            <Settings className="w-6 h-6 text-blue-500" />
            <h2 className="text-xl font-bold">General</h2>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Nombre del Plan</label>
              <input
                type="text"
                name="nombre"
                value={planning.nombre}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 transition-all ${
                  theme === 'dark'
                    ? 'bg-gray-800 border-gray-600'
                    : 'bg-white border-gray-300'
                }`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Descripción</label>
              <textarea
                name="descripcion"
                value={planning.descripcion}
                onChange={handleInputChange}
                rows={4}
                className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 transition-all ${
                  theme === 'dark'
                    ? 'bg-gray-800 border-gray-600'
                    : 'bg-white border-gray-300'
                }`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Duración (semanas)</label>
              <input
                type="number"
                name="semanas"
                value={planning.semanas}
                onChange={handleInputChange}
                min="1"
                className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 transition-all ${
                  theme === 'dark'
                    ? 'bg-gray-800 border-gray-600'
                    : 'bg-white border-gray-300'
                }`}
              />
            </div>

            <label
              className={`flex items-start space-x-4 p-4 rounded-lg cursor-pointer transition-all mt-4 ${
                theme === 'dark' ? 'hover:bg-gray-600' : 'hover:bg-gray-100'
              }`}
            >
              <div className="flex-shrink-0 mt-1">
                <CheckCircle className="w-5 h-5 text-blue-500" />
              </div>
              <div className="flex-grow">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Activar checkings</span>
                  <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out">
                    <input
                      type="checkbox"
                      checked={checkingsEnabled}
                      onChange={(e) => setCheckingsEnabled(e.target.checked)}
                      className="opacity-0 w-0 h-0"
                      id="toggle-checkings"
                    />
                    <label
                      htmlFor="toggle-checkings"
                      className={`absolute cursor-pointer inset-0 rounded-full transition-all duration-300 ${
                        checkingsEnabled
                          ? 'bg-blue-500'
                          : theme === 'dark'
                          ? 'bg-gray-600'
                          : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`absolute left-1 top-1 w-4 h-4 rounded-full transition-transform duration-300 transform ${
                          checkingsEnabled ? 'translate-x-6 bg-white' : 'translate-x-0 bg-white'
                        }`}
                      />
                    </label>
                  </div>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Habilita los indicadores de estado para cada día de entrenamiento
                </p>
              </div>
            </label>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`p-6 rounded-xl shadow-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}
        >
          <div className="flex items-center space-x-3 mb-6">
            <Bell className="w-6 h-6 text-purple-500" />
            <h2 className="text-xl font-bold">Notificaciones</h2>
          </div>

          <div className="space-y-6">
            {[
              { 
                icon: Calendar,
                label: 'Recordatorios de entrenamiento',
                description: 'Recibe alertas antes de cada sesión',
                defaultChecked: true 
              },
              { 
                icon: BarChart2,
                label: 'Actualizaciones de progreso',
                description: 'Informes semanales de tu progreso',
                defaultChecked: true 
              },
              { 
                icon: Volume2,
                label: 'Consejos y recomendaciones',
                description: 'Recibe tips personalizados',
                defaultChecked: false 
              },
            ].map((item, index) => (
              <label
                key={index}
                className={`flex items-start space-x-4 p-4 rounded-lg cursor-pointer transition-all ${
                  theme === 'dark' ? 'hover:bg-gray-600' : 'hover:bg-gray-100'
                }`}
              >
                <div className="flex-shrink-0 mt-1">
                  {item.icon && <item.icon className="w-5 h-5 text-blue-500" />}
                </div>
                <div className="flex-grow">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{item.label}</span>
                    <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out">
                      <input
                        type="checkbox"
                        defaultChecked={item.defaultChecked}
                        className="opacity-0 w-0 h-0"
                        id={`toggle-${index}`}
                      />
                      <label
                        htmlFor={`toggle-${index}`}
                        className={`absolute cursor-pointer inset-0 rounded-full transition-all duration-300 ${
                          item.defaultChecked
                            ? 'bg-blue-500'
                            : theme === 'dark'
                            ? 'bg-gray-600'
                            : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`absolute left-1 top-1 w-4 h-4 rounded-full transition-transform duration-300 transform ${
                            item.defaultChecked ? 'translate-x-6 bg-white' : 'translate-x-0 bg-white'
                          }`}
                        />
                      </label>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {item.description}
                  </p>
                </div>
              </label>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className={`p-6 rounded-xl shadow-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}
        >
          <div className="flex items-center space-x-3 mb-6">
            <Shield className="w-6 h-6 text-green-500" />
            <h2 className="text-xl font-bold">Privacidad</h2>
          </div>

          <div className="space-y-6">
            {[
              { 
                icon: Globe,
                label: 'Perfil público',
                description: 'Permite que otros vean tu perfil',
                defaultChecked: false 
              },
              { 
                icon: BarChart2,
                label: 'Mostrar estadísticas',
                description: 'Comparte tus estadísticas de progreso',
                defaultChecked: true 
              },
              { 
                icon: Lock,
                label: 'Modo privado',
                description: 'Oculta toda tu actividad',
                defaultChecked: false 
              },
            ].map((item, index) => (
              <label
                key={index}
                className={`flex items-start space-x-4 p-4 rounded-lg cursor-pointer transition-all ${
                  theme === 'dark' ? 'hover:bg-gray-600' : 'hover:bg-gray-100'
                }`}
              >
                <div className="flex-shrink-0 mt-1">
                  {item.icon && <item.icon className="w-5 h-5 text-green-500" />}
                </div>
                <div className="flex-grow">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{item.label}</span>
                    <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out">
                      <input
                        type="checkbox"
                        defaultChecked={item.defaultChecked}
                        className="opacity-0 w-0 h-0"
                        id={`privacy-${index}`}
                      />
                      <label
                        htmlFor={`privacy-${index}`}
                        className={`absolute cursor-pointer inset-0 rounded-full transition-all duration-300 ${
                          item.defaultChecked
                            ? 'bg-green-500'
                            : theme === 'dark'
                            ? 'bg-gray-600'
                            : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`absolute left-1 top-1 w-4 h-4 rounded-full transition-transform duration-300 transform ${
                            item.defaultChecked ? 'translate-x-6 bg-white' : 'translate-x-0 bg-white'
                          }`}
                        />
                      </label>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {item.description}
                  </p>
                </div>
              </label>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="flex justify-between space-x-4 mt-8">
        <Button
          variant="delete"
          className="flex items-center space-x-2"
        >
          <Trash2 className="w-5 h-5" />
          <span>Eliminar Plan</span>
        </Button>
        <Button
          variant="create"
          className="flex items-center space-x-2"
        >
          <Save className="w-5 h-5" />
          <span>Guardar Cambios</span>
        </Button>
      </div>
    </div>
  );
};

export default VistaConfiguracion;