import { useState, useEffect } from 'react';
import { Plus, Map, List, AlertTriangle, Brain, MapPin, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import IncidentCard from '@/components/IncidentCard';
import LocationSelector from '@/components/LocationSelector';
import NavigationBar from '@/components/NavigationBar';
import GoogleMapView from '@/components/GoogleMapView';
import VerificationModal from '@/components/VerificationModal';
import AISettings from '@/components/AISettings';
import { mockIncidents } from '@/data/mockData';
import { mockMissingPersons } from '@/data/missingData';
import { initializeGemini, generateIncidentSummary } from '@/services/geminiService';
import { getLocationSettings } from '@/services/locationService';
import type { Incident } from '@/types/incident';

const Index = () => {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [selectedLocation, setSelectedLocation] = useState('현재 위치');
  const [filter, setFilter] = useState<string>('all');
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [showAISettings, setShowAISettings] = useState(false);
  const [aiSummary, setAiSummary] = useState<string>('');
  const [isAIReady, setIsAIReady] = useState(false);
  const [currentPosition, setCurrentPosition] = useState<{ lat: number; lng: number } | null>(null);
  const [locationSettings, setLocationSettings] = useState(getLocationSettings());

  useEffect(() => {
    setIncidents(mockIncidents);
    
    // 현재 위치 가져오기
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentPosition({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.log('위치 정보를 가져올 수 없습니다:', error);
          // 기본값으로 서울 중심 사용
          setCurrentPosition({ lat: 37.5665, lng: 126.9780 });
        }
      );
    } else {
      // 기본값으로 서울 중심 사용
      setCurrentPosition({ lat: 37.5665, lng: 126.9780 });
    }
    
    // Gemini API 키 확인
    const savedApiKey = localStorage.getItem('gemini_api_key');
    if (savedApiKey) {
      initializeGemini(savedApiKey);
      setIsAIReady(true);
    }
    
    // 시뮬레이션: 5초 후 검증 요청 팝업
    const timer = setTimeout(() => {
      const floodIncident = mockIncidents.find(i => i.type === 'flood');
      if (floodIncident) {
        setSelectedIncident(floodIncident);
        setShowVerificationModal(true);
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isAIReady && incidents.length > 0) {
      generateIncidentSummary(incidents)
        .then(summary => setAiSummary(summary))
        .catch(err => console.error('AI 요약 생성 실패:', err));
    }
  }, [isAIReady, incidents]);

  const filteredIncidents = incidents.filter(incident => 
    filter === 'all' || incident.type === filter
  );

  const handleVerification = (response: 'confirmed' | 'denied' | 'unsure') => {
    if (selectedIncident) {
      console.log(`Verified incident ${selectedIncident.id} as ${response}`);
    }
    setShowVerificationModal(false);
    setSelectedIncident(null);
  };

  const handleAISettingsComplete = () => {
    setIsAIReady(true);
    setShowAISettings(false);
  };

  const updateLocationSettings = () => {
    setLocationSettings(getLocationSettings());
  };

  if (showAISettings) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <AISettings onApiKeySet={handleAISettingsComplete} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Smartphone className="w-6 h-6 text-red-600" />
              <h1 className="text-xl font-bold text-gray-900">안전 스포터</h1>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAISettings(true)}
                className="text-blue-600"
              >
                <Brain className="w-4 h-4 mr-1" />
                AI
              </Button>
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-red-600 font-medium">실시간</span>
            </div>
          </div>
          
          <LocationSelector 
            selectedLocation={selectedLocation}
            onLocationChange={setSelectedLocation}
          />

          {/* 저장된 위치 정보 표시 */}
          {(locationSettings.homeLocation || locationSettings.interestLocations.length > 0) && (
            <div className="mt-3 bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-green-800 mb-1">📍 설정된 위치</p>
                  <div className="text-sm text-green-700 space-y-1">
                    {locationSettings.homeLocation && locationSettings.homeLocation.isActive && (
                      <div>🏠 {locationSettings.homeLocation.name}</div>
                    )}
                    {locationSettings.interestLocations
                      .filter(loc => loc.isActive)
                      .map(loc => (
                        <div key={loc.id}>🏡 {loc.name}</div>
                      ))
                    }
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* AI 요약 */}
          {isAIReady && aiSummary && (
            <div className="mt-3 bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <Brain className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-blue-800 mb-1">🔮 AI 상황 요약</p>
                  <p className="text-sm text-blue-700">{aiSummary}</p>
                </div>
              </div>
            </div>
          )}

          {/* 제보 집중 지역 알림 */}
          <div className="mt-3 bg-red-50 border border-red-200 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-red-800 mb-1">📍 제보 집중 지역</p>
                <p className="text-sm text-red-700">강남역 일대에서 침수 제보 47건 발생 중 - 우회 권장</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Map/List Toggle */}
      <Tabs defaultValue="map" className="w-full">
        <div className="bg-white px-4 py-2 border-b">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="map" className="flex items-center gap-2">
              <Map className="w-4 h-4" />
              지도
            </TabsTrigger>
            <TabsTrigger value="list" className="flex items-center gap-2">
              <List className="w-4 h-4" />
              리스트
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white px-4 py-2 border-b">
          <div className="flex gap-2 overflow-x-auto">
            {[
              { key: 'all', label: '전체', color: 'gray' },
              { key: 'crime', label: '🔪 범죄', color: 'red' },
              { key: 'traffic', label: '🚗 교통', color: 'blue' },
              { key: 'fire', label: '🔥 화재', color: 'orange' },
              { key: 'flood', label: '🌊 침수', color: 'cyan' },
              { key: 'subway', label: '🚇 지하철', color: 'green' },
              { key: 'disaster', label: '🌪 재난', color: 'purple' },
              { key: 'missing', label: '❓ 실종', color: 'yellow' }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  filter === tab.key 
                    ? 'bg-red-100 text-red-700 border border-red-200' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <TabsContent value="map" className="h-[calc(100vh-200px)]">
          <GoogleMapView 
            incidents={filteredIncidents} 
            missingPersons={mockMissingPersons}
            currentPosition={currentPosition}
          />
        </TabsContent>

        <TabsContent value="list" className="p-4 space-y-3 pb-20">
          {filteredIncidents.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-400 text-lg mb-2">📍</div>
              <p className="text-gray-500">현재 지역에 신고된 사건이 없습니다</p>
            </div>
          ) : (
            filteredIncidents.map(incident => (
              <IncidentCard key={incident.id} incident={incident} />
            ))
          )}
        </TabsContent>
      </Tabs>

      {/* Floating Action Button */}
      <Button
        className="fixed bottom-20 right-4 w-14 h-14 rounded-full bg-red-500 hover:bg-red-600 shadow-lg"
        onClick={() => window.location.href = '/report'}
      >
        <Plus className="w-6 h-6" />
      </Button>

      {/* Verification Modal */}
      {showVerificationModal && selectedIncident && (
        <VerificationModal
          incident={selectedIncident}
          onVerify={handleVerification}
          onClose={() => setShowVerificationModal(false)}
        />
      )}

      <NavigationBar currentPage="home" />
    </div>
  );
};

export default Index;