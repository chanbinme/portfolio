import { profile, socials } from '../data/profile'

export function Hero() {
  const links = socials.filter((s) => s.href)

  return (
    <section
      id="top"
      className="mx-auto w-full max-w-3xl px-6 pt-20 pb-16 sm:pt-28 sm:pb-20"
    >
      <p className="font-mono text-sm text-accent dark:text-accent-dark">
        {profile.role}
      </p>

      <h1 className="mt-4 text-4xl font-semibold tracking-tight text-neutral-900 sm:text-5xl dark:text-neutral-50">
        {profile.name}
      </h1>

      <p className="mt-5 text-lg leading-relaxed text-neutral-600 dark:text-neutral-300">
        {profile.tagline}
      </p>

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <a
          href="#contact"
          className="rounded-lg bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-neutral-700 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-300"
        >
          연락하기
        </a>

        {profile.resumeUrl && (
          <a
            href={profile.resumeUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="rounded-lg border border-neutral-300 px-4 py-2.5 text-sm font-medium text-neutral-700 transition-colors hover:border-neutral-400 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:border-neutral-600 dark:hover:bg-neutral-900"
          >
            이력서
          </a>
        )}

        {links.length > 0 && (
          <div className="flex items-center gap-4 sm:ml-2">
            {links.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer noopener"
                className="text-sm text-neutral-500 underline decoration-neutral-300 underline-offset-4 transition-colors hover:text-neutral-900 dark:text-neutral-400 dark:decoration-neutral-700 dark:hover:text-neutral-100"
              >
                {s.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
