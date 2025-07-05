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

  useEffect(() => {
    setSettings(getLocationSettings());
  }, []);

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
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div className="flex-1">
                <div className="font-medium">{settings.homeLocation.name}</div>
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
              }}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    내 집 설정하기
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>내 집 설정</DialogTitle>
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
                    <div>
                      <Label>주소</Label>
                      <Input
                        placeholder="강남구 역삼동"
                        value={locationAddress}
                        onChange={(e) => setLocationAddress(e.target.value)}
                      />
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
              <div key={location.id} className="flex items-center justify-between p-3 bg-pink-50 rounded-lg">
                <div className="flex-1">
                  <div className="font-medium">{location.name}</div>
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
              }}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    관심 지역 추가
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>관심 지역 추가</DialogTitle>
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
                    <div>
                      <Label>주소</Label>
                      <Input
                        placeholder="서초구 서초동"
                        value={locationAddress}
                        onChange={(e) => setLocationAddress(e.target.value)}
                      />
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
    </div>
  );
};

export default LocationManager;