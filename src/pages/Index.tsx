
import { useState, useEffect } from 'react';
import { Plus, Map, List, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import IncidentCard from '@/components/IncidentCard';
import LocationSelector from '@/components/LocationSelector';
import NavigationBar from '@/components/NavigationBar';
import MapView from '@/components/MapView';
import VerificationModal from '@/components/VerificationModal';
import { mockIncidents } from '@/data/mockData';
import type { Incident } from '@/types/incident';

const Index = () => {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [selectedLocation, setSelectedLocation] = useState('현재 위치');
  const [filter, setFilter] = useState<string>('all');
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);

  useEffect(() => {
    setIncidents(mockIncidents);
    
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

  const filteredIncidents = incidents.filter(incident => 
    filter === 'all' || incident.type === filter
  );

  const handleVerification = (response: 'confirmed' | 'denied' | 'unsure') => {
    if (selectedIncident) {
      // 여기서 실제로는 서버에 검증 응답을 전송
      console.log(`Verified incident ${selectedIncident.id} as ${response}`);
    }
    setShowVerificationModal(false);
    setSelectedIncident(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-xl font-bold text-gray-900">SafeZone</h1>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-red-600 font-medium">실시간</span>
            </div>
          </div>
          
          <LocationSelector 
            selectedLocation={selectedLocation}
            onLocationChange={setSelectedLocation}
          />
        </div>
      </div>

      {/* Map/List Toggle */}
      <Tabs defaultValue="list" className="w-full">
        <div className="bg-white px-4 py-2 border-b">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="list" className="flex items-center gap-2">
              <List className="w-4 h-4" />
              리스트
            </TabsTrigger>
            <TabsTrigger value="map" className="flex items-center gap-2">
              <Map className="w-4 h-4" />
              지도
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
              { key: 'disaster', label: '🌪 재난', color: 'purple' }
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

        <TabsContent value="map" className="h-[calc(100vh-200px)]">
          <MapView incidents={filteredIncidents} />
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
