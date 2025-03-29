import React from 'react';
import { ClipboardList } from 'lucide-react';
import Button from '../../Common/Button';

interface CuestionarioSectionProps {
  cuestionario: any;
  editMode: boolean;
  theme: string;
  errors: any;
  isLoading: boolean;
  onSave: () => void;
  onVerCuestionario: () => void;
  hasCuestionario: boolean;
}

const CuestionarioSection: React.FC<CuestionarioSectionProps> = ({
  cuestionario,
  editMode,
  theme,
  errors,
  isLoading,
  onSave,
  onVerCuestionario,
  hasCuestionario
}) => {
  return (
    <div className={`
      p-6 rounded-lg shadow-md
      ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}
      transition-all duration-300
    `}>
      <div className="flex items-center justify-between mb-4">
        <h2 className={`
          text-xl font-semibold
          ${theme === 'dark' ? 'text-white' : 'text-gray-900'}
        `}>
          Cuestionario
        </h2>
      </div>

      <div className="space-y-4">
        {hasCuestionario ? (
          <div>
            <div className={`
              grid grid-cols-1 md:grid-cols-2 gap-4 mb-4
              ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}
            `}>
              {cuestionario && (
                <>
                  <div>
                    <p className="font-medium">Edad:</p>
                    <p>{cuestionario.edad || 'No especificado'}</p>
                  </div>
                  <div>
                    <p className="font-medium">Género:</p>
                    <p>{cuestionario.genero || 'No especificado'}</p>
                  </div>
                  <div>
                    <p className="font-medium">Peso:</p>
                    <p>{cuestionario.peso ? `${cuestionario.peso} kg` : 'No especificado'}</p>
                  </div>
                  <div>
                    <p className="font-medium">Altura:</p>
                    <p>{cuestionario.altura ? `${cuestionario.altura} cm` : 'No especificado'}</p>
                  </div>
                </>
              )}
            </div>

            <Button
              variant="normal"
              onClick={onVerCuestionario}
              disabled={!hasCuestionario}
              className={`
                w-full
                ${theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'}
                text-white
                transition-all duration-300
              `}
            >
              <ClipboardList className="w-4 h-4 mr-2" />
              Ver Cuestionario Completo
            </Button>
          </div>
        ) : (
          <div className={`
            text-center py-8
            ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}
          `}>
            <ClipboardList className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg mb-2">No hay cuestionario asociado</p>
            <p className="text-sm">Este cliente aún no ha completado el cuestionario inicial</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CuestionarioSection;
