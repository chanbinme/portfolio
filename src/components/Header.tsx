import { useEffect, useState } from 'react'
import { useTheme } from '../hooks/useTheme'
import { useActiveSection } from '../hooks/useActiveSection'
import { openSource, profile } from '../data/profile'

const NAV = [
  { id: 'about', label: '소개' },
  { id: 'experience', label: '경력' },
  { id: 'projects', label: '프로젝트' },
  { id: 'opensource', label: '오픈소스' },
  { id: 'skills', label: '기술' },
  { id: 'writing', label: '글' },
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

  const iconButton =
    'grid size-10 cursor-pointer place-items-center rounded-lg text-muted transition-colors hover:bg-chip hover:text-fg'

  return (
    <header id="site-header" className="sticky top-0 z-50 border-b border-line bg-bg/95 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <a href="#top" className="shrink-0 font-bold text-fg">
          {profile.name}
        </a>

        <nav aria-label="주요 섹션" className="hidden items-center gap-1 lg:flex">
          {NAV.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              aria-current={active === item.id ? 'true' : undefined}
              className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                active === item.id ? 'bg-chip text-fg' : 'text-muted hover:text-fg'
              }`}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={toggle}
            aria-label={theme === 'dark' ? '라이트 모드로 전환' : '다크 모드로 전환'}
            className={iconButton}
          >
            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
          </button>
          {/* 채용 담당자가 어디서든 바로 쓰는 두 동작 */}
          <button type="button" onClick={() => window.print()} className="btn btn-outline hidden sm:inline-flex">
            PDF 저장
          </button>
          <a href="#contact" className="btn btn-primary hidden sm:inline-flex">
            연락하기
          </a>

          {/* 모바일·태블릿 메뉴 버튼 */}
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? '메뉴 닫기' : '메뉴 열기'}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            className={`${iconButton} lg:hidden`}
          >
            {menuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav id="mobile-nav" aria-label="주요 섹션" className="border-t border-line bg-bg lg:hidden">
          <div className="container-page grid gap-1 py-3">
            {NAV.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={() => setMenuOpen(false)}
                className={`flex min-h-11 items-center rounded-md px-3 text-[0.9375rem] font-medium ${
                  active === item.id ? 'bg-chip text-fg' : 'text-muted hover:text-fg'
                }`}
              >
                {item.label}
              </a>
            ))}
            <div className="mt-2 grid grid-cols-2 gap-2 sm:hidden">
              <button type="button" onClick={() => window.print()} className="btn btn-outline">
                PDF 저장
              </button>
              <a href="#contact" onClick={() => setMenuOpen(false)} className="btn btn-primary">
                연락하기
              </a>
            </div>
          </div>
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
