import { useEffect, useState } from 'react'
import { useTheme } from '../hooks/useTheme'
import { useActiveSection } from '../hooks/useActiveSection'
import { openSource, profile } from '../data/profile'

// 메뉴는 다섯 개만. About·Skills·More는 스크롤로 자연스럽게 지나갑니다.
const NAV = [
  { id: 'experience', label: '경력' },
  { id: 'opensource', label: '오픈소스' },
  { id: 'projects', label: '프로젝트' },
  { id: 'writing', label: '글' },
  { id: 'contact', label: '연락' },
].filter(
  // 내용이 비어 섹션이 그려지지 않으면 메뉴에서도 뺍니다
  (n) => n.id !== 'opensource' || openSource.length > 0,
)

const NAV_IDS = NAV.map((n) => n.id)

export function Header() {
  const { theme, toggle } = useTheme()
  const active = useActiveSection(NAV_IDS)
  const [menuOpen, setMenuOpen] = useState(false)

  // 모바일 메뉴가 열려 있을 때 Esc로 닫기
  useEffect(() => {
    if (!menuOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [menuOpen])

  const linkClass = (id: string) =>
    [
      'transition-colors',
      active === id
        ? 'text-ink underline decoration-2 underline-offset-8'
        : 'text-muted hover:text-ink',
    ].join(' ')

  return (
    <header id="site-header" className="sticky top-0 z-50 bg-ground">
      <div className="flex h-16 w-full items-center justify-between px-6 sm:px-12 lg:px-[calc(0.75rem+3rem)]">
        <a href="#top" className="text-body font-semibold text-ink transition-opacity hover:opacity-70">
          {profile.name}
        </a>

        <nav aria-label="주요 섹션" className="hidden items-center gap-7 text-small md:flex">
          {NAV.map((item) => (
            <a key={item.id} href={`#${item.id}`} className={linkClass(item.id)}>
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center">
          <button
            type="button"
            onClick={toggle}
            aria-label={theme === 'dark' ? '라이트 모드로 전환' : '다크 모드로 전환'}
            className="grid size-11 place-items-center text-muted transition-colors hover:bg-surface hover:text-ink"
          >
            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
          </button>

          {/* 모바일 전용 메뉴 버튼 */}
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? '메뉴 닫기' : '메뉴 열기'}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            className="grid size-11 place-items-center text-muted transition-colors hover:bg-surface hover:text-ink md:hidden"
          >
            {menuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {/* 모바일 드롭다운: 선 대신 한 단계 밝은 면으로 구분 */}
      {menuOpen && (
        <nav id="mobile-nav" aria-label="주요 섹션" className="bg-surface px-6 py-2 md:hidden">
          {NAV.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={() => setMenuOpen(false)}
              className={`flex min-h-11 items-center text-body ${active === item.id ? 'font-semibold text-ink' : 'text-muted hover:text-ink'}`}
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
