
import { GoogleGenerativeAI } from '@google/generative-ai';
import type { Incident } from '@/types/incident';

let genAI: GoogleGenerativeAI | null = null;

export const initializeGemini = (apiKey: string) => {
  genAI = new GoogleGenerativeAI(apiKey);
};

export const analyzeIncidentRisk = async (incident: Incident): Promise<string> => {
  if (!genAI) {
    throw new Error('Gemini API가 초기화되지 않았습니다.');
  }

  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

  const prompt = `
다음 사건 정보를 분석하고 시민에게 실용적인 행동 제안을 한 문장으로 제공해주세요:

사건 유형: ${incident.type}
제목: ${incident.title}
위치: ${incident.location}
설명: ${incident.description}
위험도: ${incident.riskLevel}
출처: ${incident.source}
제보 수: ${incident.reportCount || 0}건

응답은 다음 형식으로 해주세요:
"[구체적인 행동 제안 한 문장]"

예시: "이 지역 우회를 권장하며, 가급적 대중교통을 이용하세요."
`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text().replace(/"/g, '').trim();
  } catch (error) {
    console.error('Gemini AI 분석 실패:', error);
    return '현재 상황을 주의 깊게 살펴보시고 안전한 경로를 이용하세요.';
  }
};

export const generateIncidentSummary = async (incidents: Incident[]): Promise<string> => {
  if (!genAI) {
    throw new Error('Gemini API가 초기화되지 않았습니다.');
  }

  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

  const incidentSummary = incidents.slice(0, 5).map(inc => 
    `${inc.type}: ${inc.title} (${inc.location})`
  ).join('\n');

  const prompt = `
다음은 현재 지역의 주요 사건들입니다:

${incidentSummary}

이 정보를 바탕으로 현재 지역의 전체적인 안전 상황을 2-3문장으로 요약해주세요.
시민들이 알아야 할 주요 주의사항을 포함해주세요.
`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text().trim();
  } catch (error) {
    console.error('Gemini AI 요약 실패:', error);
    return '현재 지역에서 여러 사건이 보고되고 있습니다. 외출 시 주의하시기 바랍니다.';
  }
};
