import { useEffect, useRef, useState } from 'react'
import { profile } from '../data/profile'

type Kind = 'resume' | 'career'

const OPTIONS: { kind: Kind; label: string; hint: string }[] = [
  { kind: 'resume', label: '이력서', hint: '경력과 성과를 한 줄씩 담은 요약본' },
  { kind: 'career', label: '경력기술서', hint: '각 항목을 눌렀을 때 나오는 상세 내용까지 담은 문서' },
]

/**
 * 브라우저 인쇄 대화상자를 엽니다. "PDF로 저장"을 고르면 PDF가 됩니다.
 *
 * 경력기술서는 `<html data-print="career">`를 붙여 상세 본문(.print-detail)을
 * 인쇄에 포함합니다. 인쇄가 끝나면 원래대로 되돌립니다.
 * 문서 제목은 PDF 기본 파일명이 되므로, 인쇄하는 동안만 바꿉니다.
 */
function printAs(kind: Kind, label: string) {
  const root = document.documentElement
  const title = document.title

  const restore = () => {
    delete root.dataset.print
    document.title = title
    window.removeEventListener('afterprint', restore)
  }

  root.dataset.print = kind
  document.title = `${profile.name} ${label}`
  window.addEventListener('afterprint', restore)
  window.print()
}

export function PdfMenu() {
  const [open, setOpen] = useState(false)
  const wrapRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  // 바깥을 누르거나 Esc를 누르면 닫습니다
  useEffect(() => {
    if (!open) return

    const onPointerDown = (e: PointerEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false)
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        buttonRef.current?.focus()
      }
    }

    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  return (
    <div ref={wrapRef} className="sm:relative">
      <button
        ref={buttonRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-2 press rounded-lg border border-neutral-300 px-4 py-2.5 text-sm font-medium text-neutral-700 hover:border-neutral-400 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:border-neutral-600 dark:hover:bg-neutral-900"
      >
        <svg
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M12 3v12m0 0l-4-4m4 4l4-4M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2" />
        </svg>
        PDF 저장
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className={`-mr-1 transition-transform ${open ? 'rotate-180' : ''}`}
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute top-full left-0 z-20 mt-2 w-[min(20rem,calc(100vw-3rem))] rounded-xl border border-neutral-200 bg-white p-1.5 shadow-lg shadow-neutral-900/10 dark:border-neutral-800 dark:bg-neutral-900 dark:shadow-black/40"
        >
          {OPTIONS.map((o) => (
            <button
              key={o.kind}
              type="button"
              role="menuitem"
              onClick={() => {
                setOpen(false)
                printAs(o.kind, o.label)
              }}
              className="block w-full rounded-lg px-3 py-2.5 text-left hover:bg-neutral-50 dark:hover:bg-neutral-800"
            >
              <span className="block text-sm font-medium text-neutral-900 dark:text-neutral-100">
                {o.label}
              </span>
              <span className="mt-0.5 block text-xs leading-snug text-neutral-500 dark:text-neutral-400">
                {o.hint}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
