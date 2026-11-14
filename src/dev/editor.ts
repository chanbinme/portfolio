// 개발 서버 전용 인라인 편집의 상태와 저장 경로.
//
// 이 파일의 내용은 `import.meta.env.DEV` 검사 덕분에 프로덕션 번들에서
// 통째로 빠집니다. 배포된 사이트에는 편집 기능이 존재하지 않습니다.

import { useSyncExternalStore } from 'react'

/** 편집 대상 파일 — tools/content-editor.ts의 FILES와 같아야 합니다 */
export type ContentFile =
  | 'profile'
  | 'skills'
  | 'experiences'
  | 'projects'
  | 'opensource'
  | 'posts'
  | 'others'

export type Key = string | number

const ENDPOINT = '/__content'
const MODE_KEY = 'portfolio-edit-mode'
const SCROLL_KEY = 'portfolio-edit-scroll'
const MODAL_KEY = 'portfolio-edit-modal'

// ── 편집 모드 on/off ─────────────────────────────────────────

const read = (key: string) => {
  try {
    return sessionStorage.getItem(key)
  } catch {
    // 저장소가 막힌 환경에서도 편집 자체는 되게 둡니다
    return null
  }
}

const write = (key: string, value: string | null) => {
  try {
    if (value === null) sessionStorage.removeItem(key)
    else sessionStorage.setItem(key, value)
  } catch {
    /* 무시 */
  }
}

let editing = import.meta.env.DEV && read(MODE_KEY) === 'on'
const listeners = new Set<() => void>()

const subscribe = (fn: () => void) => {
  listeners.add(fn)
  return () => listeners.delete(fn)
}

export function setEditing(next: boolean) {
  editing = next
  write(MODE_KEY, next ? 'on' : null)
  listeners.forEach((fn) => fn())
}

/** 편집 모드 여부. 프로덕션에서는 항상 false입니다 */
export const useEditing = () =>
  useSyncExternalStore(
    subscribe,
    () => editing,
    () => false,
  )

// ── 저장 ─────────────────────────────────────────────────────

type Patch =
  | { op: 'set'; file: ContentFile; path: Key[]; value: unknown }
  | { op: 'unset'; file: ContentFile; path: Key[] }
  | { op: 'insert'; file: ContentFile; path: Key[]; index: number; value: unknown }
  | { op: 'remove'; file: ContentFile; path: Key[]; index: number }
  | { op: 'move'; file: ContentFile; path: Key[]; from: number; to: number }
  | { op: 'transfer'; file: ContentFile; from: Ref; to: Ref }

/**
 * 콘텐츠 파일을 고칩니다.
 *
 * 저장하면 Vite가 파일 변경을 감지해 페이지를 다시 불러옵니다. 그때 스크롤이
 * 맨 위로 돌아가 버리면 고치던 자리를 다시 찾아야 하므로, 보내기 직전에
 * 현재 위치를 적어 두고 새로 그려진 뒤 되돌립니다.
 */
export async function patch(body: Patch): Promise<void> {
  write(SCROLL_KEY, String(window.scrollY))

  let res: Response
  try {
    res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
    })
  } catch (error) {
    write(SCROLL_KEY, null)
    throw error
  }

  if (!res.ok) {
    write(SCROLL_KEY, null)
    throw new Error(await res.text())
  }
}

/** 저장 직후 다시 불러온 페이지의 스크롤을 원래 자리로 되돌립니다 */
export function restoreScroll() {
  const saved = read(SCROLL_KEY)
  if (saved === null) return
  write(SCROLL_KEY, null)
  // 레이아웃이 잡힌 뒤에 옮겨야 제자리에 섭니다
  requestAnimationFrame(() => window.scrollTo({ top: Number(saved), behavior: 'instant' }))
}

