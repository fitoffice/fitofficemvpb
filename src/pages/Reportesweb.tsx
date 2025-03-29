import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  Clock,
  Filter,
  Plus,
  Search
} from 'lucide-react';
import Table from '../components/Common/Table';
import Button from '../components/Common/Button';
import { reporteService, type Reporte } from '../services/reporteService';
import { format } from 'date-fns'; 
import { es } from 'date-fns/locale';
import { useTheme } from '../contexts/ThemeContext';

const categorias = ['Bug', 'Request', 'UI', 'Performance'];
const estados = ['Abierto', 'En Progreso', 'Resuelto', 'Cerrado'];
const departamentos = ['TI', 'Servicio al Cliente', 'Desarrollo', 'Ventas', 'Marketing'];
const secciones = [
  'Dashboard',
  'Clientes',
  'Rutinas',
  'Dietas',
  'Clases',
  'Economía',
  'Marketing/Campañas',
  'Marketing/Análisis',
  'Contenido',
  'Publicaciones',
  'Perfil',
  'Ajustes',
  'Servicios',
  'Reportes'
];

const getEstadoColor = (estado: string) => {
  switch (estado) {
    case 'Abierto':
      return '#ff9800';
    case 'En Progreso':
      return '#2196f3';
    case 'Resuelto':
      return '#4caf50';
    case 'Cerrado':
      return '#9e9e9e';
    default:
      return '#e0e0e0';
  }
};

