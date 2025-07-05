
import { useState } from 'react';
import { MapPin, Bell, Shield, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import NavigationBar from '@/components/NavigationBar';

const Settings = () => {
  const [locations, setLocations] = useState([
    { id: 1, name: '현재 위치', active: true },
    { id: 2, name: '강남구 역삼동', active: true }
  ]);
  
  const [notifications, setNotifications] = useState({
    news: true,
    reports: false,
    crime: true,
    traffic: true,
    fire: true,
    disaster: true
  });

  const toggleNotification = (key: string) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-4 py-3">
          <h1 className="text-lg font-bold text-gray-900">설정</h1>
        </div>
      </div>

      <div className="space-y-6">
        {/* 관심 지역 설정 */}
        <div className="bg-white">
          <div className="px-4 py-3 border-b">
            <h2 className="font-semibold text-gray-900 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-gray-600" />
              관심 지역 설정
            </h2>
            <p className="text-sm text-gray-500 mt-1">최대 3곳까지 설정 가능합니다</p>
          </div>
          
          <div className="p-4 space-y-3">
            {locations.map(location => (
              <div key={location.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">{location.name}</span>
                <Switch 
                  checked={location.active}
                  onCheckedChange={(checked) => {
                    setLocations(prev => prev.map(loc => 
                      loc.id === location.id ? { ...loc, active: checked } : loc
                    ));
                  }}
                />
              </div>
            ))}
            
            {locations.length < 3 && (
              <Button variant="outline" className="w-full">
                + 지역 추가하기
              </Button>
            )}
          </div>
        </div>

        {/* 알림 설정 */}
        <div className="bg-white">
          <div className="px-4 py-3 border-b">
            <h2 className="font-semibold text-gray-900 flex items-center gap-2">
              <Bell className="w-5 h-5 text-gray-600" />
              알림 설정
            </h2>
          </div>
          
          <div className="p-4 space-y-4">
            {/* 알림 소스 */}
            <div>
              <h3 className="font-medium text-gray-900 mb-3">알림 소스</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">뉴스 속보</Label>
                    <p className="text-sm text-gray-500">신뢰도 높은 언론사 속보</p>
                  </div>
                  <Switch 
                    checked={notifications.news}
                    onCheckedChange={() => toggleNotification('news')}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">사용자 제보</Label>
                    <p className="text-sm text-gray-500">30건 이상 제보 시 알림</p>
                  </div>
                  <Switch 
                    checked={notifications.reports}
                    onCheckedChange={() => toggleNotification('reports')}
                  />
                </div>
              </div>
            </div>

            {/* 사건 유형별 알림 */}
            <div>
              <h3 className="font-medium text-gray-900 mb-3">사건 유형별 알림</h3>
              <div className="space-y-3">
                {[
                  { key: 'crime', label: '🔪 범죄', desc: '절도, 강도, 폭행 등' },
                  { key: 'traffic', label: '🚗 교통사고', desc: '차량 사고, 도로 통제' },
                  { key: 'fire', label: '🔥 화재', desc: '건물 화재, 산불 등' },
                  { key: 'disaster', label: '🌪 재난', desc: '태풍, 지진, 침수 등' }
                ].map(type => (
                  <div key={type.key} className="flex items-center justify-between">
                    <div>
                      <Label className="font-medium">{type.label}</Label>
                      <p className="text-sm text-gray-500">{type.desc}</p>
                    </div>
                    <Switch 
                      checked={notifications[type.key as keyof typeof notifications]}
                      onCheckedChange={() => toggleNotification(type.key)}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 기타 설정 */}
        <div className="bg-white">
          <div className="px-4 py-3 border-b">
            <h2 className="font-semibold text-gray-900 flex items-center gap-2">
              <Shield className="w-5 h-5 text-gray-600" />
              기타
            </h2>
          </div>
          
          <div className="p-4 space-y-1">
            {[
              '개인정보 처리방침',
              '서비스 이용약관',
              '제보 가이드라인',
              '문의하기'
            ].map(item => (
              <button key={item} className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                <span className="font-medium">{item}</span>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>
            ))}
          </div>
        </div>
      </div>

      <NavigationBar currentPage="settings" />
    </div>
  );
};

export default Settings;
