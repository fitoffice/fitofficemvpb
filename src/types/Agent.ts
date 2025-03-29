import { LucideIcon } from 'lucide-react';

export interface DetailedFeature {
  title: string;
  description: string;
  icon: LucideIcon;
}

export interface Integration {
  name: string;
  icon: string;
  description: string;
}

export interface CaseStudy {
  title: string;
  description: string;
  metric: string;
  icon: LucideIcon;
}

export interface Agent {
  id: number;
  title: string;
  description: string;
  price: number;
  features: string[];
  icon: LucideIcon;
  gradient: string;
  category: string;
  detailedFeatures: DetailedFeature[];
  integrations: Integration[];
  caseStudies: CaseStudy[];
  demoImages: string[];
}
