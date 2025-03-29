import React, { useState, useEffect } from 'react';
import { Search, Plus, Calendar, List, Grid, Instagram, Youtube, Music, Link, 
  BarChart2, Bell, X } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import NewPublicationModal from '../components/modals/NewPublicationModal';
import YouTubeModal from '../components/modals/YouTubeModal';
import InstagramModal from '../components/modals/InstagramModal';
import TikTokModal from '../components/modals/TikTokModal';
import GridView from '../components/views/GridView';
import ListView from '../components/views/ListView';
import CalendarView from '../components/views/CalendarView';
import { youtubeService } from '../services/youtubeService';
import { instagramService } from '../services/instagramService';
import toast from 'react-hot-toast';
import ContentPlanner from '../components/VideoTools/ContentPlanner';

const Publications: React.FC = () => {
  const { theme } = useTheme();
  const [view, setView] = useState('grid');
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isNewPublicationModalOpen, setIsNewPublicationModalOpen] = useState(false);
  const [isYouTubeModalOpen, setIsYouTubeModalOpen] = useState(false);
  const [isInstagramModalOpen, setIsInstagramModalOpen] = useState(false);
  const [isTikTokModalOpen, setIsTikTokModalOpen] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [showContentPlanner, setShowContentPlanner] = useState(false);
  const [socialAuthStatus, setSocialAuthStatus] = useState<{
    estado: string;
    autenticaciones: {
      google: { autenticado: boolean; googleId: string | null };
      instagram: { autenticado: boolean; instagramId: string | null };
    };
    mensaje: string;
  } | null>(null);

  const styles = {
    container: `p-8 min-h-screen relative ${
      theme === 'dark'
        ? 'bg-gradient-to-br from-gray-900 via-blue-900/20 to-gray-900'
        : 'bg-gradient-to-br from-blue-50 via-indigo-50/20 to-blue-50'
    }`,
    card: `${
      theme === 'dark' 
        ? 'bg-gray-800/90 border border-gray-700' 
        : 'bg-white/90 border border-gray-200'
    } rounded-xl shadow-lg p-6 mb-8 backdrop-blur-sm transition-all duration-300 hover:shadow-xl`,
    title: `text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`,
    searchContainer: `relative flex items-center w-full max-w-md`,
    searchInput: `
      w-full pl-10 pr-4 py-2 rounded-lg
      ${theme === 'dark' 
        ? 'bg-gray-700/50 border-gray-600 text-gray-200 placeholder-gray-400' 
        : 'bg-white/50 border-gray-300 text-gray-700 placeholder-gray-500'
      }
      border focus:ring-2 focus:ring-blue-500 focus:border-transparent
      transition-all duration-300
    `,
    viewButton: `
      px-4 py-2 rounded-lg transition-all duration-200
      flex items-center gap-2
      ${theme === 'dark'
        ? 'hover:bg-gray-700/70 text-gray-300 hover:text-white'
        : 'hover:bg-gray-100/70 text-gray-600 hover:text-gray-900'}
    `,
    activeViewButton: `
      px-4 py-2 rounded-lg
      flex items-center gap-2
      bg-blue-500 text-white
      hover:bg-blue-600
      transition-all duration-200
    `,
  };
  const token = localStorage.getItem('token');
  const handleYouTubeAuth = async () => {
    try {
      setIsAuthenticating(true);
      // Get the authorization URL from our local API endpoint
      const response = await fetch('https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/entrenadores/google/auth', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to get authorization URL');
      }
      
      const data = await response.json();
      // Open the authorization URL in a new window
      window.open(data.authUrl, '_blank', 'width=800,height=600');
    } catch (error) {
      toast.error('Error al obtener la URL de autorización de YouTube');
      console.error('Error getting YouTube auth URL:', error);
    } finally {
      setIsAuthenticating(false);
    }
  };
  useEffect(() => {
    const fetchSocialAuthStatus = async () => {
      try {
        console.log('Fetching social auth status...');
        const response = await fetch('https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/entrenadores/auth/social/status', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        console.log('Response status:', response.status);
        
        if (!response.ok) {
          throw new Error('Failed to fetch social authentication status');
        }
        
        const data = await response.json();
        console.log('Social auth status data:', data);
        setSocialAuthStatus(data);
      } catch (error) {
        console.error('Error details:', error);
        console.error('Error fetching social auth status:', error);
        toast.error('Error al obtener el estado de autenticación social');
      }
    };
    
    if (token) {
      console.log('Token found, initiating fetch...');
      fetchSocialAuthStatus();
    } else {
      console.log('No token found');
    }
  }, [token]);

  const handleInstagramAuth = async () => {
    try {
      setIsAuthenticating(true);
      const { url } = await instagramService.getAuthUrl();
      window.location.href = url;
    } catch (error) {
      toast.error('Error al obtener la URL de autorización de Instagram');
      console.error('Error getting Instagram auth URL:', error);
    } finally {
      setIsAuthenticating(false);
    }
  };

  const publications = [
    
  ];

  const getStatusBadge = (status: string) => {
    const badges = {
      scheduled: theme === 'dark' ? 'bg-yellow-800/30 text-yellow-300' : 'bg-yellow-100 text-yellow-800',
      published: theme === 'dark' ? 'bg-green-800/30 text-green-300' : 'bg-green-100 text-green-800',
      pending: theme === 'dark' ? 'bg-blue-800/30 text-blue-300' : 'bg-blue-100 text-blue-800'
    };
    const labels = {
      scheduled: 'Programada',
      published: 'Publicada',
      pending: 'En Cola'
    };
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${badges[status as keyof typeof badges]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  const filteredPublications = publications.filter(pub => {
    if (filter !== 'all' && pub.platform !== filter) return false;
    if (searchTerm && !pub.title.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const renderView = () => {
    switch (view) {
      case 'list':
        return <ListView publications={filteredPublications} getStatusBadge={getStatusBadge} />;
      case 'calendar':
        return <CalendarView publications={filteredPublications} />;
      default:
        return <GridView publications={filteredPublications} getStatusBadge={getStatusBadge} />;
    }
  };

  return (
    <div className={styles.container}>
      {/* Remove mx-auto to eliminate lateral margins */}
      <div className="max-w-full">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <div className="relative">
              <h1 className={`text-4xl font-extrabold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent tracking-tight`}>
                GESTIÓN DE PUBLICACIONES
              </h1>
              <div className={`absolute -bottom-2 left-0 w-full h-1.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-full opacity-60 animate-pulse`}></div>
            </div>
            <span className={`
              text-sm font-semibold
              bg-gradient-to-r from-blue-50 to-indigo-50 text-gray-700 border border-blue-100/50
              px-4 py-2 rounded-full
              flex items-center gap-2
              shadow-lg
              hover:shadow-xl
              transform hover:scale-105
              transition-all duration-300 ease-out
              animate-fadeIn
              relative
              overflow-hidden
              group
            `}>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
              <BarChart2 className="w-4 h-4 text-blue-600 animate-pulse transform group-hover:rotate-12 transition-all duration-300" />
              <span className="relative">Gestión de Publicaciones</span>
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {(!socialAuthStatus || !socialAuthStatus.autenticaciones.google.autenticado) && (
              <button
                onClick={handleYouTubeAuth}
                disabled={isAuthenticating}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                <Youtube size={20} />
                <span className="hidden sm:inline">Conectar YouTube</span>
                <Link size={16} className="ml-1" />
              </button>
            )}
            {(!socialAuthStatus || !socialAuthStatus.autenticaciones.instagram.autenticado) && (
              <button
                onClick={handleInstagramAuth}
                disabled={isAuthenticating}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white rounded-lg transition-colors"
              >
                <Instagram size={20} />
                <span className="hidden sm:inline">Conectar Instagram</span>
                <Link size={16} className="ml-1" />
              </button>
            )}
            {socialAuthStatus && socialAuthStatus.autenticaciones.google.autenticado && (
              <div className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg">
                <Youtube size={20} />
                <span className="hidden sm:inline">YouTube Conectado</span>
              </div>
            )}
            {socialAuthStatus && socialAuthStatus.autenticaciones.instagram.autenticado && (
              <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg">
                <Instagram size={20} />
                <span className="hidden sm:inline">Instagram Conectado</span>
              </div>
            )}
          </div>
        </div>
        
        <div className={styles.card}>
          <div className="flex flex-col space-y-6">
            {/* Search and View Controls */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className={styles.searchContainer}>
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Buscar publicaciones..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={styles.searchInput}
                />
              </div>
              
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setView('grid')}
                  className={view === 'grid' ? styles.activeViewButton : styles.viewButton}
                  title="Vista de cuadrícula"
                >
                  <Grid size={18} />
                  <span className="hidden sm:inline">Cuadrícula</span>
                </button>
                <button
                  onClick={() => setView('list')}
                  className={view === 'list' ? styles.activeViewButton : styles.viewButton}
                  title="Vista de lista"
                >
                  <List size={18} />
                  <span className="hidden sm:inline">Lista</span>
                </button>
                <button
                  onClick={() => setView('calendar')}
                  className={view === 'calendar' ? styles.activeViewButton : styles.viewButton}
                  title="Vista de calendario"
                >
                  <Calendar size={18} />
                  <span className="hidden sm:inline">Calendario</span>
                </button>
              </div>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
              <button
                className={`px-4 py-2 rounded-full transition-all duration-200 transform hover:scale-105 ${
                  filter === 'all'
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg'
                    : `${theme === 'dark' ? 'bg-gray-700/50 hover:bg-gray-600/50 text-gray-200' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`
                }`}
                onClick={() => setFilter('all')}
              >
                <div className="flex items-center gap-2">
                  <Bell size={16} className="animate-bounce" />
                  <span>Todas</span>
                </div>
              </button>
              <button
                className={`px-4 py-2 rounded-full transition-all duration-200 transform hover:scale-105 flex items-center gap-2 ${
                  filter === 'instagram'
                    ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg'
                    : `${theme === 'dark' ? 'bg-gray-700/50 hover:bg-gray-600/50 text-gray-200' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`
                }`}
                onClick={() => setFilter('instagram')}
              >
                <Instagram size={16} className={filter === 'instagram' ? 'animate-spin' : ''} />
                <span>Instagram</span>
              </button>
              <button
                className={`px-4 py-2 rounded-full transition-all duration-200 transform hover:scale-105 flex items-center gap-2 ${
                  filter === 'tiktok'
                    ? 'bg-gradient-to-r from-gray-800 to-black text-white shadow-lg'
                    : `${theme === 'dark' ? 'bg-gray-700/50 hover:bg-gray-600/50 text-gray-200' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`
                }`}
                onClick={() => setFilter('tiktok')}
              >
                <Music size={16} className={filter === 'tiktok' ? 'animate-bounce' : ''} />
                <span>TikTok</span>
              </button>
            </div>

            {/* Content Area */}
            <div className="min-h-[400px]">
              {filteredPublications.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-[400px] text-center">
                  <div className={`p-6 rounded-full ${theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-100/50'} mb-4`}>
                    <Bell size={40} className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
                  </div>
                  <h3 className={`text-xl font-semibold mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    No hay publicaciones
                  </h3>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                    No se encontraron publicaciones que coincidan con tus criterios de búsqueda
                  </p>
                  <button
                    onClick={() => setShowContentPlanner(true)}
                    className="mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center gap-2"
                  >
                    <Plus size={18} />
                    Crear nueva publicación
                  </button>
                </div>
              ) : (
                renderView()
              )}
            </div>
          </div>
        </div>

        {isNewPublicationModalOpen && (
          <NewPublicationModal onClose={() => setIsNewPublicationModalOpen(false)} />
        )}
        {isYouTubeModalOpen && (
          <YouTubeModal onClose={() => setIsYouTubeModalOpen(false)} />
        )}
        {isInstagramModalOpen && (
          <InstagramModal onClose={() => setIsInstagramModalOpen(false)} />
        )}
        {isTikTokModalOpen && (
          <TikTokModal onClose={() => setIsTikTokModalOpen(false)} />
        )}
        {showContentPlanner && (
          <div className="fixed inset-0 z-50 overflow-y-auto backdrop-blur-sm">
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
            <div className="flex items-center justify-center min-h-screen p-4">
              <div className="relative bg-white w-full max-w-7xl rounded-lg shadow-xl">
                <div className="flex justify-end p-4">
                  <button
                    onClick={() => setShowContentPlanner(false)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <div className="px-4 pb-4">
                  <ContentPlanner />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Publications;