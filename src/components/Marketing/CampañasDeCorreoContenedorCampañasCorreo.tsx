import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Filter, Users, Mail } from 'lucide-react';
import Button from '../Common/Button';
import { Campaign } from './types';
import { useTheme } from '../../contexts/ThemeContext';
import { useEmailCampaign } from '../../contexts/EmailCampaignContext';

interface CampañasDeCorreoContenedorCampañasCorreoProps {
  itemVariants: any;
  loading: boolean;
  error: string | null;
  filteredCampaigns: Campaign[];
  campaigns: Campaign[];
  filterOpen: boolean;
  setFilterOpen: (open: boolean) => void;
  filters: {
    estado: string;
    searchTerm: string;
    selectedTags: string[];
  };
  setFilters: (filters: any) => void;
  allTags: string[];
  handleCampaignClick: (campaign: Campaign) => void;
  setCampaigns: (campaigns: Campaign[]) => void;
}

export const CampañasDeCorreoContenedorCampañasCorreo: React.FC<CampañasDeCorreoContenedorCampañasCorreoProps> = ({
  itemVariants,
  loading,
  error,
  filteredCampaigns,
  campaigns,
  filterOpen,
  setFilterOpen,
  filters,
  setFilters,
  allTags,
  handleCampaignClick,
  setCampaigns
}) => {
  const { theme } = useTheme();
  const { campaigns: contextCampaigns } = useEmailCampaign();
  
  // Update local campaigns when context campaigns change
  useEffect(() => {
    if (contextCampaigns.length > 0) {
      // Merge existing campaigns with new ones from context
      const updatedCampaigns = [...campaigns];
      
      contextCampaigns.forEach(contextCampaign => {
        const existingIndex = updatedCampaigns.findIndex(
          campaign => campaign._id === contextCampaign._id
        );
        
        if (existingIndex >= 0) {
          updatedCampaigns[existingIndex] = contextCampaign;
        } else {
          updatedCampaigns.push(contextCampaign);
        }
      });
      
      setCampaigns(updatedCampaigns);
    }
  }, [contextCampaigns, campaigns, setCampaigns]);

  // ... rest of the component remains the same