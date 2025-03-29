import { useState, useEffect } from 'react';
import { Campaign } from '../types/campaign';
import { emailService } from '../services/mockEmailService';

export function useEmailCampaigns() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const data = await emailService.getCampaigns();
        setCampaigns(data);
      } catch (err) {
        setError('Failed to fetch campaigns');
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  const createCampaign = async (campaignData: Omit<Campaign, 'id' | 'stats'>) => {
    try {
      const newCampaign = await emailService.createCampaign(campaignData);
      setCampaigns(prev => [...prev, newCampaign]);
      return newCampaign;
    } catch (err) {
      setError('Failed to create campaign');
      throw err;
    }
  };

  return {
    campaigns,
    loading,
    error,
    createCampaign
  };
}