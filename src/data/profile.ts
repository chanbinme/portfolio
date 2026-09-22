// ─────────────────────────────────────────────────────────────
// 이 파일 하나만 고치면 사이트 전체 내용이 바뀝니다.
// 내용은 기존 이력서(https://chanbinme.github.io/resume-nextjs/)를 옮겨온 것입니다.
// ─────────────────────────────────────────────────────────────

export const profile = {
  name: '김찬빈',
  role: 'Backend Engineer',
  tagline: '한 가지를 대하는 태도를 보면, 만 가지를 대하는 태도를 알 수 있다.',
  intro: [
    'Spring Boot, MySQL, Redis, AWS, Git 등을 사용하여 웹 서비스 설계, 백엔드 개발한 경험이 있습니다. 클린 코드와 객체 지향 설계를 고려하여 유지 보수성이 높은 코드를 작성하는 것을 중요하게 생각합니다.',
    '컨텐츠 기획자로 일하며 유저와의 상호작용을 통해 제품을 개선시키는 일을 즐기곤 했습니다. 하지만 제품을 더욱 개선하기 위해서는 기술적인 이해와 능력이 필요하다고 생각하게 되었습니다. 학습하는 과정에서 개발에 대한 이해와 관심을 갖게 되었고, 개발 경험을 통해 자신만의 서비스를 만들어 보고 싶은 욕구가 생겨 직무 전환을 결심하게 되었습니다.',
    '개발자란 처음 접하는 환경이나 기술에 대해서도 주어진 문제를 성공적으로 해결할 수 있어야 한다고 생각하고 있습니다. 문제 해결에서 중요한 점은 사용자를 이해하고 요구사항을 분석하는 것입니다. 컨텐츠 기획자로 일하면서 다양한 관점에서 문제를 바라볼 수 있는 사고력과 협업 능력에 강점을 가지게 되었습니다. 이러한 강점을 바탕으로 더 나은 문제 해결과 비즈니스 발전을 위해 능동적이고 적극적으로 참여하고 있습니다.',
    '• 개발 중 겪는 기술적 어려움을 개인 시간에 학습하고, 블로그에 정리합니다.',
    '• 사이드 프로젝트나 알고리즘 스터디, 온라인 모각코 활동 등을 통해 다양한 개발 경험을 즐기고 있습니다.',
    '• 작은 성과도 꾸준한 커밋을 통해 지속적인 성장을 추구하고 있습니다.',
  ],
  location: 'Seoul, Korea', // TODO: 이력서에 없던 항목 — 확인해주세요
  email: 'chanbin.backend@gmail.com',
  resumeUrl: 'https://chanbinme.github.io/resume-nextjs/',
} as const

export type SocialLink = {
  label: string
  href: string
}

export const socials: SocialLink[] = [
  { label: 'GitHub', href: 'https://github.com/chanbinme' },
  { label: 'LinkedIn', href: '' }, // 이력서에 없음 (빈 값이면 렌더 안 됨)
  { label: 'Blog', href: 'https://green-bin.tistory.com' },
]

// ── Skills ───────────────────────────────────────────────────

export type SkillGroup = {
  category: string
  items: string[]
}

