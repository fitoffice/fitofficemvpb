import React, { useState } from 'react';
import { Share2, Instagram, Facebook, Twitter } from 'lucide-react';
import SectionHeader from '../common/SectionHeader';

interface RedesSocialesData {
  instagram?: string;
  facebook?: string;
  twitter?: string;
}

interface RedesSocialesSectionProps {
  redes: RedesSocialesData;
  editMode: boolean;
  theme: string;
  errors: any;
  isLoading: boolean;
  clientId: string; // Añadido clientId como prop
  onSave: () => void;
  onChange: (redes: RedesSocialesData) => void;
}

const RedesSocialesSection: React.FC<RedesSocialesSectionProps> = ({
  redes,
  editMode,
  theme,
  errors,
  isLoading,
  clientId, // Añadido clientId
  onSave,
  onChange,
}) => {
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [localRedes, setLocalRedes] = useState<RedesSocialesData>(redes);

  React.useEffect(() => {
    setLocalRedes(redes);
  }, [redes]);

  const handleChange = (field: keyof RedesSocialesData, value: string) => {
    // Update local state first
    const updatedRedes = {
      ...localRedes,
      [field]: value
    };
    setLocalRedes(updatedRedes);
    
    // Then propagate changes to parent
    onChange(updatedRedes);
  };
  // Nueva función para guardar los datos
  const handleSave = async () => {
    if (!clientId) {
      setSaveError("ID de cliente no disponible");
      return;
    }

    setIsSaving(true);
    setSaveError(null);

    try {
      // Trim values before saving
      const trimmedRedes = Object.entries(localRedes).reduce((acc, [key, value]) => {
        acc[key as keyof RedesSocialesData] = value?.trim() || undefined;
        return acc;
      }, {} as RedesSocialesData);

      // Preparar los datos en el formato requerido
      const redesSocialesData = {
        redesSociales: Object.entries(trimmedRedes)
          .filter(([_, username]) => username) // Filtrar entradas vacías
          .map(([platform, username]) => ({
            platform,
            username
          }))
      };

      // Realizar la petición PUT
      // Realizar la petición PUT
      const token = localStorage.getItem('token');
      const response = await fetch(`https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/clients/${clientId}/redes-sociales`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Añadido token de autenticación
        },
        body: JSON.stringify(redesSocialesData),
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      // Update parent with trimmed values
      onChange(trimmedRedes);
      
      // Llamar a la función onSave original
      onSave();
    } catch (error) {
      console.error('Error al guardar redes sociales:', error);
      setSaveError(error instanceof Error ? error.message : 'Error al guardar');
    } finally {
      setIsSaving(false);
    }
  };

  const inputClasses = `
    w-full p-3 rounded-lg border-2 
    ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}
    focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500
    transition-all duration-300 ease-in-out
    placeholder-gray-400
    hover:border-purple-400
  `;

  const labelClasses = `
    block text-sm font-medium mb-2
    ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}
  `;

  const errorClasses = "text-sm text-red-500 mt-1 animate-pulse";

  const socialNetworks = [
    {
      name: 'instagram',
      icon: Instagram,
      color: 'pink',
      placeholder: '@usuario',
      label: 'Instagram'
    },
    {
      name: 'facebook',
      icon: Facebook,
      color: 'blue',
      placeholder: 'URL del perfil',
      label: 'Facebook'
    },
    {
      name: 'twitter',
      icon: Twitter,
      color: 'sky',
      placeholder: '@usuario',
      label: 'Twitter'
    }
  ];

  return (
    <section className={`
      rounded-xl border-2 
      ${theme === 'dark' ? 'border-gray-700 bg-gray-800/50' : 'border-gray-200 bg-white/50'}
      shadow-lg hover:shadow-xl 
      transition-all duration-300 ease-in-out
      backdrop-blur-sm
      overflow-hidden
    `}>
            <SectionHeader
        title="Redes Sociales"
        Icon={Share2}
        theme={theme}
        editMode={editMode}
        onSave={handleSave} // Cambiado a nuestra nueva función
        isLoading={isLoading || isSaving}
        iconColor="purple"
      />
      <div className="p-6">
        {saveError && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {saveError}
          </div>
        )}
        <div className="space-y-6">
        {socialNetworks.map(network => {
            const NetworkIcon = network.icon;
            const value = localRedes[network.name as keyof RedesSocialesData] || '';
            const error = errors?.[network.name];

            return (
              <div key={network.name} className="space-y-1">
              <label className={labelClasses}>
                <div className="flex items-center space-x-2">
                  <NetworkIcon className={`w-4 h-4 text-${network.color}-500`} />
                  <span>{network.label}</span>
                </div>
              </label>

                {editMode ? (
                  <div className="relative">
                    <input
                      type="text"
                      value={value}
                      onChange={e => handleChange(network.name as keyof RedesSocialesData, e.target.value)}
                      placeholder={network.placeholder}
                      className={`
                        ${inputClasses}
                        ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/50' : ''}
                        pl-10
                      `}
                    />
                    <NetworkIcon className={`
                      absolute left-3 top-1/2 transform -translate-y-1/2
                      w-4 h-4 text-${network.color}-500
                      transition-all duration-300 ease-in-out
                    `} />
                  </div>
                ) : value ? (
                  <a
                    href={network.name === 'facebook' ? value : `https://${network.name}.com/${value.replace('@', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`
                      flex items-center space-x-2 p-3 rounded-lg
                      ${theme === 'dark' ? 'bg-gray-700/50 hover:bg-gray-600/50' : 'bg-gray-100/50 hover:bg-gray-200/50'}
                      transition-all duration-300 ease-in-out group
                      backdrop-blur-sm
                    `}
                  >
                    <NetworkIcon className={`
                      w-4 h-4 text-${network.color}-500
                      group-hover:scale-110 transition-transform duration-300
                    `} />
                    <span className="text-lg">{value}</span>
                  </a>
                ) : (
                  <p className={`text-gray-500 italic`}>No especificado</p>
                )}

                {error && (
                  <p className={errorClasses}>{error}</p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default RedesSocialesSection;
