import type { ReactNode } from 'react'
import { useReveal } from '../hooks/useReveal'

type SectionProps = {
  id: string
  title: string
  subtitle?: string
  /** 제목 오른쪽에 둘 요약 (예: 총 경력) */
  aside?: ReactNode
  children: ReactNode
}

export function Section({ id, title, subtitle, aside, children }: SectionProps) {
  const { ref, visible, animate } = useReveal<HTMLElement>()

  return (
    <section
      id={id}
      ref={ref}
      data-animate={animate ? 'true' : 'false'}
      data-revealed={visible ? 'true' : 'false'}
      className="section reveal container-page"
    >
      <header className="section-head mb-8 flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-fg sm:text-[1.75rem]">{title}</h2>
          {subtitle && <p className="mt-1.5 text-[0.9375rem] text-muted">{subtitle}</p>}
        </div>
        {aside}
      </header>
      {children}
    </section>
  )
}
