
export interface MissingPerson {
  id: string;
  name: string;
  age: number;
  gender: 'male' | 'female';
  lastLocation: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  lastSeenTime: string;
  description?: string;
  contactInfo?: string;
  imageUrl?: string;
}
