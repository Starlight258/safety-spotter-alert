
import { Clock, MapPin, Users, Shield, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
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
      disaster: { icon: '🌪', color: 'bg-purple-50 border-purple-200', textColor: 'text-purple-700' }
    };
    return configs[type as keyof typeof configs] || configs.crime;
  };

  const getSourceConfig = (source: string) => {
    return source === 'news' 
      ? { label: '뉴스', color: 'bg-green-100 text-green-700', icon: Shield }
      : { label: '제보', color: 'bg-yellow-100 text-yellow-700', icon: Users };
  };

  const typeConfig = getTypeConfig(incident.type);
  const sourceConfig = getSourceConfig(incident.source);
  const timeAgo = getTimeAgo(incident.timestamp);

  return (
    <div className={`bg-white rounded-lg border-2 ${typeConfig.color} p-4 shadow-sm`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">{typeConfig.icon}</span>
          <Badge variant="outline" className={`${sourceConfig.color} border-current`}>
            <sourceConfig.icon className="w-3 h-3 mr-1" />
            {sourceConfig.label}
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
    </div>
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
