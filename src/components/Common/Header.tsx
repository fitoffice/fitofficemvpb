import React, { useState, useEffect } from 'react';
import { User, Bell, Search, Dumbbell } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Header: React.FC = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleProfileClick = () => {
    navigate('/profile');
  };

  return (
    <header className={`${
      theme === 'dark'
        ? 'bg-gradient-to-r from-indigo-950 via-violet-950 to-purple-950 border-b border-indigo-400/20'
        : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 border-b border-white/10'
    } shadow-xl backdrop-blur-sm transition-all duration-300 sticky top-0 z-50`}>
      {/* Animated top border glow */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 animate-gradient-x"></div>
      
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo Section with enhanced animation */}
          <div className="flex items-center gap-4">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 rounded-lg opacity-30 group-hover:opacity-70 blur-md transition duration-300 group-hover:duration-200 animate-tilt"></div>
              <div className={`relative p-2.5 rounded-lg transition-all duration-300 ${
                theme === 'dark'
                  ? 'bg-indigo-900/50 hover:bg-indigo-800/60'
                  : 'bg-white/20 hover:bg-white/30'
              } hover:scale-110 backdrop-blur-sm`}>
                <Dumbbell className={`w-6 h-6 ${
                  theme === 'dark' ? 'text-cyan-400' : 'text-white'
                } group-hover:rotate-12 transition-all duration-300`} />
              </div>
            </div>
            <div>
              <h1 className={`text-xl font-bold ${
                theme === 'dark' ? 'text-gradient-purple-cyan' : 'text-white'
              } tracking-tight`}>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400">
                  FitOffice
                </span>
              </h1>
              <p className={`text-xs font-medium ${
                theme === 'dark' ? 'text-indigo-300/80' : 'text-white/90'
              }`}>
                Gestión Profesional
              </p>
            </div>
          </div>

          {/* Profile Button with enhanced styling */}
          <button
            onClick={handleProfileClick}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
              theme === 'dark'
                ? 'bg-indigo-900/40 hover:bg-indigo-800/60 text-indigo-300'
                : 'bg-white/15 hover:bg-white/25 text-white'
            } hover:shadow-lg hover:shadow-purple-500/20 hover:scale-105 backdrop-blur-sm border border-transparent hover:border-purple-500/30`}
          >
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full opacity-0 group-hover:opacity-70 blur-sm transition duration-300 group-hover:duration-200"></div>
              <User className="w-5 h-5" />
            </div>
            <span className="text-sm font-medium hidden sm:block">
              {user?.name || user?.email || 'Usuario'}
            </span>
          </button>
        </div>
      </div>
      
      {/* Animated bottom border glow */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-purple-500 via-cyan-400 to-pink-500 animate-gradient-x"></div>
    </header>
  );
};

export default Header;