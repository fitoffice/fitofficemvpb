import React from 'react';
import { motion } from 'framer-motion';
import { Link, Calendar, Clipboard, BookOpen, Users } from 'lucide-react';

type ServiceType = 'all' | 'citas' | 'suscripciones' | 'asesorias' | 'clases';

interface ServiceTypeButtonProps {
  type: ServiceType;
  icon: React.ReactNode;
  label: string;
  selectedType: ServiceType;
  onSelect: (type: ServiceType) => void;
  theme: 'dark' | 'light';
}

const ServiceTypeButton: React.FC<ServiceTypeButtonProps> = ({
  type,
  icon,
  label,
  selectedType,
  onSelect,
  theme,
}) => (
  <motion.button
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={() => onSelect(type)}
    className={`flex items-center gap-2 px-6 py-3 rounded-2xl transition-all duration-300 ${
      selectedType === type
        ? theme === 'dark'
          ? 'bg-gradient-to-r from-violet-900 via-purple-900 to-fuchsia-900 text-white shadow-lg shadow-violet-900/30'
          : 'bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 text-white shadow-lg shadow-violet-500/30'
        : theme === 'dark'
        ? 'bg-gray-800 hover:bg-gray-700 text-gray-300'
        : 'bg-white hover:bg-gray-50 text-gray-600 border border-gray-200'
    } font-medium`}
  >
    {icon}
    <span className="hidden md:inline">{label}</span>
  </motion.button>
);

interface ServiceTypeButtonsProps {
  selectedType: ServiceType;
  onSelect: (type: ServiceType) => void;
  theme: 'dark' | 'light';
}

const ServiceTypeButtons: React.FC<ServiceTypeButtonsProps> = ({
  selectedType,
  onSelect,
  theme,
}) => (
  <div className="flex flex-wrap gap-4">
    <ServiceTypeButton
      type="all"
      icon={<Link className="w-5 h-5" />}
      label="Todos"
      selectedType={selectedType}
      onSelect={onSelect}
      theme={theme}
    />
    <ServiceTypeButton
      type="citas"
      icon={<Calendar className="w-5 h-5" />}
      label="Citas"
      selectedType={selectedType}
      onSelect={onSelect}
      theme={theme}
    />
    <ServiceTypeButton
      type="suscripciones"
      icon={<Clipboard className="w-5 h-5" />}
      label="Suscripciones"
      selectedType={selectedType}
      onSelect={onSelect}
      theme={theme}
    />
    <ServiceTypeButton
      type="asesorias"
      icon={<BookOpen className="w-5 h-5" />}
      label="Asesorías"
      selectedType={selectedType}
      onSelect={onSelect}
      theme={theme}
    />
    <ServiceTypeButton
      type="clases"
      icon={<Users className="w-5 h-5" />}
      label="Clases Grupales"
      selectedType={selectedType}
      onSelect={onSelect}
      theme={theme}
    />
  </div>
);

export default ServiceTypeButtons;