// ── 저장 뒤 열려 있던 상세 모달 되살리기 ────────────────────
//
// 모달 안에서 글을 고치면 파일이 바뀌고, Vite가 페이지를 다시 불러오면서
// 모달이 닫힙니다. 그래서 어느 모달이 열려 있었는지 적어 두었다가
// 새로 그려질 때 같은 자리를 다시 엽니다.

/** 경로를 모달을 구분하는 문자열 하나로 만듭니다 */
export const pathKey = (file: ContentFile, path: Key[]) => `${file}:${path.join('.')}`

// 새로고침 직후 한 번만 읽고 비웁니다. 그래야 다음 새로고침 때 또 열리지 않습니다
const reopenKey = import.meta.env.DEV ? read(MODAL_KEY) : null
if (reopenKey !== null) write(MODAL_KEY, null)

/** 지금 그리는 모달이 저장 직전에 열려 있던 그 모달인지 */
export const shouldReopen = (key: string) => reopenKey === key

/** 모달이 열리고 닫힐 때마다 적어 둡니다 */
export const rememberModal = (key: string | null) => {
  if (import.meta.env.DEV) write(MODAL_KEY, key)
}

// ── 끌어서 순서 바꾸기·옮기기 ────────────────────────────────
//
// 항목마다 손잡이가 하나씩 있고(Editable.tsx의 SortHandle), 손잡이를 끌어 같은
// 목록 안의 다른 자리에 놓으면 순서가 바뀝니다. 손잡이에 `kind`를 주면 같은 종류의
// 다른 목록(프로젝트를 다른 팀·회사로)에도 놓을 수 있습니다. 비어 있는 목록에는
// 항목이 없으니, 목록 끝의 "+ 추가" 단추가 놓을 자리(목록 끝)가 됩니다.
//
// 항목의 모양은 곳마다 달라서(li, div, 태그, 제목 안의 단추…) 항목 요소를 따로
// 표시하지 않습니다. 대신 같은 종류의 손잡이·놓을 자리를 모아서, "그중 다른 것을
// 품지 않는 가장 큰 상위 요소"를 그 손잡이의 항목으로 봅니다.

/** 배열 안의 한 자리 */
export type Ref = { path: Key[]; index: number }
export type Move = { file: ContentFile; from: Ref; to: Ref }

/**
 * 같은 배열이라도 화면에서 나뉘어 그려지는 목록(More의 분류별 묶음)은 scope로 구분합니다.
 * 같은 scope 안에서만 자리를 바꿀 수 있습니다
 */
const sortKey = (file: ContentFile, path: Key[], scope?: string) =>
  scope ? `${pathKey(file, path)}#${scope}` : pathKey(file, path)

/** 옮길 수 있는 범위. kind가 없으면 같은 목록 안에서만, 있으면 같은 종류의 모든 목록 */
const kindKey = (file: ContentFile, path: Key[], scope?: string, kind?: string) =>
  kind ? `${file}:${kind}` : sortKey(file, path, scope)

/** 손잡이에 붙일 data 속성 */
export const sortAttrs = (
  file: ContentFile,
  path: Key[],
  index: number,
  scope?: string,
  kind?: string,
) => ({
  'data-sort-kind': kindKey(file, path, scope, kind),
  'data-sort-path': JSON.stringify(path),
  'data-sort-index': String(index),
})

/** 목록 끝의 "+ 추가" 단추에 붙일 data 속성. 그 목록의 끝에 놓을 수 있게 합니다 */
export const dropAttrs = (file: ContentFile, path: Key[], index: number, kind: string) => ({
  'data-drop-kind': `${file}:${kind}`,
  'data-drop-path': JSON.stringify(path),
  'data-drop-index': String(index),
})

/** 끌 수 있는 한 자리와 그 항목 요소 */
type Slot = { el: HTMLElement; path: Key[]; index: number }

