import { profile, socials } from '../data/profile'
import { Stripe } from './Stripe'
import { MetricsEvidence } from './evidence/MetricsEvidence'

export function Hero() {
  const links = socials.filter((s) => s.href)

  return (
    <>
      <section
        id="top"
        className="mx-3 flex min-h-[calc(100svh-4.75rem)] flex-col bg-surface lg:mx-0"
      >
        <Stripe height="h-10 sm:h-14" />

        <div className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center sm:px-12">
          {/* 첫 화면의 제목: 이름과 하는 일, 두 줄 */}
          <h1 className="text-display font-semibold tracking-[-0.03em] text-ink">
            {profile.name}
            <span className="role mt-4 block text-lead font-medium tracking-normal text-muted">
              {profile.role}
            </span>
          </h1>

          <p className="headline mt-10 max-w-[30ch] text-lead text-ink">{profile.headline}</p>

          {/*
            인쇄물 상단의 연락처. 화면에서는 About·Contact에 있지만,
            인쇄물에서는 그 둘을 빼고 여기 한곳에 모읍니다.
          */}
          <p className="print-only">
            {[profile.email, profile.location].filter(Boolean).join(' · ')}
            {links.length > 0 && (
              <>
                <br />
                {links.map((s, i) => (
                  <span key={`${i}-${s.label}`}>
                    {i > 0 && ' · '}
                    {/* 종이에서는 주소 자체가 정보라 프로토콜만 떼고 그대로 보여줍니다 */}
                    <a href={s.href}>{s.href.replace(/^https?:\/\//, '').replace(/\/$/, '')}</a>
                  </span>
                ))}
              </>
            )}
          </p>

          <div className="no-print mt-10 flex flex-col items-center gap-7">
            <a href={`mailto:${profile.email}`} className="btn">
              메일 보내기
            </a>

            <div className="flex flex-wrap justify-center gap-x-7 gap-y-2 text-body">
              {/* 브라우저 인쇄 대화상자를 엽니다. "PDF로 저장"을 고르면 PDF가 됩니다. */}
              <button type="button" onClick={() => window.print()} className="link min-h-11">
                PDF 저장
              </button>
              {profile.resumeUrl && (
                <a href={profile.resumeUrl} target="_blank" rel="noreferrer noopener" className="link inline-flex min-h-11 items-center">
                  이력서
                </a>
              )}
              {links.map((s, i) => (
                <a
                  key={`${i}-${s.label}`}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="link inline-flex min-h-11 items-center"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 좁은 화면에서는 증거판이 없으므로 첫 화면 바로 아래에 둡니다 */}
      <div className="evidence mx-3 mt-3 lg:hidden">
        <MetricsEvidence />
      </div>
    </>
  )
}
