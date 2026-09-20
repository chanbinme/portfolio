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
      <header className="mb-10">
        <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl dark:text-neutral-50">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">{subtitle}</p>
        )}
      </header>
      {children}
    </section>
  )
}
