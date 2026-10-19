import type { ReactNode } from 'react'
import { useReveal } from '../hooks/useReveal'

type SectionProps = {
  id: string
  title: string
  subtitle?: string
  children: ReactNode
}

export function Section({ id, title, subtitle, children }: SectionProps) {
  const { ref, visible, animate } = useReveal<HTMLElement>()

  return (
    <section
      id={id}
      ref={ref}
      data-animate={animate ? 'true' : 'false'}
      data-revealed={visible ? 'true' : 'false'}
      className="section reveal border-t border-neutral-200 dark:border-neutral-800"
    >
      {/* 넓은 화면에서는 제목을 왼쪽 칸에 두어, 제목 줄만큼 세로 공간을 아낍니다 */}
      <div className="section-grid lg:grid lg:grid-cols-[10rem_minmax(0,1fr)] lg:gap-12">
        <header className="mb-6 lg:sticky lg:top-24 lg:mb-0 lg:self-start">
          <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">{subtitle}</p>
          )}
        </header>
        <div className="min-w-0">{children}</div>
      </div>
    </section>
  )
}
