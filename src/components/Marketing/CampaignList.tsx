import React, { useState } from 'react';
import { Calendar, Mail, BarChart2, Clock, Copy, Filter, ChevronDown } from 'lucide-react';
import type { Campaign } from '../types/campaign';
import { useEmailCampaigns } from "../../hooks/useEmailCampaigns";
import { CampaignMetricsModal } from './CampaignMetricsModal';
import { motion, AnimatePresence } from 'framer-motion';
export function CampaignList() {
  const { campaigns, loading, error } = useEmailCampaigns();
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [filter, setFilter] = useState<string>('all');
  const [isExpanded, setIsExpanded] = useState<string | null>(null);
  const filteredCampaigns = campaigns.filter(campaign => {
    if (filter === 'all') return true;
    return campaign.status === filter;
  });
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-3">
            <div className="h-20 bg-gray-200 rounded-xl"></div>
            <div className="h-20 bg-gray-200 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <p className="text-red-600">Error al cargar las campañas</p>
      </div>
    );
  }
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3 }
    }
  };
  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="bg-white rounded-xl shadow-sm overflow-hidden"
    >
      <div className="px-6 py-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Campañas Recientes</h2>
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-gray-500" />
            <select 
              className="text-sm border-gray-200 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">Todas</option>
              <option value="sending">En progreso</option>
              <option value="scheduled">Programadas</option>
              <option value="sent">Finalizadas</option>
              <option value="draft">Borradores</option>
            </select>
          </div>
        </div>
      </div>
      <div className="divide-y divide-gray-100">
        <AnimatePresence>
          {filteredCampaigns.map((campaign) => (
            <motion.div
              key={campaign.id}
              variants={itemVariants}
              layout
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, x: -20 }}
            >
              <CampaignCard 
                campaign={campaign}
                isExpanded={isExpanded === campaign.id}
                onToggleExpand={() => setIsExpanded(isExpanded === campaign.id ? null : campaign.id)}
                onMetricsClick={() => setSelectedCampaign(campaign)}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      {selectedCampaign && (
        <CampaignMetricsModal
          campaign={selectedCampaign}
          onClose={() => setSelectedCampaign(null)}
        />
      )}
    </motion.div>
  );
}
function CampaignCard({ 
  campaign, 
  isExpanded,
  onToggleExpand,
  onMetricsClick 
}: { 
  campaign: Campaign;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onMetricsClick: () => void;
}) {
  const statusConfig = {
    draft: {
      color: 'bg-gray-100 text-gray-800',
      label: 'Borrador'
    },
    scheduled: {
      color: 'bg-indigo-100 text-indigo-800',
      label: 'Programada'
    },
    sending: {
      color: 'bg-amber-100 text-amber-800',
      label: 'Enviando'
    },
    sent: {
      color: 'bg-emerald-100 text-emerald-800',
      label: 'Enviada'
    },
    failed: {
      color: 'bg-red-100 text-red-800',
      label: 'Fallida'
    }
  };
  const status = statusConfig[campaign.status];
  const handleDuplicate = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Implementar lógica de duplicación
  };
  return (
    <motion.div 
      className="group hover:bg-gray-50 transition-all duration-300 cursor-pointer"
      onClick={onToggleExpand}
    >
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <motion.div
                whileHover={{ rotate: 15 }}
                className="bg-indigo-100 p-3 rounded-xl"
              >
                <Mail className="h-8 w-8 text-indigo-600" />
              </motion.div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{campaign.name}</h3>
              <p className="text-sm text-gray-600">{campaign.subject}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleDuplicate}
              className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
              title="Duplicar campaña"
            >
              <Copy className="h-5 w-5" />
            </motion.button>
            <span className={`px-3 py-1 inline-flex text-sm font-medium rounded-full ${status.color}`}>
              {status.label}
            </span>
            <motion.button
              animate={{ rotate: isExpanded ? 180 : 0 }}
              className="p-1 text-gray-400 hover:text-gray-600"
            >
              <ChevronDown className="h-5 w-5" />
            </motion.button>
          </div>
        </div>
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4"
            >
              <Stat 
                icon={<Mail className="h-5 w-5" />} 
                label="Tasa de Apertura" 
                value={`${campaign.stats.openRate}%`}
                target={45}
                current={campaign.stats.openRate}
              />
              <Stat 
                icon={<Clock className="h-5 w-5" />} 
                label="Tasa de Clics" 
                value={`${campaign.stats.clickRate}%`}
                target={15}
                current={campaign.stats.clickRate}
              />
              <Stat 
                icon={<BarChart2 className="h-5 w-5" />} 
                label="Conversión" 
                value={`${campaign.stats.conversionRate}%`}
                target={10}
                current={campaign.stats.conversionRate}
              />
              <Stat 
                icon={<BarChart2 className="h-5 w-5" />} 
                label="Tasa de Rebote" 
                value={`${campaign.stats.bounceRate}%`}
                isInverse={true}
                target={2}
                current={campaign.stats.bounceRate}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
function Stat({ 
  icon, 
  label, 
  value, 
  target, 
  current, 
  isInverse = false 
}: { 
  icon: React.ReactNode; 
  label: string; 
  value: string;
  target: number;
  current: number;
  isInverse?: boolean;
}) {
  const progress = (current / target) * 100;
  const isGood = isInverse ? current <= target : current >= target;
  
  return (
    <motion.div 
      whileHover={{ scale: 1.02 }}
      className="relative flex items-center space-x-3 bg-gray-50 rounded-xl p-3 transition-all duration-300 hover:bg-gray-100 group"
    >
      <div className="text-indigo-600 transition-transform duration-300 group-hover:scale-110">
        {icon}
      </div>
      <div className="flex-1">
        <p className="text-xs font-medium text-gray-600">{label}</p>
        <p className="text-sm font-bold text-gray-900">{value}</p>
        <div className="mt-1 h-1 w-full bg-gray-200 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(100, progress)}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className={`h-full rounded-full transition-all duration-500 ${
              isGood ? 'bg-emerald-500' : 'bg-amber-500'
            }`}
          />
        </div>
      </div>
    </motion.div>
  );
}
