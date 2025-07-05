
import { useState } from 'react';
import { Brain, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { initializeGemini } from '@/services/geminiService';

interface AISettingsProps {
  onApiKeySet: () => void;
}

const AISettings = ({ onApiKeySet }: AISettingsProps) => {
  const [apiKey, setApiKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSaveApiKey = async () => {
    if (!apiKey.trim()) return;
    
    setIsLoading(true);
    try {
      initializeGemini(apiKey);
      localStorage.setItem('gemini_api_key', apiKey);
      onApiKeySet();
    } catch (error) {
      console.error('API 키 설정 실패:', error);
      alert('API 키 설정에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-blue-600" />
          AI 서비스 설정
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Google Gemini API 키
          </label>
          <Input
            type="password"
            placeholder="API 키를 입력하세요"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
          />
        </div>
        
        <div className="text-xs text-gray-500 space-y-1">
          <p>• Google AI Studio에서 무료 API 키를 생성할 수 있습니다</p>
          <p>• API 키는 브라우저에만 저장되며 안전하게 관리됩니다</p>
        </div>
        
        <div className="flex gap-2">
          <Button 
            onClick={handleSaveApiKey}
            disabled={!apiKey.trim() || isLoading}
            className="flex-1"
          >
            {isLoading ? '설정 중...' : '저장'}
          </Button>
          <a
            href="https://makersuite.google.com/app/apikey"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0"
          >
            <Button variant="outline" size="sm">
              API 키 생성
            </Button>
          </a>
        </div>
      </CardContent>
    </Card>
  );
};

export default AISettings;
