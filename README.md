# Portfolio

개발자 포트폴리오 사이트. Vite + React + TypeScript + Tailwind CSS.

## 실행

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # dist/ 생성
npm run preview  # 빌드 결과 로컬 확인
```

## 내용 수정하기

사이트의 **모든 텍스트와 목록은 [`src/data/profile.ts`](src/data/profile.ts) 한 파일에 모여 있습니다.**
컴포넌트를 건드릴 필요 없이 이 파일만 고치면 됩니다. `TODO` 주석이 붙은 곳이 채워야 할 부분입니다.

| 항목 | 위치 |
| --- | --- |
| 이름·역할·소개·이메일 | `profile` |
| GitHub / LinkedIn / 블로그 링크 | `socials` (`href`가 빈 문자열이면 렌더 안 됨) |
| 기술 스택 | `skills` |
| 경력 타임라인 | `experiences` |
| 프로젝트 카드 | `projects` (`featured: true` → 배지 표시) |
| 글 목록 | `posts` |
| 자격증·활동 | `others` |
| 성과별 상세 모달 | `highlights` / `points` 항목의 `detail` (아래 참고) |

### 상세 내용 모달

**성과 한 줄마다** 배경과 과정을 담은 모달을 붙일 수 있습니다.
`highlights`(경력) / `points`(프로젝트)의 항목을 문자열 대신 객체로 쓰면 됩니다.

```ts
highlights: [
  // 그냥 한 줄 — 클릭 불가
  '반복 수작업을 사내 도구로 자동화해 작업 시간 단축',

  // 클릭하면 모달이 열리는 성과
  {
    text: 'MSA 공통 모듈을 분리해 서비스 간 중복 설정 코드를 제거',
    detail: {
      metrics: [{ label: '적용 서비스', value: '5개' }],   // 선택
      sections: [
        { heading: '문제 상황', body: ['문단 1', '문단 2'] },
        { heading: '진행 과정', body: ['...'] },
      ],
    },
  },
],
```

두 형태를 한 배열에 섞어 써도 됩니다. `detail`을 붙인 문장에만 점선 밑줄과 ⓘ 아이콘이
생겨 클릭할 수 있다는 것을 알려주고, 모달 제목에는 그 문장이, 부제에는 회사명(또는
프로젝트명)이 들어갑니다.

프로젝트는 **카드 전체**에 대한 `detail`도 따로 가질 수 있습니다 (카드 하단의
"자세히 보기" 버튼). 프로젝트 전반의 배경·회고를 쓸 때 사용하세요.

모달 내용은 화면 전용입니다. PDF에는 성과 문장만 실리고 상세 내용은 빠집니다.

브라우저 탭 제목과 링크 미리보기(OG) 문구는 [`index.html`](index.html)에서 수정합니다.

## PDF 저장

Hero의 **"PDF 저장"** 버튼은 브라우저 인쇄 대화상자를 엽니다.
대상을 "PDF로 저장"으로 고르면 A4 PDF가 만들어집니다. 별도 라이브러리가 없어
번들이 늘지 않고, 텍스트를 선택·검색할 수 있는 PDF가 나옵니다.

인쇄용 스타일은 [`src/index.css`](src/index.css)의 `@media print` 블록에 있습니다.

화면은 포트폴리오, 인쇄물은 **이력서 문서**로 나옵니다. 화면용 장식(카드 테두리,
타임라인, 배지 pill)을 걷어내고 정보가 한 줄에 모이도록 재배치합니다.

- 내비게이션·푸터·버튼 등 화면 전용 UI는 숨김
- 다크 모드여도 인쇄물은 항상 흰 배경 (잉크 절약)
- 이름 아래에 연락처 한 줄, 섹션 제목은 밑줄 달린 소문자 대문자 변환
- 기술 스택 배지는 `Java, Kotlin, ...` 처럼 쉼표로 이어진 텍스트로
- 카드와 경력 항목이 페이지 경계에서 잘리지 않도록 `break-inside: avoid`
- 외부 링크는 주소를 괄호로 덧붙여 종이에서도 확인 가능
- **모달의 상세 내용은 PDF에 포함되지 않습니다** (화면에 보이는 내용만)

> 저장 전에 브라우저 인쇄 미리보기에서 페이지 수와 줄바꿈을 한 번 확인하세요.
> 내용 분량에 따라 `@media print`의 `font-size`나 `@page` 여백을 조절하면 됩니다.

## 디자인 커스터마이징

- **포인트 색상**: [`src/index.css`](src/index.css)의 `@theme` 안 `--color-accent` 계열 3개 값
- **폰트**: `index.html`의 Google Fonts 링크 + `index.css`의 `--font-sans` / `--font-mono`
- **다크 모드**: `html` 요소의 `.dark` 클래스로 제어. 최초 진입 시 OS 설정을 따르고,
  헤더의 토글 버튼을 누르면 선택이 `localStorage`에 저장됩니다.
  첫 페인트 깜빡임은 `index.html`의 인라인 스크립트로 막습니다.

## 구조

```
src/
  data/profile.ts     ← 사이트 콘텐츠 전체
  hooks/
    useTheme.ts       라이트/다크 토글 + 저장
    useReveal.ts      스크롤 진입 시 fade-up
  components/
    Header.tsx        sticky 내비게이션, 현재 섹션 표시, 테마 토글, 모바일 메뉴
    Section.tsx       섹션 공통 래퍼 (제목 + 진입 애니메이션)
    Modal.tsx         상세 모달 (Esc·배경 클릭 닫기, 포커스 트랩)
    HighlightList.tsx 성과 목록 — detail이 있는 문장만 클릭 가능하게
    DetailBody.tsx    detail 데이터를 모달 본문으로 렌더링
    Tag.tsx           기술 스택 배지
    Hero / About / Skills / Experience / Projects / Writing / More / Contact
  App.tsx             섹션 조립 + 푸터
```

## 배포

### GitHub Pages (기본)

`main`에 푸시하면 `.github/workflows/deploy.yml`이 빌드 후
<https://chanbinme.github.io/portfolio/> 로 배포합니다.

처음 한 번만 저장소 설정이 필요합니다.

1. GitHub 저장소 → **Settings** → **Pages**
2. **Build and deployment** → **Source**를 **GitHub Actions**로 변경

수동 배포가 필요하면 **Actions** 탭에서 `Deploy to GitHub Pages` 워크플로를
**Run workflow**로 실행하면 됩니다.

하위 경로(`/portfolio/`) 배포이므로 `vite.config.ts`에 `base: '/portfolio/'`가
설정되어 있습니다. 저장소 이름을 바꾸거나 커스텀 도메인을 붙이면 이 값과
`index.html`의 `og:url`도 함께 바꿔주세요. (커스텀 도메인은 `base: '/'`)

### 그 외

정적 사이트이므로 `npm run build` 후 `dist/`를 그대로 올려도 됩니다.

- **Vercel / Netlify**: 저장소 연결 후 빌드 명령 `npm run build`, 출력 디렉터리 `dist`
  (이 경우 `base`를 `'/'`로 되돌려야 자산 경로가 맞습니다)