type Sort = {
  file: ContentFile
  from: Slot
  /** 같은 종류의 모든 항목 */
  items: Slot[]
  /** 같은 종류의 목록 끝 (el은 "+ 추가" 단추) */
  ends: Slot[]
  /** 한 줄에 여러 항목이 놓이는 목록(태그 등)이면 좌우로, 아니면 위아래로 가늠합니다 */
  inline: Set<string>
  /** 지금 놓으면 가게 될 자리. 제자리면 null */
  to: Ref | null
  mark: HTMLElement | null
}

let sort: Sort | null = null
/** 놓았을 때 저장을 맡을 쪽 (Editable.tsx). 오류 알림도 그쪽에서 합니다 */
let onMove: ((move: Move) => void) | null = null

const same = (a: Key[], b: Key[]) => JSON.stringify(a) === JSON.stringify(b)

/** 손잡이에서 위로 올라가며, 같은 종류의 다른 손잡이·놓을 자리를 품기 직전까지가 그 항목입니다 */
function itemOf(handle: HTMLElement, others: HTMLElement[]): HTMLElement {
  let item = handle
  for (let el = handle.parentElement; el; el = el.parentElement) {
    if (others.some((o) => o !== handle && el.contains(o))) break
    item = el
  }
  return item
}

const MARKS = ['edit-drop-before', 'edit-drop-after', 'edit-drop-inline', 'edit-drop-end']

function clearMark() {
  if (!sort?.mark) return
  sort.mark.classList.remove(...MARKS)
  sort.mark = null
}

function endSort() {
  if (!sort) return
  clearMark()
  sort.from.el.classList.remove('edit-sorting')
  for (const end of sort.ends) end.el.classList.remove('edit-drop-ready')
  document.removeEventListener('dragover', onDragOver)
  document.removeEventListener('drop', onDrop)
  document.removeEventListener('dragend', endSort)
  sort = null
}

function onDragOver(e: DragEvent) {
  if (!sort) return
  const target = e.target as Node
  const slot = sort.items.find((s) => s.el.contains(target))
  const end = slot ? undefined : sort.ends.find((s) => s.el.contains(target))
  if (!slot && !end) {
    clearMark()
    sort.to = null
    return
  }

  // 놓을 수 있는 자리임을 브라우저에 알립니다
  e.preventDefault()
  if (e.dataTransfer) e.dataTransfer.dropEffect = 'move'

  let dest: Ref
  let mark: HTMLElement
  const classes: string[] = []

  if (slot) {
    const rect = slot.el.getBoundingClientRect()
    const inline = sort.inline.has(JSON.stringify(slot.path))
    const after = inline
      ? e.clientX > rect.left + rect.width / 2
      : e.clientY > rect.top + rect.height / 2
    dest = { path: slot.path, index: after ? slot.index + 1 : slot.index }
    mark = slot.el
    classes.push(after ? 'edit-drop-after' : 'edit-drop-before')
    if (inline) classes.push('edit-drop-inline')
  } else {
    dest = { path: end!.path, index: end!.index }
    mark = end!.el
    classes.push('edit-drop-end')
  }

  // 같은 목록 안이면 옮긴 뒤의 위치로 바꿉니다 (앞에서 빼면 뒤쪽 번호가 하나씩 당겨지므로)
  if (same(dest.path, sort.from.path)) {
    if (sort.from.index < dest.index) dest.index -= 1
    sort.to = dest.index === sort.from.index ? null : dest
  } else {
    sort.to = dest
  }

  clearMark()
  if (sort.to === null) return
  sort.mark = mark
  mark.classList.add(...classes)
}

function onDrop(e: DragEvent) {
  if (!sort || sort.to === null) return
  e.preventDefault()
  const { file, from, to } = sort
  endSort()
  void onMove?.({ file, from: { path: from.path, index: from.index }, to })
}

/**
 * 손잡이를 끌기 시작할 때 부릅니다. 옮길 곳이 없으면(항목이 하나뿐이고 놓을 자리도
 * 없으면) false를 돌려주고, 그때는 끌기를 취소해야 합니다.
 */
