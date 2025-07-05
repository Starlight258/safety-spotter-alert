import { useState } from 'react';
import { BarChart3, TrendingUp, MapPin, Award, Calendar, Smartphone } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import NavigationBar from '@/components/NavigationBar';
import { mockLocationStats } from '@/data/mockData';

const Stats = () => {
  const userStats = {
    reportsSubmitted: 12,
    verificationCount: 35,
    impactScore: 87,
    badge: '정찰자',
    weeklyRank: 3
  };

  const getIncidentTypeIcon = (type: string) => {
    const icons = {
      traffic: '🚗',
      flood: '🌊',
      crime: '🔪',
      fire: '🔥',
      subway: '🚇'
    };
    return icons[type as keyof typeof icons] || '⚠️';
  };

  const getRiskColor = (score: number) => {
    if (score >= 8) return 'text-red-600 bg-red-50';
    if (score >= 6) return 'text-orange-600 bg-orange-50';
    if (score >= 4) return 'text-yellow-600 bg-yellow-50';
    return 'text-green-600 bg-green-50';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-4 py-3">
          <h1 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            통계 & 리포트
          </h1>
          <p className="text-sm text-gray-500 mt-1">내 활동과 지역 안전 현황</p>
        </div>
      </div>

      <div className="p-4 space-y-4 pb-20">
        {/* 사용자 통계 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5 text-yellow-600" />
              내 활동 통계
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{userStats.reportsSubmitted}</div>
                <div className="text-sm text-blue-600">제보 건수</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{userStats.verificationCount}</div>
                <div className="text-sm text-green-600">검증 참여</div>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{userStats.impactScore}</div>
                <div className="text-sm text-purple-600">영향력 점수</div>
              </div>
              <div className="text-center p-3 bg-yellow-50 rounded-lg">
                <div className="text-lg font-bold text-yellow-600">#{userStats.weeklyRank}</div>
                <div className="text-sm text-yellow-600">주간 순위</div>
              </div>
            </div>
            
            <div className="mt-4 text-center">
              <Badge variant="outline" className="bg-yellow-100 text-yellow-700 border-yellow-300">
                🏆 {userStats.badge}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* 지역별 위험도 순위 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-red-600" />
              지역별 위험도 Top 3
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockLocationStats.map((stat, index) => (
                <div key={stat.area} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                      index === 0 ? 'bg-red-500' : index === 1 ? 'bg-orange-500' : 'bg-yellow-500'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium">{stat.area}</div>
                      <div className="text-sm text-gray-500 flex items-center gap-2">
                        {getIncidentTypeIcon(stat.topIncidentType)} 
                        사건 {stat.incidentCount}건
                      </div>
                    </div>
                  </div>
                  <Badge className={getRiskColor(stat.riskScore)}>
                    위험도 {stat.riskScore}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 제보 집중 지역 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-orange-600" />
              제보 집중 지역
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-red-800">🌊 도곡동 일대</h4>
                  <Badge className="bg-red-100 text-red-700">긴급</Badge>
                </div>
                <p className="text-sm text-red-600">침수 제보 47건, 지하차도 진입 위험</p>
              </div>
              
              <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-orange-800">🚇 지하철 2호선</h4>
                  <Badge className="bg-orange-100 text-orange-700">주의</Badge>
                </div>
                <p className="text-sm text-orange-600">신림-서울대입구 구간 15분 지연</p>
              </div>

              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-yellow-800">🔪 강남역 일대</h4>
                  <Badge className="bg-yellow-100 text-yellow-700">주의</Badge>
                </div>
                <p className="text-sm text-yellow-600">범죄 제보 23건, 야간 시간대 주의</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 주간 트렌드 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              이번 주 동네 안전 리포트
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">전체 사건 수</span>
                <span className="font-medium">143건 (+12%)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">가장 많은 유형</span>
                <span className="font-medium">🚗 교통사고 (34%)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">위험 시간대</span>
                <span className="font-medium">오후 6-8시</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">안전도 평가</span>
                <Badge className="bg-yellow-100 text-yellow-700">보통</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 앱 사용 통계 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-purple-600" />
              앱 사용 통계
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">총 사용 시간</span>
                <span className="font-medium">24시간 32분</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">가장 많이 본 지역</span>
                <span className="font-medium">강남구 역삼동</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">알림 수신</span>
                <span className="font-medium">156건</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">앱 설치일</span>
                <span className="font-medium">2024.01.01</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <NavigationBar currentPage="stats" />
    </div>
  );
};

export default Stats;