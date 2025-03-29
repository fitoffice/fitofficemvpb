import React, { useState } from 'react';
import { X, Search, Calendar, Dumbbell, Gift, Star, Clock, Eye, Edit, ChevronRight, Filter, SortDesc } from 'lucide-react';
import { Template } from '../types/campaign';

interface Props {
  onClose: () => void;
  onSelect: (template: Template) => void;
}

const TEMPLATES = [
  {
    id: 't1',
    name: 'Recordatorio de Sesión',
    category: 'recordatorios',
    description: 'Plantilla para recordar a los clientes su próxima sesión de entrenamiento',
    thumbnail: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300',
    preview: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800',
    type: 'reminder',
    popularity: 95,
    lastUpdated: '2024-03-10'
  },
  {
    id: 't2',
    name: 'Consejos de Nutrición',
    category: 'consejos',
    description: 'Newsletter semanal con consejos de nutrición y recetas saludables',
    thumbnail: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=300',
    preview: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800',
    type: 'newsletter',
    popularity: 88,
    lastUpdated: '2024-03-08'
  },
  {
    id: 't3',
    name: 'Promoción Especial',
    category: 'promociones',
    description: 'Plantilla para ofertas especiales y descuentos exclusivos',
    thumbnail: 'https://images.unsplash.com/photo-1556742044-3c52d6e88c62?w=300',
    preview: 'https://images.unsplash.com/photo-1556742044-3c52d6e88c62?w=800',
    type: 'promotion',
    popularity: 92,
    lastUpdated: '2024-03-05'
  },
  {
    id: 't4',
    name: 'Felicitación de Cumpleaños',
    category: 'celebraciones',
    description: 'Email personalizado para felicitar a los clientes en su cumpleaños',
    thumbnail: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=300',
    preview: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=800',
    type: 'celebration',
    popularity: 85,
    lastUpdated: '2024-03-01'
  },
  {
    id: 't5',
    name: 'Motivación Personal',
    category: 'motivacion',
    description: 'Mensajes motivacionales para mantener a los clientes comprometidos',
    thumbnail: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=300',
    preview: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=800',
    type: 'motivation',
    popularity: 90,
    lastUpdated: '2024-02-28'
  },
  {
    id: 't6',
    name: 'Seguimiento Post-Entrenamiento',
    category: 'seguimiento',
    description: 'Email de seguimiento después de una sesión de entrenamiento',
    thumbnail: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=300',
    preview: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800',
    type: 'follow-up',
    popularity: 87,
    lastUpdated: '2024-02-25'
  }
];

const CATEGORIES = [
  { id: 'all', name: 'Todas', icon: Star },
  { id: 'recordatorios', name: 'Recordatorios', icon: Calendar },
  { id: 'consejos', name: 'Consejos', icon: Dumbbell },
  { id: 'promociones', name: 'Promociones', icon: Gift },
];

export function TemplateSelectionModal({ onClose, onSelect }: Props) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [sort, setSort] = useState<'recent' | 'popular'>('popular');
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const filteredTemplates = TEMPLATES
    .filter(template => 
      (category === 'all' || template.category === category) &&
      (template.name.toLowerCase().includes(search.toLowerCase()) ||
       template.description.toLowerCase().includes(search.toLowerCase()))
    )
    .sort((a, b) => {
      if (sort === 'recent') {
        return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
      }
      return b.popularity - a.popularity;
    });

  const handleSelect = (template: Template) => {
    setSelectedTemplate(template);
    onSelect(template);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl max-w-6xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Selecciona una Plantilla</h2>
              <p className="text-sm text-gray-600 mt-1">
                Elige una plantilla para tu campaña o automatización
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar plantillas..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-64"
                />
              </div>
              <div className="flex items-center gap-2">
                {CATEGORIES.map((cat) => {
                  const Icon = cat.icon;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setCategory(cat.id)}
                      className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                        category === cat.id
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {cat.name}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as 'recent' | 'popular')}
                className="border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="popular">Más Populares</option>
                <option value="recent">Más Recientes</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((template) => (
              <div
                key={template.id}
                className="group relative border rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300"
              >
                <div className="aspect-[4/3] relative">
                  <img
                    src={template.thumbnail}
                    alt={template.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 space-y-2">
                      <button
                        onClick={() => {
                          setSelectedTemplate(template);
                          setShowPreview(true);
                        }}
                        className="px-4 py-2 bg-white text-gray-900 rounded-lg flex items-center gap-2"
                      >
                        <Eye className="h-4 w-4" />
                        Vista Previa
                      </button>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full">
                      {template.category}
                    </span>
                    <div className="flex items-center text-amber-500">
                      <Star className="h-4 w-4 fill-current" />
                      <span className="text-xs ml-1">{template.popularity}%</span>
                    </div>
                  </div>
                  <h3 className="font-medium text-gray-900">{template.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{template.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 border-t border-gray-100">
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              onClick={() => selectedTemplate && handleSelect(selectedTemplate)}
              disabled={!selectedTemplate}
              className={`px-6 py-2 rounded-lg flex items-center gap-2 ${
                selectedTemplate
                  ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                  : 'bg-gray-200 text-gray-500 cursor-not-allowed'
              }`}
            >
              Seleccionar Plantilla
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {showPreview && selectedTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl max-w-5xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">
                  Vista Previa - {selectedTemplate.name}
                </h3>
                <button
                  onClick={() => setShowPreview(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="aspect-[16/9] rounded-xl overflow-hidden mb-6">
                <img
                  src={selectedTemplate.preview}
                  alt={selectedTemplate.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Detalles</h4>
                  <dl className="space-y-2">
                    <div className="flex justify-between">
                      <dt className="text-sm text-gray-600">Categoría:</dt>
                      <dd className="text-sm font-medium">{selectedTemplate.category}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-sm text-gray-600">Popularidad:</dt>
                      <dd className="text-sm font-medium">{selectedTemplate.popularity}%</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-sm text-gray-600">Última actualización:</dt>
                      <dd className="text-sm font-medium">
                        {new Date(selectedTemplate.lastUpdated).toLocaleDateString()}
                      </dd>
                    </div>
                  </dl>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Descripción</h4>
                  <p className="text-sm text-gray-600">{selectedTemplate.description}</p>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-100">
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowPreview(false)}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cerrar
                </button>
                <button
                  onClick={() => {
                    // Aquí iría la lógica para abrir el editor
                  }}
                  className="px-6 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 flex items-center gap-2"
                >
                  <Edit className="h-4 w-4" />
                  Personalizar
                </button>
                <button
                  onClick={() => {
                    handleSelect(selectedTemplate);
                    setShowPreview(false);
                  }}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2"
                >
                  Seleccionar
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}