export const skills: SkillGroup[] = [
  {
    category: 'Back-end',
    items: [
      'Java',
      'Spring Boot',
      'Spring MVC',
      'Spring Data JPA',
      'Spring Security',
      'QueryDSL',
      'Gradle',
      'AWS EC2, S3, RDS',
    ],
  },
  {
    category: 'Database',
    items: ['MySQL', 'Redis', 'H2'],
  },
  {
    category: 'Etc',
    items: ['Git', 'IntelliJ', 'Vim', 'Slack'],
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

/**
 * 성과 한 줄.
 *
 * 문자열로 쓰면 그냥 한 줄로 표시되고, `{ text, detail }` 형태로 쓰면
 * 그 문장이 클릭 가능해져 배경·과정을 담은 모달이 열립니다.
 * 두 형태를 한 배열에 섞어 써도 됩니다.
 *
 *   highlights: [
 *     '짧게 남길 성과',
 *     { text: '자세히 풀고 싶은 성과', detail: { sections: [...] } },
 *   ]
 */
export type Highlight = string | { text: string; detail: Detail }

// ── Experience ───────────────────────────────────────────────

export type Experience = {
  company: string
  role: string
  period: string
  summary: string
  /** 성과 목록. 문장별로 detail을 붙이면 그 문장이 클릭 가능해집니다. */
  highlights: Highlight[]
  stack: string[]
  /** 회사 전체에 대한 상세 (개별 성과가 아닌 경력 자체를 설명할 때) */
  detail?: Detail
}

export const experiences: Experience[] = [
  {
    company: '(주)엑스얼라이언스',
    role: 'SW개발팀 · 백엔드 개발자 (정규직)',
    period: '2023.06 — 재직 중',
    summary:
      '패션 브랜드 루이까또즈를 포함한 다양한 분야의 계열사를 운영하는 지주회사입니다.',
    highlights: [
      // TODO: 이력서에는 결과만 적혀 있어 상세 모달을 비워뒀습니다.
      //       배경·과정을 풀고 싶은 문장은 { text, detail } 형태로 바꿔주세요.
      'Test case를 통한 QA 테스트 도입, 프로젝트 배포 후 발생하는 버그 80% 최소화',
      '서버 재기동 없이 JSP 파일 배포만으로 프로모션 페이지가 생성되도록 프로세스 개선, 서비스 중단 시간 90% 감소 및 마케팅 대응 속도 개선',
      '복잡한 로직 및 시스템 설정을 문서화하여 반복적인 문의에 대한 신속한 대응 체계 구축',
      '직영몰 선물하기 서비스 API 설계 및 화면 개발',
      '직영몰 배송비 부과 API 설계 및 화면 개발',
      '사내 인사평가 시스템 API 설계 및 화면 개발',
    ],
    stack: [
      'Java',
      'Spring Boot',
      'MyBatis',
      'JPA/Hibernate',
      'QueryDSL',
      'Oracle',
      'JUnit',
      'JEUS',
      'WebToB',
      'Slack',
    ],
  },
]

// ── Projects ─────────────────────────────────────────────────

export type Project = {
  title: string
  period: string
  description: string
  /** 성과 목록. 문장별로 detail을 붙이면 그 문장이 클릭 가능해집니다. */
  points: Highlight[]
  stack: string[]
  repoUrl?: string
  liveUrl?: string
  featured?: boolean
  detail?: Detail
}

const projectStack = [
  'Java 11',
  'Spring Boot',
  'Spring Security',
  'MySQL',
  'QueryDSL',
  'AWS (EC2, S3, RDS)',
  'GitHub Actions',
]

export const projects: Project[] = [
  {
    title: '66 챌린지',
    period: '2023.01 — 2023.02',
    description:
      '66일 동안 올바른 습관을 만들 수 있도록 도와주는 하드코어 목표 달성 서비스. 백엔드를 담당했습니다.',
    points: [
      {
        text: 'Offset Pagination을 No Offset Pagination으로 전환해 페이징 성능 약 100배 개선',
        detail: {
          metrics: [
            { label: '성능 개선', value: '약 100배' },
            { label: '측정 데이터', value: '15만 건' },
            { label: '조회 시간', value: '0.058s → 0.00032s' },
          ],
          sections: [
            {
              heading: '측정 결과',
              body: [
                '데이터 15만 건을 기준으로 측정했을 때 기존 Offset 방식은 0.058초, No Offset 방식은 0.00032초가 걸렸습니다.',
              ],
            },
            {
              heading: '기록',
              body: [
                '전환 과정은 블로그(green-bin.tistory.com/23)에 정리해 두었습니다.',
              ],
            },
          ],
        },
      },
      '스케줄링을 통해 사용자의 당일 인증 여부를 체크하는 시스템 구현',
      'OAuth 2.0 소셜 로그인 구현 (Google, Naver, Kakao)',
      'S3 이미지 서버 구축 및 웹 성능 개선을 위한 이미지 최적화',
      '협업 생산성을 높이기 위한 Git Flow · Commit Convention 정립',
      'CI/CD 구성 및 RDS 세팅',
    ],
    stack: projectStack,
    repoUrl: 'https://github.com/codestates-seb/66Challenge',
    liveUrl: 'https://66challenge.shop',
    featured: true,
    detail: {
      metrics: [
        { label: '개발 인원', value: '7명 (백엔드 3 · 프론트 4)' },
        { label: '담당', value: '백엔드' },
        { label: '기간', value: '2023.01 — 2023.02' },
      ],
      sections: [
        {
          heading: '담당 역할',
          body: [
            'API 개발 (습관, 인증 게시물)',
            'S3 이미지 서버 구축',
            'Git Flow · Git Convention 정립',
            '알림 서비스 구축',
            'CI/CD 구성 및 RDS DB 세팅',
            'OAuth 로그인 (Google, Kakao, Naver)',
          ],
        },
        {
          heading: '기여한 내용',
          body: [
            'Offset Pagination을 No Offset Pagination으로 전환하여 약 100배의 페이징 성능 개선 (데이터 15만 건 기준, 0.058sec → 0.00032sec)',
            '웹 성능 개선을 위한 이미지 최적화',
            '스케줄링을 통해 사용자의 당일 인증 여부를 체크하는 시스템 구현',
            'Spring Data JPA Auditing 기능으로 엔티티 생성/수정 시간 기록 자동화',
            'Commit Message Convention 정립 및 Template 작성',
          ],
        },
        {
          heading: '체험 계정',
          body: ['Guest ID : guest@mail.com / Guest PW : guest123!'],
        },
      ],
    },
  },
  {
    title: '소셜미디어를 담은 여행 동행 모집 서비스',
    period: '2023.03',
    description:
      '여행 동행을 모집하고 피드로 기록을 남기는 사이드 팀 프로젝트. 백엔드를 담당했습니다.',
    points: [
      'Spring Security + JWT를 이용한 로그인·로그아웃 구현',
      '회원·피드·인증 API 개발 및 이메일 인증 구현',
      'AOP를 통한 Logging 구현',
      'Rest Docs를 이용한 API 문서 자동화',
      '추상화를 통한 통합 테스트 구조 개선, 제네릭을 이용한 코드 리팩토링',
    ],
    stack: projectStack,
    repoUrl: 'https://github.com/Travel-WithMe/TravelWithMe-sever/tree/develop',
    featured: true,
    detail: {
      metrics: [
        { label: '개발 인원', value: '4명 (백엔드 2 · 프론트 2)' },
        { label: '담당', value: '백엔드' },
        { label: '시작', value: '2023.03' },
      ],
      sections: [
        {
          heading: '담당 역할',
          body: [
            'API 개발 (회원, 피드, 인증)',
            'Spring Security Auth · Email 인증',
            '알림 서비스 구축',
            'AOP를 통한 Logging 구현',
            'Rest Docs API 문서 자동화',
          ],
        },
        {
          heading: '기여한 내용',
          body: [
            'Spring Security + JWT를 이용한 로그인, 로그아웃',
            '추상화를 통한 효율적인 통합 테스트',
            '제네릭(Generic)을 이용한 코드 리팩토링',
            '이메일 인증 구현',
            'ConcurrentModificationException · 순환 참조 등 운영 중 마주친 문제 해결',
          ],
        },
      ],
    },
  },
]

// ── Blog ─────────────────────────────────────────────────────

export type Post = {
  title: string
  url: string
  /** 선택: 발행일을 적으면 제목 오른쪽에 표시됩니다 */
  date?: string
  /** 선택: 한 줄 요약 */
  excerpt?: string
}

export const posts: Post[] = [
  {
    title: 'Offset Pagination을 No Offset Pagination으로 전환해 성능 개선하기',
    url: 'https://green-bin.tistory.com/23',
  },
  {
    title: '웹 성능 개선을 위한 이미지 최적화',
    url: 'https://green-bin.tistory.com/32',
  },
  {
    title: '협업 생산성을 높이기 위한 Git Flow · Convention 정립',
    url: 'https://green-bin.tistory.com/26',
  },
  {
    title: '스케줄링을 통해 사용자의 당일 인증 여부를 체크하는 시스템 구현',
    url: 'https://green-bin.tistory.com/25',
  },
  {
    title: 'OAuth 2.0 로그인 기능 구현 (Google, Naver, Kakao)',
    url: 'https://green-bin.tistory.com/27',
  },
  {
    title: 'S3를 통해 이미지 업로드/삭제',
    url: 'https://green-bin.tistory.com/29',
  },
  {
    title: 'Spring Security + JWT를 이용한 로그인, 로그아웃',
    url: 'https://green-bin.tistory.com/68',
  },
  {
    title: '추상화를 통한 효율적인 통합 테스트',
    url: 'https://green-bin.tistory.com/66',
  },
  {
    title: '제네릭(Generic)을 이용한 코드 리팩토링',
    url: 'https://green-bin.tistory.com/75',
  },
  {
    title: '이메일 인증 구현',
    url: 'https://green-bin.tistory.com/83',
  },
]

// ── 기타 이력 (학력 / 활동 / 그 외) ──────────────────────────

export type OtherItem = {
  title: string
  issuer: string
  date: string
  note?: string
}

export const others: OtherItem[] = [
  {
    title: '온라인 모각코 스터디 개굴단 운영',
    issuer: '온라인을 통한 개발 스터디 그룹',
    date: '2022.09 — 2023.05',
    note: '정해진 시간 동안 개인 목표를 세우고 집중해 공부하는 스터디를 운영했습니다. 목표와 진행 상황을 공유하며 피드백을 주고받았고, 스터디는 이후에도 이어지고 있습니다.',
  },
  {
    title: '1일 1커밋 스터디',
    issuer: '일일 커밋을 목표로 하는 스터디 그룹',
    date: '2022.08 — 2023.03',
    note: '일상 속에서 시간을 내어 개발에 집중하는 습관을 만들었고, 스터디 종료 후에도 개인적으로 커밋을 이어가고 있습니다.',
  },
  {
    title: '코드스테이츠 (Codestates)',
    issuer: 'Software Engineering Bootcamp, Backend 41기',
    date: '2022.08 — 2023.02',
    note: 'Java와 Spring Boot 기반 서버 개발, JPA를 활용한 CRUD API와 데이터베이스 설계, RESTful API 디자인, JUnit·Mockito를 이용한 테스트, AWS(EC2·RDS·S3) 배포를 학습했습니다.',
  },
  {
    title: '(주)모',
    issuer: '(비개발 경력) 컨텐츠 팀 · 컨텐츠 기획자 (정규직)',
    date: '2018.01 — 2022.08',
    note: 'UI/UX 디자이너로 1년, 컨텐츠 기획자로 3년 근무했습니다. 인기 이모티콘 시리즈(오늘의 짤)를 기획·관리하고, SNS 컨텐츠를 제안해 런칭·운영했습니다. (TikTok 팔로워 346K·좋아요 3.8M / YouTube 구독자 3.2만·총 조회수 12M)',
  },
  {
    title: '해군 병장 만기 전역',
    issuer: '2함대 광개토대왕함 갑판병 → 정훈병',
    date: '2013.06 — 2015.05',
  },
  {
    title: '인덕대학교',
    issuer: '시각디자인',
    date: '2012.03 — 2018.02',
  },
  {
    title: '신일고등학교',
    issuer: '인문계 졸업',
    date: '2009.03 — 2012.02',
  },
]
