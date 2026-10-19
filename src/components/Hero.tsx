import { profile, skills, socials } from '../data/profile'
import { currentRole, totalCareer } from '../lib/career'
import { CopyButton } from './CopyButton'
import { Tag } from './Tag'

export function Hero() {
  const links = socials.filter((s) => s.href)
  const career = totalCareer()
  const current = currentRole()
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
                <a href={`mailto:${profile.email}`} className="hover:underline">
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

        {/* 오른쪽: 주요 기술 (인쇄물에서는 기술 스택 섹션과 겹쳐 뺍니다) */}
        <aside className="hero-side space-y-4" aria-label="요약">
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
