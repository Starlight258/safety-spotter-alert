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
  },
  {
    id: '6',
    type: 'crime',
    title: '홍대입구역 소매치기 사건 다발',
    description: '주말 밤 시간대 홍대입구역 일대에서 소매치기 사건이 연속 발생하고 있습니다. 특히 클럽가 주변에서 주의가 필요합니다.',
    location: '홍대입구역 9번 출구',
    coordinates: { lat: 37.5563, lng: 126.9236 },
    timestamp: '2024-01-10T22:30:00Z',
    source: 'reports',
    reportCount: 12,
    trustLevel: 'medium',
    riskLevel: 'medium',
    aiSuggestion: '야간 시간대 귀중품을 안전하게 보관하고 인적이 드문 골목길은 피하세요.'
  },
  {
    id: '7',
    type: 'traffic',
    title: '강변북로 차량 화재로 교통 통제',
    description: '강변북로 상행선에서 승용차 화재가 발생해 1차로가 통제되고 있습니다. 소방차 진입으로 정체가 심각합니다.',
    location: '강변북로 뚝섬역 인근',
    coordinates: { lat: 37.5474, lng: 127.0474 },
    timestamp: '2024-01-10T16:45:00Z',
    source: 'emergency',
    trustLevel: 'high',
    riskLevel: 'high',
    aiSuggestion: '강변북로 이용을 피하고 올림픽대로나 내부순환로를 이용하세요.'
  },
  {
    id: '8',
    type: 'disaster',
    title: '한강 수위 상승 경보',
    description: '집중호우로 인해 한강 수위가 급격히 상승하고 있습니다. 한강공원 일부 구간이 출입 통제되었습니다.',
    location: '반포한강공원',
    coordinates: { lat: 37.5133, lng: 127.0000 },
    timestamp: '2024-01-10T10:15:00Z',
    source: 'emergency',
    trustLevel: 'high',
    riskLevel: 'critical',
    aiSuggestion: '한강공원 이용을 중단하고 안전한 곳으로 대피하세요.'
  },
  {
    id: '9',
    type: 'subway',
    title: '지하철 4호선 승객 응급상황',
    description: '명동역에서 승객 응급상황으로 열차 운행이 일시 중단되었습니다. 구급차가 출동했습니다.',
    location: '지하철 4호선 명동역',
    coordinates: { lat: 37.5636, lng: 126.9822 },
    timestamp: '2024-01-10T15:20:00Z',
    source: 'reports',
    reportCount: 89,
    trustLevel: 'high',
    riskLevel: 'medium',
    aiSuggestion: '4호선 이용 시 지연을 예상하고 대체 교통수단을 고려하세요.'
  },
  {
    id: '10',
    type: 'flood',
    title: '잠실 지하상가 침수 위험',
    description: '잠실역 지하상가에 빗물이 유입되어 상점들이 임시 휴업하고 있습니다. 전기 안전사고 위험이 있습니다.',
    location: '잠실역 지하상가',
    coordinates: { lat: 37.5133, lng: 127.1000 },
    timestamp: '2024-01-10T12:00:00Z',
    source: 'reports',
    reportCount: 34,
    trustLevel: 'medium',
    riskLevel: 'high',
    aiSuggestion: '지하상가 이용을 피하고 지상 통로를 이용하세요.'
  },
  {
    id: '11',
    type: 'fire',
    title: '이태원 음식점 가스폭발',
    description: '이태원 음식점에서 가스폭발 사고가 발생했습니다. 인근 건물로 대피가 진행되고 있습니다.',
    location: '이태원역 1번 출구',
    coordinates: { lat: 37.5344, lng: 126.9944 },
    timestamp: '2024-01-10T19:30:00Z',
    source: 'emergency',
    trustLevel: 'high',
    riskLevel: 'critical',
    aiSuggestion: '이태원 일대 접근을 금지하고 안전거리를 유지하세요.'
  },
  {
    id: '12',
    type: 'crime',
    title: '종로 보이스피싱 현장 검거',
    description: '종로구 일대에서 보이스피싱 조직이 검거되었습니다. 피해자들의 신고가 이어지고 있습니다.',
    location: '종로3가역 인근',
    coordinates: { lat: 37.5703, lng: 126.9910 },
    timestamp: '2024-01-10T14:00:00Z',
    source: 'news',
    trustLevel: 'high',
    riskLevel: 'low',
    aiSuggestion: '의심스러운 전화나 문자에 주의하고 개인정보를 절대 알려주지 마세요.'
  },
  {
    id: '13',
    type: 'traffic',
    title: '성수대교 공사로 차선 축소',
    description: '성수대교에서 긴급 보수공사가 진행되어 2차로가 1차로로 축소되었습니다. 심각한 정체가 예상됩니다.',
    location: '성수대교',
    coordinates: { lat: 37.5444, lng: 127.0374 },
    timestamp: '2024-01-10T08:00:00Z',
    source: 'news',
    trustLevel: 'high',
    riskLevel: 'medium',
    aiSuggestion: '성수대교 이용을 피하고 한남대교나 동호대교를 이용하세요.'
  },
  {
    id: '14',
    type: 'disaster',
    title: '강남 정전 사고',
    description: '강남구 일대에 대규모 정전이 발생했습니다. 신호등과 엘리베이터 운행이 중단되었습니다.',
    location: '강남구 테헤란로',
    coordinates: { lat: 37.5009, lng: 127.0370 },
    timestamp: '2024-01-10T17:15:00Z',
    source: 'emergency',
    trustLevel: 'high',
    riskLevel: 'high',
    aiSuggestion: '엘리베이터 이용을 피하고 계단을 이용하세요. 신호등이 꺼진 교차로에서 특히 주의하세요.'
  },
  {
    id: '15',
    type: 'subway',
    title: '지하철 1호선 시스템 장애',
    description: '1호선 전 구간에서 신호 시스템 장애로 운행이 지연되고 있습니다. 복구 시간은 미정입니다.',
    location: '지하철 1호선 전 구간',
    coordinates: { lat: 37.5665, lng: 126.9780 },
    timestamp: '2024-01-10T07:30:00Z',
    source: 'emergency',
    trustLevel: 'high',
    riskLevel: 'high',
    aiSuggestion: '1호선 이용을 피하고 버스나 다른 지하철 노선을 이용하세요.'
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