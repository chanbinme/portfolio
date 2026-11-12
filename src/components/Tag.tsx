import type { ReactNode } from 'react'
import { Badge } from '@/components/ui/badge'

type TagProps = {
  children: ReactNode
}

export function Tag({ children }: TagProps) {
  // `tag` 클래스는 인쇄 스타일(index.css의 @media print)이 쉼표로 이은 글로 바꿀 때 씁니다
  return (
    <Badge variant="secondary" className="tag">
      {children}
    </Badge>
  )
}
