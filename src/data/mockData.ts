
import type { Incident } from '@/types/incident';

export const mockIncidents: Incident[] = [
  {
    id: '1',
    type: 'crime',
    title: '강남역 흉기 난동 발생 - 1명 부상, 용의자 검거',
    description: '오늘 오후 2시경 강남역 2번 출구 인근에서 흉기를 든 남성이 행인을 위협하며 난동을 부렸습니다. 경찰이 신속히 출동해 용의자를 검거했으며, 부상자 1명은 병원으로 이송되었습니다.',
    location: '강남역 2번 출구',
    timestamp: '2024-01-10T14:30:00Z',
    source: 'news',
    isUrgent: true,
    trustLevel: 'high'
  },
  {
    id: '2',
    type: 'fire',
    title: '도곡동 아파트 화재 발생',
    description: '15층 건물에서 연기가 목격되고 있습니다. 소방차가 출동 중이며 주민들이 대피하고 있습니다.',
    location: '도곡동 래미안아파트',
    timestamp: '2024-01-10T13:45:00Z',
    source: 'reports',
    reportCount: 32,
    isUrgent: true,
    trustLevel: 'medium'
  },
  {
    id: '3',
    type: 'traffic',
    title: '올림픽대로 다중추돌 사고',
    description: '오후 1시경 올림픽대로 상행선에서 5중 추돌사고가 발생했습니다. 현재 2차로가 통제되고 있어 정체가 예상됩니다.',
    location: '올림픽대로 잠실대교 인근',
    timestamp: '2024-01-10T13:15:00Z',
    source: 'news',
    trustLevel: 'high'
  },
  {
    id: '4',
    type: 'crime',
    title: '초등학교 근처 수상한 남성 출몰',
    description: '방과 후 시간에 아이들에게 말을 거는 수상한 남성이 목격되고 있습니다. 학부모들의 주의가 필요합니다.',
    location: '서초초등학교 정문',
    timestamp: '2024-01-10T12:30:00Z',
    source: 'reports',
    reportCount: 3,
    trustLevel: 'low'
  },
  {
    id: '5',
    type: 'disaster',
    title: '한강 수위 상승 경보',
    description: '집중호우로 인한 한강 수위 상승으로 일부 산책로가 통제되었습니다. 강변 접근 시 주의하시기 바랍니다.',
    location: '반포한강공원',
    timestamp: '2024-01-10T11:20:00Z',
    source: 'news',
    trustLevel: 'high'
  }
];
