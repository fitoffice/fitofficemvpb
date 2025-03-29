import React from 'react';
import { X } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface PopupCuestionariosProps {
  isOpen: boolean;
  onClose: () => void;
  cuestionario: any;
  nombreCliente: string;
}

const PopupCuestionarios: React.FC<PopupCuestionariosProps> = ({
  isOpen,
  onClose,
  cuestionario,
  nombreCliente
}) => {
  const { theme } = useTheme();

  if (!isOpen || !cuestionario) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleBackdropClick}
    >
      <div className={`
        relative
        w-full max-w-4xl
        max-h-[90vh]
        overflow-y-auto
        m-4
        p-6
        rounded-lg
        shadow-xl
        ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}
      `}>
        {/* Botón de cerrar */}
        <button
          onClick={onClose}
          className={`
            absolute top-4 right-4
            p-2
            rounded-full
            transition-colors duration-200
            ${theme === 'dark' 
              ? 'hover:bg-gray-700 text-gray-400 hover:text-white' 
              : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'}
          `}
        >
          <X className="w-6 h-6" />
        </button>

        {/* Título */}
        <h1 className={`
          text-2xl font-bold mb-6
          ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}
        `}>
          Cuestionario de {nombreCliente}
        </h1>

        {/* Contenido */}
        <div className="space-y-6">
          {/* Información Personal */}
          <Section title="Información Personal" theme={theme}>
            <Field label="Edad" value={cuestionario.edad} theme={theme} />
            <Field label="Género" value={cuestionario.genero} theme={theme} />
          </Section>

          {/* Información Física */}
          <Section title="Información Física" theme={theme}>
            <Field 
              label="Peso" 
              value={cuestionario.peso ? `${cuestionario.peso} kg` : undefined} 
              theme={theme} 
            />
            <Field 
              label="Altura" 
              value={cuestionario.altura ? `${cuestionario.altura} cm` : undefined} 
              theme={theme} 
            />
          </Section>

          {/* Condiciones Médicas */}
          <Section title="Condiciones Médicas" theme={theme}>
            <Field 
              label="Condiciones" 
              value={
                cuestionario.condicionesMedicas?.length > 0 
                  ? cuestionario.condicionesMedicas.join(', ') 
                  : 'Ninguna condición médica reportada'
              } 
              theme={theme} 
            />
          </Section>

          {/* Campos Adicionales */}
          {Object.entries(cuestionario)
            .filter(([key]) => !['edad', 'genero', 'peso', 'altura', 'condicionesMedicas'].includes(key))
            .map(([key, value]) => (
              <Section key={key} title={key.charAt(0).toUpperCase() + key.slice(1)} theme={theme}>
                <Field 
                  label={key} 
                  value={typeof value === 'object' ? JSON.stringify(value, null, 2) : value} 
                  theme={theme} 
                />
              </Section>
            ))}
        </div>
      </div>
    </div>
  );
};

interface SectionProps {
  title: string;
  children: React.ReactNode;
  theme: string;
}

const Section: React.FC<SectionProps> = ({ title, children, theme }) => (
  <div className={`
    p-4 rounded-lg
    ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}
  `}>
    <h2 className={`
      text-xl font-semibold mb-4
      ${theme === 'dark' ? 'text-blue-300' : 'text-blue-700'}
    `}>
      {title}
    </h2>
    <div className="space-y-3">
      {children}
    </div>
  </div>
);

interface FieldProps {
  label: string;
  value?: any;
  theme: string;
}

const Field: React.FC<FieldProps> = ({ label, value, theme }) => (
  <div className="flex flex-col">
    <span className={`
      font-medium
      ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}
    `}>
      {label}
    </span>
    <span className={`
      mt-1
      ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}
    `}>
      {value || 'No especificado'}
    </span>
  </div>
);

export default PopupCuestionarios;
