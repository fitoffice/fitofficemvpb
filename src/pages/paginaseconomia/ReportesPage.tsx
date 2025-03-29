import React, { useState, useEffect } from 'react';
import Table from '../../components/Common/Table';
import Button from '../../components/Common/Button';
import { Download, FileText, Calendar, Search, Filter, Trash2, Eye } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { motion } from 'framer-motion';
import ReportesFilter, { FilterValues } from '../../components/Economics/Reportes/ReportesFilter';
import ReporteActualPopup from '../../components/modals/ReporteActualPopup';
import ReportePopup from '../../components/modals/ReportePopup';
import VisualizacionDeReporte from '../../components/modals/VisualizacionDeReporte';
import jsPDF from 'jspdf';

interface Reporte {
  id: string;
  titulo: string;
  fecha: string;
  tipo: 'Mensual' | 'Trimestral' | 'Anual';
  estado: 'Generado' | 'Pendiente' | 'En Proceso';
}
interface ApiResponse {
  total: number;
  totalPaginas: number;
  paginaActual: number;
  reportes: {
    campos: {
      clientes: boolean;
      ingresos: boolean;
      gastos: boolean;
      servicios: boolean;
    };
    elementosSeleccionados: {
      clientes: string[];
      ingresos: string[];
      gastos: string[];
      servicios: string[];
    };
    _id: string;
    nombre: string;
    frecuencia: string;
    fechaInicio: string | null;
    fechaFin: string | null;
    estado: string;
    entrenador: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
  }[];
}

