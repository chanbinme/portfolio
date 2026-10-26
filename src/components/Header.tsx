import { useEffect, useState } from 'react'
import { useTheme } from '../hooks/useTheme'
import { openSource, posts, profile } from '../data/profile'

const NAV = [
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'opensource', label: 'Open Source' },
  { id: 'writing', label: 'Writing' },
  { id: 'more', label: 'More' },
  { id: 'contact', label: 'Contact' },
].filter(
  // 내용이 비어 섹션이 그려지지 않으면 메뉴에서도 뺍니다
  (n) =>
    (n.id !== 'opensource' || openSource.length > 0) &&
    (n.id !== 'writing' || posts.length > 0),
)

export function Header() {
  const { theme, toggle } = useTheme()
  const [active, setActive] = useState<string>('')
  const [menuOpen, setMenuOpen] = useState(false)
  // 내용이 헤더 밑으로 지나갈 때만 경계를 그립니다 (맨 위에서는 경계선 없이)
  const [scrolled, setScrolled] = useState(false)

  // 현재 보고 있는 섹션을 내비게이션에 표시.
  // 화면 위에서 20% 지점을 지나간 마지막 섹션이 현재 섹션입니다.
  // 단, 맨 아래에 닿으면 마지막 섹션(Contact)으로 칩니다. 마지막 섹션은
  // 짧아서 끝까지 스크롤해도 20% 지점까지 올라오지 못하기 때문입니다.
  // 첫 섹션보다 위(첫 화면)에서는 아무것도 강조하지 않습니다.
  useEffect(() => {
    const sections = NAV.map((n) => document.getElementById(n.id)).filter(
      (el): el is HTMLElement => el !== null,
    )

    let frame = 0
    const update = () => {
      frame = 0
      const { innerHeight, scrollY } = window
      setScrolled(scrollY > 4)
      const atBottom =
        scrollY > 0 &&
        Math.ceil(scrollY + innerHeight) >= document.documentElement.scrollHeight - 2
      if (atBottom) {
        setActive(sections.at(-1)?.id ?? '')
        return
      }
      const line = innerHeight * 0.2
      const current = sections.filter((el) => el.getBoundingClientRect().top <= line).at(-1)
      setActive(current?.id ?? '')
    }
    // 스크롤마다 레이아웃을 읽지 않도록 프레임당 한 번만 계산합니다
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    return () => {
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      cancelAnimationFrame(frame)
    }
  }, [])

  // 모바일 메뉴가 열려 있을 때 Esc로 닫기
  useEffect(() => {
    if (!menuOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [menuOpen])

  return (
    <header
      className={[
        'material sticky top-0 z-50 border-b backdrop-blur-xl backdrop-saturate-150 transition-[border-color,box-shadow,background-color] duration-300 [--material-solid:var(--color-white)] dark:[--material-solid:var(--color-neutral-950)]',
        // 메뉴가 펼쳐져 면이 커지면 더 두꺼운 재질로 — 아래 글자가 비쳐 읽기 어렵지 않게
        menuOpen ? 'bg-white/95 dark:bg-neutral-950/95' : 'bg-white/70 dark:bg-neutral-950/70',
        scrolled || menuOpen
          ? 'border-neutral-200/70 shadow-[0_1px_12px_-6px_rgb(0_0_0/0.12)] dark:border-neutral-800/70'
          : 'border-transparent',
      ].join(' ')}
    >
      <div className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between px-6">
        <a
          href="#top"
          className="press font-mono text-sm font-medium text-neutral-900 hover:opacity-60 dark:text-neutral-100"
        >
          {profile.name}
        </a>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={[
                'press rounded-md px-2.5 py-1.5 text-sm',
                active === item.id
                  ? 'text-accent dark:text-accent-dark'
                  : 'text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100',
              ].join(' ')}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={toggle}
            aria-label={theme === 'dark' ? '라이트 모드로 전환' : '다크 모드로 전환'}
            className="press rounded-md p-2 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-100"
          >
            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
          </button>

          {/* 모바일 전용 메뉴 버튼 */}
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="메뉴 열기"
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            className="press rounded-md p-2 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 md:hidden dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-100"
          >
            {menuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {/* 모바일 드롭다운 */}
      {menuOpen && (
        <nav
          id="mobile-nav"
          className="menu-in border-t border-neutral-200/70 px-6 py-2 md:hidden dark:border-neutral-800/70"
        >
          {NAV.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={() => setMenuOpen(false)}
              className={[
                'press block rounded-md px-2 py-2.5 text-sm',
                active === item.id
                  ? 'text-accent dark:text-accent-dark'
                  : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100',
              ].join(' ')}
            >
              {item.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  )
}

function SunIcon() {
  return (
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
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4" />
    </svg>
  )
}

function MoonIcon() {
  return (
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
      <path d="M21 12.8A9 9 0 1111.2 3a7 7 0 009.8 9.8z" />
    </svg>
  )
}

function MenuIcon() {
  return (
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
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  )
}

function CloseIcon() {
  return (
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
  )
}
