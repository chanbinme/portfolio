import { useState } from 'react'
import type { Highlight } from '../data/profile'
import { Modal } from './Modal'
import { DetailBody } from './DetailBody'

type HighlightListProps = {
  items: Highlight[]
  /** 모달 제목 앞에 붙일 맥락 (회사명·프로젝트명) */
  context: string
  /** 목록 텍스트 색. 프로젝트 카드는 조금 더 옅게 씁니다. */
  tone?: 'default' | 'muted'
}

/** 문자열이든 객체든 표시할 문장을 꺼냅니다 */
const textOf = (item: Highlight) => (typeof item === 'string' ? item : item.text)

export function HighlightList({ items, context, tone = 'default' }: HighlightListProps) {
  // 열려 있는 성과 (null이면 닫힘)
  const [selected, setSelected] = useState<Exclude<Highlight, string> | null>(null)

  if (items.length === 0) return null

  const textColor =
    tone === 'muted'
      ? 'text-neutral-500 dark:text-neutral-400'
      : 'text-neutral-600 dark:text-neutral-300'

  return (
    <>
      <ul className="mt-3 space-y-1.5">
        {items.map((item) => {
          const text = textOf(item)
          const hasDetail = typeof item !== 'string'

          return (
            <li key={text} className={`flex gap-2 text-sm leading-relaxed ${textColor}`}>
              <span
                className="mt-2 h-1 w-1 shrink-0 rounded-full bg-neutral-400 dark:bg-neutral-600"
                aria-hidden="true"
              />

              {hasDetail ? (
                <button
                  type="button"
                  onClick={() => setSelected(item)}
                  className="group -my-0.5 cursor-pointer py-0.5 text-left transition-colors hover:text-neutral-900 dark:hover:text-neutral-100"
                >
                  <span className="underline decoration-neutral-300 decoration-dashed underline-offset-4 transition-colors group-hover:decoration-accent dark:decoration-neutral-600 dark:group-hover:decoration-accent-dark">
                    {text}
                  </span>
                  {/* 클릭 가능하다는 신호 */}
                  <svg
                    className="ml-1 inline-block align-[-0.1em] text-neutral-400 transition-colors group-hover:text-accent dark:group-hover:text-accent-dark"
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <circle cx="12" cy="12" r="9" />
                    <path d="M12 16v-4M12 8h.01" />
                  </svg>
                </button>
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