const ReportesPage: React.FC = () => {
  const { theme } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [reportesData, setReportesData] = useState<Reporte[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilters, setActiveFilters] = useState<FilterValues>({
    tipo: [],
    fechaDesde: '',
    fechaHasta: '',
    estado: [],
  });
  const [showReporteActual, setShowReporteActual] = useState(false);
  const [showReporteRecurrente, setShowReporteRecurrente] = useState(false);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [paginaActual, setPaginaActual] = useState(1);
  const [selectedReporte, setSelectedReporte] = useState<Reporte | null>(null);
  const [showVisualizacion, setShowVisualizacion] = useState(false);

  const mapearFrecuenciaATipo = (frecuencia: string): 'Mensual' | 'Trimestral' | 'Anual' => {
    switch (frecuencia) {
      case 'mes':
        return 'Mensual';
      case 'trimestre':
        return 'Trimestral';
      case 'año':
        return 'Anual';
      default:
        return 'Mensual';
    }
  };
  const mapearEstado = (estado: string): 'Generado' | 'Pendiente' | 'En Proceso' => {
    switch (estado) {
      case 'completado':
        return 'Generado';
      case 'pendiente':
        return 'Pendiente';
      case 'en_proceso':
        return 'En Proceso';
      default:
        return 'Pendiente';
    }
  };
  useEffect(() => {
    const fetchReportes = async () => {
      try {
        setLoading(true);
        
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No se encontró el token de autenticación');
        }

        const response = await fetch(`https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/reports`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Error al cargar los reportes');
        }

        const data: ApiResponse = await response.json();
        
        // Log the raw data from API
        console.log('Datos recibidos de la API:', data);
        
        // Transformar los datos de la API al formato que espera la interfaz
        const reportesTransformados: Reporte[] = data.reportes.map(reporte => ({
          id: reporte._id, 
          titulo: reporte.nombre,
          fecha: reporte.createdAt,
          tipo: mapearFrecuenciaATipo(reporte.frecuencia),
          estado: mapearEstado(reporte.estado)
        }));

        // Log the transformed reports
        console.log('Reportes transformados:', reportesTransformados);

        setReportesData(reportesTransformados);
        setTotalPaginas(data.totalPaginas);
        setPaginaActual(data.paginaActual);
        setLoading(false);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Error al cargar los reportes');
        setLoading(false);
      }
    };

    fetchReportes();
  }, []);
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleApplyFilters = (filters: FilterValues) => {
    setActiveFilters(filters);
    console.log('Filtros aplicados:', filters);
  };
  const handleViewReport = (reporte: Reporte) => {
    setSelectedReporte(reporte);
    setShowVisualizacion(true);
  };

  const handleDeleteReport = async (id: number) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No se encontró el token de autenticación');
      }

      // Mock API call para eliminar el reporte
      const response = await fetch(`https://api.ejemplo.com/reportes/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Error al eliminar el reporte');
      }

      // Actualizar la lista de reportes después de eliminar
      setReportesData(prevReportes => prevReportes.filter(reporte => reporte.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar el reporte');
      console.error('Error deleting report:', err);
    }
  };

  const filteredReportes = reportesData.filter(reporte => {
    const matchesSearch = reporte.titulo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTipo = activeFilters.tipo.length === 0 || activeFilters.tipo.includes(reporte.tipo);
    const matchesEstado = activeFilters.estado.length === 0 || activeFilters.estado.includes(reporte.estado);
    const matchesFechaDesde = !activeFilters.fechaDesde || reporte.fecha >= activeFilters.fechaDesde;
    const matchesFechaHasta = !activeFilters.fechaHasta || reporte.fecha <= activeFilters.fechaHasta;

    return matchesSearch && matchesTipo && matchesEstado && matchesFechaDesde && matchesFechaHasta;
  });

  const getEstadoStyle = (estado: string) => {
    switch (estado) {
      case 'Generado':
        return 'bg-green-200 text-green-800';
      case 'Pendiente':
        return 'bg-yellow-200 text-yellow-800';
      case 'En Proceso':
        return 'bg-blue-200 text-blue-800';
      default:
        return 'bg-gray-200 text-gray-800';
    }
  };

  const getTipoStyle = (tipo: string) => {
    switch (tipo) {
      case 'Mensual':
        return 'bg-purple-200 text-purple-800';
      case 'Trimestral':
        return 'bg-blue-200 text-blue-800';
      case 'Anual':
        return 'bg-indigo-200 text-indigo-800';
      default:
        return 'bg-gray-200 text-gray-800';
    }
  };
  const handleDownloadReport = async (reporteId: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No se encontró el token de autenticación');
      }

      // First, fetch the report data
      const response = await fetch(`https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/reports/${reporteId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });

      if (!response.ok) {
        throw new Error('Error al obtener los datos del reporte');
      }

      const reportData = await response.json();
      console.log('Datos del reporte recibidos:', reportData);
      
      // Generate PDF using the report data
      await generateAndDownloadPDF(reportData, reporteId);
      
    } catch (error) {
      console.error('Error al descargar el reporte:', error);
      // Aquí podrías mostrar un mensaje de error al usuario
    }
  };

  // New function to generate and download PDF
  const generateAndDownloadPDF = async (reportData: any, reporteId: string) => {
    try {
      // Create a new PDF document using jsPDF
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 20;
      let yPosition = 20;
      const lineHeight = 7;
      
      // Add header with gradient background
      doc.setFillColor(41, 65, 171); // Blue gradient start
      doc.rect(0, 0, pageWidth, 40, 'F');
      doc.setFillColor(83, 82, 237); // Blue gradient end
      doc.rect(0, 20, pageWidth, 20, 'F');
      
      // Add logo or title
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(22);
      doc.setFont('helvetica', 'bold');
      doc.text("INFORME ECONÓMICO", pageWidth / 2, 25, { align: 'center' });
      
      // Add report title
      doc.setFontSize(16);
      doc.text(reportData.nombre, pageWidth / 2, 35, { align: 'center' });
      
      // Reset position after header
      yPosition = 60;
      
      // Add decorative line
      doc.setDrawColor(83, 82, 237);
      doc.setLineWidth(0.5);
      doc.line(margin, yPosition - 5, pageWidth - margin, yPosition - 5);
      
      // Basic information in a styled box
      doc.setFillColor(240, 242, 255);
      doc.roundedRect(margin, yPosition, pageWidth - (margin * 2), 35, 3, 3, 'F');
      
      doc.setTextColor(40, 44, 52);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text("Información General", margin + 5, yPosition + 10);
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.text(`Fecha: ${new Date(reportData.createdAt).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })}`, margin + 10, yPosition + 20);
      
      doc.text(`Tipo: ${reportData.frecuencia === 'mes' ? 'Mensual' : 
                reportData.frecuencia === 'trimestre' ? 'Trimestral' : 'Anual'}`, margin + 10, yPosition + 27);
      
      // Add status with colored indicator
      const estadoText = `Estado: ${reportData.estado === 'completado' ? 'Generado' : 
                reportData.estado === 'pendiente' ? 'Pendiente' : 'En Proceso'}`;
      
      doc.text(estadoText, margin + 10, yPosition + 34);
      
      // Add status indicator
      if (reportData.estado === 'completado') {
        doc.setFillColor(39, 174, 96);
      } else if (reportData.estado === 'pendiente') {
        doc.setFillColor(241, 196, 15);
      } else {
        doc.setFillColor(52, 152, 219);
      }
      
      doc.circle(margin + 100, yPosition + 33, 2, 'F');
      
      yPosition += 45;
      
      // Included fields with icons
      doc.setFillColor(240, 242, 255);
      doc.roundedRect(margin, yPosition, pageWidth - (margin * 2), 30, 3, 3, 'F');
      
      doc.setTextColor(40, 44, 52);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text("Campos incluidos", margin + 5, yPosition + 10);
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      
      const campos = [];
      if (reportData.campos.clientes) campos.push('Clientes');
      if (reportData.campos.ingresos) campos.push('Ingresos');
      if (reportData.campos.gastos) campos.push('Gastos');
      if (reportData.campos.servicios) campos.push('Servicios');
      
      // Display campos with colored bullets
      let xOffset = margin + 10;
      campos.forEach((campo, index) => {
        // Draw colored bullet
        switch(campo) {
          case 'Clientes':
            doc.setFillColor(52, 152, 219); // Blue
            break;
          case 'Ingresos':
            doc.setFillColor(39, 174, 96); // Green
            break;
          case 'Gastos':
            doc.setFillColor(231, 76, 60); // Red
            break;
          case 'Servicios':
            doc.setFillColor(155, 89, 182); // Purple
            break;
        }
        
        doc.circle(xOffset, yPosition + 20, 2, 'F');
        doc.text(campo, xOffset + 5, yPosition + 20);
        xOffset += 40;
      });
      
      if (campos.length === 0) {
        doc.text("Ninguno", margin + 10, yPosition + 20);
      }
      
      yPosition += 40;
      
      // Executive summary in a styled box
      if (reportData.resultados?.resumenEjecutivo) {
        doc.setFillColor(240, 242, 255);
        doc.roundedRect(margin, yPosition, pageWidth - (margin * 2), 5, 3, 3, 'F');
        
        doc.setTextColor(40, 44, 52);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text("Resumen Ejecutivo", margin + 5, yPosition + 10);
        
        // Calculate height needed for text
        const resumenLines = doc.splitTextToSize(
          reportData.resultados.resumenEjecutivo, 
          pageWidth - (margin * 2) - 10
        );
        
        const resumenHeight = resumenLines.length * 5 + 15;
        
        // Draw the box with the right height
        doc.setFillColor(240, 242, 255);
        doc.roundedRect(margin, yPosition, pageWidth - (margin * 2), resumenHeight, 3, 3, 'F');
        
        // Add title again (it was covered by the new rectangle)
        doc.setTextColor(40, 44, 52);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text("Resumen Ejecutivo", margin + 5, yPosition + 10);
        
        // Add content
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.text(resumenLines, margin + 5, yPosition + 20);
        
        yPosition += resumenHeight + 10;
      }
      
      // Check if we need a new page
      if (yPosition > pageHeight - 50) {
        doc.addPage();
        yPosition = 20;
      }
      
      // Metrics in a styled box with visual elements
      if (reportData.resultados?.metricas) {
        doc.setFillColor(240, 242, 255);
        doc.roundedRect(margin, yPosition, pageWidth - (margin * 2), 50, 3, 3, 'F');
        
        doc.setTextColor(40, 44, 52);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text("Métricas Clave", margin + 5, yPosition + 10);
        
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        
        const { metricas } = reportData.resultados;
        let metricYPos = yPosition + 20;
        
        if (metricas.totalGastos !== undefined) {
          // Draw small red indicator for expenses
          doc.setFillColor(231, 76, 60);
          doc.rect(margin + 5, metricYPos - 3, 3, 10, 'F');
          doc.text(`Total Gastos: $${metricas.totalGastos.toLocaleString()}`, margin + 15, metricYPos);
          metricYPos += lineHeight;
        }
        
        if (metricas.totalIngresos !== undefined) {
          // Draw small green indicator for income
          doc.setFillColor(39, 174, 96);
          doc.rect(margin + 5, metricYPos - 3, 3, 10, 'F');
          doc.text(`Total Ingresos: $${metricas.totalIngresos.toLocaleString()}`, margin + 15, metricYPos);
          metricYPos += lineHeight;
        }
        
        if (metricas.totalClientes !== undefined) {
          // Draw small blue indicator for clients
          doc.setFillColor(52, 152, 219);
          doc.rect(margin + 5, metricYPos - 3, 3, 10, 'F');
          doc.text(`Total Clientes: ${metricas.totalClientes}`, margin + 15, metricYPos);
          metricYPos += lineHeight;
        }
        
        if (metricas.totalServicios !== undefined) {
          // Draw small purple indicator for services
          doc.setFillColor(155, 89, 182);
          doc.rect(margin + 5, metricYPos - 3, 3, 10, 'F');
          doc.text(`Total Servicios: ${metricas.totalServicios}`, margin + 15, metricYPos);
          metricYPos += lineHeight;
        }
        
        yPosition += 60;
      }
      
      // Check if we need a new page
      if (yPosition > pageHeight - 100) {
        doc.addPage();
        yPosition = 20;
      }
      
      // Analysis section with styled box
      if (reportData.resultados?.analisisGastos) {
        // Calculate height needed for text
        const analisisLines = doc.splitTextToSize(
          reportData.resultados.analisisGastos, 
          pageWidth - (margin * 2) - 10
        );
        
        const analisisHeight = analisisLines.length * 5 + 15;
        
        doc.setFillColor(240, 242, 255);
        doc.roundedRect(margin, yPosition, pageWidth - (margin * 2), analisisHeight, 3, 3, 'F');
        
        doc.setTextColor(40, 44, 52);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text("Análisis de Gastos", margin + 5, yPosition + 10);
        
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.text(analisisLines, margin + 5, yPosition + 20);
        
        yPosition += analisisHeight + 10;
      }
      
      // Check if we need a new page
      if (yPosition > pageHeight - 100) {
        doc.addPage();
        yPosition = 20;
      }
      
      // Recommendations with styled numbered list
      if (reportData.resultados?.recomendaciones?.length) {
        doc.setFillColor(240, 242, 255);
        
        // Calculate total height needed
        let totalRecomHeight = 20; // Initial height for title
        
        reportData.resultados.recomendaciones.forEach((recomendacion: string) => {
          const recomLines = doc.splitTextToSize(recomendacion, pageWidth - (margin * 2) - 20);
          totalRecomHeight += recomLines.length * 5 + 5;
        });
        
        doc.roundedRect(margin, yPosition, pageWidth - (margin * 2), totalRecomHeight, 3, 3, 'F');
        
        doc.setTextColor(40, 44, 52);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text("Recomendaciones", margin + 5, yPosition + 10);
        
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        
        let recomYPos = yPosition + 20;
        
        reportData.resultados.recomendaciones.forEach((recomendacion: string, index: number) => {
          // Draw numbered circle
          doc.setFillColor(83, 82, 237);
          doc.circle(margin + 10, recomYPos, 5, 'F');
          
          // Add number
          doc.setTextColor(255, 255, 255);
          doc.setFont('helvetica', 'bold');
          doc.text((index + 1).toString(), margin + 10, recomYPos + 3, { align: 'center' });
          
          // Add recommendation text
          doc.setTextColor(40, 44, 52);
          doc.setFont('helvetica', 'normal');
          
          const recomLines = doc.splitTextToSize(recomendacion, pageWidth - (margin * 2) - 20);
          doc.text(recomLines, margin + 20, recomYPos);
          
          recomYPos += recomLines.length * 5 + 5;
        });
        
        yPosition += totalRecomHeight + 10;
      }
      
      // Add footer with page number
      const totalPages = doc.internal.getNumberOfPages();
      
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        
        // Add footer line
        doc.setDrawColor(83, 82, 237);
        doc.setLineWidth(0.5);
        doc.line(margin, pageHeight - 20, pageWidth - margin, pageHeight - 20);
        
        // Add page number
        doc.setTextColor(83, 82, 237);
        doc.setFontSize(10);
        doc.text(`Página ${i} de ${totalPages}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
        
        // Add date
        doc.text(
          `Generado el ${new Date().toLocaleDateString('es-ES')}`, 
          pageWidth - margin, 
          pageHeight - 10, 
          { align: 'right' }
        );
      }
      
      // Save the PDF with a meaningful name
      doc.save(`reporte-${reportData.nombre}-${new Date().toISOString().split('T')[0]}.pdf`);
      
    } catch (error) {
      console.error('Error al generar el PDF:', error);
      throw error;
    }
  };
    const handleSubmitReporteActual = (formData: any) => {
    console.log('Reporte actual submitted:', formData);
    setShowReporteActual(false);
  };

  const handleSubmitReporteRecurrente = (formData: any) => {
    console.log('Reporte recurrente submitted:', formData);
    setShowReporteRecurrente(false);
  };

  if (loading) {
    return (
      <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`min-h-screen p-8 pt-8 pb-8 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-800'}`}
    >
      <div className="w-full">
        <motion.h2 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
        >
          Reportes Detallados
        </motion.h2>
          <div className="text-center">Cargando...</div>
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`min-h-screen p-8 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-800'}`}
      >
        <div className="w-full">
        <motion.h2 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
          >
            Reportes Detallados
          </motion.h2>
          <div className="text-center text-red-500">{error}</div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`min-h-screen p-8 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-800'}`}
    >
        <div className="w-full">
        <motion.h2 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
        >
          Reportes Detallados
        </motion.h2>

        <div className="space-y-6 mb-8">
          {/* Top row - Action Buttons */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-wrap gap-4 justify-end"
          >
            <Button 
              variant="create" 
              onClick={() => setShowReporteRecurrente(true)}
              className="transform hover:scale-105 transition-transform duration-200"
            >
              <Calendar className="w-5 h-5 mr-2" />
              Generar Reporte Recurrente
            </Button>
            <Button 
              variant="create" 
              onClick={() => setShowReporteActual(true)}
              className="transform hover:scale-105 transition-transform duration-200"
            >
              <FileText className="w-5 h-5 mr-2" />
              Generar Reporte Actual
            </Button>
          </motion.div>

          {/* Bottom row - Search and Filter */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-wrap gap-4 items-center"
          >
            <div className="relative flex-1 min-w-[300px]">
              <input
                type="text"
                placeholder="Buscar reportes..."
                value={searchTerm}
                onChange={handleSearchChange}
                className={`w-full px-6 py-3 rounded-xl ${
                  theme === 'dark'
                    ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400'
                    : 'bg-white border-gray-200 text-gray-800 placeholder-gray-500'
                } border-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300`}
              />
              <Search className={`absolute right-4 top-3.5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
            </div>
            <div className="relative">
              <Button
                variant="filter"
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className={`transform hover:scale-105 transition-transform duration-200 ${isFilterOpen ? 'ring-2 ring-blue-500' : ''}`}
              >
                <Filter className="w-5 h-5" />
                <span className="ml-2">Filtros</span>
              </Button>
              <ReportesFilter
                isOpen={isFilterOpen}
                onClose={() => setIsFilterOpen(false)}
                onApplyFilters={handleApplyFilters}
              />
            </div>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className={`bg-${theme === 'dark' ? 'gray-800' : 'white'} rounded-2xl shadow-xl overflow-hidden border ${
            theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
          }`}
        >
               <Table
            headers={['Título', 'Fecha', 'Tipo', 'Estado', 'Acciones']}
            data={filteredReportes.map(reporte => ({
              Título: (
                <div className="flex items-center">
                  <FileText className={`w-5 h-5 mr-3 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} />
                  <span className="font-medium">{reporte.titulo}</span>
                </div>
              ),
              Fecha: (
                <div className="flex items-center">
                  <Calendar className={`w-4 h-4 mr-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`} />
                  <span>{new Date(reporte.fecha).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}</span>
                </div>
              ),
              Tipo: (
                <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${getTipoStyle(reporte.tipo)}`}>
                  {reporte.tipo}
                </span>
              ),
              Estado: (
                <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${getEstadoStyle(reporte.estado)}`}>
                  {reporte.estado}
                </span>
              ),
              Acciones: (
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleViewReport(reporte)}
                    className={`p-2 rounded-lg transition-all duration-200 hover:scale-105 ${
                      theme === 'dark'
                        ? 'text-blue-400 hover:bg-blue-900/20 hover:text-blue-300'
                        : 'text-blue-600 hover:bg-blue-50 hover:text-blue-700'
                    }`}
                    title="Ver reporte"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDownloadReport(reporte.id)}
                    className={`p-2 rounded-lg transition-all duration-200 hover:scale-105 ${
                      reporte.estado !== 'Generado'
                        ? 'opacity-50 cursor-not-allowed'
                        : theme === 'dark'
                          ? 'text-green-400 hover:bg-green-900/20 hover:text-green-300'
                          : 'text-green-600 hover:bg-green-50 hover:text-green-700'
                    }`}
                    disabled={reporte.estado !== 'Generado'}
                    title="Descargar PDF"
                  >
                    <Download className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm('¿Estás seguro de que deseas eliminar este reporte?')) {
                        handleDeleteReport(reporte.id);
                      }
                    }}
                    className={`p-2 rounded-lg transition-all duration-200 hover:scale-105 ${
                      theme === 'dark'
                        ? 'text-red-400 hover:bg-red-900/20 hover:text-red-300'
                        : 'text-red-600 hover:bg-red-50 hover:text-red-700'
                    }`}
                    title="Eliminar reporte"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>              )
            }))}
            variant={theme === 'dark' ? 'dark' : 'white'}
          />
        </motion.div>


        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-6 flex flex-wrap gap-4 justify-between items-center"
        >
          <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Mostrando {filteredReportes.length} de {reportesData.length} reportes
          </div>
          <div className="flex gap-3">
            <Button 
              variant="normal" 
              disabled
              className="px-4 py-2 rounded-lg transition-all duration-200"
            >
              Anterior
            </Button>
            <Button 
              variant="normal" 
              disabled
              className="px-4 py-2 rounded-lg transition-all duration-200"
            >
              Siguiente
            </Button>
          </div>
        </motion.div>
      </div>

      {showReporteActual && 
        <ReporteActualPopup 
          isOpen={showReporteActual}
          onClose={() => setShowReporteActual(false)}
          onSubmit={handleSubmitReporteActual}
        />
      }
      {showReporteRecurrente && 
        <ReportePopup 
          isOpen={showReporteRecurrente}
          onClose={() => setShowReporteRecurrente(false)}
          onSubmit={handleSubmitReporteRecurrente}
        />
      }
      {showVisualizacion && selectedReporte && 
        <VisualizacionDeReporte 
          isOpen={showVisualizacion}
          onClose={() => setShowVisualizacion(false)}
          reporte={selectedReporte}
          reporteId={selectedReporte.id} // Add this line to pass the ID
        />
      }
    </motion.div>
  );
};

export default ReportesPage;