import { profile, socials } from '../data/profile'
import { Stripe } from './Stripe'

/** 마무리: 위에 얇은 줄무늬, 아래에 이름을 크게 */
export function Footer() {
  const links = socials.filter((s) => s.href)
  return (
    <footer id="site-footer" className="mt-3">
      <Stripe height="h-2" />
      <div className="px-6 pt-10 pb-8 sm:px-12 lg:px-[calc(0.75rem+3rem)]">
        <div className="flex flex-wrap justify-between gap-x-8 gap-y-3 text-body">
          <nav aria-label="외부 링크" className="flex flex-wrap gap-x-7">
            {links.map((s, i) => (
              <a key={`${i}-${s.label}`} href={s.href} target="_blank" rel="noreferrer noopener" className="link inline-flex min-h-11 items-center">
                {s.label}
              </a>
            ))}
            {profile.resumeUrl && (
              <a href={profile.resumeUrl} target="_blank" rel="noreferrer noopener" className="link inline-flex min-h-11 items-center">
                이력서
              </a>
            )}
          </nav>
          <a href={`mailto:${profile.email}`} className="link inline-flex min-h-11 items-center">
            {profile.email}
          </a>
        </div>

        <p className="mt-20 text-display font-semibold tracking-[-0.04em] text-ink" aria-hidden="true">
          {profile.name}
        </p>
        <p className="mt-6 text-small text-muted">
          © {new Date().getFullYear()} {profile.name}
        </p>
      </div>
    </footer>
  )
}
