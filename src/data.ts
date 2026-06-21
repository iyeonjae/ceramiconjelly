import { Supplier, InventoryItem, SpecimenTestTile } from './types';

export const INITIAL_SUPPLIERS: Supplier[] = [
  {
    id: 's-jungang',
    name: '중앙도재 (Jungang Ceramic Supplies)',
    isInternational: false,
    specialty: ['백자토', '산백토', '수입 글레이즈', '도예 도구', '전기로'],
    contact: '02-744-1233',
    address: '서울특별시 종로구 인사동길 15',
    website: 'http://www.jungangceramic.com',
    description: '인사동에 위치한 오랜 역사와 신뢰의 한국 대표 도재상입니다. 자체 제작한 고품질 백자토와 다채로운 유약 라이너, 글로벌 명품 가마 브랜드 수입 유통을 전문으로 합니다.',
    featuredProducts: ['태토 - 백자청토 (20kg)', '미국 Amaco Celadon Glazes Series', '중앙 전용 백자유약']
  },
  {
    id: 's-daewon',
    name: '대원도재 (Daewon Ceramic)',
    isInternational: false,
    specialty: ['옹기토', '조형토', '청자토', '석고틀', '각종 소성 소모품'],
    contact: '02-764-5551',
    address: '서울특별시 종로구 삼일대로30길 21',
    website: 'http://www.daewonpottery.com',
    description: '대형 성형틀, 석고 및 전통 조소 재료 라인업이 뛰어난 도재상입니다. 대용량 클레이 바디와 한국적 표현을 살릴 수 있는 옹기토 세트를 합리적인 가격에 유통하고 있습니다.',
    featuredProducts: ['고강도 석고 분말 H-3', '전통 대원 옹기토 (20kg)', '안료 및 산화철 시리즈']
  },
  {
    id: 's-dongyeong',
    name: '동영세라믹스 (Dongyeong Ceramics)',
    isInternational: false,
    specialty: ['외산 소성 재료', '독일 스펙트럼 유약', '수입 안료', '전동물레'],
    contact: '031-638-3455',
    address: '경기도 이천시 신둔면 도자예술로 6번길',
    website: 'http://www.dycustom.co.kr',
    description: '한국의 대표 도예 도시 이천 신둔에 대규모 창고형 쇼룸을 보유한 도재상입니다. 독일 Spectrum 유약, 시마포(Shimpo) 전동 물레 등의 장비 및 고화도 유약 원료에 강점이 있습니다.',
    featuredProducts: ['Spectrum 흐름유약 시리즈', 'Nidec-Shimpo VL-Whisper 전동물레', '독일 아르질라 점토']
  },
  {
    id: 's-laguna',
    name: '라구나 클레이 (Laguna Clay Co., USA)',
    isInternational: true,
    specialty: ['B-Mix 5/10 Clay', 'Coleman Porcelain', 'Raku Clay', 'Reduction glazes'],
    contact: '+1-800-452-4862',
    address: '14400 Lomitas Ave, City of Industry, CA 91746, USA',
    website: 'https://www.lagunaclay.com',
    description: '전 세계 최고 수준의 점토 배합을 자랑하는 미국의 글로벌 탑 도재상입니다. 특히 투명성과 작업성이 균형을 이루는 B-Mix 점토 시리즈와 래쿠 특화 점토는 국내 프로 작가들 사이에서도 직구 열풍을 일으키고 있습니다.',
    featuredProducts: ['B-Mix 5 (Cone 5 Clays)', 'Coleman Porcelain Cone 10', 'Laguna Dry Glazes']
  },
  {
    id: 's-amaco',
    name: '아마코 (Amaco - American Art Clay Co., USA)',
    isInternational: true,
    specialty: ['Potters Choice Glazes', 'Underglazes (Velvet Series)', 'Brent Wheels'],
    contact: '+1-800-374-1600',
    address: '6060 Guion Rd, Indianapolis, IN 46254, USA',
    website: 'https://www.amaco.com',
    description: '가정 및 전문 공방용 하이엔드 액상 유약 분야의 압도적인 리더입니다. 특히 벨벳 언더글레이즈(Velvet Underglaze)와 포터스 초이스(PC) 브러싱 유약은 붓질만으로 완성도 높은 오버레이 효과를 내어 많은 도예가들에게 사랑받고 있습니다.',
    featuredProducts: ['Amaco Velvet Underglazes (V-360-391)', 'Potter\'s Choice PC-20 Blue Rutile', 'Brent C Wheel']
  }
];

