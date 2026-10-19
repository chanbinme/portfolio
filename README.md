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

사이트의 **모든 텍스트와 목록은 [`src/content/`](src/content) 폴더의 JSON 파일에 있습니다.**
수정 방법은 두 가지입니다.

1. **관리자 페이지** — <https://chanbinme.github.io/portfolio/admin/> 에서 폼으로 수정 (아래 참고)
2. **JSON 직접 수정** — 파일을 고쳐 `main`에 푸시

어느 쪽이든 `main`에 커밋되면 자동으로 배포됩니다.

| 파일 | 내용 |
| --- | --- |
| `profile.json` | 이름·역할·한 줄 소개·대표 성과·자기소개·이메일·링크 |
| `skills.json` | 기술 스택 |
| `experiences.json` | 경력 타임라인 |
| `projects.json` | 프로젝트 카드 (`featured: true` → 배지 표시) |
| `opensource.json` | 오픈소스 기여 (프로젝트별 PR 목록, 비우면 섹션·메뉴가 사라짐) |
| `posts.json` | 글 목록 |
| `others.json` | 자격증·활동·학력 |

[`src/data/profile.ts`](src/data/profile.ts)는 이 JSON을 읽어 타입을 보장하는 계층입니다.
빈 값(빈 문자열·`null`·빠진 키)은 여기서 정리되므로, 선택 항목은 비워 두거나 지워도 됩니다.

> **잘못된 수정은 배포되지 않습니다.** JSON 구조가 `profile.ts`의 타입과 맞지 않으면
> 빌드(`tsc`)가 실패해 배포가 멈추고, 기존 사이트가 그대로 유지됩니다.
> GitHub **Actions** 탭에서 실패한 실행의 로그를 확인하세요.

### 한 회사에서 팀을 옮긴 경력

경력 항목에 `positions`(팀별 경력)를 넣으면 회사 아래에 팀별로 나눠 보여줍니다.
회사는 하나로 두어 재직 기간이 끊기지 않게 하고, 성과는 팀마다 나눠 어느 팀에서 낸
것인지 분명히 합니다. 팀은 **최신순**으로 적고, 회사 단위 `role`·`highlights`·`stack`은
비워 둡니다. 관리자 페이지에서는 경력 항목 안의 **"팀별 경력"**에서 추가합니다.

```jsonc
{
  "company": "(주)더즌",
  "period": "2025.04 — 재직 중",          // 회사 전체 재직 기간
  "summary": "회사 소개",
  "positions": [
    { "team": "차세대결제팀", "role": "풀스택 개발자", "period": "2026.04 — 재직 중",
      "summary": "이 팀에서 맡은 일", "highlights": [{ "text": "..." }] },
    { "team": "키오스크개발팀", "role": "백엔드 개발자", "period": "2025.04 — 2026.04",
      "highlights": [...], "stack": ["Java", "..."] }
  ]
}
```

화면에서는 같은 타임라인 위에 팀마다 속이 빈 점이 찍히고, 성과 모달의 부제는
"회사 · 팀"이 됩니다. PDF에서는 회사 아래에 팀별 블록이 들어갑니다.

### 상세 내용 모달

**성과 한 줄마다** 배경과 과정을 담은 모달을 붙일 수 있습니다.
`highlights`(경력) / `points`(프로젝트) 항목에 `detail`을 넣으면 됩니다.

```jsonc
"highlights": [
  // detail 없음 — 클릭 불가
  { "text": "반복 수작업을 사내 도구로 자동화해 작업 시간 단축" },

  // 클릭하면 모달이 열리는 성과
  {
    "text": "MSA 공통 모듈을 분리해 서비스 간 중복 설정 코드를 제거",
    "detail": {
      "metrics": [{ "label": "적용 서비스", "value": "5개" }],   // 선택
      "sections": [
        { "heading": "문제 상황", "list": false, "body": ["문단 1", "문단 2"] },
        { "heading": "담당 역할", "list": true,  "body": ["항목 1", "항목 2"] }
      ]
    }
  }
]
```

섹션의 `list`가 `true`면 본문을 점 목록으로, `false`면 문단으로 보여줍니다
(관리자 페이지의 **"목록으로 표시"** 칸).

