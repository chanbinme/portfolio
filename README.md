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
2. **개발 서버 인라인 편집** — `npm run dev`로 띄운 페이지에서 그 자리에서 수정 (아래 참고)
3. **JSON 직접 수정** — 파일을 고쳐 `main`에 푸시

어느 쪽이든 `main`에 커밋되면 자동으로 배포됩니다.

| 파일 | 내용 |
| --- | --- |
| `profile.json` | 이름·역할·한 줄 소개·대표 성과·자기소개·이메일·링크 |
| `skills.json` | 기술 스택 |
| `experiences.json` | 경력 타임라인 |
| `projects.json` | 프로젝트 카드 (`badge` → 제목 옆에 붙는 짧은 글 예: featured, 회사 프로젝트는 `affiliation`에 소속을 적고 `period`는 비움, `visible: false` → 화면·PDF에서 숨김) |
| `opensource.json` | 오픈소스 기여 (프로젝트별 PR 목록, 비우면 섹션·메뉴가 사라짐) |
| `posts.json` | 글 목록 (비우면 섹션·메뉴가 사라짐) |
| `others.json` | More: 자격·교육 · 학력 · 활동 · 그 외 경력 (항목마다 `category`로 묶음 지정) |
| `views.json` | 지원처별 보기 (`?for=` 링크마다 프로젝트 순서·노출) |
| `settings.json` | 사이트 설정 (방문 분석 GoatCounter 사이트 코드) |

[`src/data/profile.ts`](src/data/profile.ts)는 이 JSON을 읽어 타입을 보장하는 계층입니다.
빈 값(빈 문자열·`null`·빠진 키)은 여기서 정리되므로, 선택 항목은 비워 두거나 지워도 됩니다.

> **잘못된 수정은 배포되지 않습니다.** JSON 구조가 `profile.ts`의 타입과 맞지 않으면
> 빌드(`tsc`)가 실패해 배포가 멈추고, 기존 사이트가 그대로 유지됩니다.
> GitHub **Actions** 탭에서 실패한 실행의 로그를 확인하세요.

### 프로젝트는 Projects에, 경력에는 이름만

깊게 다룬 프로젝트는 성과·상세·기술을 `projects.json`(Projects 섹션)에 두고, 경력에는
프로젝트 이름과 한 줄 소개만 남깁니다. 경력의 프로젝트는 `highlights`·`stack`을 비워도
이름이 있으면 그려집니다. 소속(회사·팀)은 Projects 카드의 `affiliation`에 적고,
회사 프로젝트에는 기간(`period`)을 적지 않습니다.

```jsonc
// experiences.json — 경력 쪽: 이름과 한 줄 소개만
{ "name": "가상계좌 발급", "summary": "한 줄 소개" }

// projects.json — Projects 쪽: 성과·상세·기술
{ "title": "가상계좌 발급", "affiliation": "(주)더즌 · 팀 이름",
  "description": "한 줄 소개", "points": [{ "text": "...", "detail": {...} }], "stack": [...] }
```

**노출 여부**: 프로젝트의 `visible`을 `false`로 하면 화면과 PDF 어디에도 나오지 않습니다
(비우면 노출). 개발 서버 편집 모드에서는 카드마다 **"포트폴리오 노출"** 단추가 있고, 꺼 둔
프로젝트는 흐리게 보여 다시 켤 수 있습니다. 관리자 페이지에서는 **"포트폴리오에 노출"**
칸입니다. 노출 중인 프로젝트가 하나도 없으면 Projects 섹션과 메뉴가 사라집니다.

성과(경력·프로젝트의 성과 한 줄)에도 같은 `visible`이 있습니다. `false`로 하면 그 문장만
화면과 PDF에서 빠지고(상세 모달 포함), 편집 모드에서는 문장 옆 **"노출"** 단추로 켜고 끕니다.
성과를 다 끄면 목록 자체가 그려지지 않습니다.

프로젝트 카드 제목 옆의 작은 글(`featured` 같은 배지)은 `badge`에 원하는 글을 적습니다.
편집 모드에서는 제목 옆 칸을 눌러 바로 쓰고, 비우면 표시되지 않습니다.

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

