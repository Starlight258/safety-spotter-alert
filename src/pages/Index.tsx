
import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import IncidentCard from '@/components/IncidentCard';
import LocationSelector from '@/components/LocationSelector';
import NavigationBar from '@/components/NavigationBar';
import { mockIncidents } from '@/data/mockData';
import type { Incident } from '@/types/incident';

const Index = () => {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [selectedLocation, setSelectedLocation] = useState('현재 위치');
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    // 실제 구현시에는 API 호출
    setIncidents(mockIncidents);
  }, []);

  const filteredIncidents = incidents.filter(incident => 
    filter === 'all' || incident.type === filter
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-xl font-bold text-gray-900">안전 스포터</h1>
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

      {/* Filter Tabs */}
      <div className="bg-white px-4 py-2 border-b">
        <div className="flex gap-2 overflow-x-auto">
          {[
            { key: 'all', label: '전체', color: 'gray' },
            { key: 'crime', label: '🔪 범죄', color: 'red' },
            { key: 'traffic', label: '🚗 교통', color: 'blue' },
            { key: 'fire', label: '🔥 화재', color: 'orange' },
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

      {/* Incidents Feed */}
      <div className="p-4 space-y-3 pb-20">
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
      </div>

      {/* Floating Action Button */}
      <Button
        className="fixed bottom-20 right-4 w-14 h-14 rounded-full bg-red-500 hover:bg-red-600 shadow-lg"
        onClick={() => window.location.href = '/report'}
      >
        <Plus className="w-6 h-6" />
      </Button>

      <NavigationBar currentPage="home" />
    </div>
  );
};

export default Index;
