import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useTheme } from '../../../contexts/ThemeContext';
import { Table, Command, Save, FileUp, Plus, X, PlusCircle } from 'lucide-react';
import Button from '../../Common/Button';
import { Switch } from '../../ui/switch';
import { motion, AnimatePresence } from 'framer-motion';
import {
  useFloating,
  offset,
  flip,
  shift,
  autoUpdate,
} from '@floating-ui/react';
import { fetchExercisesFromApi, Exercise } from '../predefinedExercises';
import PopupCSV from './PopupCSV'; // Importar el nuevo componente
import PopupShortcut from './PopupShortcut'; // Import the new component

interface Cell {
  id: string;
  value: string;
  isEditing: boolean;
  tempValue?: string;
}

interface Row {
  id: string;
  exerciseId?: string;
  setNumber?: number;
  cells: Cell[];
  isSelected: boolean;
  isSetRow?: boolean;
  columnTypes?: {[key: number]: string}; // Add this to store individual column types
}

interface VistaExcelProps {
  semanaActual: number;
  planSemanal: any;
  updatePlan: (plan: any) => void;
  planningId?: string; // Add planningId prop
}



const VistaExcel: React.FC<VistaExcelProps> = ({
  semanaActual,
  planSemanal,
  updatePlan,
  planningId,
}) => {
  console.log('VistaExcel Props:', { semanaActual, planSemanal, planningId });
  const { theme } = useTheme();
  const [selectedCell, setSelectedCell] = useState<{
    row: number;
    col: number;
  } | null>(null);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [selectedDay, setSelectedDay] = useState('Lunes');
  const [showExerciseDropdown, setShowExerciseDropdown] = useState(false);
  const [showImportPopup, setShowImportPopup] = useState(false);
  const [exerciseSearch, setExerciseSearch] = useState('');
  const [useSameCategories, setUseSameCategories] = useState(true);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [exerciseData, setExerciseData] = useState<Record<string, ExerciseData>>({});
  const [planningExercises, setPlanningExercises] = useState<ExerciseData[]>([]);

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [columnTypes, setColumnTypes] = useState({
    2: 'Repeticiones',
    3: 'Peso',
    4: 'Descanso'
  });

  const gridRef = useRef<HTMLDivElement>(null);
  const cellRefs = useRef<{ [key: string]: HTMLTableCellElement | null }>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { refs, floatingStyles, update } = useFloating({
    placement: 'bottom-start',
    middleware: [offset(2), flip(), shift()],
    whileElementsMounted: autoUpdate,
  });
  const availableColumnTypes = [
    'Repeticiones', 'Peso', 'Descanso', 'Tiempo', 'RPE',
    'RPM', 'RIR'
  ];

  const dias = [
    'Lunes',
    'Martes',
    'Miércoles',
    'Jueves',
    'Viernes',
    'Sábado',
    'Domingo',
  ];

  const columns = [
    'Ejercicio',
    'Series',
    columnTypes[2], // Dynamic column name
    columnTypes[3], // Dynamic column name
    columnTypes[4], // Dynamic column name
    'Notas',
  ];
  const filteredExercises = exercises.filter((exercise) =>
    exercise.name.toLowerCase().includes(exerciseSearch.toLowerCase())
  );
  useEffect(() => {
    const loadExercises = async () => {
      try {
        const apiExercises = await fetchExercisesFromApi();
        console.log('Exercises loaded from API:', apiExercises);
        setExercises(apiExercises);
      } catch (error) {
        console.error('Error loading exercises:', error);
      }
    };
    
    loadExercises();
  }, []);
  const fetchPlanningExercises = async () => {
    console.log('🔄 Fetching planning exercises with planningId:', planningId);
    if (!planningId) {
      console.error('❌ No planningId provided to fetch exercises');
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found in localStorage');
        return;
      }

      console.log('🔑 Token found, making API request...');
      const response = await fetch(`https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/plannings/${planningId}/exercises`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        console.error(`❌ Error response: ${response.status}`);
        throw new Error(`Error fetching planning exercises: ${response.status}`);
      }

      const data = await response.json();
      console.log('📋 Planning exercises data received:', data);
      
      if (data.ejercicios && Array.isArray(data.ejercicios)) {
        console.log(`✅ Found ${data.ejercicios.length} exercises in planning`);
        setPlanningExercises(data.ejercicios);
        
        // Create a map of exercise data by ID for quick lookup
        const exerciseMap: Record<string, ExerciseData> = {};
        data.ejercicios.forEach((exercise: ExerciseData) => {
          exerciseMap[exercise._id] = exercise;
          console.log(`📌 Added exercise to map: ${exercise.nombre} (${exercise._id})`);
        });
        
        setExerciseData(prevData => ({
          ...prevData,
          ...exerciseMap
        }));
      } else {
        console.error('❌ No exercises array found in response:', data);
      }
    } catch (error) {
      console.error('Error fetching planning exercises:', error);
    }
  };

  useEffect(() => {
    if (planningId) {
      console.log('🔄 PlanningId changed, fetching exercises...');
      fetchPlanningExercises();
    }
  }, [planningId]);
  const getExerciseName = (exerciseId: string): string => {
    console.log('🔍 Getting name for exercise ID:', exerciseId);
    
    // Check if we have it in our exerciseData state
    if (exerciseData[exerciseId]?.nombre) {
      console.log('✅ Found name in exerciseData:', exerciseData[exerciseId].nombre);
      return exerciseData[exerciseId].nombre;
    }
    
    // Check if we can find it in planningExercises
    const planningExercise = planningExercises.find(pe => pe._id === exerciseId);
    if (planningExercise?.nombre) {
      console.log('✅ Found name in planningExercises:', planningExercise.nombre);
      return planningExercise.nombre;
    }
    
    console.log('❌ Could not find exercise name, returning "Cargando..."');
    // Default fallback
    return 'Cargando...';
  };

    const handleIndividualColumnTypeChange = (exerciseId: string | undefined, colIndex: number, newType: string) => {
    if (!exerciseId) return;
    
    setRows(prev => prev.map(row => {
      if (row.exerciseId === exerciseId && !row.isSetRow) {
        // Update the column types for this exercise row
        return {
          ...row,
          columnTypes: {
            ...(row.columnTypes || {}),
            [colIndex]: newType
          }
        };
      }
      return row;
    }));
    
    setHasUnsavedChanges(true);
  };

  // Add a new function to handle adding a new exercise
  const addNewExercise = () => {
    const newExerciseId = `exercise-${Date.now()}`;
    const timestamp = Date.now();
    
    // Create the exercise row (first row)
    const exerciseRow: Row = {
      id: `row-${timestamp}`,
      exerciseId: newExerciseId,
      cells: [
        {
          id: `cell-${timestamp}-0`,
          value: 'Nuevo Ejercicio',
          isEditing: false,
        },
        {
          id: `cell-${timestamp}-1`,
          value: '',
          isEditing: false,
        },
        {
          id: `cell-${timestamp}-2`,
          value: '',
          isEditing: false,
        },
        {
          id: `cell-${timestamp}-3`,
          value: '',
          isEditing: false,
        },
        {
          id: `cell-${timestamp}-4`,
          value: '',
          isEditing: false,
        },
        {
          id: `cell-${timestamp}-5`,
          value: '',
          isEditing: false,
        },
      ],
      isSelected: false,
      columnTypes: { 
        2: columnTypes[2], 
        3: columnTypes[3], 
        4: columnTypes[4] 
      }
    };
    
    // Create the series row (second row)
    const seriesRow: Row = {
      id: `row-${timestamp + 1}-serie`,
      exerciseId: newExerciseId,
      setNumber: 1,
      cells: [
        { id: `cell-${timestamp + 1}-0`, value: '', isEditing: false },
        { id: `cell-${timestamp + 1}-1`, value: 'Serie 1', isEditing: false },
        { id: `cell-${timestamp + 1}-2`, value: '', isEditing: false },
        { id: `cell-${timestamp + 1}-3`, value: '', isEditing: false },
        { id: `cell-${timestamp + 1}-4`, value: '', isEditing: false },
        { id: `cell-${timestamp + 1}-5`, value: '', isEditing: false },
      ],
      isSelected: false,
      isSetRow: true,
    };
    
    // Create the details row (third row)
    const detailsRow: Row = {
      id: `row-${timestamp + 2}-details`,
      exerciseId: newExerciseId,
      setNumber: 1,
      cells: [
        { id: `cell-${timestamp + 2}-0`, value: '', isEditing: false },
        { id: `cell-${timestamp + 2}-1`, value: '', isEditing: false },
        { id: `cell-${timestamp + 2}-2`, value: '', isEditing: false }, // Repeticiones
        { id: `cell-${timestamp + 2}-3`, value: '', isEditing: false }, // Peso
        { id: `cell-${timestamp + 2}-4`, value: '', isEditing: false }, // Descanso
        { id: `cell-${timestamp + 2}-5`, value: '', isEditing: false }, // Notas
      ],
      isSelected: false,
      isSetRow: true,
    };
    
    // Add all three rows at once
    setRows(prev => [...prev, exerciseRow, seriesRow, detailsRow]);
    setHasUnsavedChanges(true);
  };
  // Replace the empty handleExerciseSelect function with this implementation
  const handleExerciseSelect = (
    exercise: (typeof predefinedExercises)[0] | { name: string, custom: boolean },
    rowIndex: number
  ) => {
    // Update the exercise name in the cell
    const updatedRows = [...rows];
    updatedRows[rowIndex].cells[0].value = exercise.name;
    updatedRows[rowIndex].cells[0].isEditing = false;
    setRows(updatedRows);
    
    // Close the dropdown
    setShowExerciseDropdown(false);
    
    // Mark that changes have been made
    setHasUnsavedChanges(true);
  };
  const handleCustomExerciseName = (rowIndex: number, name: string) => {
    // Update the exercise name in the cell
    const updatedRows = [...rows];
    updatedRows[rowIndex].cells[0].value = name;
    updatedRows[rowIndex].cells[0].isEditing = false;
    setRows(updatedRows);
    
    // Close the dropdown
    setShowExerciseDropdown(false);
    
    // Mark that changes have been made
    setHasUnsavedChanges(true);
  };

  const toggleCellEdit = (row: number, col: number) => {
    if (!canEditCell(rows[row], col)) return;

    setRows((prev) =>
      prev.map((r, rowIndex) => ({
        ...r,
        cells: r.cells.map((cell, colIndex) => ({
          ...cell,
          isEditing:
            rowIndex === row && colIndex === col ? !cell.isEditing : false,
          tempValue:
            rowIndex === row && colIndex === col ? cell.value : cell.tempValue,
        })),
      }))
    );

    if (col === 0 && !rows[row].isSetRow) {
      setShowExerciseDropdown(true);
      setExerciseSearch(rows[row].cells[0].value);
      update?.();
    }
  };
  const handleColumnTypeChange = (colIndex: number, newType: string) => {
    setColumnTypes(prev => ({
      ...prev,
      [colIndex]: newType
    }));
    setHasUnsavedChanges(true);
  };
  const generateRows = useCallback(() => {
    if (!planSemanal[selectedDay]) return [];

    const exercises = planSemanal[selectedDay].sessions.flatMap(
      (session: any) => session.exercises
    );
    console.log('Ejercicios generados:', exercises);

    const initialRows: Row[] = [];
    let rowIndex = 0;

    exercises.forEach((exercise: any) => {
      console.log('Ejercicio actual:', exercise);
      
      // Get exercise name using the helper function if needed
      const exerciseName = exercise.exercise?.nombre || 
                          (typeof exercise.exercise === 'string' ? getExerciseName(exercise.exercise) : 
                          'Sin nombre');
      
      // Fila del nombre del ejercicio
      initialRows.push({
        id: `row-${rowIndex}`,
        exerciseId: exercise._id,
        cells: [
          {
            id: `cell-${rowIndex}-0`,
            value: exerciseName,
            isEditing: false,
          },
          {
            id: `cell-${rowIndex}-1`,
            value: '',
            isEditing: false,
          },
          {
            id: `cell-${rowIndex}-2`,
            value: '',
            isEditing: false,
          },
          {
            id: `cell-${rowIndex}-3`,
            value: '',
            isEditing: false,
          },
          {
            id: `cell-${rowIndex}-4`,
            value: '',
            isEditing: false,
          },
          {
            id: `cell-${rowIndex}-5`,
            value: exercise.notes || '',
            isEditing: false,
          },
        ],
        isSelected: false,
        // Initialize with individual column types if they exist, otherwise use global ones
        columnTypes: exercise.columnTypes || { 
          2: columnTypes[2], 
          3: columnTypes[3], 
          4: columnTypes[4] 
        }
      });
      rowIndex++;


      // Obtener el número de series o usar 1 por defecto
      const numSets = exercise.sets?.length || 1;
      
      // Para cada serie, crear una fila de serie y una fila de detalles
      for (let i = 0; i < numSets; i++) {
        // Fila de la serie
        initialRows.push({
          id: `row-${rowIndex}-serie`,
          exerciseId: exercise._id,
          setNumber: i + 1,
          cells: [
            {
              id: `cell-${rowIndex}-0`,
              value: '',  // Celda vacía
              isEditing: false,
            },
            {
              id: `cell-${rowIndex}-1`,
              value: `Serie ${i + 1}`,
              isEditing: false,
            },
            {
              id: `cell-${rowIndex}-2`,
              value: '',
              isEditing: false,
            },
            {
              id: `cell-${rowIndex}-3`,
              value: '',
              isEditing: false,
            },
            {
              id: `cell-${rowIndex}-4`,
              value: '',
              isEditing: false,
            },
            {
              id: `cell-${rowIndex}-5`,
              value: '',
              isEditing: false,
            },
          ],
          isSelected: false,
          isSetRow: true,
        });
        rowIndex++;

        // Fila de detalles (repeticiones, peso, descanso)
        initialRows.push({
          id: `row-${rowIndex}-details`,
          exerciseId: exercise._id,
          setNumber: i + 1,
          cells: [
            {
              id: `cell-${rowIndex}-0`,
              value: '',  // Celda vacía
              isEditing: false,
            },
            {
              id: `cell-${rowIndex}-1`,
              value: '',  // Celda vacía
              isEditing: false,
            },
            {
              id: `cell-${rowIndex}-2`,
              value: exercise.sets?.[i]?.reps?.toString() || '',
              isEditing: false,
            },
            {
              id: `cell-${rowIndex}-3`,
              value: exercise.sets?.[i]?.weight?.toString() || '',
              isEditing: false,
            },
            {
              id: `cell-${rowIndex}-4`,
              value: exercise.sets?.[i]?.rest?.toString() || '',
              isEditing: false,
            },
            {
              id: `cell-${rowIndex}-5`,
              value: exercise.sets?.[i]?.notes || '',
              isEditing: false,
            },
          ],
          isSelected: false,
          isSetRow: true,
        });
        rowIndex++;
      }
    });

    return initialRows;
  }, [planSemanal, selectedDay, exerciseData, planningExercises]); // Add dependencies

  const [rows, setRows] = useState<Row[]>(generateRows());
 
  const addNewSet = (exerciseId: string | undefined) => {
    if (!exerciseId) return;
    
    // Encontrar todas las filas relacionadas con este ejercicio
    const exerciseRows = rows.filter(row => row.exerciseId === exerciseId);
    
    // Encontrar la última fila de serie para este ejercicio específico
    const serieRows = exerciseRows.filter(row => row.isSetRow && row.id.includes('-serie'));
    const detailRows = exerciseRows.filter(row => row.isSetRow && row.id.includes('-details'));
    
    // Ordenar por número de serie para obtener el último
    serieRows.sort((a, b) => (a.setNumber || 0) - (b.setNumber || 0));
    const lastSerieRow = serieRows[serieRows.length - 1];
    
    // Determinar el nuevo número de serie
    const newSetNumber = (lastSerieRow?.setNumber || 0) + 1;
    
    // Encontrar el índice donde insertar las nuevas filas
    let insertIndex;
    
    if (serieRows.length === 0) {
      // Si no hay series, insertar después de la fila del ejercicio
      const exerciseRowIndex = rows.findIndex(row => 
        row.exerciseId === exerciseId && !row.isSetRow
      );
      insertIndex = exerciseRowIndex;
    } else {
      // Encontrar la última fila de detalles para este ejercicio
      const lastDetailRow = detailRows.find(row => row.setNumber === lastSerieRow.setNumber);
      insertIndex = rows.findIndex(row => row.id === lastDetailRow?.id);
    }
    
    // Crear nuevas filas para la serie y sus detalles
    const newSerieRow: Row = {
      id: `row-${Date.now()}-serie`,
      exerciseId: exerciseId,
      setNumber: newSetNumber,
      cells: [
        { id: `cell-${Date.now()}-0`, value: '', isEditing: false },
        { id: `cell-${Date.now()}-1`, value: `Serie ${newSetNumber}`, isEditing: false },
        { id: `cell-${Date.now()}-2`, value: '', isEditing: false },
        { id: `cell-${Date.now()}-3`, value: '', isEditing: false },
        { id: `cell-${Date.now()}-4`, value: '', isEditing: false },
        { id: `cell-${Date.now()}-5`, value: '', isEditing: false },
      ],
      isSelected: false,
      isSetRow: true,
    };
    
    const newDetailsRow: Row = {
      id: `row-${Date.now() + 1}-details`,
      exerciseId: exerciseId,
      setNumber: newSetNumber,
      cells: [
        { id: `cell-${Date.now() + 1}-0`, value: '', isEditing: false },
        { id: `cell-${Date.now() + 1}-1`, value: '', isEditing: false },
        { id: `cell-${Date.now() + 1}-2`, value: '', isEditing: false }, // Repeticiones
        { id: `cell-${Date.now() + 1}-3`, value: '', isEditing: false }, // Peso
        { id: `cell-${Date.now() + 1}-4`, value: '', isEditing: false }, // Descanso
        { id: `cell-${Date.now() + 1}-5`, value: '', isEditing: false }, // Notas
      ],
      isSelected: false,
      isSetRow: true,
    };
    
    // Insertar las nuevas filas
    const updatedRows = [...rows];
    updatedRows.splice(insertIndex + 1, 0, newSerieRow, newDetailsRow);
    setRows(updatedRows);
    setHasUnsavedChanges(true);
  };
  
  const deleteSet = (exerciseId: string | undefined, setNumber: number | undefined) => {
    if (!exerciseId || setNumber === undefined) return;
    
    // Encontrar y eliminar la fila de serie y la fila de detalles
    const updatedRows = rows.filter(row => {
      if (row.exerciseId === exerciseId && row.isSetRow && row.setNumber === setNumber) {
        return false; // Eliminar esta fila
      }
      return true;
    });
    
    // Actualizar los números de serie
    let currentSetNumber = 1;
    const finalRows = updatedRows.map(row => {
      if (row.exerciseId === exerciseId && row.isSetRow && row.id.includes('-serie')) {
        // Actualizar el número de serie
        const updatedRow = { ...row, setNumber: currentSetNumber };
        // Actualizar el texto de la celda
        updatedRow.cells[1].value = `Serie ${currentSetNumber}`;
        currentSetNumber++;
        return updatedRow;
      }
      if (row.exerciseId === exerciseId && row.isSetRow && row.id.includes('-details')) {
        // Actualizar el número de serie en la fila de detalles
        return { ...row, setNumber: currentSetNumber - 1 };
      }
      return row;
    });
    
    setRows(finalRows);
    setHasUnsavedChanges(true);
  };
  
  useEffect(() => {
    console.log('Plan semanal para', selectedDay, ':', planSemanal[selectedDay]);
  }, [selectedDay, planSemanal]);

  useEffect(() => {
    setRows(generateRows());
  }, [selectedDay, generateRows]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedCell) return;

      const { row, col } = selectedCell;

      if (e.key === 'ArrowUp' && row > 0) {
        e.preventDefault();
        setSelectedCell({ row: row - 1, col });
      }
      if (e.key === 'ArrowDown' && row < rows.length - 1) {
        e.preventDefault();
        setSelectedCell({ row: row + 1, col });
      }
      if (e.key === 'ArrowLeft' && col > 0) {
        e.preventDefault();
        setSelectedCell({ row, col: col - 1 });
      }
      if (e.key === 'ArrowRight' && col < columns.length - 1) {
        e.preventDefault();
        setSelectedCell({ row, col: col + 1 });
      }
      if (e.key === 'Enter') {
        e.preventDefault();
        toggleCellEdit(row, col);
      }
      if (e.key === 'F2') {
        e.preventDefault();
        toggleCellEdit(row, col);
      }
      if (e.key === 'Delete') {
        e.preventDefault();
        clearCell(row, col);
      }
      if (e.ctrlKey && e.key === 'c') {
        e.preventDefault();
        copyCell(row, col);
      }
      if (e.ctrlKey && e.key === 'v') {
        e.preventDefault();
        pasteCell(row, col);
      }
      if (e.key === '?' && e.ctrlKey) {
        e.preventDefault();
        setShowShortcuts(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedCell, rows.length]);

  useEffect(() => {
    if (selectedCell && selectedCell.col === 0) {
      const { row, col } = selectedCell;
      const cellElement = cellRefs.current[`${row}-${col}`];
      if (cellElement) {
        refs.setReference(cellElement);
      }
    }
  }, [selectedCell, refs]);

  const updateSetsCount = (row: number, newCount: number) => {
    // Implementación existente
  };

  const canEditCell = (row: Row, col: number) => {
    if (row.isSetRow) {
      // Si es una fila de serie (con el texto "Serie X")
      if (row.id.includes('-serie')) {
        // Solo permitir editar la columna de serie (columna 1)
        return col === 1;
      } else if (row.id.includes('-details')) {
        // Si es una fila de detalles, permitir editar repeticiones, peso y descanso
        return col >= 2 && col <= 5;
      }
    }
    // Para filas de ejercicio, permitir editar nombre y notas
    return col === 0 || col === 5;
  };


  const updateCellValue = (
    row: number,
    col: number,
    value: string,
    commit: boolean = true
  ) => {
    if (!commit) {
      // Solo actualizar el valor temporal
      setRows((prev) =>
        prev.map((r, rowIndex) => ({
          ...r,
          cells: r.cells.map((cell, colIndex) => ({
            ...cell,
            tempValue:
              rowIndex === row && colIndex === col ? value : cell.tempValue,
          })),
        }))
      );
      return;
    }

    const updatedRows = JSON.parse(JSON.stringify(rows));
    // Use the tempValue if available, otherwise use the provided value
    const finalValue = updatedRows[row].cells[col].tempValue !== undefined 
      ? updatedRows[row].cells[col].tempValue 
      : value;
    
    // Only set hasUnsavedChanges if the value actually changed
    if (updatedRows[row].cells[col].value !== finalValue) {
      setHasUnsavedChanges(true);
    }
    
    updatedRows[row].cells[col].value = finalValue || '';
    updatedRows[row].cells[col].tempValue = undefined;
    updatedRows[row].cells[col].isEditing = false;
    
    // Apply the updated rows to state
    setRows(updatedRows);

    // Si estamos actualizando el número de series
    if (col === 1 && !rows[row].isSetRow) {
      const newCount = parseInt(finalValue || '0') || 0;
      updateSetsCount(row, newCount);
    }
  };
    const clearCell = (row: number, col: number) => {
    if (!canEditCell(rows[row], col)) return;
    updateCellValue(row, col, '');
  };

  const copyCell = (row: number, col: number) => {
    const value = rows[row].cells[col].value;
    navigator.clipboard.writeText(value);
  };

  const pasteCell = async (row: number, col: number) => {
    if (!canEditCell(rows[row], col)) return;
    try {
      const text = await navigator.clipboard.readText();
      updateCellValue(row, col, text);
    } catch (err) {
      console.error('Failed to paste:', err);
    }
  };

  const shortcuts = [
    { key: '↑/↓/←/→', description: 'Navegar entre celdas' },
    { key: 'Enter/F2', description: 'Editar celda' },
    { key: 'Delete', description: 'Borrar contenido' },
    { key: 'Ctrl + C', description: 'Copiar celda' },
    { key: 'Ctrl + V', description: 'Pegar en celda' },
    { key: 'Ctrl + ?', description: 'Mostrar atajos' },
  ];

  const handleImportCSV = (data: any, importType: 'day' | 'week' | 'multiweek') => {
    // Aquí procesarás los datos del CSV según el tipo de importación
    console.log('Datos CSV importados:', data);
    console.log('Tipo de importación:', importType);
    console.log('Usar mismas categorías:', data.useSameCategories);
    // TODO: Implementar la lógica de importación según el formato de tu CSV y el tipo seleccionado
  };

  const handleSaveChanges = () => {
    // Don't do anything if there are no changes
    if (!hasUnsavedChanges) return;
    
    // Convertir las filas editadas de vuelta a la estructura de planSemanal
    const updatedPlanSemanal = { ...planSemanal };
    
    // Crear un mapa de ejercicios
    const exercisesMap = new Map();
    
    // Primero, identificar todas las filas de ejercicios
    const exerciseRows = rows.filter(row => !row.isSetRow);
    console.log('Exercise Rows:', exerciseRows);

    exerciseRows.forEach((exerciseRow) => {
      const exercise = {
        _id: exerciseRow.exerciseId,
        exercise: { nombre: exerciseRow.cells[0].value },
        notes: exerciseRow.cells[5].value,
        sets: [],
        columnTypes: exerciseRow.columnTypes
      };
      exercisesMap.set(exerciseRow.exerciseId, exercise);
    });
    console.log('Exercises Map after processing exercise rows:', Array.from(exercisesMap.entries()));

    // Ahora procesar las filas de detalles para cada ejercicio
    rows.forEach(row => {
      if (row.isSetRow && row.id.includes('-details') && row.exerciseId && row.setNumber) {
        const exercise = exercisesMap.get(row.exerciseId);
        if (exercise) {
          // Asegurarse de que el array de sets existe
          if (!exercise.sets) {
            exercise.sets = [];
          }
          
          // Añadir los detalles de la serie
          exercise.sets.push({
            reps: parseInt(row.cells[2].value) || 0,
            weight: parseFloat(row.cells[3].value) || 0,
            rest: parseInt(row.cells[4].value) || 0,
            notes: row.cells[5].value || '',
          });
        }
      }
    });
    
    // Convertir el mapa a un array de ejercicios
    const updatedExercises = Array.from(exercisesMap.values());
    
    // Actualizar el planSemanal para el día seleccionado
    updatedPlanSemanal[selectedDay].sessions = [
      {
        exercises: updatedExercises,
      },
    ];
    
    // Llamar a updatePlan con el plan actualizado
    updatePlan(updatedPlanSemanal);
    
    // Enviar los datos actualizados a la API
    if (planningId) {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found in localStorage');
        return;
      }
      
      // Preparar los datos para enviar a la API
      const apiData = {
        exercises: updatedExercises
      };
      console.log('Final updated exercises:', updatedExercises);

      // Hacer la llamada a la API
      fetch(`https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/plannings/${planningId}/week/${semanaActual}/day/${selectedDay}/csv`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(apiData)
      })
      .then(response => {
        if (!response.ok) {
          throw new Error(`Error saving changes: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('Changes saved successfully:', data);
        // Mostrar alguna notificación de éxito si es necesario
      })
      .catch(error => {
        console.error('Error saving changes:', error);
        // Mostrar alguna notificación de error si es necesario
      });
    }
    
    setHasUnsavedChanges(false);
  };
  return (
    <div className="space-y-6">
            <PopupShortcut
        isOpen={showShortcuts}
        onClose={() => setShowShortcuts(false)}
        shortcuts={shortcuts}
        theme={theme}
      />

      <div
        className={`p-6 rounded-xl shadow-lg ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white'
        }`}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Table className="w-6 h-6 text-blue-500" />
            <h2 className="text-xl font-bold">Vista Excel</h2>
          </div>

          <div className="flex items-center space-x-4">
          <Button
              onClick={addNewExercise}
              variant="secondary"
              className={`flex items-center space-x-2 ${
                theme === 'dark'
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
            >
              <PlusCircle className="w-5 h-5" />
              <span>Añadir Ejercicio</span>
            </Button>
            <input
              type="file"
              accept=".csv"
              onChange={(e) => console.log('No implementado')}
              ref={fileInputRef}
              className="hidden"
            />
           
            <Button
              variant="normal"
              onClick={() => setShowShortcuts(true)}
              className="flex items-center space-x-2"
            >
              <Command className="w-5 h-5" />
              <span>Atajos</span>
            </Button>
            <button
              onClick={handleSaveChanges}
              disabled={!hasUnsavedChanges}
              className={`flex items-center px-5 py-2.5 rounded-lg font-medium transition-all duration-300 ${
                hasUnsavedChanges
                  ? theme === 'dark'
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-emerald-500/20 transform hover:-translate-y-0.5'
                    : 'bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 text-white shadow-lg hover:shadow-emerald-500/20 transform hover:-translate-y-0.5'
                  : theme === 'dark'
                  ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-500 cursor-not-allowed'
              }`}
            >
              <Save className={`w-5 h-5 mr-2 ${!hasUnsavedChanges ? 'opacity-50' : ''}`} />
              <span>{hasUnsavedChanges ? 'Guardar Cambios' : 'Sin Cambios'}</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2 mb-6">
          {dias.map((dia) => (
            <motion.button
              key={dia}
              onClick={() => setSelectedDay(dia)}
              className={`p-4 rounded-xl transition-all duration-300 ${
                selectedDay === dia
                  ? theme === 'dark'
                    ? 'bg-blue-600 text-white'
                    : 'bg-blue-500 text-white'
                  : theme === 'dark'
                  ? 'bg-gray-700 hover:bg-gray-600'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex flex-col items-center space-y-2">
                <span className="text-sm font-medium">{dia}</span>
                <span className="text-xs opacity-75">
                  {planSemanal[dia]?.sessions.length || 0} sesiones
                </span>
              </div>
            </motion.button>
          ))}
        </div>
        <div className={`flex items-center justify-end mb-4 ${
          theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
        }`}>
          <div className="flex items-center space-x-2">
            <span className="text-sm">Categorías individuales</span>
            <Switch 
              checked={useSameCategories}
              onCheckedChange={setUseSameCategories}
              className={`${
                useSameCategories 
                  ? theme === 'dark' ? 'bg-blue-600' : 'bg-blue-500' 
                  : theme === 'dark' ? 'bg-gray-600' : 'bg-gray-300'
              }`}
            />
            <span className="text-sm">Mismas categorías</span>
          </div>
        </div>

        <div
          ref={gridRef}
          className="overflow-x-auto relative"
          style={{ maxHeight: 'calc(100vh - 300px)' }}
        >
<table className="w-full border-collapse">
          <thead>
            <tr>
              {columns.map((column, index) => (
                <th
                  key={index}
                  className={`sticky top-0 px-4 py-3 text-left font-semibold ${
                    theme === 'dark'
                      ? 'bg-gray-700 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {index >= 2 && index <= 4 && !useSameCategories ? (
                    // Show empty header for individual categories mode
                    <div className="h-6"></div>
                  ) : index >= 2 && index <= 4 ? (
                    // Show dropdown for global categories mode
                    <div className="relative group">
                      <div className="flex items-center cursor-pointer">
                        <span>{column}</span>
                        <svg 
                          className="w-4 h-4 ml-1" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24" 
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                      <div className={`absolute z-10 mt-1 w-40 rounded-md shadow-lg hidden group-hover:block ${
                        theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                      } ring-1 ring-black ring-opacity-5`}>
                        <div className="py-1" role="menu" aria-orientation="vertical">
                          {availableColumnTypes.map((type) => (
                            <button
                              key={type}
                              className={`block w-full text-left px-4 py-2 text-sm ${
                                theme === 'dark' 
                                  ? 'text-gray-300 hover:bg-gray-700' 
                                  : 'text-gray-700 hover:bg-gray-100'
                              } ${columnTypes[index] === type ? 
                                theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100' 
                                : ''}`}
                              role="menuitem"
                              onClick={() => handleColumnTypeChange(index, type)}
                            >
                              {type}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    column
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
          {rows.map((row, rowIndex) => (
            <tr
              key={row.id}
              className={`border-b ${
                theme === 'dark'
                  ? 'border-gray-700 hover:bg-gray-750'
                  : 'border-gray-200 hover:bg-gray-50'
              } ${
                row.isSetRow
                  ? theme === 'dark'
                    ? 'bg-gray-750'
                    : 'bg-gray-50'
                  : ''
              }`}
            >
              {row.cells.map((cell, colIndex) => (
                <td
                  key={cell.id}
                  ref={(el) => {
                    cellRefs.current[`${rowIndex}-${colIndex}`] = el;
                  }}
                  className={`px-4 py-3 ${row.isSetRow ? 'pl-8' : ''} ${
                    selectedCell?.row === rowIndex &&
                    selectedCell?.col === colIndex
                      ? theme === 'dark'
                        ? 'bg-blue-500/20 outline outline-2 outline-blue-500'
                        : 'bg-blue-100 outline outline-2 outline-blue-400'
                      : ''
                  }`}
                  onClick={() => {
                    setSelectedCell({ row: rowIndex, col: colIndex });
                    // Iniciar edición directamente al hacer clic si la celda es editable
                    if (canEditCell(row, colIndex)) {
                      const updatedRows = [...rows];
                      updatedRows[rowIndex].cells[colIndex].isEditing = true;
                      setRows(updatedRows);
                      
                      // Si es la columna de ejercicio, mostrar el dropdown
                      if (colIndex === 0 && !row.isSetRow) {
                        setShowExerciseDropdown(true);
                        setExerciseSearch(row.cells[0].value);
                        update?.();
                      }
                    }
                  }}
                >
               {cell.isEditing ? (
                    <input
                      type="text"
                      value={
                        colIndex === 0
                          ? exerciseSearch
                          : cell.tempValue ?? cell.value
                      }
                      onChange={(e) => {
                        if (colIndex === 0) {
                          setExerciseSearch(e.target.value);
                          setShowExerciseDropdown(true);
                        } else {
                          updateCellValue(
                            rowIndex,
                            colIndex,
                            e.target.value,
                            false
                          );
                        }
                      }}
                      onBlur={() => {
                        if (colIndex !== 0) {
                          updateCellValue(
                            rowIndex,
                            colIndex,
                            cell.tempValue || cell.value,
                            true
                          );
                        } else {
                          // For exercise name column, handle blur differently
                          // Small delay to allow click on dropdown items
                          setTimeout(() => {
                            updateCellValue(
                              rowIndex,
                              colIndex,
                              exerciseSearch,
                              true
                            );
                            setShowExerciseDropdown(false);
                          }, 200);
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          if (colIndex !== 0) {
                            updateCellValue(
                              rowIndex,
                              colIndex,
                              cell.tempValue || cell.value,
                              true
                            );
                          } else {
                            updateCellValue(
                              rowIndex,
                              colIndex,
                              exerciseSearch,
                              true
                            );
                            setShowExerciseDropdown(false);
                          }
                          // Move focus away from the input
                          e.currentTarget.blur();
                        }
                      }}
                      autoFocus
                      className={`w-full px-2 py-1 rounded border ${
                        theme === 'dark'
                          ? 'bg-gray-700 border-gray-600'
                          : 'bg-white border-gray-300'
                      }`}
                    />
                  ) : (
                    <div className="min-h-[24px] flex items-center justify-between">
                      {/* Show column type selector for individual categories */}
                      {!useSameCategories && !row.isSetRow && colIndex >= 2 && colIndex <= 4 ? (
                        <div className="relative group w-full">
                          <div className="flex items-center justify-between cursor-pointer">
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {row.columnTypes?.[colIndex] || columnTypes[colIndex]}:
                            </span>
                            <svg 
                              className="w-3 h-3 ml-1 text-gray-500 dark:text-gray-400" 
                              fill="none" 
                              stroke="currentColor" 
                              viewBox="0 0 24 24" 
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                          <div className={`absolute z-10 mt-1 w-40 rounded-md shadow-lg hidden group-hover:block ${
                            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                          } ring-1 ring-black ring-opacity-5`}>
                            <div className="py-1" role="menu" aria-orientation="vertical">
                              {availableColumnTypes.map((type) => (
                                <button
                                  key={type}
                                  className={`block w-full text-left px-4 py-2 text-sm ${
                                    theme === 'dark' 
                                      ? 'text-gray-300 hover:bg-gray-700' 
                                      : 'text-gray-700 hover:bg-gray-100'
                                  } ${(row.columnTypes?.[colIndex] || columnTypes[colIndex]) === type ? 
                                    theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100' 
                                    : ''}`}
                                  role="menuitem"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleIndividualColumnTypeChange(row.exerciseId, colIndex, type);
                                  }}
                                >
                                  {type}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <span>
                          {cell.value && colIndex >= 2 && colIndex <= 4 ? (
                            <span>
                              {cell.value}
                              {/* Use individual column types if available and in individual mode */}
                              {colIndex === 2 && 
                                ((!useSameCategories && row.isSetRow) 
                                  ? (rows.find(r => r.exerciseId === row.exerciseId && !r.isSetRow)?.columnTypes?.[2] || columnTypes[2]) === 'Repeticiones' 
                                  : columnTypes[2] === 'Repeticiones') && ' reps'}
                              {colIndex === 2 && 
                                ((!useSameCategories && row.isSetRow) 
                                  ? (rows.find(r => r.exerciseId === row.exerciseId && !r.isSetRow)?.columnTypes?.[2] || columnTypes[2]) === 'Tiempo' 
                                  : columnTypes[2] === 'Tiempo') && ' seg'}
                              {colIndex === 2 && 
                                ((!useSameCategories && row.isSetRow) 
                                  ? (rows.find(r => r.exerciseId === row.exerciseId && !r.isSetRow)?.columnTypes?.[2] || columnTypes[2]) === 'RPE' 
                                  : columnTypes[2] === 'RPE') && '/10'}
                              {colIndex === 2 && 
                                ((!useSameCategories && row.isSetRow) 
                                  ? (rows.find(r => r.exerciseId === row.exerciseId && !r.isSetRow)?.columnTypes?.[2] || columnTypes[2]) === 'RIR' 
                                  : columnTypes[2] === 'RIR') && ' RIR'}
                              {colIndex === 2 && 
                                ((!useSameCategories && row.isSetRow) 
                                  ? (rows.find(r => r.exerciseId === row.exerciseId && !r.isSetRow)?.columnTypes?.[2] || columnTypes[2]) === 'RPM' 
                                  : columnTypes[2] === 'RPM') && ' rpm'}
                              
                              {colIndex === 3 && 
                                ((!useSameCategories && row.isSetRow) 
                                  ? (rows.find(r => r.exerciseId === row.exerciseId && !r.isSetRow)?.columnTypes?.[3] || columnTypes[3]) === 'Peso' 
                                  : columnTypes[3] === 'Peso') && ' kg'}
                              {colIndex === 3 && 
                                ((!useSameCategories && row.isSetRow) 
                                  ? (rows.find(r => r.exerciseId === row.exerciseId && !r.isSetRow)?.columnTypes?.[3] || columnTypes[3]) === 'Tiempo' 
                                  : columnTypes[3] === 'Tiempo') && ' seg'}
                              {colIndex === 3 && 
                                ((!useSameCategories && row.isSetRow) 
                                  ? (rows.find(r => r.exerciseId === row.exerciseId && !r.isSetRow)?.columnTypes?.[3] || columnTypes[3]) === 'RPE' 
                                  : columnTypes[3] === 'RPE') && '/10'}
                              {colIndex === 3 && 
                                ((!useSameCategories && row.isSetRow) 
                                  ? (rows.find(r => r.exerciseId === row.exerciseId && !r.isSetRow)?.columnTypes?.[3] || columnTypes[3]) === 'RIR' 
                                  : columnTypes[3] === 'RIR') && ' RIR'}
                              {colIndex === 3 && 
                                ((!useSameCategories && row.isSetRow) 
                                  ? (rows.find(r => r.exerciseId === row.exerciseId && !r.isSetRow)?.columnTypes?.[3] || columnTypes[3]) === 'RPM' 
                                  : columnTypes[3] === 'RPM') && ' rpm'}
                              
                              {colIndex === 4 && 
                                ((!useSameCategories && row.isSetRow) 
                                  ? (rows.find(r => r.exerciseId === row.exerciseId && !r.isSetRow)?.columnTypes?.[4] || columnTypes[4]) === 'Descanso' 
                                  : columnTypes[4] === 'Descanso') && ' seg'}
                              {colIndex === 4 && 
                                ((!useSameCategories && row.isSetRow) 
                                  ? (rows.find(r => r.exerciseId === row.exerciseId && !r.isSetRow)?.columnTypes?.[4] || columnTypes[4]) === 'Tiempo' 
                                  : columnTypes[4] === 'Tiempo') && ' seg'}
                              {colIndex === 4 && 
                                ((!useSameCategories && row.isSetRow) 
                                  ? (rows.find(r => r.exerciseId === row.exerciseId && !r.isSetRow)?.columnTypes?.[4] || columnTypes[4]) === 'RPE' 
                                  : columnTypes[4] === 'RPE') && '/10'}
                              {colIndex === 4 && 
                                ((!useSameCategories && row.isSetRow) 
                                  ? (rows.find(r => r.exerciseId === row.exerciseId && !r.isSetRow)?.columnTypes?.[4] || columnTypes[4]) === 'RIR' 
                                  : columnTypes[4] === 'RIR') && ' RIR'}
                              {colIndex === 4 && 
                                ((!useSameCategories && row.isSetRow) 
                                  ? (rows.find(r => r.exerciseId === row.exerciseId && !r.isSetRow)?.columnTypes?.[4] || columnTypes[4]) === 'RPM' 
                                  : columnTypes[4] === 'RPM') && ' rpm'}
                            </span>
                          ) : (
                            cell.value
                          )}
                        </span>
                      )}
                      
                      {/* Botón para añadir serie (solo en la primera columna de filas de ejercicio) */}
                      {colIndex === 0 && !row.isSetRow && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            addNewSet(row.exerciseId);
                          }}
                          className={`ml-2 p-1 rounded-full ${
                            theme === 'dark'
                              ? 'bg-blue-600 hover:bg-blue-700'
                              : 'bg-blue-500 hover:bg-blue-600'
                          } text-white`}
                          title="Añadir serie"
                        >
                          <Plus size={16} />
                        </button>
                      )}
                      
                      {/* Botón para eliminar serie (solo en la primera columna de filas de serie) */}
                      {colIndex === 1 && row.isSetRow && row.id.includes('-serie') && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteSet(row.exerciseId, row.setNumber);
                          }}
                          className={`ml-2 p-1 rounded-full ${
                            theme === 'dark'
                              ? 'bg-red-600 hover:bg-red-700'
                              : 'bg-red-500 hover:bg-red-600'
                          } text-white`}
                          title="Eliminar serie"
                        >
                          <X size={16} />
                        </button>
                      )}
                    </div>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>


      {showExerciseDropdown && selectedCell && (
            <div
              ref={refs.setFloating}
              style={floatingStyles}
              className={`z-50 w-64 max-h-60 overflow-y-auto rounded-lg shadow-lg ${
                theme === 'dark' ? 'bg-gray-700' : 'bg-white'
              } border ${
                theme === 'dark' ? 'border-gray-600' : 'border-gray-200'
              }`}
            >
              {/* Option to use custom text */}
              <div
                className={`px-4 py-2 cursor-pointer border-b ${
                  theme === 'dark'
                    ? 'hover:bg-gray-600 border-gray-600'
                    : 'hover:bg-gray-100 border-gray-300'
                }`}
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleCustomExerciseName(selectedCell?.row || 0, exerciseSearch);
                }}
              >
                <div className="font-medium">Usar texto personalizado</div>
                <div className="text-sm text-gray-500">
                  "{exerciseSearch}"
                </div>
              </div>
              
              {/* Predefined exercises */}
              {filteredExercises.length > 0 ? (
                filteredExercises.map((exercise) => (
                  <div
                    key={exercise.id}
                    className={`px-4 py-2 cursor-pointer ${
                      theme === 'dark'
                        ? 'hover:bg-gray-600'
                        : 'hover:bg-gray-100'
                    }`}
                    onMouseDown={(e) => {
                      // Use onMouseDown instead of onClick to prevent the blur event from firing first
                      e.preventDefault();
                      handleExerciseSelect(exercise, selectedCell?.row || 0);
                    }}
                  >
                    <div className="font-medium">{exercise.name}</div>
                    <div className="text-sm text-gray-500">
                      {exercise.category} - {exercise.muscleGroup}
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-4 py-2 text-gray-500">
                  No se encontraron ejercicios
                </div>
              )}
            </div>
          )}
        </div>

        <div className="mt-4 flex justify-between items-center">
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <span>{rows.length} filas</span>
            <span>·</span>
            <span>{columns.length} columnas</span>
          </div>
        </div>
      </div>
      <PopupCSV
        isOpen={showImportPopup}
        onClose={() => setShowImportPopup(false)}
        onImport={handleImportCSV}
      />

    </div>
  );
};

export default VistaExcel;