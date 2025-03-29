import React, { ButtonHTMLAttributes } from 'react';
import { useTheme } from '../../contexts/ThemeContext';

type ButtonVariant = 'filter' | 'create' | 'normal' | 'danger' | 'warning' | 'success' | 'primary' | 'plain' | 'csv' | 'exportar' | 'vistas' | 'info' | 'secondary'| 'accent' | 'nature' | 'mainView';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ 
  variant = 'normal', 
  children, 
  className = '', 
  ...props 
}) => {
  const { theme } = useTheme();
  
  const baseStyles = 'px-4 py-2 rounded-md font-semibold transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const getVariantStyles = () => {
    const darkModeStyles = {
      filter: 'bg-gradient-to-r from-red-900 to-pink-900 hover:from-red-950 hover:to-pink-950 text-white focus:ring-pink-700',
      create: 'bg-gradient-to-r from-purple-900 to-indigo-900 hover:from-purple-950 hover:to-indigo-950 text-white focus:ring-purple-700',
      normal: 'bg-gradient-to-r from-blue-900 to-blue-800 hover:from-blue-950 hover:to-blue-900 text-white focus:ring-blue-700',
      danger: 'bg-gradient-to-r from-red-800 to-red-700 hover:from-red-900 hover:to-red-800 text-white focus:ring-red-600',
      warning: 'bg-gradient-to-r from-yellow-700 to-amber-700 hover:from-yellow-800 hover:to-amber-800 text-white focus:ring-yellow-600',
      success: 'bg-gradient-to-r from-green-800 to-emerald-800 hover:from-green-900 hover:to-emerald-900 text-white focus:ring-green-600',
      primary: 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white focus:ring-purple-500',
      plain: 'bg-white text-gray-800 border border-gray-200 hover:bg-gray-50 focus:ring-gray-200',
      csv: 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white focus:ring-green-400',
      exportar: 'bg-gradient-to-r from-cyan-700 to-blue-700 hover:from-cyan-800 hover:to-blue-800 text-white focus:ring-cyan-500',
      vistas: 'bg-gradient-to-r from-teal-800 to-cyan-800 hover:from-teal-900 hover:to-cyan-900 text-white focus:ring-teal-600',
      secondary: 'bg-gradient-to-r from-gray-700 to-slate-700 hover:from-gray-800 hover:to-slate-800 text-white focus:ring-gray-500',
    
      info: 'bg-gradient-to-r from-sky-700 to-blue-700 hover:from-sky-800 hover:to-blue-800 text-white focus:ring-sky-500',
      accent: 'bg-gradient-to-r from-lime-700 to-green-700 hover:from-lime-800 hover:to-green-800 text-white focus:ring-lime-500', 
      nature: 'bg-gradient-to-r from-emerald-700 to-teal-700 hover:from-emerald-800 hover:to-teal-800 text-white focus:ring-emerald-500',
      mainView: 'bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 focus:ring-purple-500 font-bold',
    };

    const lightModeStyles = {
      filter: 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white focus:ring-pink-400',
      create: 'bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white focus:ring-purple-400',
      normal: 'bg-gradient-to-r from-blue-500 to-blue-400 hover:from-blue-600 hover:to-blue-500 text-white focus:ring-blue-400',
      danger: 'bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white focus:ring-red-400',
      warning: 'bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-white focus:ring-yellow-400',
      success: 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white focus:ring-green-400',
      primary: 'bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white focus:ring-purple-400',
      plain: 'bg-gray-100 text-gray-800 border border-gray-300 hover:bg-gray-200 focus:ring-gray-300',
      csv: 'bg-gradient-to-r from-green-400 to-emerald-400 hover:from-green-500 hover:to-emerald-500 text-white focus:ring-green-300',
      exportar: 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white focus:ring-cyan-400',
      vistas: 'bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white focus:ring-teal-400',
      secondary: 'bg-gradient-to-r from-gray-500 to-slate-500 hover:from-gray-600 hover:to-slate-600 text-white focus:ring-gray-400',
      info: 'bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white focus:ring-sky-500',
      accent: 'bg-gradient-to-r from-fuchsia-600 to-pink-600 hover:from-fuchsia-700 hover:to-pink-700 text-white focus:ring-fuchsia-500',
          mainView: 'bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 focus:ring-purple-400 font-bold',

      nature: 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white focus:ring-emerald-400'
    };


    return theme === 'dark' ? darkModeStyles[variant] : lightModeStyles[variant];
  };

  const combinedClassName = `${baseStyles} ${getVariantStyles()} ${className}`;

  return (
    <button className={combinedClassName} {...props}>
      {children}
    </button>
  );
};

export default Button;