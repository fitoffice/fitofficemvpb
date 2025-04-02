import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Users,
  Dumbbell,
  Salad,
  DollarSign,
  Megaphone,
  BarChart2,
  Share2,
  Home,
  Sun,
  Moon,
  ChevronLeft,
  ChevronRight,
  Settings,
  BookOpen,
  Layout,
  MailPlus,
  FileText,
  Star,
  UserCheck
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';


const Sidebar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [isExpanded, setIsExpanded] = useState(true);
  const location = useLocation();


  const navItems = [
    { to: '/', icon: Home, label: 'Dashboard', visible: false },
    { to: '/clients', icon: Users, label: 'Clientes', visible: true },
    { to: '/agentes', icon: UserCheck, label: 'Agentes', visible: false },
    { to: '/servicios', icon: Layout, label: 'Servicios', visible: true },
    { to: '/reportes-web', icon: FileText, label: 'Reportes Web', visible: false },
    { to: '/routines', icon: Dumbbell, label: 'Entrenamiento', visible: true },
    { to: '/diets', icon: Salad, label: 'Dietas', visible: true },
    { to: '/classes', icon: BookOpen, label: 'Clases', visible: true }, 
    { to: '/economics', icon: DollarSign, label: 'Finanzas', visible: false },
    { to: '/marketing/campaigns', icon: MailPlus , label: 'Campañas de Correo', visible: false },
    { to: '/content-publishing', icon: Share2, label: 'Contenido', visible: false },
    { to: '/publications', icon: Share2, label: 'Publicaciones', visible: false },
    { to: '/settings', icon: Settings, label: 'Ajustes', visible: false },
  ];


  const isActive = (path: string) => location.pathname === path;


  return (
    <nav
      className={`${
        theme === 'dark'
          ? 'bg-gradient-to-br from-slate-950 via-indigo-950 to-violet-950 border-r border-indigo-400/10'
          : 'bg-gradient-to-br from-blue-500 via-indigo-500 to-violet-500 border-r border-white/10'
      } text-white ${
        isExpanded ? 'w-72' : 'w-20'
      } min-h-screen p-6 transition-all duration-300 ease-in-out relative shadow-2xl backdrop-blur-sm`}
    >
      {/* Animated gradient border */}
      <div className="absolute inset-0 bg-gradient-to-b from-cyan-500 via-purple-500 to-pink-500 opacity-20 animate-gradient-y pointer-events-none"></div>


      <div className="flex justify-between items-center mb-10 relative z-10">
        {isExpanded && (
          <div className="flex items-center gap-4">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 rounded-lg opacity-30 group-hover:opacity-70 blur transition duration-300"></div>
              <div className={`relative p-3 rounded-lg transition-all duration-300 ${
                theme === 'dark'
                  ? 'bg-slate-950/50 hover:bg-slate-900/60'
                  : 'bg-white/10 hover:bg-white/20'
              } hover:scale-110 backdrop-blur-sm`}>
                <Dumbbell className={`w-6 h-6 ${
                  theme === 'dark' ? 'text-cyan-400' : 'text-white'
                } group-hover:rotate-12 transition-all duration-300`} />
              </div>
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400">
                  FitOffice
                </span>
              </h2>
              <p className={`text-xs font-medium ${
                theme === 'dark' ? 'text-indigo-300/80' : 'text-white/90'
              }`}>
                Gestión Profesional
              </p>
            </div>
          </div>
        )}
        <button
          onClick={toggleTheme}
          className={`relative group p-3 rounded-xl transition-all duration-300 ${
            theme === 'dark'
              ? 'bg-slate-900/50 hover:bg-slate-800/60'
              : 'bg-white/10 hover:bg-white/20'
          }`}
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-xl opacity-0 group-hover:opacity-50 blur transition duration-300"></div>
          {theme === 'dark' ?
            <Sun size={20} className="relative z-10 text-cyan-400 transform group-hover:rotate-180 transition-all duration-500" /> :
            <Moon size={20} className="relative z-10 text-white transform group-hover:rotate-180 transition-all duration-500" />
          }
        </button>
      </div>


      <div className="space-y-2 relative z-10">
        {navItems.filter(item => item.visible).map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-300 group relative overflow-hidden ${
              isActive(item.to)
                ? theme === 'dark'
                  ? 'bg-slate-900/60 text-cyan-400 font-medium'
                  : 'bg-white/20 text-white font-medium'
                : theme === 'dark'
                  ? 'hover:bg-slate-900/40 text-indigo-300/90'
                  : 'hover:bg-white/10 text-white/90'
            } hover:scale-[1.02] hover:shadow-lg hover:shadow-purple-500/10`}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            <item.icon className={`w-5 h-5 relative z-10 ${
              isActive(item.to)
                ? 'text-current'
                : 'group-hover:text-current transition-colors duration-300'
            } group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`} />
            {isExpanded && (
              <span className="relative z-10 transition-all duration-300">
                {item.label}
              </span>
            )}
          </Link>
        ))}
      </div>


      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`absolute -right-3 bottom-6 p-2.5 rounded-full transition-all duration-300 ${
          theme === 'dark'
            ? 'bg-slate-900 text-cyan-400 hover:bg-slate-800'
            : 'bg-white/90 text-indigo-600 hover:bg-white'
        } hover:scale-110 hover:shadow-lg hover:shadow-purple-500/20 backdrop-blur-sm`}
      >
        <div className="relative">
          {isExpanded ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
        </div>
      </button>


      {/* Glass effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-white/5 pointer-events-none backdrop-blur-[1px]"></div>
    </nav>
  );
};


export default Sidebar;