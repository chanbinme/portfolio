// ─────────────────────────────────────────────────────────────
// 이 파일 하나만 고치면 사이트 전체 내용이 바뀝니다.
// TODO 표시된 곳을 본인 정보로 채워주세요.
// ─────────────────────────────────────────────────────────────

export const profile = {
  name: '김찬빈', // TODO: 이름
  role: 'Backend Engineer',
  tagline: '문제를 정의하고, 필요한 것만 만들어 끝까지 운영합니다.',
  intro: [
    'Java/Kotlin과 Spring 기반 백엔드를 주로 다룹니다. MSA 환경에서 공통 모듈을 설계하고 배포하는 일, 그리고 반복 작업을 도구로 걷어내는 일에 관심이 많습니다.',
    '필요하면 프론트엔드와 브라우저 확장까지 직접 만들어 문제를 끝까지 해결하는 편입니다.', // TODO: 본인 소개로 교체
  ],
  location: 'Seoul, Korea',
  email: 'chanbin.backend@gmail.com',
  resumeUrl: '', // TODO: 이력서 PDF 링크 (없으면 빈 문자열 → 버튼 숨김)
} as const

export type SocialLink = {
  label: string
  href: string
}

export const socials: SocialLink[] = [
  { label: 'GitHub', href: 'https://github.com/chanbinme' }, // TODO: 본인 GitHub URL
  { label: 'LinkedIn', href: '' }, // TODO (빈 값이면 렌더 안 됨)
  { label: 'Blog', href: 'https://green-bin.tistory.com' }, // TODO
]

// ── Skills ───────────────────────────────────────────────────

export type SkillGroup = {
  category: string
  items: string[]
}

export const skills: SkillGroup[] = [
  {
    category: 'Language',
    items: ['Java', 'Kotlin', 'TypeScript', 'SQL'],
  },
  {
    category: 'Backend',
    items: ['Spring Boot', 'Spring Data JPA', 'Spring Security', 'Gradle'],
  },
  {
    category: 'Frontend',
    items: ['React', 'Tailwind CSS', 'Vite', 'Chrome Extension API'],
  },
  {
    category: 'Data / Infra',
    items: ['MySQL', 'Redis', 'Docker', 'GitHub Actions'],
  },
]

// ── 상세 내용 (모달) ─────────────────────────────────────────

/**
 * 클릭하면 뜨는 상세 모달의 본문.
 * `detail`을 넣은 항목만 클릭할 수 있게 되고, 없으면 평범한 항목으로 남습니다.
 * 자세히 보여주고 싶은 항목에만 붙이세요.
 */
export type Detail = {
  /** 각 문단은 소제목 + 본문 문단들로 구성됩니다 */
  sections: {
    heading: string
    body: string[]
  }[]
  /** 선택: 성과를 숫자로 보여주고 싶을 때 */
  metrics?: { label: string; value: string }[]
}

// ── Experience ───────────────────────────────────────────────

export type Experience = {
  company: string
  role: string
  period: string
  summary: string
  highlights: string[]
  stack: string[]
  /** 회사 전체에 대한 상세 (개별 성과가 아닌 경력 자체를 설명할 때) */
  detail?: Detail
}

export const experiences: Experience[] = [
  {
    company: '회사명', // TODO
    role: 'Backend Engineer',
    period: '2024.01 — 재직 중', // TODO
    summary: '사내 서비스의 백엔드 개발과 운영을 담당했습니다.', // TODO
    highlights: [
      'MSA 공통 모듈을 분리해 서비스 간 중복 설정 코드를 제거', // TODO
      '반복 수작업을 사내 도구로 자동화해 작업 시간 단축',
    ],
    stack: ['Kotlin', 'Spring Boot', 'MySQL'],
    // ↓ detail을 넣으면 항목이 클릭 가능해지고 상세 모달이 열립니다.
    detail: {
      sections: [
        {
          heading: '담당 업무',
          body: [
            '사내 서비스의 백엔드 API 개발과 운영을 맡았습니다. 기능 개발뿐 아니라 장애 대응과 성능 개선까지 포함했습니다.',
          ],
        },
        {
          heading: '기술적 의사결정',
          body: [
            '서비스마다 인증·예외 처리·로깅 설정이 복사되어 있어, 한 곳을 고치면 나머지를 모두 찾아 고쳐야 했습니다. 공통 모듈을 라이브러리로 분리해 의존성만 추가하면 되도록 바꿨습니다.',
            '다만 라이브러리로 묶으면 버전 업그레이드 시 모든 서비스가 영향을 받습니다. 하위 호환을 깨지 않는 선에서만 변경하고, 파괴적 변경은 메이저 버전으로 분리하는 규칙을 두었습니다.',
          ],
        },
      ],
    },
  },
]

// ── Projects ─────────────────────────────────────────────────

export type Project = {
  title: string
  period: string
  description: string
  points: string[]
  stack: string[]
  repoUrl?: string
  liveUrl?: string
  featured?: boolean
  detail?: Detail
}

