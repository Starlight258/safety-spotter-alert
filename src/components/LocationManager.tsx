import { useState, useEffect } from 'react';
import { MapPin, Home, Heart, Plus, Trash2, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { 
  getLocationSettings, 
  addHomeLocation, 
  addInterestLocation, 
  removeLocation, 
  toggleLocationActive,
  geocodeAddress 
} from '@/services/locationService';
import type { LocationSettings } from '@/types/location';

interface LocationManagerProps {
  onLocationUpdate?: () => void;
}

const LocationManager = ({ onLocationUpdate }: LocationManagerProps) => {
  const [settings, setSettings] = useState<LocationSettings>(getLocationSettings());
  const [isAddingLocation, setIsAddingLocation] = useState(false);
  const [locationType, setLocationType] = useState<'home' | 'interest'>('home');
  const [locationName, setLocationName] = useState('');
  const [locationAddress, setLocationAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [addressSuggestions, setAddressSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // 주소 자동완성 데이터
  const commonAddresses = [
    '강남구 역삼동',
    '강남구 삼성동',
    '강남구 논현동',
    '서초구 서초동',
    '서초구 반포동',
    '마포구 홍대입구',
    '마포구 상암동',
    '송파구 잠실동',
    '송파구 방이동',
    '종로구 명동',
    '종로구 인사동',
    '중구 을지로',
    '중구 명동',
    '용산구 이태원',
    '용산구 한남동',
    '영등포구 여의도',
    '구로구 구로동',
    '관악구 신림동',
    '동작구 사당동',
    '성동구 성수동'
  ];

  useEffect(() => {
    setSettings(getLocationSettings());
  }, []);

  // 주소 입력 시 자동완성 제안
  const handleAddressChange = (value: string) => {
    setLocationAddress(value);
    
    if (value.length > 0) {
      const filtered = commonAddresses.filter(addr => 
        addr.toLowerCase().includes(value.toLowerCase())
      );
      setAddressSuggestions(filtered.slice(0, 5));
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const selectSuggestion = (suggestion: string) => {
    setLocationAddress(suggestion);
    setShowSuggestions(false);
  };

  const handleAddLocation = async () => {
    if (!locationName.trim() || !locationAddress.trim()) return;
    
    setIsLoading(true);
    try {
      const coordinates = await geocodeAddress(locationAddress);
      if (!coordinates) {
        alert('주소를 찾을 수 없습니다. 다시 시도해주세요.');
        return;
      }

      if (locationType === 'home') {
        addHomeLocation(locationName, locationAddress, coordinates);
      } else {
        addInterestLocation(locationName, locationAddress, coordinates);
      }

      setSettings(getLocationSettings());
      setIsAddingLocation(false);
      setLocationName('');
      setLocationAddress('');
      setShowSuggestions(false);
      onLocationUpdate?.();
    } catch (error) {
      alert(error instanceof Error ? error.message : '위치 추가에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveLocation = (locationId: string) => {
    removeLocation(locationId);
    setSettings(getLocationSettings());
    onLocationUpdate?.();
  };

  const handleToggleActive = (locationId: string) => {
    toggleLocationActive(locationId);
    setSettings(getLocationSettings());
    onLocationUpdate?.();
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          addHomeLocation('현재 위치', '현재 위치', coords);
          setSettings(getLocationSettings());
          onLocationUpdate?.();
        },
        (error) => {
          alert('현재 위치를 가져올 수 없습니다.');
        }
      );
    }
  };

  return (
    <div className="space-y-4">
      {/* 내 집 설정 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Home className="w-5 h-5 text-blue-600" />
            내 집
          </CardTitle>
        </CardHeader>
        <CardContent>
          {settings.homeLocation ? (
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border-2 border-blue-200">
              <div className="flex-1">
                <div className="font-medium flex items-center gap-2">
                  🏠 {settings.homeLocation.name}
                </div>
                <div className="text-sm text-gray-600">{settings.homeLocation.address}</div>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={settings.homeLocation.isActive}
                  onCheckedChange={() => handleToggleActive('home')}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveLocation('home')}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <Dialog open={isAddingLocation && locationType === 'home'} onOpenChange={(open) => {
                setIsAddingLocation(open);
                if (open) setLocationType('home');
                if (!open) {
                  setLocationName('');
                  setLocationAddress('');
                  setShowSuggestions(false);
                }
              }}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full border-dashed border-2 border-blue-300 text-blue-600 hover:bg-blue-50">
                    <Plus className="w-4 h-4 mr-2" />
                    내 집 설정하기
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <Home className="w-5 h-5 text-blue-600" />
                      내 집 설정
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>이름</Label>
                      <Input
                        placeholder="우리집"
                        value={locationName}
                        onChange={(e) => setLocationName(e.target.value)}
                      />
                    </div>
                    <div className="relative">
                      <Label>주소</Label>
                      <Input
                        placeholder="강남구 역삼동 (자동완성 지원)"
                        value={locationAddress}
                        onChange={(e) => handleAddressChange(e.target.value)}
                        onFocus={() => locationAddress.length > 0 && setShowSuggestions(true)}
                      />
                      {showSuggestions && addressSuggestions.length > 0 && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-40 overflow-y-auto">
                          {addressSuggestions.map((suggestion, index) => (
                            <button
                              key={index}
                              onClick={() => selectSuggestion(suggestion)}
                              className="w-full text-left px-3 py-2 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg text-sm"
                            >
                              <Search className="w-4 h-4 inline mr-2 text-gray-400" />
                              {suggestion}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={handleAddLocation}
                        disabled={isLoading || !locationName.trim() || !locationAddress.trim()}
                        className="flex-1"
                      >
                        {isLoading ? '추가 중...' : '추가'}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={getCurrentLocation}
                        className="flex-shrink-0"
                        title="현재 위치 사용"
                      >
                        <MapPin className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 관심 지역 설정 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Heart className="w-5 h-5 text-pink-600" />
            관심 지역 (최대 3곳)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {settings.interestLocations.map((location) => (
              <div key={location.id} className="flex items-center justify-between p-3 bg-pink-50 rounded-lg border-2 border-pink-200">
                <div className="flex-1">
                  <div className="font-medium flex items-center gap-2">
                    🏡 {location.name}
                  </div>
                  <div className="text-sm text-gray-600">{location.address}</div>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={location.isActive}
                    onCheckedChange={() => handleToggleActive(location.id)}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveLocation(location.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}

            {settings.interestLocations.length < 3 && (
              <Dialog open={isAddingLocation && locationType === 'interest'} onOpenChange={(open) => {
                setIsAddingLocation(open);
                if (open) setLocationType('interest');
                if (!open) {
                  setLocationName('');
                  setLocationAddress('');
                  setShowSuggestions(false);
                }
              }}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full border-dashed border-2 border-pink-300 text-pink-600 hover:bg-pink-50">
                    <Plus className="w-4 h-4 mr-2" />
                    관심 지역 추가
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <Heart className="w-5 h-5 text-pink-600" />
                      관심 지역 추가
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>이름</Label>
                      <Input
                        placeholder="회사, 학교 등"
                        value={locationName}
                        onChange={(e) => setLocationName(e.target.value)}
                      />
                    </div>
                    <div className="relative">
                      <Label>주소</Label>
                      <Input
                        placeholder="서초구 서초동 (자동완성 지원)"
                        value={locationAddress}
                        onChange={(e) => handleAddressChange(e.target.value)}
                        onFocus={() => locationAddress.length > 0 && setShowSuggestions(true)}
                      />
                      {showSuggestions && addressSuggestions.length > 0 && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-40 overflow-y-auto">
                          {addressSuggestions.map((suggestion, index) => (
                            <button
                              key={index}
                              onClick={() => selectSuggestion(suggestion)}
                              className="w-full text-left px-3 py-2 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg text-sm"
                            >
                              <Search className="w-4 h-4 inline mr-2 text-gray-400" />
                              {suggestion}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    <Button
                      onClick={handleAddLocation}
                      disabled={isLoading || !locationName.trim() || !locationAddress.trim()}
                      className="w-full"
                    >
                      {isLoading ? '추가 중...' : '추가'}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 사용 안내 */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <h4 className="text-sm font-medium text-blue-800 mb-2">💡 사용 안내</h4>
        <ul className="text-xs text-blue-700 space-y-1">
          <li>• 설정된 위치는 지도에서 🏠🏡 아이콘으로 표시됩니다</li>
          <li>• 스위치를 끄면 지도에서 숨길 수 있습니다</li>
          <li>• 주소 입력 시 자동완성을 활용하세요</li>
          <li>• 현재 위치 버튼으로 GPS 위치를 사용할 수 있습니다</li>
        </ul>
      </div>
    </div>
  );
};

export default LocationManager;