import React, { useState } from 'react';
import { User, Target, Palette } from 'lucide-react';

interface ProfileSetupProps {
  onSave: (profileData: ProfileData) => void;
}

export interface ProfileData {
  coachInfo: {
    name: string;
    businessName: string;
    brandVoice: string;
  };
  audience: {
    targetAudience: string;
    contentGoals: string;
  };
  branding: {
    logoUrl: string;
    brandColors: string;
  };
}

const ProfileSetup: React.FC<ProfileSetupProps> = ({ onSave }) => {
  const [profileData, setProfileData] = useState<ProfileData>({
    coachInfo: {
      name: '',
      businessName: '',
      brandVoice: '',
    },
    audience: {
      targetAudience: '',
      contentGoals: '',
    },
    branding: {
      logoUrl: '',
      brandColors: '',
    }
  });

  const handleInputChange = (
    section: keyof ProfileData,
    field: string,
    value: string
  ) => {
    setProfileData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleSubmit = () => {
    onSave(profileData);
  };

  return (
    <div className="w-full">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Profile Setup</h1>
        <p className="text-gray-600 mt-2">
          Let's start by getting to know you and your coaching business better.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Coach Information */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <User className="w-5 h-5 text-blue-500" />
            <h3 className="text-xl font-semibold text-gray-800">
              Coach Information
            </h3>
          </div>
          <p className="text-gray-600 mb-4">Tell us about yourself and your coaching business</p>

          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-gray-700 font-medium mb-1">
                Your Name
              </label>
              <input
                type="text"
                id="name"
                placeholder="John Doe"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                value={profileData.coachInfo.name}
                onChange={(e) => handleInputChange('coachInfo', 'name', e.target.value)}
              />
              <p className="text-gray-500 text-sm mt-1">Your name as you want it to appear in your content strategy</p>
            </div>

            <div>
              <label htmlFor="businessName" className="block text-gray-700 font-medium mb-1">
                Business Name
              </label>
              <input
                type="text"
                id="businessName"
                placeholder="Elevate Coaching"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                value={profileData.coachInfo.businessName}
                onChange={(e) => handleInputChange('coachInfo', 'businessName', e.target.value)}
              />
              <p className="text-gray-500 text-sm mt-1">The name of your coaching business or brand</p>
            </div>

            <div>
              <label htmlFor="brandVoice" className="block text-gray-700 font-medium mb-1">
                Brand Voice
              </label>
              <input
                type="text"
                id="brandVoice"
                placeholder="Professional, Motivational, Friendly"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                value={profileData.coachInfo.brandVoice}
                onChange={(e) => handleInputChange('coachInfo', 'brandVoice', e.target.value)}
              />
              <p className="text-gray-500 text-sm mt-1">How would you describe your communication style?</p>
            </div>
          </div>
        </div>

        {/* Audience & Goals */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <Target className="w-5 h-5 text-blue-500" />
            <h3 className="text-xl font-semibold text-gray-800">
              Audience & Goals
            </h3>
          </div>
          <p className="text-gray-600 mb-4">Define who you're trying to reach and what you want to achieve</p>

          <div className="space-y-4">
            <div>
              <label htmlFor="targetAudience" className="block text-gray-700 font-medium mb-1">
                Target Audience
              </label>
              <textarea
                id="targetAudience"
                placeholder="Describe your ideal clients (age, interests, pain points, etc.)"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all min-h-[120px] resize-y"
                value={profileData.audience.targetAudience}
                onChange={(e) => handleInputChange('audience', 'targetAudience', e.target.value)}
              />
              <p className="text-gray-500 text-sm mt-1">The more specific you are, the better we can tailor your content strategy</p>
            </div>

            <div>
              <label htmlFor="contentGoals" className="block text-gray-700 font-medium mb-1">
                Content Goals
              </label>
              <textarea
                id="contentGoals"
                placeholder="What do you want to achieve with your content? (e.g., build authority, generate leads, etc.)"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all min-h-[120px] resize-y"
                value={profileData.audience.contentGoals}
                onChange={(e) => handleInputChange('audience', 'contentGoals', e.target.value)}
              />
              <p className="text-gray-500 text-sm mt-1">Your goals will help shape the content strategy recommendations</p>
            </div>
          </div>
        </div>
      </div>

      {/* Branding Elements */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mt-6">
        <div className="flex items-center gap-3 mb-4">
          <Palette className="w-5 h-5 text-blue-500" />
          <h3 className="text-xl font-semibold text-gray-800">
            Branding Elements
          </h3>
        </div>
        <p className="text-gray-600 mb-4">Add visual elements to personalize your content strategy (optional)</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="logoUrl" className="block text-gray-700 font-medium mb-1">
              Logo URL
            </label>
            <div className="flex">
              <input
                type="text"
                id="logoUrl"
                placeholder="https://your-logo-url.com/logo.png"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                value={profileData.branding.logoUrl}
                onChange={(e) => handleInputChange('branding', 'logoUrl', e.target.value)}
              />
              <button className="bg-gray-100 border border-gray-300 border-l-0 rounded-r-lg px-3 hover:bg-gray-200 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
              </button>
            </div>
            <p className="text-gray-500 text-sm mt-1">Provide a URL to your logo or upload one</p>
          </div>

          <div>
            <label htmlFor="brandColors" className="block text-gray-700 font-medium mb-1">
              Brand Colors
            </label>
            <input
              type="text"
              id="brandColors"
              placeholder="#4A90E2, #50E3C2, #F5A623"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              value={profileData.branding.brandColors}
              onChange={(e) => handleInputChange('branding', 'brandColors', e.target.value)}
            />
            <p className="text-gray-500 text-sm mt-1">Enter your brand colors as hex codes, separated by commas</p>
          </div>
        </div>
      </div>

      <div className="flex justify-end mt-8">
        <button
          onClick={handleSubmit}
          className="px-6 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 transition-all duration-200 font-medium"
        >
          Save & Continue
        </button>
      </div>
    </div>
  );
};

export default ProfileSetup;