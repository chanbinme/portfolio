import { useId } from 'react'
import type { FormEvent } from 'react'
import { profile, socials } from '../data/profile'
import { useReveal } from '../hooks/useReveal'
import { order } from './Section'
import { buildMailto } from '../lib/mailto'

/**
 * 연락: 두 칸 구성을 벗어나 화면 전체 폭을 쓰는 색 면.
 * 서버가 없으므로, 입력한 이름과 용건으로 메일 앱을 열어 줍니다.
 */
export function Contact() {
  const { ref, visible, animate } = useReveal<HTMLElement>()
  const links = socials.filter((s) => s.href)
  const nameId = useId()
  const topicId = useId()

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    window.location.href = buildMailto(
      profile.email,
      String(form.get('name') ?? ''),
      String(form.get('topic') ?? ''),
    )
  }

  // 색 면 위의 입력 칸: 면에서 한 단계 톤만 바꿉니다
  const cell =
    'h-16 w-full bg-[color-mix(in_srgb,var(--ground)_14%,var(--ink))] px-5 text-lead text-ground placeholder:text-[color-mix(in_srgb,var(--ground)_75%,var(--ink))] focus:bg-[color-mix(in_srgb,var(--ground)_24%,var(--ink))] sm:h-24'

  return (
    <section
      id="contact"
      ref={ref}
      data-animate={animate ? 'true' : 'false'}
      data-revealed={visible ? 'true' : 'false'}
      className="reveal mt-3 bg-ink text-ground"
    >
      <div className="px-6 py-28 sm:px-12 lg:px-[calc(0.75rem+3rem)] lg:py-40">
        <h2 className="rise text-display font-semibold tracking-[-0.03em]" style={order(0)}>
          메일로 연락 주세요
        </h2>
        <p className="rise mt-8 max-w-[40ch] text-lead" style={order(1)}>
          새로운 기회나 협업 제안은 언제든 환영합니다. 이름과 용건을 적으면 메일 앱이 열립니다.
        </p>

        <form onSubmit={onSubmit} className="rise mt-14 grid gap-2 sm:grid-cols-3" style={order(2)}>
          <div>
            <label htmlFor={nameId} className="mb-2 block text-small">
              이름
            </label>
            <input id={nameId} name="name" autoComplete="name" placeholder="홍길동" className={cell} />
          </div>
          <div>
            <label htmlFor={topicId} className="mb-2 block text-small">
              용건
            </label>
            <input id={topicId} name="topic" placeholder="예: 백엔드 포지션 제안" className={cell} />
          </div>
          <div className="flex flex-col justify-end">
            <button
              type="submit"
              className="h-16 w-full bg-ground text-lead font-semibold text-ink transition-opacity hover:opacity-90 active:translate-y-px sm:h-24"
            >
              메일 쓰기
            </button>
          </div>
        </form>

        <p className="rise mt-8 text-body" style={order(3)}>
          또는 직접{' '}
          <a
            href={`mailto:${profile.email}`}
            className="underline decoration-[color-mix(in_srgb,var(--ground)_45%,transparent)] underline-offset-4 hover:decoration-[var(--ground)]"
          >
            {profile.email}
          </a>
          {links.map((s, i) => (
            <span key={`${i}-${s.label}`}>
              {' · '}
              <a
                href={s.href}
                target="_blank"
                rel="noreferrer noopener"
                className="underline decoration-[color-mix(in_srgb,var(--ground)_45%,transparent)] underline-offset-4 hover:decoration-[var(--ground)]"
              >
                {s.label}
              </a>
            </span>
          ))}
        </p>
      </div>
    </section>
  )
}
