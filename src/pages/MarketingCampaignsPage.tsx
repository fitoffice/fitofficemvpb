import React from 'react';
import { CampaignOverview } from '../components/Marketing/CampaignOverview';
import { useTheme } from '../contexts/ThemeContext';

const MarketingCampaignsPage: React.FC = () => {
  const { theme } = useTheme();

  return (
    <div className={theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}>
      <CampaignOverview />
    </div>
  );
};

export default MarketingCampaignsPage;