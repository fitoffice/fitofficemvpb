import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Settings, Users } from 'lucide-react';
import Button from '../Common/Button';
import { useTheme } from '../../contexts/ThemeContext';

interface AccionesRapidasCampañasCorreoProps {
  itemVariants: any;
  setShowEmailCampaign: (show: boolean) => void;
  setShowAutomations: (show: boolean) => void;
  setShowSegments: (show: boolean) => void;
}

export const AccionesRapidasCampañasCorreo: React.FC<AccionesRapidasCampañasCorreoProps> = ({
  itemVariants,
  setShowEmailCampaign,
  setShowAutomations,
  setShowSegments
}) => {
  const { theme } = useTheme();
  
  return (
    <motion.div 
      variants={itemVariants}
      className={`col-span-12 lg:col-span-5 ${
        theme === 'dark' 
          ? 'bg-gray-800 border-gray-700' 
          : 'bg-white border-gray-100'
      } rounded-2xl shadow-lg p-8 border`}
    >
      <div className="mb-8">
        <h3 className={`text-2xl font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'} mb-3`}>
          Acciones Rápidas
        </h3>
        <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
          Gestiona tus campañas y automatizaciones desde aquí
        </p>
        <div className="h-1 w-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mt-4"></div>
      </div>
      
      <div className="flex flex-col gap-4 h-[calc(100%-2rem)]">
        {/* Rest of the component remains the same */}
        <Button
          variant="create"
          onClick={() => setShowEmailCampaign(true)}
          className="group relative w-full h-48 flex items-center gap-4 overflow-hidden"
        >
          <div className="p-4 ml-6 bg-opacity-30 rounded-xl">
            <Plus className="h-8 w-8" />
          </div>
          <div className="flex flex-col items-start flex-1">
            <span className="text-xl font-bold mb-2">Crear Campaña</span>
            <span className="text-sm opacity-90">Crea y configura una nueva campaña de marketing</span>
          </div>
          <div className="mr-6 group-hover:translate-x-2 transition-transform duration-300">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </Button>

        <Button
          variant="info"
          onClick={() => setShowAutomations(true)}
          className="group relative w-full h-52 flex items-center gap-4 overflow-hidden"
        >
          <div className="p-4 ml-6 bg-opacity-30 rounded-xl">
            <Settings className="h-8 w-8 animate-spin-slow" />
          </div>
          <div className="flex flex-col items-start flex-1">
            <span className="text-xl font-bold mb-2">Automatizaciones</span>
            <span className="text-sm opacity-90">Configura y gestiona los flujos automáticos</span>
          </div>
          <div className="mr-6 group-hover:translate-x-2 transition-transform duration-300">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </Button>

        <Button
          variant="nature"
          onClick={() => setShowSegments(true)}
          className="group relative w-full h-44 flex items-center gap-4 overflow-hidden"
        >
          <div className="p-4 ml-6 bg-opacity-30 rounded-xl">
            <Users className="h-8 w-8" />
          </div>
          <div className="flex flex-col items-start flex-1">
            <span className="text-xl font-bold mb-2">Segmentos</span>
            <span className="text-sm opacity-90">Administra y organiza los grupos de usuarios</span>
          </div>
          <div className="mr-6 group-hover:translate-x-2 transition-transform duration-300">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </Button>
      </div>
    </motion.div>
  );
};