
import type { MissingPerson } from '@/types/missing';

export const mockMissingPersons: MissingPerson[] = [
  {
    id: 'missing-1',
    name: '김OO',
    age: 8,
    gender: 'male',
    lastLocation: '강남역 2번 출구',
    coordinates: { lat: 37.4979, lng: 127.0276 },
    lastSeenTime: '2024-01-10T12:30:00Z',
    description: '파란색 티셔츠, 검은색 반바지 착용'
  },
  {
    id: 'missing-2', 
    name: '이OO',
    age: 65,
    gender: 'female',
    lastLocation: '서초구 서초동',
    coordinates: { lat: 37.4943, lng: 127.0176 },
    lastSeenTime: '2024-01-10T09:15:00Z',
    description: '치매 환자, 흰색 원피스 착용'
  },
  {
    id: 'missing-3',
    name: '박OO',
    age: 12,
    gender: 'female',
    lastLocation: '도곡동 래미안아파트',
    coordinates: { lat: 37.4909, lng: 127.0438 },
    lastSeenTime: '2024-01-10T15:45:00Z',
    description: '분홍색 가방, 노란색 모자 착용'
  }
];
