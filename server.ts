import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-loaded Gemini Client
let geminiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY' || apiKey.trim() === '') {
    return null;
  }
  if (!geminiClient) {
    geminiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return geminiClient;
}

// 1. Get Suppliers Directory
// Included to allow the frontend to load initial suppliers dynamically if preferred
app.get('/api/suppliers', (req, res) => {
  res.json({ success: true });
});

// Heuristic Fallback Recommendations for Pottery Materials
function getHeuristicRecommendation(input: any) {
  const { firingTempRange, technique, clayColorPref, glazeFinishPref, specialRequirements } = input;
  
  let overallAdvice = `현재 서버가 신속 결합 모드(Heuristic Rule Engine)로 동작 중입니다. 선택하신 조건 [소성온도: ${firingTempRange}, 성형기법: ${technique}, 점토색상: ${clayColorPref}, 유약선호: ${glazeFinishPref}]에 부합하는 정밀 추천 데이터입니다.`;
  
  const materials = [];
  
  // Tag clays based on technique & color
  if (technique === 'wheel') {
    if (clayColorPref === 'white') {
      materials.push({
        name: '백자청토 (Premium Porcelain)',
        category: 'Clay',
        brandOrOrigin: '중앙도재 제조',
        firingRange: '1240°C - 1280°C (Cone 6-10)',
        suggestedSuppliers: ['중앙도재 (Jungang)'],
        explanation: '철분이 극히 미량 함유되어 조형작업과 물레 성형에 아주 우수한 부드러움을 제공하는 베스트셀러 백자 점토입니다.',
        usageTips: '수축률이 약 12~14%로 다소 높은 편이므로 성형 시 굽 두께를 다소 도톰하게 잡아주고 급격한 건조를 피해야 굽 터짐을 방지합니다.'
      });
    } else if (clayColorPref === 'dark') {
      materials.push({
        name: '분청토 (Buncheong Iron Silt)',
        category: 'Clay',
        brandOrOrigin: '대원도재 유통',
        firingRange: '1200°C - 1250°C (Cone 5-7)',
        suggestedSuppliers: ['대원도재 (Daewon)'],
        explanation: '철분 반점이 자연스럽게 올라오는 전통 백토 배합 점토입니다. 빈티지하며 투박한 수공예 도자기 느낌을 낼 때 절대적입니다.',
        usageTips: '환원 소성 시 멋스러운 검은 반점을 즐길 수 있으며, 귀얄 화장토 장식 작업을 하기에 최적의 건조강도를 가집니다.'
      });
    } else {
      materials.push({
        name: '산백토 (San-Baek Fine Clay)',
        category: 'Clay',
        brandOrOrigin: '동영세라믹스 기획',
        firingRange: '1200°C - 1260°C (Cone 5-8)',
        suggestedSuppliers: ['동영세라믹스', '대원도재'],
        explanation: '운모와 작은 돌 입자가 미량 섞인 매우 대중적인 물레용 태토입니다. 수축 변형이 적어 물레 성형 입문자부터 숙련가까지 폭넓게 선택됩니다.',
        usageTips: '성형 시 거친 입자가 손을 긁을 수 있으므로 슬립(흙물)을 충분히 사용하며 작업해야 고른 두께를 만들 수 있습니다.'
      });
    }
  } else {
    // Handbuilding / Sculpture
    materials.push({
      name: '조형토 (Coarse Sculpting Clay)',
      category: 'Clay',
      brandOrOrigin: '대원도재 오리지널',
      firingRange: '1150°C - 1250°C (Cone 4-6)',
      suggestedSuppliers: ['대원도재 (Daewon)', '중앙도재'],
      explanation: '굵은 알갱이(샤모트)가 다량 섞여 있어 넓거나 높이가 있는 자유형 핸드빌딩 코일링, 판성형 시 형태 안정성이 탁월합니다.',
      usageTips: '기벽의 수분 함량이 일정하지 않으면 소성 과정에서 변형이 생기므로 판 두께를 롤러로 밀 때 수평을 견고히 맞추십시오.'
    });
    
    if (clayColorPref === 'dark' || clayColorPref === 'red') {
      materials.push({
        name: '전통 옹기토 (Traditional Ondi Clay)',
        category: 'Clay',
        brandOrOrigin: '국산 황토 배합',
        firingRange: '1100°C - 1200°C (Cone 1-4)',
        suggestedSuppliers: ['대원도재'],
        explanation: '높은 함량의 산화철과 미세 다공성 유기물이 포함되어 통기성이 우수한 숨쉬는 옹기 표현 점토입니다.',
        usageTips: '소성 온도를 너무 높이면(>1230°C) 주저앉을 수 있어 중저화도 전가마 소성을 완벽히 권장합니다.'
      });
    }
  }

  // Glazes based on finish
  if (glazeFinishPref === 'glossy') {
    materials.push({
      name: 'PC-20 Blue Rutile Series',
      category: 'Glaze',
      brandOrOrigin: 'Amaco USA',
      firingRange: '1220°C - 1240°C (Cone 5-6)',
      suggestedSuppliers: ['중앙도재', '아마코 직구'],
      explanation: '하니플럭스(Honey Flux)나 라이트세피아 위에 겹쳐 구우면 찬란한 오팔 유광 광채와 유기적인 줄무늬 흐름을 만들어줍니다.',
      usageTips: '유약이 흘러내리는 점도가 높으므로 바닥에서 약 1.5cm 지점까지는 바르지 않는 기벽 제어가 전가마 보호를 위해 필요합니다.'
    });
  } else if (glazeFinishPref === 'matte') {
    materials.push({
      name: '독일 스펙트럼 황매트유 (Matte Clay Gold)',
      category: 'Glaze',
      brandOrOrigin: 'Spectrum German',
      firingRange: '1220°C - 1250°C',
      suggestedSuppliers: ['동영세라믹스 (Dongyeong)'],
      explanation: '차분하며 은은한 누에고치 빛깔의 계란 껍데기 매트 질감을 내는 유약입니다. 식기나 머그컵 내외벽에 무난하게 잘 마감됩니다.',
      usageTips: '시유 두께가 얇으면 거친 점액 점토 느낌이 도드라지고 너무 두꺼우면 소성 후 갈라짐 현상이 일어날 수 있으니 규격에 맞는 흔들기를 준수하십시오.'
    });
  } else if (glazeFinishPref === 'crystalline') {
    materials.push({
      name: '고선명 바륨 아연 결정 유약 원료',
      category: 'Raw Material',
      brandOrOrigin: '국산 단일 산화원료',
      firingRange: '1240°C - 1280°C',
      suggestedSuppliers: ['동영세라믹스'],
      explanation: '산화아연과 크레졸 바듐을 혼합해 인위적인 하이라이트 눈꽃 결정을 가마 냉각 중 석출해 내는 핵심 화합 화공물입니다.',
      usageTips: '최고 온도 도달 후 1150°C 지점까지 매우 천천히 냉각(서냉) 시켜 결정 성장의 시간 영역을 충분히 제공해 주어야 시편이 아름답게 자라납니다.'
    });
  } else {
    materials.push({
      name: '투명 균열유 (Crackle Transparent)',
      category: 'Glaze',
      brandOrOrigin: '중앙도재 전용',
      firingRange: '1220°C - 1250°C',
      suggestedSuppliers: ['중앙도재'],
      explanation: '팽창률 차이를 극대화시켜 표면에 실 얼룩 형상의 정교한 균열(빙렬)을 의도적으로 내어 청화 백자 장식감을 연출하는 시유 재료입니다.',
      usageTips: '소성 후 바로 나오지 않더라도 가마 문을 열 때 공기를 접하며 소리로 아름답게 마감됩니다. 먹물이나 먹차액을 발라 틈새를 먹여주면 빈티지 청자 빙렬이 도드라집니다.'
    });
  }

  // Match international request if user specifies
  if (firingTempRange === 'high') {
    materials.push({
      name: 'B-Mix 10 (Cone 10 Dry/Wet Clay)',
      category: 'Clay',
      brandOrOrigin: 'Laguna Clay USA',
      firingRange: '1280°C - 1300°C (Cone 10)',
      suggestedSuppliers: ['라구나 클레이 직판', '수입 원료사'],
      explanation: '고온 환원 소성에 견디도록 유기물 함량을 최대로 높인 고가형 백색 소프트 점토입니다.',
      usageTips: '환원 구이 소성 시 매끄럽고 은은하며 묵직한 고대 사기그릇 질감을 극대화하여 연출해 냅니다.'
    });
  }

  const result: any = {
    overallAdvice: `${overallAdvice}\n사용자 요구 사항인 '${specialRequirements || '기본 성형 및 유약 밸런싱'}'을 분석한 맞춤 처방입니다. 도자기 성공률을 비약적으로 높일 수 있는 배합 가이드라인을 제공합니다.`,
    materials: materials,
    firingGuidelines: `1. 건조 단계: 건조 시 비닐로 아주 덮어 균일하지 않은 기벽 갈라짐(S-Crack)을 철저히 예방할 것을 조언합니다.\n2. 초벌(Bisque): 상온에서 980°C까지 8시간에 걸쳐 서서히 승온하며, 기물 내 잔존 결정수를 완벽히 기화 유도하십시오.\n3. 재벌(Glaze Firing): 최고 소성 온도(${firingTempRange === 'low' ? '1100°C' : firingTempRange === 'mid' ? '1240°C' : '1260-1280°C'}) 도달 후 가스의 압력을 유지한 고른 환원 작업 혹은 20분 가마 계류(Soaking)가 시유 완성도를 획정 짓습니다.`
  };
  
  return result;
}

