import { profile } from '../data/profile'
import { Section } from './Section'

export function About() {
  return (
    <Section id="about" title="About">
      <div className="space-y-4 leading-relaxed text-neutral-600 dark:text-neutral-300">
        {profile.intro.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>

      <dl className="mt-8 grid gap-4 text-sm sm:grid-cols-2">
        <div>
          <dt className="font-mono text-xs text-neutral-400 dark:text-neutral-500">
            Location
          </dt>
          <dd className="mt-1 text-neutral-700 dark:text-neutral-300">
            {profile.location}
          </dd>
        </div>
        <div>
          <dt className="font-mono text-xs text-neutral-400 dark:text-neutral-500">
            Email
          </dt>
          <dd className="mt-1">
            <a href={`mailto:${profile.email}`} className="link">
              {profile.email}
            </a>
          </dd>
        </div>
      </dl>
    </Section>
  )
}
