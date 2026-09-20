import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'

type ModalProps = {
  open: boolean
  onClose: () => void
  title: string
  /** 제목 옆 보조 정보 (기간 등) */
  meta?: string
  children: ReactNode
}

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'

export function Modal({ open, onClose, title, meta, children }: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  // 모달을 연 요소로 포커스를 되돌리기 위해 기억해둡니다
  const openerRef = useRef<HTMLElement | null>(null)

  // 모달이 열리기 직전의 포커스를 기록합니다.
  // effect 안에서 읽으면 이미 포커스가 옮겨간 뒤라 놓칠 수 있어,
  // 렌더 중(열림 상태로 바뀌는 그 순간)에 붙잡습니다.
  if (open && openerRef.current === null) {
    openerRef.current = document.activeElement as HTMLElement | null
  }

  useEffect(() => {
    if (!open) return

    // 배경 스크롤 잠금. 스크롤바가 사라지며 생기는 레이아웃 이동을 보정합니다.
    const { body, documentElement } = document
    const scrollBarWidth = window.innerWidth - documentElement.clientWidth
    const prevOverflow = body.style.overflow
    const prevPadding = body.style.paddingRight
    body.style.overflow = 'hidden'
    if (scrollBarWidth > 0) body.style.paddingRight = `${scrollBarWidth}px`

    // 패널 안으로 포커스를 옮깁니다
    const panel = panelRef.current
    panel?.focus()

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
        return
      }

      // 포커스가 모달 밖으로 나가지 않도록 가둡니다
      if (e.key !== 'Tab' || !panel) return
      const items = [...panel.querySelectorAll<HTMLElement>(FOCUSABLE)].filter(
        (el) => el.offsetParent !== null,
      )
      if (items.length === 0) {
        e.preventDefault()
        return
      }
      const first = items[0]
      const last = items[items.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      body.style.overflow = prevOverflow
      body.style.paddingRight = prevPadding
      // 모달을 연 버튼으로 포커스를 돌려줍니다 (키보드 사용자가 맥락을 잃지 않도록)
      const opener = openerRef.current
      openerRef.current = null
      opener?.focus()
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-100 flex items-end justify-center sm:items-center"
      role="presentation"
    >
      {/* 배경 딤 — 클릭하면 닫힘 */}
      <div
        className="absolute inset-0 bg-neutral-900/40 backdrop-blur-sm dark:bg-black/60"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        tabIndex={-1}
        className="relative max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-t-2xl bg-white shadow-xl outline-none sm:rounded-2xl dark:bg-neutral-900"
      >
        <div className="sticky top-0 flex items-start justify-between gap-4 border-b border-neutral-200 bg-white/95 px-6 py-4 backdrop-blur dark:border-neutral-800 dark:bg-neutral-900/95">
          <div>
            <h3
              id="modal-title"
              className="text-lg font-semibold text-neutral-900 dark:text-neutral-50"
            >
              {title}
            </h3>
            {meta && (
              <p className="mt-0.5 font-mono text-xs text-neutral-400 dark:text-neutral-500">
                {meta}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="-mr-2 shrink-0 rounded-md p-2 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-900 dark:hover:bg-neutral-800 dark:hover:text-neutral-100"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  )
}
