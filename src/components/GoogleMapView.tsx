
import { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import type { Incident } from '@/types/incident';

interface GoogleMapViewProps {
  incidents: Incident[];
}

const GoogleMapView = ({ incidents }: GoogleMapViewProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [apiKey, setApiKey] = useState<string>('');

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
    if (!apiKey) return;

    const initMap = async () => {
      if (!mapRef.current) return;

      const loader = new Loader({
        apiKey: apiKey,
        version: 'weekly',
        libraries: ['places']
      });

      try {
        await loader.load();
        
        const mapInstance = new google.maps.Map(mapRef.current, {
          center: { lat: 37.5665, lng: 126.9780 }, // 서울 중심
          zoom: 13,
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          styles: [
            {
              featureType: "poi",
              elementType: "labels",
              stylers: [{ visibility: "off" }]
            }
          ]
        });

        setMap(mapInstance);
      } catch (error) {
        console.error('Google Maps API 로드 실패:', error);
      }
    };

    initMap();
  }, [apiKey]);

  useEffect(() => {
    if (!map || !incidents.length) return;

    // 기존 마커 제거
    incidents.forEach((incident, index) => {
      if (incident.coordinates) {
        const marker = new google.maps.Marker({
          position: { 
            lat: incident.coordinates.lat, 
            lng: incident.coordinates.lng 
          },
          map: map,
          title: incident.title,
          icon: {
            url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
              <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                <circle cx="16" cy="16" r="14" fill="${getMarkerColor(incident.riskLevel)}" stroke="white" stroke-width="2"/>
                <text x="16" y="20" text-anchor="middle" font-size="12" fill="white">${getIncidentIcon(incident.type)}</text>
              </svg>
            `)}`,
            scaledSize: new google.maps.Size(32, 32),
            anchor: new google.maps.Point(16, 16)
          }
        });

        const infoWindow = new google.maps.InfoWindow({
          content: `
            <div style="max-width: 250px;">
              <h3 style="margin: 0 0 8px 0; font-weight: bold;">${incident.title}</h3>
              <p style="margin: 0 0 4px 0; color: #666;">${incident.location}</p>
              <p style="margin: 0; font-size: 14px;">${incident.description}</p>
              ${incident.aiSuggestion ? `<div style="margin-top: 8px; padding: 8px; background: #f0f9ff; border-radius: 4px; font-size: 13px;"><strong>AI 제안:</strong> ${incident.aiSuggestion}</div>` : ''}
            </div>
          `
        });

        marker.addListener('click', () => {
          infoWindow.open(map, marker);
        });
      }
    });
  }, [map, incidents]);

  if (!apiKey) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4">
        <div className="max-w-sm w-full space-y-4">
          <h3 className="text-lg font-semibold text-center">Google Maps API 키 입력</h3>
          <p className="text-sm text-gray-600 text-center">
            Google Cloud Console에서 Maps API 키를 생성하고 입력해주세요.
          </p>
          <input
            type="text"
            placeholder="Google Maps API 키 입력"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <a 
            href="https://console.cloud.google.com/apis/library/maps-backend.googleapis.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 text-sm text-center block"
          >
            Google Maps API 키 생성하기 →
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <div ref={mapRef} className="w-full h-full" />
      
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

export default GoogleMapView;
