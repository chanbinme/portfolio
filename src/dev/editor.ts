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