// 2. AI Ceramics Recommendation
app.post('/api/recommend', async (req, res) => {
  try {
    const input = req.body;
    const { firingTempRange, technique, clayColorPref, glazeFinishPref, specialRequirements } = input;
    
    const client = getGeminiClient();
    if (!client) {
      // Return smart custom fallback recommendation if Gemini API key is missing
      const fallbackResult = getHeuristicRecommendation(input);
      return res.json({
        success: true,
        isFallback: true,
        data: fallbackResult
      });
    }

    // Build rich prompt for Gemini API
    const systemInstruction = `You are a professional Ceramic Architect and Clay Materials Engineer assisting potters. 
Provide highly tailored recommendations for commercial clays, glazes, raw oxides, and tools.
We are highlighting Korean standard suppliers (such as 중앙도재, 대원도재, 동영세라믹스) and premium international sellers (like Laguna Clay Co., Amaco).

Based on user inputs, you must respond with a JSON object strictly matching this TypeScript interface format:
{
  "overallAdvice": "A clear, encouraging 3-4 sentence overview of the ceramic approach (in Korean).",
  "materials": [
    {
      "name": "Exact Commercial Name (e.g., 백자청토, B-Mix 5 Clay, Velvet Underglaze, Spectrum Celadon)",
      "category": "Clay" | "Glaze" | "Raw Material" | "Tool" | "Other",
      "brandOrOrigin": "Manufacturer/Supplier Brand",
      "firingRange": "e.g., 1200°C - 1250°C (Cone 5-6)",
      "suggestedSuppliers": ["Supplier Name 1", "Supplier Name 2"],
      "explanation": "Brief description of why this material fits their requirements (in Korean).",
      "usageTips": "Practical engineering tip or glazing note to ensure success (in Korean)."
    }
  ],
  "firingGuidelines": "Specific guidelines on drying, bisque, and glaze firing curves tailored to their custom configuration (in Korean)."
}

Respond ONLY with this JSON object. No Markdown block formatting, no extra sentences. Always respond in Korean except for brand or material names where English is proper.`;

    const userPrompt = `성형 방식(Technique): ${technique} (wheel/handbuilding/sculpture/casting),
소성 온도대(Firing Temperature): ${firingTempRange} (low: ~1100°C, mid: ~1240°C, high: ~1300°C),
선호 점토 바디 색감(Clay Body Color): ${clayColorPref} (white/dark/buff/red),
유약 스타일 마감(Glaze Finish): ${glazeFinishPref} (glossy/matte/crystalline/crackle),
특수 요구 조건 및 아이디어(Special request): ${specialRequirements || '없음'}

이 정보를 바탕으로, 국내외 유수의 도재상(중앙도재, 대원도재, 동영세라믹스, Laguna Clay Co., Amaco 등)에서 실제로 판매 혹은 유통하는 최적의 점토 바디와 시너지를 낼 수 있는 완성형 유약 혹은 무기 산화물 안료 원료 조합을 추천해주고, 최상의 소성 완성도를 보증할 수 있는 공학적인 상세 가이드를 제시해주세요.`;

    const response = await client.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: userPrompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            overallAdvice: { type: Type.STRING },
            firingGuidelines: { type: Type.STRING },
            materials: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  category: { type: Type.STRING },
                  brandOrOrigin: { type: Type.STRING },
                  firingRange: { type: Type.STRING },
                  suggestedSuppliers: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  },
                  explanation: { type: Type.STRING },
                  usageTips: { type: Type.STRING }
                },
                required: ['name', 'category', 'brandOrOrigin', 'firingRange', 'suggestedSuppliers', 'explanation', 'usageTips']
              }
            }
          },
          required: ['overallAdvice', 'materials', 'firingGuidelines']
        }
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error('Gemini API returned an empty response.');
    }

    const parsedData = JSON.parse(text);
    return res.json({
      success: true,
      isFallback: false,
      data: parsedData
    });

  } catch (error: any) {
    console.error('Gemini Recommendation API Error:', error);
    // If anything fails, return the fallback rules-based engine
    const fallbackResult = getHeuristicRecommendation(req.body);
    return res.json({
      success: true,
      isFallback: true,
      errorMsg: error.message,
      data: fallbackResult
    });
  }
});

// Setup development or production environment
async function setupServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

setupServer();
