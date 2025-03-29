import React, { useState } from 'react';
import { Calendar, DollarSign, Tag, FileText, Clock } from 'lucide-react';

interface GastoFormData {
  importe: number;
  moneda: string;
  fecha: string;
  descripcion: string;
  categoria: string;
  tipo: 'fijo' | 'variable';
}

interface GastoFormProps {
  onSubmit: (formData: GastoFormData) => void;
}

const GastoForm: React.FC<GastoFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<GastoFormData>({
    importe: 0,
    moneda: 'USD',
    fecha: new Date().toISOString().split('T')[0],
    descripcion: '',
    categoria: '',
    tipo: 'variable'
  });

  const [errors, setErrors] = useState<Partial<Record<keyof GastoFormData, string>>>({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof GastoFormData, string>> = {};

    if (formData.importe <= 0) {
      newErrors.importe = 'El importe debe ser mayor a 0';
    }

    if (!formData.moneda) {
      newErrors.moneda = 'La moneda es requerida';
    }

    if (!formData.fecha) {
      newErrors.fecha = 'La fecha es requerida';
    }

    if (!formData.categoria) {
      newErrors.categoria = 'La categoría es requerida';
    }

    if (!formData.tipo) {
      newErrors.tipo = 'El tipo de gasto es requerido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    console.log('Iniciando envío del formulario con datos:', {
      importe: formData.importe,
      moneda: formData.moneda,
      fecha: formData.fecha,
      descripcion: formData.descripcion,
      categoria: formData.categoria,
      tipo: formData.tipo
    });

    try {
      const token = localStorage.getItem('token');
      console.log('Token obtenido:', token ? 'Token presente' : 'Token no encontrado');
      
      if (!token) {
        throw new Error('No se encontró el token de autenticación');
      }

      // Crear el objeto de datos según la estructura esperada por el backend
      const gastoData = {
        importe: Number(formData.importe),  
        moneda: formData.moneda,
        fecha: formData.fecha,
        descripcion: formData.descripcion,
        categoria: formData.categoria,
        tipo: formData.tipo
      };

      console.log('Datos preparados para enviar al backend:', gastoData);

      const response = await fetch('https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/gastos', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(gastoData)
      });

      console.log('Respuesta del servidor - Status:', response.status);
      
      const responseData = await response.json();
      console.log('Respuesta del servidor - Datos:', responseData);

      if (!response.ok) {
        console.error('Error en la respuesta del servidor:', {
          status: response.status,
          statusText: response.statusText,
          data: responseData
        });
        throw new Error(responseData.message || 'Error al crear el gasto');
      }

      console.log('Gasto creado exitosamente:', responseData);
      
      // Limpiar el formulario
      setFormData({
        importe: 0,
        moneda: 'USD',
        fecha: new Date().toISOString().split('T')[0],
        descripcion: '',
        categoria: '',
        tipo: 'variable'
      });

      // Notificar éxito
      if (onSubmit) {
        console.log('Llamando a onSubmit con los datos:', gastoData);
        onSubmit(gastoData);
      }
    } catch (err) {
      console.error('Error detallado durante el proceso:', err);
      setError(err instanceof Error ? err.message : 'Error al crear el gasto. Por favor, intente nuevamente.');
    } finally {
      setLoading(false);
      console.log('Proceso de envío finalizado');
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'importe' ? parseFloat(value) || 0 : value,
    }));

    if (errors[name as keyof GastoFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const inputClasses = (fieldName: keyof GastoFormData) =>
    `w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors
    ${errors[fieldName] ? 'border-red-500 bg-red-50' : 'border-gray-300'}`;

  const labelClasses = 'flex items-center gap-2 text-sm font-medium text-gray-700 mb-1';

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Importe y Moneda */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClasses}>
            <DollarSign className="w-4 h-4" />
            Importe
          </label>
          <input
            type="number"
            name="importe"
            value={formData.importe}
            onChange={handleChange}
            className={inputClasses('importe')}
            step="0.01"
            min="0"
          />
          {errors.importe && <p className="text-red-500 text-xs mt-1">{errors.importe}</p>}
        </div>
        <div>
          <label className={labelClasses}>
            <Tag className="w-4 h-4" />
            Moneda
          </label>
          <select
            name="moneda"
            value={formData.moneda}
            onChange={handleChange}
            className={inputClasses('moneda')}
          >
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="GBP">GBP</option>
          </select>
          {errors.moneda && <p className="text-red-500 text-xs mt-1">{errors.moneda}</p>}
        </div>
      </div>

      {/* Fecha */}
      <div>
        <label className={labelClasses}>
          <Calendar className="w-4 h-4" />
          Fecha
        </label>
        <input
          type="date"
          name="fecha"
          value={formData.fecha}
          onChange={handleChange}
          className={inputClasses('fecha')}
        />
        {errors.fecha && <p className="text-red-500 text-xs mt-1">{errors.fecha}</p>}
      </div>

      {/* Descripción */}
      <div>
        <label className={labelClasses}>
          <FileText className="w-4 h-4" />
          Descripción
        </label>
        <textarea
          name="descripcion"
          value={formData.descripcion}
          onChange={handleChange}
          className={inputClasses('descripcion')}
          rows={3}
        />
        {errors.descripcion && <p className="text-red-500 text-xs mt-1">{errors.descripcion}</p>}
      </div>

      {/* Categoría */}
      <div>
        <label className={labelClasses}>
          <Tag className="w-4 h-4" />
          Categoría
        </label>
        <select
          name="categoria"
          value={formData.categoria}
          onChange={handleChange}
          className={inputClasses('categoria')}
        >
          <option value="">Seleccione una categoría</option>
          <option value="Marketing">Marketing</option>
          <option value="Equipamiento">Equipamiento</option>
          <option value="Servicios">Servicios</option>
          <option value="Mantenimiento">Mantenimiento</option>
          <option value="Otros">Otros</option>
        </select>
        {errors.categoria && <p className="text-red-500 text-xs mt-1">{errors.categoria}</p>}
      </div>

      {/* Tipo de Gasto */}
      <div>
        <label className={labelClasses}>
          <Clock className="w-4 h-4" />
          Tipo de Gasto
        </label>
        <select
          name="tipo"
          value={formData.tipo}
          onChange={handleChange}
          className={inputClasses('tipo')}
        >
          <option value="fijo">Fijo</option>
          <option value="variable">Variable</option>
        </select>
        {errors.tipo && <p className="text-red-500 text-xs mt-1">{errors.tipo}</p>}
      </div>

      {error && (
        <p className="text-red-500 text-sm text-center">{error}</p>
      )}

      <button
        type="submit"
        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        disabled={loading}
      >
        {loading ? 'Cargando...' : 'Crear Gasto'}
      </button>
    </form>
  );
};

export default GastoForm;