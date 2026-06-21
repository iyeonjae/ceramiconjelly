# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 개발 명령어

```bash
npm run dev      # 개발 서버 (포트 3000) — tsx로 server.ts 직접 실행
npm run build    # vite build + esbuild로 server.ts를 dist/server.cjs로 번들
npm run lint     # tsc --noEmit (타입 체크만, 빌드 없음)
```

`.env` 파일에 `GEMINI_API_KEY`와 `DATABASE_URL` 필요. 없으면 AI는 heuristic fallback으로 동작하고 DB는 연결 실패 로그를 남기며 계속 실행됨.

## 아키텍처

**서버 진입점 2개:**
- `server.ts` — 로컬 개발용. DB 초기화 후 Vite dev server를 Express 미들웨어로 마운트
- `api/index.ts` — Vercel Serverless Function 진입점. `express-app.ts`의 app을 재사용

**실제 Express 라우트는 `express-app.ts` 한 곳에만 있음:**
- `GET /api/suppliers` — DB에서 도재상 목록
- `GET /api/inventory` / `PATCH /api/inventory/:id` — 재고 조회·수량 업데이트
- `GET /api/specimens` — 시편 목록 (댓글 JOIN 포함)
- `POST /api/specimens/:id/like` / `POST /api/specimens/:id/comments`
- `POST /api/recommend` — Gemini AI 추천. API 키 없거나 오류 시 `getHeuristicRecommendation()`으로 자동 fallback

**프론트엔드 (`src/`):**
- `App.tsx` — 탭 상태(`activeTab`) 관리, 하단 탭바 렌더링. `suppliers`는 `INITIAL_SUPPLIERS`(정적), `inventory`·`specimens`는 localStorage에 persist
- 각 탭 컴포넌트: `HomeDashboard`, `SupplierCatalog`, `AIRecommender`, `InventoryManager`, `CommunityForum`
- `types.ts` — `Supplier`, `InventoryItem`, `SpecimenTestTile`, `AIRecommendationInput` 등 전체 타입 정의
- `data.ts` — 하드코딩된 초기 데이터 (`INITIAL_SUPPLIERS` 등)

**DB 스키마 (`db.ts`):**
- `suppliers`, `inventory_items`, `specimen_test_tiles`, `comments` 4개 테이블
- `initSchema()`는 `CREATE TABLE IF NOT EXISTS`라 멱등성 있음
- `seedInitialData()`는 suppliers 테이블이 비어있을 때만 실행

**Vercel 배포:**
- `vercel.json`이 `/api/*` → `api/index.ts` 서버리스로 라우팅
- `/api/` 아닌 요청은 모두 `dist/index.html`로 SPA fallback

## 데이터 수정 시 체크리스트

DB, 하드코딩 파일(`data.ts`), 로컬스토리지 캐시는 따로 논다. 데이터를 바꿀 때 세 곳을 같이 확인:

① `src/data.ts` — 화면에 보이는 정적 초기값  
② DB (`db.ts`의 `seedInitialData` 또는 SQL UPDATE)  
③ 브라우저 localStorage 캐시 무효화 (`localStorage.removeItem` 또는 직접 삭제)

DB만 바꾸고 `data.ts`를 안 바꾸면 화면에 반영 안 된다. `suppliers`는 현재 App.tsx에서 `INITIAL_SUPPLIERS`를 직접 사용 중이라 API를 호출하지 않음.

## 스타일링

- Tailwind CSS v4 (`@import "tailwindcss"` 방식, `tailwind.config.js` 없음)
- 폰트: Pretendard Variable (sans), Noto Serif KR (serif), JetBrains Mono (mono) — `src/index.css`의 `@theme`에 정의
- 브랜드 컬러: 테라코타 `#b76e66`, 민트 `#cbf7ee`
- 커스텀 CSS 클래스 (`src/index.css`): `nav-ceramic-active/inactive` (도자기 질감 버튼), `logo-particle`·`logo-hero-wobble` (로고 애니메이션), `glitch`/`glitch-wrapper` (하단 배너)
- DB 마이그레이션은 `ALTER TABLE`만. `DROP` 금지.
