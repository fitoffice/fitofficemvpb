import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Plus, Dumbbell, Download, Clipboard, Target, Clock, Users, BarChart2 } from 'lucide-react';
import Button from '../../components/Common/Button';
import { useTheme } from '../../contexts/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import CreateExerciseModal from '../../components/Routines/CreateExerciseModal';
import CreateRoutineModal from '../../components/Routines/CreateRoutineModal';
import FilterDropdownMenu from '../../components/Common/FilterDropdownMenu';
import TableWithActionButtons from '../../components/Common/TableWithActionButtons';
import ExerciseViewPopup from '../../components/Routines/ExerciseViewPopup';

interface Exercise {
  _id: string;
  nombre: string;
  creador?: string;
  grupoMuscular: string[];
  equipo: string[];
  descripcion: string;
  imgUrl?: string;
  videoUrl?: string;
  fechaCreacion?: string;
  __v?: number;
}

const gruposMusculares = [
  'Soleo',
  'Gemelo',
  'Tríceps femoral',
  'Abductor',
  'Glúteo',
  'Abdominales',
  'Lumbar',
  'Dorsales',
  'Trapecio',
  'Hombro anterior',
  'Hombro lateral',
  'Hombro posterior',
  'Pecho',
  'Tríceps',
  'Bíceps',
  'Cuello',
  'Antebrazo'
];

const equipamientoDisponible = [
  'Pesas',
  'Mancuernas',
  'Barra',
  'Kettlebell',
  'Banda de resistencia',
  'Esterilla',
  'Banco',
  'Máquina de cable',
  'TRX',
  'Rueda de abdominales',
  'Cuerda para saltar',
  'Balón medicinal',
  'Plataforma de step'
];

