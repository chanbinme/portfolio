import { experiences, openSource, posts, profile, projects, skills, socials } from '../data/profile'
import { currentRole, totalCareer } from '../lib/career'
import { CopyButton } from './CopyButton'
import { Tag } from './Tag'

export function Hero() {
  const links = socials.filter((s) => s.href)
  const career = totalCareer()
  const current = currentRole()
  // 한눈에 보기: 섹션별 분량을 데이터에서 세어 보여주고, 누르면 그 섹션으로 이동합니다
  const prCount = openSource.reduce((n, p) => n + p.contributions.length, 0)
  const mergedCount = openSource.reduce(
    (n, p) => n + p.contributions.filter((c) => c.status === 'Merged').length,
    0,
  )
  const overview = [
    experiences.length > 0 && {
      href: '#experience',
      label: '경력',
      value: `${experiences.length}곳${career ? ` · ${career}` : ''}`,
    },
    projects.length > 0 && { href: '#projects', label: '프로젝트', value: `${projects.length}개` },
    prCount > 0 && {
      href: '#opensource',
      label: '오픈소스',
      value: `PR ${prCount}건${mergedCount ? ` · 머지 ${mergedCount}건` : ''}`,
    },
    posts.length > 0 && { href: '#writing', label: '기술 블로그', value: `${posts.length}편` },
  ].filter(Boolean) as { href: string; label: string; value: string }[]

  // 첫 분류(예: Back-end)를 주요 기술로 보여줍니다
  const coreStack = skills[0]?.items.slice(0, 10) ?? []

  // 채용 담당자가 첫 화면에서 확인하는 사실들. 값이 없으면 그 줄은 빠집니다.
  const facts = [
    career && { label: '총 경력', value: career },
    current && { label: '현재', value: current },
    profile.location && { label: '위치', value: profile.location },
  ].filter(Boolean) as { label: string; value: string }[]

  return (
    <section id="top" className="container-page pt-12 pb-6 sm:pt-16 sm:pb-8">
      <div className="print-stack grid gap-10 lg:grid-cols-[minmax(0,1fr)_23rem] lg:gap-14">
        <div>
          <p className="role text-sm font-semibold text-link">{profile.role}</p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight text-fg sm:text-5xl">{profile.name}</h1>
          <p className="headline mt-4 max-w-2xl text-lg leading-relaxed text-muted sm:text-xl">
            {profile.headline}
          </p>

          <dl className="facts mt-8 grid max-w-2xl gap-x-8 gap-y-4 sm:grid-cols-2">
            {facts.map((f) => (
              <div key={f.label}>
                <dt className="text-sm text-muted">{f.label}</dt>
                <dd className="mt-0.5 font-semibold text-fg">{f.value}</dd>
              </div>
            ))}
            <div>
              <dt className="text-sm text-muted">이메일</dt>
              <dd className="mt-0.5 flex flex-wrap items-center gap-x-1 font-semibold text-fg">
                <a href={`mailto:${profile.email}`} className="inline-flex min-h-8 items-center hover:underline">
                  {profile.email}
                </a>
                <span className="no-print">
                  <CopyButton value={profile.email} />
                </span>
              </dd>
            </div>
          </dl>

          {/* 인쇄물 머리글의 링크 줄. 종이에서는 주소 자체가 정보라 그대로 보여줍니다 */}
          {links.length > 0 && (
            <p className="print-only">
              {links.map((s, i) => (
                <span key={`${i}-${s.label}`}>
                  {i > 0 && ' · '}
                  <a href={s.href}>{s.href.replace(/^https?:\/\//, '').replace(/\/$/, '')}</a>
                </span>
              ))}
            </p>
          )}

          <div className="no-print mt-8 flex flex-wrap gap-2.5">
            <a href={`mailto:${profile.email}`} className="btn btn-primary">
              메일 보내기
            </a>
            <button type="button" onClick={() => window.print()} className="btn btn-outline">
              PDF로 저장
            </button>
            {profile.resumeUrl && (
              <a href={profile.resumeUrl} target="_blank" rel="noreferrer noopener" className="btn btn-outline">
                이력서
              </a>
            )}
            {links.map((s, i) => (
              <a
                key={`${i}-${s.label}`}
                href={s.href}
                target="_blank"
                rel="noreferrer noopener"
                className="btn btn-outline"
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>

        {/* 오른쪽: 한눈에 보기와 주요 기술 (인쇄물에서는 아래 섹션과 겹쳐 뺍니다) */}
        <aside className="hero-side space-y-4" aria-label="요약">
          {overview.length > 0 && (
            <nav aria-label="한눈에 보기" className="card p-2">
              <h2 className="px-4 pt-4 pb-1 text-sm font-semibold text-muted">한눈에 보기</h2>
              <ul>
                {overview.map((o) => (
                  <li key={o.href}>
                    <a
                      href={o.href}
                      className="group flex min-h-11 items-center justify-between gap-4 rounded-lg px-4 py-2 transition-colors hover:bg-chip"
                    >
                      <span className="text-[0.9375rem] text-muted">{o.label}</span>
                      <span className="num flex items-center gap-1.5 font-semibold text-fg">
                        {o.value}
                        <svg
                          className="text-muted transition-transform group-hover:translate-x-0.5"
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          aria-hidden="true"
                        >
                          <path d="M9 6l6 6-6 6" />
                        </svg>
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          )}

          {coreStack.length > 0 && (
            <div className="card p-6">
              <h2 className="text-sm font-semibold text-muted">주요 기술</h2>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {coreStack.map((s, i) => (
                  <Tag key={`${i}-${s}`}>{s}</Tag>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>
    </section>
  )
}
