
export interface Incident {
  id: string;
  type: 'crime' | 'traffic' | 'fire' | 'disaster' | 'flood' | 'subway' | 'other';
  title: string;
  description: string;
  location: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  timestamp: string;
  source: 'news' | 'reports' | 'emergency';
  reportCount?: number;
  isUrgent?: boolean;
  trustLevel: 'high' | 'medium' | 'low';
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  aiSuggestion?: string;
  verificationCount?: {
    confirmed: number;
    denied: number;
    unsure: number;
  };
}

export interface UserFeedback {
  incidentId: string;
  userId: string;
  response: 'confirmed' | 'denied' | 'unsure';
  timestamp: string;
}

export interface LocationStats {
  area: string;
  incidentCount: number;
  riskScore: number;
  topIncidentType: string;
}
