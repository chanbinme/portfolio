import { heroMetrics, profile, socials } from '../data/profile'
import { PdfMenu } from './PdfMenu'
import { Button } from '@/components/ui/button'
import { EditableText } from '../dev/Editable'
import { track } from '../lib/analytics'
import { RESUME_PDF_URL, resumeFileName } from '../lib/resume'

/**
 * 첫 화면. variant="resume"이면 이력서 페이지용으로
 * "연락하기·PDF 저장" 대신 "PDF 다운로드·포트폴리오 보기"를 둡니다.
 */
export function Hero({ variant = 'portfolio' }: { variant?: 'portfolio' | 'resume' }) {
  const links = socials.filter((s) => s.href)

  return (
    <section
      id="top"
      className="mx-auto w-full max-w-5xl px-6 pt-16 pb-12 sm:pt-24 sm:pb-14"
    >
      <p className="text-base font-medium text-accent dark:text-accent-dark">
        <EditableText file="profile" path={['role']}>
          {profile.role}
        </EditableText>
      </p>

      <h1 className="mt-3 text-[clamp(2.75rem,7vw,4.5rem)] leading-[1.02] font-bold tracking-[-0.035em] text-neutral-900 dark:text-neutral-50">
        <EditableText file="profile" path={['name']}>
          {profile.name}
        </EditableText>
      </h1>

      <p className="mt-8 max-w-2xl text-[clamp(1.25rem,2.4vw,1.5rem)] leading-snug text-balance text-neutral-700 dark:text-neutral-200">
        <EditableText file="profile" path={['headline']}>
          {profile.headline}
        </EditableText>
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
        {variant === 'resume' ? (
          <>
            <Button asChild className="press h-10 px-4">
              <a
                href={RESUME_PDF_URL}
                download={resumeFileName()}
                onClick={(e) => {
                  track('pdf: 이력서')
                  // 개발 서버에는 PDF 파일이 없어, 같은 모양을 인쇄 창으로 보여줍니다
                  if (import.meta.env.DEV) {
                    e.preventDefault()
                    window.print()
                  }
                }}
              >
                PDF 다운로드
              </a>
            </Button>
            <Button asChild variant="outline" className="press h-10 px-4">
              <a href={import.meta.env.BASE_URL}>포트폴리오 보기</a>
            </Button>
          </>
        ) : (
          <>
            <Button asChild className="press h-10 px-4">
              <a href="#contact">연락하기</a>
            </Button>

            <PdfMenu />
          </>
        )}

        {profile.resumeUrl && (
          <Button asChild variant="outline" className="press h-10 px-4">
            <a href={profile.resumeUrl} target="_blank" rel="noreferrer noopener">
              이력서
            </a>
          </Button>
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
