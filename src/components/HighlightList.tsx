import { useState } from 'react'
import type { Detail, Highlight } from '../data/profile'
import { Modal } from './Modal'
import { DetailBody } from './DetailBody'
import { Bullet } from './Bullet'
import { DetailTrigger } from './DetailTrigger'
import { PrintDetail } from './PrintDetail'
import { EditableAdd, EditableRemove, EditableSet, EditableText } from '../dev/Editable'
import {
  BLANK,
  pathKey,
  rememberModal,
  shouldReopen,
  useEditing,
  type ContentFile,
  type Key,
} from '../dev/editor'

/** 열려 있는 성과. 상세를 고치려면 그게 몇 번째 성과인지도 알아야 합니다 */
type Selected = { text: string; detail: Detail; index: number }

type HighlightListProps = {
  items: Highlight[]
  /** 모달 제목 앞에 붙일 맥락 (회사명·프로젝트명) */
  context: string
  /** 목록 텍스트 색. 프로젝트 카드는 조금 더 옅게 씁니다. */
  tone?: 'default' | 'muted'
  /** 개발 서버 인라인 편집용 — 이 목록이 들어 있는 파일과 경로 */
  file: ContentFile
  path: Key[]
}

export function HighlightList({
  items,
  context,
  tone = 'default',
  file,
  path,
}: HighlightListProps) {
  // 열려 있는 성과 (null이면 닫힘).
  // 모달 안에서 저장하면 페이지가 다시 그려지므로, 저장 직전에 열려 있던
  // 모달이면 같은 자리를 다시 엽니다
  const [selected, setSelected] = useState<Selected | null>(() => {
    if (!import.meta.env.DEV) return null
    const index = items.findIndex(
      (item, i) => item.detail && shouldReopen(pathKey(file, [...path, i])),
    )
    const item = index < 0 ? undefined : items[index]
    return item?.detail ? { text: item.text, detail: item.detail, index } : null
  })
  // 편집 중에는 상세가 달린 성과도 글자를 고칠 수 있어야 하므로,
  // 모달을 여는 단추 대신 고칠 수 있는 글자로 바꿔 보여 줍니다
  const editing = useEditing()

  const open = (detail: Detail, text: string, index: number) => {
    rememberModal(pathKey(file, [...path, index]))
    setSelected({ text, detail, index })
  }

  const close = () => {
    rememberModal(null)
    setSelected(null)
  }

  if (items.length === 0 && !import.meta.env.DEV) return null

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
            <li key={i} className={`flex gap-2 text-sm leading-relaxed ${textColor}`}>
              <Bullet />

              {detail && !editing ? (
                <div className="min-w-0 flex-1">
                  <DetailTrigger text={text} onClick={() => open(detail, text, i)} />
                  <PrintDetail detail={detail} />
                </div>
              ) : (
                <span>
                  <EditableText file={file} path={[...path, i, 'text']}>
                    {text}
                  </EditableText>
                  {detail ? (
                    <button
                      type="button"
                      onClick={() => open(detail, text, i)}
                      className="edit-btn edit-btn-add"
                    >
                      상세 열기
                    </button>
                  ) : (
                    <EditableSet
                      file={file}
                      path={[...path, i, 'detail']}
                      value={BLANK.detail}
                      label="상세 만들기"
                    />
                  )}
                  <EditableRemove file={file} path={path} index={i} label="성과" />
                  {detail && <PrintDetail detail={detail} />}
                </span>
              )}
            </li>
          )
        })}
      </ul>

      <EditableAdd
        file={file}
        path={path}
        index={items.length}
        blank={BLANK.highlight}
        label="성과"
      />

      <Modal
        open={selected !== null}
        onClose={close}
        title={selected?.text ?? ''}
        meta={context}
      >
        {selected && (
          <DetailBody
            detail={selected.detail}
            file={file}
            path={[...path, selected.index, 'detail']}
          />
        )}
      </Modal>
    </>
  )
}
