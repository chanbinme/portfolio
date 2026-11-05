// 개발 서버 전용 인라인 편집 UI.
//
// 프로덕션에서는 아래 컴포넌트가 모두 "받은 것을 그대로 돌려주거나 아무것도
// 그리지 않는" 상태가 되고, `import.meta.env.DEV`가 false로 치환되면서
// 편집 코드 자체가 번들에서 빠집니다.

import { useEffect, useRef, useState } from 'react'
import {
  patch,
  setEditing,
  sortAttrs,
  startSort,
  useEditing,
  type ContentFile,
  type Key,
} from './editor'

/** 저장에 실패하면 조용히 넘어가지 않고 알립니다 */
function report(error: unknown) {
  const message = error instanceof Error ? error.message : String(error)
  console.error('[편집] 저장 실패:', message)
  window.alert(`저장하지 못했습니다.\n\n${message}`)
}

// ── 글자 고치기 ──────────────────────────────────────────────

type EditableTextProps = {
  file: ContentFile
  /** 고칠 값까지의 전체 경로 (예: [0, 'positions', 1, 'team']) */
  path: Key[]
  children: string
}

/**
 * 감싼 글자를 편집 모드에서 그 자리에 고칠 수 있게 합니다.
 * 편집 모드가 꺼져 있거나 프로덕션이면 받은 것을 그대로 그립니다.
 */
export function EditableText({ file, path, children }: EditableTextProps) {
  if (!import.meta.env.DEV) return <>{children}</>
  return (
    <EditableTextDev file={file} path={path}>
      {children}
    </EditableTextDev>
  )
}

function EditableTextDev({ file, path, children }: EditableTextProps) {
  const editing = useEditing()
  const ref = useRef<HTMLSpanElement>(null)
  const [saving, setSaving] = useState(false)

  // 저장 중에는 입력을 막아, 요청이 오가는 사이의 수정이 사라지지 않게 합니다
  const editable = editing && !saving

  const text = children

  // 편집 모드를 끌 때 고치던 내용이 남아 있으면 원래 값으로 되돌립니다
  useEffect(() => {
    if (!editing && ref.current) ref.current.textContent = text
  }, [editing, text])

  if (!editing) return <>{children}</>

  const save = async () => {
    const next = ref.current?.textContent ?? ''
    if (next === text) return

    setSaving(true)
    try {
      await patch({ op: 'set', file, path, value: next })
    } catch (error) {
      if (ref.current) ref.current.textContent = text
      report(error)
    } finally {
      setSaving(false)
    }
  }

  return (
    <span
      ref={ref}
      contentEditable={editable}
      suppressContentEditableWarning
      spellCheck={false}
      data-empty={text === '' ? '' : undefined}
      className="edit-text"
      onBlur={() => void save()}
      onKeyDown={(e) => {
        // Esc로 되돌리고, Enter로 저장합니다 (줄바꿈은 Shift+Enter)
        if (e.key === 'Escape') {
          if (ref.current) ref.current.textContent = text
          ref.current?.blur()
        } else if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault()
          ref.current?.blur()
        }
      }}
    >
      {children}
    </span>
  )
}

// ── 항목 추가·삭제 ───────────────────────────────────────────

type RemoveProps = {
  file: ContentFile
  /** 항목이 들어 있는 배열까지의 경로 */
  path: Key[]
  index: number
  /** 확인 창에 보여 줄 이름 */
  label: string
  /** 한 배열이 화면에서 여러 묶음으로 나뉘어 그려질 때, 순서를 바꿀 수 있는 범위(묶음 이름) */
  scope?: string
}

/**
 * 배열의 항목 하나를 지우는 단추와, 같은 배열 안에서 순서를 바꾸는 손잡이.
 * 편집 모드에서만 보입니다. 지울 수 있는 곳은 모두 순서도 바꿀 수 있습니다
 */
export function EditableRemove(props: RemoveProps) {
  if (!import.meta.env.DEV) return null
  return <EditableRemoveDev {...props} />
}

function EditableRemoveDev({ file, path, index, label, scope }: RemoveProps) {
  const editing = useEditing()
  if (!editing) return null

  const remove = async () => {
    if (!window.confirm(`${label}을(를) 지울까요?`)) return
    try {
      await patch({ op: 'remove', file, path, index })
    } catch (error) {
      report(error)
    }
  }

  return (
    <>
      <SortHandle file={file} path={path} index={index} label={label} scope={scope} />
      <button
        type="button"
        onClick={() => void remove()}
        title={`${label} 지우기`}
        aria-label={`${label} 지우기`}
        className="edit-btn edit-btn-remove"
      >
        ✕
      </button>
    </>
  )
}

