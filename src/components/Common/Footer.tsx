import React from 'react';
import { Dumbbell, Heart, Twitter, Instagram, Facebook, Mail } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

const Footer: React.FC = () => {
  const { theme } = useTheme();
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Mail, href: '#', label: 'Email' },
  ];

  return (
    <footer className={`${
      theme === 'dark' 
        ? 'bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-gray-300' 
        : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white'
    } py-8 relative overflow-hidden`}>
      {/* Efecto de fondo */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80')] bg-cover bg-center opacity-10"></div>

      <div className="container mx-auto px-6 relative">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Logo y descripción */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
                <div className={`relative p-2 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white/10'}`}>
                  <Dumbbell className={`w-6 h-6 ${theme === 'dark' ? 'text-blue-400' : 'text-white'}`} />
                </div>
              </div>
              <span className="text-xl font-bold">FitOffice</span>
            </div>
            <p className="text-sm opacity-75">
              Transformando la gestión del fitness con tecnología innovadora y soluciones integrales para profesionales.
            </p>
          </div>

          {/* Enlaces rápidos */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Enlaces Rápidos</h3>
            <div className="grid grid-cols-2 gap-2">
              {['Inicio', 'Servicios', 'Precios', 'Contacto', 'Blog', 'Soporte'].map((link) => (
                <a
                  key={link}
                  href="#"
                  className={`text-sm hover:underline decoration-2 underline-offset-4 ${
                    theme === 'dark' ? 'decoration-blue-400' : 'decoration-white'
                  }`}
                >
                  {link}
                </a>
              ))}
            </div>
          </div>

          {/* Redes sociales */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Síguenos</h3>
            <div className="flex space-x-4">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  className={`p-2 rounded-lg transition-all duration-300 hover:scale-110 ${
                    theme === 'dark' ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white/10 hover:bg-white/20'
                  }`}
                  aria-label={label}
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Línea divisoria */}
        <div className={`my-8 border-t ${
          theme === 'dark' ? 'border-gray-800' : 'border-white/10'
        }`}></div>

        {/* Copyright y créditos */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-sm">
            &copy; {currentYear} FitOffice. Todos los derechos reservados.
          </div>
          <div className="flex items-center space-x-1 text-sm">
            <span>Desarrollado </span>
            <Heart className="w-4 h-4 text-red-500 fill-current animate-pulse" />
            <span>por</span>
<a>CodeCraft</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;