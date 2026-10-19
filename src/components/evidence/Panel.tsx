import type { ReactNode } from 'react'

type PanelProps = {
  /** 이 조각이 무엇인지 한 줄로 (그림의 캡션) */
  caption: string
  children: ReactNode
  /** 증거판 안에서는 높이를 채웁니다 */
  fill?: boolean
}

/**
 * 증거 조각의 틀. 실제 코드·수치로 만든 인터페이스 조각이라 data-ui를 붙입니다.
 * 선 없이 한 단계 밝은 면 위에 놓입니다.
 */
export function Panel({ caption, children, fill = false }: PanelProps) {
  return (
    <figure
      data-ui
      className={`surface flex flex-col bg-surface p-6 sm:p-10 ${fill ? 'h-full justify-between' : 'gap-8'}`}
    >
      <div className="min-w-0">{children}</div>
      <figcaption className="text-small text-muted">{caption}</figcaption>
    </figure>
  )
}
