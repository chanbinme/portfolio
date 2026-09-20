import { profile, socials } from '../data/profile'
import { Section } from './Section'

export function Contact() {
  const links = socials.filter((s) => s.href)

  return (
    <Section id="contact" title="Contact">
      <p className="leading-relaxed text-neutral-600 dark:text-neutral-300">
        새로운 기회나 협업 제안은 언제든 환영합니다. 메일로 연락 주세요.
      </p>

      <a
        href={`mailto:${profile.email}`}
        className="mt-6 inline-block font-mono text-lg text-accent transition-opacity hover:opacity-70 dark:text-accent-dark"
      >
        {profile.email}
      </a>

      {links.length > 0 && (
        <div className="mt-8 flex flex-wrap gap-4 text-sm">
          {links.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noreferrer noopener"
              className="text-neutral-500 underline decoration-neutral-300 underline-offset-4 transition-colors hover:text-neutral-900 dark:text-neutral-400 dark:decoration-neutral-700 dark:hover:text-neutral-100"
            >
              {s.label}
            </a>
          ))}
        </div>
      )}
    </Section>
  )
}