export const INITIAL_INVENTORY: InventoryItem[] = [
  {
    id: 'inv-1',
    name: '백자청토 (Jungang)',
    category: 'Clay',
    supplier: '중앙도재',
    firingTemp: '1240°C - 1280°C (Cone 6-10)',
    stockQuantity: 120, // 6 boxes (20kg each)
    unit: 'kg',
    stockAlertThreshold: 40,
    lastUpdated: '2026-06-20',
    notes: '물레 및 조형 겸용 프리미엄 백자토. 철분이 극히 적어 투명한 색 발현.'
  },
  {
    id: 'inv-2',
    name: '산백토 (Coarse)',
    category: 'Clay',
    supplier: '대원도재',
    firingTemp: '1200°C - 1250°C (Cone 5-6)',
    stockQuantity: 60,
    unit: 'kg',
    stockAlertThreshold: 20,
    lastUpdated: '2026-06-19',
    notes: '모래 알갱이가 섞여 있어 손성형 및 큰 조형물 성형 시 주저앉지 않음.'
  },
  {
    id: 'inv-3',
    name: 'PC-20 Blue Rutile Glaze (1 Gallon)',
    category: 'Glaze',
    supplier: '아마코 (중앙수입)',
    firingTemp: '1220°C - 1240°C (Cone 5-6)',
    stockQuantity: 2.5,
    unit: 'L',
    stockAlertThreshold: 1.0,
    lastUpdated: '2026-06-18',
    notes: '두껍게 시유하면 깊은 푸른색과 오팔빛 흐름이 발생함. 브러싱 유기적 레이어 생성에 최적.'
  },
  {
    id: 'inv-4',
    name: '산화코발트 (Cobalt Oxide)',
    category: 'Raw Material',
    supplier: '동영세라믹스',
    firingTemp: '전 온도대 적용 대',
    stockQuantity: 500,
    unit: 'g',
    stockAlertThreshold: 100,
    lastUpdated: '2026-06-15',
    notes: '아주 소량만 첨가해도 진한 청색(청화)을 발현하는 전통 천연 안료 금속 산화물.'
  },
  {
    id: 'inv-5',
    name: '프리미엄 굽칼 (Trimming Tool No.8)',
    category: 'Tool',
    supplier: '중앙도재',
    firingTemp: '해당 없음',
    stockQuantity: 3,
    unit: 'piece',
    stockAlertThreshold: 1,
    lastUpdated: '2026-06-10',
    notes: '굽 깎기용 고탄소강 굽칼. 물레 깎기 필수품.'
  }
];

