import type { SavedLocation, LocationSettings } from '@/types/location';

const STORAGE_KEY = 'safety_spotter_locations';

export const getLocationSettings = (): LocationSettings => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  
  return {
    interestLocations: [],
    showOnMap: true,
    notificationsEnabled: true
  };
};

export const saveLocationSettings = (settings: LocationSettings): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
};

export const addHomeLocation = (name: string, address: string, coordinates: { lat: number; lng: number }): void => {
  const settings = getLocationSettings();
  const homeLocation: SavedLocation = {
    id: 'home',
    name,
    address,
    coordinates,
    type: 'home',
    isActive: true,
    createdAt: new Date().toISOString()
  };
  
  settings.homeLocation = homeLocation;
  saveLocationSettings(settings);
};

export const addInterestLocation = (name: string, address: string, coordinates: { lat: number; lng: number }): void => {
  const settings = getLocationSettings();
  
  if (settings.interestLocations.length >= 3) {
    throw new Error('최대 3곳까지만 설정할 수 있습니다.');
  }
  
  const interestLocation: SavedLocation = {
    id: `interest_${Date.now()}`,
    name,
    address,
    coordinates,
    type: 'interest',
    isActive: true,
    createdAt: new Date().toISOString()
  };
  
  settings.interestLocations.push(interestLocation);
  saveLocationSettings(settings);
};

export const removeLocation = (locationId: string): void => {
  const settings = getLocationSettings();
  
  if (locationId === 'home') {
    settings.homeLocation = undefined;
  } else {
    settings.interestLocations = settings.interestLocations.filter(loc => loc.id !== locationId);
  }
  
  saveLocationSettings(settings);
};

export const toggleLocationActive = (locationId: string): void => {
  const settings = getLocationSettings();
  
  if (locationId === 'home' && settings.homeLocation) {
    settings.homeLocation.isActive = !settings.homeLocation.isActive;
  } else {
    const location = settings.interestLocations.find(loc => loc.id === locationId);
    if (location) {
      location.isActive = !location.isActive;
    }
  }
  
  saveLocationSettings(settings);
};

// 좌표 기반으로 주소 검색 (실제로는 Geocoding API 사용)
export const geocodeAddress = async (address: string): Promise<{ lat: number; lng: number } | null> => {
  // 실제 구현에서는 Google Geocoding API 또는 카카오 주소 API 사용
  // 여기서는 시뮬레이션
  const mockAddresses: Record<string, { lat: number; lng: number }> = {
    '강남구 역삼동': { lat: 37.5009, lng: 127.0370 },
    '서초구 서초동': { lat: 37.4943, lng: 127.0176 },
    '마포구 홍대입구': { lat: 37.5563, lng: 126.9236 },
    '송파구 잠실동': { lat: 37.5133, lng: 127.1000 },
    '종로구 명동': { lat: 37.5636, lng: 126.9822 }
  };
  
  const normalizedAddress = address.trim();
  for (const [key, coords] of Object.entries(mockAddresses)) {
    if (normalizedAddress.includes(key) || key.includes(normalizedAddress)) {
      return coords;
    }
  }
  
  return null;
};