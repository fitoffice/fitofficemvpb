import React, { useState, useEffect } from 'react';
import { BarChart2, Plus, Settings, Users, Mail, TrendingUp, MousePointerClick, UserCheck, Filter } from 'lucide-react';
import { LeadsTable } from '../components/Marketing/LeadsTable';
import { Pipeline } from '../components/Marketing/Pipeline';
import { motion } from 'framer-motion';
import '../components/Marketing/CampaignOverview.css';
import { EmailCampaign } from '../components/Marketing/EmailCampaign';
import { Automations } from '../components/Marketing/Automations';
import { Segments } from '../components/Marketing/Segments';
import { CampaignExpanded } from '../components/Marketing/CampaignExpanded';
import { CampañasDeCorreoContenedorCampañasCorreo } from '../components/Marketing/CampañasDeCorreoContenedorCampañasCorreo';
import { CampañaUnica } from '../components/Marketing/CampañaUnica';
import axios from 'axios';
import Button from '../components/Common/Button';
import { MetricCardMarketingCampañasCorreo } from '../components/Marketing/MetricCardMarketingCampañasCorreo';
import { AccionesRapidasCampañasCorreo } from '../components/Marketing/AccionesRapidasCampañasCorreo';
import { useTheme } from '../contexts/ThemeContext';

const EmailMarketingPage = () => {
  const { theme } = useTheme();
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.15,
      },
    },
  };

  return (
    <>
      <motion.main
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className={`campaign-overview ${theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-800'} min-h-screen p-6`}
      >
        <div className={`${theme === 'dark' ? 'bg-[#1a2332]' : 'bg-white'} p-6 rounded-lg shadow-lg`}>
          <h3 className={`text-xl font-bold mb-4 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
            Email Marketing
          </h3>
        </div>
      </motion.main>
    </>
  );
};

export default EmailMarketingPage;