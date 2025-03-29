import React, { useState } from 'react';
import { 
  Layout, 
  Edit, 
  Copy, 
  Trash2, 
  Plus, 
  Search, 
  Filter, 
  Grid, 
  List, 
  Eye, 
  Star,
  Sparkles,
  Mail,
  ShoppingCart,
  UserPlus,
  Users,
  Clock
} from 'lucide-react';

interface Template {
  id: string;
  name: string;
  category: 'newsletter' | 'promotional' | 'transactional' | 'onboarding';
  thumbnail: string;
  lastModified: string;
  usageCount: number;
  rating: number;
  tags: string[];
  responsive: boolean;
}

const templates: Template[] = [
  {
    id: '1',
    name: 'Newsletter Mensual Pro',
    category: 'newsletter',
    thumbnail: '/templates/newsletter-pro.jpg',
    lastModified: '2025-01-08',
    usageCount: 145,
    rating: 4.8,
    tags: ['Moderno', 'Responsive', 'Dark Mode'],
    responsive: true
  },
  {
    id: '2',
    name: 'Oferta Especial',
    category: 'promotional',
    thumbnail: '/templates/promo-special.jpg',
    lastModified: '2025-01-05',
    usageCount: 89,
    rating: 4.5,
    tags: ['Promoción', 'Ventas', 'Responsive'],
    responsive: true
  },
  {
    id: '3',
    name: 'Bienvenida Premium',
    category: 'onboarding',
    thumbnail: '/templates/welcome.jpg',
    lastModified: '2025-01-09',
    usageCount: 234,
    rating: 4.9,
    tags: ['Onboarding', 'Personalizable'],
    responsive: true
  },
  {
    id: '4',
    name: 'Confirmación de Pedido',
    category: 'transactional',
    thumbnail: '/templates/order-confirm.jpg',
    lastModified: '2025-01-07',
    usageCount: 567,
    rating: 4.7,
    tags: ['Transaccional', 'E-commerce'],
    responsive: true
  }
];

export function EmailTemplates() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [hoveredTemplate, setHoveredTemplate] = useState<string | null>(null);

  const categories = [
    { id: 'all', name: 'Todas', icon: <Layout className="w-4 h-4" /> },
    { id: 'newsletter', name: 'Newsletter', icon: <Mail className="w-4 h-4" /> },
    { id: 'promotional', name: 'Promocional', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'transactional', name: 'Transaccional', icon: <ShoppingCart className="w-4 h-4" /> },
    { id: 'onboarding', name: 'Onboarding', icon: <UserPlus className="w-4 h-4" /> }
  ];

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'newsletter':
        return 'bg-blue-100 text-blue-700';
      case 'promotional':
        return 'bg-purple-100 text-purple-700';
      case 'transactional':
        return 'bg-green-100 text-green-700';
      case 'onboarding':
        return 'bg-orange-100 text-orange-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl shadow-lg">
            <Layout className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-1">Plantillas de Email</h3>
            <p className="text-sm text-gray-500">Gestiona y personaliza tus plantillas de correo</p>
          </div>
        </div>
        <button className="px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center gap-2 font-medium">
          <Plus className="w-4 h-4" />
          <span>Nueva Plantilla</span>
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Buscar plantillas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
          />
        </div>
        <div className="flex gap-3">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 min-w-[160px]"
          >
            {categories.map(category => (
              <option key={category.id} value={category.id} className="py-2">
                {category.name}
              </option>
            ))}
          </select>
          <div className="flex bg-gray-50 border border-gray-200 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-all duration-300 ${
                viewMode === 'grid' 
                  ? 'bg-white shadow-sm text-indigo-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-all duration-300 ${
                viewMode === 'list' 
                  ? 'bg-white shadow-sm text-indigo-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <div
              key={template.id}
              className="group relative bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
              onMouseEnter={() => setHoveredTemplate(template.id)}
              onMouseLeave={() => setHoveredTemplate(null)}
            >
              <div className="relative aspect-[4/3] bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
                <img
                  src={template.thumbnail}
                  alt={template.name}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                />
                <div className={`absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between p-4`}>
                  <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <div className="flex items-center gap-2 text-white mb-2">
                      <Star className="w-4 h-4 fill-yellow-400 stroke-yellow-400" />
                      <span className="font-medium">{template.rating}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <button className="p-2 bg-white/90 rounded-lg hover:bg-white transition-colors">
                      <Eye className="w-4 h-4 text-gray-700" />
                    </button>
                    <button className="p-2 bg-white/90 rounded-lg hover:bg-white transition-colors">
                      <Edit className="w-4 h-4 text-gray-700" />
                    </button>
                    <button className="p-2 bg-white/90 rounded-lg hover:bg-white transition-colors">
                      <Copy className="w-4 h-4 text-gray-700" />
                    </button>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-gray-900">{template.name}</h4>
                  {template.responsive && (
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-100">
                      Responsive
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getCategoryColor(template.category)}`}>
                    {categories.find(c => c.id === template.category)?.name}
                  </span>
                  {template.tags.map((tag, index) => (
                    <span key={index} className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-50 text-gray-600">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {template.usageCount} usos
                  </span>
                  <span className="text-gray-500 flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {template.lastModified}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredTemplates.map((template) => (
            <div
              key={template.id}
              className="group flex items-center gap-6 p-4 bg-white border border-gray-200 rounded-xl hover:border-indigo-200 hover:shadow-lg transition-all duration-300"
            >
              <div className="w-32 h-24 rounded-lg overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
                <img
                  src={template.thumbnail}
                  alt={template.name}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">{template.name}</h4>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 text-yellow-500">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="text-sm font-medium">{template.rating}</span>
                      </div>
                      <span className="text-gray-400">•</span>
                      <span className="text-sm text-gray-500">{template.usageCount} usos</span>
                    </div>
                  </div>
                  {template.responsive && (
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-100">
                      Responsive
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getCategoryColor(template.category)}`}>
                    {categories.find(c => c.id === template.category)?.name}
                  </span>
                  {template.tags.map((tag, index) => (
                    <span key={index} className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-50 text-gray-600">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button className="p-2 hover:bg-gray-50 rounded-lg transition-colors tooltip" data-tip="Vista previa">
                  <Eye className="w-5 h-5 text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-50 rounded-lg transition-colors tooltip" data-tip="Editar">
                  <Edit className="w-5 h-5 text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-50 rounded-lg transition-colors tooltip" data-tip="Duplicar">
                  <Copy className="w-5 h-5 text-gray-600" />
                </button>
                <button className="p-2 hover:bg-red-50 rounded-lg transition-colors tooltip" data-tip="Eliminar">
                  <Trash2 className="w-5 h-5 text-red-500" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron plantillas</h3>
          <p className="text-gray-500">Intenta con otros términos de búsqueda o filtros</p>
        </div>
      )}
    </div>
  );
}