export const INITIAL_SPECIMENS: SpecimenTestTile[] = [
  {
    id: 'tile-1',
    title: '백자토 위 산청 매트유 & 코발트 하이라이트',
    author: '김도예 (PorcelainLover)',
    authorEmail: 'kim@ceramics.com',
    clayBody: '소백토 (White Clay)',
    glazeName: '자체 배합 매트 투명유 + 산화코발트 1% 첨가 라이너',
    firingType: '산화채성 (Oxidation)',
    firingTemp: '1240°C',
    coneValue: 'Cone 6',
    description: '소백토의 밝은 백색 바디 위에 0.6mm 두께로 매트 투명유를 시유하고, 림 부분에는 스폰지로 산화코발트 희석액을 가볍게 터치해 시각적 포인트를 주었습니다. 핀홀(기포 자국)을 방지하기 위해 1240°C 최고 온도에서 20분간 균열 유지(Soaking)를 거쳤습니다.',
    knowHowTips: '스폰징 할 때 스폰지의 물기를 완전히 짜내지 않으면 오버레이 안료가 아래로 흘러내려 의도치 않은 얼룩이 생길 수 있으니 붓끝이나 거친 스모크 스레이로 드라이하게 올리는 것을 추천합니다.',
    likes: 24,
    createdAt: '2026-06-18',
    comments: [
      { id: 'c-1', author: '이세라', content: '색감이 너무 오묘하고 고급스럽네요! 소성 스케줄 혹시 조금 더 자세히 알 수 있을까요?', createdAt: '2026-06-19' },
      { id: 'c-2', author: '한울', content: '공유해주신 팁대로 드라이 브러시로 테스트해보니까 저도 드디어 코발트 번짐 현상을 해결했어요 감사해요!', createdAt: '2026-06-20' }
    ]
  },
  {
    id: 'tile-2',
    title: '분청토 위 분청 가루장 기법과 동영 황토매트 매칭',
    author: '박공방 (Studio_Park)',
    authorEmail: 'park@potter.kr',
    clayBody: '분청토 (Buncheong Iron Silt)',
    glazeName: '동영 황토 매트유 (DY-204)',
    firingType: '환원채성 (Reduction)',
    firingTemp: '1250°C',
    coneValue: 'Cone 6-7',
    description: '분청토 성형 후 완전히 건조되기 전 화장토를 귀얄 붓으로 넓게 도포한 후, 초벌을 진행했습니다. 재벌 소성 시 가스 가마 환원 채성으로 구웠더니 화장토 두께 편차에 따라 철분 얼룩이 멋지게 올라왔으며, 동영 오리지널 황토 매트유가 이를 차분하게 눌러 주었습니다.',
    knowHowTips: '귀얄 기법을 쓸 때는 화장토의 농도가 관건입니다. 생크림 농도 정도로 되직하게 해서 슥 바르면 일필휘지의 붓 자국이 더 선명하고 러프하게 살아나 빈티지한 아름다움을 가져갈 수 있습니다.',
    likes: 18,
    createdAt: '2026-06-14',
    comments: [
      { id: 'c-3', author: '토기인생', content: '역시 환원 가마 특유의 철분 발색이 극대화된 시편이네요! 멋집니다.', createdAt: '2026-06-15' }
    ]
  },
  {
    id: 'tile-3',
    title: 'B-Mix 5 위 아마코 블루 루틸 & 허니 플럭스 이중 시유',
    author: 'Chloe_Clay',
    authorEmail: 'chloe@lagunafan.com',
    clayBody: 'Laguna B-Mix 5 (Cone 5)',
    glazeName: 'Amaco Honey Flux (PC-17) 위 PC-20 Blue Rutile 오버레이 (3레이어)',
    firingType: '산화채성 (Oxidation)',
    firingTemp: '1220°C',
    coneValue: 'Cone 5',
    description: '미국 도예가들 사이에서 대유행인 콤비네이션 시편입니다. 라구나 비믹스 5 점토 위에 먼저 하니 플럭스를 2번 붓질 소성 전에 바르고 건조한 후, 블루 루틸을 상단 1/2 지점에 3회 덧칠해 흘러내림(Runny Flux) 효과를 보았습니다. 전동 가마 산화 소성으로 구현했습니다.',
    knowHowTips: '블루 루틸은 하니 플럭스 위에서 매우 크게 반응하여 흘러내립니다. 작품 전부에 다 칠하지 마시고, 상단 3분의 1 지점에만 덧칠해야 바닥 선반에 유약이 흘러내려 작품을 버리지 않고 가마 열선을 아끼는 방법성 장치가 됩니다.',
    likes: 31,
    createdAt: '2026-06-11',
    comments: [
      { id: 'c-4', author: '도자기초짜', content: '이 시편 대박이네요! 전가마 산화로도 이런 환원가마 같은 결정 흐름이 나오는군요.', createdAt: '2026-06-12' },
      { id: 'c-5', author: '인사동방랑자', content: '비믹스 점토 특유의 부드러움과 환상의 찰떡 궁합 유약이군요. 내일 중앙도재에서 질러야겠어요.', createdAt: '2026-06-13' }
    ]
  }
];
