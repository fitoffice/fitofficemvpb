import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Campaign } from '../components/Marketing/types';

interface EmailCampaignContextType {
  campaigns: Campaign[];
  addCampaign: (campaign: Campaign) => void;
  updateCampaign: (campaign: Campaign) => void;
  removeCampaign: (campaignId: string) => void;
}

const EmailCampaignContext = createContext<EmailCampaignContextType | undefined>(undefined);

export const useEmailCampaign = () => {
  const context = useContext(EmailCampaignContext);
  if (!context) {
    throw new Error('useEmailCampaign must be used within an EmailCampaignProvider');
  }
  console.log('useEmailCampaign hook called, current campaigns:', context.campaigns);
  return context;
};

interface EmailCampaignProviderProps {
  children: ReactNode;
}

export const EmailCampaignProvider: React.FC<EmailCampaignProviderProps> = ({ children }) => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  
  console.log('EmailCampaignProvider rendering, current campaigns:', campaigns);

  const addCampaign = (campaign: Campaign) => {
    console.log('addCampaign called with:', campaign);
    setCampaigns(prevCampaigns => {
      const newCampaigns = [...prevCampaigns, campaign];
      console.log('New campaigns state after addition:', newCampaigns);
      return newCampaigns;
    });
  };

  const updateCampaign = (updatedCampaign: Campaign) => {
    console.log('updateCampaign called with:', updatedCampaign);
    setCampaigns(prevCampaigns => {
      const newCampaigns = prevCampaigns.map(campaign => 
        campaign._id === updatedCampaign._id ? updatedCampaign : campaign
      );
      console.log('New campaigns state after update:', newCampaigns);
      return newCampaigns;
    });
  };

  const removeCampaign = (campaignId: string) => {
    console.log('removeCampaign called with ID:', campaignId);
    setCampaigns(prevCampaigns => {
      const newCampaigns = prevCampaigns.filter(campaign => campaign._id !== campaignId);
      console.log('New campaigns state after removal:', newCampaigns);
      return newCampaigns;
    });
  };

  return (
    <EmailCampaignContext.Provider value={{ campaigns, addCampaign, updateCampaign, removeCampaign }}>
      {children}
    </EmailCampaignContext.Provider>
  );
};