export const projects: Project[] = [
  {
    title: 'CodeQuest',
    period: '2025',
    description:
      'GitHub 활동을 기반으로 그룹을 만들어 서로 순위를 겨루는 웹 서비스. 커밋·이슈·PR 활동을 점수화하고 배지와 레벨로 보여줍니다.',
    points: [
      'GitHub OAuth2 로그인과 활동 데이터 수집 파이프라인 구현',
      '그룹 생성·초대·랭킹 집계 도메인 설계',
    ],
    stack: ['Spring Boot', 'OAuth2', 'MySQL'],
    repoUrl: '', // TODO: 레포 URL
    featured: true,
    // ↓ 프로젝트 전체에 대한 상세 (카드의 "자세히 보기" 버튼으로 열림)
    detail: {
      metrics: [
        { label: '개발 기간', value: '3개월' },
        { label: '팀 구성', value: '1인' },
      ],
      sections: [
        {
          heading: '배경',
          body: [
            '개발자들이 꾸준히 코드를 작성하도록 동기를 부여할 방법을 고민했습니다. 혼자 하는 커밋 기록은 금방 동력을 잃기 쉬워서, 친구·동료와 함께 겨루는 구조라면 지속성이 생길 것이라 판단했습니다.',
          ],
        },
        {
          heading: '해결한 문제',
          body: [
            'GitHub API는 호출 한도가 있어 사용자가 늘수록 실시간 집계가 불가능했습니다. 활동 데이터를 주기적으로 수집해 별도 테이블에 적재하고, 랭킹은 집계된 결과만 조회하도록 분리했습니다.',
            '커밋 수만으로 점수를 매기면 의미 없는 커밋을 양산하게 됩니다. 이슈·PR·리뷰에 가중치를 다르게 두어 실제 기여에 가까운 점수가 나오도록 설계했습니다.',
          ],
        },
        {
          heading: '아쉬운 점',
          body: [
            '수집 주기를 짧게 하면 API 한도에 걸리고, 길게 하면 랭킹이 늦게 반영됩니다. 현재는 고정 주기지만, 활동이 많은 그룹을 더 자주 수집하는 방식이 나았을 것 같습니다.',
          ],
        },
      ],
    },
  },
  {
    title: 'HappyTools Kit',
    period: '2025',
    description:
      '외부 AI 도구를 쓸 수 없는 내부망 환경에서 Entity ↔ DDL 변환 같은 반복 작업을 처리하는 크롬 확장 프로그램.',
    points: [
      '내부망 제약 조건에서 동작하도록 모든 처리를 브라우저 로컬에서 수행',
      'Entity ↔ DDL 양방향 변환기 구현',
    ],
    stack: ['TypeScript', 'Chrome Extension'],
    repoUrl: '',
    featured: true,
  },
  {
    title: 'q-it-core',
    period: '2025',
    description:
      'Q-IT MSA 프로젝트의 공통 설정·유틸리티·예외 처리·비동기 구성을 담은 Core 라이브러리. JitPack으로 배포해 다른 서비스가 의존성만 추가해 사용합니다.',
    points: [
      '서비스 간 중복되던 설정과 예외 처리를 라이브러리로 통합',
      'JitPack 배포 파이프라인 구성',
    ],
    stack: ['Kotlin', 'Spring Boot', 'Gradle', 'JitPack'],
    repoUrl: '',
    featured: true,
  },
  {
    title: 'Star Pig',
    period: '2026',
    description:
      '여러 탭을 그룹으로 묶어 저장하고 한 번에 다시 열 수 있는 북마크 매니저 크롬 확장 프로그램.',
    points: [
      '창 단위 탭 일괄 저장 및 복원 기능',
      'shadcn/ui 기반 UI와 TypeScript 타입 안정성 확보',
    ],
    stack: ['TypeScript', 'React', 'shadcn/ui'],
    repoUrl: '',
  },
  {
    title: 'Slack-JIRA Bot',
    period: '2025',
    description:
      'Socket Mode로 Slack 이벤트를 실시간 처리해 JIRA와 연동하는 알림 봇.',
    points: ['Socket Mode 기반 실시간 이벤트 처리', '멘션·DM·슬래시 커맨드 응답 처리'],
    stack: ['Node.js', 'Slack API', 'JIRA API'],
    repoUrl: '',
  },
]

// ── Blog ─────────────────────────────────────────────────────

export type Post = {
  title: string
  date: string
  url: string
  excerpt: string
}

export const posts: Post[] = [
  {
    title: 'MSA 공통 모듈을 라이브러리로 분리한 이유', // TODO
    date: '2026-01-15',
    url: '',
    excerpt:
      '서비스마다 복사되던 설정 코드를 Core 라이브러리로 옮기면서 겪은 판단과 트레이드오프를 정리했습니다.',
  },
  {
    title: '내부망에서 개발 생산성을 지키는 방법',
    date: '2025-11-02',
    url: '',
    excerpt:
      '외부 AI 도구 없이 반복 작업을 줄이기 위해 만든 브라우저 확장 이야기.',
  },
]

// ── 기타 이력 (자격증 / 수상 / 교육 / 활동) ──────────────────

export type OtherItem = {
  title: string
  issuer: string
  date: string
  note?: string
}

export const others: OtherItem[] = [
  {
    title: '정보처리기사', // TODO
    issuer: '한국산업인력공단',
    date: '2026.06',
  },
  {
    title: '사이드 프로젝트 스터디 운영', // TODO
    issuer: '개인',
    date: '2025 —',
    note: '주 1회 코드 리뷰 및 발표 진행',
  },
]
