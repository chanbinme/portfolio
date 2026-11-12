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
- 회사 프로젝트는 성과·상세·기술을 Projects(`projects.json`)에 두고 `affiliation`에 소속을 적는다. 경력(`experiences.json`)에는 이름과 한 줄 소개만 남긴다 (예외로 경력에 남긴 것: GAVS, 개발 환경·테스트). 새 회사 프로젝트의 성과를 경력에 길게 쓰지 않는다
- Projects는 카드 순서가 우선순위다. 이력서 PDF에는 노출 중인(`visible`) 앞 3개만 실린다. 숨기려면 `visible: false`
- PDF 구성: 이력서 = About → Experience → Projects(앞 3개) → Skills → Open Source → Writing → Education & Activities, 경력기술서 = About → Experience → Projects (`src/index.css`의 `@media print`, `data-print`)
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
- shadcn/ui(new-york, neutral)를 쓴다. 컴포넌트는 `src/components/ui/`, 별칭은 `@/`, 설정은 `components.json`이다. 쓰는 것은 Button·Badge·DropdownMenu(Hero 버튼, `PdfMenu`, `Tag`)뿐이고 `Modal`은 직접 만든 시트·드래그 제스처 때문에 Dialog로 바꾸지 않았다
  - `npx shadcn add`는 사내·샌드박스 프록시가 `ui.shadcn.com`을 막으면 실패한다. 그때는 컴포넌트 코드를 직접 옮겨 오고 의존성만 npm으로 설치한다
  - shadcn의 `accent`는 사이트 포인트 색(`--color-accent`)과 이름이 겹친다. 그래서 `index.css`에 accent·radius 척도·전역 `border-border`를 등록하지 않았고, ui 컴포넌트는 hover 배경에 `muted`를, 테두리에 `border-border`를 직접 쓴다. 새로 받은 컴포넌트에 `bg-accent`가 있으면 같은 식으로 바꾼다
  - `Badge`는 `whitespace-nowrap`·`overflow-hidden`이라 인쇄에서 태그 줄이 페이지 폭을 넘는다. `index.css`의 `@media print .tag`가 이를 풀어 두었으니 `tag` 클래스를 지우지 않는다
  - 포털로 body에 그려지는 메뉴·팝오버에는 `print:hidden`을 둔다

## 스킬

- `.claude/skills/design-taste-frontend`, `.claude/skills/apple-design`: 디자인 작업용 (README 참고)
- `humanize-korean` 플러그인(`epoko77-ai/im-not-ai` v2.3.2, `.claude/settings.json`에서 활성화): 한국어 문장의 AI 티를 걷어낼 때 쓴다. 사이트 문구를 다듬을 때 `/humanize-scan`으로 먼저 확인하고, 필요하면 `/humanize-korean`으로 윤문한다. 윤문해도 사실과 수치는 바꾸지 않는다
