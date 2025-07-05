
import { useState } from 'react';
import { ArrowLeft, MapPin, Camera, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import NavigationBar from '@/components/NavigationBar';

const Report = () => {
  const [selectedType, setSelectedType] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const incidentTypes = [
    { id: 'crime', label: '범죄', icon: '🔪', color: 'bg-red-100 border-red-200 text-red-700' },
    { id: 'traffic', label: '교통사고', icon: '🚗', color: 'bg-blue-100 border-blue-200 text-blue-700' },
    { id: 'fire', label: '화재', icon: '🔥', color: 'bg-orange-100 border-orange-200 text-orange-700' },
    { id: 'disaster', label: '재난', icon: '🌪', color: 'bg-purple-100 border-purple-200 text-purple-700' },
    { id: 'other', label: '기타', icon: '⚠️', color: 'bg-gray-100 border-gray-200 text-gray-700' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedType || !location || !description) return;
    
    setIsSubmitting(true);
    
    // 실제 구현시에는 API 호출
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    alert('제보가 접수되었습니다. 감사합니다!');
    setIsSubmitting(false);
    
    // 홈으로 돌아가기
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-4 py-3 flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-bold text-gray-900">사건 제보하기</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-4 space-y-6">
        {/* 사건 유형 선택 */}
        <div>
          <Label className="text-base font-medium text-gray-900 mb-3 block">
            사건 유형을 선택해주세요 *
          </Label>
          <div className="grid grid-cols-2 gap-3">
            {incidentTypes.map(type => (
              <button
                key={type.id}
                type="button"
                onClick={() => setSelectedType(type.id)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  selectedType === type.id 
                    ? type.color + ' border-current' 
                    : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                <div className="text-2xl mb-1">{type.icon}</div>
                <div className="font-medium">{type.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* 위치 입력 */}
        <div>
          <Label className="text-base font-medium text-gray-900 mb-3 block">
            발생 위치 *
          </Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <Input
              placeholder="예: 강남역 2번 출구 앞"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="pl-10"
              required
            />
          </div>
          <Button 
            type="button" 
            variant="outline" 
            size="sm"
            className="mt-2 text-blue-600 border-blue-200"
          >
            현재 위치 사용
          </Button>
        </div>

        {/* 상세 설명 */}
        <div>
          <Label className="text-base font-medium text-gray-900 mb-3 block">
            상세 설명 *
          </Label>
          <Textarea
            placeholder="목격한 상황을 자세히 적어주세요..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            required
          />
        </div>

        {/* 사진 첨부 (선택) */}
        <div>
          <Label className="text-base font-medium text-gray-900 mb-3 block">
            사진/영상 첨부 (선택)
          </Label>
          <Button 
            type="button" 
            variant="outline" 
            className="w-full p-4 border-dashed"
          >
            <Camera className="w-5 h-5 mr-2" />
            사진 또는 영상 추가
          </Button>
        </div>

        {/* 주의사항 */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-yellow-800 mb-1">제보 시 주의사항</p>
              <ul className="text-yellow-700 space-y-1">
                <li>• 허위 제보는 법적 처벌을 받을 수 있습니다</li>
                <li>• 긴급 상황시에는 112, 119에 먼저 신고하세요</li>
                <li>• 개인정보나 민감정보는 포함하지 마세요</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 제출 버튼 */}
        <Button 
          type="submit" 
          className="w-full bg-red-500 hover:bg-red-600 h-12 text-lg font-medium"
          disabled={!selectedType || !location || !description || isSubmitting}
        >
          {isSubmitting ? '제보 중...' : '제보하기'}
        </Button>
      </form>

      <NavigationBar currentPage="report" />
    </div>
  );
};

export default Report;
