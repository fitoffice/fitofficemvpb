import React, { useState, useEffect } from 'react';
import {
  DollarSign,
  PieChart,
  FileText,
  TrendingUp,
  ChevronRight,
  Moon,
  Sun,
  BarChart2,
  Wallet,
  ClipboardList
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import PanelDeControl from './PanelDeControl';
import CashflowPage from './CashflowPage';
import PlanesPage from './PlanesPage';
import DocumentosPage from './DocumentosPage';
import FacturasPage from './FacturasPage';
import ReportesPage from './ReportesPage';
import { useTheme } from '../../contexts/ThemeContext';
import { motion } from 'framer-motion';


interface EconomicsPageProps {
  initialSection?: string;
}


const EconomicsPage: React.FC<EconomicsPageProps> = ({ initialSection = 'panel' }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeSection, setActiveSection] = useState(initialSection);
  const { theme, toggleTheme } = useTheme();
  const [layout, setLayout] = useState('default');
  const [editMode, setEditMode] = useState(false);
  const [isFacturaPopupOpen, setIsFacturaPopupOpen] = useState(false);
  const [isEscanearFacturaPopupOpen, setIsEscanearFacturaPopupOpen] = useState(false);


  // Update active section if initialSection prop changes
  useEffect(() => {
    if (initialSection) {
      setActiveSection(initialSection);
    }
  }, [initialSection]);


  // Check URL path on component mount and when location changes
  useEffect(() => {
    if (location.pathname === '/economics/cashflow') {
      setActiveSection('cashflow');
    } else if (location.pathname === '/economics/planes') {
      setActiveSection('planes');
    } else if (location.pathname === '/economics/documentos') {
      setActiveSection('documentos');
    } else if (location.pathname === '/economics/facturas') {
      setActiveSection('facturas');
    } else if (location.pathname === '/economics/reportes') {
      setActiveSection('reportes');
    }
  }, [location.pathname]);




  const sections = [
    { id: 'panel', label: 'Panel de Control', icon: TrendingUp, navIcon: BarChart2, visible: true },
    { id: 'cashflow', label: 'Cashflow', icon: DollarSign, navIcon: Wallet, visible: true },
    { id: 'planes', label: 'Servicios', icon: PieChart, navIcon: ClipboardList, visible: true },
    { id: 'documentos', label: 'Documentos', icon: FileText, navIcon: FileText, visible: true },
    { id: 'facturas', label: 'Facturas', icon: FileText, navIcon: DollarSign, visible: false },
    { id: 'reportes', label: 'Reportes', icon: TrendingUp, navIcon: PieChart, visible: false },
  ];


  // Handle section change with URL update
  const handleSectionChange = (sectionId: string) => {
    setActiveSection(sectionId);
    if (sectionId === 'cashflow') {
      navigate('/economics/cashflow', { replace: true });
    } else if (sectionId === 'planes') {
      navigate('/economics/servicios', { replace: true });
    } else if (sectionId === 'documentos') {
      navigate('/economics/documentos', { replace: true });
    } else if (sectionId === 'facturas') {
      navigate('/economics/facturas', { replace: true });
    } else if (sectionId === 'reportes') {
      navigate('/economics/reportes', { replace: true });
    } else {
      navigate('/economics', { replace: true });
    }
  };


  // Rest of the component remains the same
  const styles = {
    container: `flex flex-col h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-800'}`,
    header: `${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-md p-4 relative`,
    title: 'text-2xl font-bold flex items-center',
    button: `p-2 rounded-full ${theme === 'dark'
      ? 'bg-gray-700 text-blue-400 hover:bg-gray-600'
      : 'bg-gray-100 text-blue-600 hover:bg-gray-200'}
      transition-colors duration-200`,
    nav: `flex space-x-4 pt-2 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`,
    navButton: `relative flex flex-col items-center px-6 py-3 text-sm font-semibold rounded-lg whitespace-nowrap transition-all duration-300`,
    navIcon: 'w-6 h-6 mb-2',
    navLabel: 'text-center',
    activeIndicator: 'absolute -bottom-1 left-0 right-0 h-1 rounded-full bg-current transform origin-left'
  };


  const handleFacturaSubmit = (formData: any) => {
    console.log('Nueva factura:', formData);
    setIsFacturaPopupOpen(false);
  };


  const handleEscanearFacturaSubmit = (formData: any) => {
    console.log('Archivos para escanear:', formData);
    setIsEscanearFacturaPopupOpen(false);
  };


  const renderActiveComponent = () => {
    switch (activeSection) {
      case 'panel':
        return (
          <PanelDeControl
            theme={theme}
            editMode={editMode}
            isFacturaPopupOpen={isFacturaPopupOpen}
            setIsFacturaPopupOpen={setIsFacturaPopupOpen}
            handleFacturaSubmit={handleFacturaSubmit}
            isEscanearFacturaPopupOpen={isEscanearFacturaPopupOpen}
            setIsEscanearFacturaPopupOpen={setIsEscanearFacturaPopupOpen}
            handleEscanearFacturaSubmit={handleEscanearFacturaSubmit}
          />
        );
      case 'cashflow':
        return <CashflowPage />;
      case 'planes':
        return <PlanesPage />;
      case 'documentos':
        return <DocumentosPage />;
      case 'facturas':
        return (
          <FacturasPage
            isFacturaPopupOpen={isFacturaPopupOpen}
            setIsFacturaPopupOpen={setIsFacturaPopupOpen}
            handleFacturaSubmit={handleFacturaSubmit}
            isEscanearFacturaPopupOpen={isEscanearFacturaPopupOpen}
            setIsEscanearFacturaPopupOpen={setIsEscanearFacturaPopupOpen}
            handleEscanearFacturaSubmit={handleEscanearFacturaSubmit}
          />
        );
      case 'reportes':
        return <ReportesPage />;
      default:
        return null;
    }
  };


  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className="flex justify-between items-center mb-4">
          <h2 className={styles.title}>
            <BarChart2 className="w-6 h-6 mr-2 text-blue-500" />
            <div className="flex items-center gap-4">
              <div className="relative">
                <h2 className={`text-4xl font-extrabold ${
                  theme === 'dark'
                    ? 'bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400'
                    : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600'
                } bg-clip-text text-transparent tracking-tight`}>
                  Gestión Económica
                </h2>
                <div className={`absolute -bottom-2 left-0 w-full h-1.5 ${
                  theme === 'dark'
                    ? 'bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400'
                    : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600'
                } rounded-full opacity-60 animate-pulse`}></div>
              </div>
              <span className={`
                text-sm font-semibold
                ${theme === 'dark'
                  ? 'bg-gradient-to-r from-gray-800 to-gray-700 text-gray-300 border border-gray-600/30'
                  : 'bg-gradient-to-r from-blue-50 to-indigo-50 text-gray-700 border border-blue-100/50'
                }
                px-4 py-2 rounded-full
                flex items-center gap-2
                shadow-lg
                hover:shadow-xl
                transform hover:scale-105
                transition-all duration-300 ease-out
                animate-fadeIn
                relative
                overflow-hidden
                group
              `}>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                <BarChart2 className={`w-4 h-4 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'} animate-pulse transform group-hover:rotate-12 transition-all duration-300`} />
                <span className="relative">Panel Financiero</span>
              </span>
            </div>
          </h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={toggleTheme}
              className={styles.button}
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </div>
        <nav className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-6 px-6">
          {sections.filter(section => section.visible).map((section) => (
            <motion.div
              key={section.id}
              className={`
                relative flex items-center gap-4 px-6 py-5
                ${activeSection === section.id
                  ? `${theme === 'dark'
                      ? 'bg-gradient-to-br from-yellow-500/30 via-amber-500/20 to-orange-500/30 border-yellow-400/50 shadow-[0_0_25px_rgba(250,204,21,0.3)]'
                      : 'bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 border-yellow-500/50 shadow-[0_0_25px_rgba(250,204,21,0.15)]'
                    }`
                  : `${theme === 'dark'
                      ? 'hover:bg-gray-800/40 border-gray-600/50'
                      : 'hover:bg-white/90 border-gray-200'
                    }`
                }
                group
                border rounded-3xl cursor-pointer
                backdrop-blur-xl
                transition-all duration-500 ease-out
                hover:shadow-xl hover:shadow-yellow-500/10
                ${activeSection === section.id ? 'scale-[1.02]' : ''}
              `}
              onClick={() => handleSectionChange(section.id)}
              whileHover={{
                scale: activeSection === section.id ? 1.03 : 1.02,
                y: -4,
              }}
              whileTap={{ scale: 0.97 }}
            >
              <div className={`
                p-3 rounded-2xl
                ${activeSection === section.id
                  ? `${theme === 'dark'
                      ? 'bg-gradient-to-br from-yellow-500/30 to-amber-500/30 shadow-lg shadow-yellow-500/20'
                      : 'bg-gradient-to-br from-yellow-100/80 to-amber-100/80 shadow-lg shadow-yellow-500/10'
                    }`
                  : `${theme === 'dark'
                      ? 'bg-gray-800/50 group-hover:bg-gray-700/50'
                      : 'bg-white/50 group-hover:bg-yellow-50/50'
                    }`
                }
                transition-all duration-300 ease-in-out
              `}>
                <section.navIcon className={`w-6 h-6 transform transition-all duration-300 ${
                  activeSection === section.id
                    ? 'text-yellow-400 scale-110 rotate-6'
                    : theme === 'dark'
                      ? 'text-gray-400 group-hover:text-yellow-400/70'
                      : 'text-gray-600 group-hover:text-yellow-500/70'
                }`} />
              </div>
              <span className={`
                font-semibold text-sm tracking-wide
                ${activeSection === section.id
                  ? `${theme === 'dark'
                      ? 'text-yellow-300'
                      : 'text-yellow-600'
                    }`
                  : `${theme === 'dark'
                      ? 'text-gray-300 group-hover:text-yellow-400/70'
                      : 'text-gray-600 group-hover:text-yellow-500/70'
                    }`
                }
                transition-all duration-300
              `}>
                {section.label}
              </span>
              {activeSection === section.id && (
                <motion.div
                  className={`
                    absolute -bottom-1 left-1/2 transform -translate-x-1/2
                    w-2 h-2 rounded-full
                    ${theme === 'dark' ? 'bg-yellow-400' : 'bg-yellow-500'}
                  `}
                  layoutId="activeIndicator"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  transition={{ duration: 0.4, type: "spring" }}
                />
              )}
            </motion.div>
          ))}
        </nav>
      </div>
      <div
        className={`flex-1 overflow-auto p-8 ${
          theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
        }`}
      >
        {renderActiveComponent()}
      </div>
    </div>
  );
};


export default EconomicsPage;