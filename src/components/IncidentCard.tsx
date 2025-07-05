
import { Clock, MapPin, Users, Shield, AlertTriangle, Brain } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import type { Incident } from '@/types/incident';

interface IncidentCardProps {
  incident: Incident;
}

const IncidentCard = ({ incident }: IncidentCardProps) => {
  const getTypeConfig = (type: string) => {
    const configs = {
      crime: { icon: '🔪', color: 'bg-red-50 border-red-200', textColor: 'text-red-700' },
      traffic: { icon: '🚗', color: 'bg-blue-50 border-blue-200', textColor: 'text-blue-700' },
      fire: { icon: '🔥', color: 'bg-orange-50 border-orange-200', textColor: 'text-orange-700' },
      flood: { icon: '🌊', color: 'bg-cyan-50 border-cyan-200', textColor: 'text-cyan-700' },
      subway: { icon: '🚇', color: 'bg-green-50 border-green-200', textColor: 'text-green-700' },
      disaster: { icon: '🌪', color: 'bg-purple-50 border-purple-200', textColor: 'text-purple-700' },
      other: { icon: '⚠️', color: 'bg-gray-50 border-gray-200', textColor: 'text-gray-700' }
    };
    return configs[type as keyof typeof configs] || configs.other;
  };

  const getSourceConfig = (source: string) => {
    const configs = {
      news: { label: '뉴스', color: 'bg-green-100 text-green-700', icon: Shield },
      reports: { label: '제보', color: 'bg-yellow-100 text-yellow-700', icon: Users },
      emergency: { label: '재난문자', color: 'bg-red-100 text-red-700', icon: AlertTriangle }
    };
    return configs[source as keyof typeof configs] || configs.reports;
  };

  const getRiskBadge = (level: string) => {
    const configs = {
      critical: { label: '매우 위험', color: 'bg-red-500 text-white' },
      high: { label: '위험', color: 'bg-orange-500 text-white' },
      medium: { label: '주의', color: 'bg-yellow-500 text-white' },
      low: { label: '참고', color: 'bg-gray-500 text-white' }
    };
    return configs[level as keyof typeof configs] || configs.low;
  };

  const typeConfig = getTypeConfig(incident.type);
  const sourceConfig = getSourceConfig(incident.source);
  const riskConfig = getRiskBadge(incident.riskLevel);
  const timeAgo = getTimeAgo(incident.timestamp);

  return (
    <Card className={`border-2 ${typeConfig.color} shadow-sm`}>
      <CardContent className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">{typeConfig.icon}</span>
            <Badge variant="outline" className={`${sourceConfig.color} border-current`}>
              <sourceConfig.icon className="w-3 h-3 mr-1" />
              {sourceConfig.label}
            </Badge>
            <Badge className={riskConfig.color}>
              {riskConfig.label}
            </Badge>
          </div>
          
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <Clock className="w-4 h-4" />
            {timeAgo}
          </div>
        </div>

        {/* Title */}
        <h3 className={`font-bold text-lg mb-2 ${typeConfig.textColor}`}>
          {incident.title}
        </h3>

        {/* Location */}
        <div className="flex items-center gap-1 text-gray-600 mb-3">
          <MapPin className="w-4 h-4" />
          <span className="text-sm">{incident.location}</span>
        </div>

        {/* Description */}
        <p className="text-gray-700 text-sm leading-relaxed mb-3">
          {incident.description}
        </p>

        {/* AI Suggestion */}
        {incident.aiSuggestion && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
            <div className="flex items-start gap-2">
              <Brain className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-blue-800 mb-1">AI 행동 제안</p>
                <p className="text-sm text-blue-700">{incident.aiSuggestion}</p>
              </div>
            </div>
          </div>
        )}

        {/* Verification Stats */}
        {incident.verificationCount && (
          <div className="bg-gray-50 rounded-lg p-3 mb-3">
            <p className="text-sm font-medium text-gray-700 mb-2">사실 확인 현황</p>
            <div className="flex gap-4 text-xs">
              <span className="text-green-600">
                ✓ {incident.verificationCount.confirmed}명 확인
              </span>
              <span className="text-red-600">
                ✗ {incident.verificationCount.denied}명 반박
              </span>
              <span className="text-gray-500">
                ? {incident.verificationCount.unsure}명 불확실
              </span>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between">
          {incident.source === 'reports' && (
            <div className="flex items-center gap-1 text-sm">
              <Users className="w-4 h-4 text-orange-500" />
              <span className="text-orange-600 font-medium">
                제보 {incident.reportCount}건
              </span>
            </div>
          )}
          
          {incident.isUrgent && (
            <div className="flex items-center gap-1 text-sm text-red-600">
              <AlertTriangle className="w-4 h-4" />
              <span className="font-medium">긴급</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// 시간 계산 헬퍼 함수
function getTimeAgo(timestamp: string): string {
  const now = new Date();
  const past = new Date(timestamp);
  const diffInMinutes = Math.floor((now.getTime() - past.getTime()) / (1000 * 60));
  
  if (diffInMinutes < 1) return '방금 전';
  if (diffInMinutes < 60) return `${diffInMinutes}분 전`;
  if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}시간 전`;
  return `${Math.floor(diffInMinutes / 1440)}일 전`;
}

export default IncidentCard;
