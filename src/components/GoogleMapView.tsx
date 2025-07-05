import { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MapPin, Home, Heart } from 'lucide-react';
import { getLocationSettings } from '@/services/locationService';
import type { Incident } from '@/types/incident';
import type { MissingPerson } from '@/types/missing';

interface GoogleMapViewProps {
  incidents: Incident[];
  missingPersons?: MissingPerson[];
  currentPosition?: { lat: number; lng: number } | null;
}

const GoogleMapView = ({ incidents, missingPersons = [], currentPosition }: GoogleMapViewProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [apiKey, setApiKey] = useState<string>('');
  const [markers, setMarkers] = useState<google.maps.Marker[]>([]);

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

  const getMissingIcon = (age: number) => {
    return age < 18 ? '🧒' : '❓';
  };

  const createEmojiMarker = (position: google.maps.LatLngLiteral, emoji: string, title: string, color = '#4285f4') => {
    return new google.maps.Marker({
      position,
      map: map,
      title,
      icon: {
        url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
          <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
            <circle cx="20" cy="20" r="18" fill="${color}" stroke="white" stroke-width="2"/>
            <text x="20" y="26" text-anchor="middle" font-size="16" fill="white">${emoji}</text>
          </svg>
        `)}`,
        scaledSize: new google.maps.Size(40, 40),
        anchor: new google.maps.Point(20, 20)
      }
    });
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
        const google = await loader.load();
        
        // 현재 위치 또는 서울 중심으로 지도 초기화
        const center = currentPosition || { lat: 37.5665, lng: 126.9780 };
        
        const mapInstance = new google.maps.Map(mapRef.current, {
          center: center,
          zoom: currentPosition ? 15 : 13,
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
  }, [apiKey, currentPosition]);

  useEffect(() => {
    if (!map) return;

    // 기존 마커 제거
    markers.forEach(marker => marker.setMap(null));
    const newMarkers: google.maps.Marker[] = [];

    // 저장된 위치들 표시
    const locationSettings = getLocationSettings();
    
    // 내 집 마커
    if (locationSettings.homeLocation && locationSettings.homeLocation.isActive) {
      const homeMarker = createEmojiMarker(
        locationSettings.homeLocation.coordinates,
        '🏠',
        `내 집: ${locationSettings.homeLocation.name}`,
        '#10b981'
      );
      newMarkers.push(homeMarker);
    }

    // 관심 지역 마커
    locationSettings.interestLocations
      .filter(loc => loc.isActive)
      .forEach((location, index) => {
        const interestMarker = createEmojiMarker(
          location.coordinates,
          '🏡',
          `관심 지역: ${location.name}`,
          '#8b5cf6'
        );
        newMarkers.push(interestMarker);
      });
    
    // 사건 마커 추가
    incidents.forEach((incident) => {
      if (incident.coordinates) {
        const marker = new google.maps.Marker({
          position: { 
            lat: incident.coordinates.lat, 
            lng: incident.coordinates.lng 
          },
          map: map,
          title: `사건: ${incident.title}`,
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

        newMarkers.push(marker);
      }
    });

    // 실종자 마커 추가
    missingPersons.forEach((person) => {
      if (person.coordinates) {
        const marker = new google.maps.Marker({
          position: { 
            lat: person.coordinates.lat, 
            lng: person.coordinates.lng 
          },
          map: map,
          title: `실종: ${person.name}`,
          icon: {
            url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
              <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                <circle cx="16" cy="16" r="14" fill="#f59e0b" stroke="white" stroke-width="2"/>
                <text x="16" y="20" text-anchor="middle" font-size="12" fill="white">${getMissingIcon(person.age)}</text>
              </svg>
            `)}`,
            scaledSize: new google.maps.Size(32, 32),
            anchor: new google.maps.Point(16, 16)
          }
        });

        const formatTime = (timeString: string) => {
          const date = new Date(timeString);
          return date.toLocaleDateString('ko-KR') + ' ' + date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
        };

        const infoWindow = new google.maps.InfoWindow({
          content: `
            <div style="max-width: 250px;">
              <h3 style="margin: 0 0 8px 0; font-weight: bold; color: #f59e0b;">실종 - ${person.name}</h3>
              <p style="margin: 0 0 4px 0;"><strong>나이:</strong> ${person.age}세 (${person.gender === 'male' ? '남성' : '여성'})</p>
              <p style="margin: 0 0 4px 0;"><strong>마지막 위치:</strong> ${person.lastLocation}</p>
              <p style="margin: 0 0 4px 0;"><strong>실종 시간:</strong> ${formatTime(person.lastSeenTime)}</p>
              ${person.description ? `<p style="margin: 0; font-size: 14px; color: #666;"><strong>특징:</strong> ${person.description}</p>` : ''}
            </div>
          `
        });

        marker.addListener('click', () => {
          infoWindow.open(map, marker);
        });

        newMarkers.push(marker);
      }
    });

    setMarkers(newMarkers);
  }, [map, incidents, missingPersons]);

  if (!apiKey) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4">
        <div className="max-w-sm w-full space-y-4">
          <h3 className="text-lg font-semibold text-center">Google Maps API 키 입력</h3>
          <p className="text-sm text-gray-600 text-center">
            Google Cloud Console에서 Maps API 키를 생성하고 입력해주세요.
          </p>
          <Input
            type="text"
            placeholder="Google Maps API 키 입력"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="w-full"
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
        
        <div className="mt-3 pt-2 border-t">
          <h4 className="text-sm font-medium mb-1">위치 마커</h4>
          <div className="space-y-1 text-xs">
            <div className="flex items-center gap-2">
              <span>🏠</span>
              <span>내 집</span>
            </div>
            <div className="flex items-center gap-2">
              <span>🏡</span>
              <span>관심 지역</span>
            </div>
            <div className="flex items-center gap-2">
              <span>❓🧒</span>
              <span>실종자</span>
            </div>
          </div>
        </div>
      </div>

      {/* 제보 집중 지역 표시 */}
      <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-3">
        <h4 className="text-sm font-medium mb-2 text-red-600">📍 제보 집중 지역</h4>
        <div className="space-y-1 text-xs">
          <div className="flex justify-between gap-4">
            <span>강남역 일대</span>
            <span className="text-red-600 font-medium">47건</span>
          </div>
          <div className="flex justify-between gap-4">
            <span>홍대입구역</span>
            <span className="text-orange-600 font-medium">23건</span>
          </div>
          <div className="flex justify-between gap-4">
            <span>종로구 일대</span>
            <span className="text-yellow-600 font-medium">18건</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoogleMapView;