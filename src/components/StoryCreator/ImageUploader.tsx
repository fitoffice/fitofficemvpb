import React, { useRef } from 'react';
import { useTheme } from '../../contexts/ThemeContext';

interface ImageUploaderProps {
  onImageSelect: (file: File) => void;
  loading?: boolean;
  children?: React.ReactNode;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelect, loading, children }) => {
  const { theme } = useTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      onImageSelect(file);
    }
  };

  const handleClick = () => {
    if (!loading) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`cursor-pointer w-full h-full flex items-center justify-center ${
        loading ? 'opacity-50 cursor-not-allowed' : ''
      }`}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
        disabled={loading}
      />
      {children}
    </div>
  );
};

export default ImageUploader;
