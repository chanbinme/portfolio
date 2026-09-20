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

// ── Experience ───────────────────────────────────────────────

export type Experience = {
  company: string
  role: string
  period: string
  summary: string
  highlights: string[]
  stack: string[]
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
