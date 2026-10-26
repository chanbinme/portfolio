import { heroMetrics, profile, socials } from '../data/profile'
import { PdfMenu } from './PdfMenu'

export function Hero() {
  const links = socials.filter((s) => s.href)

  return (
    <section
      id="top"
      className="mx-auto w-full max-w-5xl px-6 pt-16 pb-12 sm:pt-24 sm:pb-14"
    >
      <p className="text-base font-medium text-accent dark:text-accent-dark">
        {profile.role}
      </p>

      <h1 className="mt-3 text-[clamp(2.75rem,7vw,4.5rem)] leading-[1.02] font-bold tracking-[-0.035em] text-neutral-900 dark:text-neutral-50">
        {profile.name}
      </h1>

      <p className="mt-8 max-w-2xl text-[clamp(1.25rem,2.4vw,1.5rem)] leading-snug text-balance text-neutral-700 dark:text-neutral-200">
        {profile.headline}
      </p>

      {/*
        인쇄물 상단의 연락처. 화면에서는 About·Contact에 있지만,
        인쇄물에서는 그 둘을 빼고 여기 한곳에 모읍니다.
      */}
      <p className="print-only mt-3 font-mono text-xs text-neutral-500">
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

      <div className="no-print relative mt-10 flex flex-wrap items-center gap-3">
        <a
          href="#contact"
          className="press rounded-lg bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-neutral-700 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-300"
        >
          연락하기
        </a>

        <PdfMenu />

        {profile.resumeUrl && (
          <a
            href={profile.resumeUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="press rounded-lg border border-neutral-300 px-4 py-2.5 text-sm font-medium text-neutral-700 hover:border-neutral-400 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:border-neutral-600 dark:hover:bg-neutral-900"
          >
            이력서
          </a>
        )}

        {links.length > 0 && (
          <div className="flex items-center gap-4 sm:ml-2">
            {links.map((s, i) => (
              <a
                key={`${i}-${s.label}`}
                href={s.href}
                target="_blank"
                rel="noreferrer noopener"
                className="text-sm text-neutral-500 underline decoration-neutral-300 underline-offset-4 transition-colors hover:text-neutral-900 dark:text-neutral-400 dark:decoration-neutral-700 dark:hover:text-neutral-100"
              >
                {s.label}
              </a>
            ))}
          </div>
        )}
      </div>

      {/* 대표 성과. 인쇄물에서는 Experience와 겹치므로 뺍니다. */}
      {heroMetrics.length > 0 && (
        <dl className="no-print mt-14 grid gap-5 border-t border-neutral-200 pt-8 sm:grid-cols-3 sm:gap-6 dark:border-neutral-800">
          {heroMetrics.map((m, i) => (
            <div
              key={`${i}-${m.label}`}
              className="flex items-baseline gap-4 sm:flex-col sm:gap-1.5"
            >
              {/* 읽는 순서는 "무엇이 → 얼마나", 보이는 순서는 숫자가 먼저 */}
              <dt className="order-last">
                <span className="block text-sm font-medium text-neutral-900 dark:text-neutral-100">
                  {m.label}
                </span>
                <span className="mt-0.5 block text-xs text-neutral-500 dark:text-neutral-400">
                  {m.source}
                </span>
              </dt>
              <dd className="order-first w-16 shrink-0 text-3xl font-semibold tracking-tight text-accent sm:w-auto dark:text-accent-dark">
                {m.value}
              </dd>
            </div>
          ))}
        </dl>
      )}
    </section>
  )
}
