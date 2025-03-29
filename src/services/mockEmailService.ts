import { Campaign, NewCampaignData, Template, AutomationRule } from '../types/campaign';
import { addDays, format } from 'date-fns';

class MockEmailService {
  private campaigns: Campaign[] = [];
  private templates: Template[] = [
    {
      id: 't1',
      name: 'Recordatorio de Sesión',
      type: 'reminder',
      content: 'Te recordamos tu próxima sesión de entrenamiento...',
      thumbnail: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300'
    },
    {
      id: 't2',
      name: 'Newsletter Mensual',
      type: 'newsletter',
      content: 'Descubre los consejos fitness y casos de éxito de este mes...',
      thumbnail: 'https://images.unsplash.com/photo-1574411676363-9e4590a48c0b?w=300'
    }
  ];

  private automationRules: AutomationRule[] = [
    {
      id: 'a1',
      name: 'Serie de Bienvenida',
      trigger: {
        type: 'welcome',
        conditions: { daysSinceJoined: 0 }
      },
      action: {
        type: 'send_email',
        templateId: 't1'
      },
      isActive: true
    }
  ];

  constructor() {
    this.initializeCampaigns();
  }

  private async fetchCampaignsFromAPI(): Promise<Campaign[]> {
    try {
      const response = await fetch('/api/email-marketing');
      const data = await response.json();
      
      return data.campaigns.map((campaign: any) => ({
        id: campaign.id,
        name: campaign.name,
        status: campaign.status,
        subject: campaign.subject,
        content: campaign.content,
        scheduledDate: new Date(campaign.scheduledDate),
        stats: {
          openRate: campaign.stats.openRate,
          clickRate: campaign.stats.clickRate,
          conversionRate: campaign.stats.conversionRate,
          bounceRate: campaign.stats.bounceRate
        },
        segments: campaign.segments
      }));
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      return [];
    }
  }

  private async initializeCampaigns() {
    this.campaigns = await this.fetchCampaignsFromAPI();
  }

  async getCampaigns(): Promise<Campaign[]> {
    try {
      this.campaigns = await this.fetchCampaignsFromAPI();
      return this.campaigns;
    } catch (error) {
      console.error('Error getting campaigns:', error);
      return [];
    }
  }

  async getCampaign(id: string): Promise<Campaign | undefined> {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(this.campaigns.find(c => c.id === id));
      }, 300);
    });
  }

  async createCampaign(campaignData: NewCampaignData): Promise<Campaign> {
    return new Promise((resolve, reject) => {
      try {
        if (!campaignData.name || !campaignData.subject || !campaignData.template || campaignData.segments.length === 0) {
          throw new Error('Campos requeridos faltantes');
        }

        const template = this.templates.find(t => t.id === campaignData.template);
        if (!template) {
          throw new Error('Plantilla no encontrada');
        }

        const newCampaign: Campaign = {
          id: `c${Date.now()}`,
          name: campaignData.name,
          subject: campaignData.subject,
          preheader: campaignData.preheader,
          content: template.content,
          segments: campaignData.segments,
          scheduledDate: campaignData.scheduledDate,
          status: campaignData.scheduledDate ? 'scheduled' : 'draft',
          stats: {
            openRate: 0,
            clickRate: 0,
            conversionRate: 0,
            bounceRate: 0
          },
          template: template.id,
          abTesting: campaignData.abTesting,
          personalizedFields: campaignData.personalizedFields
        };

        this.campaigns.push(newCampaign);
        setTimeout(() => resolve(newCampaign), 500);
      } catch (error) {
        setTimeout(() => reject(error), 500);
      }
    });
  }

  async getTemplates(): Promise<Template[]> {
    return new Promise(resolve => {
      setTimeout(() => resolve(this.templates), 300);
    });
  }

  async getAutomationRules(): Promise<AutomationRule[]> {
    return new Promise(resolve => {
      setTimeout(() => resolve(this.automationRules), 300);
    });
  }

  async getStats(dateRange: { start: Date; end: Date }) {
    return new Promise(resolve => {
      const days = [];
      let currentDate = dateRange.start;
      
      while (currentDate <= dateRange.end) {
        days.push({
          name: format(currentDate, 'EEE'),
          openRate: 50 + Math.random() * 30,
          clickRate: 20 + Math.random() * 25
        });
        currentDate = addDays(currentDate, 1);
      }
      
      setTimeout(() => resolve(days), 400);
    });
  }

  getEmailMarketingStats() {
    const totalCampaigns = this.campaigns.length;
    
    // Calculate average open rate
    const openRate = this.campaigns.reduce((acc, campaign) => 
      acc + campaign.stats.openRate, 0) / totalCampaigns;
    
    // Calculate trend based on most recent campaign
    const sortedCampaigns = [...this.campaigns].sort((a, b) => 
      new Date(b.scheduledDate).getTime() - new Date(a.scheduledDate).getTime()
    );
    
    const recentCampaign = sortedCampaigns[0];
    const previousCampaign = sortedCampaigns[1];
    
    const openRateTrendDirection = recentCampaign.stats.openRate >= previousCampaign.stats.openRate ? 'up' : 'down';
    const openRateTrend = `${Math.abs(recentCampaign.stats.openRate - previousCampaign.stats.openRate).toFixed(1)}%`;
    
    // Calculate overall trend
    const sentCampaigns = this.campaigns.filter(c => c.status === 'sent').length;
    const trendDirection = 'up'; // Assuming positive trend for mock data
    const trend = `+${((sentCampaigns / totalCampaigns) * 100).toFixed(1)}%`;

    return {
      totalCampaigns,
      openRate: openRate.toFixed(1),
      openRateTrend: openRateTrendDirection === 'up' ? `+${openRateTrend}` : `-${openRateTrend}`,
      openRateTrendDirection,
      trend,
      trendDirection
    };
  }
}

export const emailService = new MockEmailService();