/**
 * 끌어서 같은 목록 안의 다른 자리로 옮기는 손잡이.
 *
 * 버튼이 아니라 span인 이유: Firefox는 button을 끌지 못합니다.
 */
function SortHandle({ file, path, index, label, scope }: RemoveProps) {
  const move = async (to: { from: number; to: number }) => {
    try {
      await patch({ op: 'move', file, path, ...to })
    } catch (error) {
      report(error)
    }
  }

  return (
    <span
      role="button"
      aria-label={`${label} 순서 바꾸기`}
      title={`끌어서 ${label} 순서 바꾸기`}
      draggable
      {...sortAttrs(file, path, index, scope)}
      className="edit-btn edit-btn-move"
      onDragStart={(e) => {
        const started = startSort(e.nativeEvent, file, path, index, scope, (m) => void move(m))
        if (!started) e.preventDefault()
      }}
    >
      ⠿
    </span>
  )
}

type AddProps = {
  file: ContentFile
  /** 항목을 넣을 배열까지의 경로 */
  path: Key[]
  /** 끼워 넣을 위치. 보통 목록의 현재 길이(= 맨 뒤) */
  index: number
  /** 새 항목의 빈 틀 (editor.ts의 BLANK) */
  blank: () => unknown
  label: string
}

/** 배열에 빈 항목을 더하는 단추. 편집 모드에서만 보입니다 */
export function EditableAdd(props: AddProps) {
  if (!import.meta.env.DEV) return null
  return <EditableAddDev {...props} />
}

function EditableAddDev({ file, path, index, blank, label }: AddProps) {
  const editing = useEditing()
  if (!editing) return null

  const add = async () => {
    try {
      await patch({ op: 'insert', file, path, index, value: blank() })
    } catch (error) {
      report(error)
    }
  }

  return (
    <button type="button" onClick={() => void add()} className="edit-btn edit-btn-add">
      + {label}
    </button>
  )
}

// ── 참/거짓 바꾸기 ───────────────────────────────────────────

type ToggleProps = {
  file: ContentFile
  path: Key[]
  value: boolean
  label: string
}

/** boolean 값을 켜고 끄는 단추 (상세 섹션의 "목록으로 표시" 등) */
export function EditableToggle(props: ToggleProps) {
  if (!import.meta.env.DEV) return null
  return <EditableToggleDev {...props} />
}

function EditableToggleDev({ file, path, value, label }: ToggleProps) {
  const editing = useEditing()
  if (!editing) return null

  const toggle = async () => {
    try {
      await patch({ op: 'set', file, path, value: !value })
    } catch (error) {
      report(error)
    }
  }

  return (
    <button type="button" onClick={() => void toggle()} className="edit-btn edit-btn-add">
      {label}: {value ? '켬' : '끔'}
    </button>
  )
}

// ── 값 통째로 넣기·비우기 ────────────────────────────────────

type SetProps = {
  file: ContentFile
  path: Key[]
  /** 넣을 값. 비우려면 생략합니다 (키 자체를 지웁니다) */
  value?: () => unknown
  label: string
  /** 지우기처럼 되돌리기 어려운 동작이면 한 번 묻습니다 */
  confirm?: boolean
}

/** 선택 항목(상세 등)을 통째로 만들거나 비우는 단추 */
export function EditableSet(props: SetProps) {
  if (!import.meta.env.DEV) return null
  return <EditableSetDev {...props} />
}

function EditableSetDev({ file, path, value, label, confirm }: SetProps) {
  const editing = useEditing()
  if (!editing) return null

  const run = async () => {
    if (confirm && !window.confirm(`${label}할까요?`)) return
    try {
      await patch(
        value ? { op: 'set', file, path, value: value() } : { op: 'unset', file, path },
      )
    } catch (error) {
      report(error)
    }
  }

  return (
    <button type="button" onClick={() => void run()} className="edit-btn edit-btn-add">
      {label}
    </button>
  )
}

// ── 편집 모드 토글 ───────────────────────────────────────────

/**
 * 화면 오른쪽 아래에 뜨는 편집 모드 스위치.
 * App에서 한 번만 그리면 됩니다.
 */
export function EditToggle() {
  if (!import.meta.env.DEV) return null
  return <EditToggleDev />
}

function EditToggleDev() {
  const editing = useEditing()

  return (
    <button
      type="button"
      onClick={() => setEditing(!editing)}
      className={`no-print fixed right-4 bottom-4 z-50 rounded-full px-4 py-2.5 text-sm font-medium shadow-lg transition-colors ${
        editing
          ? 'bg-accent text-white dark:bg-accent-dark dark:text-neutral-950'
          : 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900'
      }`}
      title="개발 서버에서만 보입니다"
    >
      {editing ? '편집 끝내기' : '편집'}
    </button>
  )
}
