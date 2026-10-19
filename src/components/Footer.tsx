import { profile } from '../data/profile'

/** 빌드한 날짜 (vite.config.ts의 define). 내용이 최신인지 알 수 있게 보여줍니다 */
const updated = __BUILD_DATE__

export function Footer() {
  return (
    <footer id="site-footer" className="border-t border-line">
      <div className="container-page flex flex-wrap items-center justify-between gap-2 py-8 text-sm text-muted">
        <p>
          © {new Date().getFullYear()} {profile.name}
        </p>
        <p className="num">최종 업데이트 {updated}</p>
      </div>
    </footer>
  )
}