const Reportesweb = () => {
  const { theme, toggleTheme } = useTheme();
  const [reportes, setReportes] = useState<Reporte[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editandoReporte, setEditandoReporte] = useState<string | null>(null);
  const [nuevoReporte, setNuevoReporte] = useState<Partial<Reporte>>({
    resumenFeedback: '',
    categoria: '',
    seccion: '',
    estado: 'Abierto',
    departamentoAsignado: '',
    resumenResolucion: '',
    usuarioNotificado: false,
  });
  const [filtro, setFiltro] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('');
  const [filtroSeccion, setFiltroSeccion] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('');
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  const cargarReportes = async () => {
    try {
      setCargando(true);
      setError(null);
      const data = await reporteService.getReportes();
      setReportes(data);
    } catch (err) {
      setError('Error al cargar los reportes. Por favor, intente nuevamente.');
      console.error('Error:', err);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarReportes();
  }, []);

  const abrirDialogoEdicion = (reporte: Reporte) => {
    setEditandoReporte(reporte._id);
    setNuevoReporte({
      resumenFeedback: reporte.resumenFeedback,
      categoria: reporte.categoria,
      seccion: reporte.seccion,
      estado: reporte.estado,
      departamentoAsignado: reporte.departamentoAsignado,
      resumenResolucion: reporte.resumenResolucion,
      usuarioNotificado: reporte.usuarioNotificado,
    });
  };

  const manejarEnvio = async () => {
    try {
      if (!nuevoReporte.resumenFeedback || !nuevoReporte.categoria || !nuevoReporte.seccion || !nuevoReporte.departamentoAsignado) {
        setError('Por favor, complete todos los campos requeridos');
        return;
      }

      if (editandoReporte) {
        // Actualizar reporte existente
        await reporteService.actualizarReporte(editandoReporte, nuevoReporte);
      } else {
        // Crear nuevo reporte
        const reporteParaEnviar = {
          resumenFeedback: nuevoReporte.resumenFeedback,
          categoria: nuevoReporte.categoria,
          seccion: nuevoReporte.seccion,
          estado: 'Abierto',
          departamentoAsignado: nuevoReporte.departamentoAsignado,
          resumenResolucion: nuevoReporte.resumenResolucion || 'Pendiente de revisión',
          usuarioNotificado: false
        };
        await reporteService.crearReporte(reporteParaEnviar);
      }

      await cargarReportes();
    } catch (err: any) {
      setError(err.message || 'Error al procesar el reporte');
    }
  };

  const cerrarDialogo = () => {
    setEditandoReporte(null);
    setNuevoReporte({
      resumenFeedback: '',
      categoria: '',
      seccion: '',
      estado: 'Abierto',
      departamentoAsignado: '',
      resumenResolucion: '',
      usuarioNotificado: false,
    });
  };

  const abrirDialogoCrear = () => {
    setNuevoReporte({
      resumenFeedback: '',
      categoria: '',
      seccion: '',
      estado: 'Abierto',
      departamentoAsignado: '',
      resumenResolucion: '',
      usuarioNotificado: false,
    });
  };

  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case 'Abierto':
        return <Clock />;
      case 'En Progreso':
        return <Clock />;
      case 'Resuelto':
        return <CheckCircle2 />;
      default:
        return null;
    }
  };

  const handleSubmit = manejarEnvio;

  const reportesFiltrados = reportes.filter(reporte => {
    const categoriaMatch = filtroCategoria === '' || reporte.categoria === filtroCategoria;
    const seccionMatch = filtroSeccion === '' || reporte.seccion === filtroSeccion;
    const estadoMatch = filtroEstado === '' || reporte.estado === filtroEstado;
    const textoMatch = reporte.resumenFeedback.toLowerCase().includes(filtro.toLowerCase());
    return categoriaMatch && seccionMatch && estadoMatch && textoMatch;
  });

  return (
    <div className={`container mx-auto px-4 py-6 min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-2">
          <BarChart3 className={`h-6 w-6 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`} />
          <h1 className={`text-2xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Gestión de Reportes</h1>
        </div>
        <Button
          variant="create"
          onClick={abrirDialogoCrear}
          className="flex items-center"
        >
          <Plus className="h-5 w-5 mr-2" />
          Nuevo Reporte
        </Button>
      </div>

      <div className={`rounded-lg shadow-md p-6 mb-6 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div className="flex items-center space-x-4 w-full md:w-auto">
            <div className="relative flex-1 md:flex-none md:min-w-[300px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar reportes..."
                value={filtro}
                onChange={(e) => setFiltro(e.target.value)}
                className="pl-10 pr-4 py-2 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <Button
              variant="filter"
              onClick={() => setMostrarFiltros(!mostrarFiltros)}
              className="flex items-center"
            >
              <Filter className="h-5 w-5 mr-2" />
              Filtros
            </Button>
          </div>
          
          {mostrarFiltros && (
            <div className="flex flex-wrap gap-4 w-full md:w-auto">
              <select
                value={filtroCategoria}
                onChange={(e) => setFiltroCategoria(e.target.value)}
                className="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Todas las categorías</option>
                {categorias.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <select
                value={filtroSeccion}
                onChange={(e) => setFiltroSeccion(e.target.value)}
                className="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Todas las secciones</option>
                {secciones.map((sec) => (
                  <option key={sec} value={sec}>{sec}</option>
                ))}
              </select>
              <select
                value={filtroEstado}
                onChange={(e) => setFiltroEstado(e.target.value)}
                className="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Todos los estados</option>
                {estados.map((est) => (
                  <option key={est} value={est}>{est}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        {cargando ? (
          <div className="flex justify-center items-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4 mb-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700 dark:text-red-200">{error}</p>
              </div>
            </div>
          </div>
        ) : (
          <Table
            headers={[
              'ID',
              'Fecha',
              'Categoría',
              'Sección',
              'Estado',
              'Departamento',
              'Resumen',
              'Acciones'
            ]}
            data={reportesFiltrados.map((reporte) => ({
              id: reporte._id,
              fecha: reporte.fechaCreacion ? format(new Date(reporte.fechaCreacion), 'dd/MM/yyyy HH:mm', { locale: es }) : 'Fecha no disponible',
              categoria: reporte.categoria,                          seccion: reporte.seccion,
              estado: reporte.estado,
              departamento: reporte.departamentoAsignado,
              resumen: reporte.resumenFeedback,
              acciones: (
                <div className="flex space-x-2">
                  <Button
                    variant="normal"
                    onClick={() => abrirDialogoEdicion(reporte)}
                    className="p-2"
                  >
                    Editar
                  </Button>
                </div>
              ),
            }))}
          />
        )}
      </div>

      {editandoReporte && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75 dark:bg-gray-900 dark:opacity-75"></div>
            </div>

            <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                      Editar Reporte
                    </h3>
                    <div className="mt-4 space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Resumen del Feedback
                        </label>
                        <textarea
                          value={nuevoReporte.resumenFeedback}
                          onChange={(e) => setNuevoReporte({ ...nuevoReporte, resumenFeedback: e.target.value })}
                          className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          rows={3}
                        />
                      </div>

                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Categoría
                          </label>
                          <select
                            value={nuevoReporte.categoria}
                            onChange={(e) => setNuevoReporte({ ...nuevoReporte, categoria: e.target.value })}
                            className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="">Seleccionar categoría</option>
                            {categorias.map((cat) => (
                              <option key={cat} value={cat}>{cat}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Sección
                          </label>
                          <select
                            value={nuevoReporte.seccion}
                            onChange={(e) => setNuevoReporte({ ...nuevoReporte, seccion: e.target.value })}
                            className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="">Seleccionar sección</option>
                            {secciones.map((sec) => (
                              <option key={sec} value={sec}>{sec}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Estado
                          </label>
                          <select
                            value={nuevoReporte.estado}
                            onChange={(e) => setNuevoReporte({ ...nuevoReporte, estado: e.target.value })}
                            className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            {estados.map((est) => (
                              <option key={est} value={est}>{est}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Departamento Asignado
                          </label>
                          <select
                            value={nuevoReporte.departamentoAsignado}
                            onChange={(e) => setNuevoReporte({ ...nuevoReporte, departamentoAsignado: e.target.value })}
                            className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="">Seleccionar departamento</option>
                            {departamentos.map((dep) => (
                              <option key={dep} value={dep}>{dep}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <Button
                  variant="create"
                  onClick={handleSubmit}
                  className="w-full sm:w-auto sm:ml-3"
                >
                  Guardar Cambios
                </Button>
                <Button
                  variant="normal"
                  onClick={cerrarDialogo}
                  className="mt-3 w-full sm:w-auto sm:mt-0"
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reportesweb;