모달 내용은 화면에서 눌러야 보입니다. PDF는 **이력서**에는 성과 문장만 실리고, **경력기술서**에는 상세 내용까지 함께 실립니다([PDF 저장](#pdf-저장) 참고).

## 개발 서버에서 바로 고치기

`npm run dev`로 띄운 페이지 오른쪽 아래에 **"편집"** 단추가 뜹니다. 누르면 글자에
점선이 생기고, 그 자리에서 고칠 수 있습니다.

- **고치기** — 글자를 눌러 수정하고 다른 곳을 누르면 저장됩니다
  (`Enter` 저장, `Shift+Enter` 줄바꿈, `Esc` 되돌리기)
- **추가** — 목록 아래 **`+ 성과`** 같은 점선 단추를 누르면 빈 항목이 생깁니다.
  바로 눌러서 내용을 채우세요
- **삭제** — 항목 옆 **✕**를 누릅니다 (확인 후 삭제)
- **순서 바꾸기** — ✕ 옆의 **⠿** 손잡이를 끌어 같은 목록 안의 다른 자리에 놓습니다.
  놓을 자리에 파란 선이 보입니다. 상세 모달 안의 목록도 같습니다. 항목이 하나뿐인
  목록에서는 끌 수 없고, More는 같은 묶음(자격·교육, 학력 등) 안에서만 옮길 수 있습니다.
  More의 항목은 각 묶음 아래 **`+ 자격·교육 항목`** 같은 단추로 추가하면 그 묶음의 분류가 자동으로 채워집니다
- **프로젝트 옮기기** — Experience의 프로젝트는 다른 팀·회사로도 옮길 수 있습니다.
  다른 프로젝트 위에 놓거나, 목록 끝의 **`+ 프로젝트`** 단추 위에 놓습니다(비어 있는 목록도
  됩니다). 끌기 시작하면 놓을 수 있는 단추가 강조됩니다

저장하면 `src/content/*.json`에 바로 기록되고, Vite가 페이지를 다시 그립니다.
보던 위치는 그대로 유지됩니다. **커밋·푸시는 직접 하세요.**

> 배포된 사이트에는 이 기능이 없습니다. 편집 UI와 저장 API 모두 개발 서버에서만
> 동작하고, 빌드 결과물에는 포함되지 않습니다. 토큰도 필요 없습니다.

편집하기 쉽도록, 개발 서버에서는 **비어 있는 항목도 화면에 남습니다**
(배포본에서는 평소대로 빠집니다). 방금 추가한 빈 항목이 사라지지 않아야 내용을
채울 수 있기 때문입니다.

상세 모달(`detail`)도 열어 둔 채로 고칠 수 있습니다. 소제목과 문단, 지표를 그 자리에서
수정·추가·삭제하고, **"목록으로"**로 문단과 점 목록을 오갑니다. 상세가 없는 항목에는
**"상세 만들기"**, 통째로 비울 때는 모달 아래 **"상세 전체 비우기"**를 씁니다.
저장하면 페이지가 다시 그려지지만 **열어 둔 모달은 그대로 남습니다.**

| 파일 | 하는 일 |
| --- | --- |
| [`tools/content-editor.ts`](tools/content-editor.ts) | 개발 서버의 저장 API (`POST /__content`) |
| [`src/dev/editor.ts`](src/dev/editor.ts) | 편집 모드 상태, 저장 요청, 끌어서 순서 바꾸기·옮기기, 새 항목의 빈 틀 |
| [`src/dev/Editable.tsx`](src/dev/Editable.tsx) | 편집 UI (글자·추가·삭제·순서·토글) |

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
링크 미리보기 이미지(`og.png`)는 빌드할 때 [`tools/og-image.ts`](tools/og-image.ts)가
`profile.json`의 역할·이름·헤드라인으로 만들어 주므로 따로 관리하지 않아도 됩니다.
`npm run build` 뒤 `dist/og.png`로 미리 볼 수 있습니다.

## 지원처별 링크

지원하는 곳에 맞춰 Projects 카드 순서를 바꾼 링크를 보낼 수 있습니다. 화면과 PDF가 함께 바뀝니다
(이력서 PDF에는 바뀐 순서의 앞 3개가 실립니다).

```
https://chanbinme.github.io/portfolio/?for=fintech            핀테크용 순서
https://chanbinme.github.io/portfolio/?for=fintech&ref=acme   + 어느 회사에 보낸 링크인지 기록
```

- `for`: `views.json`의 `id`. 모르는 이름이거나 없으면 기본 순서로 보입니다
- `ref`: 화면에는 영향이 없고, 방문 분석에 "어느 지원처에 보낸 링크로 들어왔는지"를 남깁니다.
  아무 이름이나 쓸 수 있습니다 (영문 권장)

`views.json` 한 항목:

```jsonc
{
  "id": "fintech",            // 주소 이름 (영문 소문자·숫자·하이픈)
  "label": "핀테크·결제",       // 관리용 이름, 화면에는 안 나옴
  "projects": ["글로벌 보더리스 플랫폼 구축", "..."],  // 이 순서로 맨 앞에. visible: false여도 보임
  "hideRest": false           // true면 목록에 없는 프로젝트를 숨김
}
```

프로젝트 제목은 `projects.json`과 똑같아야 합니다. 제목을 바꾸고 보기를 고치지 않으면
**빌드가 실패해 배포가 멈춥니다** (`tools/content-check.ts`). 관리자 페이지에서는
"지원처별 보기"에서 고칩니다. 개발 서버의 편집 모드에서는 보기와 상관없이 JSON 순서대로 보입니다.

## 방문 분석

[GoatCounter](https://www.goatcounter.com)를 씁니다. 쿠키를 쓰지 않고 개인을 식별하지 않아 동의 배너가 필요 없고,
개인 사이트는 무료입니다.

1. goatcounter.com에서 가입하며 사이트 코드를 정합니다 (예: `chanbin` → `https://chanbin.goatcounter.com`)
2. `settings.json`의 `goatcounter`에 코드만 적습니다 (관리자 페이지: "사이트 설정")
3. 배포되면 대시보드에서 아래 항목을 볼 수 있습니다

| 대시보드 경로 | 뜻 |
| --- | --- |
| `/`, `/?for=fintech&ref=acme` | 방문. 지원처별 링크로 들어왔는지 |
| `modal: <제목>` | 어떤 상세 모달을 열어 봤는지 |
| `pdf: 이력서`, `pdf: 경력기술서` | PDF 저장 메뉴를 눌렀는지 |
| `link: github.com`, `link: mailto` | 어떤 바깥 링크·연락처를 눌렀는지 |

코드를 비우면 스크립트를 아예 불러오지 않습니다. 개발 서버(`npm run dev`)에서는 기록하지 않습니다.
구현은 [`src/lib/analytics.ts`](src/lib/analytics.ts)에 있습니다.

## PDF 저장

Hero의 **"PDF 저장"** 버튼을 누르면 두 가지 중에서 고릅니다.

| 종류 | 구성 |
| --- | --- |
| 이력서 | About → Experience → Projects(노출 중인 앞 3개) → Skills → Open Source → Writing → Education & Activities (More의 자격·교육, 학력, 활동. 비개발 경력은 뺌). 상세 내용은 싣지 않음 |
| 경력기술서 | About → Experience → Projects (노출 중인 모든 프로젝트). 각 항목을 눌렀을 때 나오는 상세 내용(모달)까지 항목 아래에 이어 붙임 |

- 순서는 화면(DOM) 순서와 같고, `@media print`가 `<html data-print="resume | career">`에 따라 뺄 섹션만 정합니다
- 이력서에 실을 프로젝트 수는 [`profile.ts`](src/data/profile.ts)의 `RESUME_PROJECT_COUNT`입니다.
  카드 순서가 곧 우선순위이므로, Projects에서 끌어서 위로 올리면 이력서에 실립니다
- 노출을 끈 프로젝트(`visible: false`)는 두 PDF 모두에서 빠집니다
- 경력기술서는 프로젝트가 1개 늘 때마다 약 1쪽씩 늡니다. 쪽수를 줄이려면 노출하는 프로젝트를 줄이세요
- Open Source·Writing의 링크 주소는 PDF에서 눌러 열 수 있어서, 종이용 주소 덧붙임을 생략합니다

고르면 브라우저 인쇄 대화상자가 열리고, 대상을 "PDF로 저장"으로 고르면 A4 PDF가 만들어집니다.
별도 라이브러리가 없어 번들이 늘지 않고, 텍스트를 선택·검색할 수 있는 PDF가 나옵니다.
PDF 기본 파일명은 `김찬빈 이력서`, `김찬빈 경력기술서`로 바뀝니다.
브라우저의 인쇄 단축키(Ctrl/Cmd+P)로 직접 인쇄하면 이력서 쪽이 나옵니다.

경력기술서는 인쇄 직전에 `<html data-print="career">`를 붙여 상세 본문(`.print-detail`)을
보이게 하는 방식입니다. 상세 본문은 화면에서는 숨겨져 있고, 내용은 모달과 같은 JSON(`detail`)에서
가져오므로 따로 고칠 곳이 없습니다.

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
- 모달의 상세 내용은 **경력기술서에만** 실립니다 (이력서에는 화면에 보이는 내용만)

> 저장 전에 브라우저 인쇄 미리보기에서 페이지 수와 줄바꿈을 한 번 확인하세요.
> 내용 분량에 따라 `@media print`의 `font-size`나 `@page` 여백을 조절하면 됩니다.

## 디자인 커스터마이징

- **포인트 색상**: [`src/index.css`](src/index.css)의 `@theme` 안 `--color-accent` 계열 3개 값
- **폰트**: 본문은 npm `pretendard` 패키지(`src/main.tsx`에서 import), 코드체는 `index.html`의 Google Fonts 링크.
  적용은 `index.css`의 `--font-sans` / `--font-mono`
- **다크 모드**: `html` 요소의 `.dark` 클래스로 제어. 최초 진입 시 OS 설정을 따르고,
  헤더의 토글 버튼을 누르면 선택이 `localStorage`에 저장됩니다.
  첫 페인트 깜빡임은 `index.html`의 인라인 스크립트로 막습니다.

## 스모크 테스트

```bash
npm run build
npm run test:smoke
```

빌드 결과를 띄워 데스크톱·모바일 화면에서 상세 모달을 모두 열어 보고, 모달이 맨 위에 그려지는지, Esc로 닫히는지,
콘솔 에러가 없는지 확인합니다. Playwright가 필요합니다 (`npm i -D playwright && npx playwright install chromium`).

## Claude Code 설정

- [`CLAUDE.md`](CLAUDE.md): 이 저장소에서 Claude가 따를 작업 규칙 (내용 작성 원칙, 검증 방법)
- [`.claude/settings.json`](.claude/settings.json)
  - `src/` 아래 TS·JSON을 고치면 [`.claude/hooks/typecheck.sh`](.claude/hooks/typecheck.sh)가 `tsc -b`를 돌려 타입 오류를 바로 알려줍니다
  - [epoko77-ai/im-not-ai](https://github.com/epoko77-ai/im-not-ai)(MIT)의 `humanize-korean` 플러그인을 v2.3.2로 고정해 켭니다.
    한국어 문장의 AI 티를 진단(`/humanize-scan`)하고 윤문(`/humanize-korean`)합니다. 처음 열 때 마켓플레이스·플러그인 설치를 확인하는 창이 뜹니다

## Claude 스킬

[`.claude/skills/design-taste-frontend/`](.claude/skills/design-taste-frontend)에
[tasteskill v2](https://github.com/Leonxlnx/taste-skill)(MIT)가 들어 있습니다. 이 저장소에서 Claude Code를
쓰면 페이지 디자인·리디자인·리뷰 요청에 자동으로 쓰이고, `/design-taste-frontend`로 직접 부를 수도 있습니다.

- 강한 취향 규칙이 있습니다. 모노스페이스 글꼴, 가는 구분선, 제목 위 작은 라벨, 그림자, 보라색 계열 등을
  금지하고 실제 사진을 4장 이상 요구합니다. 현재 사이트가 쓰는 요소가 많으므로, 리디자인을 맡길 때
  유지할 것을 함께 알려주세요.
- 검사 도구는 Node 22+와 Chrome/Edge/Chromium이 필요합니다. 결과물은 `.taste-skill/`에 생기고 커밋되지 않습니다.
- 출처, 기준 커밋, 업데이트 방법은 [`UPSTREAM.md`](.claude/skills/design-taste-frontend/UPSTREAM.md)에 있습니다.

[`.claude/skills/apple-design/`](.claude/skills/apple-design)에는
[emilkowalski/skills](https://github.com/emilkowalski/skills)의 apple-design(MIT)이 들어 있습니다.
Apple WWDC 디자인 세션(Designing Fluid Interfaces 등)의 원칙을 웹으로 옮긴 스킬로, 버튼 반응, 스프링 애니메이션,
반투명 재질, 타이포그래피, 모션 줄이기 대응을 다룹니다. `/apple-design`으로 부를 수 있습니다.
출처와 업데이트 방법은 [`UPSTREAM.md`](.claude/skills/apple-design/UPSTREAM.md)에 있습니다.

## 구조

```
public/admin/
  index.html          관리자 페이지 (Sveltia CMS)
  config.yml          관리자 페이지 편집 화면 구성
tools/
  content-editor.ts   개발 서버 전용 콘텐츠 저장 API
src/
  content/*.json      ← 사이트 콘텐츠 전체
  data/profile.ts     JSON을 읽어 타입 보장 + 빈 값 정리
  dev/                개발 서버 전용 인라인 편집 (배포본에는 없음)
  hooks/
    useTheme.ts       라이트/다크 토글 + 저장
    useReveal.ts      스크롤 진입 시 fade-up
  lib/
    spring.ts         임계 감쇠 스프링 · 관성 예측 · 경계 저항 (바텀시트 드래그용)
  components/
    Header.tsx        sticky 내비게이션, 현재 섹션 표시, 테마 토글, 모바일 메뉴
    Section.tsx       섹션 공통 래퍼 (제목 + 진입 애니메이션)
    Modal.tsx         상세 모달 (Esc·배경 클릭 닫기, 포커스 트랩). 좁은 화면에서는 끌어내려 닫는 바텀시트
    HighlightList.tsx 성과 목록 — detail이 있는 문장만 클릭 가능하게
    DetailBody.tsx    detail 데이터를 모달 본문으로 렌더링
    Tag.tsx           기술 스택 배지
    DetailTrigger.tsx 클릭하면 상세 모달이 열리는 문장 (점선 밑줄 + ⓘ)
    Bullet.tsx        목록 앞 점 (인쇄 시 텍스트 •로 대체)
    Hero / About / Experience / Projects / Skills / OpenSource / Writing / More / Contact
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
