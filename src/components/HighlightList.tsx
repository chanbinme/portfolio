import { useState } from 'react'
import type { Detail, Highlight } from '../data/profile'
import { Modal } from './Modal'
import { DetailBody } from './DetailBody'
import { Bullet } from './Bullet'
import { DetailTrigger } from './DetailTrigger'
import { PrintDetail } from './PrintDetail'

type HighlightListProps = {
  items: Highlight[]
  /** 모달 제목 앞에 붙일 맥락 (회사명·프로젝트명) */
  context: string
  /** 목록 텍스트 색. 프로젝트 카드는 조금 더 옅게 씁니다. */
  tone?: 'default' | 'muted'
}

export function HighlightList({ items, context, tone = 'default' }: HighlightListProps) {
  // 열려 있는 성과 (null이면 닫힘)
  const [selected, setSelected] = useState<(Highlight & { detail: Detail }) | null>(null)

  if (items.length === 0) return null

  const textColor =
    tone === 'muted'
      ? 'text-neutral-500 dark:text-neutral-400'
      : 'text-neutral-600 dark:text-neutral-300'

  return (
    <>
      <ul className="mt-3 space-y-1.5">
        {items.map((item, i) => {
          const { text, detail } = item

          return (
            <li key={`${i}-${text}`} className={`flex gap-2 text-sm leading-relaxed ${textColor}`}>
              <Bullet />

              {detail ? (
                <div className="min-w-0 flex-1">
                  <DetailTrigger text={text} onClick={() => setSelected({ text, detail })} />
                  <PrintDetail detail={detail} />
                </div>
              ) : (
                <span>{text}</span>
              )}
            </li>
          )
        })}
      </ul>

      <Modal
        open={selected !== null}
        onClose={() => setSelected(null)}
        title={selected?.text ?? ''}
        meta={context}
      >
        {selected && <DetailBody detail={selected.detail} />}
      </Modal>
    </>
  )
}
