
export interface Incident {
  id: string;
  type: 'crime' | 'traffic' | 'fire' | 'disaster';
  title: string;
  description: string;
  location: string;
  timestamp: string;
  source: 'news' | 'reports';
  reportCount?: number;
  isUrgent?: boolean;
  trustLevel: 'high' | 'medium' | 'low';
}