const ExerciseList: React.FC = () => {
  const { theme } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [isExerciseModalOpen, setIsExerciseModalOpen] = useState(false);
  const [isViewExerciseModalOpen, setIsViewExerciseModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isRoutineModalOpen, setIsRoutineModalOpen] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [selectedMuscleGroups, setSelectedMuscleGroups] = useState<string[]>([]);
  const [selectedEquipment, setSelectedEquipment] = useState<string[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [filteredExercises, setFilteredExercises] = useState<Exercise[]>([]);
  const [selectedExercises, setSelectedExercises] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchExercises();
  }, []);

  useEffect(() => {
    filterExercises();
  }, [exercises, searchTerm, selectedMuscleGroups, selectedEquipment]);

  const filterExercises = () => {
    let filtered = [...exercises];

    // Filtrar por término de búsqueda
    if (searchTerm) {
      filtered = filtered.filter(exercise =>
        exercise.nombre.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtrar por grupos musculares
    if (selectedMuscleGroups.length > 0) {
      filtered = filtered.filter(exercise =>
        exercise.grupoMuscular.some(muscle => selectedMuscleGroups.includes(muscle))
      );
    }

    // Filtrar por equipamiento
    if (selectedEquipment.length > 0) {
      filtered = filtered.filter(exercise =>
        exercise.equipo.some(equip => selectedEquipment.includes(equip))
      );
    }

    setFilteredExercises(filtered);
  };

  const fetchExercises = async () => {
    try {
      setLoading(true);
      const response = await axios.get('https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/exercises');
      setExercises(response.data.data);
      setFilteredExercises(response.data.data);
      setError(null);
    } catch (error) {
      console.error('Error al obtener ejercicios:', error);
      setError('Error al cargar los ejercicios. Por favor, intente de nuevo más tarde.');
    } finally {
      setLoading(false);
    }
  };

  const statsCards = [
    { 
      icon: Dumbbell,
      title: "Ejercicios Totales",
      value: filteredExercises.length.toString(),
      color: "bg-blue-500"
    },
    {
      icon: Target,
      title: "Grupos Musculares",
      value: "12",
      color: "bg-purple-500"
    }
  ];

  const renderCell = (key: string, value: any) => {
    switch (key) {
      case 'grupoMuscular':
        return value.map((muscle: string, index: number) => (
          <span key={index} className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 mr-1 mb-1">
            {muscle}
          </span>
        ));
      case 'equipo':
        return value.map((equip: string, index: number) => (
          <span key={index} className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 mr-1 mb-1">
            {equip}
          </span>
        ));
      default:
        return value;
    }
  };

  const handleCreateExercise = () => {
    setSelectedExercise(null);
    setIsExerciseModalOpen(true);
  };

  const handleExerciseCreated = () => {
    fetchExercises();
  };
  const handleEditExercise = (exercise: Exercise) => {
    // Map the exercise data to match the expected format for the modal
    setSelectedExercise({
      _id: exercise._id,
      nombre: exercise.nombre,
      descripcion: exercise.descripcion,
      gruposMusculares: exercise.grupoMuscular, // Map grupoMuscular to gruposMusculares
      equipamiento: exercise.equipo, // Map equipo to equipamiento
      videoUrl: exercise.videoUrl || ''
    });
    setIsExerciseModalOpen(true);
  };

  const handleDeleteExercise = async (exercise: Exercise) => {
    if (window.confirm(`¿Estás seguro de que deseas eliminar el ejercicio "${exercise.nombre}"?`)) {
      try {
        setLoading(true);
        await axios.delete(`https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/exercises/${exercise._id}`);
        fetchExercises();
      } catch (error) {
        console.error('Error al eliminar el ejercicio:', error);
        setError('Error al eliminar el ejercicio. Por favor, intente de nuevo más tarde.');
      } finally {
        setLoading(false);
      }
    }
  };

  const toggleMuscleGroup = (muscle: string) => {
    setSelectedMuscleGroups(prev =>
      prev.includes(muscle)
        ? prev.filter(m => m !== muscle)
        : [...prev, muscle]
    );
  };

  const toggleEquipment = (equipment: string) => {
    setSelectedEquipment(prev =>
      prev.includes(equipment)
        ? prev.filter(e => e !== equipment)
        : [...prev, equipment]
    );
  };

  const clearFilters = () => {
    setSelectedMuscleGroups([]);
    setSelectedEquipment([]);
  };

  const handleExerciseSelect = (exerciseId: string) => {
    setSelectedExercises(prev => {
      if (prev.includes(exerciseId)) {
        return prev.filter(id => id !== exerciseId);
      } else {
        return [...prev, exerciseId];
      }
    });
  };

  const handleCreateRoutine = () => {
    setIsRoutineModalOpen(true);
  };

  const handleRoutineSave = async (routineData: any) => {
    try {
      // Aquí puedes implementar la lógica para guardar la rutina
      console.log('Rutina guardada:', routineData);
      setIsRoutineModalOpen(false);
      setSelectedExercises([]); // Limpiar selección después de crear la rutina
    } catch (error) {
      console.error('Error al guardar la rutina:', error);
    }
  };

  const getSelectedExercisesData = () => {
    return exercises.filter(exercise => selectedExercises.includes(exercise._id));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="inline-block"
        >
          <Dumbbell className={`w-8 h-8 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} />
        </motion.div>
        <p className={`mt-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
          Cargando ejercicios...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-64">
        <Dumbbell className="w-8 h-8 text-red-500 mb-4" />
        <div className={`text-center px-4 py-2 rounded-xl ${
          theme === 'dark' ? 'bg-red-900/50 text-red-200' : 'bg-red-50 text-red-600'
        }`}>
          {error}
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full space-y-6 animate-fadeIn"
    >
      {/* Combined Header, Stats, and Table Section */}
      <div className={`space-y-6 ${
        theme === 'dark'
          ? 'bg-gray-800/90 border-gray-700/50'
          : 'bg-white/90 border-white/50'
      } backdrop-blur-xl p-6 rounded-3xl shadow-lg border hover:shadow-xl transition-all duration-300`}>
        {/* Header Content */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4 mb-4 sm:mb-0">
            <div className={`p-3 rounded-2xl ${
              theme === 'dark'
                ? 'bg-blue-500/10 text-blue-400'
                : 'bg-blue-50 text-blue-600'
            }`}>
              <Dumbbell className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h1 className={`text-3xl font-bold ${
                theme === 'dark'
                  ? 'bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400'
                  : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600'
              } bg-clip-text text-transparent tracking-tight`}>
                Catálogo de Ejercicios
              </h1>
              <p className={`text-sm ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Gestiona y organiza tu biblioteca de ejercicios
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            {selectedExercises.length > 0 && (
              <Button
                variant="create"
                onClick={handleCreateRoutine}
                className="flex items-center gap-2"
              >
                <Clipboard className="w-5 h-5" />
                Crear Rutina ({selectedExercises.length})
              </Button>
            )}
            <Button
              variant="create"
              onClick={handleCreateExercise}
              className="group flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              <span className="font-medium">Nuevo Ejercicio</span>
            </Button>
            <Button
              variant="csv"
              className="group flex items-center gap-2"
            >
              <Download className="w-5 h-5" />
              <span className="font-medium">Exportar</span>
            </Button>
          </div>
        </div>
      
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-7xl mx-auto">
          {statsCards.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-4 rounded-2xl ${
                theme === 'dark'
                  ? `${card.color} bg-opacity-10 hover:bg-opacity-15`
                  : `${card.color} bg-opacity-5 hover:bg-opacity-10`
              } transition-all duration-300 hover:shadow-xl`}
            >
              <div className="flex items-center gap-6">
                <div className={`p-3 rounded-xl ${card.color} bg-opacity-20`}>
                  <card.icon className={`w-6 h-6 ${
                    theme === 'dark' ? 'text-white' : card.color.replace('bg-', 'text-')
                  }`} />
                </div>
                <div className="flex-1">
                  <p className={`text-sm ${
                    theme === 'dark' ? 'text-white text-opacity-70' : 'text-gray-600'
                  }`}>{card.title}</p>
                  <p className={`text-2xl font-bold ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>{card.value}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Search and Filters */}
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex-1">
            <div className={`flex items-center rounded-lg border ${
              theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-300 bg-gray-50'
            } px-3 py-2`}>
              <Search className="w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar ejercicios..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`ml-2 w-full bg-transparent outline-none ${
                  theme === 'dark' ? 'text-white placeholder-gray-400' : 'text-gray-900 placeholder-gray-500'
                }`}
              />
            </div>
          </div>

          <FilterDropdownMenu
            isOpen={isFilterModalOpen}
            onToggle={() => setIsFilterModalOpen(!isFilterModalOpen)}
            selectedFilters={{
              muscleGroup: selectedMuscleGroups[0] || '',
              equipment: selectedEquipment[0] || '',
            }}
            onFilterChange={(filterType, value) => {
              if (filterType === 'muscleGroup') {
                setSelectedMuscleGroups(value ? [value] : []);
              } else if (filterType === 'equipment') {
                setSelectedEquipment(value ? [value] : []);
              }
            }}
            muscleGroupOptions={[
              { value: '', label: 'Todos' },
              ...gruposMusculares.map(grupo => ({ value: grupo, label: grupo }))
            ]}
            equipmentOptions={[
              { value: '', label: 'Todos' },
              ...equipamientoDisponible.map(equipo => ({ value: equipo, label: equipo }))
            ]}
          />
        </div>

        {/* Table Section */}
        <div className="mt-6">
          <TableWithActionButtons
            columns={[
              {
                header: 'NOMBRE',
                key: 'nombre',
                width: '200px'
              },
              {
                header: 'CREADOR',
                key: 'creador',
                width: '120px'
              },
              {
                header: 'DESCRIPCIÓN',
                key: 'descripcion',
                width: '200px'
              },
              {
                header: 'MÚSCULO',
                key: 'grupoMuscular',
                width: '200px'
              },
              {
                header: 'EQUIPAMIENTO',
                key: 'equipo',
                width: '200px'
              }
            ]}
            data={filteredExercises}
            onView={(exercise) => {
              setSelectedExercise(exercise);
              setIsViewExerciseModalOpen(true);
            }}
            onEdit={handleEditExercise} // Use the new handler function

            onDelete={handleDeleteExercise}
            onSelect={handleExerciseSelect}
            selectedIds={selectedExercises}
            renderCell={renderCell}
            showCheckbox={true}
            showActions={true}
          />
        </div>
      </div>

      {/* View Exercise Modal */}
      <AnimatePresence>
        {isViewExerciseModalOpen && selectedExercise && (
          <ExerciseViewPopup
            isOpen={isViewExerciseModalOpen}
            onClose={() => setIsViewExerciseModalOpen(false)}
            exercise={selectedExercise}
            theme={theme}
          />
        )}
      </AnimatePresence>

      {/* Create Exercise Modal */}
      <AnimatePresence>
        {isExerciseModalOpen && (
          <CreateExerciseModal
            isOpen={isExerciseModalOpen}
            onClose={() => setIsExerciseModalOpen(false)}
            onExerciseCreated={handleExerciseCreated}
            initialData={selectedExercise}
            isEditing={!!selectedExercise}
          />
        )}
      </AnimatePresence>

      {/* Create Routine Modal */}
      <AnimatePresence>
        {isRoutineModalOpen && (
          <CreateRoutineModal
            isOpen={isRoutineModalOpen}
            onClose={() => setIsRoutineModalOpen(false)}
            onSave={handleRoutineSave}
            theme={theme}
            preselectedExercises={getSelectedExercisesData()}
          />
        )}
      </AnimatePresence>

    </motion.div>
  );
};

export default ExerciseList;