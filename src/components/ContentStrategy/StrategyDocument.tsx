import React, { useState } from 'react';
import { FileText, Download, Share2, Save } from 'lucide-react';

interface Platform {
  name: string;
  contentTypes: string[];
  postingFrequency: string;
}

interface ContentIdea {
  title: string;
  description: string;
  platform: string;
  type: string;
}

interface CalendarItem {
  date: string;
  platform: string;
  content: string;
}

interface StrategyDocumentProps {
  clientName: string;
  date: string;
  executiveSummary: string;
  businessGoals: string[];
  targetAudience: string;
  platforms: Platform[];
  contentIdeas: ContentIdea[];
  calendarItems: CalendarItem[];
  recommendations: string[];
  onSave?: () => void;
  onExport?: () => void;
}

const StrategyDocument: React.FC<StrategyDocumentProps> = ({
  clientName = 'ada',
  date = new Date().toLocaleDateString(),
  executiveSummary = 'This content strategy has been developed specifically for ada to help achieve the business goals through targeted content marketing across Instagram, Facebook, YouTube, Twitter, LinkedIn, Blog, Podcast, Newsletter. The strategy focuses on engaging audiences with valuable, relevant content.',
  businessGoals = ['Increase brand awareness', 'Generate leads', 'Establish thought leadership'],
  targetAudience = 'Fitness enthusiasts aged 25-45 who are looking for personalized coaching and nutrition advice.',
  platforms = [
    { name: 'Instagram', contentTypes: ['carousel', 'reel'], postingFrequency: '3x per week' },
    { name: 'Facebook', contentTypes: ['post'], postingFrequency: '2x per month' },
    { name: 'YouTube', contentTypes: ['video'], postingFrequency: '1x per week' },
    { name: 'Twitter', contentTypes: ['tweet'], postingFrequency: '2x per month' },
    { name: 'LinkedIn', contentTypes: ['post'], postingFrequency: '2x per month' },
    { name: 'Blog', contentTypes: ['article'], postingFrequency: '2x per month' },
    { name: 'Podcast', contentTypes: ['episode'], postingFrequency: '2x per month' },
    { name: 'Newsletter', contentTypes: ['email'], postingFrequency: '2x per month' }
  ],
  contentIdeas = [
    {
      title: 'Client Success Story',
      description: 'Share a transformation story of one of your clients with before/after results.',
      platform: 'Instagram',
      type: 'carousel'
    },
    {
      title: 'Quick Workout Tips',
      description: 'Create a short video demonstrating 3 quick exercises that can be done anywhere.',
      platform: 'Instagram',
      type: 'reel'
    }
  ],
  calendarItems = [
    { date: '2023-06-01', platform: 'Instagram', content: 'Quick Workout Tips' },
    { date: '2023-06-05', platform: 'YouTube', content: 'Full Body Workout for Busy Moms' },
    { date: '2023-06-10', platform: 'Blog', content: 'Nutrition Tips for Energy Throughout the Day' }
  ],
  recommendations = ['Maintain consistent branding across all platforms', 'Engage with audience comments regularly', 'Analyze performance metrics monthly and adjust strategy as needed'],
  onSave,
  onExport
}) => {
  const [activeTab, setActiveTab] = useState<'preview' | 'edit' | 'customize'>('preview');
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
  };

  return (
    <div className="w-full bg-gray-50 rounded-lg shadow-sm">
      <div className="flex justify-between items-center p-4 border-b">
        <h1 className="text-xl font-bold">Strategy Document</h1>
        <div className="flex space-x-2">
          <div className="relative">
            <select 
              className="appearance-none bg-white border border-gray-300 rounded-md py-1 pl-3 pr-8 text-sm"
              defaultValue="PDF Document"
            >
              <option>PDF Document</option>
              <option>Word Document</option>
              <option>Google Doc</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
          <button 
            onClick={onExport}
            className="flex items-center gap-1 px-3 py-1 bg-white border border-gray-300 rounded-md text-sm hover:bg-gray-50"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
          <button className="flex items-center gap-1 px-3 py-1 bg-white border border-gray-300 rounded-md text-sm hover:bg-gray-50">
            <Share2 className="w-4 h-4" />
            Share
          </button>
          <button 
            onClick={onSave}
            className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
          >
            <Save className="w-4 h-4" />
            Save
          </button>
        </div>
      </div>
      
      <div className="border-b">
        <div className="flex">
          <button
            className={`px-4 py-2 text-sm font-medium flex items-center gap-1 ${
              activeTab === 'preview' 
                ? 'border-b-2 border-blue-500 text-blue-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('preview')}
          >
            <FileText className="w-4 h-4" />
            Preview
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium flex items-center gap-1 ${
              activeTab === 'edit' 
                ? 'border-b-2 border-blue-500 text-blue-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('edit')}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium flex items-center gap-1 ${
              activeTab === 'customize' 
                ? 'border-b-2 border-blue-500 text-blue-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('customize')}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
            Customize
          </button>
        </div>
      </div>
      
      <div className="p-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white p-6 rounded-lg mb-8">
            <h1 className="text-2xl font-bold mb-1">Content Strategy Plan - {clientName}</h1>
            <p className="text-sm opacity-80">Prepared for: {clientName} | {date}</p>
          </div>
          
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4 border-b pb-2">Executive Summary</h2>
            <p className="text-gray-700">{executiveSummary}</p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4 border-b pb-2">Business Goals</h2>
            <ul className="list-disc pl-5 space-y-1">
              {businessGoals.map((goal, index) => (
                <li key={index} className="text-gray-700">{goal}</li>
              ))}
            </ul>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4 border-b pb-2">Target Audience</h2>
            <p className="text-gray-700">{targetAudience}</p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4 border-b pb-2">Platform Strategy</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {platforms.map((platform, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-2">{platform.name}</h3>
                  <div className="text-sm text-gray-600">
                    <div className="mb-1">
                      <span className="font-medium">Content Types:</span> {platform.contentTypes.join(', ')}
                    </div>
                    <div>
                      <span className="font-medium">Posting Frequency:</span> {platform.postingFrequency}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4 border-b pb-2">Content Ideas</h2>
            <div className="space-y-4">
              {contentIdeas.map((idea, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold">{idea.title}</h3>
                    <span className="text-sm bg-gray-100 px-2 py-1 rounded">{idea.platform}</span>
                  </div>
                  <p className="text-gray-600 text-sm mt-2">{idea.description}</p>
                  <div className="mt-2">
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      Type: {idea.type}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4 border-b pb-2">Editorial Calendar</h2>
            <table className="min-w-full border">
              <thead>
                <tr className="bg-gray-50">
                  <th className="py-2 px-4 border text-left text-sm font-medium text-gray-500">DATE</th>
                  <th className="py-2 px-4 border text-left text-sm font-medium text-gray-500">PLATFORM</th>
                  <th className="py-2 px-4 border text-left text-sm font-medium text-gray-500">CONTENT</th>
                </tr>
              </thead>
              <tbody>
                {calendarItems.map((item, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-2 px-4 border text-sm">{formatDate(item.date)}</td>
                    <td className="py-2 px-4 border text-sm">{item.platform}</td>
                    <td className="py-2 px-4 border text-sm">{item.content}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4 border-b pb-2">Recommendations</h2>
            <ul className="list-disc pl-5 space-y-1">
              {recommendations.map((recommendation, index) => (
                <li key={index} className="text-gray-700">{recommendation}</li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};

export default StrategyDocument;