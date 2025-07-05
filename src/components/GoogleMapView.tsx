
import { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MapPin, Home, Heart } from 'lucide-react';
import type { Incident } from '@/types/incident';

interface GoogleMapViewProps {
  incidents: Incident[];
}

const GoogleMapView = ({ incidents }: GoogleMapViewProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [apiKey, setApiKey] = useState<string>('');
  const [homeLocation, setHomeLocation] = useState<string>('');
  const [favoriteLocations, setFavoriteLocations] = useState<string[]>(['']);
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

  const geocodeAddress = async (address: string): Promise<google.maps.LatLngLiteral | null> => {
    if (!map) return null;
    
    const geocoder = new google.maps.Geocoder();
    try {
      const result = await geocoder.geocode({ address: `${address}, 서울, 대한민국` });
      if (result.results[0]) {
        const location = result.results[0].geometry.location;
        return { lat: location.lat(), lng: location.lng() };
      }
    } catch (error) {
      console.error('주소 검색 실패:', error);
    }
    return null;
  };

  const addHomeMarker = async () => {
    if (!homeLocation.trim() || !map) return;
    
    const position = await geocodeAddress(homeLocation);
    if (position) {
      const marker = createEmojiMarker(position, '🏠', '내 집', '#10b981');
      setMarkers(prev => [...prev, marker]);
    }
  };

  const addFavoriteMarker = async (location: string, index: number) => {
    if (!location.trim() || !map) return;
    
    const position = await geocodeAddress(location);
    if (position) {
      const marker = createEmojiMarker(position, '🏡', `관심 동네 ${index + 1}`, '#8b5cf6');
      setMarkers(prev => [...prev, marker]);
    }
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

    // 기존 사건 마커 제거
    markers.forEach(marker => {
      if (marker.getTitle()?.includes('사건')) {
        marker.setMap(null);
      }
    });

    // 새 사건 마커 추가
    const newMarkers: google.maps.Marker[] = [];
    
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

    setMarkers(prev => [...prev.filter(m => !m.getTitle()?.includes('사건')), ...newMarkers]);
  }, [map, incidents]);

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
      
      {/* 위치 설정 패널 */}
      <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-3 max-w-xs">
        <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
          <Home className="w-4 h-4" />
          내 위치 설정
        </h4>
        <div className="space-y-2">
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="우리집 주소 (예: 강남구 역삼동)"
              value={homeLocation}
              onChange={(e) => setHomeLocation(e.target.value)}
              className="text-xs"
            />
            <Button size="sm" onClick={addHomeMarker} disabled={!homeLocation.trim()}>
              🏠
            </Button>
          </div>
          
          <div className="text-xs text-gray-500 mb-2 flex items-center gap-1">
            <Heart className="w-3 h-3" />
            관심 동네 (최대 3곳)
          </div>
          
          {favoriteLocations.slice(0, 3).map((location, index) => (
            <div key={index} className="flex gap-2">
              <Input
                type="text"
                placeholder={`관심 동네 ${index + 1}`}
                value={location}
                onChange={(e) => {
                  const newLocations = [...favoriteLocations];
                  newLocations[index] = e.target.value;
                  setFavoriteLocations(newLocations);
                }}
                className="text-xs"
              />
              <Button 
                size="sm" 
                onClick={() => addFavoriteMarker(location, index)}
                disabled={!location.trim()}
              >
                🏡
              </Button>
            </div>
          ))}
          
          {favoriteLocations.length < 3 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setFavoriteLocations([...favoriteLocations, ''])}
              className="w-full text-xs"
            >
              + 관심 동네 추가
            </Button>
          )}
        </div>
      </div>
      
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
              <span>관심 동네</span>
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
