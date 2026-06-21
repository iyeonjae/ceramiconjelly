# 🏺 CeramicOn — ceramiconjelly

> 도예가를 위한 올인원 재료 플랫폼  
> AI 재료 추천 · 도재상 통합 카탈로그 · 공방 재고 관리 · 시편 커뮤니티

**Live →** https://ceramiconjelly.vercel.app

---

## 서비스 소개

가마 앞 불안감을 줄이는 가장 쉬운 방법.  
흙과 유약 조합부터 도재상 찾기, 공방 재고 관리, 시편 공유까지 도예에 필요한 모든 것을 한 곳에서.

### 핵심 기능

| 탭 | 기능 |
|---|---|
| **AI 재료 추천** | 소성 온도·성형 기법·유약 마감을 입력하면 Gemini AI가 최적 흙·유약 조합 즉시 추천 |
| **도재상 카탈로그** | 중앙도재·대원도재·동영세라믹스·Laguna·Amaco 등 국내외 도재상 통합 비교 |
| **재고 관리** | 공방 보유 흙·유약·원료를 입출고 관리, 부족 알림 |
| **시편 커뮤니티** | 소성 성공 레시피를 사진·팁과 함께 공유하는 도예가 커뮤니티 |

---

## 기술 스택

**Frontend**
- React 19 + TypeScript
- Vite 6
- Tailwind CSS v4
- Lucide React (아이콘)

**Backend**
- Express.js (서버리스 함수)
- Google Gemini API (`gemini-2.0-flash`) — AI 추천 엔진
- Gemini 미연결 시 Heuristic Rule Engine으로 자동 fallback

**Database**
- PostgreSQL (`pg`)
- 스키마 자동 생성 (`initSchema`) + 초기 시드 (`seedInitialData`)

**배포**
- Vercel (SPA + Serverless Functions)
- Google Analytics 4 (프로덕션 전용)

---

## 로컬 개발

```bash
# 의존성 설치
npm install

# 환경변수 설정 (.env)
GEMINI_API_KEY=your_key
DATABASE_URL=postgresql://...
VITE_GA_ID=G-XXXXXXXXXX

# 개발 서버 시작 (포트 3000)
npm run dev

# 타입 체크
npm run lint

# 프로덕션 빌드
npm run build
```

---

## 환경변수

| 변수 | 설명 | 필수 |
|---|---|---|
| `GEMINI_API_KEY` | Google Gemini API 키 | 선택 (없으면 heuristic fallback) |
| `DATABASE_URL` | PostgreSQL 연결 문자열 | 선택 (없으면 정적 데이터 사용) |
| `VITE_GA_ID` | Google Analytics 4 측정 ID | 선택 |

---

## 아키텍처

```
ceramiconjelly/
├── server.ts          # 로컬 개발 서버 (Vite 미들웨어 포함)
├── express-app.ts     # Express 라우트 정의 (/api/*)
├── db.ts              # PostgreSQL 연결·스키마·시드
├── api/index.ts       # Vercel Serverless Function 진입점
└── src/
    ├── App.tsx         # 탭 라우팅·GA 초기화
    ├── components/
    │   ├── HomeDashboard.tsx
    │   ├── AIRecommender.tsx
    │   ├── SupplierCatalog.tsx
    │   ├── InventoryManager.tsx
    │   └── CommunityForum.tsx
    ├── lib/gtag.ts     # GA4 유틸리티
    ├── data.ts         # 정적 초기 데이터
    └── types.ts        # TypeScript 타입 정의
```

---

## Instagram

팔로우 이벤트 진행 중 → [@jelly_in_ceramic](https://www.instagram.com/jelly_in_ceramic)
