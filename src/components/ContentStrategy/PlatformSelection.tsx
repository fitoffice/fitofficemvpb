import React, { useState } from 'react';
import { Instagram, Facebook, Youtube, Twitter, Linkedin, FileText, Mic, Mail } from 'lucide-react';

interface Platform {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
}

interface PlatformSelectionProps {
  onSave: (selectedPlatforms: string[]) => void;
  initialSelected?: string[];
}

const PlatformSelection: React.FC<PlatformSelectionProps> = ({ 
  onSave, 
  initialSelected = [] 
}) => {
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(initialSelected);

  const platforms: Platform[] = [
    {
      id: 'instagram',
      name: 'Instagram',
      description: 'Visual content platform ideal for coaches sharing inspirational content and short tutorials.',
      icon: <Instagram className="w-6 h-6" />
    },
    {
      id: 'facebook',
      name: 'Facebook',
      description: 'Community-building platform for longer posts, events, and group discussions.',
      icon: <Facebook className="w-6 h-6" />
    },
    {
      id: 'youtube',
      name: 'YouTube',
      description: 'Video platform for in-depth tutorials, client testimonials, and longer educational content.',
      icon: <Youtube className="w-6 h-6" />
    },
    {
      id: 'twitter',
      name: 'Twitter',
      description: 'Quick updates, industry news, and engagement with your audience through short messages.',
      icon: <Twitter className="w-6 h-6" />
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      description: 'Professional network for establishing authority, sharing articles, and connecting with clients.',
      icon: <Linkedin className="w-6 h-6" />
    },
    {
      id: 'blog',
      name: 'Blog',
      description: 'Your own platform for publishing in-depth articles, guides, and establishing thought leadership.',
      icon: <FileText className="w-6 h-6" />
    },
    {
      id: 'podcast',
      name: 'Podcast',
      description: 'Audio content for interviews, deep discussions, and building an engaged listener community.',
      icon: <Mic className="w-6 h-6" />
    },
    {
      id: 'newsletter',
      name: 'Newsletter',
      description: 'Direct communication channel to deliver valuable content straight to your audience's inbox.',
      icon: <Mail className="w-6 h-6" />
    }
  ];

  const togglePlatform = (platformId: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(platformId)
        ? prev.filter(id => id !== platformId)
        : [...prev, platformId]
    );
  };

  const handleSave = () => {
    onSave(selectedPlatforms);
  };

  return (
    <div className="w-full">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Select Your Content Platforms</h1>
        <p className="text-gray-600 mt-2">
          Choose the platforms where you want to create and distribute your content. Your strategy will be tailored based on your selections.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {platforms.map((platform) => (
          <div 
            key={platform.id}
            className="bg-white rounded-lg border-2 transition-all duration-200 overflow-hidden hover:shadow-md"
            style={{ 
              borderColor: selectedPlatforms.includes(platform.id) ? '#3b82f6' : '#e5e7eb'
            }}
          >
            <div className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  {React.cloneElement(platform.icon as React.ReactElement, { 
                    className: `w-6 h-6 ${selectedPlatforms.includes(platform.id) ? 'text-blue-500' : 'text-gray-500'}`
                  })}
                  <span className="ml-2 font-medium">{platform.name}</span>
                </div>
                <div 
                  className="w-5 h-5 border rounded flex items-center justify-center cursor-pointer"
                  style={{ 
                    borderColor: selectedPlatforms.includes(platform.id) ? '#3b82f6' : '#d1d5db',
                    backgroundColor: selectedPlatforms.includes(platform.id) ? '#3b82f6' : 'transparent'
                  }}
                  onClick={() => togglePlatform(platform.id)}
                >
                  {selectedPlatforms.includes(platform.id) && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </div>
              <p className="text-sm text-gray-600">{platform.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          {selectedPlatforms.length} platforms selected
          {selectedPlatforms.length === 0 && (
            <p className="text-orange-500 mt-1">Please select at least one platform to continue</p>
          )}
        </div>
        <div className="flex gap-3">
          <button
            className="px-6 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all duration-200"
          >
            Back
          </button>
          <button
            onClick={handleSave}
            disabled={selectedPlatforms.length === 0}
            className={`px-6 py-2 rounded-lg transition-all duration-200 ${
              selectedPlatforms.length > 0 
                ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600' 
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            Save & Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlatformSelection;