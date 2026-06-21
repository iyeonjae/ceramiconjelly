# CLAUDE.md — ceramiconjelly 프로젝트 전용

## 데이터 수정 시 체크리스트
DB, 하드코딩 파일(data.ts), 로컬스토리지 캐시는 따로 논다.
데이터를 바꿀 때는 세 곳을 같이 확인해라:
① 화면에 보이는 파일 (src/data.ts)
② DB (SQL UPDATE)
③ 로컬스토리지 캐시 무효화 (localStorage.removeItem 또는 브라우저 직접 삭제)

DB만 바꾸고 data.ts를 안 바꾸면 화면에 반영 안 된다.
