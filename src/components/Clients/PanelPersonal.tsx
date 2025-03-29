import React, { useState, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { toast } from 'react-hot-toast';
import { 
  ClipboardList, 
  RefreshCw, 
  Edit3, 
  Save, 
  X, 
  User, 
  FileText,
  Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import InfoBasicaSection from './sections/InfoBasicaSection';
import InfoFisicaSection from './sections/InfoFisicaSection';
import CondicionesMedicasSection from './sections/CondicionesMedicasSection';
import RedesSocialesSection from './sections/RedesSocialesSection';
import ContactoSection from './sections/ContactoSection';
import TagsSection from './sections/TagsSection';
import NotasSection from './sections/NotasSection';
import Button from '../Common/Button';
import PopupCuestionarios from './PopupCuestionarios';
import CuestionarioSection from './sections/CuestionarioSection';

// Add this interface near the top of the file with other interfaces
interface Note {
  _id: string;
  texto: string;
  fechaCreacion: string;
  version: number;
  categoria: 'general' | 'training' | 'diet' | 'medical';
}
interface PanelPersonalProps {
  cliente: any;
  clientId?: string; // Añadido clientId como prop opcional
  onEdit: (cliente: any) => void;
}

const PanelPersonal: React.FC<PanelPersonalProps> = ({ cliente, clientId, onEdit }) => {
  const { theme } = useTheme();
  const [editMode, setEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<any>({});
  const [cuestionario, setCuestionario] = useState<Cuestionario | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('all');

  const handleAddNote = async (note: Omit<Note, '_id'>) => {
    try {
      const clienteActualizado = {
        ...cliente,
        notas: [...(cliente.notas || []), { ...note, _id: Date.now().toString() }]
      };
      await onEdit(clienteActualizado);
      toast.success('Nota agregada correctamente');
    } catch (error) {
      toast.error('Error al agregar la nota');
    }
  };

  const handleEditNote = async (id: string, updatedNote: Partial<Note>) => {
    try {
      const clienteActualizado = {
        ...cliente,
        notas: (cliente.notas || []).map(note => 
          note._id === id ? { ...note, ...updatedNote } : note
        )
      };
      await onEdit(clienteActualizado);
      toast.success('Nota actualizada correctamente');
    } catch (error) {
      toast.error('Error al actualizar la nota');
    }
  };

  const handleDeleteNote = async (id: string) => {
    try {
      const clienteActualizado = {
        ...cliente,
        notas: (cliente.notas || []).filter(note => note._id !== id)
      };
      await onEdit(clienteActualizado);
      toast.success('Nota eliminada correctamente');
    } catch (error) {
      toast.error('Error al eliminar la nota');
    }
  };

  // ... existing useEffect and functions remain unchanged ...

  // Add the missing functions
  const verCuestionario = () => {
    if (cliente.cuestionarioId && cuestionario) {
      setIsPopupOpen(true);
    } else {
      toast.error('No hay cuestionario disponible para este cliente');
    }
  };

  const autocompletarDesdeCuestionario = () => {
    if (!cuestionario) {
      toast.error('No hay cuestionario disponible para autocompletar');
      return;
    }

    const clienteActualizado = { ...cliente };
    
    // Autocompletar datos básicos si están disponibles en el cuestionario
    if (cuestionario.edad) {
      const fechaNacimiento = new Date();
      fechaNacimiento.setFullYear(fechaNacimiento.getFullYear() - cuestionario.edad);
      clienteActualizado.fechaNacimiento = fechaNacimiento.toISOString().split('T')[0];
    }
    
    if (cuestionario.genero) {
      clienteActualizado.genero = cuestionario.genero as any;
    }
    
    // Autocompletar datos físicos
    if (cuestionario.peso) {
      clienteActualizado.peso = cuestionario.peso;
    }
    
    if (cuestionario.altura) {
      clienteActualizado.altura = cuestionario.altura;
    }
    
    // Autocompletar condiciones médicas
    if (cuestionario.condicionesMedicas && cuestionario.condicionesMedicas.length > 0) {
      clienteActualizado.condicionesMedicas = [
        ...new Set([...clienteActualizado.condicionesMedicas, ...cuestionario.condicionesMedicas])
      ];
    }
    
    onEdit(clienteActualizado);
    toast.success('Datos autocompletados desde el cuestionario');
  };

  const handleSave = async () => {
    setIsLoading(true);
    setErrors({});

    try {
      const newErrors: any = {};
      if (!cliente.nombre) newErrors.nombre = 'El nombre es requerido';
      if (!cliente.email) newErrors.email = 'El email es requerido';
      
      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        toast.error('Por favor, corrija los errores antes de guardar');
        return;
      }

      await onEdit(cliente);
      setEditMode(false);
      toast.success('Cambios guardados correctamente');
    } catch (error) {
      toast.error('Error al guardar los cambios');
    } finally {
      setIsLoading(false);
    }
  };

  const sections = [
    { id: 'all', name: 'Todo', icon: <FileText size={18} /> },
    { id: 'basic', name: 'Información Básica', icon: <User size={18} /> },
    { id: 'physical', name: 'Datos Físicos', icon: <Activity size={18} /> },
  ];

  return (
    <>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`
          w-full rounded-lg shadow-lg 
          ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}
          overflow-hidden transition-colors duration-300 ease-in-out
        `}
      >
        {/* Header with gradient background */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold">{cliente.nombre}</h2>
              <p className="text-blue-100">{cliente.email}</p>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {editMode ? (
                <>
                  <Button
                    onClick={handleSave}
                    disabled={isLoading}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full transition-all shadow-md flex items-center"
                  >
                    <Save size={18} className="mr-2" />
                    {isLoading ? 'Guardando...' : 'Guardar Cambios'}
                  </Button>
                  <Button
                    onClick={() => setEditMode(false)}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full transition-all shadow-md flex items-center"
                  >
                    <X size={18} className="mr-2" />
                    Cancelar
                  </Button>
                </>
              ) : (
                <Button
                  onClick={() => setEditMode(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full transition-all shadow-md flex items-center"
                >
                  <Edit3 size={18} className="mr-2" />
                  Editar Información
                </Button>
              )}
            </div>
          </div>
          
          {/* Section tabs */}
          <div className="mt-6 flex flex-wrap gap-2">
            {sections.map(section => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`
                  px-4 py-2 rounded-full transition-all flex items-center
                  ${activeSection === section.id 
                    ? 'bg-white text-blue-600 shadow-md' 
                    : 'bg-blue-600 bg-opacity-30 hover:bg-opacity-40 text-white'}
                `}
              >
                {section.icon}
                <span className="ml-2">{section.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Cuestionario actions */}
        <div className="p-4 bg-blue-50 dark:bg-gray-700 border-b border-blue-100 dark:border-gray-600">
          <div className="flex flex-wrap gap-3 items-center">
            <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
              Cuestionario:
            </span>
            <Button
              variant="normal"
              onClick={verCuestionario}
              disabled={!cliente.cuestionarioId || !cuestionario}
              className={`
                ${!cliente.cuestionarioId || !cuestionario 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'hover:bg-blue-100 dark:hover:bg-gray-600'}
                bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-300
                border border-blue-200 dark:border-gray-600
                shadow-sm rounded-full px-3 py-1.5 text-sm
                transition-all duration-300 flex items-center
              `}
            >
              <ClipboardList className="w-4 h-4 mr-2" />
              Ver Cuestionario
            </Button>
            <Button
              variant="secondary"
              onClick={autocompletarDesdeCuestionario}
              disabled={!cuestionario}
              className={`
                ${!cuestionario 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'hover:bg-blue-100 dark:hover:bg-gray-600'}
                bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-300
                border border-blue-200 dark:border-gray-600
                shadow-sm rounded-full px-3 py-1.5 text-sm
                transition-all duration-300 flex items-center
              `}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Autocompletar
            </Button>
            {cliente.cuestionarioId && !cuestionario && (
              <span className="text-xs text-amber-600 dark:text-amber-400 animate-pulse">
                Cargando cuestionario...
              </span>
            )}
          </div>
        </div>

        <div className="p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              {(activeSection === 'all' || activeSection === 'basic') && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-6">
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="bg-white dark:bg-gray-700 rounded-lg shadow-sm p-5 border border-gray-100 dark:border-gray-600"
                    >
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                        <User className="w-5 h-5 mr-2 text-blue-500" />
                        Información Básica
                      </h3>
                      <InfoBasicaSection
                        data={{
                          nombre: cliente.nombre,
                          email: cliente.email,
                          fechaNacimiento: cliente.fechaNacimiento,
                          genero: cliente.genero,
                          telefono: cliente.telefono
                        }}
                        editMode={editMode}
                        theme={theme || 'light'}
                        errors={errors}
                        isLoading={isLoading}
                        onSave={handleSave}
                        onChange={(data) => onEdit({ ...cliente, ...data })}
                        clientId={clientId || cliente._id}
                      />                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1, transition: { delay: 0.1 } }}
                      className="bg-white dark:bg-gray-700 rounded-lg shadow-sm p-5 border border-gray-100 dark:border-gray-600"
                    >
                      <CuestionarioSection
                        cuestionario={cuestionario}
                        editMode={editMode}
                        theme={theme || 'light'}
                        errors={errors}
                        isLoading={isLoading}
                        onSave={handleSave}
                        onVerCuestionario={verCuestionario}
                        hasCuestionario={!!cliente.cuestionarioId && !!cuestionario}
                      />
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1, transition: { delay: 0.2 } }}
                      className="bg-white dark:bg-gray-700 rounded-lg shadow-sm p-5 border border-gray-100 dark:border-gray-600"
                    >
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                        <Activity className="w-5 h-5 mr-2 text-green-500" />
                        Información Física
                      </h3>
                      <InfoFisicaSection
                        data={{
                          altura: cliente.altura || 0,
                          peso: Array.isArray(cliente.peso) ? 
                            (cliente.peso.length > 0 ? cliente.peso[cliente.peso.length - 1] : 0) : 
                            (cliente.peso || 0)
                        }}
                        editMode={editMode}
                        theme={theme || 'light'}
                        errors={errors}
                        isLoading={isLoading}
                        onSave={handleSave}
                        onChange={(data) => {
                          // If peso is an array in the client data, update the last value or add a new one
                          let updatedPeso = data.peso;
                          if (Array.isArray(cliente.peso)) {
                            updatedPeso = [...cliente.peso];
                            if (updatedPeso.length > 0) {
                              updatedPeso[updatedPeso.length - 1] = data.peso;
                            } else {
                              updatedPeso.push(data.peso);
                            }
                          }
                          
                          onEdit({ 
                            ...cliente, 
                            altura: data.altura,
                            peso: updatedPeso
                          });
                        }}
                        clientId={clientId || cliente._id}
                      />
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1, transition: { delay: 0.3 } }}
                      className="bg-white dark:bg-gray-700 rounded-lg shadow-sm p-5 border border-gray-100 dark:border-gray-600"
                    >
                      <CondicionesMedicasSection
                        condiciones={cliente.condicionesMedicas}
                        editMode={editMode}
                        theme={theme || 'light'}
                        errors={errors}
                        isLoading={isLoading}
                        onSave={handleSave}
                        onChange={(condiciones) => onEdit({ ...cliente, condicionesMedicas: condiciones })}
                        clientId={clientId || cliente._id}
                      />
                    </motion.div>
                  </div>

                  <div className="space-y-6">
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1, transition: { delay: 0.1 } }}
                      className="bg-white dark:bg-gray-700 rounded-lg shadow-sm p-5 border border-gray-100 dark:border-gray-600"
                    >
                                             <RedesSocialesSection
                        redes={cliente.redesSociales?.reduce((acc, red) => {
                          acc[red.platform] = red.username;
                          return acc;
                        }, {} as Record<string, string>) || {}}
                        clientId={clientId || cliente._id}
                        editMode={editMode}
                        theme={theme || 'light'}
                        errors={errors}
                        isLoading={isLoading}
                        onSave={handleSave}
                        onChange={(redes) => {
                          // Convert from object format back to array format
                          const redesArray = Object.entries(redes).map(([platform, username]) => ({
                            platform,
                            username
                          }));
                          onEdit({ ...cliente, redesSociales: redesArray });
                        }}
                      />

                   </motion.div>

                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1, transition: { delay: 0.2 } }}
                      className="bg-white dark:bg-gray-700 rounded-lg shadow-sm p-5 border border-gray-100 dark:border-gray-600"
                    >
                      <ContactoSection
                        direccion={cliente.direccion}
                        editMode={editMode}
                        theme={theme || 'light'}
                        errors={errors}
                        isLoading={isLoading}
                        onSave={handleSave}
                        onChange={(direccion) => onEdit({ ...cliente, direccion })}
                        clientId={clientId || cliente._id}
                      />
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1, transition: { delay: 0.3 } }}
                      className="bg-white dark:bg-gray-700 rounded-lg shadow-sm p-5 border border-gray-100 dark:border-gray-600"
                    >
                      <TagsSection
                        tags={cliente.tags}
                        activo={cliente.activo}
                        estado={cliente.estado} // Added estado prop
                        editMode={editMode}
                        theme={theme || 'light'}
                        errors={errors}
                        isLoading={isLoading}
                        onSave={handleSave}
                        onChange={({ tags, activo, estado }) => onEdit({ 
                          ...cliente, 
                          tags, 
                          activo,
                          estado // Added estado to the onChange handler
                        })}
                        clientId={clientId || cliente._id}
                      />
                    </motion.div>
                  </div>
                </div>
              )}

              {(activeSection === 'all' || activeSection === 'physical') && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, transition: { delay: 0.4 } }}                  className="bg-white dark:bg-gray-700 rounded-lg shadow-sm p-5 border border-gray-100 dark:border-gray-600"
                  >
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                      <Activity className="w-5 h-5 mr-2 text-green-500" />
                      Notas del Cliente
                    </h3>
                    <NotasSection
                    notas={cliente.notas || []}
                    editMode={editMode}
                    theme={theme || 'light'}
                    errors={errors}
                    isLoading={isLoading}
                    onSave={handleSave}
                    onAddNote={handleAddNote}
                    onEditNote={handleEditNote}
                    onDeleteNote={handleDeleteNote}
                    onChange={(notas) => onEdit({ ...cliente, notas })}
                    />
                  </motion.div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
  
        {isPopupOpen && (
          <PopupCuestionarios
            cuestionario={cuestionario}
            onClose={() => setIsPopupOpen(false)}
          />
        )}
      </>
    );
  };
  
  export default PanelPersonal;