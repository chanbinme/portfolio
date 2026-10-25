import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import type { PointerEvent as ReactPointerEvent, ReactNode } from 'react'
import { animateSpring, prefersReducedMotion, projectMomentum, rubberband } from '../lib/spring'

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

/** 좁은 화면에서는 아래에서 올라오는 시트, 넓은 화면에서는 가운데 창 */
const SHEET_QUERY = '(max-width: 639px)'

// 들어올 때와 나갈 때 같은 길을 되짚도록 서로 뒤집은 곡선을 씁니다
const EASE_IN = 'cubic-bezier(0.32, 0.72, 0, 1)'
const EASE_OUT = 'cubic-bezier(1, 0, 0.68, 0.28)'

/** 진행 중인 애니메이션을 멈추고, 그 순간 화면에 보이던 값을 돌려줍니다 */
function freeze(el: HTMLElement) {
  const { opacity, transform } = getComputedStyle(el)
  for (const a of el.getAnimations()) a.cancel()
  return { opacity, transform }
}

export function Modal({ open, onClose, title, meta, children }: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  const scrimRef = useRef<HTMLDivElement>(null)
  // 모달을 연 요소로 포커스를 되돌리기 위해 기억해둡니다
  const openerRef = useRef<HTMLElement | null>(null)

  // 닫히는 애니메이션 동안에도 그려 두어야 하므로, open과 별개로 "화면에 있음"을 둡니다
  const [shown, setShown] = useState(open)
  if (open && !shown) setShown(true)

  // 부모는 닫는 순간 내용을 비우므로, 닫히는 동안에는 마지막 내용을 그대로 보여줍니다
  const contentRef = useRef({ title, meta, children })
  if (open) contentRef.current = { title, meta, children }

  // 시트 위치(px, 0 = 다 올라온 상태)와 진행 중인 스프링
  const sheet = useRef({ isSheet: false, y: 0, height: 0, velocity: 0, stop: () => {} })

  // 모달이 열리기 직전의 포커스를 기록합니다.
  // effect 안에서 읽으면 이미 포커스가 옮겨간 뒤라 놓칠 수 있어,
  // 렌더 중(열림 상태로 바뀌는 그 순간)에 붙잡습니다.
  if (open && openerRef.current === null) {
    openerRef.current = document.activeElement as HTMLElement | null
  }

  const setSheetY = (y: number) => {
    const s = sheet.current
    s.y = y
    if (panelRef.current) panelRef.current.style.transform = `translateY(${y}px)`
    // 배경 딤은 시트가 올라온 만큼만 — 끌어내리면 같이 옅어집니다
    if (scrimRef.current) {
      scrimRef.current.style.opacity = String(Math.min(1, Math.max(0, 1 - y / s.height)))
    }
  }

  // 들어오기: 시트는 아래에서, 창은 누른 버튼 쪽에서 커지며 나타납니다
  useLayoutEffect(() => {
    const panel = panelRef.current
    const scrim = scrimRef.current
    if (!open || !panel || !scrim) return
    const s = sheet.current
    s.stop()
    s.velocity = 0
    s.isSheet = window.matchMedia(SHEET_QUERY).matches

    if (prefersReducedMotion()) {
      panel.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 150, easing: 'ease-out' })
      scrim.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 150, easing: 'ease-out' })
      return
    }

    if (s.isSheet) {
      s.height = panel.offsetHeight
      // 닫히던 중이었다면 지금 위치에서 이어 올라옵니다
      const from = panel.style.transform ? s.y : s.height
      setSheetY(from)
      s.stop = animateSpring({ from, to: 0, response: 0.4, onUpdate: setSheetY })
      return
    }

    // 닫히던 중에 다시 열면 그 자리에서 되돌아옵니다
    if (panel.getAnimations().length > 0) {
      panel.animate([freeze(panel), { opacity: 1, transform: 'none' }], {
        duration: 240,
        easing: EASE_IN,
      })
      scrim.animate([freeze(scrim), { opacity: 1 }], { duration: 200, easing: 'ease-out' })
      return
    }

    const opener = openerRef.current?.getBoundingClientRect()
    const rect = panel.getBoundingClientRect()
    if (opener && opener.width > 0) {
      const x = opener.left + opener.width / 2 - rect.left
      const y = opener.top + opener.height / 2 - rect.top
      panel.style.transformOrigin = `${x}px ${y}px`
    }
    panel.animate(
      [
        { opacity: 0, transform: 'scale(0.92)' },
        { opacity: 1, transform: 'none' },
      ],
      { duration: 320, easing: EASE_IN },
    )
    scrim.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 240, easing: 'ease-out' })
  }, [open])

  // 나가기: 들어온 길을 되짚어 나갑니다. 지금 화면에 보이는 값에서 출발하므로
  // 열리는 도중에 닫아도 튀지 않습니다.
  useEffect(() => {
    const panel = panelRef.current
    const scrim = scrimRef.current
    if (open || !shown || !panel || !scrim) return
    const s = sheet.current
    const finish = () => setShown(false)

    if (!prefersReducedMotion() && s.isSheet) {
      s.stop()
      s.stop = animateSpring({
        from: s.y,
        to: s.height,
        velocity: s.velocity,
        response: 0.3,
        onUpdate: setSheetY,
        onDone: finish,
      })
      return () => s.stop()
    }

    const reduced = prefersReducedMotion()
    const anim = panel.animate(
      [freeze(panel), { opacity: 0, transform: reduced ? 'none' : 'scale(0.92)' }],
      { duration: reduced ? 150 : 200, easing: reduced ? 'ease-in' : EASE_OUT, fill: 'forwards' },
    )
    scrim.animate([freeze(scrim), { opacity: 0 }], {
      duration: 200,
      easing: 'ease-in',
      fill: 'forwards',
    })
    anim.onfinish = finish
    return () => {
      anim.onfinish = null
    }
  }, [open, shown])

  useEffect(() => () => sheet.current.stop(), [])

  // ── 시트 끌어내려 닫기 (머리 부분을 잡고) ──
  const drag = useRef<{ id: number; offset: number; active: boolean; startY: number; samples: { y: number; t: number }[] } | null>(null)

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    const s = sheet.current
    if (!s.isSheet || !open || e.button !== 0) return
    s.stop() // 움직이는 중이어도 바로 잡을 수 있습니다
    drag.current = {
      id: e.pointerId,
      offset: e.clientY - s.y, // 잡은 지점을 기준으로 따라옵니다
      active: false,
      startY: e.clientY,
      samples: [{ y: s.y, t: e.timeStamp }],
    }
  }

  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const d = drag.current
    if (!d || d.id !== e.pointerId) return
    // 살짝 흔들린 탭(닫기 버튼 누르기)은 드래그로 치지 않습니다
    if (!d.active) {
      if (Math.abs(e.clientY - d.startY) < 8) return
      d.active = true
      e.currentTarget.setPointerCapture(e.pointerId)
    }
    const raw = e.clientY - d.offset
    // 위로는 더 올라갈 곳이 없으니 저항을 줍니다
    const y = raw < 0 ? -rubberband(-raw, sheet.current.height) : raw
    setSheetY(y)
    d.samples.push({ y, t: e.timeStamp })
    if (d.samples.length > 5) d.samples.shift()
  }

  const onPointerUp = (e: ReactPointerEvent<HTMLDivElement>) => {
    const d = drag.current
    drag.current = null
    if (!d || d.id !== e.pointerId || !d.active) return
    const s = sheet.current
    const first = d.samples[0]
    const last = d.samples[d.samples.length - 1]
    const dt = (last.t - first.t) / 1000
    const velocity = dt > 0 ? (last.y - first.y) / dt : 0
    // 놓은 자리가 아니라 관성으로 갈 자리로 판단합니다
    if (s.y + projectMomentum(velocity) > s.height / 2) {
      s.velocity = velocity
      onClose()
    } else {
      s.stop = animateSpring({ from: s.y, to: 0, velocity, response: 0.35, onUpdate: setSheetY })
    }
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

  if (!shown) return null
  const content = contentRef.current

  return (
    <div
      className="fixed inset-0 z-100 flex items-end justify-center sm:items-center"
      role="presentation"
    >
      {/* 배경 딤 — 클릭하면 닫힘 */}
      <div
        ref={scrimRef}
        className="modal-scrim absolute inset-0 bg-neutral-900/40 backdrop-blur-sm dark:bg-black/60"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        tabIndex={-1}
        className="relative max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-t-2xl bg-white shadow-2xl outline-none will-change-transform sm:rounded-2xl dark:bg-neutral-900"
      >
        {/* 머리 부분: 시트에서는 잡고 끌어내려 닫을 수 있습니다 */}
        <div
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          className="sticky top-0 z-10 flex touch-none items-start justify-between gap-4 border-b border-neutral-200 bg-white/95 px-6 pt-5 pb-4 backdrop-blur sm:touch-auto sm:pt-4 dark:border-neutral-800 dark:bg-neutral-900/95"
        >
          {/* 끌 수 있다는 표시 (시트에서만) */}
          <span
            className="absolute top-2 left-1/2 h-1 w-9 -translate-x-1/2 rounded-full bg-neutral-300 sm:hidden dark:bg-neutral-700"
            aria-hidden="true"
          />
          <div>
            <h3
              id="modal-title"
              className="text-lg font-semibold text-neutral-900 dark:text-neutral-50"
            >
              {content.title}
            </h3>
            {content.meta && (
              <p className="mt-0.5 font-mono text-xs text-neutral-500 dark:text-neutral-400">
                {content.meta}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="press -mr-2 shrink-0 rounded-md p-2 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-900 dark:hover:bg-neutral-800 dark:hover:text-neutral-100"
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

        <div className="px-6 py-5">{content.children}</div>
      </div>
    </div>
  )
}
