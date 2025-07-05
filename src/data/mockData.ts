
import type { Incident, LocationStats } from '@/types/incident';

export const mockIncidents: Incident[] = [
  {
    id: '1',
    type: 'crime',
    title: '강남역 흉기 난동 발생 - 1명 부상, 용의자 검거',
    description: '오늘 오후 2시경 강남역 2번 출구 인근에서 흉기를 든 남성이 행인을 위협하며 난동을 부렸습니다. 경찰이 신속히 출동해 용의자를 검거했으며, 부상자 1명은 병원으로 이송되었습니다.',
    location: '강남역 2번 출구',
    coordinates: { lat: 37.4979, lng: 127.0276 },
    timestamp: '2024-01-10T14:30:00Z',
    source: 'news',
    isUrgent: true,
    trustLevel: 'high',
    riskLevel: 'high',
    aiSuggestion: '이 지역은 현재 위험합니다. 가능하면 우회하고, 불가피하게 이용할 경우 주변을 주의깊게 살피세요.'
  },
  {
    id: '2',
    type: 'flood',
    title: '도곡동 침수 제보 47건 - 지하차도 출입 제한',
    description: '집중호우로 인해 도곡동 일대 도로가 침수되고 있습니다. 지하차도 진입이 위험한 상황입니다.',
    location: '도곡동 래미안아파트 일대',
    coordinates: { lat: 37.4909, lng: 127.0438 },
    timestamp: '2024-01-10T13:45:00Z',
    source: 'reports',
    reportCount: 47,
    isUrgent: true,
    trustLevel: 'medium',
    riskLevel: 'critical',
    aiSuggestion: '침수 지역입니다. 지하차도 이용을 피하고 대중교통 또는 우회로를 이용하세요.',
    verificationCount: { confirmed: 23, denied: 2, unsure: 8 }
  },
  {
    id: '3',
    type: 'subway',
    title: '지하철 2호선 신림역-서울대입구역 구간 지연',
    description: '신호 장애로 인해 약 15분간 운행이 지연되고 있습니다. 복구 작업이 진행 중입니다.',
    location: '지하철 2호선 신림-서울대입구',
    coordinates: { lat: 37.4842, lng: 126.9292 },
    timestamp: '2024-01-10T13:15:00Z',
    source: 'reports',
    reportCount: 156,
    trustLevel: 'high',
    riskLevel: 'medium',
    aiSuggestion: '대체 교통수단을 이용하거나 버스 환승을 고려해보세요.'
  },
  {
    id: '4',
    type: 'traffic',
    title: '올림픽대로 5중 추돌사고',
    description: '오후 1시경 올림픽대로 상행선에서 5중 추돌사고가 발생했습니다. 현재 2차로가 통제되고 있어 정체가 예상됩니다.',
    location: '올림픽대로 잠실대교 인근',
    coordinates: { lat: 37.5172, lng: 127.0822 },
    timestamp: '2024-01-10T13:15:00Z',
    source: 'news',
    trustLevel: 'high',
    riskLevel: 'medium',
    aiSuggestion: '이 구간은 심각한 교통체증이 예상됩니다. 한강 북쪽 도로를 이용하세요.'
  },
  {
    id: '5',
    type: 'fire',
    title: '서초구 빌딩 화재 발생',
    description: '오피스텔 15층에서 화재가 발생해 소방차가 출동했습니다. 주민 대피가 진행 중입니다.',
    location: '서초구 서초대로',
    coordinates: { lat: 37.4943, lng: 127.0176 },
    timestamp: '2024-01-10T11:20:00Z',
    source: 'emergency',
    trustLevel: 'high',
    riskLevel: 'high',
    aiSuggestion: '화재 현장 인근입니다. 우회하고 연기를 피해 주세요.'
  }
];

export const mockLocationStats: LocationStats[] = [
  {
    area: '강남구',
    incidentCount: 23,
    riskScore: 7.2,
    topIncidentType: 'traffic'
  },
  {
    area: '서초구',
    incidentCount: 18,
    riskScore: 6.8,
    topIncidentType: 'flood'
  },
  {
    area: '마포구',
    incidentCount: 15,
    riskScore: 5.9,
    topIncidentType: 'crime'
  }
];
