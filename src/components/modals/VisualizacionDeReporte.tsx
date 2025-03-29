import React, { useEffect, useState } from 'react';
import { X, FileText, Calendar, User, DollarSign, ShoppingBag } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../Common/Button';
import jsPDF from 'jspdf';

interface ReporteDetallado {
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
  resultados?: {
    metricas: {
      totalGastos?: number;
      totalIngresos?: number;
      totalClientes?: number;
      totalServicios?: number;
    };
    resumenEjecutivo: string;
    analisisGastos?: string;
    analisisIngresos?: string;
    analisisClientes?: string;
    analisisServicios?: string;
    recomendaciones: string[];
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
}

interface VisualizacionDeReporteProps {
  isOpen: boolean;
  onClose: () => void;
  reporte: {
    id: string;
    titulo: string;
    fecha: string;
    tipo: string;
    estado: string;
    campos?: {
      clientes: boolean;
      ingresos: boolean;
      gastos: boolean;
      servicios: boolean;
    };
  };
  reporteId: string; 
}

const VisualizacionDeReporte: React.FC<VisualizacionDeReporteProps> = ({ isOpen, onClose, reporte, reporteId }) => {
  const { theme } = useTheme();
  const [reporteDetallado, setReporteDetallado] = useState<ReporteDetallado | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReporteDetallado = async () => {
      try {
        setLoading(true);
        
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No se encontró el token de autenticación');
        }

        console.log('Obteniendo detalles del reporte con ID:', reporteId);
        
        const response = await fetch(`https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/reports/${reporteId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Error al cargar los detalles del reporte');
        }

        const data = await response.json();
        console.log('Datos detallados del reporte:', data);
        setReporteDetallado(data);
        setLoading(false);
      } catch (error) {
        console.error('Error al obtener detalles del reporte:', error);
        setError(error instanceof Error ? error.message : 'Error al cargar los detalles del reporte');
        setLoading(false);
      }
    };

    if (isOpen && reporteId) {
      fetchReporteDetallado();
    }
  }, [isOpen, reporteId]);
  const generatePDF = () => {
    if (!reporteDetallado) return;
    
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
    doc.text(reporteDetallado.nombre, pageWidth / 2, 35, { align: 'center' });
    
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
    doc.text(`Fecha: ${new Date(reporteDetallado.createdAt).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })}`, margin + 10, yPosition + 20);
    
    doc.text(`Tipo: ${reporteDetallado.frecuencia === 'mes' ? 'Mensual' : 
              reporteDetallado.frecuencia === 'trimestre' ? 'Trimestral' : 'Anual'}`, margin + 10, yPosition + 27);
    
    // Add status with colored indicator
    const estadoText = `Estado: ${reporteDetallado.estado === 'completado' ? 'Generado' : 
              reporteDetallado.estado === 'pendiente' ? 'Pendiente' : 'En Proceso'}`;
    
    doc.text(estadoText, margin + 10, yPosition + 34);
    
    // Add status indicator
    if (reporteDetallado.estado === 'completado') {
      doc.setFillColor(39, 174, 96);
    } else if (reporteDetallado.estado === 'pendiente') {
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
    if (reporteDetallado.campos.clientes) campos.push('Clientes');
    if (reporteDetallado.campos.ingresos) campos.push('Ingresos');
    if (reporteDetallado.campos.gastos) campos.push('Gastos');
    if (reporteDetallado.campos.servicios) campos.push('Servicios');
    
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
    if (reporteDetallado.resultados?.resumenEjecutivo) {
      doc.setFillColor(240, 242, 255);
      doc.roundedRect(margin, yPosition, pageWidth - (margin * 2), 5, 3, 3, 'F');
      
      doc.setTextColor(40, 44, 52);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text("Resumen Ejecutivo", margin + 5, yPosition + 10);
      
      // Calculate height needed for text
      const resumenLines = doc.splitTextToSize(
        reporteDetallado.resultados.resumenEjecutivo, 
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
    if (reporteDetallado.resultados?.metricas) {
      doc.setFillColor(240, 242, 255);
      doc.roundedRect(margin, yPosition, pageWidth - (margin * 2), 50, 3, 3, 'F');
      
      doc.setTextColor(40, 44, 52);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text("Métricas Clave", margin + 5, yPosition + 10);
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      
      const { metricas } = reporteDetallado.resultados;
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
    if (reporteDetallado.resultados?.analisisGastos) {
      // Calculate height needed for text
      const analisisLines = doc.splitTextToSize(
        reporteDetallado.resultados.analisisGastos, 
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
    if (reporteDetallado.resultados?.recomendaciones?.length) {
      doc.setFillColor(240, 242, 255);
      
      // Calculate total height needed
      let totalRecomHeight = 20; // Initial height for title
      
      reporteDetallado.resultados.recomendaciones.forEach((recomendacion) => {
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
      
      reporteDetallado.resultados.recomendaciones.forEach((recomendacion, index) => {
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
    doc.save(`reporte-${reporteDetallado.nombre}-${new Date().toISOString().split('T')[0]}.pdf`);
  };
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={`w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden ${
              theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
            }`}
          >
            {/* Header */}
            <div className={`px-6 py-4 flex justify-between items-center border-b ${
              theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
            }`}>
              <h2 className="text-xl font-bold flex items-center">
                <FileText className="mr-2" />
                Visualización de Reporte
              </h2>
              <button
                onClick={onClose}
                className={`p-2 rounded-full hover:bg-opacity-10 transition-colors ${
                  theme === 'dark' ? 'hover:bg-gray-300' : 'hover:bg-gray-500'
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 max-h-[70vh] overflow-y-auto">
              {loading ? (
                <div className="flex justify-center items-center h-40">
                  <p>Cargando detalles del reporte...</p>
                </div>
              ) : error ? (
                <div className="text-red-500 text-center p-4">
                  <p>{error}</p>
                </div>
              ) : reporteDetallado ? (
                <>
                                    {/* Encabezado del reporte con diseño mejorado */}
                                    <div className={`mb-8 ${
                    theme === 'dark' ? 'bg-gradient-to-r from-blue-900/30 to-purple-900/20' : 'bg-gradient-to-r from-blue-50 to-indigo-50'
                  } p-6 rounded-xl shadow-sm border-l-4 ${
                    theme === 'dark' ? 'border-blue-500' : 'border-blue-500'
                  }`}>
                    <h3 className={`text-2xl font-bold mb-3 ${
                      theme === 'dark' ? 'text-blue-300' : 'text-blue-700'
                    }`}>
                      {reporteDetallado.nombre}
                    </h3>
                    <div className="flex flex-wrap items-center text-sm gap-3">
                      <div className={`flex items-center px-3 py-2 rounded-lg ${
                        theme === 'dark' ? 'bg-gray-800/70' : 'bg-white/80'
                      } shadow-sm`}>
                        <Calendar className={`w-4 h-4 mr-2 ${
                          theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                        }`} />
                        <span>
                          {new Date(reporteDetallado.createdAt).toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                      <span className={`px-4 py-2 rounded-lg text-xs font-medium flex items-center ${
                        theme === 'dark' ? 'shadow-inner' : 'shadow-sm'
                      } ${
                        reporteDetallado.frecuencia === 'mes' 
                          ? theme === 'dark' ? 'bg-purple-900/40 text-purple-300 border border-purple-700/30' : 'bg-purple-100 text-purple-800 border border-purple-200' 
                          : reporteDetallado.frecuencia === 'trimestre' 
                            ? theme === 'dark' ? 'bg-blue-900/40 text-blue-300 border border-blue-700/30' : 'bg-blue-100 text-blue-800 border border-blue-200'
                            : theme === 'dark' ? 'bg-indigo-900/40 text-indigo-300 border border-indigo-700/30' : 'bg-indigo-100 text-indigo-800 border border-indigo-200'
                      }`}>
                        <Calendar className="w-3.5 h-3.5 mr-1.5" />
                        {reporteDetallado.frecuencia === 'mes' ? 'Mensual' : 
                         reporteDetallado.frecuencia === 'trimestre' ? 'Trimestral' : 'Anual'}
                      </span>
                      <span className={`px-4 py-2 rounded-lg text-xs font-medium flex items-center ${
                        theme === 'dark' ? 'shadow-inner' : 'shadow-sm'
                      } ${
                        reporteDetallado.estado === 'completado' 
                          ? theme === 'dark' ? 'bg-green-900/40 text-green-300 border border-green-700/30' : 'bg-green-100 text-green-800 border border-green-200'
                          : reporteDetallado.estado === 'pendiente' 
                            ? theme === 'dark' ? 'bg-yellow-900/40 text-yellow-300 border border-yellow-700/30' : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                            : theme === 'dark' ? 'bg-blue-900/40 text-blue-300 border border-blue-700/30' : 'bg-blue-100 text-blue-800 border border-blue-200'
                      }`}>
                        <div className={`w-2 h-2 rounded-full mr-2 ${
                          reporteDetallado.estado === 'completado' 
                            ? 'bg-green-400 animate-pulse' 
                            : reporteDetallado.estado === 'pendiente' 
                              ? 'bg-yellow-400' 
                              : 'bg-blue-400'
                        }`}></div>
                        {reporteDetallado.estado === 'completado' ? 'Generado' : 
                         reporteDetallado.estado === 'pendiente' ? 'Pendiente' : 'En Proceso'}
                      </span>
                    </div>
                  </div>

                  {/* Campos incluidos con diseño de tarjetas mejorado */}
                  <div className="mb-8">
                    <h4 className={`font-bold text-lg mb-4 flex items-center ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      <FileText className="w-5 h-5 mr-2" />
                      Campos incluidos en el reporte
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className={`flex items-center p-4 rounded-xl transition-all duration-200 ${
                        reporteDetallado.campos.clientes 
                          ? theme === 'dark' 
                            ? 'bg-gradient-to-br from-blue-900/40 to-blue-800/20 border border-blue-700/30 shadow-md shadow-blue-900/10' 
                            : 'bg-gradient-to-br from-blue-50 to-blue-100/50 border border-blue-200 shadow-sm hover:shadow-md'
                          : theme === 'dark' 
                            ? 'bg-gray-800/50 border border-gray-700/50 opacity-60' 
                            : 'bg-gray-100 border border-gray-200 opacity-60'
                      } ${reporteDetallado.campos.clientes ? 'hover:scale-102 transform' : ''}`}>
                        <div className={`p-3 rounded-full mr-4 ${
                          reporteDetallado.campos.clientes 
                            ? theme === 'dark' ? 'bg-blue-900/50' : 'bg-blue-100' 
                            : theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
                        }`}>
                          <User className={`w-6 h-6 ${
                            reporteDetallado.campos.clientes 
                              ? theme === 'dark' ? 'text-blue-300' : 'text-blue-600' 
                              : theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                          }`} />
                        </div>
                        <div className="flex-1">
                          <h5 className={`font-semibold ${
                            reporteDetallado.campos.clientes 
                              ? theme === 'dark' ? 'text-blue-300' : 'text-blue-700' 
                              : theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                          }`}>Clientes</h5>
                          <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                            {reporteDetallado.campos.clientes ? 'Datos de clientes incluidos en el análisis' : 'No incluido en este reporte'}
                          </p>
                        </div>
                        {reporteDetallado.campos.clientes && (
                          <span className={`ml-auto px-2 py-1 text-xs font-medium rounded-md ${
                            theme === 'dark' ? 'bg-blue-900/60 text-blue-300' : 'bg-blue-100 text-blue-700'
                          }`}>
                            Incluido
                          </span>
                        )}
                      </div>
                      
                      <div className={`flex items-center p-4 rounded-xl transition-all duration-200 ${
                        reporteDetallado.campos.ingresos 
                          ? theme === 'dark' 
                            ? 'bg-gradient-to-br from-green-900/40 to-green-800/20 border border-green-700/30 shadow-md shadow-green-900/10' 
                            : 'bg-gradient-to-br from-green-50 to-green-100/50 border border-green-200 shadow-sm hover:shadow-md'
                          : theme === 'dark' 
                            ? 'bg-gray-800/50 border border-gray-700/50 opacity-60' 
                            : 'bg-gray-100 border border-gray-200 opacity-60'
                      } ${reporteDetallado.campos.ingresos ? 'hover:scale-102 transform' : ''}`}>
                        <div className={`p-3 rounded-full mr-4 ${
                          reporteDetallado.campos.ingresos 
                            ? theme === 'dark' ? 'bg-green-900/50' : 'bg-green-100' 
                            : theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
                        }`}>
                          <DollarSign className={`w-6 h-6 ${
                            reporteDetallado.campos.ingresos 
                              ? theme === 'dark' ? 'text-green-300' : 'text-green-600' 
                              : theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                          }`} />
                        </div>
                        <div className="flex-1">
                          <h5 className={`font-semibold ${
                            reporteDetallado.campos.ingresos 
                              ? theme === 'dark' ? 'text-green-300' : 'text-green-700' 
                              : theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                          }`}>Ingresos</h5>
                          <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                            {reporteDetallado.campos.ingresos ? 'Datos de ingresos incluidos en el análisis' : 'No incluido en este reporte'}
                          </p>
                        </div>
                        {reporteDetallado.campos.ingresos && (
                          <span className={`ml-auto px-2 py-1 text-xs font-medium rounded-md ${
                            theme === 'dark' ? 'bg-green-900/60 text-green-300' : 'bg-green-100 text-green-700'
                          }`}>
                            Incluido
                          </span>
                        )}
                      </div>
                      
                      <div className={`flex items-center p-4 rounded-xl transition-all duration-200 ${
                        reporteDetallado.campos.gastos 
                          ? theme === 'dark' 
                            ? 'bg-gradient-to-br from-red-900/40 to-red-800/20 border border-red-700/30 shadow-md shadow-red-900/10' 
                            : 'bg-gradient-to-br from-red-50 to-red-100/50 border border-red-200 shadow-sm hover:shadow-md'
                          : theme === 'dark' 
                            ? 'bg-gray-800/50 border border-gray-700/50 opacity-60' 
                            : 'bg-gray-100 border border-gray-200 opacity-60'
                      } ${reporteDetallado.campos.gastos ? 'hover:scale-102 transform' : ''}`}>
                        <div className={`p-3 rounded-full mr-4 ${
                          reporteDetallado.campos.gastos 
                            ? theme === 'dark' ? 'bg-red-900/50' : 'bg-red-100' 
                            : theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
                        }`}>
                          <DollarSign className={`w-6 h-6 ${
                            reporteDetallado.campos.gastos 
                              ? theme === 'dark' ? 'text-red-300' : 'text-red-600' 
                              : theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                          }`} />
                        </div>
                        <div className="flex-1">
                          <h5 className={`font-semibold ${
                            reporteDetallado.campos.gastos 
                              ? theme === 'dark' ? 'text-red-300' : 'text-red-700' 
                              : theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                          }`}>Gastos</h5>
                          <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                            {reporteDetallado.campos.gastos ? 'Datos de gastos incluidos en el análisis' : 'No incluido en este reporte'}
                          </p>
                        </div>
                        {reporteDetallado.campos.gastos && (
                          <span className={`ml-auto px-2 py-1 text-xs font-medium rounded-md ${
                            theme === 'dark' ? 'bg-red-900/60 text-red-300' : 'bg-red-100 text-red-700'
                          }`}>
                            Incluido
                          </span>
                        )}
                      </div>
                      
                      <div className={`flex items-center p-4 rounded-xl transition-all duration-200 ${
                        reporteDetallado.campos.servicios 
                          ? theme === 'dark' 
                            ? 'bg-gradient-to-br from-purple-900/40 to-purple-800/20 border border-purple-700/30 shadow-md shadow-purple-900/10' 
                            : 'bg-gradient-to-br from-purple-50 to-purple-100/50 border border-purple-200 shadow-sm hover:shadow-md'
                          : theme === 'dark' 
                            ? 'bg-gray-800/50 border border-gray-700/50 opacity-60' 
                            : 'bg-gray-100 border border-gray-200 opacity-60'
                      } ${reporteDetallado.campos.servicios ? 'hover:scale-102 transform' : ''}`}>
                        <div className={`p-3 rounded-full mr-4 ${
                          reporteDetallado.campos.servicios 
                            ? theme === 'dark' ? 'bg-purple-900/50' : 'bg-purple-100' 
                            : theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
                        }`}>
                          <ShoppingBag className={`w-6 h-6 ${
                            reporteDetallado.campos.servicios 
                              ? theme === 'dark' ? 'text-purple-300' : 'text-purple-600' 
                              : theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                          }`} />
                        </div>
                        <div className="flex-1">
                          <h5 className={`font-semibold ${
                            reporteDetallado.campos.servicios 
                              ? theme === 'dark' ? 'text-purple-300' : 'text-purple-700' 
                              : theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                          }`}>Servicios</h5>
                          <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                            {reporteDetallado.campos.servicios ? 'Datos de servicios incluidos en el análisis' : 'No incluido en este reporte'}
                          </p>
                        </div>
                        {reporteDetallado.campos.servicios && (
                          <span className={`ml-auto px-2 py-1 text-xs font-medium rounded-md ${
                            theme === 'dark' ? 'bg-purple-900/60 text-purple-300' : 'bg-purple-100 text-purple-700'
                          }`}>
                            Incluido
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  {/* Contenido del reporte */}
                  {reporteDetallado.resultados && (
                    <div className={`p-6 rounded-xl border shadow-sm mb-6 ${
                      theme === 'dark' ? 'border-gray-700 bg-gray-800/50 backdrop-blur-sm' : 'border-gray-200 bg-white'
                    }`}>
                      {/* Resumen Ejecutivo con diseño mejorado */}
                      <div className={`mb-8 ${
                        theme === 'dark' ? 'bg-gray-900/70' : 'bg-blue-50'
                      } p-5 rounded-lg border-l-4 ${
                        theme === 'dark' ? 'border-blue-500' : 'border-blue-500'
                      }`}>
                        <h4 className={`font-bold mb-3 text-lg flex items-center ${
                          theme === 'dark' ? 'text-blue-400' : 'text-blue-700'
                        }`}>
                          <FileText className="w-5 h-5 mr-2" />
                          Resumen Ejecutivo
                        </h4>
                        <p className="text-sm leading-relaxed italic">
                          {reporteDetallado.resultados.resumenEjecutivo}
                        </p>
                      </div>

                      {/* Métricas con diseño de tarjetas mejorado */}
                      {reporteDetallado.resultados.metricas && (
                        <div className="mb-8">
                          <h4 className={`font-bold mb-4 text-lg flex items-center ${
                            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                          }`}>
                            <DollarSign className="w-5 h-5 mr-2" />
                            Métricas Clave
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {reporteDetallado.resultados.metricas.totalGastos !== undefined && (
                              <div className={`p-5 rounded-lg border transition-all duration-200 transform hover:scale-105 ${
                                theme === 'dark' 
                                  ? 'bg-gradient-to-br from-red-900/30 to-red-800/10 border-red-800/50 hover:shadow-md hover:shadow-red-900/20' 
                                  : 'bg-gradient-to-br from-red-50 to-red-100/50 border-red-200 hover:shadow-md'
                              }`}>
                                <div className="flex justify-between items-start">
                                  <div>
                                    <p className="text-xs uppercase font-semibold mb-1 text-red-500">Total Gastos</p>
                                    <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-red-400' : 'text-red-600'}`}>
                                      ${reporteDetallado.resultados.metricas.totalGastos.toLocaleString()}
                                    </p>
                                  </div>
                                  <div className={`p-2 rounded-full ${
                                    theme === 'dark' ? 'bg-red-900/30' : 'bg-red-100'
                                  }`}>
                                    <DollarSign className={`w-5 h-5 ${theme === 'dark' ? 'text-red-400' : 'text-red-500'}`} />
                                  </div>
                                </div>
                              </div>
                            )}
                            {reporteDetallado.resultados.metricas.totalIngresos !== undefined && (
                              <div className={`p-5 rounded-lg border transition-all duration-200 transform hover:scale-105 ${
                                theme === 'dark' 
                                  ? 'bg-gradient-to-br from-green-900/30 to-green-800/10 border-green-800/50 hover:shadow-md hover:shadow-green-900/20' 
                                  : 'bg-gradient-to-br from-green-50 to-green-100/50 border-green-200 hover:shadow-md'
                              }`}>
                                <div className="flex justify-between items-start">
                                  <div>
                                    <p className="text-xs uppercase font-semibold mb-1 text-green-500">Total Ingresos</p>
                                    <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>
                                      ${reporteDetallado.resultados.metricas.totalIngresos.toLocaleString()}
                                    </p>
                                  </div>
                                  <div className={`p-2 rounded-full ${
                                    theme === 'dark' ? 'bg-green-900/30' : 'bg-green-100'
                                  }`}>
                                    <DollarSign className={`w-5 h-5 ${theme === 'dark' ? 'text-green-400' : 'text-green-500'}`} />
                                  </div>
                                </div>
                              </div>
                            )}
                            {reporteDetallado.resultados.metricas.totalClientes !== undefined && (
                              <div className={`p-5 rounded-lg border transition-all duration-200 transform hover:scale-105 ${
                                theme === 'dark' 
                                  ? 'bg-gradient-to-br from-blue-900/30 to-blue-800/10 border-blue-800/50 hover:shadow-md hover:shadow-blue-900/20' 
                                  : 'bg-gradient-to-br from-blue-50 to-blue-100/50 border-blue-200 hover:shadow-md'
                              }`}>
                                <div className="flex justify-between items-start">
                                  <div>
                                    <p className="text-xs uppercase font-semibold mb-1 text-blue-500">Total Clientes</p>
                                    <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>
                                      {reporteDetallado.resultados.metricas.totalClientes}
                                    </p>
                                  </div>
                                  <div className={`p-2 rounded-full ${
                                    theme === 'dark' ? 'bg-blue-900/30' : 'bg-blue-100'
                                  }`}>
                                    <User className={`w-5 h-5 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-500'}`} />
                                  </div>
                                </div>
                              </div>
                            )}
                            {reporteDetallado.resultados.metricas.totalServicios !== undefined && (
                              <div className={`p-5 rounded-lg border transition-all duration-200 transform hover:scale-105 ${
                                theme === 'dark' 
                                  ? 'bg-gradient-to-br from-purple-900/30 to-purple-800/10 border-purple-800/50 hover:shadow-md hover:shadow-purple-900/20' 
                                  : 'bg-gradient-to-br from-purple-50 to-purple-100/50 border-purple-200 hover:shadow-md'
                              }`}>
                                <div className="flex justify-between items-start">
                                  <div>
                                    <p className="text-xs uppercase font-semibold mb-1 text-purple-500">Total Servicios</p>
                                    <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`}>
                                      {reporteDetallado.resultados.metricas.totalServicios}
                                    </p>
                                  </div>
                                  <div className={`p-2 rounded-full ${
                                    theme === 'dark' ? 'bg-purple-900/30' : 'bg-purple-100'
                                  }`}>
                                    <ShoppingBag className={`w-5 h-5 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-500'}`} />
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Análisis específicos con diseño de acordeón */}
                      <div className="space-y-4 mb-8">
                        <h4 className={`font-bold mb-4 text-lg flex items-center ${
                          theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          <FileText className="w-5 h-5 mr-2" />
                          Análisis Detallado
                        </h4>
                        
                        {reporteDetallado.resultados.analisisGastos && (
                          <div className={`p-4 rounded-lg border ${
                            theme === 'dark' ? 'border-red-800/30 bg-red-900/10' : 'border-red-200 bg-red-50'
                          }`}>
                            <h5 className={`font-semibold mb-3 flex items-center ${theme === 'dark' ? 'text-red-400' : 'text-red-600'}`}>
                              <DollarSign className="w-4 h-4 mr-2" />
                              Análisis de Gastos
                            </h5>
                            <p className="text-sm leading-relaxed">
                              {reporteDetallado.resultados.analisisGastos}
                            </p>
                          </div>
                        )}

                        {reporteDetallado.resultados.analisisIngresos && (
                          <div className={`p-4 rounded-lg border ${
                            theme === 'dark' ? 'border-green-800/30 bg-green-900/10' : 'border-green-200 bg-green-50'
                          }`}>
                            <h5 className={`font-semibold mb-3 flex items-center ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>
                              <DollarSign className="w-4 h-4 mr-2" />
                              Análisis de Ingresos
                            </h5>
                            <p className="text-sm leading-relaxed">
                              {reporteDetallado.resultados.analisisIngresos}
                            </p>
                          </div>
                        )}

                        {reporteDetallado.resultados.analisisClientes && (
                          <div className={`p-4 rounded-lg border ${
                            theme === 'dark' ? 'border-blue-800/30 bg-blue-900/10' : 'border-blue-200 bg-blue-50'
                          }`}>
                            <h5 className={`font-semibold mb-3 flex items-center ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>
                              <User className="w-4 h-4 mr-2" />
                              Análisis de Clientes
                            </h5>
                            <p className="text-sm leading-relaxed">
                              {reporteDetallado.resultados.analisisClientes}
                            </p>
                          </div>
                        )}

                        {reporteDetallado.resultados.analisisServicios && (
                          <div className={`p-4 rounded-lg border ${
                            theme === 'dark' ? 'border-purple-800/30 bg-purple-900/10' : 'border-purple-200 bg-purple-50'
                          }`}>
                            <h5 className={`font-semibold mb-3 flex items-center ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`}>
                              <ShoppingBag className="w-4 h-4 mr-2" />
                              Análisis de Servicios
                            </h5>
                            <p className="text-sm leading-relaxed">
                              {reporteDetallado.resultados.analisisServicios}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Recomendaciones con diseño de tarjetas */}
                      {reporteDetallado.resultados.recomendaciones && reporteDetallado.resultados.recomendaciones.length > 0 && (
                        <div className={`p-5 rounded-lg ${
                          theme === 'dark' ? 'bg-amber-900/10 border border-amber-800/30' : 'bg-amber-50 border border-amber-200'
                        }`}>
                          <h5 className={`font-bold mb-4 flex items-center ${theme === 'dark' ? 'text-amber-400' : 'text-amber-600'}`}>
                            <FileText className="w-5 h-5 mr-2" />
                            Recomendaciones
                          </h5>
                          <div className="space-y-3">
                            {reporteDetallado.resultados.recomendaciones.map((recomendacion, index) => (
                              <div key={index} className={`p-3 rounded-md flex items-start ${
                                theme === 'dark' ? 'bg-gray-800' : 'bg-white border border-amber-100'
                              }`}>
                                <span className={`flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full mr-3 text-xs font-bold ${
                                  theme === 'dark' ? 'bg-amber-900/50 text-amber-400' : 'bg-amber-100 text-amber-700'
                                }`}>
                                  {index + 1}
                                </span>
                                <p className="text-sm leading-relaxed">{recomendacion}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center p-4">
                  <p>No se pudieron cargar los detalles del reporte.</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className={`px-6 py-4 flex justify-end gap-3 border-t ${
              theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
            }`}>
              <Button variant="secondary" onClick={onClose}>
                Cerrar
              </Button>
              <Button 
                variant="primary" 
                onClick={generatePDF}
                disabled={!reporteDetallado || reporteDetallado.estado !== 'completado'}
              >
                Descargar PDF
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default VisualizacionDeReporte;