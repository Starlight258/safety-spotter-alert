
import { useEffect, useRef } from 'react';
import type { Incident } from '@/types/incident';

interface MapViewProps {
  incidents: Incident[];
}

const MapView = ({ incidents }: MapViewProps) => {
  const mapRef = useRef<HTMLDivElement>(null);

  const getMarkerColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'critical': return '#dc2626'; // red-600
      case 'high': return '#ea580c'; // orange-600
      case 'medium': return '#ca8a04'; // yellow-600
      case 'low': return '#16a34a'; // green-600
      default: return '#6b7280'; // gray-500
    }
  };

  const getIncidentIcon = (type: string) => {
    const icons = {
      crime: '🔪',
      traffic: '🚗',
      fire: '🔥',
      flood: '🌊',
      subway: '🚇',
      disaster: '🌪',
      other: '⚠️'
    };
    return icons[type as keyof typeof icons] || '⚠️';
  };

  useEffect(() => {
    if (!mapRef.current) return;

    // 간단한 지도 시뮬레이션 (실제로는 Google Maps나 네이버 지도 API 사용)
    const mapContainer = mapRef.current;
    mapContainer.innerHTML = '';

    // 서울 중심부 기준으로 상대적 위치 계산
    const seoulCenter = { lat: 37.5665, lng: 126.9780 };
    
    incidents.forEach((incident, index) => {
      if (incident.coordinates) {
        const marker = document.createElement('div');
        marker.className = `absolute w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold cursor-pointer transform -translate-x-1/2 -translate-y-1/2 shadow-lg hover:scale-110 transition-transform`;
        marker.style.backgroundColor = getMarkerColor(incident.riskLevel);
        
        // 상대적 위치 계산 (실제로는 지도 API의 projection 사용)
        const x = ((incident.coordinates.lng - seoulCenter.lng) * 1000 + 50) + '%';
        const y = ((-incident.coordinates.lat + seoulCenter.lat) * 1000 + 50) + '%';
        
        marker.style.left = x;
        marker.style.top = y;
        marker.innerHTML = getIncidentIcon(incident.type);
        marker.title = incident.title;
        
        marker.addEventListener('click', () => {
          alert(`${incident.title}\n\n${incident.description}\n\n${incident.aiSuggestion || ''}`);
        });
        
        mapContainer.appendChild(marker);
      }
    });
  }, [incidents]);

  return (
    <div className="relative w-full h-full bg-gradient-to-br from-blue-100 to-green-100 overflow-hidden">
      {/* 지도 배경 */}
      <div className="absolute inset-0 opacity-20">
        <svg width="100%" height="100%" viewBox="0 0 400 400" className="w-full h-full">
          <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e5e7eb" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>
      
      {/* 서울 주요 지역 표시 */}
      <div className="absolute inset-0 text-gray-400 text-sm">
        <div className="absolute top-1/4 left-1/3 font-medium">강남구</div>
        <div className="absolute top-1/3 left-1/4 font-medium">서초구</div>
        <div className="absolute top-1/2 left-1/5 font-medium">마포구</div>
        <div className="absolute top-1/3 right-1/3 font-medium">송파구</div>
      </div>
      
      {/* 마커 컨테이너 */}
      <div ref={mapRef} className="absolute inset-0" />
      
      {/* 범례 */}
      <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-3">
        <h4 className="text-sm font-medium mb-2">위험도</h4>
        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-600"></div>
            <span>매우 위험</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-orange-600"></div>
            <span>위험</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-600"></div>
            <span>주의</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-600"></div>
            <span>안전</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapView;