export function startSort(
  event: DragEvent,
  file: ContentFile,
  path: Key[],
  index: number,
  scope: string | undefined,
  kind: string | undefined,
  move: (move: Move) => void,
): boolean {
  const key = kindKey(file, path, scope, kind)
  const handles = [...document.querySelectorAll<HTMLElement>('[data-sort-kind]')].filter(
    (h) => h.dataset.sortKind === key,
  )
  const endEls = [...document.querySelectorAll<HTMLElement>('[data-drop-kind]')].filter(
    (h) => h.dataset.dropKind === key,
  )
  if (handles.length < 2 && endEls.length === 0) return false

  const guards = [...handles, ...endEls]
  const items: Slot[] = handles.map((h) => ({
    el: itemOf(h, guards),
    path: JSON.parse(h.dataset.sortPath ?? '[]') as Key[],
    index: Number(h.dataset.sortIndex),
  }))
  const ends: Slot[] = endEls.map((el) => ({
    el,
    path: JSON.parse(el.dataset.dropPath ?? '[]') as Key[],
    index: Number(el.dataset.dropIndex),
  }))
  const from = items.find((s) => same(s.path, path) && s.index === index)
  if (!from) return false

  // 같은 목록에서 같은 줄에 겹쳐 놓인 항목이 있으면 가로로 흐르는 목록으로 봅니다
  const inline = new Set<string>()
  const rects = items.map((s) => ({ key: JSON.stringify(s.path), r: s.el.getBoundingClientRect() }))
  rects.forEach((a, i) =>
    rects.forEach((b, j) => {
      if (j <= i || a.key !== b.key) return
      const overlap = Math.min(a.r.bottom, b.r.bottom) - Math.max(a.r.top, b.r.top)
      if (overlap > Math.min(a.r.height, b.r.height) / 2) inline.add(a.key)
    }),
  )

  endSort()
  onMove = move
  sort = { file, from, items, ends, inline, to: null, mark: null }

  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move'
    // 일부 브라우저는 데이터가 있어야 끌기를 시작합니다
    event.dataTransfer.setData('text/plain', '')
    const rect = from.el.getBoundingClientRect()
    event.dataTransfer.setDragImage(from.el, event.clientX - rect.left, event.clientY - rect.top)
  }
  from.el.classList.add('edit-sorting')
  // 다른 목록으로 옮길 수 있다면 놓을 수 있는 목록 끝을 미리 보여 줍니다
  for (const end of ends) end.el.classList.add('edit-drop-ready')

  document.addEventListener('dragover', onDragOver)
  document.addEventListener('drop', onDrop)
  document.addEventListener('dragend', endSort)
  return true
}

// ── 새 항목의 빈 틀 ──────────────────────────────────────────

/**
 * "추가"를 눌렀을 때 끼워 넣을 빈 항목.
 *
 * 개발 서버에서는 빈 항목도 화면에 남기므로(src/data/profile.ts 참고),
 * 추가한 자리에 바로 글을 쓸 수 있습니다.
 */
export const BLANK = {
  text: () => '',
  highlight: () => ({ text: '' }),
  section: () => ({ heading: '', body: [''] }),
  metric: () => ({ label: '', value: '' }),
  skillGroup: () => ({ category: '', items: [''] }),
  experience: () => ({ company: '', role: '', period: '', summary: '', highlights: [] }),
  position: () => ({ team: '', role: '', period: '', highlights: [] }),
  experienceProject: () => ({ name: '', highlights: [{ text: '' }] }),
  project: () => ({ title: '', period: '', description: '', points: [], stack: [] }),
  post: () => ({ title: '', url: '' }),
  other: () => ({ category: '', title: '', issuer: '', date: '' }),
  social: () => ({ label: '', href: '' }),
  contribution: () => ({ text: '', number: '', url: '', status: 'Open' }),
  openSourceProject: () => ({ name: '', contributions: [] }),
  detail: () => ({ sections: [{ heading: '', body: [''] }] }),
} as const
