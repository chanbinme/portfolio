import type { CSSProperties, ReactNode } from 'react'
import { useReveal } from '../hooks/useReveal'

type SectionProps = {
  id: string
  title: string
  subtitle?: string
  /**
   * 이 섹션의 증거(실제 코드·수치). 넓은 화면에서는 오른쪽 증거판에 뜨고,
   * 좁은 화면에서는 제목 아래에 직접 놓입니다.
   */
  evidence?: ReactNode
  className?: string
  children: ReactNode
}

/** 등장 순서. 섹션 안의 부분마다 붙여 차례로 올라오게 합니다. */
export const order = (i: number) => ({ '--i': i }) as CSSProperties

export function Section({ id, title, subtitle, evidence, className = '', children }: SectionProps) {
  const { ref, visible, animate } = useReveal<HTMLElement>()

  return (
    <section
      id={id}
      ref={ref}
      data-animate={animate ? 'true' : 'false'}
      data-revealed={visible ? 'true' : 'false'}
      className={`section reveal ${className}`}
    >
      <header className="mb-12">
        <h2 className="rise text-head font-semibold tracking-[-0.02em] text-ink" style={order(0)}>
          {title}
        </h2>
        {subtitle && (
          <p className="rise mt-3 text-body text-muted" style={order(1)}>
            {subtitle}
          </p>
        )}
      </header>

      {evidence && (
        <div className="evidence rise mb-12 lg:hidden" style={order(2)}>
          {evidence}
        </div>
      )}

      {children}
    </section>
  )
}
