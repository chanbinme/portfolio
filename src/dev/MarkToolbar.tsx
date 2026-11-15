// 편집 모드에서 글자를 드래그하면 뜨는 강조 도구 (개발 서버 전용).
//
// 고르는 글자에 **굵게** 또는 ==형광펜== 표기를 붙이거나, 걸쳐 있는 표기를 뗍니다.
// 표기를 바꾼 뒤 칸에서 포커스를 빼면 EditableText의 저장(onBlur)이 그대로 돌아
// JSON에 기록됩니다. 단축키: Ctrl/Cmd+B 굵게, Ctrl/Cmd+Shift+H 형광펜.

import { useEffect, useState } from 'react'

type Kind = 'bold' | 'mark'

const MARKER: Record<Kind, string> = { bold: '**', mark: '==' }

const TOKEN = /\*\*(.+?)\*\*|==(.+?)==/gs

/** 지금 고른 글자가 들어 있는 편집 칸과, 그 칸 글자 안에서의 위치 */
type Target = { el: HTMLElement; start: number; end: number; rect: DOMRect }

/** 칸의 처음부터 (node, offset)까지 글자 수 */
function offsetIn(el: HTMLElement, node: Node, offset: number) {
  const range = document.createRange()
  range.selectNodeContents(el)
  range.setEnd(node, offset)
  return range.toString().length
}

function currentTarget(): Target | null {
  const selection = document.getSelection()
  if (!selection || selection.rangeCount === 0 || selection.isCollapsed) return null
  const range = selection.getRangeAt(0)
  const host = (node: Node) =>
    (node instanceof Element ? node : node.parentElement)?.closest<HTMLElement>(
      '.edit-text[contenteditable="true"]',
    )
  const el = host(range.startContainer)
  // 두 칸에 걸친 선택은 다루지 않습니다
  if (!el || el !== host(range.endContainer)) return null
  const start = offsetIn(el, range.startContainer, range.startOffset)
  const end = offsetIn(el, range.endContainer, range.endOffset)
  if (start === end) return null
  return { el, start, end, rect: range.getBoundingClientRect() }
}

/** 고른 범위와 겹치는 표기를 모두 떼어 낸 글자와, 바뀐 뒤의 선택 범위 */
function unwrap(text: string, start: number, end: number) {
  /** 지운 표기 글자들의 [시작, 끝) */
  const removed: [number, number][] = []
  let out = ''
  let last = 0
  for (const m of text.matchAll(TOKEN)) {
    const at = m.index ?? 0
    const to = at + m[0].length
    if (to <= start || at >= end) continue // 고른 범위와 겹치지 않음
    const inner = m[1] ?? m[2]
    const marker = (m[0].length - inner.length) / 2
    removed.push([at, at + marker], [to - marker, to])
    out += text.slice(last, at) + inner
    last = to
  }
  out += text.slice(last)

  // 위치 p 앞에서 지워진 글자 수만큼 당기면, 같은 글자를 가리키는 새 위치가 됩니다
  const shift = (p: number) =>
    p - removed.reduce((n, [from, to]) => n + Math.min(Math.max(p - from, 0), to - from), 0)
  return { text: out, start: shift(start), end: shift(end) }
}

/** 고른 글자를 표기로 감쌉니다. 그 안에 있던 표기는 먼저 뗍니다 (한 단계만 지원) */
function wrap(text: string, start: number, end: number, kind: Kind) {
  const clean = unwrap(text, start, end)
  let s = clean.start
  let e = clean.end
  // 앞뒤 공백은 표기 바깥에 둡니다 ("** 글자**"는 굵게로 읽히지 않습니다)
  while (s < e && /\s/.test(clean.text[s])) s++
  while (e > s && /\s/.test(clean.text[e - 1])) e--
  if (s === e) return clean.text
  const marker = MARKER[kind]
  return clean.text.slice(0, s) + marker + clean.text.slice(s, e) + marker + clean.text.slice(e)
}

/** 칸 글자를 바꾸고 포커스를 빼서 저장시킵니다 */
function apply(target: Target, next: string) {
  if (next === target.el.textContent) return
  target.el.textContent = next
  document.getSelection()?.removeAllRanges()
  target.el.blur()
}

export function MarkToolbar() {
  const [target, setTarget] = useState<Target | null>(null)

  useEffect(() => {
    const update = () => setTarget(currentTarget())
    const onKey = (e: KeyboardEvent) => {
      if (!(e.ctrlKey || e.metaKey)) return
      const kind: Kind | null =
        e.key.toLowerCase() === 'b' && !e.shiftKey
          ? 'bold'
          : e.key.toLowerCase() === 'h' && e.shiftKey
            ? 'mark'
            : null
      const t = kind && currentTarget()
      if (!kind || !t) return
      e.preventDefault()
      apply(t, wrap(t.el.textContent ?? '', t.start, t.end, kind))
    }
    document.addEventListener('selectionchange', update)
    window.addEventListener('scroll', update, { passive: true })
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('selectionchange', update)
      window.removeEventListener('scroll', update)
      document.removeEventListener('keydown', onKey)
    }
  }, [])

  if (!target) return null

  const run = (action: (text: string) => string) => apply(target, action(target.el.textContent ?? ''))

  // 고른 글자 바로 위 가운데. 화면 위에 붙으면 아래로 내립니다
  const top = target.rect.top > 52 ? target.rect.top - 44 : target.rect.bottom + 8
  const left = Math.min(Math.max(target.rect.left + target.rect.width / 2, 110), innerWidth - 110)

  const button =
    'rounded-md px-2.5 py-1.5 text-xs font-medium text-white hover:bg-white/15 dark:text-neutral-900 dark:hover:bg-neutral-900/10'

  return (
    <div
      role="toolbar"
      aria-label="강조"
      className="no-print fixed z-[60] flex -translate-x-1/2 items-center gap-0.5 rounded-lg bg-neutral-900 p-1 shadow-lg dark:bg-neutral-100"
      style={{ top, left }}
      // 누르는 순간 선택이 풀리지 않게 합니다
      onMouseDown={(e) => e.preventDefault()}
    >
      <button
        type="button"
        className={button}
        title="굵게 (Ctrl/Cmd+B)"
        onClick={() => run((t) => wrap(t, target.start, target.end, 'bold'))}
      >
        <strong>굵게</strong>
      </button>
      <button
        type="button"
        className={button}
        title="형광펜 (Ctrl/Cmd+Shift+H)"
        onClick={() => run((t) => wrap(t, target.start, target.end, 'mark'))}
      >
        <span className="rich-mark text-neutral-900" data-drawn="">
          형광펜
        </span>
      </button>
      <button
        type="button"
        className={button}
        title="고른 범위에 걸친 강조를 뗍니다"
        onClick={() => run((t) => unwrap(t, target.start, target.end).text)}
      >
        강조 해제
      </button>
    </div>
  )
}
