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

// ── 끌어서 순서 바꾸기 ───────────────────────────────────────
//
// 같은 배열에 들어 있는 항목끼리만 자리를 바꿉니다. 항목마다 손잡이가 하나씩
// 있고(Editable.tsx의 SortHandle), 손잡이마다 "어느 배열의 몇 번째인지"를
// data 속성으로 달아 둡니다.
//
// 항목의 모양은 곳마다 달라서(li, div, 태그, 제목 안의 단추…) 항목 요소를 따로
// 표시하지 않습니다. 대신 같은 배열의 손잡이들을 모아서, "다른 항목의 손잡이를
// 품지 않는 가장 큰 상위 요소"를 그 손잡이의 항목으로 봅니다.

/**
 * 같은 배열이라도 화면에서 나뉘어 그려지는 목록(More의 분류별 묶음)은 scope로 구분합니다.
 * 같은 scope 안에서만 자리를 바꿀 수 있습니다
 */
const sortKey = (file: ContentFile, path: Key[], scope?: string) =>
  scope ? `${pathKey(file, path)}#${scope}` : pathKey(file, path)

/** 손잡이에 붙일 data 속성 */
export const sortAttrs = (file: ContentFile, path: Key[], index: number, scope?: string) => ({
  'data-sort-group': sortKey(file, path, scope),
  'data-sort-index': String(index),
})

type Move = { file: ContentFile; path: Key[]; from: number; to: number }

type Sort = {
  file: ContentFile
  path: Key[]
  from: number
  /** 항목 번호 → 항목 요소 */
  items: Map<number, HTMLElement>
  /** 한 줄에 여러 항목이 놓이는 목록(태그 등)이면 좌우로, 아니면 위아래로 가늠합니다 */
  inline: boolean
  /** 지금 놓으면 가게 될 자리. 제자리면 null */
  to: number | null
  mark: HTMLElement | null
}

let sort: Sort | null = null
/** 놓았을 때 저장을 맡을 쪽 (Editable.tsx). 오류 알림도 그쪽에서 합니다 */
let onMove: ((move: Move) => void) | null = null

/** 손잡이에서 위로 올라가며, 같은 배열의 다른 손잡이를 품기 직전까지가 그 항목입니다 */
function itemOf(handle: HTMLElement, group: HTMLElement[]): HTMLElement {
  let item = handle
  for (let el = handle.parentElement; el; el = el.parentElement) {
    if (group.some((h) => h !== handle && el.contains(h))) break
    item = el
  }
  return item
}

function clearMark() {
  if (!sort?.mark) return
  sort.mark.classList.remove(
    'edit-drop-before',
    'edit-drop-after',
    'edit-drop-inline',
  )
  sort.mark = null
}

function endSort() {
  if (!sort) return
  clearMark()
  sort.items.get(sort.from)?.classList.remove('edit-sorting')
  document.removeEventListener('dragover', onDragOver)
  document.removeEventListener('drop', onDrop)
  document.removeEventListener('dragend', endSort)
  sort = null
}

function onDragOver(e: DragEvent) {
  if (!sort) return
  const hit = [...sort.items].find(([, el]) => el.contains(e.target as Node))
  if (!hit) {
    clearMark()
    sort.to = null
    return
  }

  // 놓을 수 있는 자리임을 브라우저에 알립니다
  e.preventDefault()
  if (e.dataTransfer) e.dataTransfer.dropEffect = 'move'

  const [index, el] = hit
  const rect = el.getBoundingClientRect()
  const after = sort.inline
    ? e.clientX > rect.left + rect.width / 2
    : e.clientY > rect.top + rect.height / 2

  // 옮긴 뒤의 위치로 바꿉니다 (앞에서 빼면 뒤쪽 번호가 하나씩 당겨지므로)
  let to = after ? index + 1 : index
  if (sort.from < to) to -= 1
  sort.to = to === sort.from ? null : to

  clearMark()
  if (sort.to === null) return
  sort.mark = el
  el.classList.add(after ? 'edit-drop-after' : 'edit-drop-before')
  if (sort.inline) el.classList.add('edit-drop-inline')
}

function onDrop(e: DragEvent) {
  if (!sort || sort.to === null) return
  e.preventDefault()
  const { file, path, from, to } = sort
  endSort()
  void onMove?.({ file, path, from, to })
}

/**
 * 손잡이를 끌기 시작할 때 부릅니다. 옮길 수 있는 짝이 없으면(항목이 하나뿐이면)
 * false를 돌려주고, 그때는 끌기를 취소해야 합니다.
 */
export function startSort(
  event: DragEvent,
  file: ContentFile,
  path: Key[],
  index: number,
  scope: string | undefined,
  move: (move: Move) => void,
): boolean {
  const key = sortKey(file, path, scope)
  const group = [...document.querySelectorAll<HTMLElement>('[data-sort-group]')].filter(
    (h) => h.dataset.sortGroup === key,
  )
  if (group.length < 2) return false

  const items = new Map<number, HTMLElement>()
  for (const h of group) items.set(Number(h.dataset.sortIndex), itemOf(h, group))
  const from = items.get(index)
  if (!from) return false

  // 같은 줄에 겹쳐 놓인 항목이 있으면 가로로 흐르는 목록으로 봅니다
  const rects = [...items.values()].map((el) => el.getBoundingClientRect())
  const inline = rects.some((a, i) =>
    rects.some((b, j) => {
      if (j <= i) return false
      const overlap = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top)
      return overlap > Math.min(a.height, b.height) / 2
    }),
  )

  endSort()
  onMove = move
  sort = { file, path, from: index, items, inline, to: null, mark: null }

  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move'
    // 일부 브라우저는 데이터가 있어야 끌기를 시작합니다
    event.dataTransfer.setData('text/plain', '')
    const rect = from.getBoundingClientRect()
    event.dataTransfer.setDragImage(from, event.clientX - rect.left, event.clientY - rect.top)
  }
  from.classList.add('edit-sorting')

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
