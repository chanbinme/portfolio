import { useState } from 'react'
import type { Detail, Highlight } from '../data/profile'
import { Modal } from './Modal'
import { DetailBody } from './DetailBody'
import { Bullet } from './Bullet'
import { DetailTrigger } from './DetailTrigger'

type HighlightListProps = {
  items: Highlight[]
  /** 모달 제목 앞에 붙일 맥락 (회사명·프로젝트명) */
  context: string
}

export function HighlightList({ items, context }: HighlightListProps) {
  // 열려 있는 성과 (null이면 닫힘)
  const [selected, setSelected] = useState<(Highlight & { detail: Detail }) | null>(null)

  if (items.length === 0) return null

  return (
    <>
      <ul className="mt-5 space-y-2.5">
        {items.map((item, i) => {
          const { text, detail } = item

          return (
            <li key={`${i}-${text}`} className="flex gap-3 text-body text-ink">
              <Bullet />

              {detail ? (
                <DetailTrigger text={text} onClick={() => setSelected({ text, detail })} />
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
