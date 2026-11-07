# Portfolio

김찬빈(Java·Kotlin·Spring 백엔드)의 포트폴리오 사이트. Vite + React 19 + TypeScript + Tailwind 4, GitHub Pages(`/portfolio/`)로 배포한다. 구조와 편집 방법 전체는 [README.md](README.md)에 있다.

## 어디를 고치나

- **사이트 내용은 `src/content/*.json`만 고친다.** 컴포넌트에 문구를 넣지 않는다
- JSON 구조는 `src/data/profile.ts` 타입이 기준이다. 필드를 추가하면 그 타입과 `public/admin/config.yml`(관리자 페이지)을 함께 고친다
- 사용자가 관리자 페이지나 `main`에 직접 커밋하는 일이 잦다. 작업 전에 `git fetch origin main`으로 새 커밋을 확인하고, 충돌하면 사용자가 바꾼 구조와 문구를 우선한다

## 내용 작성 규칙

근거 자료는 Obsidian 저장소(`chanbinme/obsidian`)에 있다.

- 성과의 사실: `2. Areas/커리어/경력 성과.md`, `2. Areas/커리어/DBP 커밋 이력 분석.md`, `2. Areas/DBP/결정 기록.md`
- 작성 기준: `3. Resources/이력서·포트폴리오/` (경력기술서 작성법, 대외비 환경에서 증명하기 등)

지킬 것

- **수치를 지어내지 않는다.** 노트에 없는 숫자는 쓰지 않는다. DBP 성과 수치는 사용자가 직접 넣는다
- 사내 코드·모듈명·테이블명·제휴사·은행 실명은 쓰지 않고 "제휴 은행", "해외 결제 제휴사"처럼 일반화한다
- 진행 중인 일은 완료처럼 쓰지 않는다 (예: "사내 이관 진행 중")
- 혼자 했는지 팀이 했는지 확인된 것만 쓴다. 단독으로 확인된 것: 입금 집계·대사, 웹훅 HMAC 서명, 이벤트 기반 발급 흐름 설계
- 모든 작업을 나열하지 않는다. 임팩트 있는 것만 남긴다
- 성과 한 줄은 결과가 보이게, 상세 모달(`detail`)은 문제 → 검토한 대안 → 한 일 → 결과 순서로 쓴다

현재 정해진 구성

- 첫 화면 대표 성과(`heroMetrics`)는 쓰지 않는다
- 경력 아래 프로젝트에는 기간(`period`)을 넣지 않는다
- 깊게 다룬 회사 프로젝트(가상계좌 발급, 플랫폼 공통, 해외 결제 연동, API 문서 파이프라인)는 성과·상세를 Projects(`projects.json`)에 두고 `affiliation`에 소속을 적는다. 경력(`experiences.json`)에는 이름·한 줄 소개·`projectRef`만 남긴다. 새 회사 프로젝트의 성과를 경력에 길게 쓰지 않는다
- More(`others.json`) 항목은 부연설명을 `issuer` 한 줄로만 쓰고 `note`는 비운다. 핵심만 전달한다
- (주)더즌: 차세대결제팀 2026.04 — 재직 중, 키오스크개발팀 2025.04 — 2026.04. DBP 작업은 모두 차세대결제팀에 둔다

## 검증

```bash
npm run build        # tsc -b + vite build. JSON이 타입과 어긋나면 여기서 실패한다
npm run test:smoke   # dist/를 띄워 모든 상세 모달을 열고 닫아 본다 (Playwright 필요)
```

- 내용만 바꿨으면 `npm run build`, 컴포넌트·CSS를 바꿨으면 `test:smoke`까지 돌린다
- `src/` 아래 TS·JSON을 고치면 `.claude/hooks/typecheck.sh`가 타입 검사를 자동으로 돌린다 (`.claude/settings.json`)

## 주의할 구현

- 상세 모달(`src/components/Modal.tsx`)은 `createPortal`로 `document.body`에 띄운다. 목록 항목의 `isolation: isolate`와 등장 애니메이션의 `translate`가 쌓임 맥락을 만들어, 안에 두면 뒤따르는 내용이 모달을 덮는다
- 인쇄(PDF 저장) 스타일은 `src/index.css`의 `@media print`에 있다. 화면 UI를 바꾸면 인쇄 미리보기도 확인한다

## 스킬

- `.claude/skills/design-taste-frontend`, `.claude/skills/apple-design`: 디자인 작업용 (README 참고)
- `humanize-korean` 플러그인(`epoko77-ai/im-not-ai` v2.3.2, `.claude/settings.json`에서 활성화): 한국어 문장의 AI 티를 걷어낼 때 쓴다. 사이트 문구를 다듬을 때 `/humanize-scan`으로 먼저 확인하고, 필요하면 `/humanize-korean`으로 윤문한다. 윤문해도 사실과 수치는 바꾸지 않는다
