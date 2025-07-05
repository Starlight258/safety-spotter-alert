export interface SavedLocation {
  id: string;
  name: string;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  type: 'home' | 'interest';
  isActive: boolean;
  createdAt: string;
}

export interface LocationSettings {
  homeLocation?: SavedLocation;
  interestLocations: SavedLocation[];
  showOnMap: boolean;
  notificationsEnabled: boolean;
}