`detail`을 붙인 문장에만 점선 밑줄과 ⓘ 아이콘이 생겨 클릭할 수 있다는 것을
알려주고, 모달 제목에는 그 문장이, 부제에는 회사명(또는 프로젝트명)이 들어갑니다.
관리자 페이지에서는 성과마다 있는 **"상세"** 칸을 채우면 됩니다.

경력과 프로젝트는 **항목 전체**에 대한 `detail`도 따로 가질 수 있습니다 (하단의
"자세히 보기" 버튼). 전반적인 배경·회고를 쓸 때 사용하세요.

모달 내용은 화면 전용입니다. PDF에는 성과 문장만 실리고 상세 내용은 빠집니다.

## 관리자 페이지

<https://chanbinme.github.io/portfolio/admin/> 에서 사이트 내용을 폼으로 추가·수정·삭제하고
순서를 바꿀 수 있습니다. [Sveltia CMS](https://sveltiacms.app/)를 사용하며, 서버나 DB는 없습니다.

**저장하면 `main` 브랜치에 바로 커밋되고, 1~2분 뒤 사이트에 반영됩니다.**

### 누가 수정할 수 있나

수정 권한은 **GitHub 저장소 쓰기 권한**으로 결정됩니다. 관리자 페이지 자체는 누구나 열 수
있지만, 이 저장소에 쓸 수 있는 토큰이 없으면 아무것도 저장할 수 없습니다.
(정적 사이트라 비밀번호를 코드에 넣는 방식은 쓰지 않습니다. 배포된 코드는 누구나 볼 수 있기 때문입니다.)

### 처음 한 번: 토큰 발급

1. GitHub → 프로필 사진 → **Settings** → **Developer settings**
   → **Personal access tokens** → **Fine-grained tokens** → **Generate new token**
2. **Token name**: `portfolio-admin` 등 / **Expiration**: 원하는 기간 (만료되면 다시 발급)
3. **Repository access**: **Only select repositories** → `chanbinme/portfolio` 하나만 선택
4. **Permissions** → **Repository permissions** → **Contents**: **Read and write**
   (나머지는 그대로 둡니다. Metadata 읽기 권한은 자동으로 붙습니다)
5. **Generate token**을 누르고 표시된 토큰을 복사합니다

### 로그인

관리자 페이지에서 **"액세스 토큰으로 로그인"**을 누르고 토큰을 붙여넣습니다.
토큰은 그 브라우저에만 저장되므로, 기기마다 한 번씩 로그인하면 됩니다.

- **공용 컴퓨터에서는 쓰지 마세요.** 썼다면 작업 후 메뉴에서 로그아웃하세요.
- 토큰이 유출됐다면 GitHub의 같은 화면에서 즉시 **Revoke**하고 새로 발급하세요.
  이 저장소에만 권한을 준 토큰이라 다른 저장소에는 영향이 없습니다.

### 알아둘 점

- 관리자 페이지로 저장하면 원격 `main`에 커밋이 생깁니다. 로컬에서 작업하기 전에
  `git pull`로 먼저 받아오세요.
- 로컬 개발 서버(`npm run dev`)에서 <http://localhost:5173/portfolio/admin/> 를 열면
  **"로컬 저장소로 작업"**도 나타납니다. 토큰 없이 내 컴퓨터의 파일을 바로 고치는
  방식입니다(Chrome·Edge 지원). 수정한 뒤에는 직접 커밋·푸시하세요.
- 편집 화면의 구성은 [`public/admin/config.yml`](public/admin/config.yml)에 있습니다.
  JSON에 필드를 추가하면 이 파일과 `src/data/profile.ts`의 타입도 함께 고치세요.

### CMS 버전 올리기

관리자 페이지는 저장소 쓰기 토큰을 다루므로, CMS 스크립트를 **정확한 버전으로 고정**하고
**integrity(SRI) 해시**로 내용이 바뀌지 않았는지 브라우저가 검증하게 했습니다.
버전을 올릴 때는 [`public/admin/index.html`](public/admin/index.html)의 두 값을 함께 바꿉니다.

```bash
V=0.248.0   # 새 버전 (https://www.npmjs.com/package/@sveltia/cms)
curl -sL "https://unpkg.com/@sveltia/cms@$V/dist/sveltia-cms.js" \
  | openssl dgst -sha384 -binary | openssl base64 -A
# → 출력값 앞에 "sha384-"를 붙여 integrity에 넣고, src의 버전도 $V로 바꿉니다
```

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
- 이름 아래에 연락처(이메일·지역·링크 주소)를 모으고, 겹치는 About의 연락처와 Contact 섹션은 숨김
- 섹션 제목은 밑줄 달린 대문자
- 글머리 점은 텍스트 `•`로 바꿔 인쇄 ("배경 그래픽" 옵션과 무관하게 찍힘)
- 기술 스택 배지는 `Java, Kotlin, ...` 처럼 쉼표로 이어진 텍스트로
- 카드와 경력 항목이 페이지 경계에서 잘리지 않도록 `break-inside: avoid`
- 외부 링크는 주소를 괄호로 덧붙여 종이에서도 확인 가능
- **모달의 상세 내용은 PDF에 포함되지 않습니다** (화면에 보이는 내용만)

> 저장 전에 브라우저 인쇄 미리보기에서 페이지 수와 줄바꿈을 한 번 확인하세요.
> 내용 분량에 따라 `@media print`의 `font-size`나 `@page` 여백을 조절하면 됩니다.

## 디자인 커스터마이징

- **포인트 색상**: [`src/index.css`](src/index.css)의 `@theme` 안 `--color-accent` 계열 3개 값
- **폰트**: 본문은 npm `pretendard` 패키지(`src/main.tsx`에서 import), 코드체는 `index.html`의 Google Fonts 링크.
  적용은 `index.css`의 `--font-sans` / `--font-mono`
- **다크 모드**: `html` 요소의 `.dark` 클래스로 제어. 최초 진입 시 OS 설정을 따르고,
  헤더의 토글 버튼을 누르면 선택이 `localStorage`에 저장됩니다.
  첫 페인트 깜빡임은 `index.html`의 인라인 스크립트로 막습니다.

## Claude 스킬

[`.claude/skills/design-taste-frontend/`](.claude/skills/design-taste-frontend)에
[tasteskill v2](https://github.com/Leonxlnx/taste-skill)(MIT)가 들어 있습니다. 이 저장소에서 Claude Code를
쓰면 페이지 디자인·리디자인·리뷰 요청에 자동으로 쓰이고, `/design-taste-frontend`로 직접 부를 수도 있습니다.

- 강한 취향 규칙이 있습니다. 모노스페이스 글꼴, 가는 구분선, 제목 위 작은 라벨, 그림자, 보라색 계열 등을
  금지하고 실제 사진을 4장 이상 요구합니다. 현재 사이트가 쓰는 요소가 많으므로, 리디자인을 맡길 때
  유지할 것을 함께 알려주세요.
- 검사 도구는 Node 22+와 Chrome/Edge/Chromium이 필요합니다. 결과물은 `.taste-skill/`에 생기고 커밋되지 않습니다.
- 출처, 기준 커밋, 업데이트 방법은 [`UPSTREAM.md`](.claude/skills/design-taste-frontend/UPSTREAM.md)에 있습니다.

## 구조

```
public/admin/
  index.html          관리자 페이지 (Sveltia CMS)
  config.yml          관리자 페이지 편집 화면 구성
src/
  content/*.json      ← 사이트 콘텐츠 전체
  data/profile.ts     JSON을 읽어 타입 보장 + 빈 값 정리
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
    DetailTrigger.tsx 클릭하면 상세 모달이 열리는 문장 (점선 밑줄 + ⓘ)
    Bullet.tsx        목록 앞 점 (인쇄 시 텍스트 •로 대체)
    Hero / About / Skills / Experience / Projects / OpenSource / Writing / More / Contact
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
`index.html`의 `og:url`, `public/admin/config.yml`의 `site_url`·`public_folder`도
함께 바꿔주세요. (커스텀 도메인은 `base: '/'`)

### 그 외

정적 사이트이므로 `npm run build` 후 `dist/`를 그대로 올려도 됩니다.

- **Vercel / Netlify**: 저장소 연결 후 빌드 명령 `npm run build`, 출력 디렉터리 `dist`
  (이 경우 `base`를 `'/'`로 되돌려야 자산 경로가 맞습니다)
