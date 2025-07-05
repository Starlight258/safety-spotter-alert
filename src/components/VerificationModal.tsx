
import { AlertTriangle, CheckCircle, XCircle, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Incident } from '@/types/incident';

interface VerificationModalProps {
  incident: Incident;
  onVerify: (response: 'confirmed' | 'denied' | 'unsure') => void;
  onClose: () => void;
}

const VerificationModal = ({ incident, onVerify, onClose }: VerificationModalProps) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-sm w-full p-6">
        <div className="flex items-center gap-3 mb-4">
          <AlertTriangle className="w-6 h-6 text-orange-500" />
          <h3 className="text-lg font-bold">사실 확인 요청</h3>
        </div>
        
        <div className="mb-4">
          <h4 className="font-medium text-gray-900 mb-2">{incident.title}</h4>
          <p className="text-sm text-gray-600 mb-3">{incident.location}</p>
          <p className="text-sm bg-yellow-50 p-3 rounded-lg border border-yellow-200">
            이 지역에서 <strong>{incident.type === 'flood' ? '침수' : '사건'}</strong> 제보가 
            <strong> {incident.reportCount}건</strong> 접수되었습니다. 
            현장 상황을 목격하셨나요?
          </p>
        </div>

        <div className="space-y-2">
          <Button 
            onClick={() => onVerify('confirmed')}
            className="w-full bg-green-500 hover:bg-green-600 text-white"
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            네, 맞아요
          </Button>
          
          <Button 
            onClick={() => onVerify('denied')}
            variant="outline"
            className="w-full border-red-200 text-red-600 hover:bg-red-50"
          >
            <XCircle className="w-4 h-4 mr-2" />
            아니요, 못 봤어요
          </Button>
          
          <Button 
            onClick={() => onVerify('unsure')}
            variant="outline"
            className="w-full"
          >
            <HelpCircle className="w-4 h-4 mr-2" />
            잘 모르겠어요
          </Button>
        </div>

        <Button 
          onClick={onClose}
          variant="ghost" 
          className="w-full mt-3 text-gray-500"
        >
          나중에
        </Button>
      </div>
    </div>
  );
};

export default VerificationModal;
